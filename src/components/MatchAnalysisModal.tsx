"use client";

import { useState } from "react";
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Layers,
  Shield,
  Activity,
  Target,
  AlertOctagon,
  Award,
  Sparkles,
  ClipboardList,
  Compass,
  Share2,
  Printer,
  ExternalLink,
  Check,
  ZoomIn,
  ZoomOut,
  Download,
  FileDown,
  RotateCcw,
} from "lucide-react";
import { MatchTacticalAnalysis } from "@/lib/match-analyses";

interface Props {
  analysis: MatchTacticalAnalysis;
  onClose: () => void;
}

export default function MatchAnalysisModal({ analysis, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<"coach" | "summary" | "scorecard">("coach");
  const [copied, setCopied] = useState(false);
  const [scorecardZoom, setScorecardZoom] = useState(1);

  const verdict =
    analysis.matchVerdict?.verdict ||
    (analysis.matchVerdict as any)?.classification ||
    "TACTICAL DOMINATION";

  const verdictExplanation =
    analysis.matchVerdict?.explanation ||
    (analysis.matchVerdict as any)?.text ||
    "";

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
      case "SILENT KILLER":
      case "SILENT CONTRIBUTOR":
        return "bg-purple-500/15 text-purple-700 border-purple-300 dark:text-purple-300 dark:border-purple-700";
      case "PARTNERSHIP BREAKER":
      case "MOMENTUM STOPPER":
        return "bg-cyan-500/15 text-cyan-700 border-cyan-300 dark:text-cyan-300 dark:border-cyan-700";
      case "DISCIPLINE PROBLEM":
      case "COLLAPSE TRIGGER":
      case "MISSED OPPORTUNITY":
        return "bg-rose-500/15 text-rose-700 border-rose-300 dark:text-rose-300 dark:border-rose-700";
      case "NET-RUN THREAT":
      case "GAME CHANGER":
        return "bg-amber-600/15 text-amber-800 border-amber-300 dark:text-amber-300 dark:border-amber-700";
      default:
        return "bg-slate-500/15 text-slate-700 border-slate-300 dark:text-slate-300 dark:border-slate-700";
    }
  };

  const skinPairs =
    analysis.skinsAnalysisDetailed?.pairs ||
    (analysis as any).skinsAnalysis?.pairs ||
    [];

  const skinsStory =
    analysis.skinsAnalysisDetailed?.skinsStory ||
    (analysis as any).skinsAnalysis?.skinsStory;

  const turningPointDetailed =
    analysis.turningPointDetailed ||
    (analysis as any).turningPointDetail;

  const fatalMistake = analysis.fatalMistake;

  const battingBehaviors = Array.isArray(analysis.battingBehaviour)
    ? analysis.battingBehaviour
    : null;

  const bowlingBehaviors = Array.isArray(analysis.bowlingBehaviour)
    ? analysis.bowlingBehaviour
    : null;

  const captainAnalysis =
    analysis.captainAnalysis ||
    (analysis as any).captainTactics;

  const teamDnaAssessments = Array.isArray(analysis.teamDnaAssessment)
    ? analysis.teamDnaAssessment
    : null;

  const finalVerdict =
    analysis.finalHardHittingVerdict ||
    (analysis as any).finalVerdict;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900 z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
                  {analysis.tournamentName}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {analysis.date} • {analysis.venue}
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                {analysis.editorHeadline}
              </h2>
              <div className="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                {analysis.scoreSummary}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={async () => {
                  const matchUrl = `${window.location.origin}/matches/${analysis.matchId}`;
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: `${analysis.matchTitle} — Analysis`,
                        text: analysis.editorHeadline,
                        url: matchUrl,
                      });
                      return;
                    } catch {}
                  }
                  if (navigator.clipboard) {
                    await navigator.clipboard.writeText(matchUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Share Match Analysis"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
                <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Download / Print PDF"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">PDF</span>
              </button>

              <a
                href={`/api/scorecards/${analysis.matchId}/image?format=webp&download=true`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition"
                title="Download WebP Scorecard"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">WebP</span>
              </a>

              <a
                href={`/api/scorecards/${analysis.matchId}/json?download=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                title="Download Auditable JSON"
              >
                <FileDown className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">JSON</span>
              </a>

              <a
                href={`/matches/${analysis.matchId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                title="Open Dedicated Match Page"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Open</span>
              </a>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ml-1"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab("coach")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "coach"
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-700/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Coach Tactical Breakdown (11 Sections)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "summary"
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-700/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Executive Review</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("scorecard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === "scorecard"
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-700/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Official Scorecard Sheet</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">

          {/* TAB 1: COACH TACTICAL BREAKDOWN */}
          {activeTab === "coach" && (
            <div className="space-y-6">

              {/* SECTION: MATCH VERDICT */}
              {verdict && (
                <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Match Verdict
                    </span>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-lg border uppercase tracking-wider font-mono ${verdictBadgeColor()}`}
                    >
                      {verdict}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {verdictExplanation}
                  </p>
                </div>
              )}

              {/* SECTIONS 1 & 2: WHY WINNER WON vs WHY LOSER LOST */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 1. WHY THE WINNING TEAM WON */}
                <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-4">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-emerald-200/60 dark:border-emerald-800/40">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-emerald-950 dark:text-emerald-300">
                      1. Why {analysis.winner} Won
                    </h3>
                  </div>

                  {analysis.whyWinningTeamWon && analysis.whyWinningTeamWon.length > 0 ? (
                    <div className="space-y-3">
                      {analysis.whyWinningTeamWon.map((pt, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 shadow-2xs space-y-1.5"
                        >
                          <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                            {pt.observation}
                          </div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1">
                            <span className="font-semibold text-emerald-600 shrink-0">Evidence:</span>
                            <span>{pt.evidence}</span>
                          </div>
                          <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium flex items-start gap-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span className="font-semibold shrink-0">Impact:</span>
                            <span>{pt.impact}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-2 text-xs text-emerald-950 dark:text-emerald-200 font-medium">
                      {analysis.whatWentRightWinner.points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* 2. WHY THE LOSING TEAM LOST */}
                <div className="p-5 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/60 space-y-4">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-rose-200/60 dark:border-rose-800/40">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-rose-950 dark:text-rose-300">
                      2. Why {analysis.loser} Lost
                    </h3>
                  </div>

                  {analysis.whyLosingTeamLost && analysis.whyLosingTeamLost.length > 0 ? (
                    <div className="space-y-3">
                      {analysis.whyLosingTeamLost.map((pt, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/40 shadow-2xs space-y-1.5"
                        >
                          <div className="text-xs font-bold text-rose-900 dark:text-rose-200">
                            {pt.observation}
                          </div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1">
                            <span className="font-semibold text-rose-600 shrink-0">Evidence:</span>
                            <span>{pt.evidence}</span>
                          </div>
                          <div className="text-[11px] text-rose-800 dark:text-rose-300 font-medium flex items-start gap-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span className="font-semibold shrink-0">Impact:</span>
                            <span>{pt.impact}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-2 text-xs text-rose-950 dark:text-rose-200 font-medium">
                      {analysis.whatWentWrongLoser.points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-500 font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>

              {/* SECTION 3: SKINS ANALYSIS & SKINS STORY */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                      3. Skins Analysis (4 Batting Pairs)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    Spawtz 4-Skin Metric
                  </span>
                </div>

                {skinPairs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {skinPairs.map((p: any) => {
                      const pairNum = p.pairNumber || p.skinNumber;
                      const winnerPairName = p.winnerPair || p.batters || "Pair " + pairNum;
                      const winnerRuns = p.winnerRuns !== undefined ? p.winnerRuns : p.netScore;
                      const winnerWkts = p.winnerDismissals !== undefined ? p.winnerDismissals : p.wicketsLost || 0;
                      const skinWinner = p.skinWinner || p.winnerTeam || analysis.winner;
                      const margin = p.skinMargin !== undefined ? p.skinMargin : 0;
                      const desc = p.analysis || p.tacticalNotes || "";

                      return (
                        <div
                          key={pairNum}
                          className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wide text-slate-800 dark:text-slate-200">
                              Skin {pairNum}
                            </span>
                            <span
                              className={`text-[10px] font-black px-1.5 py-0.5 rounded font-mono ${
                                skinWinner === analysis.winner
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : skinWinner === "Tied"
                                  ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                  : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                              }`}
                            >
                              Won: {skinWinner}
                            </span>
                          </div>

                          <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                            {winnerPairName}
                          </div>

                          <div className="flex items-center justify-between text-xs font-mono font-bold pt-1 border-t border-slate-200 dark:border-slate-800">
                            <span className="text-emerald-700 dark:text-emerald-400">{winnerRuns} runs</span>
                            <span className="text-rose-600 text-[11px] font-medium">-{winnerWkts * 5} penalty</span>
                          </div>

                          {p.loserPair && (
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                              vs {p.loserPair} ({p.loserRuns} runs)
                            </div>
                          )}

                          {desc && (
                            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800/60">
                              {desc}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {analysis.skinsBreakdown.map((s) => (
                      <div
                        key={s.skin}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="font-mono text-slate-500">Skin {s.skin}</span>
                          <span
                            className={`font-mono text-xs font-black ${
                              s.margin > 0
                                ? "text-emerald-600"
                                : s.margin < 0
                                ? "text-rose-600"
                                : "text-slate-500"
                            }`}
                          >
                            {s.margin > 0 ? `+${s.margin}` : s.margin} runs
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                          <span>{analysis.winner}: {s.winnerRuns}</span>
                          <span>{analysis.loser}: {s.loserRuns}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 dark:border-slate-800 truncate">
                          {s.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {skinsStory && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      # Skins Story
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-300 font-medium leading-relaxed">
                      {skinsStory}
                    </p>
                  </div>
                )}
              </div>

              {/* SECTION 4: THE TURNING POINT (BEFORE -> EVENT -> AFTER -> WHY IT MATTERED) */}
              <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-950 dark:text-amber-300">
                      4. The Turning Point
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-mono">
                    {analysis.turningPoint.phase}
                  </span>
                </div>

                {turningPointDetailed ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-800/40">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                        Before
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        {turningPointDetailed.matchStateBefore || (turningPointDetailed as any).before}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-800/40">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                        Event
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        {turningPointDetailed.event}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-800/40">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                        After
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        {turningPointDetailed.matchStateAfter || (turningPointDetailed as any).after}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-amber-800/40">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                        Why It Mattered
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        {turningPointDetailed.whyItMattered}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
                    {analysis.turningPoint.description}
                  </p>
                )}
              </div>

              {/* SECTION 5: FATAL MISTAKE */}
              {fatalMistake && (
                <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 shrink-0">
                    <AlertOctagon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-rose-950 dark:text-rose-200">
                        5. Fatal Mistake
                      </span>
                    </div>
                    <div className="text-xs font-bold text-rose-900 dark:text-rose-200">
                      {fatalMistake.mistake}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      <span className="font-semibold text-rose-700 dark:text-rose-400">Impact: </span>
                      {fatalMistake.impact || (fatalMistake as any).consequence}
                    </p>
                  </div>
                </div>
              )}

              {/* SECTION 6: PLAYER IMPACT */}
              {analysis.playerImpact && analysis.playerImpact.length > 0 && (
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                        6. Player Impact & Tactical Labels
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      Spawtz Net Contribution Index
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {analysis.playerImpact.map((player: any, idx: number) => {
                      const name = player.player || player.name;
                      const tag = player.label || player.tag || "PLAYER";
                      const explanation = player.explanation || player.why || "";

                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {name}
                            </span>
                            <span
                              className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider font-mono shrink-0 ${getPlayerTagColor(
                                tag
                              )}`}
                            >
                              {tag}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                            {explanation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTIONS 7 & 8: BATTING & BOWLING BEHAVIOUR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 7. BATTING BEHAVIOUR */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <Target className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                      7. Batting Behaviour
                    </h3>
                  </div>

                  {battingBehaviors ? (
                    <div className="space-y-3 text-xs">
                      {battingBehaviors.map((b, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <span
                            className={`font-bold block ${
                              b.team === analysis.winner
                                ? "text-emerald-700 dark:text-emerald-400"
                                : "text-rose-700 dark:text-rose-400"
                            }`}
                          >
                            {b.team}:
                          </span>
                          <ul className="space-y-1 text-slate-700 dark:text-slate-300 font-medium pl-2">
                            {b.observations.map((obs, obsIdx) => (
                              <li key={obsIdx} className="flex items-start gap-1.5">
                                <span className="text-slate-400">•</span>
                                <span>{obs}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Solid running discipline; avoided clustered dismissals.
                    </p>
                  )}
                </div>

                {/* 8. BOWLING & EXTRAS BEHAVIOUR */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                      8. Bowling & Extras Discipline
                    </h3>
                  </div>

                  {bowlingBehaviors ? (
                    <div className="space-y-3 text-xs">
                      {bowlingBehaviors.map((b, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <span
                            className={`font-bold block ${
                              b.team === analysis.winner
                                ? "text-emerald-700 dark:text-emerald-400"
                                : "text-rose-700 dark:text-rose-400"
                            }`}
                          >
                            {b.team}:
                          </span>
                          <ul className="space-y-1 text-slate-700 dark:text-slate-300 font-medium pl-2">
                            {b.observations.map((obs, obsIdx) => (
                              <li key={obsIdx} className="flex items-start gap-1.5">
                                <span className="text-slate-400">•</span>
                                <span>{obs}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Maintained tight corridors and minimized bonus legside extras.
                    </p>
                  )}
                </div>

              </div>

              {/* SECTION 9: CAPTAIN / TACTICAL ANALYSIS & CAPTAIN'S TAKEAWAY */}
              {captainAnalysis && (
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                      9. Captain & Tactical Decision Analysis
                    </h3>
                  </div>

                  {captainAnalysis.evaluation && (
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                        {captainAnalysis.evaluation}
                      </p>
                    </div>
                  )}

                  {captainAnalysis.captainTakeaways && captainAnalysis.captainTakeaways.length > 0 && (
                    <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block">
                        # Captain&apos;s Takeaways
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200 font-semibold">
                        {captainAnalysis.captainTakeaways.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 10: TEAM DNA INSIGHTS */}
              {teamDnaAssessments && teamDnaAssessments.length > 0 && (
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                      10. Team DNA Characteristics
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teamDnaAssessments.map((dna, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border space-y-2 ${
                          dna.team === analysis.winner
                            ? "bg-emerald-50/30 dark:bg-emerald-950/15 border-emerald-100 dark:border-emerald-900/40"
                            : "bg-rose-50/30 dark:bg-rose-950/15 border-rose-100 dark:border-rose-900/40"
                        }`}
                      >
                        <span
                          className={`text-xs font-bold ${
                            dna.team === analysis.winner
                              ? "text-emerald-900 dark:text-emerald-300"
                              : "text-rose-900 dark:text-rose-300"
                          }`}
                        >
                          {dna.team} DNA
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {dna.traits.map((trait, tIdx) => (
                            <span
                              key={tIdx}
                              className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold ${
                                dna.team === analysis.winner
                                  ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200"
                                  : "bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200"
                              }`}
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                        {dna.evidence && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium pt-1">
                            {dna.evidence}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 11: FINAL HARD-HITTING VERDICT */}
              {finalVerdict && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white shadow-xl space-y-1.5 border border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                    11. Final Hard-Hitting Verdict
                  </span>
                  <p className="text-sm font-bold text-slate-100 leading-relaxed italic">
                    &ldquo;{finalVerdict}&rdquo;
                  </p>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: EXECUTIVE SUMMARY */}
          {activeTab === "summary" && (
            <div className="space-y-6">
              
              {/* Sports Editor Read */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Sports Editor Review
                </span>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {analysis.editorSummary}
                </p>
              </div>

              {/* Decisive Turning Point */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-200">
                      Turning Point: {analysis.turningPoint.phase}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-mono">
                      {analysis.turningPoint.nature}
                    </span>
                  </div>
                  <p className="text-xs text-amber-950 dark:text-amber-200 mt-1.5 leading-relaxed font-medium">
                    {analysis.turningPoint.description}
                  </p>
                </div>
              </div>

              {/* Tactical Breakdown: Winner vs Loser */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Winner */}
                <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-emerald-200/60 dark:border-emerald-800/40">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-emerald-950 dark:text-emerald-300">
                      {analysis.whatWentRightWinner.title}
                    </h3>
                  </div>
                  <ul className="space-y-2 text-xs text-emerald-950 dark:text-emerald-200 font-medium">
                    {analysis.whatWentRightWinner.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Loser */}
                <div className="p-5 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/60 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-rose-200/60 dark:border-rose-800/40">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-rose-950 dark:text-rose-300">
                      {analysis.whatWentWrongLoser.title}
                    </h3>
                  </div>
                  <ul className="space-y-2 text-xs text-rose-950 dark:text-rose-200 font-medium">
                    {analysis.whatWentWrongLoser.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Skin-by-Skin Differential Table */}
              <div className="space-y-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 block">
                  Skin-by-Skin Momentum & Net Margins
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {analysis.skinsBreakdown.map((s) => (
                    <div
                      key={s.skin}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="font-mono text-slate-500">Skin {s.skin}</span>
                        <span
                          className={`font-mono text-xs font-black ${
                            s.margin > 0
                              ? "text-emerald-600"
                              : s.margin < 0
                              ? "text-rose-600"
                              : "text-slate-500"
                          }`}
                        >
                          {s.margin > 0 ? `+${s.margin}` : s.margin} runs
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                        <span>{analysis.winner}: {s.winnerRuns}</span>
                        <span>{analysis.loser}: {s.loserRuns}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 dark:border-slate-800 truncate">
                        {s.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: OFFICIAL SCORECARD SHEET */}
          {activeTab === "scorecard" && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>Official Scorecard Sheet</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Original handwritten sheet with 16 overs, 4 skins, runs conceded, and net contribution.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-700 text-xs">
                    <button
                      onClick={() => setScorecardZoom((z) => Math.max(0.5, z - 0.2))}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-12 text-center font-mono font-bold text-slate-600 dark:text-slate-300 text-[11px]">
                      {Math.round(scorecardZoom * 100)}%
                    </span>
                    <button
                      onClick={() => setScorecardZoom((z) => Math.min(2.5, z + 0.2))}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setScorecardZoom(1)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition cursor-pointer ml-1"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <a
                    href={`/api/scorecards/${analysis.matchId}/image?format=webp&download=true`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-2xs"
                    title="Download WebP compressed scorecard"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download WebP</span>
                  </a>

                  <a
                    href={`/api/scorecards/${analysis.matchId}/json?download=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition"
                    title="Download Auditable JSON"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Download JSON</span>
                  </a>

                  <a
                    href={`/api/scorecards/${analysis.matchId}/image`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Open in Full Size"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Image Box */}
              <div className="relative overflow-auto rounded-2xl bg-slate-950 border border-slate-800 p-4 flex items-center justify-center min-h-[480px] max-h-[70vh] shadow-xl">
                <div
                  style={{ transform: `scale(${scorecardZoom})`, transformOrigin: "top center" }}
                  className="transition-transform duration-150 ease-out max-w-full flex justify-center py-2"
                >
                  <img
                    src={`/api/scorecards/${analysis.matchId}/image`}
                    alt={`Scorecard for ${analysis.matchTitle}`}
                    className="rounded-lg shadow-2xl max-h-[65vh] w-auto max-w-full object-contain mx-auto border border-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Compressed to WebP Q75 (max 1800px)</span>
                <a
                  href={`/api/scorecards/${analysis.matchId}/json`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline font-mono"
                >
                  Inspect Auditable JSON API ↗
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0 flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium">
            Indoor Cricket Post-Match Analyst • Saved in DB
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
