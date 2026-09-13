import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { ParsedScorecard } from "@/types/cricket";
import { validateIndoorCricketScorecard } from "@/lib/rules-engine";
import { resolvePlayerName } from "@/lib/name-resolver";
import { revalidateCricketCache } from "@/lib/cache-revalidator";
import {
  getOrGenerateMatchAnalysis,
  getOrUpdateTournamentTeamDNA,
  updatePlayerTacticalInsightsOnMatchComplete,
} from "@/lib/tactical-trigger-service";
import {
  sanitizeScorecardPayload,
  sanitizePlayerName,
  sanitizeString,
} from "@/lib/security";

/**
 * Commits an approved or auto-approved scorecard into the database as a permanent Match,
 * creating/updating Team records, Player records (with new players registered with their actual name),
 * and all 16 PlayerMatchStat records.
 */
export async function commitScorecardAsApprovedMatch(params: {
  uploadId: string;
  parsedScorecard: ParsedScorecard;
  reviewerNotes?: string;
  tacticalAnalysisJson?: string;
}): Promise<{ matchId: number; validation: any }> {
  const uploadId = sanitizeString(params.uploadId, 50);
  const parsedScorecard = sanitizeScorecardPayload(params.parsedScorecard);
  const reviewerNotes = sanitizeString(params.reviewerNotes || "Approved revision", 250);
  const { tacticalAnalysisJson } = params;

  // 1. Validation report
  const validation = validateIndoorCricketScorecard(parsedScorecard);

  // 2. Ensure ScorecardUpload record exists
  let upload = await prisma.scorecardUpload.findUnique({
    where: { id: uploadId },
  });

  if (!upload) {
    try {
      upload = await prisma.scorecardUpload.create({
        data: {
          id: uploadId,
          filename: parsedScorecard.matchInfo?.title ? `${parsedScorecard.matchInfo.title}.jpg` : "scorecard.jpg",
          imageUrl: "/uploads/scorecards/sample-scorecard.jpg",
          status: "APPROVED",
          validationScore: validation.confidenceScore,
          reconciledData: JSON.stringify(parsedScorecard),
          tacticalAnalysis: tacticalAnalysisJson,
        },
      });
    } catch {
      upload = await prisma.scorecardUpload.findUnique({ where: { id: uploadId } });
    }
  } else {
    upload = await prisma.scorecardUpload.update({
      where: { id: uploadId },
      data: {
        status: "APPROVED",
        validationScore: validation.confidenceScore,
        reconciledData: JSON.stringify(parsedScorecard),
        ...(tacticalAnalysisJson ? { tacticalAnalysis: tacticalAnalysisJson } : {}),
      },
    });
  }

  // Record audit revision
  if (upload) {
    try {
      await prisma.extractionRevision.create({
        data: {
          uploadId: upload.id,
          reviewerId: "admin",
          diffJson: JSON.stringify({
            notes: reviewerNotes,
            timestamp: new Date().toISOString(),
          }),
          validationScore: validation.confidenceScore,
        },
      });
    } catch (e) {
      console.warn("Could not record extraction revision:", e);
    }
  }

  // 3. Atomically commit teams, match, players, and stats inside an ACID transaction
  const homeTeamName = (parsedScorecard.homeInnings?.teamName || "Home Team").trim() || "Home Team";
  const awayTeamName = (parsedScorecard.awayInnings?.teamName || "Away Team").trim() || "Away Team";
  const homeScore = Number(parsedScorecard.homeInnings?.totalRuns) || 0;
  const awayScore = Number(parsedScorecard.awayInnings?.totalRuns) || 0;
  const homeSkins = Number(parsedScorecard.skinsSummary?.home?.skinsWon ?? parsedScorecard.skinsSummary?.home?.total ?? (homeScore > awayScore ? 3 : 1));
  const awaySkins = Number(parsedScorecard.skinsSummary?.away?.skinsWon ?? parsedScorecard.skinsSummary?.away?.total ?? (awayScore > homeScore ? 3 : 1));
  const tournamentId = Number(parsedScorecard.matchInfo?.tournamentId) || 0;

  // Identify top contributor for POTM
  const allSummaries = [
    ...(parsedScorecard.homeInnings?.playerSummaries || []).map((p) => ({ ...p, isHome: true })),
    ...(parsedScorecard.awayInnings?.playerSummaries || []).map((p) => ({ ...p, isHome: false })),
  ];

  let bestPerformerName = "";
  let bestContribution = -999;
  for (const p of allSummaries) {
    const c = p.contribution !== undefined ? Number(p.contribution) : (Number(p.runsScored) || 0) - (Number(p.runsConceded) || 0);
    if (c > bestContribution) {
      bestContribution = c;
      bestPerformerName = (p.name || "").trim();
    }
  }

  let matchId = upload?.matchId;

  const { committedMatch, committedHomeTeam, committedAwayTeam, participatingPlayerIds } =
    await prisma.$transaction(async (tx) => {
      // 3a. Ensure Teams exist
      const homeTeam = await tx.team.upsert({
        where: { name: homeTeamName },
        update: {},
        create: { name: homeTeamName, code: homeTeamName.substring(0, 3).toUpperCase() },
      });

      const awayTeam = await tx.team.upsert({
        where: { name: awayTeamName },
        update: {},
        create: { name: awayTeamName, code: awayTeamName.substring(0, 3).toUpperCase() },
      });

      // 3b. Create or update Match record
      let match: any = null;
      if (matchId) {
        match = await tx.match.update({
          where: { id: matchId },
          data: {
            tournamentId,
            matchDate: parsedScorecard.matchInfo?.dateTime || new Date().toISOString(),
            homeTeamId: homeTeam.id,
            awayTeamId: awayTeam.id,
            homeScore,
            awayScore,
            homeSkins,
            awaySkins,
            status: "COMPLETED",
            tacticalAnalysis: upload?.tacticalAnalysis || tacticalAnalysisJson,
            scorecardUrl: `/matches/${matchId}`,
          },
        });
      } else {
        match = await tx.match.create({
          data: {
            tournamentId,
            matchDate: parsedScorecard.matchInfo?.dateTime || new Date().toISOString(),
            homeTeamId: homeTeam.id,
            awayTeamId: awayTeam.id,
            homeScore,
            awayScore,
            homeSkins,
            awaySkins,
            status: "COMPLETED",
            tacticalAnalysis: upload?.tacticalAnalysis || tacticalAnalysisJson,
          },
        });
        matchId = match.id;
        await tx.match.update({
          where: { id: match.id },
          data: { scorecardUrl: `/matches/${match.id}` },
        });
      }

      if (upload) {
        await tx.scorecardUpload.update({
          where: { id: upload.id },
          data: { matchId: match.id, status: "APPROVED" },
        });
      }

      // Record audit revision
      if (upload) {
        try {
          await tx.extractionRevision.create({
            data: {
              uploadId: upload.id,
              reviewerId: "admin",
              diffJson: JSON.stringify({
                notes: reviewerNotes,
                timestamp: new Date().toISOString(),
              }),
              validationScore: validation.confidenceScore,
            },
          });
        } catch (e) {
          console.warn("Could not record extraction revision inside tx:", e);
        }
      }

      // 3c. Persist Player records & PlayerMatchStat rows for all players
      let potmPlayerId: number | null = null;
      const pIds: number[] = [];

      for (const p of allSummaries) {
        const rawName = sanitizePlayerName(p.name || "").trim();
        if (!rawName) continue;

        let playerId: number;

        let player = await tx.player.findFirst({
          where: { canonicalName: { equals: rawName } },
        });
        if (!player) {
          player = await tx.player.create({
            data: {
              canonicalName: rawName,
              battingHand: "Right Hand",
              bowlingStyle: "Right Arm Medium",
              fieldingPosition: "Cover",
              isUnreconciled: false,
            },
          });
        }
        playerId = player.id;
        pIds.push(playerId);

        if (rawName === bestPerformerName) {
          potmPlayerId = playerId;
        }

        const existingStat = await tx.playerMatchStat.findFirst({
          where: {
            matchId: match.id,
            playerId: playerId,
          },
        });

        const innings = p.isHome ? parsedScorecard.homeInnings : parsedScorecard.awayInnings;
        const dismissalsCount = (innings?.skins || [])
          .flatMap((s) => s.overs || [])
          .flatMap((o) => o.balls || [])
          .filter((b) => b.batterName === rawName && (b.dismissalType || (b.penaltyRuns || 0) < 0)).length;

        const statData = {
          matchId: match.id,
          playerId: playerId,
          teamId: p.isHome ? homeTeam.id : awayTeam.id,
          runsScored: Number(p.runsScored) || 0,
          timesOut:
            p.timesOut !== undefined
              ? Number(p.timesOut)
              : dismissalsCount > 0
              ? dismissalsCount
              : (Number(p.runsScored) || 0) < 0
              ? 2
              : 1,
          oversBowled: Number(p.oversBowled) || 0.0,
          runsConceded: Number(p.runsConceded) || 0,
          wickets: Number(p.wickets) || 0,
          economy: Number(p.economy) || 0.0,
          contribution:
            p.contribution !== undefined
              ? Number(p.contribution)
              : (Number(p.runsScored) || 0) - (Number(p.runsConceded) || 0),
          isPotm: rawName === bestPerformerName,
          performanceNote:
            (p.contribution || 0) >= 15
              ? `★ +${p.contribution} Contribution`
              : rawName === bestPerformerName
              ? "★ Player of the match"
              : null,
        };

        if (existingStat) {
          await tx.playerMatchStat.update({
            where: { id: existingStat.id },
            data: statData,
          });
        } else {
          await tx.playerMatchStat.create({
            data: statData,
          });
        }
      }

      if (potmPlayerId) {
        try {
          await tx.match.update({
            where: { id: match.id },
            data: { potmPlayerId },
          });
        } catch {}
      }

      return {
        committedMatch: match,
        committedHomeTeam: homeTeam,
        committedAwayTeam: awayTeam,
        participatingPlayerIds: pIds,
      };
    });

  const match = committedMatch;
  const homeTeam = committedHomeTeam;
  const awayTeam = committedAwayTeam;

  // 4. ACID Durability Ledger: Persist committed match payload to durable disk file
  try {
    const ledgerDir = path.join(process.cwd(), "prisma");
    const ledgerPath = path.join(ledgerDir, "committed_matches.json");
    let ledger: any[] = [];
    if (fs.existsSync(ledgerPath)) {
      try {
        ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf-8"));
      } catch {}
    }
    const idx = ledger.findIndex((item: any) => item.matchId === match.id);
    const entry = {
      matchId: match.id,
      tournamentId,
      matchDate: match.matchDate,
      homeTeamName,
      awayTeamName,
      homeScore,
      awayScore,
      homeSkins,
      awaySkins,
      parsedScorecard,
      committedAt: new Date().toISOString(),
    };
    if (idx >= 0) {
      ledger[idx] = entry;
    } else {
      ledger.push(entry);
    }
    fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2), "utf-8");
  } catch (ledgerErr) {
    console.warn("[match-committer] Could not write to matches ledger:", ledgerErr);
  }

  // Trigger Points for the 3 Isolated Prompts (Strictly Event-Driven upon Match Approval)
  try {
    // 1. Match Tactical Analysis: Generated & stored ONCE into Match.tacticalAnalysis
    await getOrGenerateMatchAnalysis(match.id, parsedScorecard);

    // 2. Player Tactical Insights: Updated ONLY for the participating players in this match
    if (participatingPlayerIds.length > 0) {
      await updatePlayerTacticalInsightsOnMatchComplete(
        match.id,
        Array.from(new Set(participatingPlayerIds))
      );
    }

    // 3. Evolving Team DNA: Updated for participating teams in this tournament
    if (tournamentId > 0) {
      await getOrUpdateTournamentTeamDNA(tournamentId, homeTeam.id, { onMatchApproved: match.id });
      await getOrUpdateTournamentTeamDNA(tournamentId, awayTeam.id, { onMatchApproved: match.id });
    }
  } catch (triggerErr) {
    console.warn("[match-committer] Tactical trigger execution warning:", triggerErr);
  }

  // Purge any stale cache across matches, tournaments, players, and leaderboards
  revalidateCricketCache(tournamentId, match.id);

  return { matchId: match.id, validation };
}
