import { prisma } from "@/lib/prisma";
import { TOURNAMENT_POINTS_CONFIG } from "@/lib/tactical-prompt";
import tournament1Json from "../../prisma/tournament_1_data.json";
import tournament2Json from "../../prisma/tournament_2_data.json";

export interface TeamStanding {
  pos: number;
  team: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  forRuns: number;
  againstRuns: number;
  diff: string;
  points: number;
  skinWins?: number;
}

export interface PlayerLeaderboardItem {
  rank: string;
  playerId: string;
  name: string;
  value: string;
  avatar: string | null;
}

export interface DynamicTournamentData {
  id: number;
  title: string;
  dates?: string;
  venue?: string;
  hasPointsTable: boolean;
  teams: { name: string; captain: string; badge: string; color: string }[];
  standings: TeamStanding[];
  topRunGetters: PlayerLeaderboardItem[];
  topWicketTakers: PlayerLeaderboardItem[];
  topContributors: PlayerLeaderboardItem[];
  fixtures: any[];
  squads: any[];
  mvp?: { name: string; points: number } | null;
  champions?: string | null;
  runnerUp?: string | null;
}

/**
 * Computes dynamic team standings from completed matches
 */
export function computeStandingsFromMatches(
  teamNames: string[],
  matches: Array<{
    homeTeam: { name: string };
    awayTeam: { name: string };
    homeScore: number;
    awayScore: number;
    homeSkins: number;
    awaySkins: number;
    status: string;
  }>
): TeamStanding[] {
  const table = new Map<
    string,
    {
      team: string;
      played: number;
      won: number;
      lost: number;
      tied: number;
      forRuns: number;
      againstRuns: number;
      skinWins: number;
      skinTies: number;
      points: number;
    }
  >();

  for (const name of teamNames) {
    table.set(name, {
      team: name,
      played: 0,
      won: 0,
      lost: 0,
      tied: 0,
      forRuns: 0,
      againstRuns: 0,
      skinWins: 0,
      skinTies: 0,
      points: 0,
    });
  }

  const completed = matches.filter((m) => m.status === "COMPLETED");

  for (const m of completed) {
    const home = table.get(m.homeTeam.name) || {
      team: m.homeTeam.name,
      played: 0,
      won: 0,
      lost: 0,
      tied: 0,
      forRuns: 0,
      againstRuns: 0,
      skinWins: 0,
      skinTies: 0,
      points: 0,
    };
    const away = table.get(m.awayTeam.name) || {
      team: m.awayTeam.name,
      played: 0,
      won: 0,
      lost: 0,
      tied: 0,
      forRuns: 0,
      againstRuns: 0,
      skinWins: 0,
      skinTies: 0,
      points: 0,
    };

    home.played += 1;
    away.played += 1;
    home.forRuns += m.homeScore;
    home.againstRuns += m.awayScore;
    away.forRuns += m.awayScore;
    away.againstRuns += m.homeScore;

    // Match outcome points
    if (m.homeScore > m.awayScore) {
      home.won += 1;
      home.points += TOURNAMENT_POINTS_CONFIG.MATCH_WIN_POINTS;
      away.lost += 1;
    } else if (m.awayScore > m.homeScore) {
      away.won += 1;
      away.points += TOURNAMENT_POINTS_CONFIG.MATCH_WIN_POINTS;
      home.lost += 1;
    } else {
      home.tied += 1;
      home.points += TOURNAMENT_POINTS_CONFIG.MATCH_TIE_POINTS;
      away.tied += 1;
      away.points += TOURNAMENT_POINTS_CONFIG.MATCH_TIE_POINTS;
    }

    // Skin outcome points (1 pt per skin win, 0.5 for tie)
    const homeSkinsWon = m.homeSkins ?? 0;
    const awaySkinsWon = m.awaySkins ?? 0;
    const tiedSkins = Math.max(0, 4 - homeSkinsWon - awaySkinsWon);

    home.skinWins += homeSkinsWon;
    home.skinTies += tiedSkins;
    home.points += homeSkinsWon * TOURNAMENT_POINTS_CONFIG.SKIN_WIN_POINTS;
    home.points += tiedSkins * TOURNAMENT_POINTS_CONFIG.SKIN_TIE_POINTS;

    away.skinWins += awaySkinsWon;
    away.skinTies += tiedSkins;
    away.points += awaySkinsWon * TOURNAMENT_POINTS_CONFIG.SKIN_WIN_POINTS;
    away.points += tiedSkins * TOURNAMENT_POINTS_CONFIG.SKIN_TIE_POINTS;

    table.set(m.homeTeam.name, home);
    table.set(m.awayTeam.name, away);
  }

  // Sort: Points DESC, Run Difference DESC, Total For Runs DESC
  const sorted = Array.from(table.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const diffA = a.forRuns - a.againstRuns;
    const diffB = b.forRuns - b.againstRuns;
    if (diffB !== diffA) return diffB - diffA;
    return b.forRuns - a.forRuns;
  });

  return sorted.map((row, idx) => {
    const diffNum = row.forRuns - row.againstRuns;
    const diffStr = diffNum > 0 ? `+${diffNum}` : `${diffNum}`;
    return {
      pos: idx + 1,
      team: row.team,
      played: row.played,
      won: row.won,
      lost: row.lost,
      tied: row.tied,
      forRuns: row.forRuns,
      againstRuns: row.againstRuns,
      diff: diffStr,
      points: row.points,
      skinWins: row.skinWins,
    };
  });
}

/**
 * Computes dynamic player leaderboards from PlayerMatchStat entries
 */
export function computeLeaderboardsFromStats(
  stats: Array<{
    playerId: number;
    runsScored: number;
    wickets: number;
    contribution: number;
    player: { id: number; canonicalName: string; avatarUrl?: string | null };
  }>
): {
  topRunGetters: PlayerLeaderboardItem[];
  topWicketTakers: PlayerLeaderboardItem[];
  topContributors: PlayerLeaderboardItem[];
  mvp: { name: string; points: number } | null;
} {
  const pMap = new Map<
    number,
    {
      id: number;
      name: string;
      avatar: string | null;
      runs: number;
      wickets: number;
      contribution: number;
    }
  >();

  for (const s of stats) {
    const existing = pMap.get(s.playerId) || {
      id: s.playerId,
      name: s.player.canonicalName,
      avatar: s.player.avatarUrl || null,
      runs: 0,
      wickets: 0,
      contribution: 0,
    };

    existing.runs += s.runsScored;
    existing.wickets += s.wickets;
    existing.contribution += s.contribution;
    pMap.set(s.playerId, existing);
  }

  const allPlayers = Array.from(pMap.values());

  const rankSymbols = ["🥇", "2", "3", "4", "5"];

  const topRunGetters = allPlayers
    .slice()
    .sort((a, b) => b.runs - a.runs)
    .slice(0, 5)
    .map((p, idx) => ({
      rank: rankSymbols[idx] || String(idx + 1),
      playerId: String(p.id),
      name: p.name,
      value: String(p.runs),
      avatar: p.avatar,
    }));

  const topWicketTakers = allPlayers
    .slice()
    .sort((a, b) => b.wickets - a.wickets)
    .slice(0, 5)
    .map((p, idx) => ({
      rank: rankSymbols[idx] || String(idx + 1),
      playerId: String(p.id),
      name: p.name,
      value: String(p.wickets),
      avatar: p.avatar,
    }));

  const topContributors = allPlayers
    .slice()
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 5)
    .map((p, idx) => ({
      rank: rankSymbols[idx] || String(idx + 1),
      playerId: String(p.id),
      name: p.name,
      value: String(p.contribution),
      avatar: p.avatar,
    }));

  const topMvpPlayer = allPlayers.slice().sort((a, b) => b.contribution - a.contribution)[0];
  const mvp = topMvpPlayer
    ? { name: topMvpPlayer.name, points: topMvpPlayer.contribution }
    : null;

  return {
    topRunGetters,
    topWicketTakers,
    topContributors,
    mvp,
  };
}

/**
 * Loads and dynamically computes tournament details for given tournament ID
 */
export async function getTournamentDetails(
  tournamentId: number
): Promise<DynamicTournamentData> {
  if (tournamentId === 0) {
    // Regular practice: Strictly NO Teams Points Table
    return {
      id: 0,
      title: "Desisports Regular Practice",
      hasPointsTable: false,
      teams: [],
      standings: [],
      topRunGetters: [],
      topWicketTakers: [],
      topContributors: [],
      fixtures: [],
      squads: [],
      mvp: null,
      champions: null,
      runnerUp: null,
    };
  }

  if (tournamentId === 2) {
    // Tournament 2: DesiBoys Bazooka 4.0
    const t2Teams = (tournament2Json as any).teams || [
      { name: "Desi Titans", captain: "Hardik Desai", badge: "T", color: "blue" },
      { name: "Desi Dabanggs", captain: "Ritesh Mehta", badge: "D", color: "amber" },
      { name: "Desi Tigers", captain: "Prateek Nahar", badge: "T", color: "emerald" },
      { name: "Desi Challengers", captain: "Darshan Mody", badge: "C", color: "purple" },
    ];

    const teamNames = t2Teams.map((t: any) => t.name);

    let dbMatches: any[] = [];
    let dbStats: any[] = [];
    try {
      dbMatches = await prisma.match.findMany({
        where: { tournamentId: 2 },
        include: {
          homeTeam: true,
          awayTeam: true,
          potmPlayer: true,
        },
        orderBy: { id: "asc" },
      });

      if (dbMatches.length > 0) {
        dbStats = await prisma.playerMatchStat.findMany({
          where: {
            match: { tournamentId: 2 },
          },
          include: {
            player: true,
          },
        });
      }
    } catch (e) {
      console.warn("Could not query DB matches for Tournament 2:", e);
    }

    // Data Hygiene: If no matches have been played yet, standings are empty (tournament yet to start)
    const standings = dbMatches.length > 0 ? computeStandingsFromMatches(teamNames, dbMatches) : [];
    const leaderboards = computeLeaderboardsFromStats(dbStats);

    const scheduledFixtures: any[] = (tournament2Json as any).fixtures || [];
    const mergedFixtures = scheduledFixtures.map((fix) => {
      const matchedDb = dbMatches.find(
        (m) =>
          (m.homeTeam?.name === fix.team1 && m.awayTeam?.name === fix.team2) ||
          (m.homeTeam?.name === fix.team2 && m.awayTeam?.name === fix.team1)
      );

      if (matchedDb) {
        return {
          id: matchedDb.id,
          fixtureId: fix.id,
          date: matchedDb.matchDate || fix.date,
          stage: fix.stage,
          team1: matchedDb.homeTeam?.name,
          score1: matchedDb.homeScore,
          winner1: matchedDb.homeScore > matchedDb.awayScore,
          team2: matchedDb.awayTeam?.name,
          score2: matchedDb.awayScore,
          winner2: matchedDb.awayScore > matchedDb.homeScore,
          potm: matchedDb.potmPlayer?.canonicalName || "TBD",
          scorecardUrl: `/matches/${matchedDb.id}`,
          status: "COMPLETED",
        };
      }

      return {
        id: fix.id,
        fixtureId: fix.id,
        date: fix.date,
        stage: fix.stage,
        team1: fix.team1,
        score1: 0,
        winner1: false,
        team2: fix.team2,
        score2: 0,
        winner2: false,
        potm: "TBD",
        scorecardUrl: `/admin/scorecards/new?tournamentId=2&fixtureId=${fix.id}`,
        status: "UPCOMING",
        venue: fix.venue,
      };
    });

    const extraMatches = dbMatches
      .filter((m) => !mergedFixtures.some((f) => f.id === m.id))
      .map((m) => ({
        id: m.id,
        date: m.matchDate,
        stage: "Match",
        team1: m.homeTeam?.name,
        score1: m.homeScore,
        winner1: m.homeScore > m.awayScore,
        team2: m.awayTeam?.name,
        score2: m.awayScore,
        winner2: m.awayScore > m.homeScore,
        potm: m.potmPlayer?.canonicalName || "TBD",
        scorecardUrl: `/matches/${m.id}`,
        status: "COMPLETED",
      }));

    const allFixtures = [...mergedFixtures, ...extraMatches];

    return {
      id: 2,
      title: (tournament2Json as any).title || "DesiBoys Bazooka 4.0",
      dates: (tournament2Json as any).dates || "18 Sep 2026 — 09 Oct 2026",
      venue: (tournament2Json as any).venue || "Insportz Club, Dubai",
      hasPointsTable: true,
      teams: t2Teams,
      standings,
      topRunGetters: leaderboards.topRunGetters,
      topWicketTakers: leaderboards.topWicketTakers,
      topContributors: leaderboards.topContributors,
      fixtures: allFixtures,
      squads: (tournament2Json as any).squads || [],
      mvp: leaderboards.mvp,
      champions: standings.length > 0 && dbMatches.length > 0 ? standings[0].team : null,
      runnerUp: standings.length > 1 && dbMatches.length > 0 ? standings[1].team : null,
    };
  }

  // Default: Tournament 1 (Desi Boys Tournament May 2026)
  const t1Teams = (tournament1Json as any).teams || [
    { name: "DesiTigers", captain: "Manthan Shah", badge: "D", color: "emerald" },
    { name: "VPGR", captain: "Himanshu Kalyani", badge: "V", color: "purple" },
    { name: "DesiDabanggs", captain: "Darshan Mody", badge: "D", color: "amber" },
    { name: "DesiTitans", captain: "Hardik Desai", badge: "D", color: "blue" },
  ];
  const teamNames = t1Teams.map((t: any) => t.name);

  let dbMatches: any[] = [];
  let dbStats: any[] = [];

  try {
    dbMatches = await prisma.match.findMany({
      where: { tournamentId: 1 },
      include: {
        homeTeam: true,
        awayTeam: true,
        potmPlayer: true,
      },
      orderBy: { id: "asc" },
    });

    dbStats = await prisma.playerMatchStat.findMany({
      where: {
        match: { tournamentId: 1 },
      },
      include: {
        player: true,
      },
    });
  } catch (e) {
    console.warn("Could not query DB matches for Tournament 1:", e);
  }

  // Calculate dynamic standings and leaderboards
  const standings = computeStandingsFromMatches(
    teamNames,
    dbMatches.length > 0 ? dbMatches : ((tournament1Json as any).fixtures as any[])
  );

  const leaderboards =
    dbStats.length >= 10
      ? computeLeaderboardsFromStats(dbStats)
      : {
          topRunGetters: (tournament1Json as any).topRunGetters as PlayerLeaderboardItem[],
          topWicketTakers: (tournament1Json as any).topWicketTakers as PlayerLeaderboardItem[],
          topContributors: (tournament1Json as any).topContributors as PlayerLeaderboardItem[],
          mvp: { name: "Ankush Goel", points: 48 },
        };

  const fixtures =
    dbMatches.length > 0
      ? dbMatches.map((m) => ({
          id: m.id,
          date: m.matchDate,
          stage: m.id === 5 ? "Championship Final" : m.id === 6 ? "3rd Place Playoff" : "Group Match",
          team1: m.homeTeam?.name || "Home",
          score1: m.homeScore,
          winner1: m.homeScore > m.awayScore,
          team2: m.awayTeam?.name || "Away",
          score2: m.awayScore,
          winner2: m.awayScore > m.homeScore,
          potm: m.potmPlayer?.canonicalName || "TBD",
          scorecardUrl: `/matches/${m.id}`,
        }))
      : (tournament1Json as any).fixtures;

  return {
    id: 1,
    title: (tournament1Json as any).title,
    dates: "11 May — 18 May 2026",
    venue: "Insportz Club, Dubai",
    hasPointsTable: true,
    teams: t1Teams,
    standings,
    topRunGetters: leaderboards.topRunGetters,
    topWicketTakers: leaderboards.topWicketTakers,
    topContributors: leaderboards.topContributors,
    fixtures,
    squads: (tournament1Json as any).squads,
    mvp: leaderboards.mvp || { name: "Ankush Goel", points: 48 },
    champions: standings[0]?.team || "DesiTigers",
    runnerUp: standings[1]?.team || "VPGR",
  };
}
