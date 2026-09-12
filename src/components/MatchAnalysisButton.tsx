"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { MATCH_ANALYSES } from "@/lib/match-analyses";
import MatchAnalysisModal from "@/components/MatchAnalysisModal";

interface Props {
  matchId: string | number;
  className?: string;
  variant?: "primary" | "outline" | "subtle";
  label?: string;
}

export default function MatchAnalysisButton({
  matchId,
  className = "",
  variant = "subtle",
  label = "Match Analysis",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const analysis = MATCH_ANALYSES[String(matchId)];

  if (!analysis) return null;

  const baseStyle =
    "inline-flex items-center gap-1.5 text-xs font-bold transition rounded-xl px-3 py-1.5 cursor-pointer";
  const variantStyles = {
    primary:
      "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-700/20",
    outline:
      "border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40",
    subtle:
      "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>{label}</span>
      </button>

      {isOpen && (
        <MatchAnalysisModal
          analysis={analysis}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
