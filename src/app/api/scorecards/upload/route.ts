import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateQualityGate } from "@/lib/quality-gate";
import { getSampleScorecardExtraction, extractScorecardWithLiteLLM } from "@/lib/extractor-service";
import { checkForDuplicateScorecard } from "@/lib/duplicate-detector";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const forceSample = formData.get("forceSample") === "true";
    const forceDuplicate = formData.get("forceDuplicate") === "true";

    let imageUrl = "/uploads/scorecards/sample-scorecard.jpg";
    let width = 1600;
    let height = 2844;
    let base64Image = "";

    if (file && !forceSample) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      base64Image = buffer.toString("base64");

      // Save file locally in public/uploads/scorecards
      const filename = `upload-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads", "scorecards");
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
      imageUrl = `/uploads/scorecards/${filename}`;
    }

    // Run quality diagnostics
    const diagnostics = evaluateQualityGate(width, height);

    // Extract scorecard using LiteLLM Vision or fallback deterministic engine
    const parsed = base64Image
      ? await extractScorecardWithLiteLLM(base64Image)
      : getSampleScorecardExtraction();

    // DUPLICATE SCORECARD CHECK
    if (!forceDuplicate) {
      const duplicateCheck = await checkForDuplicateScorecard(
        parsed.matchInfo.dateTime,
        parsed.homeInnings.teamName,
        parsed.awayInnings.teamName
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
        reconciledData: JSON.stringify(parsed),
        validationScore: parsed.validation.confidenceScore,
      },
    });

    return NextResponse.json({
      success: true,
      uploadId: upload.id,
      imageUrl,
      diagnostics,
      parsedScorecard: parsed,
    });
  } catch (err: any) {
    console.error("Scorecard upload error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process scorecard upload" },
      { status: 500 }
    );
  }
}
