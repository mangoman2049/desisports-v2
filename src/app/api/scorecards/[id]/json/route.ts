import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { sanitizePathId } from "@/lib/security";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = sanitizePathId(rawId);
    const downloadParam = req.nextUrl.searchParams.get("download") === "true";

    // 1. Check if direct JSON file exists in public/uploads/scorecards
    // SEC-04: Verify resolved path stays within allowed directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "scorecards");
    const jsonPath = path.join(uploadsDir, `${id}.json`);
    const resolvedPath = path.resolve(jsonPath);
    if (!resolvedPath.startsWith(path.resolve(uploadsDir))) {
      return NextResponse.json({ error: "Invalid scorecard ID" }, { status: 400 });
    }
    try {
      const fileData = await fs.readFile(resolvedPath, "utf-8");

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (downloadParam) {
        headers["Content-Disposition"] = `attachment; filename="scorecard-${id}.json"`;
      }

      return new NextResponse(fileData, { status: 200, headers });
    } catch {
      // File not found on disk, fallback to checking DB
    }

    // 2. Check ScorecardUpload in Prisma
    const upload = await prisma.scorecardUpload.findUnique({
      where: { id },
    });

    if (upload && upload.reconciledData) {
      const parsedData = JSON.parse(upload.reconciledData);
      const payload = {
        auditMetadata: {
          uploadId: upload.id,
          createdAt: upload.createdAt,
          filename: upload.filename,
          imageUrl: upload.imageUrl,
          qualityScore: upload.qualityScore,
          validationScore: upload.validationScore,
          format: "Spawtz 16-Over Indoor Cricket Standard",
        },
        scorecard: parsedData,
        tacticalAnalysis: upload.tacticalAnalysis ? JSON.parse(upload.tacticalAnalysis) : null,
      };

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (downloadParam) {
        headers["Content-Disposition"] = `attachment; filename="scorecard-${id}.json"`;
      }

      return new NextResponse(JSON.stringify(payload, null, 2), { status: 200, headers });
    }

    // 3. Check Match in Prisma if id is numeric
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
        const payload = {
          auditMetadata: {
            matchId: match.id,
            matchDate: match.matchDate,
            court: match.umpire || "Court 1",
            format: "Spawtz 16-Over Indoor Cricket Standard",
          },
          result: {
            homeTeam: match.homeTeam.name,
            homeScore: match.homeScore,
            homeSkins: match.homeSkins,
            awayTeam: match.awayTeam.name,
            awayScore: match.awayScore,
            awaySkins: match.awaySkins,
            winner: match.homeScore > match.awayScore ? match.homeTeam.name : match.awayTeam.name,
          },
          innings: match.innings,
          playerStats: match.playerStats.map((ps) => ({
            playerId: ps.playerId,
            playerName: ps.player.canonicalName,
            runsScored: ps.runsScored,
            oversBowled: ps.oversBowled,
            runsConceded: ps.runsConceded,
            wickets: ps.wickets,
            netContribution: ps.runsScored - ps.runsConceded,
          })),
          tacticalAnalysis: match.tacticalAnalysis ? JSON.parse(match.tacticalAnalysis) : null,
        };

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (downloadParam) {
          headers["Content-Disposition"] = `attachment; filename="match-${id}.json"`;
        }

        return new NextResponse(JSON.stringify(payload, null, 2), { status: 200, headers });
      }
    }

    return NextResponse.json({ error: "Auditable scorecard JSON not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
