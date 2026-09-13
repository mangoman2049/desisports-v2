import Link from "next/link";
import { notFound } from "next/navigation";
import tournament1Data from "../../../../../../prisma/tournament_1_data.json";
import tournament2Data from "../../../../../../prisma/tournament_2_data.json";
import {
  ArrowLeft,
  Shield,
  Zap,
  Users,
  Award,
  Sparkles,
  TrendingUp,
  Target,
  Flame,
  ChevronRight,
  Activity,
  Layers,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Clock,
  Compass,
} from "lucide-react";
import { getTeamTacticalData } from "@/lib/team-tactical";
import { getTournament2TeamDNA } from "@/lib/tournament-2-team-dna";

interface PageProps {
  params: {
    tournamentId: string;
    teamId: string;
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getTournamentData(tournamentId: string) {
  if (tournamentId === "2") return tournament2Data;
  return tournament1Data;
}

export async function generateMetadata({ params }: PageProps) {
  const tData = getTournamentData(params.tournamentId);
  const teamIdNum = parseInt(params.teamId, 10);
  const squad = tData.squads.find((s) => s.id === teamIdNum);
  const teamName = squad ? squad.team : `Team ${params.teamId}`;
  const isT2 = params.tournamentId === "2";
  const t2DNA = isT2 ? getTournament2TeamDNA(teamIdNum) : null;

  return {
    title: `${teamName} — Team DNA™ & Squad | DesiSports V2`,
    description: isT2
      ? `Pre-tournament Team DNA hypothesis, player archetypes, pairing combinations, and Bazooka tactical intelligence for ${teamName}.`
      : `Registered squad, player archetypes, pair combination intelligence, and Team DNA™ scores for ${teamName}.`,
    openGraph: {
      title: `${teamName} — Team DNA™ & Intelligence`,
      description: isT2 && t2DNA
        ? t2DNA.statement
        : `Explore ${teamName}'s Team DNA on DesiSports V2.`,
      images: ["/images/team-dna-share.png"],
    },
  };
}

export default function DedicatedTeamPage({ params }: PageProps) {
  const tournamentId = params.tournamentId;
  const teamIdNum = parseInt(params.teamId, 10);
  const tData = getTournamentData(tournamentId);

  const squad = tData.squads.find((s) => s.id === teamIdNum);
  if (!squad) notFound();

  const teamMeta = tData.teams.find((t) => t.name === squad.team) || {
    name: squad.team,
    captain: squad.captain,
    badge: squad.team.charAt(0),
    color: "purple",
  };

  const isT2 = tournamentId === "2";
  const t2DNA = isT2 ? getTournament2TeamDNA(teamIdNum) : null;
  const tactical = getTeamTacticalData(squad.team);

  // Grounded Team DNA dimensions strictly tied to tournament finish
  const teamDNA = {
    batting: tactical.batting,
    bowling: tactical.bowling,
    fielding: tactical.fielding,
    teamChemistry: tactical.teamChemistry,
    dependencyScore: isT2 ? (t2DNA?.teamDependency.level === "HIGHLY DEPENDENT" ? 58 : 42) : 41,
  };

  // Derived Archetypes for squad members (PRD Section 7 & 12)
  const archetypes = [
    { label: "Boundary Hunter", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { label: "Strike Bowler", color: "bg-rose-50 text-rose-700 border-rose-200" },
    { label: "Accumulator", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { label: "Anchor", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { label: "Finisher", color: "bg-purple-50 text-purple-700 border-purple-200" },
    { label: "Control Bowler", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    { label: "Death Specialist", color: "bg-pink-50 text-pink-700 border-pink-200" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Navigation Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href={`/tournaments/${tournamentId}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition" />
          <span>Back to {tData.title}</span>
        </Link>
        {isT2 && (
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-full border border-amber-200/80 dark:border-amber-800/60">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>PRE-TOURNAMENT / HYPOTHESIS MODE (Bazooka 4.0)</span>
          </div>
        )}
      </div>

      {/* Team Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black text-white text-3xl shadow-sm ${
              squad.team.includes("Tigers")
                ? "bg-purple-600"
                : squad.team.includes("Challengers")
                ? "bg-pink-600"
                : squad.team.includes("Dabanggs")
                ? "bg-sky-600"
                : "bg-amber-600"
            }`}
          >
            {teamMeta.badge}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              {squad.team}
            </h1>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              {squad.captain.replace(/^Captain:\s*/i, "Captain: ")}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                10,000 pts remaining
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
                {squad.players.length} players signed
              </span>
              {isT2 && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                  DesiBoys Bazooka 4.0
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800">
          <Link
            href="/admin/scorecards/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Intake Scorecard</span>
          </Link>
        </div>
      </div>

      {/* SECTION 1: TEAM DNA™ INTELLIGENCE BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Identity Statement */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-sky-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isT2 ? "TEAM DNA™ PRE-TOURNAMENT INTELLIGENCE" : "TEAM DNA™ BEHAVIOURAL INTELLIGENCE"}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
              {isT2 && t2DNA ? `\"What kind of team is this?\"` : "More Than Scorecards."}
            </h2>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
              {isT2 && t2DNA ? t2DNA.statement : "Player insights. Team chemistry. Smarter captain decisions. Built by players, for players."}
            </p>

            {isT2 && t2DNA && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    Primary: {t2DNA.identity.primary}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-400/30">
                    Secondary: {t2DNA.identity.secondary}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono">
                    {t2DNA.identity.confidence}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {t2DNA.identity.explanation}
                </p>
              </div>
            )}

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <Users className="w-5 h-5 mx-auto text-sky-400 mb-1" />
                <span className="text-[11px] font-bold block text-slate-200">Player DNA</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <Activity className="w-5 h-5 mx-auto text-purple-400 mb-1" />
                <span className="text-[11px] font-bold block text-slate-200">Pair Chemistry</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <Shield className="w-5 h-5 mx-auto text-pink-400 mb-1" />
                <span className="text-[11px] font-bold block text-slate-200">Captain Intel</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <TrendingUp className="w-5 h-5 mx-auto text-amber-400 mb-1" />
                <span className="text-[11px] font-bold block text-slate-200">Better Cricket</span>
              </div>
            </div>
          </div>

          {/* Right Column: Calculated Team DNA Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-md p-6 text-slate-900 shadow-2xl border border-white/40">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">
                  TEAM DNA
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {isT2 ? "Pre-Tournament Model" : "Calculated"}
                </span>
              </div>

              {/* 4 Dimension Bars */}
              <div className="space-y-3.5 my-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">Batting</span>
                    <span className="font-mono font-black text-sky-600">{teamDNA.batting}</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full transition-all duration-1000"
                      style={{ width: `${teamDNA.batting}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">Bowling</span>
                    <span className="font-mono font-black text-purple-600">{teamDNA.bowling}</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                      style={{ width: `${teamDNA.bowling}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">Fielding</span>
                    <span className="font-mono font-black text-pink-600">{teamDNA.fielding}</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-500 rounded-full transition-all duration-1000"
                      style={{ width: `${teamDNA.fielding}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">Team Chemistry</span>
                    <span className="font-mono font-black text-amber-600">{teamDNA.teamChemistry}</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                      style={{ width: `${teamDNA.teamChemistry}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Sparkline curve */}
              <div className="pt-2">
                <svg viewBox="0 0 200 40" className="w-full h-10 overflow-visible">
                  <path
                    d="M 10 32 Q 50 18, 90 26 T 150 12 T 195 6"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="10" cy="32" r="3.5" fill="#0284c7" />
                  <circle cx="50" cy="22" r="3.5" fill="#0284c7" />
                  <circle cx="90" cy="26" r="3.5" fill="#0284c7" />
                  <circle cx="150" cy="12" r="3.5" fill="#0284c7" />
                  <circle cx="195" cy="6" r="4.5" fill="#0284c7" stroke="#fff" strokeWidth="2" />
                </svg>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Smarter insights. Stronger teams.</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">DesiSports V2</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TOURNAMENT 2 PRE-TOURNAMENT TEAM DNA SECTIONS (If T2) */}
      {isT2 && t2DNA ? (
        <div className="space-y-8">
          {/* 1. What Defines This Team */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                What Defines This Team
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {t2DNA.definingCharacteristics.map((char, i) => (
                <div
                  key={i}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-xs flex items-center justify-center">
                      #{i + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {char.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">Evidence: </span>
                    {char.evidence}
                  </p>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-indigo-700 dark:text-indigo-400 font-medium">
                    <span className="font-bold">What it means: </span>
                    {char.meaning}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Strengths & Weaknesses / Risks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <section className="p-6 rounded-3xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-emerald-950 dark:text-emerald-200">
                    Likely Strengths (Ranked)
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  Pre-Tournament
                </span>
              </div>
              <div className="space-y-3">
                {t2DNA.strengths.map((st, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/50 space-y-1.5 shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">0{i + 1}.</span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{st.strength}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Evidence: </span>{st.evidence}
                    </p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                      <span className="font-bold">Why it matters: </span>{st.why}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Weaknesses / Risks */}
            <section className="p-6 rounded-3xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/60 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-rose-950 dark:text-rose-200">
                    Weaknesses & Strategic Risks
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-bold text-rose-700 dark:text-rose-400">
                  Vulnerability Analysis
                </span>
              </div>
              <div className="space-y-3">
                {t2DNA.weaknesses.map((wk, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/50 space-y-1.5 shadow-xs">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{wk.weakness}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                        wk.type === "KNOWN WEAKNESS"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}>
                        {wk.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Evidence: </span>{wk.evidence}
                    </p>
                    <p className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">
                      <span className="font-bold">Strategic risk: </span>{wk.why}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* 3. Likely Batting Pairings */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Likely Batting Pairings (Indoor Cricket Combinations)
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500">
                4-Over Partnership Complementarity Model
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t2DNA.likelyPairings.map((pair, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 font-mono font-bold text-xs flex items-center justify-center">
                          P{idx + 1}
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                          {pair.role}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                        {pair.confidence}
                      </span>
                    </div>

                    <div className="mt-3">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {pair.pair}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Why it works: </span>
                        {pair.why}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        <span className="font-semibold">Evidence: </span>{pair.evidence}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-amber-700 dark:text-amber-400">
                    <span className="font-bold">Potential concern: </span>{pair.concern}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Pairing Options Grid */}
          <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Tactical Pairing Matrix
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Strategic Variants</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Best Known</span>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{t2DNA.pairingOptions.bestKnown.pair}</p>
                <p className="text-[11px] text-slate-500 leading-tight">{t2DNA.pairingOptions.bestKnown.reason}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">Best Balanced</span>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{t2DNA.pairingOptions.bestBalanced.pair}</p>
                <p className="text-[11px] text-slate-500 leading-tight">{t2DNA.pairingOptions.bestBalanced.reason}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">Highest Ceiling</span>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{t2DNA.pairingOptions.highestCeiling.pair}</p>
                <p className="text-[11px] text-slate-500 leading-tight">{t2DNA.pairingOptions.highestCeiling.reason}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Lowest Risk</span>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{t2DNA.pairingOptions.lowestRisk.pair}</p>
                <p className="text-[11px] text-slate-500 leading-tight">{t2DNA.pairingOptions.lowestRisk.reason}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Experimental</span>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{t2DNA.pairingOptions.experimental.pair}</p>
                <p className="text-[11px] text-slate-500 leading-tight">{t2DNA.pairingOptions.experimental.reason}</p>
              </div>
            </div>
          </section>

          {/* 5. Bazooka Tactical Deployment Card */}
          <section className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300 dark:border-amber-700/60 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-black uppercase tracking-wider text-amber-950 dark:text-amber-200">
                  Bazooka / Special Tactical Option Intelligence (Bazooka 4.0)
                </h3>
              </div>
              <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-amber-500 text-white shadow-xs">
                2x Runs & Heavy Penalty
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                  Primary Bazooka Candidate
                </span>
                <h4 className="text-base font-black text-amber-900 dark:text-amber-300">
                  {t2DNA.bazookaTactics.likelyPair}
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 inline-block">
                  Confidence: {t2DNA.bazookaTactics.confidence}
                </span>
              </div>

              <div className="md:col-span-8 space-y-2 text-xs">
                <p className="text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
                  <span className="font-bold">Tactical Rationale: </span>{t2DNA.bazookaTactics.why}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200/80 dark:border-amber-800/60">
                  <div>
                    <span className="font-bold text-amber-900 dark:text-amber-300 block">When to Deploy:</span>
                    <span className="text-slate-600 dark:text-slate-400 text-[11px]">{t2DNA.bazookaTactics.when}</span>
                  </div>
                  <div>
                    <span className="font-bold text-rose-700 dark:text-rose-400 block">Deduction Risk:</span>
                    <span className="text-slate-600 dark:text-slate-400 text-[11px]">{t2DNA.bazookaTactics.risk}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Bowling Identity & Team Dependency */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Bowling Identity & Combinations
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">Indoor Defense</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="font-bold text-indigo-600 block">Wicket-Taking Options</span>
                  <p className="text-slate-700 dark:text-slate-300 font-semibold">{t2DNA.bowlingIdentity.wicketTaking.join(", ")}</p>
                </div>
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                  <span className="font-bold text-emerald-600 block">Control Options</span>
                  <p className="text-slate-700 dark:text-slate-300 font-semibold">{t2DNA.bowlingIdentity.control.join(", ")}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-1 text-xs">
                <span className="font-bold text-indigo-900 dark:text-indigo-300">Likely Bowling Core: </span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{t2DNA.bowlingIdentity.core}</span>
                <p className="text-[11px] text-slate-500 pt-1">
                  <span className="font-bold text-indigo-800 dark:text-indigo-400">Key Bowling Question: </span>
                  {t2DNA.bowlingIdentity.keyQuestion}
                </p>
              </div>
            </section>

            <section className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                Team Dependency Level
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black px-3 py-1 rounded-full font-mono ${
                  t2DNA.teamDependency.level === "HIGHLY DEPENDENT"
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : t2DNA.teamDependency.level === "MODERATELY DEPENDENT"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}>
                  {t2DNA.teamDependency.level}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t2DNA.teamDependency.description}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                <span className="font-bold text-slate-700 dark:text-slate-300">Tactical Implication: </span>
                {t2DNA.teamDependency.implication}
              </div>
            </section>
          </div>

          {/* 7. Captain's Watchlist & What to Watch For (Measurable Hypotheses) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Captain\'s Watchlist
                </h3>
              </div>
              <ul className="space-y-2.5">
                {t2DNA.captainsWatchlist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <span className="h-5 w-5 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-600 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    What To Watch For (Hypotheses)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Match 1-2 Tests</span>
              </div>
              <div className="space-y-3">
                {t2DNA.whatToWatchFor.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 space-y-1.5 text-xs">
                    <p className="font-bold text-slate-900 dark:text-white">
                      Hypothesis: {item.hypothesis}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="text-emerald-700 dark:text-emerald-400">
                        <span className="font-bold">Confirm if: </span>{item.confirm}
                      </div>
                      <div className="text-rose-700 dark:text-rose-400">
                        <span className="font-bold">Disprove if: </span>{item.disprove}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* 8. Team DNA Evolution Notice & Final Summary */}
          <section className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Team DNA Evolution Lifecycle
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t2DNA.evolutionNotice}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Team DNA in One Line: </span>
                <span className="text-slate-600 dark:text-slate-300 italic">{t2DNA.finalSummary.oneLine}</span>
              </div>
            </div>
            <div className="text-xs bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-purple-700 dark:text-purple-300 font-medium">
              <span className="font-bold">Captain\'s Strategic Question: </span>
              {t2DNA.finalSummary.captainsQuestion}
            </div>
          </section>
        </div>
      ) : (
        /* SECTION 2 FOR TOURNAMENT 1 (Historical Playoff Dynamics) */
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Combination Intelligence & Tournament Pair Dynamics
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>Prioritizing Recent Match: {tactical.recentMatchTitle}</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-950 dark:text-amber-200">
                  Tournament Pairing Evolution: {tactical.reshuffleInsight.title}
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700 font-mono">
                {tactical.recentMatchResult}
              </span>
            </div>
            <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed font-medium">
              {tactical.reshuffleInsight.description}
            </p>
            <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between text-[11px] text-amber-800 dark:text-amber-400 font-bold">
              <span>Tactical Impact: {tactical.reshuffleInsight.impact}</span>
              <span className="font-mono text-slate-500">Spawtz Net Run Differential Model</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tactical.pairs.map((combo) => (
              <div
                key={combo.skin}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-mono font-bold text-xs flex items-center justify-center">
                        S{combo.skin}
                      </span>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        Skin {combo.skin}: {combo.objective}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-600">
                      {combo.netRunsExpected}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                      <span>{combo.pair[0]}</span>
                      <span className="text-slate-400 font-normal">&</span>
                      <span>{combo.pair[1]}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {combo.reasoning}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                  <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{combo.synergyUplift}</span>
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                    {combo.historicalStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: REGISTERED SQUAD ROSTER & PLAYER ARCHETYPES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Registered Squad Roster & Archetypes
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {squad.players.length} Registered Players
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {squad.players.map((player: any, idx: number) => {
            const archetype = archetypes[idx % archetypes.length];
            return (
              <Link
                key={player.id}
                href={`/player/${player.id}`}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-purple-300 hover:shadow-md transition group block"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                      {player.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition text-sm">
                        {player.name}
                      </h3>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {player.isCaptain ? "Team Captain" : "Squad Member"}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${archetype.color}`}
                  >
                    {archetype.label}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
                  <span>View Player Profile & Match History</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
