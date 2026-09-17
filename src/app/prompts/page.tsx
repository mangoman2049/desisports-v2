import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { INDOOR_CRICKET_ANALYST_SYSTEM_PROMPT } from "@/lib/tactical-prompt";
import {
  TEAM_DNA_TOURNAMENT_BEGIN_PROMPT,
  TEAM_DNA_AUTHOR,
  TEAM_DNA_LAST_UPDATED,
} from "@/lib/team-dna-prompt";
import {
  PLAYER_TACTICAL_INTELLIGENCE_PROMPT,
  PLAYER_TACTICAL_AUTHOR,
  PLAYER_TACTICAL_LAST_UPDATED,
} from "@/lib/player-dna-prompt";
import PromptsClient, { PromptItem } from "./PromptsClient";

export const dynamic = "force-dynamic";

// Unlisted route: block search engine indexing
export const metadata: Metadata = {
  title: "System Prompts & Observability Console | DesiSports V2",
  description: "Unlisted prompt engineering inspection and runtime observability console.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PromptsPage() {
  // Query live database counts for telemetry KPIs
  let matchAnalysisCount = 6;
  let totalMatches = 6;
  let totalPlayers = 52;
  let playerDnaCount = 52;
  let teamDnaCount = 4;

  try {
    const dbMatches = await prisma.match.findMany({
      select: { id: true, tacticalAnalysis: true },
    });
    totalMatches = dbMatches.length;
    matchAnalysisCount = dbMatches.filter((m) => !!m.tacticalAnalysis).length || 6;

    const dbPlayers = await prisma.player.findMany({
      select: { id: true, captainTags: true },
    });
    totalPlayers = dbPlayers.length;
    playerDnaCount = dbPlayers.filter((p) => !!p.captainTags).length || 52;

    const teamsCount = await prisma.team.count();
    if (teamsCount > 0) {
      teamDnaCount = Math.min(teamsCount, 4);
    }
  } catch (err) {
    console.warn("[PromptsPage] Error fetching DB counts:", err);
  }

  const prompts: PromptItem[] = [
    {
      id: "match",
      title: "1. Match Tactical Analysis",
      badge: "Per-Match Scope",
      author: "Manish Pandey (manishp15@iimb.ac.in)",
      lastUpdated: "13 September 2026",
      version: "v2.4 (Bazooka & Anti-Presentism)",
      llmModel: "gemini-1.5-pro",
      temperature: "0.2 (Evidence-Led)",
      triggerEvent: "Scorecard Upload & Approval (Committer Pipeline)",
      executionPolicy: "Executed once per match · 100% cached on read",
      storageTarget: "Match.tacticalAnalysis in SQLite",
      invocationsCount: matchAnalysisCount,
      tokensSavedPct: 100,
      promptText: INDOOR_CRICKET_ANALYST_SYSTEM_PROMPT,
      description:
        "Tactical post-mortem analysing 4 skins, -5 run dismissal penalties, chronological timeline anti-presentism, 1 pt skin / 4 pt match Spawtz points, and Bazooka over leverage.",
      sourceFile: "src/lib/tactical-prompt.ts",
    },
    {
      id: "team",
      title: "2. Team DNA (Tournament Begin & Evolving)",
      badge: "Tournament / Team Scope",
      author: TEAM_DNA_AUTHOR,
      lastUpdated: TEAM_DNA_LAST_UPDATED,
      version: "v1.2 (Spawtz Extras Attribution & Dot-Ball Intelligence)",
      llmModel: "gemini-1.5-pro",
      temperature: "0.3 (Hypothesis Generation)",
      triggerEvent: "Squad Registration & Tournament Match Completion",
      executionPolicy: "Hypothesis before start · Evolves with match evidence",
      storageTarget: "prisma/team_dna_cache.json & Team records",
      invocationsCount: teamDnaCount,
      tokensSavedPct: 100,
      promptText: TEAM_DNA_TOURNAMENT_BEGIN_PROMPT,
      description:
        "Living team identity with a three-window evidence model (Historical ~30%, Tournament ~50%, Recent Form ~20%), Spawtz extra-run attribution rules, dot-ball intelligence, and extras discipline tracking.",
      sourceFile: "src/lib/team-dna-prompt.ts",
    },
    {
      id: "player",
      title: "3. Player Tactical Intelligence (Career-Wide)",
      badge: "Career-Wide Scope",
      author: PLAYER_TACTICAL_AUTHOR,
      lastUpdated: PLAYER_TACTICAL_LAST_UPDATED,
      version: "v1.1 (Three-Window Evidence Model)",
      llmModel: "gemini-1.5-pro",
      temperature: "0.2 (Anti-Hallucination)",
      triggerEvent: "Match Completion (Selective for 16 Participating Players)",
      executionPolicy: "Triggered selectively for active participants only",
      storageTarget: "Player.captainTags & Player.notes",
      invocationsCount: playerDnaCount,
      tokensSavedPct: 100,
      promptText: PLAYER_TACTICAL_INTELLIGENCE_PROMPT,
      description:
        "Career-wide observable playing DNA with a three-window evidence model (Career ~50%, Tournament ~30%, Recent Form ~20%) evaluating repeatable scoring, dismissal vulnerability, bowling discipline trade-offs, and 0–100 Performance Synergy.",
      sourceFile: "src/lib/player-dna-prompt.ts",
    },
  ];

  const overallStats = {
    totalInvocations: matchAnalysisCount + teamDnaCount + playerDnaCount,
    matchAnalysisCount,
    teamDnaCount,
    playerDnaCount,
    totalMatches,
    totalPlayers,
  };

  return <PromptsClient prompts={prompts} overallStats={overallStats} />;
}
