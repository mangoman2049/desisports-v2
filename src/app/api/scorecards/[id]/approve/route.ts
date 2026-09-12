import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ParsedScorecard } from "@/types/cricket";
import { validateIndoorCricketScorecard } from "@/lib/rules-engine";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const uploadId = params.id;
    const body = await req.json();
    const parsed: ParsedScorecard = body.parsedScorecard;
    const reviewerNotes = body.reviewerNotes || "Approved via Maker-Checker";

    // Re-run rules validation on final data
    const validation = validateIndoorCricketScorecard(parsed);

    // Save immutable revision
    await prisma.extractionRevision.create({
      data: {
        uploadId,
        reviewerId: "admin",
        diffJson: JSON.stringify({
          notes: reviewerNotes,
          timestamp: new Date().toISOString(),
        }),
        validationScore: validation.confidenceScore,
      },
    });

    // Update ScorecardUpload status
    await prisma.scorecardUpload.update({
      where: { id: uploadId },
      data: {
        status: "APPROVED",
        validationScore: validation.confidenceScore,
        reconciledData: JSON.stringify(parsed),
      },
    });

    // Ensure teams exist
    const homeTeam = await prisma.team.upsert({
      where: { name: parsed.homeInnings.teamName || "Home Team" },
      update: {},
      create: { name: parsed.homeInnings.teamName || "Home Team", code: "HOM" },
    });

    const awayTeam = await prisma.team.upsert({
      where: { name: parsed.awayInnings.teamName || "Away Team" },
      update: {},
      create: { name: parsed.awayInnings.teamName || "Away Team", code: "AWY" },
    });

    // Learn aliases for any names present in sheet
    const allNames = [
      ...parsed.homeInnings.playerSummaries.map((p) => p.name),
      ...parsed.awayInnings.playerSummaries.map((p) => p.name),
    ];

    for (const name of allNames) {
      const canonical = await prisma.player.findFirst({
        where: {
          OR: [
            { canonicalName: { equals: name } },
            { canonicalName: { contains: name } },
          ],
        },
      });

      if (canonical && canonical.canonicalName.toUpperCase() !== name.toUpperCase()) {
        await prisma.playerAlias.upsert({
          where: { alias: name.toUpperCase() },
          update: { status: "APPROVED" },
          create: {
            alias: name.toUpperCase(),
            playerId: canonical.id,
            confidence: 0.95,
            status: "APPROVED",
            approvedBy: "MakerChecker",
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Scorecard revision approved and committed successfully.",
      validation,
    });
  } catch (err: any) {
    console.error("Scorecard approval error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to approve scorecard" },
      { status: 500 }
    );
  }
}
