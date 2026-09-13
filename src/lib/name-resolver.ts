import { prisma } from "./prisma";
import { ParsedScorecard } from "@/types/cricket";

export interface ResolvedPlayerMatch {
  rawName: string;
  matchedPlayerId: number;
  matchedName: string;
  confidence: number;
  matchType: "EXACT" | "ALIAS" | "FUZZY_VARIANT" | "FUZZY_SIMILARITY" | "NEW_UNRECONCILED";
}

/**
 * Calculates Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/**
 * Formats a raw scanned string into clean Title Case if all uppercase,
 * or preserves author casing.
 */
function cleanPlayerName(raw: string): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "Player";
  // If ALL CAPS and multiple words, convert to Title Case: "ROHIT SHARMA" -> "Rohit Sharma"
  if (trimmed === trimmed.toUpperCase() && trimmed.length > 2) {
    return trimmed
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }
  return trimmed;
}

/**
 * Resolves a raw scanned name against all known players.
 * If no match is found, DOES NOT FAIL: simply takes the name as it is.
 */
export async function resolvePlayerName(rawName: string): Promise<ResolvedPlayerMatch> {
  const cleaned = (rawName || "").trim();
  if (!cleaned) {
    return {
      rawName: "Player",
      matchedPlayerId: 999,
      matchedName: "Player",
      confidence: 1.0,
      matchType: "EXACT",
    };
  }

  const upper = cleaned.toUpperCase();
  const formattedName = cleanPlayerName(cleaned);

  try {
    const allPlayers = await prisma.player.findMany();

    // Step 1: Check Exact Match on canonical name (case-insensitive)
    const exact = allPlayers.find(
      (p) => p.canonicalName.trim().toUpperCase() === upper
    );
    if (exact) {
      return {
        rawName,
        matchedPlayerId: exact.id,
        matchedName: exact.canonicalName,
        confidence: 1.0,
        matchType: "EXACT",
      };
    }

    // Step 2: Check PlayerAlias table
    const alias = await prisma.playerAlias.findUnique({
      where: { alias: upper },
      include: { player: true },
    });
    if (alias && alias.player) {
      return {
        rawName,
        matchedPlayerId: alias.player.id,
        matchedName: alias.player.canonicalName,
        confidence: alias.confidence,
        matchType: "ALIAS",
      };
    }

    // Step 3: Check fuzzyVariants on all players
    for (const p of allPlayers) {
      if (p.fuzzyVariants) {
        try {
          const variants: string[] = JSON.parse(p.fuzzyVariants);
          const match = variants.some(
            (v) => v.trim().toUpperCase() === upper || upper.startsWith(v.trim().toUpperCase())
          );
          if (match) {
            try {
              await prisma.playerAlias.upsert({
                where: { alias: upper },
                update: { confidence: 0.95 },
                create: {
                  alias: upper,
                  playerId: p.id,
                  confidence: 0.95,
                  status: "APPROVED",
                  approvedBy: "FuzzyResolver",
                },
              });
            } catch {}

            return {
              rawName,
              matchedPlayerId: p.id,
              matchedName: p.canonicalName,
              confidence: 0.95,
              matchType: "FUZZY_VARIANT",
            };
          }
        } catch {
          // Continue
        }
      }
    }

    // Step 4: Fuzzy Levenshtein Distance matching on first name or full name
    let closestPlayer: (typeof allPlayers)[0] | null = null;
    let minDistance = 999;

    for (const p of allPlayers) {
      const pUpper = p.canonicalName.trim().toUpperCase();
      const pFirst = pUpper.split(" ")[0];

      const distFull = levenshteinDistance(upper, pUpper);
      const distFirst = levenshteinDistance(upper, pFirst);
      const dist = Math.min(distFull, distFirst);

      if (dist < minDistance) {
        minDistance = dist;
        closestPlayer = p;
      }
    }

    // If distance is <= 2 (e.g. Maneesh vs Manish = distance 2), accept match!
    if (closestPlayer && minDistance <= 2) {
      try {
        await prisma.playerAlias.upsert({
          where: { alias: upper },
          update: { confidence: 0.9 },
          create: {
            alias: upper,
            playerId: closestPlayer.id,
            confidence: 0.9,
            status: "APPROVED",
            approvedBy: "LevenshteinFuzzy",
          },
        });
      } catch {}

      return {
        rawName,
        matchedPlayerId: closestPlayer.id,
        matchedName: closestPlayer.canonicalName,
        confidence: 0.9,
        matchType: "FUZZY_SIMILARITY",
      };
    }

    // Step 5: Completely new player -> DO NOT FAIL; TAKE THE NAME AS IT IS!
    // Check if player with this canonical name already exists
    let newPlayer = allPlayers.find(
      (p) => p.canonicalName.trim().toUpperCase() === formattedName.toUpperCase()
    );

    if (!newPlayer) {
      try {
        newPlayer = await prisma.player.create({
          data: {
            canonicalName: formattedName,
            battingHand: "Right Hand",
            bowlingStyle: "Right Arm Medium",
            fieldingPosition: "Cover",
            isUnreconciled: false,
            notes: `Scanned as "${rawName}".`,
          },
        });
      } catch {
        // In case of unique collision or race condition, fetch existing
        newPlayer = (await prisma.player.findFirst({
          where: { canonicalName: { equals: formattedName } },
        })) || undefined;
      }
    }

    if (newPlayer) {
      try {
        await prisma.playerAlias.upsert({
          where: { alias: upper },
          update: { confidence: 0.95 },
          create: {
            alias: upper,
            playerId: newPlayer.id,
            confidence: 0.95,
            status: "APPROVED",
            approvedBy: "ScorecardIntake",
          },
        });
      } catch {}

      return {
        rawName,
        matchedPlayerId: newPlayer.id,
        matchedName: newPlayer.canonicalName,
        confidence: 0.95,
        matchType: "NEW_UNRECONCILED",
      };
    }

    return {
      rawName,
      matchedPlayerId: 0,
      matchedName: formattedName,
      confidence: 0.95,
      matchType: "NEW_UNRECONCILED",
    };
  } catch (error) {
    console.warn("Graceful fallback for player name resolution:", rawName, error);
    return {
      rawName,
      matchedPlayerId: 0,
      matchedName: formattedName,
      confidence: 0.95,
      matchType: "NEW_UNRECONCILED",
    };
  }
}

/**
 * Runs all players (batters + bowlers + summaries) in a parsed scorecard through
 * the resolver, enriching player summaries and mapping raw OCR tokens to canonical names.
 */
export async function resolveAllScorecardPlayers(scorecard: ParsedScorecard): Promise<{
  scorecard: ParsedScorecard;
  resolutions: Record<string, ResolvedPlayerMatch>;
  totalNames: number;
  matchedCount: number;
  unreconciledCount: number;
}> {
  const namesSet = new Set<string>();

  // Collect batters
  (scorecard.homeInnings?.skins || []).forEach((s) => {
    if (s.batter1Name) namesSet.add(s.batter1Name.trim());
    if (s.batter2Name) namesSet.add(s.batter2Name.trim());
  });
  (scorecard.awayInnings?.skins || []).forEach((s) => {
    if (s.batter1Name) namesSet.add(s.batter1Name.trim());
    if (s.batter2Name) namesSet.add(s.batter2Name.trim());
  });

  // Collect bowlers
  (scorecard.homeInnings?.skins || []).forEach((s) => {
    (s.overs || []).forEach((o) => {
      if (o.bowlerName) namesSet.add(o.bowlerName.trim());
    });
  });
  (scorecard.awayInnings?.skins || []).forEach((s) => {
    (s.overs || []).forEach((o) => {
      if (o.bowlerName) namesSet.add(o.bowlerName.trim());
    });
  });

  // Collect summary players
  (scorecard.homeInnings?.playerSummaries || []).forEach((p) => {
    if (p.name) namesSet.add(p.name.trim());
  });
  (scorecard.awayInnings?.playerSummaries || []).forEach((p) => {
    if (p.name) namesSet.add(p.name.trim());
  });

  const resolutions: Record<string, ResolvedPlayerMatch> = {};
  let matchedCount = 0;
  let unreconciledCount = 0;

  for (const rawName of Array.from(namesSet)) {
    const res = await resolvePlayerName(rawName);
    resolutions[rawName] = res;
    matchedCount++;
  }

  // Clone scorecard and enrich player summaries and all skin/delivery structures with resolved canonical names
  const updatedScorecard = JSON.parse(JSON.stringify(scorecard)) as ParsedScorecard;
  updatedScorecard.nameResolutions = resolutions;

  const enrichSummaries = (summaries: typeof updatedScorecard.homeInnings.playerSummaries) => {
    (summaries || []).forEach((p) => {
      const trimmed = p.name ? p.name.trim() : "";
      const match = resolutions[trimmed];
      if (match && match.matchedName) {
        (p as any).rawName = p.name;
        p.name = match.matchedName;
        p.canonicalName = match.matchedName;
        p.resolvedPlayerId = match.matchedPlayerId;
        p.matchType = match.matchType;
      }
    });
  };

  const enrichSkinsAndOvers = (skins: typeof updatedScorecard.homeInnings.skins) => {
    (skins || []).forEach((s) => {
      if (s.batter1Name && resolutions[s.batter1Name.trim()]?.matchedName) {
        (s as any).rawBatter1Name = s.batter1Name;
        s.batter1Name = resolutions[s.batter1Name.trim()].matchedName;
      }
      if (s.batter2Name && resolutions[s.batter2Name.trim()]?.matchedName) {
        (s as any).rawBatter2Name = s.batter2Name;
        s.batter2Name = resolutions[s.batter2Name.trim()].matchedName;
      }
      (s.overs || []).forEach((o) => {
        if (o.bowlerName && resolutions[o.bowlerName.trim()]?.matchedName) {
          (o as any).rawBowlerName = o.bowlerName;
          o.bowlerName = resolutions[o.bowlerName.trim()].matchedName;
        }
        (o.balls || []).forEach((b) => {
          if (b.batterName && resolutions[b.batterName.trim()]?.matchedName) {
            b.batterName = resolutions[b.batterName.trim()].matchedName;
          }
          if (b.bowlerName && resolutions[b.bowlerName.trim()]?.matchedName) {
            b.bowlerName = resolutions[b.bowlerName.trim()].matchedName;
          }
        });
        (o as any).deliveries?.forEach((d: any) => {
          if (d.batterName && resolutions[d.batterName.trim()]?.matchedName) {
            d.batterName = resolutions[d.batterName.trim()].matchedName;
          }
          if (d.bowlerName && resolutions[d.bowlerName.trim()]?.matchedName) {
            d.bowlerName = resolutions[d.bowlerName.trim()].matchedName;
          }
        });
      });
    });
  };

  enrichSummaries(updatedScorecard.homeInnings?.playerSummaries);
  enrichSummaries(updatedScorecard.awayInnings?.playerSummaries);
  enrichSkinsAndOvers(updatedScorecard.homeInnings?.skins);
  enrichSkinsAndOvers(updatedScorecard.awayInnings?.skins);

  return {
    scorecard: updatedScorecard,
    resolutions,
    totalNames: namesSet.size,
    matchedCount,
    unreconciledCount,
  };
}
