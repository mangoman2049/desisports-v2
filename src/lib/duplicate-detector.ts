import { prisma } from "./prisma";

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingMatchId?: number;
  existingUploadId?: string;
  matchDate?: string;
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: number;
  awayScore?: number;
  reason?: string;
}

/**
 * Checks whether a scorecard for the same match date/time and exact final scores already exists.
 * In indoor cricket, the same two teams can play multiple matches/rematches in a tournament,
 * so duplicate detection relies on Date/Time AND 100% confidence final scores.
 */
export async function checkForDuplicateScorecard(
  matchDate: string,
  homeTeamName?: string,
  awayTeamName?: string,
  homeScore?: number,
  awayScore?: number,
  excludeUploadId?: string
): Promise<DuplicateCheckResult> {
  const normalizedDate = (matchDate || "").trim().toLowerCase();
  const normalizedHome = (homeTeamName || "").trim().toLowerCase();
  const normalizedAway = (awayTeamName || "").trim().toLowerCase();

  // Helper to test date similarity
  const isSameDate = (d1: string, d2: string) => {
    if (!d1 || !d2) return false;
    if (d1 === d2) return true;
    const p1 = d1.split(",")[0].trim();
    const p2 = d2.split(",")[0].trim();
    return p1.length > 3 && p1 === p2;
  };

  // 1. Check existing completed matches in database
  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });

  for (const m of matches) {
    const mDate = (m.matchDate || "").trim().toLowerCase();
    const mHome = m.homeTeam.name.trim().toLowerCase();
    const mAway = m.awayTeam.name.trim().toLowerCase();

    const dateMatches = isSameDate(mDate, normalizedDate);

    // If final scores are provided with 100% confidence, match primarily on Date + Exact Scores
    if (homeScore !== undefined && awayScore !== undefined) {
      const scoreMatches =
        (m.homeScore === homeScore && m.awayScore === awayScore) ||
        (m.homeScore === awayScore && m.awayScore === homeScore);

      if (dateMatches && scoreMatches) {
        return {
          isDuplicate: true,
          existingMatchId: m.id,
          matchDate: m.matchDate,
          homeTeam: m.homeTeam.name,
          awayTeam: m.awayTeam.name,
          homeScore: m.homeScore,
          awayScore: m.awayScore,
          reason: `A completed scorecard for ${m.homeTeam.name} vs ${m.awayTeam.name} on ${m.matchDate} with final score ${homeScore}-${awayScore} already exists (Match #${m.id}).`,
        };
      }
    } else {
      // Fallback when scores are absent: require exact date and both team names
      const teamsMatch =
        (mHome === normalizedHome && mAway === normalizedAway) ||
        (mHome === normalizedAway && mAway === normalizedHome);

      if (dateMatches && teamsMatch) {
        return {
          isDuplicate: true,
          existingMatchId: m.id,
          matchDate: m.matchDate,
          homeTeam: m.homeTeam.name,
          awayTeam: m.awayTeam.name,
          reason: `A scorecard for ${m.homeTeam.name} vs ${m.awayTeam.name} on ${m.matchDate} already exists in the system (Match #${m.id}).`,
        };
      }
    }
  }

  // 2. Check pending uploads
  const uploads = await prisma.scorecardUpload.findMany({
    where: {
      id: excludeUploadId ? { not: excludeUploadId } : undefined,
      status: "PENDING_REVIEW",
    },
  });

  for (const up of uploads) {
    if (up.reconciledData) {
      try {
        const parsed = JSON.parse(up.reconciledData);
        const upDate = (parsed.matchInfo?.dateTime || "").trim().toLowerCase();
        const dateMatches = isSameDate(upDate, normalizedDate);

        const upHomeScore = parsed.homeInnings?.totalScore ?? parsed.homeInnings?.totalRuns;
        const upAwayScore = parsed.awayInnings?.totalScore ?? parsed.awayInnings?.totalRuns;

        if (homeScore !== undefined && awayScore !== undefined && upHomeScore !== undefined && upAwayScore !== undefined) {
          const scoreMatches =
            (upHomeScore === homeScore && upAwayScore === awayScore) ||
            (upHomeScore === awayScore && upAwayScore === homeScore);

          if (dateMatches && scoreMatches) {
            return {
              isDuplicate: true,
              existingUploadId: up.id,
              matchDate: parsed.matchInfo.dateTime,
              homeTeam: parsed.homeInnings.teamName,
              awayTeam: parsed.awayInnings.teamName,
              homeScore: upHomeScore,
              awayScore: upAwayScore,
              reason: `A pending scorecard on ${parsed.matchInfo?.dateTime} with final score ${homeScore}-${awayScore} is already awaiting Maker-Checker review (Upload #${up.id.slice(0, 8)}).`,
            };
          }
        }
      } catch {
        // Continue
      }
    }
  }

  return { isDuplicate: false };
}
