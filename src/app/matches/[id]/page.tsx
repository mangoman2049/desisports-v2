import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MATCH_ANALYSES, MatchTacticalAnalysis } from "@/lib/match-analyses";
import { generateDeterministicMatchAnalysis } from "@/lib/match-analyzer";
import MatchViewClient from "./MatchViewClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const matchIdNum = parseInt(id, 10);
  let analysis = MATCH_ANALYSES[id];

  if (!isNaN(matchIdNum)) {
    try {
      const dbMatch = await prisma.match.findUnique({
        where: { id: matchIdNum },
        include: { homeTeam: true, awayTeam: true },
      });
      if (dbMatch) {
        if (dbMatch.tacticalAnalysis) {
          try {
            analysis = JSON.parse(dbMatch.tacticalAnalysis);
          } catch {}
        }
        const h = dbMatch.homeTeam.name.toLowerCase().replace(/\s+/g, "");
        const a = dbMatch.awayTeam.name.toLowerCase().replace(/\s+/g, "");
        if (analysis) {
          const ct = (analysis.matchTitle || "").toLowerCase().replace(/\s+/g, "");
          if (!ct.includes(h) || !ct.includes(a)) {
            const found = Object.values(MATCH_ANALYSES).find((cand) => {
              const c = (cand.matchTitle || "").toLowerCase().replace(/\s+/g, "");
              return c.includes(h) && c.includes(a);
            });
            if (found) analysis = found;
          }
        }
      }
    } catch {}
  }

  if (analysis) {
    return {
      title: `${analysis.matchTitle} — Match Analysis | DesiSports`,
      description: `${analysis.editorHeadline} • ${analysis.scoreSummary}`,
      openGraph: {
        title: `${analysis.matchTitle} — Post-Match Tactical Analysis`,
        description: analysis.editorSummary,
        images: ["/images/logo.png"],
      },
    };
  }
  return {
    title: `Match #${id} Analysis | DesiSports`,
    description: "Indoor Cricket Post-Match Tactical Analysis & Evidence-Led Intelligence",
  };
}

export default async function MatchDetailPage({ params }: Props) {
  const { id } = await params;
  const matchIdNum = parseInt(id, 10);

  // 1. Try to fetch Match from Prisma
  let dbMatch: any = null;
  if (!isNaN(matchIdNum)) {
    dbMatch = await prisma.match.findUnique({
      where: { id: matchIdNum },
      include: {
        homeTeam: true,
        awayTeam: true,
        tournament: true,
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
  }

  // 2. Resolve Tactical Analysis
  let analysis: MatchTacticalAnalysis | null = null;

  if (dbMatch?.tacticalAnalysis) {
    try {
      analysis = JSON.parse(dbMatch.tacticalAnalysis);
    } catch {}
  }

  if (!analysis && MATCH_ANALYSES[id]) {
    analysis = MATCH_ANALYSES[id];
  }

  // Strict Team-Matching Integrity Guard
  const matchesTeams = (a: MatchTacticalAnalysis, home: string, away: string) => {
    const title = (a.matchTitle || "").toLowerCase().replace(/\s+/g, "");
    const winner = (a.winner || "").toLowerCase().replace(/\s+/g, "");
    const loser = (a.loser || "").toLowerCase().replace(/\s+/g, "");
    const h = home.toLowerCase().replace(/\s+/g, "");
    const aTeam = away.toLowerCase().replace(/\s+/g, "");

    const hasHome = title.includes(h) || winner.includes(h) || loser.includes(h);
    const hasAway = title.includes(aTeam) || winner.includes(aTeam) || loser.includes(aTeam);
    return hasHome && hasAway;
  };

  if (dbMatch && analysis) {
    if (!matchesTeams(analysis, dbMatch.homeTeam.name, dbMatch.awayTeam.name)) {
      console.warn(
        `[Integrity Guard] Analysis mismatch for match #${id}: "${analysis.matchTitle}" does not match ${dbMatch.homeTeam.name} vs ${dbMatch.awayTeam.name}. Searching for correct analysis.`
      );
      analysis = null;
    }
  }

  if (dbMatch && !analysis) {
    for (const candidate of Object.values(MATCH_ANALYSES)) {
      if (matchesTeams(candidate, dbMatch.homeTeam.name, dbMatch.awayTeam.name)) {
        analysis = candidate;
        break;
      }
    }
  }

  // If still not available and dbMatch exists, generate grounded deterministic analysis
  if (!analysis && dbMatch) {
    analysis = generateDeterministicMatchAnalysis(matchIdNum, {
      homeInnings: {
        teamName: dbMatch.homeTeam.name,
        totalRuns: dbMatch.homeScore,
        skins: dbMatch.innings?.[0]?.skins || [],
        playerSummaries: dbMatch.playerStats
          ?.filter((ps: any) => ps.teamId === dbMatch.homeTeamId)
          .map((ps: any) => ({
            name: ps.player.canonicalName,
            runsScored: ps.runsScored,
            oversBowled: ps.oversBowled,
            runsConceded: ps.runsConceded,
            wickets: ps.wickets,
            contribution: ps.runsScored - ps.runsConceded,
          })),
      },
      awayInnings: {
        teamName: dbMatch.awayTeam.name,
        totalRuns: dbMatch.awayScore,
        skins: dbMatch.innings?.[1]?.skins || [],
        playerSummaries: dbMatch.playerStats
          ?.filter((ps: any) => ps.teamId === dbMatch.awayTeamId)
          .map((ps: any) => ({
            name: ps.player.canonicalName,
            runsScored: ps.runsScored,
            oversBowled: ps.oversBowled,
            runsConceded: ps.runsConceded,
            wickets: ps.wickets,
            contribution: ps.runsScored - ps.runsConceded,
          })),
      },
      matchInfo: {
        dateTime: dbMatch.matchDate,
        venue: "Insportz Club, Dubai (Court 1)",
      },
    });
  }

  // If neither dbMatch nor MATCH_ANALYSES has this id, check uploads or return 404
  if (!analysis) {
    const upload = await prisma.scorecardUpload.findUnique({
      where: { id },
    });
    if (upload?.tacticalAnalysis) {
      try {
        analysis = JSON.parse(upload.tacticalAnalysis);
      } catch {}
    }
  }

  if (!analysis) {
    notFound();
  }

  // Extract score summary details
  const homeTeam = {
    name: dbMatch?.homeTeam?.name || analysis.winner || "Home Team",
    score: dbMatch?.homeScore ?? (analysis.scoreSummary ? parseInt(analysis.scoreSummary.match(/\d+/)?.[0] || "0") : 0),
    skins: dbMatch?.homeSkins ?? 3,
  };

  const awayTeam = {
    name: dbMatch?.awayTeam?.name || analysis.loser || "Away Team",
    score: dbMatch?.awayScore ?? (analysis.scoreSummary ? parseInt(analysis.scoreSummary.match(/def\.\s+\w+\s+(\d+)/)?.[1] || "0") : 0),
    skins: dbMatch?.awaySkins ?? 1,
  };

  const scorecardData = dbMatch
    ? {
        playerStats: dbMatch.playerStats.map((ps: any) => ({
          playerId: ps.playerId,
          playerName: ps.player.canonicalName,
          runsScored: ps.runsScored,
          oversBowled: ps.oversBowled,
          runsConceded: ps.runsConceded,
          wickets: ps.wickets,
          netContribution: ps.runsScored - ps.runsConceded,
        })),
      }
    : undefined;

  const MATCH_SCORECARDS: Record<string, string> = {
    "1": "https://desisports.milanchheda.com/storage/scorecards/iVA2RZBZK6iu9zaGBGZKItLdkqaL4D7uGPGTpKUg.jpg",
    "2": "https://desisports.milanchheda.com/storage/scorecards/ahMNeOGe8h6R3xV5sq5P0Xv7OwneTh1iEySuZ4QG.jpg",
    "3": "https://desisports.milanchheda.com/storage/scorecards/OSxCBhl68FJzczLG5nBPIxsPMKNouscmLC936huM.jpg",
    "4": "https://desisports.milanchheda.com/storage/scorecards/wzkviHxARCTmAmyOnHxyBj86n866Nw2u2wjM7DMT.jpg",
    "5": "https://desisports.milanchheda.com/storage/scorecards/JJ4WJyjlzrzj4wUxrNPRifw8lnqx9RHVFIHOqZh1.jpg",
    "6": "https://desisports.milanchheda.com/storage/scorecards/S9vHrbIiDufP0ER2db9P9KNMAA0KELPojHx15lot.jpg",
    "7": "/uploads/scorecards/sample-scorecard.jpg",
    "8": "/uploads/scorecards/scorecard-8.webp",
  };

  let rawScorecardUrl = MATCH_SCORECARDS[String(id)] || dbMatch?.scorecardUrl;
  let scorecardUrl = rawScorecardUrl;
  if (!scorecardUrl || scorecardUrl.includes("/review") || scorecardUrl.startsWith("/matches/")) {
    scorecardUrl = MATCH_SCORECARDS[String(id)] || `/api/scorecards/${id}/image`;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <MatchViewClient
        matchId={id}
        matchTitle={analysis.matchTitle}
        tournamentName={analysis.tournamentName || dbMatch?.tournament?.name || "Desi Boys Tournament May 2026"}
        matchDate={analysis.date || dbMatch?.matchDate || "May 2026"}
        venue={analysis.venue || "Insportz Club, Dubai"}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        analysis={analysis}
        scorecardData={scorecardData}
        scorecardUrl={scorecardUrl}
      />
    </div>
  );
}
