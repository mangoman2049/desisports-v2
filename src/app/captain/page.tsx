"use client";

import { useState } from "react";
import {
  Shield,
  Trophy,
  Users,
  TrendingUp,
  Flame,
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Shuffle,
  ChevronRight,
  Bot,
  RefreshCw,
} from "lucide-react";
import { generateCaptainInsights } from "@/lib/captain-insights";

export default function CaptainInsightsPage() {
  const [selectedTournament, setSelectedTournament] = useState("Desi Boys Tournament May 2026");
  const [selectedTeam, setSelectedTeam] = useState("Desi Tigers");
  const [activeTab, setActiveTab] = useState<"batting" | "bowling" | "pairs" | "decisions">("decisions");
  const [generatingBrief, setGeneratingBrief] = useState(false);
  const [tacticalBrief, setTacticalBrief] = useState<string | null>(null);

  const dashboard = generateCaptainInsights([
    "Deepak",
    "Yash",
    "Narendra",
    "Maneesh",
    "Gagan",
    "Viral",
    "Sahil",
    "Sunny",
  ]);

  const currentBrief = tacticalBrief || dashboard.aiTacticalBrief;

  const handleGenerateAiBrief = async () => {
    setGeneratingBrief(true);
    try {
      const res = await fetch("/api/captain/ai-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName: selectedTeam,
          tournamentName: selectedTournament,
          keyStats: {
            batting: dashboard.insights.batting.slice(0, 3),
            bowling: dashboard.insights.bowling.slice(0, 3),
            decisions: dashboard.insights.decisions.slice(0, 3),
          },
        }),
      });
      const data = await res.json();
      if (data.brief) {
        setTacticalBrief(data.brief);
      }
    } catch {
      // Fallback
    } finally {
      setGeneratingBrief(false);
    }
  };

  const tabs = [
    { id: "decisions", label: "Captain Decisions (8)", icon: Award },
    { id: "pairs", label: "Pairs & Synergies (8)", icon: Users },
    { id: "batting", label: "Batting Topology (8)", icon: TrendingUp },
    { id: "bowling", label: "Bowling Topology (8)", icon: Flame },
  ] as const;

  const currentInsights = dashboard.insights[activeTab];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20">
              Captain Command Center
            </span>
            <span className="text-xs font-mono text-slate-500">32 Tactical Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Squad Combinations & Evidence-Led Insights
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Every insight displays sample size, signal reliability, and hidden strategic tags.
          </p>
        </div>

        {/* Selectors & AI Generator */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedTournament}
            onChange={(e) => setSelectedTournament(e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="Desi Boys Tournament May 2026">Desi Boys Tournament May 2026</option>
            <option value="Dubai Indoor Premier Cup">Dubai Indoor Premier Cup</option>
          </select>

          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="Desi Tigers">Desi Tigers</option>
            <option value="Away Team">Away Team</option>
            <option value="VPGR">VPGR</option>
          </select>

          <button
            onClick={handleGenerateAiBrief}
            disabled={generatingBrief}
            className="flex items-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition disabled:opacity-50"
          >
            {generatingBrief ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Bot className="h-3.5 w-3.5" />
            )}
            <span>Generate LiteLLM Brief</span>
          </button>
        </div>
      </div>

      {/* AI Tactical Memo Card */}
      <div className="p-5 rounded-xl border border-purple-500/20 bg-purple-50/40 dark:bg-purple-950/20 shadow-sm space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-purple-200/50 dark:border-purple-800/40">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-300">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span>AI Strategic Memo (Synthesized from 184 Balls)</span>
          </div>
          <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400">
            Deterministic Rule-Grounded
          </span>
        </div>
        <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line space-y-1">
          {currentBrief}
        </div>
      </div>

      {/* 4 Area Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl transition shrink-0 ${
                isActive
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Decisions Area: Recommended Batting Order & Bowling Allocation Cards */}
      {activeTab === "decisions" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-4">
          {/* Batting Order Lineup Card */}
          <div className="lg:col-span-6 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Optimized 4-Skin Batting Lineup Card
              </span>
              <span className="text-[10px] font-mono text-emerald-600 font-bold">
                Projected: 118 Runs
              </span>
            </div>

            <div className="space-y-2">
              {dashboard.recommendedLineup.batting.map((item) => (
                <div
                  key={item.skinNumber}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px]">
                        Skin {item.skinNumber} (Overs {(item.skinNumber - 1) * 4 + 1}-
                        {item.skinNumber * 4})
                      </span>
                      <span className="font-black text-slate-900 dark:text-white">
                        {item.pair[0]} & {item.pair[1]}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      {item.roleReasoning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bowling Allocation Card */}
          <div className="lg:col-span-6 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                16-Over Bowling Quota Distribution (Max 2/Bowler)
              </span>
              <span className="text-[10px] font-mono text-blue-600 font-bold">
                Target: &lt;70 RC
              </span>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {dashboard.recommendedLineup.bowling.map((skinTarget) => (
                <div key={skinTarget.skinTarget} className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Opponent Skin {skinTarget.skinTarget}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {skinTarget.overs.map((o) => (
                      <div
                        key={o.overNumber}
                        className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px]"
                      >
                        <div className="flex items-center justify-between font-mono font-bold">
                          <span className="text-slate-500">Over #{o.overNumber}</span>
                          <span className="text-blue-600 dark:text-blue-400">{o.bowler}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                          {o.tacticalObjective}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pairs Area: Synergy Matrix */}
      {activeTab === "pairs" && (
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 mb-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Player Combination Synergies & Uplift Matrix
            </span>
            <span className="text-[10px] font-mono text-emerald-600 font-bold">
              Pair Chemistry Ratings
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="sports-table text-xs">
              <thead>
                <tr>
                  <th>Pair Combination</th>
                  <th>Archetype</th>
                  <th>Avg Skin Score</th>
                  <th>Skin Win %</th>
                  <th>Survival (≤1 Wkt)</th>
                  <th>Synergy Uplift</th>
                  <th className="text-right">Best Placement</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.synergies.map((s, idx) => (
                  <tr key={idx}>
                    <td className="font-bold text-slate-900 dark:text-white">
                      {s.pair[0]} & {s.pair[1]}
                    </td>
                    <td>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {s.roleArchetype}
                      </span>
                    </td>
                    <td className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {s.avgSkinScore.toFixed(1)}
                    </td>
                    <td className="font-mono">{s.skinWinRate}%</td>
                    <td className="font-mono">{s.survivalRate}%</td>
                    <td
                      className={`font-mono font-bold ${
                        s.synergyUplift > 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : s.synergyUplift < 0
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-slate-500"
                      }`}
                    >
                      {s.synergyUplift > 0 ? `+${s.synergyUplift}` : s.synergyUplift}
                    </td>
                    <td className="font-mono text-right font-semibold text-purple-600 dark:text-purple-400">
                      {s.orderPreference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8 Metric Insight Cards Grid for the Active Tab */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentInsights.map((insight) => (
          <div
            key={insight.id}
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    {insight.area} Insight
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {insight.title}
                  </h3>
                </div>

                {/* Signal strength badge */}
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    insight.signalStrength === "robust"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-500/20"
                      : insight.signalStrength === "moderate"
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 border border-blue-500/20"
                      : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-500/20"
                  }`}
                >
                  {insight.signalStrength === "emerging"
                    ? "Emerging Signal"
                    : insight.signalStrength === "robust"
                    ? "Robust (95%+ Conf)"
                    : "Moderate Signal"}
                </span>
              </div>

              <div className="mt-3">
                <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
                  {insight.value}
                </div>
                {insight.secondaryValue && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {insight.secondaryValue}
                  </p>
                )}
              </div>

              {insight.recommendation && (
                <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                    Tactical Directive:
                  </span>
                  {insight.recommendation}
                </div>
              )}
            </div>

            {/* Footer: Sample size & Hidden Captain Tags */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span className="text-slate-400 font-mono">Sample: {insight.sampleSize}</span>

              {insight.tags && (
                <div className="flex flex-wrap gap-1">
                  {insight.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-1.5 py-0.2 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold text-[10px] border border-purple-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
