import Link from "next/link";
import { Trophy, Calendar, Users, ArrowRight, Shield, Sparkles } from "lucide-react";

export const metadata = {
  title: "Tournaments",
  description:
    "Explore official indoor cricket tournaments, squad rosters, and regular practice matches on DesiSports V2.",
};

export default function TournamentsDirectoryPage() {
  const tournaments = [
    {
      id: "0",
      title: "Desisports Regular Practice",
      subtitle: "Weekly net sessions & friendly indoor cricket matches",
      status: "Active Practice",
      statusColor: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30",
      stats: [
        { label: "Format", value: "Practice" },
        { label: "Matches", value: "1+" },
        { label: "Players", value: "64+" },
      ],
      footerText: "Non-tournament practice games & friendly matches",
      href: "/tournaments/0",
      isClickable: true,
      highlight: true,
    },
    {
      id: "bazooka",
      title: "DesiBoys Bazooka 4.0",
      subtitle: "Upcoming premier championship",
      status: "Yet to Start",
      statusColor: "bg-amber-500/10 text-amber-600 border border-amber-500/30",
      stats: [
        { label: "Teams", value: "4" },
        { label: "Matches", value: "0" },
        { label: "Players", value: "61" },
      ],
      footerText: "No fixtures scheduled",
      href: "#",
      isClickable: false,
      highlight: false,
    },
    {
      id: "1",
      title: "Desi Boys Tournament May 2026",
      subtitle: "Official 16-over Spawtz championship",
      status: "Registration Closed",
      statusColor: "bg-sky-500/10 text-sky-600 border border-sky-500/30",
      stats: [
        { label: "Teams", value: "4" },
        { label: "Matches", value: "6" },
        { label: "Players", value: "64" },
      ],
      footerText: "📅 11 May 2026 → 18 May 2026",
      href: "/tournaments/1",
      isClickable: true,
      highlight: true,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header section matching media_1789209157520.png */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Tournaments
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Browse active leagues, upcoming competitions, and regular practice matches.
        </p>
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((t) => {
          const CardContent = (
            <div
              className={`h-full rounded-3xl border transition-all duration-200 flex flex-col justify-between p-6 sm:p-7 shadow-xs ${
                t.isClickable
                  ? "bg-white border-slate-200/90 hover:border-slate-400 hover:shadow-md cursor-pointer group"
                  : "bg-slate-50/70 border-slate-200/60 opacity-85 cursor-default"
              }`}
            >
              <div className="space-y-4">
                {/* Title & Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h2
                      className={`text-xl font-black tracking-tight ${
                        t.isClickable
                          ? "text-slate-900 group-hover:text-emerald-700 transition"
                          : "text-slate-700"
                      }`}
                    >
                      {t.title}
                    </h2>
                    <p className="text-xs text-slate-500 leading-snug">
                      {t.subtitle}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-[11px] font-bold px-3 py-1 rounded-full ${t.statusColor}`}
                  >
                    {t.status}
                  </span>
                </div>

                {/* 3-Column Stats Strip matching media_1789209157520.png */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 rounded-2xl bg-slate-50/80 border border-slate-100 py-3.5 my-2">
                  {t.stats.map((stat, sIdx) => (
                    <div key={sIdx} className="text-center px-2">
                      <div className="text-xl font-black text-slate-900 font-mono leading-tight">
                        {stat.value}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer text & Action arrow */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">{t.footerText}</span>
                {t.isClickable && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 group-hover:translate-x-1 transition font-bold">
                    <span>View</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            </div>
          );

          if (t.isClickable) {
            return (
              <Link key={t.id} href={t.href} className="block focus:outline-none">
                {CardContent}
              </Link>
            );
          }

          return <div key={t.id}>{CardContent}</div>;
        })}
      </div>
    </div>
  );
}
