"use client";

import Link from "next/link";
import { Calendar, Trophy, ArrowRight, FileText, ChevronRight } from "lucide-react";
import MatchAnalysisButton from "@/components/MatchAnalysisButton";

export interface MatchCardTeam {
  name: string;
  score: number;
  skins?: number;
  isWinner?: boolean;
}

export interface MatchCardProps {
  id: number | string;
  date: string;
  time?: string;
  tournamentName?: string;
  stage?: string;
  status?: string;
  venue?: string;
  umpire?: string;
  team1: MatchCardTeam;
  team2: MatchCardTeam;
  potm?: string;
  scorecardUrl?: string;
  onViewScorecard?: () => void;
  showHubLink?: boolean;
}

export default function MatchCard({
  id,
  date,
  time,
  tournamentName,
  stage,
  status = "COMPLETED",
  venue,
  umpire,
  team1,
  team2,
  potm,
  scorecardUrl,
  onViewScorecard,
  showHubLink = true,
}: MatchCardProps) {
  const isFinal = stage === "Final";
  const displayTag = stage || tournamentName || "Indoor Cricket";

  const getTeamBadgeColor = (name: string, isFirst: boolean) => {
    if (name.includes("Tigers")) return "bg-emerald-600 text-white";
    if (name.includes("VPGR")) return "bg-purple-600 text-white";
    if (name.includes("Dabanggs")) return "bg-amber-600 text-white";
    if (name.includes("Rising Stars") || name.includes("Super Kings")) return "bg-blue-600 text-white";
    return isFirst
      ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
      : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400";
  };

  return (
    <div
      className={`rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4 ${
        isFinal
          ? "border-amber-400/40 dark:border-amber-500/30 bg-gradient-to-br from-white to-amber-50/20 dark:from-slate-900 dark:to-amber-950/10"
          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      <div>
        {/* Top Header: Date, Stage/Tournament, Status */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {date}
              {time ? ` • ${time}` : ""}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-medium ${
                isFinal
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-700"
                  : stage === "3rd Place Playoff"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              {displayTag}
            </span>
          </div>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded text-[10px] tracking-wide">
            {status}
          </span>
        </div>

        {/* Scoreboard: Team 1 & Team 2 */}
        <div className="mt-3.5 space-y-2.5">
          {/* Team 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={`h-6 w-6 rounded-md font-black text-[11px] flex items-center justify-center shrink-0 ${getTeamBadgeColor(
                  team1.name,
                  true
                )}`}
              >
                {team1.name.charAt(0)}
              </span>
              <span
                className={`text-sm ${
                  team1.isWinner
                    ? "font-black text-slate-900 dark:text-white"
                    : "font-semibold text-slate-700 dark:text-slate-300"
                }`}
              >
                {team1.name}
                {team1.isWinner && (
                  <span className="ml-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    (W)
                  </span>
                )}
              </span>
            </div>
            <div className="text-right font-mono">
              <span
                className={`text-lg font-black ${
                  team1.isWinner
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                {team1.score}
              </span>
              {typeof team1.skins === "number" && (
                <span className="text-xs text-slate-400 ml-1.5 font-medium">
                  ({team1.skins} skins)
                </span>
              )}
            </div>
          </div>

          {/* Team 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={`h-6 w-6 rounded-md font-black text-[11px] flex items-center justify-center shrink-0 ${getTeamBadgeColor(
                  team2.name,
                  false
                )}`}
              >
                {team2.name.charAt(0)}
              </span>
              <span
                className={`text-sm ${
                  team2.isWinner
                    ? "font-black text-slate-900 dark:text-white"
                    : "font-semibold text-slate-700 dark:text-slate-300"
                }`}
              >
                {team2.name}
                {team2.isWinner && (
                  <span className="ml-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    (W)
                  </span>
                )}
              </span>
            </div>
            <div className="text-right font-mono">
              <span
                className={`text-lg font-black ${
                  team2.isWinner
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                {team2.score}
              </span>
              {typeof team2.skins === "number" && (
                <span className="text-xs text-slate-400 ml-1.5 font-medium">
                  ({team2.skins} skins)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* POTM */}
        {potm && (
          <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
            <Trophy className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              Player of the Match: <span className="font-bold">{potm}</span>
            </span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs flex-wrap gap-2">
        <span className="text-slate-400 font-mono text-[11px]">
          {umpire ? `Umpire: ${umpire}` : venue || "Insportz Club, Dubai"}
        </span>

        <div className="flex items-center gap-2">
          {/* Scorecard button */}
          {onViewScorecard ? (
            <button
              onClick={onViewScorecard}
              type="button"
              className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Scorecard</span>
            </button>
          ) : scorecardUrl ? (
            <Link
              href={scorecardUrl}
              className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Scorecard</span>
            </Link>
          ) : (
            <Link
              href={`/matches/${id}`}
              className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Scorecard</span>
            </Link>
          )}

          {/* Tactical Analysis Modal CTA */}
          <MatchAnalysisButton matchId={id} label="Tactical Analysis" />

          {/* Analysis Hub link */}
          {showHubLink && (
            <Link
              href={`/matches/${id}`}
              className="font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-0.5 text-xs transition"
            >
              <span>Hub</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
