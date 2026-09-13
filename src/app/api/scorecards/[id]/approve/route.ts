import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ParsedScorecard } from "@/types/cricket";
import { validateIndoorCricketScorecard } from "@/lib/rules-engine";
import { resolvePlayerName } from "@/lib/name-resolver";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const uploadId = resolvedParams.id;
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
    const updatedUpload = await prisma.scorecardUpload.update({
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

    const homeScore = parsed.homeInnings.totalRuns || 0;
    const awayScore = parsed.awayInnings.totalRuns || 0;
    const homeSkins =
      parsed.skinsSummary?.home?.total ??
      (parsed.homeInnings.skins?.filter(
        (s, i) => (s.skinTotalRuns ?? 0) > (parsed.awayInnings.skins?.[i]?.skinTotalRuns ?? 0)
      ).length ?? (homeScore > awayScore ? 3 : 1));
    const awaySkins =
      parsed.skinsSummary?.away?.total ??
      (parsed.awayInnings.skins?.filter(
        (s, i) => (s.skinTotalRuns ?? 0) > (parsed.homeInnings.skins?.[i]?.skinTotalRuns ?? 0)
      ).length ?? (awayScore > homeScore ? 3 : 1));

    const tournamentId = parsed.matchInfo?.tournamentId ?? 0;

    // 1. Create or update Match record
    let matchId = updatedUpload.matchId;
    let match: any = null;

    if (matchId) {
      match = await prisma.match.update({
        where: { id: matchId },
        data: {
          tournamentId,
          matchDate: parsed.matchInfo.dateTime || new Date().toISOString(),
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          homeScore,
          awayScore,
          homeSkins,
          awaySkins,
          status: "COMPLETED",
          tacticalAnalysis: updatedUpload.tacticalAnalysis,
        },
      });
    } else {
      match = await prisma.match.create({
        data: {
          tournamentId,
          matchDate: parsed.matchInfo.dateTime || new Date().toISOString(),
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          homeScore,
          awayScore,
          homeSkins,
          awaySkins,
          status: "COMPLETED",
          tacticalAnalysis: updatedUpload.tacticalAnalysis,
          scorecardUrl: `/matches/${uploadId}`,
        },
      });
      matchId = match.id;
      await prisma.scorecardUpload.update({
        where: { id: uploadId },
        data: { matchId: match.id },
      });
    }

    // 2. Identify top contributor for POTM
    const allSummaries = [
      ...(parsed.homeInnings.playerSummaries || []).map((p) => ({ ...p, isHome: true })),
      ...(parsed.awayInnings.playerSummaries || []).map((p) => ({ ...p, isHome: false })),
    ];

    let bestPerformerName = "";
    let bestContribution = -999;
    for (const p of allSummaries) {
      const c = p.contribution !== undefined ? p.contribution : (p.runsScored || 0) - (p.runsConceded || 0);
      if (c > bestContribution) {
        bestContribution = c;
        bestPerformerName = p.name;
      }
    }

    let potmPlayerId: number | null = null;

    // 3. Persist Player records & PlayerMatchStat rows for all 16 players
    for (const p of allSummaries) {
      let playerId: number;
      try {
        const resolved = await resolvePlayerName(p.name);
        if (resolved.matchedPlayerId > 0) {
          playerId = resolved.matchedPlayerId;
        } else {
          let player = await prisma.player.findFirst({
            where: { canonicalName: { equals: p.name } },
          });
          if (!player) {
            player = await prisma.player.create({
              data: {
                canonicalName: p.name,
                battingHand: "Right Hand",
                bowlingStyle: "Right Arm Medium",
                fieldingPosition: "Cover",
              },
            });
          }
          playerId = player.id;
        }
      } catch {
        let player = await prisma.player.findFirst({
          where: { canonicalName: { equals: p.name } },
        });
        if (!player) {
          player = await prisma.player.create({
            data: {
              canonicalName: p.name,
              battingHand: "Right Hand",
              bowlingStyle: "Right Arm Medium",
              fieldingPosition: "Cover",
            },
          });
        }
        playerId = player.id;
      }

      const isPotm = p.name === bestPerformerName;
      if (isPotm) {
        potmPlayerId = playerId;
      }

      const existingStat = await prisma.playerMatchStat.findFirst({
        where: {
          matchId: match.id,
          playerId: playerId,
        },
      });

      const innings = p.isHome ? parsed.homeInnings : parsed.awayInnings;
      const dismissalsCount = (innings.skins || [])
        .flatMap((s) => s.overs || [])
        .flatMap((o) => o.balls || [])
        .filter((b) => b.batterName === p.name && (b.dismissalType || b.penaltyRuns < 0)).length;

      const statData = {
        matchId: match.id,
        playerId: playerId,
        teamId: p.isHome ? homeTeam.id : awayTeam.id,
        runsScored: p.runsScored || 0,
        timesOut:
          p.timesOut !== undefined
            ? p.timesOut
            : dismissalsCount > 0
            ? dismissalsCount
            : p.runsScored < 0
            ? 2
            : 1,
        oversBowled: p.oversBowled || 0.0,
        runsConceded: p.runsConceded || 0,
        wickets: p.wickets || 0,
        economy: p.economy || 0.0,
        contribution:
          p.contribution !== undefined
            ? p.contribution
            : (p.runsScored || 0) - (p.runsConceded || 0),
        isPotm,
        performanceNote:
          p.contribution >= 15
            ? `★ +${p.contribution} Contribution`
            : isPotm
            ? "★ Player of the match"
            : null,
      };

      if (existingStat) {
        await prisma.playerMatchStat.update({
          where: { id: existingStat.id },
          data: statData,
        });
      } else {
        await prisma.playerMatchStat.create({
          data: statData,
        });
      }
    }

    if (potmPlayerId) {
      await prisma.match.update({
        where: { id: match.id },
        data: { potmPlayerId },
      });
    }

    // Learn aliases for any names present in sheet
    for (const name of allSummaries.map((s) => s.name)) {
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
