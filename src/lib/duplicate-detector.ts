import { prisma } from "./prisma";

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingMatchId?: number;
  existingUploadId?: string;
  matchDate?: string;
  homeTeam?: string;
  awayTeam?: string;
  reason?: string;
}

/**
 * Checks whether a scorecard for the same match date and teams already exists.
 */
export async function checkForDuplicateScorecard(
  matchDate: string,
  homeTeamName: string,
  awayTeamName: string,
  excludeUploadId?: string
): Promise<DuplicateCheckResult> {
  const normalizedDate = matchDate.trim().toLowerCase();
  const normalizedHome = homeTeamName.trim().toLowerCase();
  const normalizedAway = awayTeamName.trim().toLowerCase();

  // 1. Check existing matches
  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });

  for (const m of matches) {
    const mDate = m.matchDate.trim().toLowerCase();
    const mHome = m.homeTeam.name.trim().toLowerCase();
    const mAway = m.awayTeam.name.trim().toLowerCase();

    // Check same date (ignoring minor time formatting differences) and same teams
    const dateMatches =
      mDate === normalizedDate ||
      (mDate.split(",")[0] && mDate.split(",")[0] === normalizedDate.split(",")[0]);

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
        reason: `A completed scorecard for ${m.homeTeam.name} vs ${m.awayTeam.name} on ${m.matchDate} already exists in the system (Match #${m.id}).`,
      };
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
        if (
          parsed.matchInfo?.dateTime?.toLowerCase() === normalizedDate &&
          parsed.homeInnings?.teamName?.toLowerCase() === normalizedHome &&
          parsed.awayInnings?.teamName?.toLowerCase() === normalizedAway
        ) {
          return {
            isDuplicate: true,
            existingUploadId: up.id,
            matchDate: parsed.matchInfo.dateTime,
            homeTeam: parsed.homeInnings.teamName,
            awayTeam: parsed.awayInnings.teamName,
            reason: `A pending scorecard for this exact match is currently awaiting Maker-Checker review (Upload #${up.id.slice(0, 8)}).`,
          };
        }
      } catch {
        // Continue
      }
    }
  }

  return { isDuplicate: false };
}
