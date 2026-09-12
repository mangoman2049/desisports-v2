"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Trophy,
  Users,
  Shield,
  UploadCloud,
  Calendar,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/tournaments", label: "Tournaments", icon: Trophy },
    { href: "/matches", label: "Matches", icon: Calendar },
    { href: "/players", label: "Players", icon: Users },
    {
      href: "/captain",
      label: "Captain Intel",
      icon: Shield,
      badge: "32 Insights",
      badgeColor: "bg-purple-50 text-purple-700 border border-purple-200 font-semibold",
    },
    {
      href: "/admin",
      label: "Scorecard Intake",
      icon: UploadCloud,
      badge: "Maker-Checker",
      badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Official Brand Logo */}
          <div className="flex items-center gap-4">
            <Link href="/tournaments" className="flex items-center gap-3 group">
              <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-xs border border-slate-200/60 bg-black flex items-center justify-center p-0.5">
                <img
                  src="/images/logo.png"
                  alt="DesiSports"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-slate-900 leading-tight">
                    DESISPORTS
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                    V2
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-500">
                  Indoor Cricket Intelligence
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                  {link.badge && !isActive && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${link.badgeColor}`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Quick Switcher */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/player/35"
              className="flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full border border-slate-200/80 bg-slate-50/80 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all"
            >
              <div className="h-7 w-7 rounded-full bg-emerald-600 text-xs font-bold text-white flex items-center justify-center shadow-xs">
                MP
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  Manish Pandey
                </span>
                <span className="text-[10px] text-slate-500 leading-tight">
                  Captain / Admin
                </span>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-3 space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${link.badgeColor}`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
