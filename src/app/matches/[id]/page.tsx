import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MATCH_ANALYSES, MatchTacticalAnalysis } from "@/lib/match-analyses";
import { generateDeterministicMatchAnalysis } from "@/lib/match-analyzer";
import MatchViewClient from "./MatchViewClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const analysis = MATCH_ANALYSES[id];
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
      />
    </div>
  );
}
