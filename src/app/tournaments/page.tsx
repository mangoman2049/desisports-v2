import Link from "next/link";
import { Trophy, ArrowRight, Shield } from "lucide-react";

export default function TournamentsPage() {
  const standings = [
    { rank: 1, name: "Desi Tigers", p: 3, w: 3, l: 0, t: 0, forRuns: 327, againstRuns: 216, diff: "+111", pts: 16 },
    { rank: 2, name: "VPGR", p: 3, w: 2, l: 1, t: 0, forRuns: 322, againstRuns: 208, diff: "+114", pts: 15 },
    { rank: 3, name: "Desi Dabanggs", p: 3, w: 1, l: 2, t: 0, forRuns: 203, againstRuns: 337, diff: "-134", pts: 6 },
    { rank: 4, name: "Spawtz Challengers", p: 3, w: 0, l: 3, t: 0, forRuns: 195, againstRuns: 286, diff: "-91", pts: 3 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
              Active Tournament
            </span>
            <span className="text-xs font-mono text-slate-500">Spawtz Indoor Rules</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Desi Boys Tournament May 2026
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            16-over matches, 4 skins per fixture, bonus skin points, and -5 run dismissal penalties.
          </p>
        </div>

        <Link
          href="/captain"
          className="flex items-center gap-2 py-2 px-3 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition self-start sm:self-auto"
        >
          <Shield className="h-3.5 w-3.5" />
          <span>Captain Squad Intel</span>
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Tournament Standings
          </span>
          <span className="text-xs text-slate-400 font-mono">Top 2 advance to Final</span>
        </div>

        <div className="overflow-x-auto">
          <table className="sports-table text-xs">
            <thead>
              <tr>
                <th className="w-10">#</th>
                <th>Team</th>
                <th>P</th>
                <th>W</th>
                <th>L</th>
                <th>T</th>
                <th>For</th>
                <th>Agst</th>
                <th>Diff</th>
                <th className="text-right">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s) => (
                <tr key={s.rank}>
                  <td className="font-mono font-bold text-slate-400">{s.rank}</td>
                  <td className="font-bold text-slate-900 dark:text-white">{s.name}</td>
                  <td className="font-mono">{s.p}</td>
                  <td className="font-mono">{s.w}</td>
                  <td className="font-mono">{s.l}</td>
                  <td className="font-mono">{s.t}</td>
                  <td className="font-mono">{s.forRuns}</td>
                  <td className="font-mono">{s.againstRuns}</td>
                  <td className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {s.diff}
                  </td>
                  <td className="font-mono font-black text-right text-slate-900 dark:text-white">
                    {s.pts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
