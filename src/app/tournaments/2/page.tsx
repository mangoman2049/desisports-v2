import Link from "next/link";
import {
  Calendar,
  Users,
  Trophy,
  Award,
  ChevronRight,
  Clock,
  Layers,
  ArrowRight,
} from "lucide-react";
import tournament2Data from "../../../../prisma/tournament_2_data.json";
import { getTournamentDetails } from "@/lib/tournament-service";
import MatchCard from "@/components/MatchCard";

export const metadata = {
  title: "DesiBoys Bazooka 4.0 | DesiSports V2",
  description:
    "Official squads, Bazooka rules, and match schedule for DesiBoys Bazooka 4.0.",
};

export default async function TournamentTwoPage() {
  const data = tournament2Data;
  const dynamicData = await getTournamentDetails(2);

  const completedMatches = (dynamicData.fixtures || []).filter((f: any) => f.status === "COMPLETED");
  const hasCompletedMatches = completedMatches.length > 0;
  const standings = dynamicData.standings || [];
  const topRunGetters = dynamicData.topRunGetters || [];
  const topWicketTakers = dynamicData.topWicketTakers || [];
  const topContributors = dynamicData.topContributors || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Clock className="w-3.5 h-3.5" />
                {hasCompletedMatches ? "Active Tournament" : "Yet to Start"}
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {data.dates}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {data.venue}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {data.title}
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl">
              Premier 16-Over Indoor Cricket Tournament featuring 4 franchise squads, Spawtz points structure (1 pt per skin win, 4 pts match win), and high-stakes Bazooka overs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/scorecards/new?tournamentId=2"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold tracking-wide transition shadow-lg shadow-purple-900/30"
            >
              <Layers className="w-4 h-4" />
              <span>Upload Bazooka Scorecard</span>
            </Link>
          </div>
        </div>

        {/* Quick Highlights Strip - Data Hygiene: 100% authentic tournament metrics */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-slate-400">Tournament Format</div>
            <div className="text-base font-bold text-amber-400 mt-0.5">
              Bazooka Rules (2x Runs)
            </div>
          </div>
          <div>
            <div className="text-slate-400">Franchise Squads</div>
            <div className="text-xl font-black text-sky-400 font-mono mt-0.5">
              {data.teams.length} Teams
            </div>
          </div>
          <div>
            <div className="text-slate-400">Squad Roster</div>
            <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
              52 Players
            </div>
          </div>
          <div>
            <div className="text-slate-400">Scheduled Fixtures</div>
            <div className="text-xl font-black text-purple-400 font-mono mt-0.5">
              {(data.fixtures || []).length} Matches
            </div>
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
            {hasCompletedMatches
              ? "Live Standings • 1 pt Skin Win • 4 pts Match Win"
              : "Tournament Yet to Start • Commencing 18 Sep 2026"}
          </span>
        </div>

        {hasCompletedMatches && standings.length > 0 ? (
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
                  {standings.map((row: any) => {
                    const isTopTwo = row.pos <= 2;
                    return (
                      <tr
                        key={row.team}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                      >
                        <td className="px-4 py-3 text-center font-mono font-bold text-slate-400">
                          {row.pos}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                          {row.team}
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-slate-600 dark:text-slate-300">
                          {row.played}
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-emerald-600 font-bold">
                          {row.won}
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-rose-600">
                          {row.lost}
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-slate-400">
                          {row.tied}
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-slate-600 dark:text-slate-300">
                          {row.forRuns}
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-slate-600 dark:text-slate-300">
                          {row.againstRuns}
                        </td>
                        <td
                          className={`px-3 py-3 text-right font-mono font-semibold ${
                            row.diff.startsWith("+")
                              ? "text-emerald-600"
                              : row.diff.startsWith("-")
                              ? "text-rose-600"
                              : "text-slate-400"
                          }`}
                        >
                          {row.diff}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-black text-slate-900 dark:text-white text-sm">
                          {row.points}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isTopTwo
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {isTopTwo ? "Finals Contender" : "In Contention"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3 border border-amber-500/20">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Points Table Yet to Open
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
              No matches have been played yet. Official standings, net run differential, and Spawtz tournament points (1 pt per skin win, 4 pts per match win) will populate automatically when the first match scorecard is uploaded and approved.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>First Fixture: Desi Titans vs Desi Dabanggs • Fri, 18 Sep 2026, 8:00 PM</span>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 2: PLAYER STATISTICS (LEADERBOARDS) - PLACEHOLDERS SAME AS TOURNAMENT 1 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Player Statistics
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {hasCompletedMatches
              ? "Tournament Leaderboards"
              : "Leaderboards will open with first match scorecard"}
          </span>
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

            <div className="divide-y divide-slate-100 dark:border-slate-800 flex-1 flex flex-col justify-center min-h-[160px]">
              {topRunGetters.length > 0 ? (
                topRunGetters.map((p: any, idx: number) => (
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
                ))
              ) : (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <span className="text-3xl mb-2 opacity-30">🏏</span>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    No Batting Records Yet
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-[220px]">
                    Top run-getters will populate automatically once match scorecards are approved.
                  </p>
                </div>
              )}
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

            <div className="divide-y divide-slate-100 dark:border-slate-800 flex-1 flex flex-col justify-center min-h-[160px]">
              {topWicketTakers.length > 0 ? (
                topWicketTakers.map((p: any, idx: number) => (
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
                ))
              ) : (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <span className="text-3xl mb-2 opacity-30">🎳</span>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    No Bowling Records Yet
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-[220px]">
                    Top wicket-takers will populate automatically once match scorecards are approved.
                  </p>
                </div>
              )}
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
                  Net Contribution C = RS - RC
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:border-slate-800 flex-1 flex flex-col justify-center min-h-[160px]">
              {topContributors.length > 0 ? (
                topContributors.map((p: any, idx: number) => (
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
                      {p.value} pts
                    </span>
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <span className="text-3xl mb-2 opacity-30">⭐</span>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    No MVP Standings Yet
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-[220px]">
                    Top contributors will populate automatically once match scorecards are approved.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: COMPLETED MATCHES & SCORECARDS (DYNAMIC - ONLY IF PLAYED) */}
      {hasCompletedMatches && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Completed Matches & Scorecards
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {completedMatches.length} Match(es) Recorded
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedMatches.map((fix: any) => (
              <MatchCard
                key={fix.id}
                id={String(fix.id)}
                date={fix.date}
                time="8:00 PM"
                tournamentName="DesiBoys Bazooka 4.0"
                stage={fix.stage || "Group Match"}
                venue={data.venue}
                team1={{
                  name: fix.team1,
                  score: fix.score1,
                  isWinner: fix.winner1,
                }}
                team2={{
                  name: fix.team2,
                  score: fix.score2,
                  isWinner: fix.winner2,
                }}
                potm={fix.potm}
                scorecardUrl={fix.scorecardUrl}
              />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 4: SQUADS & TEAMS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Teams & Squads
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Click any squad to inspect registered roster
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.squads.map((squad: any) => {
            const teamMeta = data.teams.find((t: any) => t.name === squad.team) || {
              color: "purple",
              badge: squad.team.charAt(0),
            };

            return (
              <Link
                key={squad.id}
                href={`/tournaments/2/teams/${squad.id}`}
                className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-purple-400/50 transition flex flex-col justify-between block"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-sm ${
                          squad.team.includes("Tigers")
                            ? "bg-purple-600"
                            : squad.team.includes("Titans")
                            ? "bg-amber-600"
                            : squad.team.includes("Dabanggs")
                            ? "bg-sky-600"
                            : "bg-pink-600"
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

                  {/* Sample Players */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                      Squad Roster Sample
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {squad.players.slice(0, 4).map((p: any) => (
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
                  <span>View Team DNA™ & Squad</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: MATCH DATES & FIXTURE SCHEDULE (9 MATCHES) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Official Match Schedule & Fixtures ({(dynamicData.fixtures || []).length} Matches)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            18 Sep — 09 Oct 2026 • Insportz Club, Dubai
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(dynamicData.fixtures || []).map((m: any, idx: number) => {
            const isCompleted = m.status === "COMPLETED";

            return (
              <div
                key={m.id || idx}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {m.stage || `Match #${idx + 1}`}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                      }`}
                    >
                      {isCompleted ? "Completed" : "Upcoming"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {m.team1} <span className="text-slate-400 font-normal">vs</span> {m.team2}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{m.date}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  {isCompleted ? (
                    <Link
                      href={m.scorecardUrl || `/matches/${m.id}`}
                      className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>View Scorecard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <Link
                      href={`/admin/scorecards/new?tournamentId=2&fixtureId=${m.fixtureId || m.id}`}
                      className="font-bold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Upload Scorecard</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  <span className="text-[11px] text-slate-400">Court 1</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
