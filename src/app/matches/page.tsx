import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Trophy, ArrowRight, FileText, UploadCloud } from "lucide-react";

export default async function MatchesPage() {
  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
      potmPlayer: true,
    },
    orderBy: { id: "asc" },
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
          <div
            key={m.id}
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono pb-2 border-b border-slate-100 dark:border-slate-800">
                <span>{m.matchDate}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                  {m.status}
                </span>
              </div>

              {/* Match Scoreboard */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded bg-slate-100 dark:bg-slate-800 font-black text-[11px] flex items-center justify-center text-slate-700 dark:text-slate-300">
                      H
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {m.homeTeam.name}
                    </span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      {m.homeScore}
                    </span>
                    <span className="text-xs text-slate-400 ml-1.5">
                      ({m.homeSkins} skins)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded bg-emerald-100 dark:bg-emerald-950/80 font-black text-[11px] flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                      A
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {m.awayTeam.name}
                    </span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {m.awayScore}
                    </span>
                    <span className="text-xs text-slate-400 ml-1.5">
                      ({m.awaySkins} skins)
                    </span>
                  </div>
                </div>
              </div>

              {m.potmPlayer && (
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <Trophy className="h-3.5 w-3.5" />
                  <span>Player of the Match: {m.potmPlayer.canonicalName}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-400 font-mono">
                {m.umpire ? `Umpire: ${m.umpire}` : "Spawtz League"}
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href="/admin/scorecards/upload-demo-01/review"
                  className="font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <span>Scorecard Inspection</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
