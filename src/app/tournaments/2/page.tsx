import Link from "next/link";
import {
  Calendar,
  Users,
  Trophy,
  Shield,
  ChevronRight,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import tournament2Data from "../../../../prisma/tournament_2_data.json";
import { getTournamentDetails } from "@/lib/tournament-service";
import MatchCard from "@/components/MatchCard";

export const metadata = {
  title: "DesiBoys Bazooka 4.0 | DesiSports V2",
  description:
    "Official squads, registered players, and match schedule for DesiBoys Bazooka 4.0.",
};

export default async function TournamentTwoPage() {
  const data = tournament2Data;
  const dynamicData = await getTournamentDetails(2);

  const matchDates = [
    { date: "Fri, 18 Sep 2026", time: "8:00 PM", day: "Friday" },
    { date: "Mon, 21 Sep 2026", time: "8:00 PM", day: "Monday" },
    { date: "Wed, 23 Sep 2026", time: "8:00 PM", day: "Wednesday" },
    { date: "Mon, 28 Sep 2026", time: "8:00 PM", day: "Monday" },
    { date: "Wed, 30 Sep 2026", time: "8:00 PM", day: "Wednesday" },
    { date: "Fri, 02 Oct 2026", time: "8:00 PM", day: "Friday" },
    { date: "Mon, 05 Oct 2026", time: "8:00 PM", day: "Monday" },
    { date: "Wed, 07 Oct 2026", time: "9:30 PM", day: "Wednesday" },
    { date: "Fri, 09 Oct 2026", time: "8:00 PM", day: "Finals!" },
  ];

  const hasCompletedMatches = dynamicData.fixtures && dynamicData.fixtures.length > 0;

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

        {/* Quick Highlights Strip */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-slate-400">Tournament Format</div>
            <div className="text-base font-bold text-amber-400 mt-0.5">
              Bazooka Rules (2x Runs)
            </div>
          </div>
          <div>
            <div className="text-slate-400">Registered Players</div>
            <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
              {data.registeredPlayersCount}
            </div>
          </div>
          <div>
            <div className="text-slate-400">Franchise Teams</div>
            <div className="text-xl font-black text-sky-400 font-mono mt-0.5">
              {data.teams.length}
            </div>
          </div>
          <div>
            <div className="text-slate-400">Budget Cap per Team</div>
            <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
              {data.budgetPerTeam} pts
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: POINTS TABLE (DYNAMIC) */}
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
              : "Pre-Tournament Standings • Matches starting 18 Sep 2026"}
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
                {dynamicData.standings.map((row) => {
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
      </section>

      {/* SECTION 2: COMPLETED MATCHES & SCORECARDS (IF ANY) */}
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
              {dynamicData.fixtures.length} Match(es) Recorded
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dynamicData.fixtures.map((fix) => (
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

      {/* SECTION 3: SQUADS & TEAMS */}
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
          {data.squads.map((squad) => {
            const teamMeta = data.teams.find((t) => t.name === squad.team) || {
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
                  <span>View Team DNA™ & Squad</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: MATCH DATES */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-600" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Match Dates & Fixture Schedule
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {matchDates.map((m, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 shadow-xs"
            >
              <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/50">
                <span className="text-[10px] uppercase leading-none">{m.date.split(" ")[2]}</span>
                <span className="text-sm leading-tight">{m.date.split(" ")[1]}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {m.date}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {m.time} • {m.day}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: REGISTERED PLAYERS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Registered Players ({data.registeredPlayers.length})
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Player Availability Pool
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-h-[60vh] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase tracking-wider sticky top-0 bg-slate-50 dark:bg-slate-800 z-10">
                <th className="px-5 py-3">Player</th>
                <th className="px-4 py-3 text-right">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.registeredPlayers.map((p, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                >
                  <td className="px-5 py-2.5 font-medium text-slate-900 dark:text-white">
                    <Link
                      href={`/player/${p.id}`}
                      className="hover:text-emerald-600 hover:underline inline-flex items-center gap-2.5"
                    >
                      <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                        {p.name.charAt(0)}
                      </span>
                      <span>{p.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold text-emerald-600">
                    {p.daysFree || "Registered"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
