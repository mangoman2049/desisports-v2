import Link from "next/link";
import { notFound } from "next/navigation";
import tournamentData from "../../../../../../prisma/tournament_1_data.json";
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
} from "lucide-react";
import ShareButton from "@/components/ShareButton";

interface PageProps {
  params: {
    tournamentId: string;
    teamId: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const teamIdNum = parseInt(params.teamId, 10);
  const squad = tournamentData.squads.find((s) => s.id === teamIdNum);
  const teamName = squad ? squad.team : `Team ${params.teamId}`;

  return {
    title: `${teamName} — Team DNA™ & Squad | DesiSports V2`,
    description: `Registered squad, player archetypes, pair combination intelligence, and Team DNA™ scores for ${teamName}.`,
    openGraph: {
      title: `${teamName} — Team DNA™ & Intelligence`,
      description: `Explore ${teamName}'s Team DNA (Batting 78, Bowling 72, Fielding 81, Chemistry 76) on DesiSports V2.`,
      images: ["/images/team-dna-share.png"],
    },
  };
}

export default function DedicatedTeamPage({ params }: PageProps) {
  const tournamentId = params.tournamentId;
  const teamIdNum = parseInt(params.teamId, 10);

  const squad = tournamentData.squads.find((s) => s.id === teamIdNum);
  if (!squad) notFound();

  const teamMeta = tournamentData.teams.find((t) => t.name === squad.team) || {
    name: squad.team,
    captain: squad.captain,
    badge: squad.team.charAt(0),
    color: "purple",
  };

  // Team DNA dimensions (from PRD & official Team DNA graphic)
  const teamDNA = {
    batting: 78,
    bowling: 72,
    fielding: 81,
    teamChemistry: 76,
    dependencyScore: 41, // Top 2 combinations generate 41% of wicket impact
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

  // Pair Combination Intelligence (PRD Section 8 & 18)
  const pairCombinations = [
    {
      skin: 1,
      pair: [squad.players[0]?.name || "Batter 1", squad.players[1]?.name || "Batter 2"],
      objective: "Powerplay Acceleration",
      netRunsExpected: "+28.4 runs",
      synergyUplift: "+6.8 vs baselines",
      reasoning: "Aggressive boundary hunter paired with high-rotation accumulator to minimize dot-ball pressure.",
    },
    {
      skin: 2,
      pair: [squad.players[2]?.name || "Batter 3", squad.players[3]?.name || "Batter 4"],
      objective: "Skin Consolidation & Rebuild",
      netRunsExpected: "+22.1 runs",
      synergyUplift: "+4.2 vs baselines",
      reasoning: "Dual anchors with exceptionally low dismissal rates (-5 penalty mitigation).",
    },
    {
      skin: 3,
      pair: [squad.players[4]?.name || "Batter 5", squad.players[5]?.name || "Batter 6"],
      objective: "Middle-Overs Leverage",
      netRunsExpected: "+25.6 runs",
      synergyUplift: "+5.1 vs baselines",
      reasoning: "Exploits opposition second-string bowling spells with rapid twos and boundary strike.",
    },
    {
      skin: 4,
      pair: [squad.players[6]?.name || "Batter 7", squad.players[7]?.name || "Batter 8"],
      objective: "Death Overs Climax",
      netRunsExpected: "+31.0 runs",
      synergyUplift: "+7.9 vs baselines",
      reasoning: "High-risk high-reward boundary hitters maximizing net run difference in final skin.",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Navigation Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href={`/tournaments/${tournamentId}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition" />
          <span>Back to Desi Boys Tournament May 2026</span>
        </Link>
        <div className="flex items-center gap-3">
          <ShareButton />
        </div>
      </div>

      {/* Team Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black text-white text-3xl shadow-sm ${
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
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              {squad.team}
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-0.5">
              {squad.captain}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                10,000 pts remaining
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                {squad.players.length} players signed
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
          <Link
            href="/admin/scorecards/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Intake Scorecard</span>
          </Link>
        </div>
      </div>

      {/* SECTION 1: TEAM DNA™ INTELLIGENCE BANNER (Inspired by media_1789208922060.png) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Brand & Tagline */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-sky-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TEAM DNA™ BEHAVIOURAL INTELLIGENCE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
              More Than Scorecards.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Player insights. Team chemistry. Smarter captain decisions. Built by players, for players.
            </p>

            {/* 4 Pillars Grid matching graphic */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <Users className="w-5 h-5 mx-auto text-sky-400 mb-1" />
                <span className="text-[11px] font-bold block text-slate-200">Player DNA</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                <Activity className="w-5 h-5 mx-auto text-purple-400 mb-1" />
                <span className="text-[11px] font-bold block text-slate-200">Team Insights</span>
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

          {/* Right Column: Exact Replica Card from media_1789208922060.png */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-md p-6 text-slate-900 shadow-2xl border border-white/40">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">
                  TEAM DNA
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Calculated
                </span>
              </div>

              {/* 4 Dimension Bars */}
              <div className="space-y-3.5 my-4">
                {/* Batting */}
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

                {/* Bowling */}
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

                {/* Fielding */}
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

                {/* Team Chemistry */}
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

              {/* Sparkline curve matching graphic */}
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
                <span className="text-[11px] font-mono text-slate-400">PRD v1.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: COMBINATION INTELLIGENCE & PAIR RECOMMENDATIONS (PRD Section 8) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Combination Intelligence & Skin Pairings
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            4 Skins • 16 Overs Allocation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pairCombinations.map((combo) => (
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
                <span className="text-slate-400 text-[11px]">Recommended Pair</span>
              </div>
            </div>
          ))}
        </div>
      </section>

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
          {squad.players.map((player, idx) => {
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
                        Squad Member
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
