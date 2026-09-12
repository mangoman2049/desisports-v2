import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { UploadCloud } from "lucide-react";
import MatchCard from "@/components/MatchCard";

export default async function MatchesPage() {
  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
      potmPlayer: true,
      tournament: true,
    },
    orderBy: { id: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
              League Fixtures
            </span>
            <span className="text-xs font-mono text-slate-500">{matches.length} Matches</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Matches & Reconciled Cards
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Indoor cricket Spawtz fixtures, skin results, and ball-by-ball delivery event logs.
          </p>
        </div>

        <Link
          href="/admin/scorecards/new"
          className="flex items-center gap-2 py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition self-start sm:self-auto"
        >
          <UploadCloud className="h-3.5 w-3.5" />
          <span>Upload New Scorecard</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map((m) => (
          <MatchCard
            key={m.id}
            id={m.id}
            date={m.matchDate}
            tournamentName={m.tournament?.name || (m.tournamentId === 0 ? "Regular Practice" : "Desi Boys May 2026")}
            status={m.status}
            umpire={m.umpire || undefined}
            team1={{
              name: m.homeTeam.name,
              score: m.homeScore,
              skins: m.homeSkins,
              isWinner: m.homeScore > m.awayScore,
            }}
            team2={{
              name: m.awayTeam.name,
              score: m.awayScore,
              skins: m.awaySkins,
              isWinner: m.awayScore > m.homeScore,
            }}
            potm={m.potmPlayer?.canonicalName}
            scorecardUrl={m.scorecardUrl || `/matches/${m.id}`}
          />
        ))}
      </div>
    </div>
  );
}
