"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Trophy,
  Users,
  Shield,
  UploadCloud,
  Activity,
  Calendar,
  Menu,
  X,
} from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const navLinks = [
    { href: "/tournaments", label: "Tournaments", icon: Trophy },
    { href: "/matches", label: "Matches", icon: Calendar },
    { href: "/players", label: "Players", icon: Users },
    {
      href: "/captain",
      label: "Captain Insights",
      icon: Shield,
      badge: "32 Insights",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    },
    {
      href: "/admin",
      label: "Admin & Intake",
      icon: UploadCloud,
      badge: "Maker-Checker",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
    },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-15 items-center justify-between py-2.5">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link href="/player/35" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white font-black text-lg shadow-sm group-hover:bg-emerald-700 transition">
                D
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                  DesiSports <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">V2</span>
                </span>
                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                  Indoor Cricket Intelligence
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${link.badgeColor}`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User & Theme Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link
              href="/player/35"
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 bg-gray-50 dark:bg-gray-800/60 transition"
            >
              <div className="h-6 w-6 rounded-full bg-emerald-600 text-[11px] font-bold text-white flex items-center justify-center">
                MP
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-gray-900 dark:text-white leading-none">
                  Manish P
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                  Captain / Admin
                </span>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${link.badgeColor}`}>
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
