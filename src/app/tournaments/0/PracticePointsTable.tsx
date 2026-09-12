"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpDown, ArrowUp, ArrowDown, Trophy, Search } from "lucide-react";
import PlayerAvatar from "@/components/PlayerAvatar";

export interface PracticePlayerStat {
  id: number;
  name: string;
  matchesPlayed: number;
  runsScored: number;
  oversBowled: number;
  runsConceded: number;
  wickets: number;
  economy: number;
  contribution: number;
  potmCount: number;
  role?: string;
}

interface Props {
  initialData: PracticePlayerStat[];
}

type SortField =
  | "name"
  | "matchesPlayed"
  | "runsScored"
  | "oversBowled"
  | "runsConceded"
  | "wickets"
  | "economy"
  | "contribution"
  | "potmCount";

export default function PracticePointsTable({ initialData }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("contribution");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      // For runs conceded or economy, ascending is naturally better, but default descending for everything else
      setSortDirection(field === "runsConceded" || field === "economy" ? "asc" : "desc");
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...initialData];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(term));
    }

    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "string") {
        return sortDirection === "asc"
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }

      return sortDirection === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return result;
  }, [initialData, searchTerm, sortField, sortDirection]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60 ml-1 inline" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-emerald-600 font-bold ml-1 inline" />
    ) : (
      <ArrowDown className="w-3 h-3 text-emerald-600 font-bold ml-1 inline" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Controls & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-emerald-600" />
          <span className="text-xs text-slate-500 font-medium">
            Sorted by <strong className="text-slate-800 dark:text-slate-200 capitalize">{sortField}</strong> ({sortDirection === "desc" ? "highest first" : "lowest first"})
          </span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search practice player..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Standings Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/50 text-slate-500 font-mono text-[11px] uppercase select-none">
              <th className="py-3 px-3 w-12 text-center">#</th>
              <th
                onClick={() => handleSort("name")}
                className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
              >
                Player {renderSortIcon("name")}
              </th>
              <th
                onClick={() => handleSort("matchesPlayed")}
                className="py-3 px-3 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white"
              >
                M {renderSortIcon("matchesPlayed")}
              </th>
              <th
                onClick={() => handleSort("runsScored")}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
              >
                RS {renderSortIcon("runsScored")}
              </th>
              <th
                onClick={() => handleSort("oversBowled")}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
              >
                OB {renderSortIcon("oversBowled")}
              </th>
              <th
                onClick={() => handleSort("runsConceded")}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
              >
                RC {renderSortIcon("runsConceded")}
              </th>
              <th
                onClick={() => handleSort("wickets")}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
              >
                W {renderSortIcon("wickets")}
              </th>
              <th
                onClick={() => handleSort("economy")}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
              >
                ECON {renderSortIcon("economy")}
              </th>
              <th
                onClick={() => handleSort("contribution")}
                className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white bg-emerald-500/5 dark:bg-emerald-500/10 font-bold"
              >
                Contribution (C) {renderSortIcon("contribution")}
              </th>
              <th
                onClick={() => handleSort("potmCount")}
                className="py-3 px-3 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white"
              >
                POTM {renderSortIcon("potmCount")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredAndSorted.map((p, idx) => (
              <tr
                key={p.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-850/60 transition group"
              >
                <td className="py-3 px-3 text-center font-mono text-slate-400 font-bold">
                  {idx + 1}
                </td>
                <td className="py-3 px-3">
                  <Link
                    href={`/player/${p.id}`}
                    className="flex items-center gap-2.5 group-hover:text-emerald-600 transition"
                  >
                    <PlayerAvatar name={p.name} size="sm" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {p.name}
                      </span>
                      {p.role && (
                        <span className="text-[10px] text-slate-400">{p.role}</span>
                      )}
                    </div>
                  </Link>
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                  {p.matchesPlayed}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                  {p.runsScored}
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                  {p.oversBowled.toFixed(1)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                  {p.runsConceded}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-purple-600 dark:text-purple-400">
                  {p.wickets}
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                  {p.economy.toFixed(2)}
                </td>
                <td className="py-3 px-3 text-right font-mono font-black bg-emerald-500/5 dark:bg-emerald-500/10">
                  <span
                    className={
                      p.contribution > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : p.contribution < 0
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-slate-600"
                    }
                  >
                    {p.contribution > 0 ? `+${p.contribution}` : p.contribution}
                  </span>
                </td>
                <td className="py-3 px-3 text-center">
                  {p.potmCount > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      ★ {p.potmCount}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-mono">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-slate-400 font-mono">
        * Spawtz indoor cricket metrics: $C = RS - RC$ (Runs Scored minus Runs Conceded). $ECON = RC / OB$. Click any column header to sort.
      </p>
    </div>
  );
}
