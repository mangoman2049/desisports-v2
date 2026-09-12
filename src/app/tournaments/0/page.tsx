import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Trophy,
  Users,
  Layers,
  ArrowRight,
  Shield,
  FileText,
  Flame,
  Award,
} from "lucide-react";
import MatchAnalysisButton from "@/components/MatchAnalysisButton";

export const metadata = {
  title: "Desisports Regular Practice | DesiSports V2",
  description:
    "Official tracking for weekly net sessions, practice matches & friendly indoor cricket games.",
};

export default function TournamentZeroPage() {
  const practiceFixtures = [
    {
      id: "practice-1",
      date: "09 Sep 2026",
      time: "20:17",
      venue: "Insportz Club, Dubai (Court 2)",
      team1: "Home Team",
      score1: 63,
      team2: "Away Team",
      score2: 120,
      potm: "Yash (+19 contribution)",
      status: "Completed",
      scorecardUrl: "/admin/scorecards/1/review",
    },
  ];

  const topPracticePerformers = [
    { name: "Yash", runs: 18, wickets: 3, contribution: "+19", potm: "1 Award", avatar: null, id: 65 },
    { name: "Manthan Shah", runs: 28, wickets: 2, contribution: "+32", potm: "0", avatar: null, id: 36 },
    { name: "Himanshu Kalyani", runs: 24, wickets: 2, contribution: "+28", potm: "0", avatar: null, id: 27 },
    { name: "Ankush Goel", runs: 20, wickets: 3, contribution: "+26", potm: "0", avatar: null, id: 5 },
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
                Active Practice
              </span>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Weekly Net Sessions
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Insportz Club, Dubai
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Desisports Regular Practice
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl">
              Non-tournament regular practice & friendly indoor cricket games. Matches recorded here contribute directly to individual player career statistics and Team DNA™ models.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/scorecards/new?tournamentId=0"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-wide transition shadow-lg shadow-emerald-900/30"
            >
              <Layers className="w-4 h-4" />
              <span>Upload Practice Scorecard</span>
            </Link>
          </div>
        </div>

        {/* Practice Notice */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            ℹ️ Regular practice sessions do not utilize locked squad cards. All registered players can participate freely.
          </span>
          <Link
            href="/players"
            className="text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1"
          >
            <span>View All Players</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* SECTION 1: PRACTICE FIXTURES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Practice Matches & Scorecards
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {practiceFixtures.length} Match Recorded
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {practiceFixtures.map((fix) => (
            <div
              key={fix.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold">{fix.date} • {fix.time}</span>
                <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold text-slate-600 dark:text-slate-300">
                  {fix.venue}
                </span>
              </div>

              <div className="flex items-center justify-between px-2">
                {/* Team 1 */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase block">
                    {fix.team1}
                  </span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                    {fix.score1}
                  </span>
                </div>

                <span className="text-xs font-bold text-slate-400 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-mono">
                  VS
                </span>

                {/* Team 2 */}
                <div className="space-y-1 text-right">
                  <span className="text-xs font-bold text-emerald-600 uppercase block">
                    {fix.team2} ★
                  </span>
                  <span className="text-2xl font-black text-emerald-600 font-mono">
                    {fix.score2}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                  <Award className="w-3.5 h-3.5" />
                  <span>POTM: {fix.potm}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MatchAnalysisButton matchId="7" />
                  <Link
                    href={fix.scorecardUrl}
                    className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Scorecard</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: TOP PRACTICE PERFORMERS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Top Practice Performers
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Overall Impact Leaderboard
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topPracticePerformers.map((performer, idx) => (
            <Link
              key={performer.id}
              href={`/player/${performer.id}`}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 hover:shadow-md transition group block"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 font-mono">
                  #{idx + 1}
                </span>
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {performer.contribution} C
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition">
                {performer.name}
              </h3>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Runs
                  </span>
                  <span className="text-base font-black font-mono text-slate-900 dark:text-white">
                    {performer.runs}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Wickets
                  </span>
                  <span className="text-base font-black font-mono text-purple-600">
                    {performer.wickets}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
