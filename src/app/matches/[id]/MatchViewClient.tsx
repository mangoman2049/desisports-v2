"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Share2,
  Printer,
  FileJson,
  ArrowLeft,
  Check,
  Trophy,
  Activity,
  Target,
  Shield,
  Layers,
  Zap,
  Award,
  AlertTriangle,
  ClipboardList,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Download,
  ExternalLink,
  FileDown,
  RotateCcw,
} from "lucide-react";
import { MatchTacticalAnalysis } from "@/lib/match-analyses";

interface Props {
  matchId: string;
  matchTitle: string;
  tournamentName: string;
  matchDate: string;
  venue: string;
  homeTeam: { name: string; score: number; skins: number };
  awayTeam: { name: string; score: number; skins: number };
  analysis: MatchTacticalAnalysis;
  scorecardData?: any;
  scorecardUrl?: string;
}

export default function MatchViewClient({
  matchId,
  matchTitle,
  tournamentName,
  matchDate,
  venue,
  homeTeam,
  awayTeam,
  analysis,
  scorecardData,
  scorecardUrl,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"analysis" | "scorecard">("analysis");
  const [scorecardZoom, setScorecardZoom] = useState(1);

  const isDirectImage =
    scorecardUrl &&
    !scorecardUrl.startsWith("/matches/") &&
    !scorecardUrl.includes("/review") &&
    (scorecardUrl.startsWith("http://") ||
      scorecardUrl.startsWith("https://") ||
      scorecardUrl.startsWith("data:image/") ||
      scorecardUrl.startsWith("/uploads/") ||
      scorecardUrl.endsWith(".webp") ||
      scorecardUrl.endsWith(".jpg") ||
      scorecardUrl.endsWith(".jpeg") ||
      scorecardUrl.endsWith(".png"));

  const resolvedImageUrl = isDirectImage ? scorecardUrl : `/api/scorecards/${matchId}/image`;

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = `${matchTitle} — Post-Match Tactical Analysis | DesiSports`;
    const text = `${analysis.editorHeadline}\n${analysis.scoreSummary}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {}
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const verdict =
    analysis.matchVerdict?.verdict ||
    (analysis.matchVerdict as any)?.classification ||
    "TACTICAL DOMINATION";

  const verdictBadgeColor = () => {
    switch (verdict) {
      case "TACTICAL DOMINATION":
        return "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
      case "TURNAROUND":
        return "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800";
      case "FATAL MISTAKE":
        return "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800";
      default:
        return "bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800";
    }
  };

  const getPlayerTagColor = (tag: string) => {
    switch (tag) {
      case "MATCH WINNER":
        return "bg-amber-500/15 text-amber-700 border-amber-300 dark:text-amber-300 dark:border-amber-700";
      case "SKIN WINNER":
        return "bg-emerald-500/15 text-emerald-700 border-emerald-300 dark:text-emerald-300 dark:border-emerald-700";
      case "PARTNERSHIP BUILDER":
        return "bg-blue-500/15 text-blue-700 border-blue-300 dark:text-blue-300 dark:border-blue-700";
      case "PRESSURE BUILDER":
      case "SILENT CONTRIBUTOR":
        return "bg-purple-500/15 text-purple-700 border-purple-300 dark:text-purple-300 dark:border-purple-700";
      case "PARTNERSHIP BREAKER":
        return "bg-cyan-500/15 text-cyan-700 border-cyan-300 dark:text-cyan-300 dark:border-cyan-700";
      case "DISCIPLINE PROBLEM":
      case "MISSED OPPORTUNITY":
        return "bg-rose-500/15 text-rose-700 border-rose-300 dark:text-rose-300 dark:border-rose-700";
      default:
        return "bg-slate-500/15 text-slate-700 border-slate-300 dark:text-slate-300 dark:border-slate-700";
    }
  };

  const skinPairs = analysis.skinsAnalysisDetailed?.pairs || [];

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/matches"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Matches</span>
          </Link>
          <span className="text-xs text-slate-400 font-mono">•</span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {tournamentName}
          </span>
        </div>

        {/* Action Buttons: Share, Print PDF */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xs transition cursor-pointer"
            title="Share Match Analysis"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600 font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>Share Match</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xs transition cursor-pointer"
            title="Download / Print PDF Report"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Match Billboard Hero */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white shadow-xl border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-bold border border-emerald-500/30">
              {tournamentName}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {matchDate} • {venue}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
              Spawtz 16-Over Indoor
            </span>
          </div>
        </div>

        {/* Big Teams Scoreboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center py-4 border-y border-slate-800/80 my-2">
          {/* Home Team */}
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Home</div>
              <div className="text-2xl sm:text-3xl font-black">{homeTeam.name}</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">{homeTeam.skins} Skins won</div>
            </div>
            <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 ml-auto sm:ml-6">
              {homeTeam.score}
            </div>
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="text-left sm:text-right order-1 sm:order-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Away</div>
              <div className="text-2xl sm:text-3xl font-black">{awayTeam.name}</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">{awayTeam.skins} Skins won</div>
            </div>
            <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400 order-2 sm:order-1 sm:mr-6 ml-auto sm:ml-0">
              {awayTeam.score}
            </div>
          </div>
        </div>

        {/* Match Result Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
          <div className="text-sm font-bold text-slate-200">
            {analysis.scoreSummary}
          </div>
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <Trophy className="w-4 h-4" />
            <span>Winner: {analysis.winner}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 print:hidden overflow-x-auto scrollbar-none whitespace-nowrap">
        <button
          onClick={() => setActiveTab("analysis")}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
            activeTab === "analysis"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5 shrink-0" />
          <span>Post-Match Tactical Analysis (11 Sections)</span>
        </button>
        <button
          onClick={() => setActiveTab("scorecard")}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
            activeTab === "scorecard"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span>Official Scorecard & Player Stats</span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === "analysis" ? (
        <div className="space-y-6">
          {/* SECTION 1: MATCH VERDICT */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Match Verdict
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${verdictBadgeColor()}`}>
                {verdict}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {analysis.editorHeadline}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-serif italic">
              &ldquo;{analysis.matchVerdict?.explanation || analysis.editorSummary}&rdquo;
            </p>
          </div>

          {/* SECTION 2 & 3: WHY WINNER WON & WHY LOSER LOST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Why Winner Won */}
            <div className="p-6 rounded-2xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                <Check className="w-4 h-4 font-bold" />
                <h3 className="text-sm font-black uppercase tracking-wider">
                  2. Why {analysis.winner} Won
                </h3>
              </div>
              <div className="space-y-3">
                {analysis.whyWinningTeamWon?.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 text-xs space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white">{item.observation}</div>
                    <div className="text-slate-600 dark:text-slate-300 font-mono text-[11px]">Evidence: {item.evidence}</div>
                    <div className="text-emerald-700 dark:text-emerald-400 font-medium">Impact: {item.impact}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Loser Lost */}
            <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                <h3 className="text-sm font-black uppercase tracking-wider">
                  3. Why {analysis.loser} Lost
                </h3>
              </div>
              <div className="space-y-3">
                {analysis.whyLosingTeamLost?.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/40 text-xs space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white">{item.observation}</div>
                    <div className="text-slate-600 dark:text-slate-300 font-mono text-[11px]">Evidence: {item.evidence}</div>
                    <div className="text-rose-700 dark:text-rose-400 font-medium">Impact: {item.impact}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 4: TURNING POINT */}
          {analysis.turningPointDetailed && (
            <div className="p-6 rounded-2xl border border-amber-200 dark:border-amber-950/60 bg-amber-50/40 dark:bg-amber-950/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
                  <Zap className="w-4 h-4" />
                  <h3 className="text-sm font-black uppercase tracking-wider">
                    4. The Decisive Turning Point
                  </h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                  {analysis.turningPoint?.nature || "Tactical Domination"}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900/40">
                  <div className="font-bold text-slate-400 uppercase text-[10px]">Before</div>
                  <div className="text-slate-700 dark:text-slate-200 mt-1">{analysis.turningPointDetailed.matchStateBefore}</div>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900/40">
                  <div className="font-bold text-amber-600 dark:text-amber-400 uppercase text-[10px]">The Event</div>
                  <div className="text-slate-900 dark:text-white font-semibold mt-1">{analysis.turningPointDetailed.event}</div>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900/40">
                  <div className="font-bold text-slate-400 uppercase text-[10px]">After & Why It Mattered</div>
                  <div className="text-slate-700 dark:text-slate-200 mt-1">{analysis.turningPointDetailed.whyItMattered}</div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: 4-PAIR SKIN ANALYSIS TABLE */}
          <div className="p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-black uppercase tracking-wider">
                5. Skin-by-Skin Partnership Breakdown
              </h3>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full min-w-[620px] text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="py-2.5 px-3">Skin</th>
                    <th className="py-2.5 px-3">Winner Pair</th>
                    <th className="py-2.5 px-3 text-right">Runs (Wkts)</th>
                    <th className="py-2.5 px-3">Opponent Pair</th>
                    <th className="py-2.5 px-3 text-right">Runs (Wkts)</th>
                    <th className="py-2.5 px-3 text-right">Margin</th>
                    <th className="py-2.5 px-3">Tactical Story</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {skinPairs.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        Skin {p.pairNumber}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        {p.winnerPair}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                        {p.winnerRuns} <span className="text-slate-400 text-[10px]">({p.winnerDismissals}w)</span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {p.loserPair}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-rose-500">
                        {p.loserRuns} <span className="text-slate-400 text-[10px]">({p.loserDismissals}w)</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-black text-slate-900 dark:text-white">
                        +{p.skinMargin}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed max-w-xs">
                        {p.analysis}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Cards View */}
            <div className="block sm:hidden space-y-3">
              {skinPairs.map((p, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-800 dark:text-slate-200">
                      Skin {p.pairNumber}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {p.skinWinner} (+{p.skinMargin} runs)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/40 dark:border-emerald-900/30">
                      <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Winner Pair</div>
                      <div className="font-semibold text-slate-900 dark:text-white mt-0.5 truncate">{p.winnerPair}</div>
                      <div className="font-mono text-emerald-600 font-bold mt-0.5">
                        {p.winnerRuns} <span className="text-slate-400 text-[10px]">({p.winnerDismissals}w)</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Opponent Pair</div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5 truncate">{p.loserPair}</div>
                      <div className="font-mono text-rose-500 font-bold mt-0.5">
                        {p.loserRuns} <span className="text-slate-400 text-[10px]">({p.loserDismissals}w)</span>
                      </div>
                    </div>
                  </div>

                  {p.analysis && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed pt-1 border-t border-slate-200/60 dark:border-slate-800">
                      {p.analysis}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {analysis.skinsAnalysisDetailed?.skinsStory && (
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
                Summary: {analysis.skinsAnalysisDetailed.skinsStory}
              </p>
            )}
          </div>

          {/* SECTION 6: PLAYER IMPACT ROSTER */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-black uppercase tracking-wider">
                6. Decisive Player Impact Assessments
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {analysis.playerImpact?.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{item.player}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPlayerTagColor(item.label)}`}>
                      {item.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 7, 8, 9: BEHAVIORS & CAPTAIN ANALYSIS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Batting & Bowling Behaviour */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Activity className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-black uppercase tracking-wider">
                  7 & 8. Tactical Behaviour
                </h3>
              </div>
              <div className="space-y-3 text-xs">
                {analysis.battingBehaviour?.map((b, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white">{b.team} Batting Tendencies:</div>
                    <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5">
                      {(b.observations || []).map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Captain & Tactical Decision Analysis */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Shield className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-black uppercase tracking-wider">
                  9. Captain & Tactical Decisions
                </h3>
              </div>
              <div className="space-y-3 text-xs">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                  {analysis.captainAnalysis?.evaluation}
                </p>
                {analysis.captainAnalysis?.captainTakeaways && (
                  <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-white">Key Takeaways:</div>
                    <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5">
                      {(analysis.captainAnalysis.captainTakeaways || []).map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 11: HARD-HITTING VERDICT */}
          {analysis.finalHardHittingVerdict && (
            <div className="p-6 rounded-2xl border border-indigo-200 dark:border-indigo-950/60 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">11. Analyst Hard-Hitting Verdict</span>
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                &ldquo;{analysis.finalHardHittingVerdict}&rdquo;
              </p>
            </div>
          )}
        </div>
      ) : (
        /* SCORECARD SHEET & PLAYER PERFORMANCE TAB */
        <div className="space-y-6">
          {/* Section 1: Official Scorecard Sheet Image Viewer */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Official Spawtz Scorecard Sheet</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  16-Over Indoor Cricket Standard · Zoom or inspect handwriting tokens, dismissals, and skin totals.
                </p>
              </div>

              {/* Viewer Controls: Zoom, WebP Download & Auditable JSON */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 text-xs">
                  <button
                    onClick={() => setScorecardZoom((z) => Math.max(0.5, z - 0.2))}
                    className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center font-mono font-bold text-slate-600 dark:text-slate-300">
                    {Math.round(scorecardZoom * 100)}%
                  </span>
                  <button
                    onClick={() => setScorecardZoom((z) => Math.min(2.5, z + 0.2))}
                    className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setScorecardZoom(1)}
                    className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition cursor-pointer ml-1"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <a
                  href={`/api/scorecards/${matchId}/image?format=webp&download=true`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 text-xs font-bold transition shadow-2xs"
                  title="Download WebP compressed scorecard image"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download WebP</span>
                </a>

                <a
                  href={`/api/scorecards/${matchId}/json?download=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition shadow-2xs"
                  title="Download Auditable JSON"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download JSON</span>
                </a>

                <a
                  href={resolvedImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  title="Open Raw Image in New Tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Scorecard Image Display */}
            <div className="relative overflow-auto rounded-2xl bg-slate-950 border border-slate-800 p-2 sm:p-4 flex items-center justify-center min-h-[280px] sm:min-h-[500px] max-h-[82vh] shadow-2xl">
              <div
                style={{ transform: `scale(${scorecardZoom})`, transformOrigin: "top center" }}
                className="transition-transform duration-150 ease-out max-w-full flex justify-center py-2"
              >
                <img
                  src={resolvedImageUrl}
                  alt={`Official Scorecard for ${matchTitle}`}
                  className="rounded-lg shadow-2xl max-h-[75vh] w-auto max-w-full object-contain mx-auto border border-slate-800"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.src.includes("sample-scorecard.jpg")) {
                      target.src = "/uploads/scorecards/sample-scorecard.jpg";
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-400">
              <span>Optimized with Sharp WebP Q75 compression · 1800px max bounding box</span>
              <div className="flex items-center gap-3">
                <a
                  href={`/api/scorecards/${matchId}/json`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline font-mono"
                >
                  View Auditable JSON API ↗
                </a>
                <span>•</span>
                <a
                  href={resolvedImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:underline"
                >
                  View Full Resolution ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
