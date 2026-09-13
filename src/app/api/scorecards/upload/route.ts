import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateQualityGate } from "@/lib/quality-gate";
import { getSampleScorecardExtraction, extractScorecardWithLiteLLM } from "@/lib/extractor-service";
import { checkForDuplicateScorecard } from "@/lib/duplicate-detector";
import { resolveAllScorecardPlayers } from "@/lib/name-resolver";
import { generateAndSaveMatchAnalysis } from "@/lib/match-analyzer";
import { commitScorecardAsApprovedMatch } from "@/lib/match-committer";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { preprocessScorecardImage } from "@/lib/image-preprocessor";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const forceSample = formData.get("forceSample") === "true";
    const forceDuplicate = formData.get("forceDuplicate") === "true";
    const forceMismatch = formData.get("forceMismatch") === "true";
    const autoApprove = formData.get("autoApprove") === "true";
    const matchTitle = (formData.get("matchTitle") as string) || undefined;
    const tournamentIdRaw = formData.get("tournamentId") as string | null;
    const tournamentId = tournamentIdRaw ? parseInt(tournamentIdRaw, 10) : 0;
    const expectedHomeTeam = (formData.get("expectedHomeTeam") as string) || undefined;
    const expectedAwayTeam = (formData.get("expectedAwayTeam") as string) || undefined;

    let imageUrl = "/uploads/scorecards/sample-scorecard.jpg";
    let width = 1600;
    let height = 2844;
    let base64Image = "";
    const uploadId = `sc-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "scorecards");
    await fs.mkdir(uploadDir, { recursive: true });

    if (file && !forceSample) {
      const bytes = await file.arrayBuffer();
      const rawBuffer = Buffer.from(bytes);

      // Optimize image with Sharp: Max 1800px, WebP Q75
      const image = sharp(rawBuffer);
      const meta = await image.metadata();
      width = meta.width || 1600;
      height = meta.height || 2844;

      const preprocessResult = await preprocessScorecardImage(rawBuffer);
      width = preprocessResult.width;
      height = preprocessResult.height;
      base64Image = preprocessResult.buffer.toString("base64");

      // Save optimized WebP file
      const filename = `${uploadId}.webp`;
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, preprocessResult.buffer);
      imageUrl = `/uploads/scorecards/${filename}`;
    }

    // Run quality diagnostics
    const diagnostics = evaluateQualityGate(width, height);

    // Extract scorecard using Vision LLM or fallback deterministic engine
    const parsed = base64Image
      ? await extractScorecardWithLiteLLM(base64Image, {
          forceSample,
          matchTitle,
          tournamentId,
        })
      : getSampleScorecardExtraction();

    if (matchTitle) {
      parsed.matchInfo.title = matchTitle;
    }
    if (tournamentId !== undefined) {
      parsed.matchInfo.tournamentId = tournamentId;
    }

    // If generic "Home Team" / "Away Team" and expected teams are selected from fixture, adopt fixture teams
    if (
      expectedHomeTeam &&
      expectedAwayTeam &&
      (reconciledScorecardMatchesGeneric(parsed.homeInnings?.teamName) ||
        reconciledScorecardMatchesGeneric(parsed.awayInnings?.teamName) ||
        forceMismatch)
    ) {
      parsed.homeInnings.teamName = expectedHomeTeam;
      parsed.awayInnings.teamName = expectedAwayTeam;
    }

    // Reconcile player names across both teams (8 home, 8 away, bowlers)
    // If a new player has no DB match, it DOES NOT FAIL: it takes the name as it is!
    const { scorecard: reconciledScorecard, resolutions, matchedCount, unreconciledCount } =
      await resolveAllScorecardPlayers(parsed);

    // Ensure team names adopt selected fixture if still generic
    if (
      expectedHomeTeam &&
      expectedAwayTeam &&
      (reconciledScorecardMatchesGeneric(reconciledScorecard.homeInnings?.teamName) ||
        reconciledScorecardMatchesGeneric(reconciledScorecard.awayInnings?.teamName) ||
        forceMismatch)
    ) {
      reconciledScorecard.homeInnings.teamName = expectedHomeTeam;
      reconciledScorecard.awayInnings.teamName = expectedAwayTeam;
    }

    const homeScore = reconciledScorecard.homeInnings.totalRuns || 0;
    const awayScore = reconciledScorecard.awayInnings.totalRuns || 0;

    // STRICT FIXTURE MISMATCH VALIDATION (Bypassed if user opted to override via forceMismatch)
    if (!forceMismatch && expectedHomeTeam && expectedAwayTeam) {
      const { validateFixtureTeamsMatch } = await import("@/lib/tournament-fixtures");
      const matchValidation = validateFixtureTeamsMatch(
        { team1: expectedHomeTeam, team2: expectedAwayTeam },
        reconciledScorecard.homeInnings.teamName,
        reconciledScorecard.awayInnings.teamName
      );

      if (!matchValidation.isMatch) {
        return NextResponse.json(
          {
            success: false,
            isMismatch: true,
            message: matchValidation.reason,
            extractedTeams: {
              home: reconciledScorecard.homeInnings.teamName,
              away: reconciledScorecard.awayInnings.teamName,
            },
            expectedTeams: {
              home: expectedHomeTeam,
              away: expectedAwayTeam,
            },
          },
          { status: 422 } // 422 Unprocessable Entity
        );
      }
    }

    // DUPLICATE SCORECARD CHECK - Matching Date/Time and 100% confidence Final Scores
    if (!forceDuplicate) {
      const duplicateCheck = await checkForDuplicateScorecard(
        reconciledScorecard.matchInfo.dateTime,
        reconciledScorecard.homeInnings.teamName,
        reconciledScorecard.awayInnings.teamName,
        homeScore,
        awayScore
      );

      if (duplicateCheck.isDuplicate) {
        return NextResponse.json(
          {
            success: false,
            isDuplicate: true,
            duplicateInfo: duplicateCheck,
            message: duplicateCheck.reason,
          },
          { status: 409 } // 409 Conflict
        );
      }
    }

    // Create ScorecardUpload record in database
    const upload = await prisma.scorecardUpload.create({
      data: {
        id: uploadId,
        filename: file ? file.name : "sample_spawtz_scorecard.jpg",
        imageUrl,
        status: autoApprove ? "APPROVED" : "PENDING_REVIEW",
        qualityScore: diagnostics.score,
        qualityDiagnostics: JSON.stringify(diagnostics),
        rawExtraction: JSON.stringify(parsed),
        reconciledData: JSON.stringify(reconciledScorecard),
        validationScore: reconciledScorecard.validation.confidenceScore,
      },
    });

    // Run Match Tactical Analysis once immediately upon upload and save to DB
    const tacticalAnalysis = await generateAndSaveMatchAnalysis({
      uploadId: upload.id,
      parsedScorecard: reconciledScorecard,
    });

    // If autoApprove requested: commit the match and its 16 player stats immediately!
    let committedMatchId: number | null = null;
    if (autoApprove) {
      const commitResult = await commitScorecardAsApprovedMatch({
        uploadId: upload.id,
        parsedScorecard: reconciledScorecard,
        reviewerNotes: "Auto-approved from scorecard intake",
        tacticalAnalysisJson: JSON.stringify(tacticalAnalysis),
      });
      committedMatchId = commitResult.matchId;
    }

    // Generate comprehensive, auditable JSON file for API/export
    const auditableData = {
      auditMetadata: {
        uploadId: upload.id,
        matchId: committedMatchId,
        createdAt: new Date().toISOString(),
        originalFilename: file ? file.name : "sample_spawtz_scorecard.jpg",
        optimizedImageUrl: imageUrl,
        imageDimensions: { width, height },
        qualityScore: diagnostics.score,
        validationScore: reconciledScorecard.validation.confidenceScore,
        format: "Spawtz 16-Over Indoor Cricket Standard",
      },
      matchInfo: reconciledScorecard.matchInfo,
      result: {
        winner:
          homeScore > awayScore
            ? reconciledScorecard.homeInnings.teamName
            : reconciledScorecard.awayInnings.teamName,
        homeTeam: reconciledScorecard.homeInnings.teamName,
        homeScore,
        awayTeam: reconciledScorecard.awayInnings.teamName,
        awayScore,
        margin: Math.abs(homeScore - awayScore),
      },
      nameResolutions: resolutions,
      homeInnings: reconciledScorecard.homeInnings,
      awayInnings: reconciledScorecard.awayInnings,
      diagnostics,
      tacticalAnalysisSummary: tacticalAnalysis.editorHeadline,
    };

    const auditableJsonPath = path.join(uploadDir, `${upload.id}.json`);
    await fs.writeFile(auditableJsonPath, JSON.stringify(auditableData, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      uploadId: upload.id,
      matchId: committedMatchId,
      imageUrl,
      auditableJsonUrl: `/api/scorecards/${upload.id}/json`,
      diagnostics,
      parsedScorecard: reconciledScorecard,
      resolutions,
      nameResolutionSummary: {
        matchedCount,
        unreconciledCount,
        total: matchedCount + unreconciledCount,
      },
      tacticalAnalysis,
    });
  } catch (err: any) {
    console.error("Scorecard upload error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process scorecard upload" },
      { status: 500 }
    );
  }
}

function reconciledScorecardMatchesGeneric(name?: string): boolean {
  if (!name) return true;
  const n = name.trim().toLowerCase();
  return n === "home team" || n === "away team" || n === "team 1" || n === "team 2" || n === "home" || n === "away";
}
