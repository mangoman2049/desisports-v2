"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Users,
  Calendar,
  Award,
  ExternalLink,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  X,
  Maximize2,
  CheckCircle2,
  Shield,
  Layers,
  Download,
  FileDown,
} from "lucide-react";
import MatchAnalysisButton from "@/components/MatchAnalysisButton";
import MatchCard from "@/components/MatchCard";

interface TeamStanding {
  pos: number;
  team: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  forRuns: number;
  againstRuns: number;
  diff: string;
  points: number;
}

interface PlayerStatItem {
  rank: string;
  playerId: string;
  name: string;
  value: string;
  avatar: string | null;
}

interface FixtureItem {
  id: number;
  date: string;
  stage: string;
  team1: string;
  score1: number;
  winner1: boolean;
  team2: string;
  score2: number;
  winner2: boolean;
  potm: string;
  scorecardUrl: string;
}

interface SquadPlayer {
  id: string;
  name: string;
  avatar?: string | null;
}

interface SquadItem {
  id: number;
  team: string;
  captain: string;
  playerCount: number;
  players: SquadPlayer[];
}

interface TournamentData {
  title: string;
  teams: { name: string; captain: string; badge: string; color: string }[];
  standings: TeamStanding[];
  topRunGetters: PlayerStatItem[];
  topWicketTakers: PlayerStatItem[];
  topContributors: PlayerStatItem[];
  fixtures: FixtureItem[];
  squads: SquadItem[];
}

export default function TournamentView({ data }: { data: TournamentData }) {
  const [includeFinals, setIncludeFinals] = useState(true);
  const [selectedScorecard, setSelectedScorecard] = useState<FixtureItem | null>(null);
  const [selectedSquad, setSelectedSquad] = useState<SquadItem | null>(null);
  const [scorecardZoom, setScorecardZoom] = useState(1);

  // Group stage filtered stats if user chooses to exclude finals
  const runGettersDisplay = includeFinals
    ? data.topRunGetters
    : [
        { rank: "🥇", playerId: "53", name: "Sajid Merchant", value: "67", avatar: data.topRunGetters[1]?.avatar || null },
        { rank: "2", playerId: "27", name: "Himanshu Kalyani", value: "62", avatar: data.topRunGetters[2]?.avatar || null },
        { rank: "3", playerId: "30", name: "Kalrav Shah", value: "58", avatar: data.topRunGetters[3]?.avatar || null },
        { rank: "4", playerId: "45", name: "Prateek Nahar", value: "52", avatar: data.topRunGetters[0]?.avatar || null },
        { rank: "5", playerId: "25", name: "Harshal joshi", value: "44", avatar: null },
      ];

  const wicketTakersDisplay = includeFinals
    ? data.topWicketTakers
    : [
        { rank: "🥇", playerId: "5", name: "Ankush Goel", value: "10", avatar: null },
        { rank: "2", playerId: "25", name: "Harshal joshi", value: "8", avatar: null },
        { rank: "3", playerId: "36", name: "Manthan Shah", value: "7", avatar: data.topWicketTakers[2]?.avatar || null },
        { rank: "4", playerId: "60", name: "Tejas Shah", value: "7", avatar: null },
        { rank: "5", playerId: "53", name: "Sajid Merchant", value: "6", avatar: data.topWicketTakers[4]?.avatar || null },
      ];

  const contributorsDisplay = includeFinals
    ? data.topContributors
    : [
        { rank: "🥇", playerId: "5", name: "Ankush Goel", value: "48", avatar: null },
        { rank: "2", playerId: "25", name: "Harshal joshi", value: "39", avatar: null },
        { rank: "3", playerId: "45", name: "Prateek Nahar", value: "38", avatar: data.topContributors[1]?.avatar || null },
        { rank: "4", playerId: "27", name: "Himanshu Kalyani", value: "37", avatar: data.topContributors[3]?.avatar || null },
        { rank: "5", playerId: "53", name: "Sajid Merchant", value: "35", avatar: data.topContributors[4]?.avatar || null },
      ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Tournament Complete
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                11 May — 18 May 2026
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Insportz Club, Dubai
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {data.title}
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl">
              Official Spawtz 16-Over Indoor Cricket Championship. 4 Teams, 6 Fixtures, 4 Skins per match, -5 run penalty dismissals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/scorecards/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold tracking-wide transition border border-white/10"
            >
              <Layers className="w-4 h-4" />
              <span>Upload Scorecard</span>
            </Link>
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-slate-400">Champions</div>
            <div className="text-base font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
              <Trophy className="w-4 h-4" />
              <span>DesiTigers</span>
            </div>
          </div>
          <div>
            <div className="text-slate-400">Runner-Up</div>
            <div className="text-base font-bold text-slate-200 mt-0.5">VPGR</div>
          </div>
          <div>
            <div className="text-slate-400">Tournament MVP</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">Ankush Goel (48 pts)</div>
          </div>
          <div>
            <div className="text-slate-400">Top Run-Getter</div>
            <div className="text-base font-bold text-blue-400 mt-0.5">Prateek Nahar (74 runs)</div>
          </div>
        </div>
      </div>

      {/* SECTION 1: POINTS TABLE */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Points Table
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Top 2 advanced to Championship Final
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3.5 w-12 text-center">#</th>
                  <th className="px-4 py-3.5">Team</th>
                  <th className="px-3 py-3.5 text-center">P</th>
                  <th className="px-3 py-3.5 text-center">W</th>
                  <th className="px-3 py-3.5 text-center">L</th>
                  <th className="px-3 py-3.5 text-center">T</th>
                  <th className="px-3 py-3.5 text-right">For</th>
                  <th className="px-3 py-3.5 text-right">Agst</th>
                  <th className="px-3 py-3.5 text-right">Diff</th>
                  <th className="px-4 py-3.5 text-right font-black">Pts</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.standings.map((row) => {
                  const isTopTwo = row.pos <= 2;
                  return (
                    <tr
                      key={row.pos}
                      className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition ${
                        row.pos === 1
                          ? "bg-amber-50/30 dark:bg-amber-950/10"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-3.5 text-center font-bold">
                        {row.pos === 1 ? (
                          <span className="inline-block text-amber-500 font-black">🥇</span>
                        ) : row.pos === 2 ? (
                          <span className="inline-block text-slate-400 font-black">🥈</span>
                        ) : row.pos === 3 ? (
                          <span className="inline-block text-amber-700 font-black">🥉</span>
                        ) : (
                          <span className="text-slate-400 font-mono">{row.pos}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white ${
                            row.team.includes("Tigers")
                              ? "bg-emerald-600"
                              : row.team.includes("VPGR")
                              ? "bg-purple-600"
                              : row.team.includes("Dabanggs")
                              ? "bg-amber-600"
                              : "bg-blue-600"
                          }`}
                        >
                          {row.team.charAt(0)}
                        </span>
                        <span>{row.team}</span>
                      </td>
                      <td className="px-3 py-3.5 text-center font-mono text-slate-600 dark:text-slate-300">
                        {row.played}
                      </td>
                      <td className="px-3 py-3.5 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {row.won}
                      </td>
                      <td className="px-3 py-3.5 text-center font-mono text-slate-500 dark:text-slate-400">
                        {row.lost}
                      </td>
                      <td className="px-3 py-3.5 text-center font-mono text-slate-500 dark:text-slate-400">
                        {row.tied}
                      </td>
                      <td className="px-3 py-3.5 text-right font-mono text-slate-700 dark:text-slate-300">
                        {row.forRuns}
                      </td>
                      <td className="px-3 py-3.5 text-right font-mono text-slate-700 dark:text-slate-300">
                        {row.againstRuns}
                      </td>
                      <td
                        className={`px-3 py-3.5 text-right font-mono font-bold ${
                          row.diff.startsWith("+")
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {row.diff}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-sm font-black text-slate-900 dark:text-white">
                        {row.points}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {isTopTwo ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Finalist
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Playoff
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 2: SQUADS & TEAMS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Teams & Squads
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Click any squad to inspect full roster
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.squads.map((squad) => {
            const teamMeta = data.teams.find((t) => t.name === squad.team) || {
              color: "purple",
              badge: squad.team.charAt(0),
            };

            return (
              <Link
                key={squad.id}
                href={`/tournaments/1/teams/${squad.id}`}
                className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-purple-400/50 transition flex flex-col justify-between block"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-sm ${
                          squad.team.includes("Tigers")
                            ? "bg-emerald-600"
                            : squad.team.includes("VPGR")
                            ? "bg-purple-600"
                            : squad.team.includes("Dabanggs")
                            ? "bg-amber-600"
                            : "bg-blue-600"
                        }`}
                      >
                        {teamMeta.badge}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                          {squad.team}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {squad.captain}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {squad.playerCount}
                    </span>
                  </div>

                  {/* Sample Players Avatars */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                      Featured Roster
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {squad.players.slice(0, 4).map((p) => (
                        <span
                          key={p.id}
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="truncate max-w-[90px]">{p.name}</span>
                        </span>
                      ))}
                      {squad.players.length > 4 && (
                        <span className="inline-flex items-center text-[11px] font-semibold text-purple-600 dark:text-purple-400 px-1 py-1">
                          +{squad.players.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
                  <span>View Team & Team DNA™</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: PLAYER STATISTICS (LEADERBOARDS) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Player Statistics
            </h2>
          </div>

          {/* Finals Toggle Pill */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold self-start sm:self-auto border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setIncludeFinals(true)}
              className={`px-3 py-1.5 rounded-lg transition ${
                includeFinals
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All Matches (incl. Finals)
            </button>
            <button
              onClick={() => setIncludeFinals(false)}
              className={`px-3 py-1.5 rounded-lg transition ${
                !includeFinals
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Group Stage Only
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Run-Getters Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-2xl">🏏</span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Top Run-Getters
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Total gross & net runs scored
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
              {runGettersDisplay.map((p, idx) => (
                <Link
                  key={p.playerId}
                  href={`/player/${p.playerId}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition group"
                >
                  <span className="w-6 text-center font-mono font-bold text-xs text-slate-400 group-hover:text-emerald-600">
                    {p.rank || idx + 1}
                  </span>
                  {p.avatar ? (
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                      {p.name.charAt(0)}
                    </div>
                  )}
                  <span className="flex-1 truncate text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                    {p.name}
                  </span>
                  <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20">
                    {p.value} runs
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Wicket-Takers Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-2xl">🎳</span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Top Wicket-Takers
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Total wickets credited to bowler
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
              {wicketTakersDisplay.map((p, idx) => (
                <Link
                  key={p.playerId}
                  href={`/player/${p.playerId}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition group"
                >
                  <span className="w-6 text-center font-mono font-bold text-xs text-slate-400 group-hover:text-purple-600">
                    {p.rank || idx + 1}
                  </span>
                  {p.avatar ? (
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                      {p.name.charAt(0)}
                    </div>
                  )}
                  <span className="flex-1 truncate text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                    {p.name}
                  </span>
                  <span className="text-xs font-mono font-black text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded border border-purple-500/20">
                    {p.value} wkts
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Contributors / MVP Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-2xl">⭐</span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Top Contributors (MVP)
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Total Contribution C = RS - RC
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
              {contributorsDisplay.map((p, idx) => (
                <Link
                  key={p.playerId}
                  href={`/player/${p.playerId}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition group"
                >
                  <span className="w-6 text-center font-mono font-bold text-xs text-slate-400 group-hover:text-amber-600">
                    {p.rank || idx + 1}
                  </span>
                  {p.avatar ? (
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                      {p.name.charAt(0)}
                    </div>
                  )}
                  <span className="flex-1 truncate text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                    {p.name}
                  </span>
                  <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/20">
                    +{p.value} pts
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: FIXTURES & SCORECARDS (ALL 6 MATCHES) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Fixtures & Scorecards (6 Matches)
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Click Scorecard to inspect verified Spawtz sheet
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...data.fixtures].sort((a, b) => b.id - a.id).map((fixture) => (
            <MatchCard
              key={fixture.id}
              id={fixture.id}
              date={fixture.date}
              tournamentName="Desi Boys May 2026"
              stage={fixture.stage}
              team1={{
                name: fixture.team1,
                score: fixture.score1,
                isWinner: fixture.winner1,
              }}
              team2={{
                name: fixture.team2,
                score: fixture.score2,
                isWinner: fixture.winner2,
              }}
              potm={fixture.potm}
              scorecardUrl={fixture.scorecardUrl}
              onViewScorecard={() => {
                setSelectedScorecard(fixture);
                setScorecardZoom(1);
              }}
            />
          ))}
        </div>
      </section>

      {/* MODAL 1: INTERACTIVE SCORECARD LIGHTBOX */}
      {selectedScorecard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-mono">{selectedScorecard.date}</span>
                  <span>•</span>
                  <span className="text-amber-400 font-bold">{selectedScorecard.stage}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedScorecard.team1} ({selectedScorecard.score1}) vs{" "}
                  {selectedScorecard.team2} ({selectedScorecard.score2})
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScorecardZoom((z) => Math.max(0.6, z - 0.2))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-slate-400 w-12 text-center">
                  {Math.round(scorecardZoom * 100)}%
                </span>
                <button
                  onClick={() => setScorecardZoom((z) => Math.min(2.5, z + 0.2))}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <a
                  href={`/api/scorecards/${selectedScorecard.id}/image?format=webp&download=true`}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition ml-1"
                  title="Download Scorecard in WebP format"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WebP</span>
                </a>
                <a
                  href={`/api/scorecards/${selectedScorecard.id}/json?download=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                  title="Download Auditable JSON"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">JSON</span>
                </a>
                <a
                  href={selectedScorecard.scorecardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  title="Open Raw Image in New Tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setSelectedScorecard(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition ml-2"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Image Display Viewer */}
            <div className="flex-1 overflow-auto p-4 bg-black/40 flex items-center justify-center min-h-[450px]">
              <div
                style={{ transform: `scale(${scorecardZoom})`, transformOrigin: "top center" }}
                className="transition-transform duration-100 ease-out max-w-full"
              >
                <img
                  src={selectedScorecard.scorecardUrl}
                  alt={`Scorecard: ${selectedScorecard.team1} vs ${selectedScorecard.team2}`}
                  className="rounded-lg shadow-2xl max-h-[70vh] object-contain mx-auto"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400">⭐</span>
                <span>Player of the Match:</span>
                <strong className="text-white">{selectedScorecard.potm}</strong>
              </span>
              <span className="text-slate-500 font-mono text-[11px]">
                Hosted remotely · 0 MB local footprint
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FULL SQUAD ROSTER DRAWER */}
      {selectedSquad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-sm">
                  {selectedSquad.team.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedSquad.team} Squad
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedSquad.captain} • {selectedSquad.playerCount} Players
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSquad(null)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-2">
              {selectedSquad.players.map((p, idx) => (
                <Link
                  key={p.id}
                  href={`/player/${p.id}`}
                  onClick={() => setSelectedSquad(null)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-center text-xs font-mono text-slate-400">
                      {idx + 1}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                      {p.name.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                      {p.name}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 group-hover:text-purple-600 flex items-center gap-0.5">
                    <span>Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-center">
              <button
                onClick={() => setSelectedSquad(null)}
                className="w-full py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
