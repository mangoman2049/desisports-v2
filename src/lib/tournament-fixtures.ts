import tournament1Json from "../../prisma/tournament_1_data.json";
import tournament2Json from "../../prisma/tournament_2_data.json";

export interface FixtureOption {
  id: string | number;
  tournamentId: number;
  matchNumber: number;
  stage: string;
  team1: string;
  team2: string;
  date: string;
  venue?: string;
  hasScorecard?: boolean;
}

export const PRACTICE_FIXTURES: FixtureOption[] = [
  {
    id: 7,
    tournamentId: 0,
    matchNumber: 7,
    stage: "Practice Match #7",
    team1: "Home Team",
    team2: "Away Team",
    date: "09 Sep 2026, 8:00 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    hasScorecard: true,
  },
  {
    id: 8,
    tournamentId: 0,
    matchNumber: 8,
    stage: "Practice Match #8",
    team1: "Home Team",
    team2: "Away Team",
    date: "16 Sep 2026, 8:00 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    hasScorecard: false,
  },
  {
    id: 9,
    tournamentId: 0,
    matchNumber: 9,
    stage: "Practice Match #9",
    team1: "Home Team",
    team2: "Away Team",
    date: "23 Sep 2026, 8:00 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    hasScorecard: false,
  },
];

export const TOURNAMENT_1_FIXTURES: FixtureOption[] = [
  {
    id: 1,
    tournamentId: 1,
    matchNumber: 1,
    stage: "Group Match 1",
    team1: "Desi Titans",
    team2: "VPGR",
    date: "11 May 2026, 8:00 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    hasScorecard: true,
  },
  {
    id: 2,
    tournamentId: 1,
    matchNumber: 2,
    stage: "Group Match 2",
    team1: "Desi Dabanggs",
    team2: "Desi Tigers",
    date: "11 May 2026, 9:30 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    hasScorecard: true,
  },
  {
    id: 3,
    tournamentId: 1,
    matchNumber: 3,
    stage: "Group Match 3",
    team1: "Desi Titans",
    team2: "Desi Dabanggs",
    date: "18 May 2026, 7:00 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    hasScorecard: true,
  },
  {
    id: 4,
    tournamentId: 1,
    matchNumber: 4,
    stage: "Group Match 4",
    team1: "Desi Tigers",
    team2: "VPGR",
    date: "18 May 2026, 8:15 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    hasScorecard: true,
  },
  {
    id: 5,
    tournamentId: 1,
    matchNumber: 5,
    stage: "Championship Final",
    team1: "Desi Tigers",
    team2: "VPGR",
    date: "18 May 2026, 9:30 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    hasScorecard: true,
  },
  {
    id: 6,
    tournamentId: 1,
    matchNumber: 6,
    stage: "3rd Place Playoff",
    team1: "Desi Titans",
    team2: "Desi Dabanggs",
    date: "18 May 2026, 9:30 PM",
    venue: "Insportz Club, Dubai (Court 2)",
    hasScorecard: true,
  },
];

/**
 * Returns available fixtures for a given tournament ID
 */
export function getTournamentFixtures(tournamentId: number): FixtureOption[] {
  if (tournamentId === 2) {
    const raw = (tournament2Json as any).fixtures || [];
    return raw.map((f: any, idx: number) => ({
      id: f.id || 100 + idx + 1,
      tournamentId: 2,
      matchNumber: f.matchNumber || idx + 1,
      stage: f.stage || `Match #${idx + 1}`,
      team1: f.team1 || "Team 1",
      team2: f.team2 || "Team 2",
      date: f.date || "Scheduled",
      venue: f.venue || "Insportz Club, Dubai (Court 1)",
      hasScorecard: f.status === "COMPLETED",
    }));
  }

  if (tournamentId === 1) {
    const raw = (tournament1Json as any).fixtures;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((f: any, idx: number) => ({
        id: f.id || idx + 1,
        tournamentId: 1,
        matchNumber: idx + 1,
        stage: f.stage || `Match #${idx + 1}`,
        team1: f.team1 || "Team 1",
        team2: f.team2 || "Team 2",
        date: f.date || "11 May 2026",
        venue: f.venue || "Insportz Club, Dubai (Court 1)",
        hasScorecard: true,
      }));
    }
    return TOURNAMENT_1_FIXTURES;
  }

  return PRACTICE_FIXTURES;
}

/**
 * Returns the default next fixture for a given tournament (first fixture without a scorecard)
 */
export function getNextUpcomingFixture(tournamentId: number): FixtureOption | null {
  const fixtures = getTournamentFixtures(tournamentId);
  if (!fixtures || fixtures.length === 0) return null;
  // Find first fixture without a scorecard
  const next = fixtures.find((f) => !f.hasScorecard);
  return next || fixtures[0] || null;
}

/**
 * Normalizes a team name for fuzzy matching (strips "Desi", spaces, punctuation)
 */
export function normalizeTeamName(name: string): string {
  return (name || "")
    .toLowerCase()
    .replace(/^desi\s*/i, "")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Validates whether the extracted scorecard teams match the selected fixture teams
 */
export function validateFixtureTeamsMatch(
  fixture: { team1: string; team2: string },
  extractedHome: string,
  extractedAway: string
): { isMatch: boolean; reason?: string } {
  const f1 = normalizeTeamName(fixture.team1);
  const f2 = normalizeTeamName(fixture.team2);
  const eh = normalizeTeamName(extractedHome);
  const ea = normalizeTeamName(extractedAway);

  // Allow TBD or Playoff placeholders
  if (
    fixture.team1.includes("Place") ||
    fixture.team1.includes("TBD") ||
    fixture.team2.includes("Place") ||
    fixture.team2.includes("TBD")
  ) {
    return { isMatch: true };
  }

  // Check home == team1 & away == team2, OR home == team2 & away == team1
  const directMatch = (eh.includes(f1) || f1.includes(eh)) && (ea.includes(f2) || f2.includes(ea));
  const swappedMatch = (eh.includes(f2) || f2.includes(eh)) && (ea.includes(f1) || f1.includes(ea));

  if (directMatch || swappedMatch) {
    return { isMatch: true };
  }

  return {
    isMatch: false,
    reason: `Fixture Mismatch: Selected fixture is "${fixture.team1} vs ${fixture.team2}", but uploaded scorecard contains "${extractedHome} vs ${extractedAway}".`,
  };
}
