import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing upload ID" }, { status: 400 });
    }

    // 1. Check ScorecardUpload table
    const upload = await prisma.scorecardUpload.findUnique({
      where: { id },
      include: {
        match: true,
      },
    });

    if (upload) {
      let parsedReconciled: any = null;
      let parsedRaw: any = null;
      let parsedDiagnostics: any = null;
      let parsedTactical: any = null;

      try {
        if (upload.reconciledData) parsedReconciled = JSON.parse(upload.reconciledData);
      } catch {}

      try {
        if (upload.rawExtraction) parsedRaw = JSON.parse(upload.rawExtraction);
      } catch {}

      try {
        if (upload.qualityDiagnostics) parsedDiagnostics = JSON.parse(upload.qualityDiagnostics);
      } catch {}

      try {
        if (upload.tacticalAnalysis) parsedTactical = JSON.parse(upload.tacticalAnalysis);
      } catch {}

      return NextResponse.json({
        success: true,
        upload: {
          id: upload.id,
          filename: upload.filename,
          imageUrl: upload.imageUrl || `/api/scorecards/${upload.id}/image`,
          status: upload.status,
          qualityScore: upload.qualityScore,
          qualityDiagnostics: parsedDiagnostics,
          validationScore: upload.validationScore,
          parsedScorecard: parsedReconciled || parsedRaw,
          reconciledData: parsedReconciled,
          rawExtraction: parsedRaw,
          tacticalAnalysis: parsedTactical,
          createdAt: upload.createdAt,
          matchId: upload.matchId,
        },
      });
    }

    // 2. Check Match table if ID is numeric
    const matchNum = parseInt(id, 10);
    if (!isNaN(matchNum)) {
      const match = await prisma.match.findUnique({
        where: { id: matchNum },
        include: {
          homeTeam: true,
          awayTeam: true,
          innings: {
            include: {
              skins: {
                include: {
                  batter1: true,
                  batter2: true,
                  deliveries: true,
                },
              },
            },
          },
          playerStats: {
            include: {
              player: true,
            },
          },
        },
      });

      if (match) {
        return NextResponse.json({
          success: true,
          match,
          upload: {
            id: String(match.id),
            filename: `match-${match.id}.jpg`,
            imageUrl: match.scorecardUrl || `/api/scorecards/${match.id}/image`,
            status: "APPROVED",
            validationScore: 100,
            createdAt: match.createdAt,
            matchId: match.id,
          },
        });
      }
    }

    return NextResponse.json(
      { success: false, error: `Scorecard upload ${id} not found` },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("GET /api/scorecards/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch scorecard upload" },
      { status: 500 }
    );
  }
}
