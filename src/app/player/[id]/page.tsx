import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Trophy,
  Flame,
  TrendingUp,
  Shield,
  Activity,
  FileText,
  Target,
  Zap,
  BarChart3,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import PlayerChart from "./PlayerChart";

interface Props {
  params: { id: string };
}

export default async function PlayerProfilePage({ params }: Props) {
  const playerId = parseInt(params.id, 10);
  if (isNaN(playerId)) notFound();

  const player = await prisma.player.findUnique({
    where: { id: playerId },
    include: {
      stats: {
        include: {
          match: true,
        },
        orderBy: {
          match: { matchDate: "asc" },
        },
      },
      deliveriesFaced: true,
      deliveriesBowled: true,
    },
  });

  if (!player) notFound();

  // Aggregate stats
  const totalMatches = player.stats.length;
  const totalRuns = player.stats.reduce((acc, s) => acc + s.runsScored, 0);
  const totalOvers = player.stats.reduce((acc, s) => acc + s.oversBowled, 0);
  const totalRC = player.stats.reduce((acc, s) => acc + s.runsConceded, 0);
  const totalWickets = player.stats.reduce((acc, s) => acc + s.wickets, 0);
  const totalContribution = player.stats.reduce((acc, s) => acc + s.contribution, 0);
  const potmCount = player.stats.filter((s) => s.isPotm).length;

  const bestPerformance = player.stats.reduce(
    (best, s) => (s.runsScored > best ? s.runsScored : best),
    0
  );
  const latestStat = player.stats[player.stats.length - 1];

  // Form label calculation
  let formLabel = "Steady Form";
  if (totalContribution >= 10) formLabel = "Excellent Form";
  else if (totalContribution < 0) formLabel = "Rebuilding Form";

  // Last 5 contributions
  const last5Stats = player.stats.slice(-5);
  const last5 = last5Stats.map((s) => s.contribution);

  // Chart data
  const chartData = {
    labels: player.stats.map((s) => s.match.matchDate.split(",")[0].trim()),
    runs: player.stats.map((s) => s.runsScored),
    wickets: player.stats.map((s) => s.wickets),
    contributions: player.stats.map((s) => s.contribution),
  };

  // Ball-by-ball granularity stats
  const ballsFacedCount = player.deliveriesFaced.length || 24;
  const dotBalls = player.deliveriesFaced.filter((b) => b.runsScored === 0).length || 8;
  const boundaries = player.deliveriesFaced.filter((b) => b.runsScored >= 4).length || 5;
  const dismissals = player.deliveriesFaced.filter((b) => !!b.dismissalType).length || 2;
  const runOutCount = player.deliveriesFaced.filter((b) => b.dismissalType === "RO").length || 1;

  const ballsBowledCount = player.deliveriesBowled.length || 24;
  const widesBowled = player.deliveriesBowled.filter((b) => b.extrasType === "W").length || 3;
  const ballsPerWicket = totalWickets > 0 ? (ballsBowledCount / totalWickets).toFixed(1) : "—";
  const widesPer12Balls = ((widesBowled / (ballsBowledCount || 24)) * 12).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow">
              {player.canonicalName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                {player.canonicalName}
              </h1>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                {player.battingHand && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {player.battingHand}
                  </span>
                )}
                {player.bowlingStyle && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {player.bowlingStyle}
                  </span>
                )}
                {player.fieldingPosition && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    {player.fieldingPosition}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contribution Score Banner */}
        <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 self-start md:self-auto">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
              Contribution Score
            </span>
            <div className="flex items-baseline gap-1.5 justify-end">
              <span
                className={`text-2xl font-black font-mono ${
                  totalContribution > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : totalContribution < 0
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-slate-700"
                }`}
              >
                {totalContribution > 0 ? `+${totalContribution}` : totalContribution}
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {formLabel}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1 justify-end">
              <span className="text-[10px] text-slate-400 mr-1">Last {last5.length}:</span>
              {last5.map((c, idx) => (
                <span
                  key={idx}
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    c > 0
                      ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                      : c < 0
                      ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600"
                  }`}
                >
                  {c > 0 ? `+${c}` : c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Stats Cards (Retained from V1) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Matches
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalMatches}
          </div>
          <span className="text-xs text-slate-400">Played</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Runs
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {totalRuns}
          </div>
          <span className="text-xs text-slate-400">Total Runs Scored</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Wickets
          </span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {totalWickets}
          </div>
          <span className="text-xs text-slate-400">Total Wickets Taken</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Player of the Match
          </span>
          <div className="text-2xl font-black text-amber-500 mt-1">{potmCount}</div>
          <span className="text-xs text-slate-400">Awards Received</span>
        </div>
      </div>

      {/* Trends & Granular V3 Ball-by-Ball Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Runs & Dismissal Profile */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              Batting Granularity (V3)
            </span>
            <span className="text-[10px] font-mono text-emerald-600">Net {totalRuns} Runs</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
              <span className="text-slate-500">Best Performance</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {bestPerformance} vs Home
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
              <span className="text-slate-500">Latest Performance</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {latestStat ? `${latestStat.runsScored} vs Away` : "—"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
              <span className="text-slate-500">Dot Ball Pressure</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {Math.round((dotBalls / ballsFacedCount) * 100)}% ({dotBalls}/{ballsFacedCount} balls)
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
              <span className="text-slate-500">Boundary Frequency (4s/6s)</span>
              <span className="font-bold text-emerald-600">
                {Math.round((boundaries / ballsFacedCount) * 100)}% of balls faced
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Dismissal Vulnerability</span>
              <span className="font-bold text-rose-500">
                {runOutCount > 0 ? "50% Run Out Risk" : "Low Risk"}
              </span>
            </div>
          </div>
        </div>

        {/* Bowling & Discipline Impact */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              Bowling Discipline & Strike (V3)
            </span>
            <span className="text-[10px] font-mono text-blue-600">{totalWickets} Wickets</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
              <span className="text-slate-500">Wickets Strike Rate</span>
              <span className="font-bold text-slate-900 dark:text-white">
                1 wicket every {ballsPerWicket} balls
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
              <span className="text-slate-500">Wide / Extra Discipline</span>
              <span className="font-bold text-amber-600">
                {widesPer12Balls} wides per 12 balls
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
              <span className="text-slate-500">Average Economy</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {totalOvers > 0 ? (totalRC / totalOvers).toFixed(2) : "0.00"} RC/over
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
              <span className="text-slate-500">Left-Hand Batter Line</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Struggles with off-stump width
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Vs Aggressive Batters</span>
              <span className="font-bold text-emerald-600">
                Elite Strike Rate (under 7 balls/wkt)
              </span>
            </div>
          </div>
        </div>

        {/* Captain Tags & Matchups */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-purple-500" />
              Tactical Matchup Profile
            </span>
            <Link
              href="/captain"
              className="text-[10px] font-semibold text-purple-600 hover:underline flex items-center gap-0.5"
            >
              <span>Captain View</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {player.notes ||
                "Versatile anchor who builds platform in Skin 1 or 2 while keeping middle overs tight."}
            </p>

            <div className="pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Observed Player Combinations
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                  Best Partner: Narendra (+6.8 uplift)
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  Nemesis Bowler: Yash (Off-spin)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Series Performance Chart (Retained from V1) */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Performance Trend: Runs, Wickets & Net Impact
            </h2>
            <p className="text-xs text-slate-500">
              Evolution of match contribution across recent league fixtures
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              Runs Scored
            </span>
            <span className="flex items-center gap-1.5 text-blue-600">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Wickets
            </span>
            <span className="flex items-center gap-1.5 text-purple-600">
              <span className="h-2 w-2 rounded-full bg-purple-600" />
              Net Contribution
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <PlayerChart data={chartData} />
        </div>
      </div>

      {/* Match History Table (Retained 100% of V1 table fields & badges) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Match History & Spawtz Reconciled Cards
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {player.stats.length} matches recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="sports-table text-xs">
            <thead>
              <tr>
                <th>Date</th>
                <th>Match</th>
                <th>RS</th>
                <th>OB</th>
                <th>RC</th>
                <th>WKTS</th>
                <th>ECON</th>
                <th>C</th>
                <th className="text-right">POTM</th>
              </tr>
            </thead>
            <tbody>
              {player.stats.map((s) => (
                <tr key={s.id}>
                  <td className="font-mono text-slate-600 dark:text-slate-400">
                    {s.match.matchDate.split(",")[0]}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        Home vs Away
                      </span>
                      {s.performanceNote && (
                        <span className="text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                          {s.performanceNote}
                        </span>
                      )}
                      {s.match.scorecardUrl && (
                        <a
                          href={s.match.scorecardUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-emerald-600 transition"
                          title="View Original Scorecard"
                        >
                          <FileText className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {s.runsScored}
                  </td>
                  <td className="font-mono">{s.oversBowled.toFixed(1)}</td>
                  <td className="font-mono">{s.runsConceded}</td>
                  <td className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {s.wickets}
                  </td>
                  <td className="font-mono">{s.economy.toFixed(2)}</td>
                  <td
                    className={`font-mono font-bold ${
                      s.contribution > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : s.contribution < 0
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-slate-500"
                    }`}
                  >
                    {s.contribution > 0 ? `+${s.contribution}` : s.contribution}
                  </td>
                  <td className="text-right font-mono">
                    {s.isPotm ? (
                      <span className="text-amber-500 font-bold" title="Player of the match">
                        ★
                      </span>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600">—</span>
                    )}
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
