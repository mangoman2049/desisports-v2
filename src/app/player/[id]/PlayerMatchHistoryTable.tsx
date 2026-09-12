"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpDown, ArrowUp, ArrowDown, FileText } from "lucide-react";

export interface MatchHistoryItem {
  id: number;
  matchId: number;
  matchDate: string;
  opponentTitle: string;
  scorecardUrl?: string | null;
  runsScored: number;
  oversBowled: number;
  runsConceded: number;
  wickets: number;
  economy: number;
  contribution: number;
  isPotm: boolean;
  performanceNote?: string | null;
}

interface Props {
  matches: MatchHistoryItem[];
}

type SortCol =
  | "date"
  | "opponent"
  | "runsScored"
  | "oversBowled"
  | "runsConceded"
  | "wickets"
  | "economy"
  | "contribution"
  | "isPotm";

export default function PlayerMatchHistoryTable({ matches }: Props) {
  // Default sort: Latest match at top (date descending)
  const [sortCol, setSortCol] = useState<SortCol>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleSort = (col: SortCol) => {
    if (sortCol === col) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      // For runs conceded or economy, ascending is naturally better, but default descending for everything else
      setSortDir(col === "runsConceded" || col === "economy" ? "asc" : "desc");
    }
  };

  const sortedMatches = useMemo(() => {
    const list = [...matches];

    list.sort((a, b) => {
      if (sortCol === "date") {
        const timeA = new Date(a.matchDate).getTime() || 0;
        const timeB = new Date(b.matchDate).getTime() || 0;
        return sortDir === "asc" ? timeA - timeB : timeB - timeA;
      }

      if (sortCol === "opponent") {
        return sortDir === "asc"
          ? a.opponentTitle.localeCompare(b.opponentTitle)
          : b.opponentTitle.localeCompare(a.opponentTitle);
      }

      let aVal = a[sortCol];
      let bVal = b[sortCol];

      if (typeof aVal === "boolean") {
        return sortDir === "asc" ? (aVal ? 1 : -1) : bVal ? 1 : -1;
      }

      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return list;
  }, [matches, sortCol, sortDir]);

  const renderSortIcon = (col: SortCol) => {
    if (sortCol !== col) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60 ml-1 inline" />;
    }
    return sortDir === "asc" ? (
      <ArrowUp className="w-3 h-3 text-emerald-600 font-bold ml-1 inline" />
    ) : (
      <ArrowDown className="w-3 h-3 text-emerald-600 font-bold ml-1 inline" />
    );
  };

  if (matches.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
        <p className="text-xs text-slate-500 font-medium">
          No match history logged yet for this player.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
            <th
              onClick={() => handleSort("date")}
              className="py-2.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
            >
              Date {renderSortIcon("date")}
            </th>
            <th
              onClick={() => handleSort("opponent")}
              className="py-2.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
            >
              Match / Opponent {renderSortIcon("opponent")}
            </th>
            <th
              onClick={() => handleSort("runsScored")}
              className="py-2.5 px-3 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white"
            >
              RS {renderSortIcon("runsScored")}
            </th>
            <th className="py-2.5 px-3 text-center">OUT</th>
            <th
              onClick={() => handleSort("oversBowled")}
              className="py-2.5 px-3 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white"
            >
              OB {renderSortIcon("oversBowled")}
            </th>
            <th
              onClick={() => handleSort("runsConceded")}
              className="py-2.5 px-3 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white"
            >
              RC {renderSortIcon("runsConceded")}
            </th>
            <th
              onClick={() => handleSort("wickets")}
              className="py-2.5 px-3 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white"
            >
              WKTS {renderSortIcon("wickets")}
            </th>
            <th
              onClick={() => handleSort("economy")}
              className="py-2.5 px-3 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white"
            >
              ECON {renderSortIcon("economy")}
            </th>
            <th
              onClick={() => handleSort("contribution")}
              className="py-2.5 px-3 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white font-bold bg-emerald-500/5 dark:bg-emerald-500/10"
            >
              C {renderSortIcon("contribution")}
            </th>
            <th
              onClick={() => handleSort("isPotm")}
              className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
            >
              POTM {renderSortIcon("isPotm")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {sortedMatches.map((s) => {
            const dateParts = s.matchDate.split(",")[0].trim().split(" ");
            const day = dateParts[0] || "01";
            const monthYear = dateParts.slice(1).join(" ") || "2026";
            const isPotm = s.isPotm;

            return (
              <tr
                key={s.id}
                className={`hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition ${
                  isPotm ? "bg-amber-50/40 dark:bg-amber-950/20" : ""
                }`}
              >
                {/* Date Badge */}
                <td className="py-3 px-3">
                  <div className="h-11 w-14 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center justify-center shadow-2xs">
                    <span className="text-sm font-black text-slate-900 dark:text-white leading-none">
                      {day}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase leading-tight mt-0.5">
                      {monthYear}
                    </span>
                  </div>
                </td>

                {/* Match Opponent & Link */}
                <td className="py-3 px-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/matches/${s.matchId}`}
                        className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 transition"
                      >
                        {s.opponentTitle}
                      </Link>
                      {s.scorecardUrl && (
                        <a
                          href={s.scorecardUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                          title="View Official Scorecard"
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    {isPotm && (
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block">
                        ★ Player of the match!
                      </span>
                    )}
                    {!isPotm && s.performanceNote && (
                      <span className="text-[10px] text-slate-500 block">
                        {s.performanceNote}
                      </span>
                    )}
                  </div>
                </td>

                {/* RS */}
                <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600 text-sm">
                  {s.runsScored}
                </td>

                {/* OUT */}
                <td className="py-3 px-3 text-center font-mono text-slate-500">
                  0
                </td>

                {/* OB */}
                <td className="py-3 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                  {s.oversBowled.toFixed(1)}
                </td>

                {/* RC */}
                <td className="py-3 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                  {s.runsConceded}
                </td>

                {/* WKTS */}
                <td className="py-3 px-3 text-center">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-mono font-bold text-xs">
                    {s.wickets}
                  </span>
                </td>

                {/* ECON */}
                <td className="py-3 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                  {s.economy.toFixed(2)}
                </td>

                {/* Contribution */}
                <td className="py-3 px-3 text-center font-mono font-black text-sm bg-emerald-500/5 dark:bg-emerald-500/10">
                  <span className={s.contribution >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                    {s.contribution > 0 ? `+${s.contribution}` : s.contribution}
                  </span>
                </td>

                {/* POTM */}
                <td className="py-3 px-3 text-right">
                  {isPotm ? (
                    <span className="text-amber-500 font-black text-base" title="Player of the match">
                      ★
                    </span>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600 font-mono">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
