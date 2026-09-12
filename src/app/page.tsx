import Link from "next/link";
import {
  UploadCloud,
  Shield,
  Users,
  Trophy,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileCheck,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-10 py-4">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>DesiSports V2 — High-Density Indoor Cricket Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Precision Scorecard Intake & Captain Strategy
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Reconciles Spawtz 16-over sheets with multi-factor visual quality gates, deterministic cricket rules, fast maker-checker auditing, and 32 evidence-led captain insights.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/admin/scorecards/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Scan Scorecard (Admin Flow)</span>
          </Link>
          <Link
            href="/tournaments"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow transition"
          >
            <Trophy className="h-4 w-4" />
            <span>Tournaments & Leaderboards</span>
          </Link>
          <Link
            href="/player/35"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs shadow transition border border-slate-700"
          >
            <Users className="h-4 w-4" />
            <span>Player Profiles</span>
          </Link>
        </div>
      </div>

      {/* 3 Core Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1: Admin Intake */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <UploadCloud className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Admin Scorecard Intake & Maker-Checker
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Mobile camera capture with immediate quality gate (blur, glare, exposure, resolution). Fixed-template extraction reads ball-by-ball cells, dismissals (R, B, C, ST), and skin totals with fast maker-checker auditing.
            </p>
          </div>

          <Link
            href="/tournaments/upload"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline pt-2"
          >
            <span>Scan Scorecard</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Module 2: Player Profile */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. Player Performance & Tactical DNA
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Complete player KPIs: contribution score, form chips, chronological match history table, multi-series charts, ball-by-ball boundary rates, and optimal batting partner synergies.
            </p>
          </div>

          <Link
            href="/player/35"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-2"
          >
            <span>View Player Profile</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Module 3: Tournaments & Team DNA */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Trophy className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              3. Tournaments, Standings & Match Analyses
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Official tournament standings, squad registrations, Team DNA™ radar ratings, skin-by-skin breakdowns, and sports editor post-match analytical reviews for every fixture.
            </p>
          </div>

          <Link
            href="/tournaments"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline pt-2"
          >
            <span>Explore Tournaments</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
