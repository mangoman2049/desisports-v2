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
import { getPlayerTacticalInfo, getPlayerCareerDNA } from "@/lib/player-tactical";
import { AlertTriangle, CheckCircle2, Compass, Target, Zap } from "lucide-react";
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
      const t1Path = path.join(process.cwd(), "prisma", "tournament_1_data.json");
      const t2Path = path.join(process.cwd(), "prisma", "tournament_2_data.json");

      let pName = "";
      let pAvatar: string | null = null;
      let pRole = "Cover";
      let pNotes = "Tournament squad registered player.";

      // Check Tournament 2 first
      if (fs.existsSync(t2Path)) {
        const t2Data = JSON.parse(fs.readFileSync(t2Path, "utf-8"));
        for (const squad of t2Data.squads || []) {
          const matchP = squad.players?.find((sp: any) => String(sp.id) === String(playerId));
          if (matchP) {
            pName = matchP.name;
            pAvatar = matchP.avatar || null;
            pRole = matchP.isCaptain ? "Captain" : "Cover";
            pNotes = `Registered player for ${squad.team} in DesiBoys Bazooka 4.0.`;
            break;
          }
        }
      }

      // Check Tournament 1 if not found
      if (!pName && fs.existsSync(t1Path)) {
        const t1Data = JSON.parse(fs.readFileSync(t1Path, "utf-8"));
        for (const squad of t1Data.squads || []) {
          const matchP = squad.players?.find((sp: any) => String(sp.id) === String(playerId));
          if (matchP) {
            pName = matchP.name;
            pAvatar = matchP.avatar || null;
            break;
          }
        }
        if (!pName) {
          const matchRun = t1Data.topRunGetters?.find((tp: any) => String(tp.playerId) === String(playerId));
          if (matchRun) pName = matchRun.name;
        }
      }

      if (pName) {
        player = await prisma.player.upsert({
          where: { id: playerId },
          update: {
            canonicalName: pName,
            ...(pAvatar ? { avatarUrl: pAvatar } : {}),
          },
          create: {
            id: playerId,
            canonicalName: pName,
            battingHand: "Right Hand",
            bowlingStyle: "Right Arm Medium",
            fieldingPosition: pRole,
            captainTags: JSON.stringify(["Tournament Registered"]),
            fuzzyVariants: JSON.stringify([pName, pName.split(" ")[0]]),
            notes: pNotes,
            avatarUrl: pAvatar,
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
    } catch (e) {
      console.error("Fallback player lookup error:", e);
    }
  }

  if (!player) notFound();

  const hasMatchData = player.stats && player.stats.length > 0;
  const tactical = getPlayerTacticalInfo(player.canonicalName);
  const careerDNA = getPlayerCareerDNA(player.canonicalName, player.stats);

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

      {/* SECTION: CAREER-WIDE PLAYER TACTICAL INTELLIGENCE (Prompt Isolated & Grounded) */}
      <section className="p-6 sm:p-8 rounded-3xl border border-purple-200/90 dark:border-purple-900/60 bg-gradient-to-b from-purple-50/50 via-white to-white dark:from-purple-950/20 dark:via-slate-900 dark:to-slate-900 shadow-xs space-y-6">
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-100 dark:border-purple-900/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
              <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-950 dark:text-white uppercase">
                Player Tactical Intelligence & Observable Playing DNA
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Career-wide analysis across tournaments & practice games • Grounded Indoor Cricket metrics
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
              Primary: {careerDNA.primaryProfile}
            </span>
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Confidence: {careerDNA.confidence}
            </span>
          </div>
        </div>

        {/* Profile Description & Form vs Career */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 space-y-2 shadow-2xs">
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {careerDNA.profileDescription}
          </p>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-purple-700 dark:text-purple-400 font-bold">
              Form vs Career: <span className="font-semibold text-slate-600 dark:text-slate-300">{careerDNA.currentFormVsCareer.status}</span>
            </span>
            <span className="text-slate-500 text-[11px]">{careerDNA.currentFormVsCareer.summary}</span>
          </div>
        </div>

        {/* Batting DNA & Dismissal DNA (Two Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Batting DNA */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-sky-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Batting DNA & Scoring Behaviour
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Indoor Net Mechanics</span>
            </div>

            <div className="space-y-3">
              {careerDNA.battingDNA.map((obs, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 space-y-1.5 text-xs">
                  <span className="font-bold text-sky-700 dark:text-sky-400 block">{obs.observation}</span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Evidence: </span>{obs.evidence}
                  </p>
                  <p className="text-sky-900 dark:text-sky-300 text-[11px] font-medium pt-0.5">
                    <span className="font-bold">Tactical Meaning: </span>{obs.tacticalMeaning}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dismissal DNA */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Dismissal DNA (-5 Run Penalties)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-rose-600 font-bold">{careerDNA.dismissalDNA.rate}</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 text-xs flex items-center justify-between">
                <span className="font-bold text-rose-900 dark:text-rose-300">Total Recorded Dismissals:</span>
                <span className="font-mono font-bold text-rose-700 dark:text-rose-400">{careerDNA.dismissalDNA.totalDismissals}</span>
              </div>
              {careerDNA.dismissalDNA.patterns.map((pat, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 space-y-1.5 text-xs">
                  <span className="font-bold text-rose-700 dark:text-rose-400 block">{pat.pattern}</span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Evidence: </span>{pat.evidence}
                  </p>
                  <p className="text-rose-900 dark:text-rose-300 text-[11px] font-medium pt-0.5">
                    <span className="font-bold">Interpretation: </span>{pat.interpretation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bowling Trade-Offs & Performance Synergy (Two Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bowling DNA */}
          <div className="lg:col-span-6 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Bowling DNA & Discipline Trade-Offs
                </h3>
              </div>
              <span className="text-[10px] font-mono text-purple-600 font-bold">Over Delivery Quality</span>
            </div>

            {careerDNA.bowlingDNA ? (
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/20">
                  <span className="font-bold text-purple-900 dark:text-purple-300">Identity:</span>
                  <span className="font-semibold text-purple-700 dark:text-purple-400">{careerDNA.bowlingDNA.identity}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Evidence: </span>{careerDNA.bowlingDNA.evidence}
                </p>
                <p className="text-purple-950 dark:text-purple-300 text-[11px] font-medium">
                  <span className="font-bold">Tactical Meaning: </span>{careerDNA.bowlingDNA.tacticalMeaning}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-amber-700 dark:text-amber-400">
                  <span className="font-bold">Discipline Risk: </span>{careerDNA.bowlingDNA.disciplineRisk}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-3">
                No sustained bowling spell recorded in tournament or practice database.
              </p>
            )}
          </div>

          {/* Performance Synergy */}
          <div className="lg:col-span-6 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3.5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Player Performance Synergy
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">Observable Metrics</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 my-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block font-mono">
                    Performance Synergy Score
                  </span>
                  <span className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">Grounded Pairing Chemistry</span>
                </div>
                <span className="text-2xl font-black text-emerald-600 font-mono">
                  {careerDNA.playerSynergy.performanceSynergyScore}/100
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                {careerDNA.playerSynergy.bestHistoricalPartner && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Best Partner</span>
                    <span className="font-bold text-slate-900 dark:text-white">{careerDNA.playerSynergy.bestHistoricalPartner}</span>
                  </div>
                )}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Best Style Complement</span>
                  <span className="font-bold text-slate-900 dark:text-white">{careerDNA.playerSynergy.bestStyleComplement}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Synergy Rationale: </span>
              {careerDNA.playerSynergy.synergyRationale}
            </p>
          </div>
        </div>

        {/* Bazooka Tactical Option & Captain's Use Case */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bazooka Option */}
          <div className="lg:col-span-6 p-5 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-950 dark:text-amber-200">
                  Bazooka Tactical Option Suitability
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                {careerDNA.bazookaTactics.suitability}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
                <span className="font-bold">Deployment Advantage: </span>{careerDNA.bazookaTactics.expectedAdvantage}
              </p>
              <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/40 space-y-1">
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Ideal Situation: </span>{careerDNA.bazookaTactics.likelySituation}
                </p>
                <p className="text-rose-700 dark:text-rose-400 text-[11px]">
                  <span className="font-bold">Primary Risk: </span>{careerDNA.bazookaTactics.primaryRisk}
                </p>
              </div>
            </div>
          </div>

          {/* Captain's Use Case & Opposition Scouting */}
          <div className="lg:col-span-6 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Captain\'s Blueprint & Opposition Scouting
                </h3>
              </div>
              <span className="text-[10px] font-mono text-purple-600 font-bold">Tactical Matchup</span>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                <span className="font-bold text-purple-700 dark:text-purple-400">Best Captain Use: </span>
                {careerDNA.captainsUseCase.bestRole} — {careerDNA.captainsUseCase.bestPartnershipOrMatchup}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-rose-700 dark:text-rose-400 text-[11px] block">Opposition Scouting Targets:</span>
                <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                  {careerDNA.oppositionScouting.map((scout, idx) => (
                    <li key={idx}>{scout}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Player DNA Summary Card */}
        <div className="p-5 rounded-2xl bg-purple-900 text-white space-y-3 shadow-md">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-300" />
              <h4 className="text-xs font-black uppercase tracking-wider text-purple-100">
                PLAYER DNA CARD: {careerDNA.playerDNACard.playerDNA}
              </h4>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-800 text-purple-200 border border-purple-700">
              Confidence: {careerDNA.playerDNACard.confidence}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-purple-800/60 border border-purple-700/50 space-y-0.5">
              <span className="text-[10px] font-bold text-purple-300 uppercase block">Core Strength</span>
              <p className="text-purple-100 leading-tight">{careerDNA.playerDNACard.strength}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-800/60 border border-purple-700/50 space-y-0.5">
              <span className="text-[10px] font-bold text-rose-300 uppercase block">Main Vulnerability</span>
              <p className="text-purple-100 leading-tight">{careerDNA.playerDNACard.weakness}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-800/60 border border-purple-700/50 space-y-0.5">
              <span className="text-[10px] font-bold text-sky-300 uppercase block">Best Captain Use</span>
              <p className="text-purple-100 leading-tight">{careerDNA.playerDNACard.bestUse}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-800/60 border border-purple-700/50 space-y-0.5">
              <span className="text-[10px] font-bold text-amber-300 uppercase block">Key Strategic Risk</span>
              <p className="text-purple-100 leading-tight">{careerDNA.playerDNACard.keyRisk}</p>
            </div>
          </div>
        </div>
      </section>

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
