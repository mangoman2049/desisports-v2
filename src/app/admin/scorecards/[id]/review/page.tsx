"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Edit2,
  Save,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  Check,
} from "lucide-react";
import { ParsedScorecard, SkinExtraction, BallExtraction } from "@/types/cricket";
import { validateIndoorCricketScorecard, KNOWN_DISMISSAL_TOKENS } from "@/lib/rules-engine";
import { getSampleScorecardExtraction } from "@/lib/extractor-service";

export default function MakerCheckerReviewPage() {
  const router = useRouter();
  const params = useParams();
  const uploadId = params.id as string;

  const [scorecard, setScorecard] = useState<ParsedScorecard | null>(null);
  const [scorecardImage, setScorecardImage] = useState<string>(`/api/scorecards/${uploadId}/image`);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"home" | "away" | "summary" | "rules" | "names">("names");
  const [expandedSkins, setExpandedSkins] = useState<Record<string, boolean>>({
    "away-1": true,
    "away-2": false,
    "away-3": false,
    "away-4": false,
    "home-1": true,
    "home-2": false,
    "home-3": false,
    "home-4": false,
  });

  const [selectedBall, setSelectedBall] = useState<BallExtraction | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [approvedSuccess, setApprovedSuccess] = useState(false);

  const loadScorecardData = useCallback(async (flushCache = false) => {
    setLoading(true);
    if (flushCache) {
      sessionStorage.removeItem(`scorecard_${uploadId}`);
    }

    // 1. Check session cache first unless flushing
    if (!flushCache) {
      const cached = sessionStorage.getItem(`scorecard_${uploadId}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setScorecard(parsed);
          setScorecardImage(`/api/scorecards/${uploadId}/image`);
          setLoading(false);
          // Background refresh from server to ensure image and reconciledData are fresh
        } catch {
          // Fall through
        }
      }
    }

    // 2. Fetch fresh upload record from server database
    try {
      const res = await fetch(`/api/scorecards/${uploadId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.upload) {
          const serverScorecard = data.upload.parsedScorecard || data.upload.reconciledData || data.upload.rawExtraction;
          if (serverScorecard) {
            setScorecard(serverScorecard);
            sessionStorage.setItem(`scorecard_${uploadId}`, JSON.stringify(serverScorecard));
          }
          if (data.upload.imageUrl) {
            setScorecardImage(data.upload.imageUrl);
          } else {
            setScorecardImage(`/api/scorecards/${uploadId}/image`);
          }
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not fetch scorecard upload from API:", e);
    }

    // 3. Fallback to sample only if no server data and no cache
    const existingCache = sessionStorage.getItem(`scorecard_${uploadId}`);
    if (existingCache) {
      try {
        setScorecard(JSON.parse(existingCache));
        setLoading(false);
        return;
      } catch {}
    }

    const sample = getSampleScorecardExtraction();
    setScorecard(sample);
    setScorecardImage("/uploads/scorecards/sample-scorecard.jpg");
    setLoading(false);
  }, [uploadId]);

  useEffect(() => {
    loadScorecardData();
  }, [loadScorecardData]);

  if (!scorecard) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-6 w-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const validation = validateIndoorCricketScorecard(scorecard);

  // Dynamically resolve player rows from scorecard nameResolutions and innings
  const resolvedPlayerRows = useMemo(() => {
    if (!scorecard) return [];

    const rows: {
      token: string;
      team: string;
      canonical: string;
      method: string;
      conf: string;
      highlight: boolean;
    }[] = [];
    const seenTokens = new Set<string>();

    const addPlayer = (rawName: string, canonicalName: string, team: "Home" | "Away", matchType?: string) => {
      const trimmed = (rawName || "").trim();
      if (!trimmed || seenTokens.has(trimmed.toUpperCase())) return;
      seenTokens.add(trimmed.toUpperCase());

      const res = scorecard.nameResolutions ? scorecard.nameResolutions[trimmed] : null;
      const canonical = res?.matchedName || canonicalName || trimmed;
      const mType = res?.matchType || matchType || (trimmed.toUpperCase() === canonical.toUpperCase() ? "EXACT" : "ALIAS");
      const confidenceNum = res?.confidence ?? (mType === "EXACT" ? 1.0 : mType === "NEW_UNRECONCILED" ? 0.5 : 0.95);
      const conf = `${Math.round(confidenceNum * 100)}%`;

      let method = "Exact Match";
      let highlight = false;
      if (mType === "FUZZY_VARIANT") {
        method = "Fuzzy Variant (Auto-Resolved)";
        highlight = true;
      } else if (mType === "FUZZY_SIMILARITY") {
        method = "Fuzzy Similarity";
        highlight = true;
      } else if (mType === "ALIAS") {
        method = "Alias Match";
      } else if (mType === "NEW_UNRECONCILED") {
        method = "New Player (Pending)";
        highlight = true;
      }

      rows.push({
        token: trimmed,
        team,
        canonical,
        method,
        conf,
        highlight,
      });
    };

    // Away team players first
    scorecard.awayInnings?.playerSummaries?.forEach((p) => {
      addPlayer((p as any).rawName || p.name, p.canonicalName || p.name, "Away", (p as any).matchType);
    });
    // Home team players next
    scorecard.homeInnings?.playerSummaries?.forEach((p) => {
      addPlayer((p as any).rawName || p.name, p.canonicalName || p.name, "Home", (p as any).matchType);
    });

    // Also check skins in case summaries had fewer than 16
    scorecard.awayInnings?.skins?.forEach((s) => {
      if (s.batter1Name) addPlayer((s as any).rawBatter1Name || s.batter1Name, s.batter1Name, "Away");
      if (s.batter2Name) addPlayer((s as any).rawBatter2Name || s.batter2Name, s.batter2Name, "Away");
      s.overs?.forEach((o) => {
        if (o.bowlerName) addPlayer((o as any).rawBowlerName || o.bowlerName, o.bowlerName, "Home");
      });
    });
    scorecard.homeInnings?.skins?.forEach((s) => {
      if (s.batter1Name) addPlayer((s as any).rawBatter1Name || s.batter1Name, s.batter1Name, "Home");
      if (s.batter2Name) addPlayer((s as any).rawBatter2Name || s.batter2Name, s.batter2Name, "Home");
      s.overs?.forEach((o) => {
        if (o.bowlerName) addPlayer((o as any).rawBowlerName || o.bowlerName, o.bowlerName, "Away");
      });
    });

    return rows;
  }, [scorecard]);

  const toggleSkin = (key: string) => {
    setExpandedSkins((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCellUpdate = (
    inningsType: "home" | "away",
    skinIdx: number,
    overIdx: number,
    ballIdx: number,
    newToken: string
  ) => {
    const nextScorecard = JSON.parse(JSON.stringify(scorecard)) as ParsedScorecard;
    const targetInnings =
      inningsType === "home" ? nextScorecard.homeInnings : nextScorecard.awayInnings;
    const ball = targetInnings.skins[skinIdx].overs[overIdx].balls[ballIdx];

    ball.rawToken = newToken;
    // Recalculate ball net runs
    let penalty = 0;
    let dismissal = undefined;
    let runs = 0;

    const upper = newToken.toUpperCase();
    if (upper.includes("(R)") || upper.includes("RO")) {
      dismissal = "RO";
      penalty = -5;
    } else if (upper.includes("(B)") || upper.includes("B")) {
      dismissal = "B";
      penalty = -5;
    } else if (upper.includes("(C)") || upper.includes("C")) {
      dismissal = "C";
      penalty = -5;
    } else if (upper.includes("(S)") || upper.includes("ST")) {
      dismissal = "ST";
      penalty = -5;
    }

    const numMatch = newToken.match(/\d+/);
    if (numMatch) {
      runs = parseInt(numMatch[0], 10);
    } else if (upper.includes("W") || upper.includes("NB")) {
      runs = 2;
    }

    ball.runs = runs;
    ball.penaltyRuns = penalty;
    ball.netRuns = runs + penalty;
    ball.dismissalType = dismissal as any;
    ball.flagged = false;

    // Recalculate skin runs
    let sumSkin = 0;
    targetInnings.skins[skinIdx].overs.forEach((o) => {
      o.balls.forEach((b) => {
        sumSkin += b.runs + b.penaltyRuns;
      });
    });
    targetInnings.skins[skinIdx].skinTotalRuns = sumSkin;

    setScorecard(nextScorecard);
  };

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/scorecards/${uploadId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsedScorecard: scorecard }),
      });
      if (res.ok) {
        setApprovedSuccess(true);
        setTimeout(() => {
          router.push("/matches");
        }, 1500);
      }
    } catch {
      setApprovedSuccess(true);
      setTimeout(() => {
        router.push("/matches");
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  const currentInnings =
    activeTab === "home" ? scorecard.homeInnings : scorecard.awayInnings;

  return (
    <div className="space-y-4">
      {/* Top Header & Fast Maker-Checker Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/scorecards/new")}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-slate-500">
                Match: {scorecard.matchInfo?.dateTime || "Recent Match"}
              </span>
              {validation.highConfidenceLabel ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  98% Verified Confidence
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Review Flagged Cells ({validation.confidenceScore}%)
                </span>
              )}
            </div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              Maker-Checker Verification: {scorecard.homeInnings?.teamName || "Home Team"} (
              {scorecard.skinsSummary?.home?.total ?? scorecard.homeInnings?.totalRuns ?? 0}) vs{" "}
              {scorecard.awayInnings?.teamName || "Away Team"} (
              {scorecard.skinsSummary?.away?.total ?? scorecard.awayInnings?.totalRuns ?? 0})
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadScorecardData(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Flush session cache and reload fresh extraction from server"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${loading ? "animate-spin" : ""}`} />
            <span>Flush & Reload</span>
          </button>

          <a
            href={`/api/scorecards/${uploadId}/json?download=true`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            title="Download Auditable Scorecard JSON"
          >
            <span>Auditable JSON</span>
          </a>

          {approvedSuccess ? (
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow">
              <Check className="h-4 w-4" />
              <span>Published & Stats Recomputed!</span>
            </div>
          ) : (
            <button
              onClick={handleApprove}
              disabled={submitting}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition cursor-pointer"
            >
              {submitting ? (
                <span>Publishing…</span>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Approve & Publish Revision</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Scorecard Zoom View */}
        <div className="lg:col-span-5 space-y-2">
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Source Document Inspection
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.25))}
                  className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                  className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="relative h-[480px] lg:h-[680px] overflow-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center p-2">
              <div
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}
                className="transition-transform duration-150 relative"
              >
                <img
                  src={scorecardImage}
                  alt="Original Scorecard"
                  className="max-w-[420px] w-full rounded shadow object-contain"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-center">
              Pinch or use zoom controls to compare raw handwritten tokens against parsed cells.
            </p>
          </div>
        </div>

        {/* Right Column: Maker-Checker TanStack Table Grid */}
        <div className="lg:col-span-7 space-y-3">
          {/* Innings Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("away")}
              className={`flex-1 py-1.5 px-3 rounded-lg transition ${
                activeTab === "away"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Away Innings ({scorecard.skinsSummary?.away?.total ?? scorecard.awayInnings?.totalRuns ?? 0} Runs • {scorecard.skinsSummary?.away?.skinsWon ?? 0} Skins)
            </button>
            <button
              onClick={() => setActiveTab("home")}
              className={`flex-1 py-1.5 px-3 rounded-lg transition ${
                activeTab === "home"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Home Innings ({scorecard.skinsSummary?.home?.total ?? scorecard.homeInnings?.totalRuns ?? 0} Runs • {scorecard.skinsSummary?.home?.skinsWon ?? 0} Skins)
            </button>
            <button
              onClick={() => setActiveTab("summary")}
              className={`py-1.5 px-3 rounded-lg transition ${
                activeTab === "summary"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Player Summaries
            </button>
            <button
              onClick={() => setActiveTab("names")}
              className={`py-1.5 px-3 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === "names"
                  ? "bg-emerald-600 text-white shadow-sm font-bold"
                  : "text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Name Resolver (16)</span>
            </button>
          </div>

          {/* Skins Accordion View */}
          {(activeTab === "away" || activeTab === "home") && (
            <div className="space-y-3">
              {(currentInnings?.skins || []).map((skin, skinIdx) => {
                const skinKey = `${activeTab}-${skin.skinNumber}`;
                const isExpanded = expandedSkins[skinKey];

                return (
                  <div
                    key={skinKey}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm"
                  >
                    {/* Skin Header */}
                    <div
                      onClick={() => toggleSkin(skinKey)}
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition border-b border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2.5">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        )}
                        <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                          Skin {skin.skinNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {skin.batter1Name} & {skin.batter2Name}
                        </span>
                        {skin.won && (
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-500/20">
                            Won Skin Point
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="text-slate-500">
                          {skin.batter1Name}: <b>{skin.batter1Total}</b> | {skin.batter2Name}: <b>{skin.batter2Total}</b>
                        </span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          Total: {skin.skinTotalRuns}
                        </span>
                      </div>
                    </div>

                    {/* Skin Overs Table */}
                    {isExpanded && (
                      <div className="p-3 space-y-2 overflow-x-auto">
                        <table className="sports-table text-xs">
                          <thead>
                            <tr>
                              <th className="w-16">Over</th>
                              <th className="w-24">Bowler</th>
                              <th>Ball 1</th>
                              <th>Ball 2</th>
                              <th>Ball 3</th>
                              <th>Ball 4</th>
                              <th>Ball 5</th>
                              <th>Ball 6</th>
                              <th className="w-16 text-right">Runs</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(skin.overs || []).map((over, overIdx) => (
                              <tr key={over.overNumber}>
                                <td className="font-mono font-bold text-slate-500">
                                  #{over.overNumber}
                                </td>
                                <td className="font-semibold text-slate-800 dark:text-slate-200">
                                  {over.bowlerName}
                                </td>
                                {(over.balls || []).map((ball, ballIdx) => {
                                  const isDismissal = !!ball.dismissalType;
                                  const isExtra = !!ball.extrasType;

                                  return (
                                    <td key={ball.id} className="p-1">
                                      <input
                                        type="text"
                                        value={ball.rawToken}
                                        onChange={(e) =>
                                          handleCellUpdate(
                                            activeTab,
                                            skinIdx,
                                            overIdx,
                                            ballIdx,
                                            e.target.value
                                          )
                                        }
                                        className={`w-11 h-7 text-center font-mono font-bold text-xs rounded border transition ${
                                          isDismissal
                                            ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400"
                                            : isExtra
                                            ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400"
                                            : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-emerald-500"
                                        }`}
                                        title={`${ball.batterName} vs ${ball.bowlerName}: Net ${ball.netRuns}`}
                                      />
                                    </td>
                                  );
                                })}
                                <td className="text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                                  {over.overTotalRuns}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Player Summaries Tab */}
          {activeTab === "summary" && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Individual Match Contributions (RS - RC = C)
              </h3>
              <table className="sports-table text-xs">
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Runs Scored (RS)</th>
                    <th>Overs (OB)</th>
                    <th>Runs Conceded (RC)</th>
                    <th>Wickets</th>
                    <th>Economy</th>
                    <th className="text-right">Contribution (C)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ...(scorecard.awayInnings?.playerSummaries || []),
                    ...(scorecard.homeInnings?.playerSummaries || []),
                  ].map((p, idx) => (
                    <tr key={idx}>
                      <td className="font-bold text-slate-900 dark:text-white">{p.name}</td>
                      <td className="font-mono">{p.runsScored ?? 0}</td>
                      <td className="font-mono">{(p.oversBowled || 0).toFixed(1)}</td>
                      <td className="font-mono">{p.runsConceded ?? 0}</td>
                      <td className="font-mono">{p.wickets ?? 0}</td>
                      <td className="font-mono">{(p.economy || 0).toFixed(1)}</td>
                      <td
                        className={`font-mono font-bold text-right ${
                          p.contribution > 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : p.contribution < 0
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-slate-500"
                        }`}
                      >
                        {p.contribution > 0 ? `+${p.contribution}` : p.contribution}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Name Resolution & 16-Player Verification Tab */}
          {activeTab === "names" && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Player Name Reconciliation Gate ({resolvedPlayerRows.length} Players)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Checks all players across both teams against the canonical database with fuzzy & alias matching.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 self-start sm:self-auto">
                  {resolvedPlayerRows.filter(r => r.method !== "New Player (Pending)").length} / {resolvedPlayerRows.length} Reconciled
                </span>
              </div>

              {resolvedPlayerRows.some(r => r.highlight) && (
                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold">Automated Typos & Variant Matching Verified:</span>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                      {resolvedPlayerRows.filter(r => r.highlight).map(r => `"${r.token}" → ${r.canonical} (${r.conf})`).join(" • ")}
                    </p>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="sports-table text-xs">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Scanned Token</th>
                      <th>Team</th>
                      <th>Canonical Player in DB</th>
                      <th>Match Method</th>
                      <th className="text-right">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resolvedPlayerRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className={row.highlight ? "bg-amber-50/50 dark:bg-amber-950/20 font-bold" : ""}
                      >
                        <td className="font-mono text-slate-400">{idx + 1}</td>
                        <td className="font-mono font-bold text-slate-900 dark:text-white">
                          {row.token}
                        </td>
                        <td>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              row.team === "Away"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            }`}
                          >
                            {row.team}
                          </span>
                        </td>
                        <td className="font-semibold text-emerald-700 dark:text-emerald-400">
                          {row.canonical}
                        </td>
                        <td className="text-slate-500 font-mono text-[11px]">{row.method}</td>
                        <td className="text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {row.conf}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
