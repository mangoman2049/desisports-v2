import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Search, ArrowRight, Activity } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PlayersDirectoryPage() {
  const players = await prisma.player.findMany({
    include: {
      stats: true,
    },
    orderBy: { canonicalName: "asc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
              League Roster
            </span>
            <span className="text-xs font-mono text-slate-500">{players.length} Registered Players</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Players Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Profiles, batting/bowling styles, cumulative contributions, and ball-by-ball performance metrics.
          </p>
        </div>

        <Link
          href="/player/35"
          className="flex items-center gap-2 py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition self-start sm:self-auto"
        >
          <span>View Manish Pandey (Demo)</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((p) => {
          const matchCount = p.stats.length;
          const totalRuns = p.stats.reduce((acc, s) => acc + s.runsScored, 0);
          const totalWickets = p.stats.reduce((acc, s) => acc + s.wickets, 0);
          const totalContrib = p.stats.reduce((acc, s) => acc + s.contribution, 0);

          return (
            <Link
              key={p.id}
              href={`/player/${p.id}`}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 hover:shadow-md transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-600 text-slate-700 dark:text-slate-300 group-hover:text-white font-bold text-xs flex items-center justify-center transition">
                      {p.canonicalName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                        {p.canonicalName}
                      </h3>
                      <span className="text-[11px] text-slate-500">
                        {matchCount} {matchCount === 1 ? "match" : "matches"}
                      </span>
                    </div>
                  </div>

                  {totalContrib !== 0 && (
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        totalContrib > 0
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
                          : "bg-rose-50 dark:bg-rose-950/40 text-rose-600"
                      }`}
                    >
                      {totalContrib > 0 ? `+${totalContrib}` : totalContrib}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {p.battingHand && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {p.battingHand}
                    </span>
                  )}
                  {p.fieldingPosition && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {p.fieldingPosition}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
                <span className="text-slate-500">
                  Runs: <b>{totalRuns}</b>
                </span>
                <span className="text-slate-500">
                  Wickets: <b>{totalWickets}</b>
                </span>
                <span className="text-emerald-600 flex items-center gap-0.5 text-[11px] font-sans font-semibold">
                  <span>Profile</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
