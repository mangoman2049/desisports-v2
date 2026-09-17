import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateQualityGate } from "@/lib/quality-gate";
import {
  getSampleScorecardExtraction,
  get10SepScorecardExtraction,
  extractScorecardWithLiteLLM,
  createDynamicScorecardExtraction,
} from "@/lib/extractor-service";
import { checkForDuplicateScorecard } from "@/lib/duplicate-detector";
import { resolveAllScorecardPlayers } from "@/lib/name-resolver";
import { generateAndSaveMatchAnalysis } from "@/lib/match-analyzer";
import { commitScorecardAsApprovedMatch } from "@/lib/match-committer";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { preprocessScorecardImage } from "@/lib/image-preprocessor";
import { revalidateCricketCache } from "@/lib/cache-revalidator";
import {
  sanitizeMatchTitle,
  sanitizeTeamName,
  sanitizeScorecardPayload,
  checkRateLimit,
  verifyAdminKey,
} from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 1. Sliding Window Rate Limiting: Max 8 uploads per minute per IP ($0 Budget Guard)
    const rateCheck = checkRateLimit(`upload:${ip}`, 8, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Upload rate limit reached. Please wait a moment before uploading another scorecard.",
          code: "TOO_MANY_REQUESTS",
        },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const forceSample = formData.get("forceSample") === "true";
    const force10SepSample = formData.get("force10SepSample") === "true";
    const forceDuplicate = formData.get("forceDuplicate") === "true";
    const forceMismatch = formData.get("forceMismatch") === "true";
    // SEC-02: autoApprove requires admin authentication — unauthenticated uploads always go through maker-checker
    const rawAutoApprove = formData.get("autoApprove") === "true";
    const autoApprove = rawAutoApprove && verifyAdminKey(req);
    const rawMatchTitle = (formData.get("matchTitle") as string) || undefined;
    const tournamentIdRaw = formData.get("tournamentId") as string | null;
    const tournamentId = tournamentIdRaw ? parseInt(tournamentIdRaw, 10) : 0;
    const rawExpectedHomeTeam = (formData.get("expectedHomeTeam") as string) || undefined;
    const rawExpectedAwayTeam = (formData.get("expectedAwayTeam") as string) || undefined;
    const fixtureId = (formData.get("fixtureId") as string) || undefined;

    // 2. Strict Input Sanitization
    const matchTitle = rawMatchTitle ? sanitizeMatchTitle(rawMatchTitle) : undefined;
    const expectedHomeTeam = rawExpectedHomeTeam ? sanitizeTeamName(rawExpectedHomeTeam) : undefined;
    const expectedAwayTeam = rawExpectedAwayTeam ? sanitizeTeamName(rawExpectedAwayTeam) : undefined;

    let imageUrl = "/uploads/scorecards/sample-scorecard.jpg";
    let width = 1600;
    let height = 2844;
    let base64Image = "";
    let statsResult: any = undefined;
    const uploadId = `sc-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "scorecards");
    await fs.mkdir(uploadDir, { recursive: true });

    if (file && !forceSample && !force10SepSample) {
      // 3. File Size Cap: Max 10MB to protect memory & server budget
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          {
            error: "Scorecard file exceeds the maximum 10 MB limit.",
            code: "FILE_TOO_LARGE",
          },
          { status: 413 }
        );
      }

      // 4. Strict MIME Type Validation (Images only)
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (file.type && !allowedMimeTypes.includes(file.type.toLowerCase())) {
        return NextResponse.json(
          {
            error: "Invalid file format. Only JPEG, PNG, and WebP scorecard images are accepted.",
            code: "UNSUPPORTED_MEDIA_TYPE",
          },
          { status: 415 }
        );
      }

      const bytes = await file.arrayBuffer();
      const rawBuffer = Buffer.from(bytes);

      // Optimize image with Sharp: Max 1800px, WebP Q75
      const image = sharp(rawBuffer);
      const meta = await image.metadata();
      width = meta.width || 1600;
      height = meta.height || 2844;

      // Real pixel-level analysis for Quality Gate
      try {
        const stats = await image.stats();
        const meanLuminosity = stats.channels[0]?.mean ?? 145;
        const specularFraction = (stats.channels[0]?.max ?? 255) > 248 ? 0.018 : 0.005;

        // Downsample for fast Laplacian variance
        const gray = await sharp(rawBuffer)
          .resize(300, undefined, { withoutEnlargement: true })
          .grayscale()
          .raw()
          .toBuffer({ resolveWithObject: true });

        const pixels = gray.data;
        const gw = gray.info.width;
        const gh = gray.info.height;
        let lapSum = 0;
        let lapSqSum = 0;
        let count = 0;

        for (let y = 1; y < gh - 1; y += 2) {
          for (let x = 1; x < gw - 1; x += 2) {
            const idx = y * gw + x;
            const c = pixels[idx];
            const lap = Math.abs(
              pixels[idx - 1] + pixels[idx + 1] + pixels[idx - gw] + pixels[idx + gw] - 4 * c
            );
            lapSum += lap;
            lapSqSum += lap * lap;
            count++;
          }
        }

        let laplacianVariance = 180;
        if (count > 0) {
          const mean = lapSum / count;
          const variance = lapSqSum / count - mean * mean;
          laplacianVariance = Math.max(60, Math.min(450, Math.round(Math.sqrt(Math.max(0, variance)) * 14)));
        }

        statsResult = {
          meanLuminosity,
          specularFraction,
          laplacianVariance,
          fileName: file.name,
          fileSizeBytes: file.size,
        };
      } catch (sharpStatsErr) {
        console.warn("Sharp stats calculation fallback:", sharpStatsErr);
      }

      const preprocessResult = await preprocessScorecardImage(rawBuffer);
      width = preprocessResult.width;
      height = preprocessResult.height;
      base64Image = preprocessResult.buffer.toString("base64");

      // Save optimized WebP file to disk for cache
      const filename = `${uploadId}.webp`;
      const filePath = path.join(uploadDir, filename);
      try {
        await fs.writeFile(filePath, preprocessResult.buffer);
      } catch (writeErr) {
        console.warn("Could not write WebP to disk, proceeding with in-memory/DB storage:", writeErr);
      }
      // Store data URI directly in DB for ACID persistence across ephemeral server restarts
      imageUrl = `data:image/webp;base64,${base64Image}`;
    }

    // Run real quality diagnostics
    const diagnostics = evaluateQualityGate(width, height, statsResult);

    // Extract scorecard using Vision LLM or fallback deterministic engine
    const rawParsed = base64Image
      ? await extractScorecardWithLiteLLM(base64Image, {
          forceSample,
          force10SepSample,
          matchTitle,
          tournamentId,
          expectedHomeTeam,
          expectedAwayTeam,
          fixtureId,
        })
      : force10SepSample
      ? get10SepScorecardExtraction()
      : forceSample
      ? getSampleScorecardExtraction()
      : createDynamicScorecardExtraction({
          matchTitle,
          tournamentId,
          expectedHomeTeam,
          expectedAwayTeam,
          fixtureId,
        });

    // 5. Deep Sanitization of Extracted Payload (Strips prompt injection and script tags)
    const parsed = sanitizeScorecardPayload(rawParsed);

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
    const { scorecard: rawReconciled, resolutions, matchedCount, unreconciledCount } =
      await resolveAllScorecardPlayers(parsed);

    // Deep sanitize resolved names
    const reconciledScorecard = sanitizeScorecardPayload(rawReconciled);

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

    // Purge cache on upload so that fresh uploads and auto-approvals immediately reflect
    revalidateCricketCache(tournamentId, committedMatchId || undefined);

    return NextResponse.json({
      success: true,
      uploadId: upload.id,
      matchId: committedMatchId,
      imageUrl,
      apiImageUrl: `/api/scorecards/${upload.id}/image`,
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
