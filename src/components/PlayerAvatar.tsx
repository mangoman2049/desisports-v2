"use client";

import React from "react";

interface Props {
  name: string;
  role?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showRoleBadge?: boolean;
}

const COLOR_PALETTES = [
  { bg: "from-emerald-500 to-teal-700", text: "text-white", border: "border-emerald-300" },
  { bg: "from-blue-600 to-indigo-700", text: "text-white", border: "border-blue-300" },
  { bg: "from-purple-600 to-violet-800", text: "text-white", border: "border-purple-300" },
  { bg: "from-amber-500 to-orange-600", text: "text-white", border: "border-amber-300" },
  { bg: "from-rose-500 to-pink-700", text: "text-white", border: "border-rose-300" },
  { bg: "from-cyan-600 to-blue-700", text: "text-white", border: "border-cyan-300" },
  { bg: "from-slate-700 to-slate-900", text: "text-white", border: "border-slate-400" },
];

function getInitials(name: string): string {
  if (!name) return "CR";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function PlayerAvatar({
  name,
  role,
  size = "md",
  className = "",
  showRoleBadge = false,
}: Props) {
  const initials = getInitials(name);
  const paletteIndex = hashString(name) % COLOR_PALETTES.length;
  const palette = COLOR_PALETTES[paletteIndex];

  const sizeClasses = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
  }[size];

  const iconSizes = {
    xs: "w-2.5 h-2.5",
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
    xl: "w-5 h-5",
  }[size];

  // Role badge color & label
  const isBowler = role?.toLowerCase().includes("bowl");
  const isBatter = role?.toLowerCase().includes("bat");
  const isAllRounder = isBowler && isBatter || role?.toLowerCase().includes("all");

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`${sizeClasses} rounded-2xl bg-gradient-to-br ${palette.bg} ${palette.text} font-black font-mono flex items-center justify-center shadow-xs border border-white/20 select-none overflow-hidden relative`}
        title={name}
      >
        {/* Subtle Cricket Ball Seam / Crossed Bats Vector Overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-15 pointer-events-none stroke-current"
          viewBox="0 0 40 40"
          fill="none"
        >
          <circle cx="20" cy="20" r="18" strokeWidth="1.5" />
          <path d="M10 8 C18 16, 18 24, 10 32" strokeWidth="1.5" strokeDasharray="1.5 1.5" />
          <path d="M30 8 C22 16, 22 24, 30 32" strokeWidth="1.5" strokeDasharray="1.5 1.5" />
        </svg>

        <span className="relative z-10 tracking-wider drop-shadow-xs">{initials}</span>
      </div>

      {showRoleBadge && (
        <span
          className={`absolute -bottom-1 -right-1 p-0.5 rounded-full border border-white dark:border-slate-900 shadow-xs ${
            isAllRounder
              ? "bg-purple-600 text-white"
              : isBowler
              ? "bg-emerald-600 text-white"
              : "bg-amber-500 text-white"
          }`}
          title={role || "Cricket Player"}
        >
          {/* Cricket Icon Badge */}
          <svg className={iconSizes} viewBox="0 0 24 24" fill="currentColor">
            {isBowler ? (
              // Ball
              <circle cx="12" cy="12" r="9" />
            ) : isBatter ? (
              // Bat
              <path d="M4.5 19.5L19.5 4.5l-2-2L2.5 17.5l2 2z" />
            ) : (
              // All-rounder trophy/star
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            )}
          </svg>
        </span>
      )}
    </div>
  );
}
