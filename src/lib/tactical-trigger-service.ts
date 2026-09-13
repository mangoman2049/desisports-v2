import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { MATCH_ANALYSES, MatchTacticalAnalysis } from "@/lib/match-analyses";
import { generateDeterministicMatchAnalysis } from "@/lib/match-analyzer";
import { TOURNAMENT_2_TEAM_DNA, TeamDNAData, getTournament2TeamDNA } from "@/lib/tournament-2-team-dna";
import { PLAYER_CAREER_DNA_MAP, getPlayerCareerDNA } from "@/lib/player-tactical";

const TEAM_DNA_CACHE_FILE = path.join(process.cwd(), "prisma", "team_dna_cache.json");

/**
 * TRIGGER POINT 1: Match Tactical Analysis
 * 
 * Runs EXACTLY ONCE per match upon scorecard upload/approval.
 * Persists directly into Match.tacticalAnalysis in SQLite.
 * Subsequent page views, refreshes, or different days read the persisted JSON.
 * ZERO tokens burned on read; ZERO inconsistency across different days.
 */
export async function getOrGenerateMatchAnalysis(
  matchId: number | string,
  scorecardData?: any
): Promise<MatchTacticalAnalysis | null> {
  const mIdNum = typeof matchId === "string" ? parseInt(matchId, 10) : matchId;

  // 1. Check database for already-persisted tacticalAnalysis
  if (!isNaN(mIdNum)) {
    try {
      const dbMatch = await prisma.match.findUnique({
        where: { id: mIdNum },
        include: { homeTeam: true, awayTeam: true },
      });

      if (dbMatch?.tacticalAnalysis) {
        try {
          const parsed = JSON.parse(dbMatch.tacticalAnalysis);
          if (parsed && parsed.matchVerdict) {
            return parsed;
          }
        } catch {}
      }
    } catch (e) {
      console.warn(`[TriggerService] Error reading match #${matchId} from DB:`, e);
    }
  }

  // 2. Check static pre-seeded registry (Matches 1-6 from Tournament 1)
  const staticAnalysis = MATCH_ANALYSES[String(matchId)];
  if (staticAnalysis && staticAnalysis.matchVerdict) {
    // Persist to DB so it becomes permanent in database storage
    if (!isNaN(mIdNum)) {
      try {
        await prisma.match.update({
          where: { id: mIdNum },
          data: { tacticalAnalysis: JSON.stringify(staticAnalysis) },
        });
      } catch {}
    }
    return staticAnalysis;
  }

  // 3. If scorecardData is available, generate ONCE and store permanently
  if (scorecardData) {
    const generated = generateDeterministicMatchAnalysis(matchId, scorecardData);
    if (!isNaN(mIdNum) && generated) {
      try {
        await prisma.match.update({
          where: { id: mIdNum },
          data: { tacticalAnalysis: JSON.stringify(generated) },
        });
        console.log(`[TriggerService] Generated & persisted tactical analysis for match #${matchId}`);
      } catch (err) {
        console.warn(`[TriggerService] Could not persist generated analysis for match #${matchId}:`, err);
      }
    }
    return generated;
  }

  return null;
}

/**
 * Helper to get or initialize the persistent Team DNA cache
 */
function getTeamDNACache(): Record<string, TeamDNAData> {
  try {
    if (fs.existsSync(TEAM_DNA_CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(TEAM_DNA_CACHE_FILE, "utf-8"));
    }
  } catch (e) {
    console.warn("[TriggerService] Could not read team_dna_cache.json, using fallback:", e);
  }
  return {};
}

function saveTeamDNACache(cache: Record<string, TeamDNAData>) {
  try {
    fs.writeFileSync(TEAM_DNA_CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
  } catch (e) {
    console.warn("[TriggerService] Could not write team_dna_cache.json:", e);
  }
}

/**
 * TRIGGER POINT 2: Team DNA (Evolving Lifecycle)
 * 
 * - When squad is registered/added: generates/caches PRE-TOURNAMENT HYPOTHESIS MODE.
 * - When a match in that tournament is completed/approved: triggers EVOLVED TEAM DNA incorporating observed performance.
 * - Page views strictly read the cached/persisted model. NEVER re-runs LLM on daily cron or page visits.
 */
export async function getOrUpdateTournamentTeamDNA(
  tournamentId: number | string,
  teamId: number | string,
  context?: { onMatchApproved?: number; onSquadUpdated?: boolean }
): Promise<TeamDNAData | undefined> {
  const cacheKey = `t${tournamentId}_team${teamId}`;
  const cache = getTeamDNACache();

  // 1. If mutation event triggered (scorecard approved in this tournament or squad updated)
  if (context?.onMatchApproved || context?.onSquadUpdated || !cache[cacheKey]) {
    // For Tournament 2:
    if (String(tournamentId) === "2") {
      const baseDNA = getTournament2TeamDNA(teamId);
      if (baseDNA) {
        // If matches have been played in Tournament 2, transition to IN-TOURNAMENT / OBSERVED EVIDENCE
        const t2Matches = await prisma.match.findMany({
          where: { tournamentId: 2, status: "COMPLETED" },
        });

        if (t2Matches.length > 0) {
          const evolvedDNA: TeamDNAData = {
            ...baseDNA,
            mode: "IN-TOURNAMENT / OBSERVED EVIDENCE",
            evolutionNotice: `Evolved Team DNA based on ${t2Matches.length} completed Bazooka 4.0 tournament match(es). Observed performance is progressively replacing pre-tournament hypotheses.`,
          };
          cache[cacheKey] = evolvedDNA;
          saveTeamDNACache(cache);
          return evolvedDNA;
        }

        // Otherwise keep pre-tournament hypothesis mode
        cache[cacheKey] = baseDNA;
        saveTeamDNACache(cache);
        return baseDNA;
      }
    }
  }

  // 2. Default read: Return from persistent cache (Zero token burn, zero re-computation)
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  // Fallback to static pre-tournament register
  return getTournament2TeamDNA(teamId);
}

/**
 * TRIGGER POINT 3: Player Tactical Insights (Career-Wide)
 * 
 * Triggered ONLY for the 16 participating players when a match scorecard is approved.
 * Recomputes and persists their career tactical intelligence with the latest match data.
 * Page views on /player/[id] read the persisted profile directly.
 * ZERO daily crons; ZERO background polling; ZERO token burn on read.
 */
export async function updatePlayerTacticalInsightsOnMatchComplete(
  matchId: number,
  participatingPlayerIds: number[]
): Promise<{ updatedCount: number }> {
  let updatedCount = 0;

  for (const pId of participatingPlayerIds) {
    try {
      const player = await prisma.player.findUnique({
        where: { id: pId },
        include: {
          stats: {
            include: {
              match: true,
            },
          },
        },
      });

      if (!player) continue;

      // Generate the grounded career DNA incorporating the new match
      const updatedCareerDNA = getPlayerCareerDNA(player.canonicalName, player.stats);

      // Persist to Player record (using captainTags or notes as verified storage)
      await prisma.player.update({
        where: { id: pId },
        data: {
          captainTags: JSON.stringify([
            updatedCareerDNA.primaryProfile,
            updatedCareerDNA.secondaryProfile,
            `Synergy: ${updatedCareerDNA.playerSynergy.performanceSynergyScore}/100`,
          ]),
          notes: updatedCareerDNA.profileDescription,
        },
      });

      updatedCount++;
    } catch (err) {
      console.warn(`[TriggerService] Error updating player #${pId} tactical insights:`, err);
    }
  }

  console.log(
    `[TriggerService] Successfully updated & persisted career tactical DNA for ${updatedCount} participating players from match #${matchId}.`
  );
  return { updatedCount };
}
