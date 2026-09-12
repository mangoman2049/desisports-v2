import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateQualityGate } from "@/lib/quality-gate";
import { getSampleScorecardExtraction, extractScorecardWithLiteLLM } from "@/lib/extractor-service";
import { checkForDuplicateScorecard } from "@/lib/duplicate-detector";
import { resolveAllScorecardPlayers } from "@/lib/name-resolver";
import { generateAndSaveMatchAnalysis } from "@/lib/match-analyzer";
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
    const matchTitle = (formData.get("matchTitle") as string) || undefined;

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

    // Extract scorecard using LiteLLM Vision or fallback deterministic engine
    const parsed = base64Image
      ? await extractScorecardWithLiteLLM(base64Image)
      : getSampleScorecardExtraction();

    if (matchTitle) {
      parsed.matchInfo.title = matchTitle;
    }

    // Reconcile player names across both teams (8 home, 8 away, bowlers)
    const { scorecard: reconciledScorecard, resolutions, matchedCount, unreconciledCount } =
      await resolveAllScorecardPlayers(parsed);

    const homeScore = reconciledScorecard.homeInnings.totalRuns || 0;
    const awayScore = reconciledScorecard.awayInnings.totalRuns || 0;

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
        filename: file ? file.name : "sample_spawtz_scorecard.jpg",
        imageUrl,
        status: "PENDING_REVIEW",
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

    // Generate comprehensive, auditable JSON file for API/export
    const auditableData = {
      auditMetadata: {
        uploadId: upload.id,
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
        winner: homeScore > awayScore ? reconciledScorecard.homeInnings.teamName : reconciledScorecard.awayInnings.teamName,
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
