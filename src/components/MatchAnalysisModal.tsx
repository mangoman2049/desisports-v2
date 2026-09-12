"use client";

import { useState } from "react";
import {
  X,
  Trophy,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { MatchTacticalAnalysis } from "@/lib/match-analyses";

interface Props {
  analysis: MatchTacticalAnalysis;
  onClose: () => void;
}

export default function MatchAnalysisModal({ analysis, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                {analysis.tournamentName}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {analysis.date} • {analysis.venue}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              {analysis.editorHeadline}
            </h2>
            <div className="mt-1 text-xs font-bold text-emerald-700">
              {analysis.scoreSummary}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sports Editor Read */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Sports Editor Review
          </span>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {analysis.editorSummary}
          </p>
        </div>

        {/* Decisive Turning Point */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                Turning Point: {analysis.turningPoint.phase}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-white text-amber-800 border border-amber-200 font-mono">
                {analysis.turningPoint.nature}
              </span>
            </div>
            <p className="text-xs text-amber-950 mt-1 leading-relaxed font-medium">
              {analysis.turningPoint.description}
            </p>
          </div>
        </div>

        {/* Tactical Breakdown: Winner vs Loser */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Winner */}
          <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-emerald-200/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                {analysis.whatWentRightWinner.title}
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-emerald-950 font-medium">
              {analysis.whatWentRightWinner.points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Loser */}
          <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-200/80 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-rose-200/60">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <h3 className="text-xs font-black uppercase tracking-wider text-rose-950">
                {analysis.whatWentWrongLoser.title}
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-rose-950 font-medium">
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
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 block">
            Skin-by-Skin Momentum & Net Margins
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {analysis.skinsBreakdown.map((s) => (
              <div
                key={s.skin}
                className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5"
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
                <div className="flex justify-between text-[11px] text-slate-600 font-mono">
                  <span>{analysis.winner}: {s.winnerRuns}</span>
                  <span>{analysis.loser}: {s.loserRuns}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 truncate">
                  {s.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Persisted Match Tactical Review • Zero Token Overhead</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
