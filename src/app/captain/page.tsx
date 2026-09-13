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
  ChevronDown,
  ChevronUp,
  Search,
  Bot,
  RefreshCw,
  Zap,
} from "lucide-react";
import { generateCaptainInsights } from "@/lib/captain-insights";
import { CaptainInsightMetric } from "@/types/cricket";
import { trackCTA, trackPersonaEvent } from "@/lib/analytics";

export default function CaptainInsightsPage() {
  const [selectedTournament, setSelectedTournament] = useState("Desi Boys Tournament May 2026");
  const [selectedTeam, setSelectedTeam] = useState("Desi Tigers");
  const [activeTab, setActiveTab] = useState<"all" | "decisions" | "pairs" | "batting" | "bowling">("all");
  const [robustOnly, setRobustOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
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
    trackCTA("captain_generate_brief", "CAPTAIN", {
      teamName: selectedTeam,
      tournamentName: selectedTournament,
    });
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
        trackPersonaEvent("captain_brief_generated", "CAPTAIN", {
          teamName: selectedTeam,
          tournamentName: selectedTournament,
        });
      }
    } catch {
      // Fallback
    } finally {
      setGeneratingBrief(false);
    }
  };

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpandAll = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    const all = [
      ...dashboard.insights.decisions,
      ...dashboard.insights.pairs,
      ...dashboard.insights.batting,
      ...dashboard.insights.bowling,
    ];
    all.forEach((item) => {
      next[item.id] = expand;
    });
    setExpandedCards(next);
  };

  // Filter items based on active tab, search query, and robust signal toggle
  const getFilteredInsights = (): CaptainInsightMetric[] => {
    let list: CaptainInsightMetric[] = [];
    if (activeTab === "all") {
      list = [
        ...dashboard.insights.decisions,
        ...dashboard.insights.pairs,
        ...dashboard.insights.batting,
        ...dashboard.insights.bowling,
      ];
    } else {
      list = dashboard.insights[activeTab] || [];
    }

    if (robustOnly) {
      list = list.filter((i) => i.signalStrength === "robust");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          String(i.value).toLowerCase().includes(q) ||
          (i.tags && i.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    return list;
  };

  const filteredInsights = getFilteredInsights();

  const tabs = [
    { id: "all", label: "All 32 Insights", count: 32, icon: Layers },
    { id: "decisions", label: "Lineup Decisions", count: 8, icon: Award },
    { id: "pairs", label: "Pairs & Synergies", count: 8, icon: Users },
    { id: "batting", label: "Batting Topology", count: 8, icon: TrendingUp },
    { id: "bowling", label: "Bowling Topology", count: 8, icon: Flame },
  ] as const;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-0.5 rounded-full border border-purple-500/20">
              Captain Command Center
            </span>
            <span className="text-xs font-mono text-slate-500">32 Grounded Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Tactical Intel & Squad Synergy Matrix
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            Mathematically grounded indoor cricket strike rates, progressive disclosure summaries, style-based matchups, and AI strategic briefings.
          </p>
        </div>

        {/* Selectors & AI Generator */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedTournament}
            onChange={(e) => setSelectedTournament(e.target.value)}
            className="text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option>Desi Boys Tournament May 2026</option>
          </select>

          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option>Desi Tigers</option>
            <option>VPGR</option>
            <option>Desi Dabanggs</option>
            <option>Desi Titans</option>
          </select>

          <button
            onClick={handleGenerateAiBrief}
            disabled={generatingBrief}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-sm"
          >
            {generatingBrief ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Bot className="h-3.5 w-3.5" />
            )}
            <span>{generatingBrief ? "Synthesizing…" : "Generate Briefing"}</span>
          </button>
        </div>
      </div>

      {/* Executive Summary 3-Card Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Optimal Opening Duo</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white">
            Deepak & Yash (Skin 1)
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Anchor + Boundary Aggressor pairing with 100% skin-win rate and +34.0 average score.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Clutch Death Weapon</span>
            <Flame className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white">
            Prateek & Arif (Overs 15-16)
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Bowling strike rate: 8.0 balls/wicket in Skin 4 closing overs; conceded negative net runs.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Running Discipline Alert</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white">
            54% Dismissals via Run-Out
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Over half of -5 penalties occur on risky cross-court singles. Strict verbal calling required.
          </p>
        </div>
      </div>

      {/* AI Tactical Memo Brief */}
      <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-50/60 to-white dark:from-purple-950/20 dark:to-slate-900 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-200">
              LiteLLM Tactical Briefing — {selectedTeam}
            </h2>
          </div>
          <span className="text-[11px] font-mono text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50 px-2 py-0.5 rounded-full">
            Autonomous Synthesis
          </span>
        </div>

        <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
          {currentBrief}
        </div>
      </div>

      {/* Controls & Filter Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Tab Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isSelected = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                  isSelected
                    ? "bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-sm font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                <span className="text-[10px] font-mono opacity-70">({t.count})</span>
              </button>
            );
          })}
        </div>

        {/* Search, Robust Toggle, and Expand/Collapse */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Real-time search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 32 metrics…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-44"
            />
          </div>

          {/* High-confidence / Robust only toggle */}
          <button
            onClick={() => setRobustOnly(!robustOnly)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition ${
              robustOnly
                ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
            }`}
          >
            Robust Only
          </button>

          <button
            onClick={() => toggleExpandAll(true)}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
            title="Expand All"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => toggleExpandAll(false)}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
            title="Collapse All"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInsights.map((metric) => {
          const isExpanded = !!expandedCards[metric.id];

          return (
            <div
              key={metric.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Strip */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded">
                        {metric.area}
                      </span>
                      {metric.signalStrength === "robust" ? (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Robust
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20">
                          Moderate
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                      {metric.title}
                    </h3>
                  </div>

                  {/* Strategic Tags */}
                  {metric.tags && (
                    <div className="flex flex-wrap gap-1 justify-end">
                      {metric.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Primary Metric Value */}
                <div className="pt-1">
                  <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono">
                    {metric.value}
                  </div>
                  {metric.secondaryValue && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {metric.secondaryValue}
                    </div>
                  )}
                </div>

                {/* Progressive Disclosure Section */}
                {isExpanded ? (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-in fade-in duration-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Description & Grounding
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                        {metric.description}
                      </p>
                    </div>

                    {metric.recommendation && (
                      <div className="p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-500/10">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 block">
                          Tactical Actionable
                        </span>
                        <p className="text-xs text-purple-900 dark:text-purple-200 mt-0.5 font-medium">
                          {metric.recommendation}
                        </p>
                      </div>
                    )}

                    <div className="text-[11px] font-mono text-slate-400 pt-1">
                      Sample Size: {metric.sampleSize}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {metric.description}
                  </p>
                )}
              </div>

              {/* Card Footer Toggle */}
              <button
                onClick={() => toggleCard(metric.id)}
                className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 transition"
              >
                <span>{isExpanded ? "Show Less" : "Deep Drill-Down & Strategy"}</span>
                {isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Recommended Batting Order & 16-Over Bowling Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
        {/* Recommended Batting Order */}
        <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Recommended 4-Skin Batting Order
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
              Projected: 118 ± 8 Net Runs
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {dashboard.recommendedLineup.batting.map((item) => (
              <div key={item.skinNumber} className="py-3 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center font-mono shrink-0 mt-0.5">
                  S{item.skinNumber}
                </span>
                <div className="flex-1">
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    {item.pair[0]} & {item.pair[1]}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.roleReasoning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 16-Over Bowling Allocation */}
        <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-purple-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                16-Over Bowling Allocation Map
              </h3>
            </div>
            <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded">
              Max 2 Overs / Bowler
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {dashboard.recommendedLineup.bowling.map((skinBlock) => (
              <div
                key={skinBlock.skinTarget}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Target: Skin {skinBlock.skinTarget}
                </div>
                {skinBlock.overs.map((o) => (
                  <div key={o.overNumber} className="text-xs">
                    <span className="font-mono text-slate-400">O{o.overNumber}: </span>
                    <strong className="text-slate-800 dark:text-slate-200">{o.bowler}</strong>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
