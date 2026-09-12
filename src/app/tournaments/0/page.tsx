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
import { prisma } from "@/lib/prisma";
import MatchCard from "@/components/MatchCard";
import PracticePointsTable, { PracticePlayerStat } from "./PracticePointsTable";

export const metadata = {
  title: "Desisports Regular Practice | DesiSports V2",
  description:
    "Official tracking for weekly net sessions, practice matches & friendly indoor cricket games.",
};

// Ground truth 16-player list from the 09-Sep-2026 scorecard (reconciled Spawtz sheet)
const DEFAULT_PRACTICE_STANDINGS: PracticePlayerStat[] = [
  { id: 101, name: "Yash", matchesPlayed: 1, runsScored: 18, oversBowled: 2.0, runsConceded: -1, wickets: 3, economy: -0.5, contribution: 19, potmCount: 1, role: "All-Rounder" },
  { id: 36, name: "Manthan Shah", matchesPlayed: 1, runsScored: 29, oversBowled: 2.0, runsConceded: 13, wickets: 1, economy: 6.5, contribution: 16, potmCount: 0, role: "Batter" },
  { id: 105, name: "Arif", matchesPlayed: 1, runsScored: 14, oversBowled: 2.0, runsConceded: 3, wickets: 3, economy: 1.5, contribution: 11, potmCount: 0, role: "All-Rounder" },
  { id: 102, name: "Deepak", matchesPlayed: 1, runsScored: 16, oversBowled: 2.0, runsConceded: 5, wickets: 2, economy: 2.5, contribution: 11, potmCount: 0, role: "All-Rounder" },
  { id: 109, name: "Narendra", matchesPlayed: 1, runsScored: 13, oversBowled: 2.0, runsConceded: 3, wickets: 3, economy: 1.5, contribution: 10, potmCount: 0, role: "All-Rounder" },
  { id: 113, name: "Gagan", matchesPlayed: 1, runsScored: 16, oversBowled: 2.0, runsConceded: 7, wickets: 3, economy: 3.5, contribution: 9, potmCount: 0, role: "All-Rounder" },
  { id: 112, name: "Sahil", matchesPlayed: 1, runsScored: 3, oversBowled: 2.0, runsConceded: -4, wickets: 3, economy: -2.0, contribution: 7, potmCount: 0, role: "Bowler" },
  { id: 35, name: "Manish Pandey", matchesPlayed: 1, runsScored: 20, oversBowled: 2.0, runsConceded: 14, wickets: 1, economy: 7.0, contribution: 6, potmCount: 0, role: "Batter" },
  { id: 110, name: "Viral", matchesPlayed: 1, runsScored: 18, oversBowled: 2.0, runsConceded: 12, wickets: 2, economy: 6.0, contribution: 6, potmCount: 0, role: "Batter" },
  { id: 45, name: "Prateek Nahar", matchesPlayed: 1, runsScored: -1, oversBowled: 2.0, runsConceded: 1, wickets: 3, economy: 0.5, contribution: -2, potmCount: 0, role: "All-Rounder" },
  { id: 106, name: "Sahil A", matchesPlayed: 1, runsScored: 11, oversBowled: 2.0, runsConceded: 21, wickets: 0, economy: 10.5, contribution: -10, potmCount: 0, role: "Batter" },
  { id: 111, name: "Sunny", matchesPlayed: 1, runsScored: 16, oversBowled: 2.0, runsConceded: 27, wickets: 0, economy: 13.5, contribution: -11, potmCount: 0, role: "Batter" },
  { id: 23, name: "Hardik Desai", matchesPlayed: 1, runsScored: 0, oversBowled: 2.0, runsConceded: 12, wickets: 1, economy: 6.0, contribution: -12, potmCount: 0, role: "All-Rounder" },
  { id: 108, name: "Shubham", matchesPlayed: 1, runsScored: 13, oversBowled: 2.0, runsConceded: 29, wickets: 0, economy: 14.5, contribution: -16, potmCount: 0, role: "Batter" },
  { id: 103, name: "Akshay", matchesPlayed: 1, runsScored: 2, oversBowled: 2.0, runsConceded: 21, wickets: 0, economy: 10.5, contribution: -19, potmCount: 0, role: "Bowler" },
  { id: 104, name: "Jigar", matchesPlayed: 1, runsScored: -5, oversBowled: 2.0, runsConceded: 20, wickets: 0, economy: 10.0, contribution: -25, potmCount: 0, role: "Batter" },
];

export default async function TournamentZeroPage() {
  let practiceStandingsData: PracticePlayerStat[] = DEFAULT_PRACTICE_STANDINGS;

  try {
    const dbStats = await prisma.playerMatchStat.findMany({
      where: {
        matchId: 7,
      },
      include: {
        player: true,
      },
      orderBy: {
        contribution: "desc",
      },
    });

    if (dbStats && dbStats.length >= 10) {
      practiceStandingsData = dbStats.map((s) => ({
        id: s.playerId,
        name: s.player.canonicalName,
        matchesPlayed: 1,
        runsScored: s.runsScored,
        oversBowled: s.oversBowled,
        runsConceded: s.runsConceded,
        wickets: s.wickets,
        economy: s.economy,
        contribution: s.contribution,
        potmCount: s.isPotm ? 1 : 0,
        role: s.player.fieldingPosition || (s.wickets >= 2 && s.runsScored >= 10 ? "All-Rounder" : s.wickets >= 2 ? "Bowler" : "Batter"),
      }));
    }
  } catch (err) {
    console.warn("Could not query DB for practice stats, using grounded defaults:", err);
  }

  // Top 4 impact performers from the practice match
  const topPracticePerformers = practiceStandingsData.slice(0, 4).map((p) => ({
    id: p.id,
    name: p.name,
    runs: p.runsScored,
    wickets: p.wickets,
    contribution: p.contribution > 0 ? `+${p.contribution}` : `${p.contribution}`,
    potm: p.potmCount > 0 ? "1 Award" : "0",
  }));

  const practiceFixtures = [
    {
      id: "7",
      date: "09 Sep 2026",
      time: "20:17",
      venue: "Insportz Club, Dubai (Court 1)",
      team1: "Home Team",
      score1: 63,
      team2: "Away Team",
      score2: 120,
      potm: "Yash (+19 contribution)",
      status: "Completed",
      scorecardUrl: "/matches/7",
    },
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
            ℹ️ Regular practice sessions do not utilize locked squad cards. All 16 players from the 09-Sept match are recorded with verified Spawtz reconciliations.
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
            {practiceFixtures.length} Match Recorded • 16 Players Participated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {practiceFixtures.map((fix) => (
            <MatchCard
              key={fix.id}
              id="7"
              date={fix.date}
              time={fix.time}
              tournamentName="Regular Practice"
              stage="Practice Match"
              venue={fix.venue}
              team1={{
                name: fix.team1,
                score: fix.score1,
                isWinner: fix.score1 > fix.score2,
              }}
              team2={{
                name: fix.team2,
                score: fix.score2,
                isWinner: fix.score2 > fix.score1,
              }}
              potm={fix.potm}
              scorecardUrl={fix.scorecardUrl}
            />
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

      {/* SECTION 3: PRACTICE PERFORMERS POINTS TABLE (ALL 16 PLAYERS) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Practice Performers Points Table ({practiceStandingsData.length} Players)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            All 16 Players from 09-Sept • Ranked by Net Contribution
          </span>
        </div>

        <PracticePointsTable initialData={practiceStandingsData} />
      </section>
    </div>
  );
}
