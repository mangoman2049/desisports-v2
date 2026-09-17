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
 * Normalizes full or abbreviated month names to 3-letter lowercase standard
 */
function normalizeDateString(d: string): string {
  return (d || "")
    .toLowerCase()
    .replace(/september/g, "sep")
    .replace(/august/g, "aug")
    .replace(/october/g, "oct")
    .replace(/november/g, "nov")
    .replace(/december/g, "dec")
    .replace(/january/g, "jan")
    .replace(/february/g, "feb")
    .replace(/march/g, "mar")
    .replace(/april/g, "apr")
    .replace(/june/g, "jun")
    .replace(/july/g, "jul")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Normalizes 12h or 24h time strings to standard HH:MM
 */
function normalizeTimeString(t: string): string {
  if (!t) return "";
  const clean = t.toLowerCase().trim();
  const match12 = clean.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const mins = match12[2];
    const meridiem = match12[3].toLowerCase();
    if (meridiem === "pm" && hours < 12) hours += 12;
    if (meridiem === "am" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${mins}`;
  }
  const match24 = clean.match(/(\d{1,2}):(\d{2})/);
  if (match24) {
    return `${String(match24[1]).padStart(2, "0")}:${match24[2]}`;
  }
  return clean;
}

/**
 * Helper to test whether two match dates/times represent the same scheduled match
 */
function isSameDate(d1: string, d2: string): boolean {
  if (!d1 || !d2) return false;
  const clean1 = normalizeDateString(d1);
  const clean2 = normalizeDateString(d2);
  if (clean1 === clean2) return true;

  // Compare date parts before comma or time
  const p1 = clean1.split(",")[0].trim();
  const p2 = clean2.split(",")[0].trim();
  const dateMatch = p1.length > 3 && p1 === p2;
  if (!dateMatch) return false;

  // If both have time components, compare normalized times
  const t1 = clean1.split(",")[1]?.trim();
  const t2 = clean2.split(",")[1]?.trim();
  if (t1 && t2) {
    const normT1 = normalizeTimeString(t1);
    const normT2 = normalizeTimeString(t2);
    if (normT1 && normT2 && normT1 !== normT2) {
      // Different match time on the same date -> NOT the same match
      return false;
    }
  }

  return true;
}

/**
 * Validates whether two pairs of team names match.
 * Prevents generic placeholders ("Home Team") from falsely matching specific teams.
 */
function doTeamsMatch(
  t1Home: string,
  t1Away: string,
  t2Home: string,
  t2Away: string
): boolean {
  const norm1H = (t1Home || "").trim().toLowerCase();
  const norm1A = (t1Away || "").trim().toLowerCase();
  const norm2H = (t2Home || "").trim().toLowerCase();
  const norm2A = (t2Away || "").trim().toLowerCase();

  const isGeneric1 =
    !norm1H || !norm1A || norm1H.includes("home team") || norm1A.includes("away team") || norm1H.includes("team 1") || norm1A.includes("team 2");
  const isGeneric2 =
    !norm2H || !norm2A || norm2H.includes("home team") || norm2A.includes("away team") || norm2H.includes("team 1") || norm2A.includes("team 2");

  if (isGeneric1 && isGeneric2) {
    // Both are generic practice/unnamed teams
    return true;
  }

  if (isGeneric1 !== isGeneric2) {
    // One is a specific named team (e.g. Desi Titans) and the other is generic -> NOT a match!
    return false;
  }

  // Both are specific named teams: verify names match (direct or swapped)
  const direct =
    (norm1H === norm2H && norm1A === norm2A) ||
    (norm1H.includes(norm2H) && norm1A.includes(norm2A)) ||
    (norm2H.includes(norm1H) && norm2A.includes(norm1A));

  const swapped =
    (norm1H === norm2A && norm1A === norm2H) ||
    (norm1H.includes(norm2A) && norm1A.includes(norm2H)) ||
    (norm2H.includes(norm1A) && norm2A.includes(norm1H));

  return direct || swapped;
}

/**
 * Checks whether a scorecard for the same match date/time, exact final scores,
 * and matching teams already exists.
 */
export async function checkForDuplicateScorecard(
  matchDate: string,
  homeTeamName?: string,
  awayTeamName?: string,
  homeScore?: number,
  awayScore?: number,
  excludeUploadId?: string
): Promise<DuplicateCheckResult> {
  const targetHome = homeTeamName || "";
  const targetAway = awayTeamName || "";

  // 1. Check existing completed matches in database
  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });

  for (const m of matches) {
    const mDate = m.matchDate || "";
    const mHome = m.homeTeam.name;
    const mAway = m.awayTeam.name;

    const dateMatches = isSameDate(mDate, matchDate);
    const teamsMatch = doTeamsMatch(targetHome, targetAway, mHome, mAway);

    // Both date AND teams must match to even consider as a duplicate candidate
    if (!dateMatches || !teamsMatch) {
      continue;
    }

    // If final scores are provided with 100% confidence, verify exact score match
    if (homeScore !== undefined && awayScore !== undefined) {
      const scoreMatches =
        (m.homeScore === homeScore && m.awayScore === awayScore) ||
        (m.homeScore === awayScore && m.awayScore === homeScore);

      if (scoreMatches) {
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
      // Fallback when scores are absent: exact date and team match suffices
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

  // 2. Check pending uploads (only recent ones — ignore abandoned uploads older than 24 hours)
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const uploads = await prisma.scorecardUpload.findMany({
    where: {
      id: excludeUploadId ? { not: excludeUploadId } : undefined,
      status: "PENDING_REVIEW",
      createdAt: { gte: twentyFourHoursAgo },
    },
  });

  for (const up of uploads) {
    if (up.reconciledData) {
      try {
        const parsed = JSON.parse(up.reconciledData);
        const upDate = parsed.matchInfo?.dateTime || "";
        const upHome = parsed.homeInnings?.teamName || "";
        const upAway = parsed.awayInnings?.teamName || "";

        const dateMatches = isSameDate(upDate, matchDate);
        const teamsMatch = doTeamsMatch(targetHome, targetAway, upHome, upAway);

        if (!dateMatches || !teamsMatch) {
          continue;
        }

        const upHomeScore = parsed.homeInnings?.totalScore ?? parsed.homeInnings?.totalRuns;
        const upAwayScore = parsed.awayInnings?.totalScore ?? parsed.awayInnings?.totalRuns;

        if (homeScore !== undefined && awayScore !== undefined && upHomeScore !== undefined && upAwayScore !== undefined) {
          const scoreMatches =
            (upHomeScore === homeScore && upAwayScore === awayScore) ||
            (upHomeScore === awayScore && upAwayScore === homeScore);

          if (scoreMatches) {
            return {
              isDuplicate: true,
              existingUploadId: up.id,
              matchDate: parsed.matchInfo?.dateTime,
              homeTeam: upHome,
              awayTeam: upAway,
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
