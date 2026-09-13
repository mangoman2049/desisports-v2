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
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { RunsTrendChart, ContributionMomentumChart } from "./PlayerChart";
import { getPlayerTacticalInfo } from "@/lib/player-tactical";
import PlayerAvatar from "@/components/PlayerAvatar";
import PlayerMatchHistoryTable, { MatchHistoryItem } from "./PlayerMatchHistoryTable";

interface Props {
  params: { id: string };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PlayerProfilePage({ params }: Props) {
  const playerId = parseInt(params.id, 10);
  if (isNaN(playerId)) notFound();

  let player = await prisma.player.findUnique({
    where: { id: playerId },
    include: {
      stats: {
        include: {
          match: {
            include: {
              homeTeam: true,
              awayTeam: true,
            },
          },
        },
      },
      deliveriesFaced: true,
      deliveriesBowled: true,
    },
  });

  if (!player) {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const jsonPath = path.join(process.cwd(), "prisma", "tournament_1_data.json");
      if (fs.existsSync(jsonPath)) {
        const t1Data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
        let pName = "";
        for (const squad of t1Data.squads || []) {
          const matchP = squad.players?.find((sp: any) => String(sp.id) === String(playerId));
          if (matchP) {
            pName = matchP.name;
            break;
          }
        }
        if (!pName) {
          const matchRun = t1Data.topRunGetters?.find((tp: any) => String(tp.playerId) === String(playerId));
          if (matchRun) pName = matchRun.name;
        }
        if (pName) {
          player = await prisma.player.upsert({
            where: { id: playerId },
            update: {},
            create: {
              id: playerId,
              canonicalName: pName,
              battingHand: "Right Hand",
              bowlingStyle: "Right Arm Medium",
              fieldingPosition: "Cover",
              notes: "Tournament squad registered player.",
            },
            include: {
              stats: {
                include: {
                  match: {
                    include: {
                      homeTeam: true,
                      awayTeam: true,
                    },
                  },
                },
              },
              deliveriesFaced: true,
              deliveriesBowled: true,
            },
          });
        }
      }
    } catch (e) {
      console.error("Fallback player lookup error:", e);
    }
  }

  if (!player) notFound();

  const hasMatchData = player.stats && player.stats.length > 0;
  const tactical = getPlayerTacticalInfo(player.canonicalName);

  // Chronological sort: oldest to newest for charts (so latest match is on the far right)
  const chronologicalStats = hasMatchData
    ? [...player.stats].sort((a, b) => new Date(a.match.matchDate).getTime() - new Date(b.match.matchDate).getTime())
    : [];

  // Compute aggregate statistics (ZERO hallucination for 0-match players)
  const totalMatches = player.stats.length;
  const totalRuns = hasMatchData ? player.stats.reduce((acc, s) => acc + s.runsScored, 0) : 0;
  const totalWickets = hasMatchData ? player.stats.reduce((acc, s) => acc + s.wickets, 0) : 0;
  const totalContribution = hasMatchData ? player.stats.reduce((acc, s) => acc + s.contribution, 0) : 0;
  const potmCount = hasMatchData ? player.stats.filter((s) => s.isPotm).length : 0;
  const totalDismissals = hasMatchData
    ? player.stats.reduce((acc, s) => acc + ((s as any).timesOut || 0), 0)
    : 0;

  const bestPerformanceStat = hasMatchData
    ? player.stats.reduce((best, s) => (s.runsScored > best.runsScored ? s : best), player.stats[0])
    : null;
  const latestStat = hasMatchData
    ? chronologicalStats[chronologicalStats.length - 1]
    : null;

  const last5Stats = chronologicalStats.slice(-5);
  const last5 = last5Stats.map((s) => s.contribution);

  const dates = chronologicalStats.map((s) => s.match.matchDate.split(",")[0].trim());
  const runsArray = chronologicalStats.map((s) => s.runsScored);
  const contributionsArray = chronologicalStats.map((s) => s.contribution);

  // Wickets impact sequence
  const wicketMatches = chronologicalStats.filter((s) => s.wickets > 0);

  const matchHistoryItems: MatchHistoryItem[] = player.stats.map((s) => ({
    id: s.id,
    matchId: s.matchId,
    matchDate: s.match.matchDate,
    opponentTitle: s.match.homeTeam && s.match.awayTeam
      ? `${s.match.homeTeam.name} vs ${s.match.awayTeam.name}`
      : "Spawtz Match",
    scorecardUrl: s.match.scorecardUrl,
    runsScored: s.runsScored,
    outs: (s as any).timesOut || 0,
    oversBowled: s.oversBowled,
    runsConceded: s.runsConceded,
    wickets: s.wickets,
    economy: s.economy,
    contribution: s.contribution,
    isPotm: s.isPotm,
    performanceNote: s.performanceNote,
  }));

  return (
    <div className="space-y-6 pb-12 font-sans antialiased text-slate-800">
      {/* Top Profile Card (Exact replica of media_1789207004196.jpg) */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 bg-white shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar with vector cricket iconography */}
          <PlayerAvatar
            name={player.canonicalName}
            role={player.bowlingStyle || player.notes || "Cricket Player"}
            size="xl"
            showRoleBadge
          />

          {/* Name & Badges */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 uppercase">
              {player.canonicalName}
            </h1>

            {/* Badges in pastel colors */}
            <div className="flex flex-wrap items-center gap-2">
              {player.battingHand && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80">
                  {player.battingHand}
                </span>
              )}
              {player.bowlingStyle && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200/80">
                  {player.bowlingStyle}
                </span>
              )}
              {player.fieldingPosition && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
                  {player.fieldingPosition}
                </span>
              )}
            </div>

            {/* Contribution Score */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Contribution Score
              </span>
              <div className="flex items-center gap-2.5 mt-0.5">
                <span className="text-3xl font-black text-emerald-500 font-mono tracking-tight flex items-baseline">
                  {totalContribution > 0 ? `+${totalContribution}` : totalContribution}
                  <span className="text-xl ml-1">^</span>
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/70">
                  Steady Form
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Keep pushing for more.</p>
            </div>
          </div>
        </div>

        {/* Top Right: Last 5 Matches (Contribution) & Sparkline */}
        <div className="lg:text-right space-y-2 self-start lg:self-center border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Last 5 Matches <span className="text-slate-400 font-normal">(Contribution)</span>
          </span>

          {/* 5 Pills */}
          <div className="flex items-center lg:justify-end gap-1.5">
            {last5.map((c, idx) => (
              <span
                key={idx}
                className={`w-9 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center shadow-2xs ${
                  c > 0
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300/80"
                    : c < 0
                    ? "bg-rose-100 text-rose-800 border border-rose-300/80"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {c > 0 ? `+${c}` : c}
              </span>
            ))}
          </div>

          {/* Mini 5-point curved trend line */}
          <div className="w-48 lg:ml-auto pt-1">
            <svg viewBox="0 0 160 40" className="w-full h-8 overflow-visible">
              <path
                d="M 10 32 Q 40 28, 70 18 T 130 22 T 155 8"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="10" cy="32" r="3.5" fill="#ef4444" />
              <circle cx="45" cy="26" r="3.5" fill="#ef4444" />
              <circle cx="85" cy="18" r="3.5" fill="#10b981" />
              <circle cx="125" cy="22" r="3.5" fill="#10b981" />
              <circle cx="155" cy="8" r="4" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
              <span className="text-rose-500 font-bold">Good</span>
              <span>Last 5 Matches</span>
              <span className="text-emerald-500 font-bold">Poor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row of 6 Key Stat Cards with Sparklines (Exact replica of media_1789207004196.jpg) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Matches */}
        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              📊
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Matches
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-mono leading-none">
              {totalMatches}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Played</span>
          </div>
          <svg viewBox="0 0 100 24" className="w-full h-5">
            <path
              d="M 5 20 Q 30 18, 50 14 T 95 6"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Card 2: Runs */}
        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Runs
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-600 font-mono leading-none">
              {totalRuns}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Total Runs</span>
          </div>
          <svg viewBox="0 0 100 24" className="w-full h-5">
            <path
              d="M 5 12 Q 30 22, 50 16 T 95 10"
              fill="none"
              stroke="#9333ea"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Card 3: Wickets */}
        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
              🎯
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Wickets
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-rose-600 font-mono leading-none">
              {totalWickets}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Total Wickets</span>
          </div>
          <svg viewBox="0 0 100 24" className="w-full h-5">
            <path
              d="M 5 22 Q 40 18, 60 14 T 95 6"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Card 4: Player of Match */}
        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
              ★
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Player of Match
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-500 font-mono leading-none">
              {potmCount}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Awards</span>
          </div>
          <svg viewBox="0 0 100 24" className="w-full h-5">
            <path
              d="M 5 20 L 70 20 L 95 6"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Card 5: Times Out */}
        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs">
              ⏱
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Times Out
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-sky-600 font-mono leading-none">
              {totalDismissals}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Dismissals</span>
          </div>
          <svg viewBox="0 0 100 24" className="w-full h-5">
            <path
              d="M 5 20 L 95 20"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Card 6: Contribution */}
        <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              📈
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Contribution
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600 font-mono leading-none">
              {totalContribution > 0 ? `+${totalContribution}` : totalContribution}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Total</span>
          </div>
          <svg viewBox="0 0 100 24" className="w-full h-5">
            <path
              d="M 5 22 Q 40 18, 70 12 T 95 6"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Row of 3 Cards (Exact replica of media_1789207004196.jpg) */}
      {hasMatchData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Card 1: RUNS TREND */}
          <div className="p-6 rounded-3xl border border-slate-200/80 bg-white shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm">✏️</span>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Runs Trend
                  </span>
                </div>
              </div>

              <div className="flex items-baseline justify-between mt-3">
                <span className="text-2xl font-black text-slate-950 font-mono">
                  {totalRuns} <span className="text-xs font-semibold text-slate-500 font-sans">Total Runs</span>
                </span>
                <span className="text-xs font-bold text-emerald-600 font-mono bg-emerald-50 px-2 py-0.5 rounded-full">
                  {totalMatches} Matches
                </span>
              </div>

              {/* Curved Chart: Chronological (Oldest Left, Latest Right) */}
              <div className="pt-2">
                <RunsTrendChart dates={dates} runs={runsArray} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Best Performance
                </span>
                <span className="text-lg font-black text-emerald-600 font-mono">
                  {bestPerformanceStat?.runsScored ?? 0}
                </span>
                <span className="text-[11px] text-slate-500 block">Runs</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Latest Performance
                </span>
                <span className="text-lg font-black text-slate-900 font-mono">
                  {latestStat?.runsScored ?? 0}
                </span>
                <span className="text-[11px] text-slate-500 block">Runs</span>
              </div>
            </div>
          </div>

          {/* Card 2: WICKETS (MATCH IMPACT) */}
          <div className="p-6 rounded-3xl border border-slate-200/80 bg-white shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm">⚡</span>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Wickets (Match Impact)
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-2xl font-black text-purple-700 font-mono">
                  {totalWickets} <span className="text-xs font-semibold text-slate-500 font-sans">Total Wickets</span>
                </span>
              </div>

              {/* Sequence Circles Flow */}
              <div className="flex items-center justify-between gap-1 pt-6 pb-2 overflow-x-auto">
                {wicketMatches.slice(-4).map((m, idx, arr) => (
                  <div key={idx} className="flex items-center gap-1.5 shrink-0">
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-700 font-black text-lg flex items-center justify-center border-2 border-purple-200 shadow-2xs">
                        {m.wickets}
                      </div>
                      <span className="text-[9px] font-bold text-slate-600 mt-1">
                        {m.match.matchDate.split(",")[0].slice(0, 6)}
                      </span>
                      <span className="text-[8px] text-purple-600 font-medium">
                        {m.wickets} Wickets
                      </span>
                    </div>
                    {idx < arr.length - 1 && (
                      <span className="text-purple-400 font-black text-sm mb-4">▶</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Wicket Impact
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-bold text-slate-900">
                  {wicketMatches.length} Matches with wickets
                </span>
                <span className="text-lg">🔥</span>
              </div>
            </div>
          </div>

          {/* Card 3: CONTRIBUTION MOMENTUM */}
          <div className="p-6 rounded-3xl border border-slate-200/80 bg-white shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm">📈</span>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Contribution Momentum
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-2xl font-black text-emerald-600 font-mono">
                  {totalContribution > 0 ? `+${totalContribution}` : totalContribution}{" "}
                  <span className="text-xs font-semibold text-slate-500 font-sans">Total Contribution</span>
                </span>
              </div>

              {/* Gradient Area Chart: Chronological (Oldest Left, Latest Right) */}
              <div className="pt-2">
                <ContributionMomentumChart dates={dates} contributions={contributionsArray} />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Career Contribution</span>
              <span className="text-xs font-black text-emerald-600 flex items-center gap-0.5">
                <span>{totalContribution >= 0 ? "Positive Net" : "Negative Net"}</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Minimum 1 match data required
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Runs Trend, Wicket Sequences, and Contribution Momentum charts require at least 1 completed match scorecard to compute trends.
          </p>
        </div>
      )}

      {/* Tactical Profile & Batting Synergy */}
      {hasMatchData ? (
        <div className="p-6 rounded-3xl border border-purple-200/80 bg-purple-50/40 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-purple-200/60">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-black uppercase tracking-wider text-purple-900">
                Tactical Profile & Batting Synergy
              </span>
            </div>
            <span className="text-[10px] font-bold text-purple-700 bg-white px-2.5 py-0.5 rounded-full border border-purple-200">
              {tactical.tacticalRole}
            </span>
          </div>

          <p className="text-xs text-purple-950 leading-relaxed font-medium">
            {player.notes && !player.notes.includes("Tournament squad")
              ? player.notes
              : tactical.notes}
          </p>

          {/* Optimal Batting Partner Highlight */}
          <div className="p-4 rounded-2xl bg-white border border-purple-200/70 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Optimal Batting Partner
              </span>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>Partner: {tactical.optimalPartner}</span>
                <span className="text-purple-600 font-mono font-black text-xs">
                  (+{tactical.netSkinAvg} Net Skin Avg)
                </span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs shrink-0 self-start sm:self-auto font-mono">
              Synergy Uplift: +{tactical.synergyUplift} Runs
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-emerald-700 border border-emerald-200 shadow-2xs">
              Optimal Batting Partner: {tactical.optimalPartner} — +{tactical.netSkinAvg} Net Skin Avg with +{tactical.synergyUplift} synergy uplift
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-purple-700 border border-purple-200 shadow-2xs">
              ⚡ Elite Boundary Threat in Skin Overs
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-sky-700 border border-sky-200 shadow-2xs">
              🎯 Death Overs Containment Specialist
            </span>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl border border-dashed border-purple-300 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/20 text-center space-y-2">
          <Shield className="w-6 h-6 text-purple-600 mx-auto" />
          <h3 className="text-sm font-bold text-purple-950 dark:text-purple-200">
            Minimum 1 match data required
          </h3>
          <p className="text-xs text-purple-800 dark:text-purple-300 max-w-md mx-auto">
            Tactical Profile, Optimal Batting Partner Synergy, and Skin Net Ratings will be dynamically computed after {player.canonicalName} logs their first match.
          </p>
        </div>
      )}

      {/* Match History Table (In-line sortable, latest at top by default) */}
      <div className="p-6 rounded-3xl border border-slate-200/80 bg-white shadow-xs space-y-4 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-base">📅</span>
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Match History
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-semibold font-mono">
            {totalMatches} {totalMatches === 1 ? "Match" : "Matches"} Played
          </span>
        </div>

        <PlayerMatchHistoryTable matches={matchHistoryItems} />
      </div>
    </div>
  );
}
