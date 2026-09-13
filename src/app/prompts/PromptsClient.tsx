"use client";

import React, { useState } from "react";
import {
  Code,
  Copy,
  Check,
  Download,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  Database,
  Calendar,
  User,
  Activity,
  Maximize2,
  Minimize2,
  WrapText,
} from "lucide-react";

export interface PromptItem {
  id: "match" | "team" | "player";
  title: string;
  badge: string;
  author: string;
  lastUpdated: string;
  version: string;
  llmModel: string;
  temperature: string;
  triggerEvent: string;
  executionPolicy: string;
  storageTarget: string;
  invocationsCount: number;
  tokensSavedPct: number;
  promptText: string;
  description: string;
  sourceFile: string;
}

interface PromptsClientProps {
  prompts: PromptItem[];
  overallStats: {
    totalInvocations: number;
    matchAnalysisCount: number;
    teamDnaCount: number;
    playerDnaCount: number;
    totalMatches: number;
    totalPlayers: number;
  };
}

export default function PromptsClient({
  prompts,
  overallStats,
}: PromptsClientProps) {
  const [activeTab, setActiveTab] = useState<"match" | "team" | "player">("match");
  const [copied, setCopied] = useState(false);
  const [wrapLines, setWrapLines] = useState(true);
  const [fullHeight, setFullHeight] = useState(false);

  const currentPrompt = prompts.find((p) => p.id === activeTab) || prompts[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentPrompt.promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Could not copy prompt text:", err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([currentPrompt.promptText], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${currentPrompt.id}_system_prompt.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const promptLines = currentPrompt.promptText.split("\n");
  const estTokens = Math.round(currentPrompt.promptText.length / 4);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header & Observability Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-0.5 rounded-full border border-purple-500/20 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Internal Observability Console
            </span>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              Unlisted Route
            </span>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Zero Token Drift on Reads
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            System Prompts & Prompt Telemetry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            Read-only code inspection for the 3 isolated prompt engineering modules. Monitor invocation frequency, target LLM models, and strict event-driven triggers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Author & Maintainer</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Manish Pandey</span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 block font-mono">manishp15@iimb.ac.in</span>
          </div>
        </div>
      </div>

      {/* Observability KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Decoupled Prompts */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Active Prompt Engines</span>
            <Cpu className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            3 <span className="text-xs font-normal text-slate-500">Decoupled</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Match Tactical, Team DNA, Player Tactical
          </p>
        </div>

        {/* KPI 2: Live Invocations */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Total Invocations (Stored)</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {overallStats.totalInvocations} <span className="text-xs font-normal text-slate-500">records</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {overallStats.matchAnalysisCount} matches · {overallStats.teamDnaCount} teams · {overallStats.playerDnaCount} players
          </p>
        </div>

        {/* KPI 3: Default LLM Stack */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Default LLM & Engine</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white truncate">
            gemini-1.5-pro
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            LiteLLM Proxy + Grounded Fallback
          </p>
        </div>

        {/* KPI 4: Read Token Efficiency */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Read Token Efficiency</span>
            <ShieldCheck className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            100% <span className="text-xs font-normal text-slate-500">Cached</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            0 tokens burned on web visits/reads
          </p>
        </div>
      </div>

      {/* SUBTABS NAVIGATION */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 overflow-x-auto">
        {prompts.map((p, index) => {
          const isActive = activeTab === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActiveTab(p.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
              }`}
            >
              <span className="h-5 w-5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center text-[10px] font-mono">
                0{index + 1}
              </span>
              <span>{p.title}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {p.invocationsCount} stored
              </span>
            </button>
          );
        })}
      </div>

      {/* SELECTED PROMPT DETAILS & METADATA BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left 4 cols: Prompt Specs & Runtime Metadata */}
        <div className="md:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold">
                Engine Specification
              </span>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                {currentPrompt.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentPrompt.description}
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Source File:</span>
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[170px]" title={currentPrompt.sourceFile}>
                  {currentPrompt.sourceFile}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">LLM Model:</span>
                <span className="font-mono text-[11px] text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-md">
                  {currentPrompt.llmModel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Sampling Temp:</span>
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                  {currentPrompt.temperature}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Prompt Length:</span>
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  {promptLines.length} lines (~{estTokens.toLocaleString()} tokens)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Version / Date:</span>
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  {currentPrompt.version} ({currentPrompt.lastUpdated})
                </span>
              </div>
            </div>
          </div>

          {/* Trigger Policy Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                Trigger & Caching Contract
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Trigger Event</span>
                <span className="font-semibold text-slate-200">{currentPrompt.triggerEvent}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Execution Frequency</span>
                <span className="font-semibold text-slate-200">{currentPrompt.executionPolicy}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Storage Target</span>
                <span className="font-mono text-[11px] text-purple-300">{currentPrompt.storageTarget}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 leading-relaxed">
              <strong>Zero-Token Guarantee:</strong> Subsequent page visits, browser refreshes, or visits on different days read exclusively from stored records.
            </div>
          </div>
        </div>

        {/* Right 8 cols: Code Embed UI */}
        <div className="md:col-span-8 flex flex-col space-y-2">
          {/* Code Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-t-2xl bg-slate-900 border-x border-t border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-bold text-slate-200">
                {currentPrompt.id.toUpperCase()}_SYSTEM_PROMPT.txt
              </span>
              <span className="text-slate-500 text-[10px]">
                [READ-ONLY]
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setWrapLines(!wrapLines)}
                className={`p-1.5 rounded-lg border text-xs transition cursor-pointer ${
                  wrapLines
                    ? "bg-purple-600/30 border-purple-500/40 text-purple-300"
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                }`}
                title="Toggle Line Wrap"
              >
                <WrapText className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setFullHeight(!fullHeight)}
                className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                title={fullHeight ? "Collapse Height" : "Expand Full Height"}
              >
                {fullHeight ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Prompt"}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Code Gutter & Editor Container */}
          <div
            className={`rounded-b-2xl border-x border-b border-slate-800 bg-slate-950 font-mono text-xs overflow-auto select-text shadow-inner ${
              fullHeight ? "min-h-[500px]" : "h-[620px]"
            }`}
          >
            <div className="flex">
              {/* Line Numbers Gutter */}
              <div className="select-none py-4 px-3 text-right text-slate-600 bg-slate-950/80 border-r border-slate-900 shrink-0 font-mono text-[11px] leading-relaxed">
                {promptLines.map((_, i) => (
                  <div key={i} className="h-5">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Code Text Content */}
              <div
                className={`p-4 text-slate-300 leading-relaxed font-mono text-[11px] ${
                  wrapLines ? "whitespace-pre-wrap break-words" : "whitespace-pre overflow-x-auto"
                } flex-1`}
              >
                {promptLines.map((line, i) => {
                  const isHeader = line.startsWith("=") || line.startsWith("#") || line.startsWith("---");
                  const isSectionTitle = /^[A-Z0-9\s—\(\)\-\:\,\.]{4,}$/.test(line.trim()) && line.trim().length > 3;
                  const isAuthor = line.includes("Author:") || line.includes("Manish Pandey");

                  let styleClass = "text-slate-300";
                  if (isHeader) {
                    styleClass = "text-purple-400 font-bold opacity-80";
                  } else if (isSectionTitle) {
                    styleClass = "text-amber-300 font-bold";
                  } else if (isAuthor) {
                    styleClass = "text-emerald-400 font-semibold";
                  } else if (line.startsWith("- ") || line.startsWith("* ")) {
                    styleClass = "text-slate-200";
                  }

                  return (
                    <div key={i} className={`h-5 ${styleClass}`}>
                      {line || "\u00A0"}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
