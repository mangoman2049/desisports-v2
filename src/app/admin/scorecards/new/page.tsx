"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  FileCheck,
  Zap,
  ArrowRight,
  ShieldAlert,
  ExternalLink,
  Trophy,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";
import { analyzeBrowserImage } from "@/lib/quality-gate";
import { QualityDiagnostics } from "@/types/cricket";
import {
  getTournamentFixtures,
  getNextUpcomingFixture,
  FixtureOption,
} from "@/lib/tournament-fixtures";

function getDefaultMatchTitle(): string {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const m = months[now.getMonth()];
  const y = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${d}${m}${y}_Insportz_${hh}${mm}`;
}

export default function NewScorecardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-500">
          Loading scorecard intake…
        </div>
      }
    >
      <NewScorecardContent />
    </Suspense>
  );
}

function NewScorecardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Default to Tournament 2 (DesiBoys Bazooka 4.0) per user requirement
  const initialTournament = searchParams.get("tournamentId") || "2";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [tournamentId, setTournamentId] = useState<string>(initialTournament);
  const [availableFixtures, setAvailableFixtures] = useState<FixtureOption[]>(
    () => getTournamentFixtures(parseInt(initialTournament, 10))
  );
  const [selectedFixture, setSelectedFixture] = useState<FixtureOption | null>(
    () => {
      const fixtures = getTournamentFixtures(parseInt(initialTournament, 10));
      const paramFixtureId = searchParams.get("fixtureId");
      if (paramFixtureId) {
        const found = fixtures.find((f) => String(f.id) === paramFixtureId);
        if (found) return found;
      }
      return getNextUpcomingFixture(parseInt(initialTournament, 10));
    }
  );

  const [matchTitle, setMatchTitle] = useState<string>(() => {
    const fixtures = getTournamentFixtures(parseInt(initialTournament, 10));
    const next = getNextUpcomingFixture(parseInt(initialTournament, 10));
    return next
      ? `${next.team1} vs ${next.team2} (${next.date})`
      : getDefaultMatchTitle();
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzingQuality, setAnalyzingQuality] = useState(false);
  const [qualityDiagnostics, setQualityDiagnostics] =
    useState<QualityDiagnostics | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [duplicateAlert, setDuplicateAlert] = useState<{
    message: string;
    existingMatchId?: number;
    existingUploadId?: string;
  } | null>(null);
  const [fixtureMismatchAlert, setFixtureMismatchAlert] = useState<{
    message: string;
    expectedTeams?: { home: string; away: string };
    extractedTeams?: { home: string; away: string };
  } | null>(null);

  // Sync tournamentId or fixtureId if query params change
  useEffect(() => {
    const tId = searchParams.get("tournamentId");
    if (tId && tId !== tournamentId) {
      handleTournamentChange(tId);
    }
    const fId = searchParams.get("fixtureId");
    if (fId) {
      const fixtures = getTournamentFixtures(
        parseInt(tId || tournamentId, 10)
      );
      const found = fixtures.find((f) => String(f.id) === fId);
      if (found) {
        setSelectedFixture(found);
        setMatchTitle(`${found.team1} vs ${found.team2} (${found.date})`);
      }
    }
  }, [searchParams]);

  const handleTournamentChange = (newTId: string) => {
    setTournamentId(newTId);
    const fixtures = getTournamentFixtures(parseInt(newTId, 10));
    setAvailableFixtures(fixtures);
    const next = getNextUpcomingFixture(parseInt(newTId, 10));
    setSelectedFixture(next);
    if (next) {
      setMatchTitle(`${next.team1} vs ${next.team2} (${next.date})`);
    } else {
      setMatchTitle(getDefaultMatchTitle());
    }
    setFixtureMismatchAlert(null);
    setDuplicateAlert(null);
    setErrorMessage(null);
  };

  const handleFixtureChange = (fixtureIdStr: string) => {
    const found = availableFixtures.find((f) => String(f.id) === fixtureIdStr);
    if (found) {
      setSelectedFixture(found);
      setMatchTitle(`${found.team1} vs ${found.team2} (${found.date})`);
      setFixtureMismatchAlert(null);
      setDuplicateAlert(null);
      setErrorMessage(null);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Immediately flush all previous diagnostics, error messages, duplicate alerts, and mismatch alerts
    setQualityDiagnostics(null);
    setErrorMessage(null);
    setDuplicateAlert(null);
    setFixtureMismatchAlert(null);

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setAnalyzingQuality(true);

    // 2. Clear input value so selecting the same camera file name triggers onChange reliably
    e.target.value = "";

    try {
      const result = await analyzeBrowserImage(file);
      setQualityDiagnostics(result.diagnostics);
    } catch (err: any) {
      setErrorMessage(err.message || "Quality analysis failed.");
    } finally {
      setAnalyzingQuality(false);
    }
  };

  const handleLoadSample = async () => {
    setPreviewUrl("/uploads/scorecards/sample-scorecard.jpg");
    setAnalyzingQuality(true);
    setErrorMessage(null);
    setDuplicateAlert(null);
    setFixtureMismatchAlert(null);

    try {
      const response = await fetch("/uploads/scorecards/sample-scorecard.jpg");
      const blob = await response.blob();
      const file = new File([blob], "sample-scorecard.jpg", {
        type: "image/jpeg",
      });
      setSelectedFile(file);

      const result = await analyzeBrowserImage(file);
      setQualityDiagnostics(result.diagnostics);
    } catch {
      setQualityDiagnostics({
        overallPass: true,
        score: 96,
        checks: {
          resolution: {
            passed: true,
            width: 1600,
            height: 2844,
            minRequired: { width: 1000, height: 1200 },
            message: "Resolution meets high-density OCR requirements.",
          },
          blur: {
            passed: true,
            score: 240,
            threshold: 120,
            message: "Sheet text and circled marks are sharp.",
          },
          exposure: {
            passed: true,
            luminosity: 155,
            optimalRange: [80, 210],
            message: "Balanced paper exposure.",
          },
          glare: {
            passed: true,
            specularFraction: 0.015,
            threshold: 0.08,
            message: "No obstructive specular highlights.",
          },
          perspective: {
            passed: true,
            aspectRatio: 0.56,
            skewAngleDegrees: 1.2,
            message: "Page geometry is flat and aligned.",
          },
        },
        retakePrompts: [],
      });
    } finally {
      setAnalyzingQuality(false);
    }
  };

  const handleProceedToExtraction = async (forceDuplicate = false) => {
    setExtracting(true);
    setErrorMessage(null);
    setFixtureMismatchAlert(null);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      } else {
        formData.append("forceSample", "true");
      }
      if (forceDuplicate) {
        formData.append("forceDuplicate", "true");
      }
      if (matchTitle) {
        formData.append("matchTitle", matchTitle);
      }
      formData.append("tournamentId", tournamentId);

      // Pass fixture binding metadata for server-side mismatch guard
      if (selectedFixture) {
        formData.append("fixtureId", String(selectedFixture.id));
        formData.append("expectedHomeTeam", selectedFixture.team1);
        formData.append("expectedAwayTeam", selectedFixture.team2);
      }

      const res = await fetch("/api/scorecards/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // Strict Fixture Mismatch Guard
      if (res.status === 422 && data.isMismatch) {
        setFixtureMismatchAlert({
          message: data.message,
          expectedTeams: data.expectedTeams,
          extractedTeams: data.extractedTeams,
        });
        setExtracting(false);
        return;
      }

      if (res.status === 409 && data.isDuplicate) {
        setDuplicateAlert({
          message: data.message,
          existingMatchId: data.duplicateInfo?.existingMatchId,
          existingUploadId: data.duplicateInfo?.existingUploadId,
        });
        setExtracting(false);
        return;
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process scorecard");
      }

      // Store parsed result in session cache for maker-checker review
      sessionStorage.setItem(
        `scorecard_${data.uploadId}`,
        JSON.stringify(data.parsedScorecard)
      );

      // Navigate to maker-checker review screen
      router.push(`/admin/scorecards/${data.uploadId}/review`);
    } catch (err: any) {
      setErrorMessage(err.message || "Extraction pipeline failed.");
      setExtracting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Tournament Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20">
              Tournament Intake Flow
            </span>
            <span className="text-xs font-mono text-slate-500">
              Fixture Binding & Strict Mismatch Guard Active
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Scan & Reconcile Scorecard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select scheduled fixture to eliminate ambiguity. Fast quality gate and maker-checker audit.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Tournament Context Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <Trophy className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <select
              value={tournamentId}
              onChange={(e) => handleTournamentChange(e.target.value)}
              className="bg-transparent font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="2" className="text-slate-900">
                DesiBoys Bazooka 4.0 (#2) [Current]
              </option>
              <option value="0" className="text-slate-900">
                Desisports Regular Practice (#0)
              </option>
              <option value="1" className="text-slate-900">
                Desi Boys Tournament May 2026 (#1)
              </option>
            </select>
          </div>

          <button
            onClick={handleLoadSample}
            className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 transition"
          >
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>Load 09 Sep Sample</span>
          </button>
        </div>
      </div>

      {/* FIXTURE SELECTOR CARD */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-5 border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Fixture Binding
              </div>
              <div className="text-sm font-black text-white">
                Select Official Fixture
              </div>
            </div>
          </div>

          {/* Fixture Selector Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedFixture ? String(selectedFixture.id) : ""}
              onChange={(e) => handleFixtureChange(e.target.value)}
              className="bg-slate-800 text-xs font-semibold text-white px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer max-w-[280px] sm:max-w-xs truncate"
            >
              {availableFixtures.map((f) => (
                <option
                  key={f.id}
                  value={String(f.id)}
                  className="bg-slate-900 text-white"
                >
                  {f.stage}: {f.team1} vs {f.team2} ({f.date.split(",")[0]})
                  {f.hasScorecard ? " ✓ Done" : " • Next Up"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedFixture && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div>
              <span className="text-slate-400 font-mono">Teams</span>
              <div className="text-sm font-black text-white mt-0.5">
                {selectedFixture.team1}{" "}
                <span className="text-purple-400 font-normal">vs</span>{" "}
                {selectedFixture.team2}
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-mono">Scheduled Date</span>
              <div className="text-xs font-bold text-amber-300 font-mono mt-0.5">
                {selectedFixture.date}
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-mono">Stage & Status</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {selectedFixture.stage}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedFixture.hasScorecard
                    ? "Scorecard Approved"
                    : "Awaiting Scorecard"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FIXTURE MISMATCH ALERT BANNER */}
      {fixtureMismatchAlert && (
        <div className="rounded-2xl border-2 border-red-500/50 bg-red-500/10 p-5 space-y-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <h3 className="text-sm font-black text-red-500 dark:text-red-400">
                Fixture Mismatch Detected
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {fixtureMismatchAlert.message}
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold pt-1">
                <span className="text-slate-500">Extracted from Scorecard:</span>
                <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
                  {fixtureMismatchAlert.extractedTeams?.home} vs{" "}
                  {fixtureMismatchAlert.extractedTeams?.away}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload & Camera Buttons */}
      {!previewUrl && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-2xl transition group text-center"
          >
            <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-105 transition">
              <Camera className="h-7 w-7" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Take Photo with Camera
            </span>
            <span className="text-xs text-slate-500 mt-1 max-w-[200px]">
              Hold phone steady parallel to the scorecard sheet
            </span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-900 rounded-2xl transition group text-center"
          >
            <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 mb-3 group-hover:scale-105 transition">
              <Upload className="h-7 w-7" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Upload Existing Image
            </span>
            <span className="text-xs text-slate-500 mt-1">
              Supports JPEG, PNG, or WebP
            </span>
          </button>
        </div>
      )}

      {/* Image Preview & Quality Gate Analysis */}
      {previewUrl && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Image Preview */}
            <div className="md:col-span-6 bg-slate-100 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
              <div className="relative max-h-[420px] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <img
                  src={previewUrl}
                  alt="Scorecard preview"
                  className="object-contain max-h-[420px] w-auto"
                />
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedFile(null);
                    setQualityDiagnostics(null);
                    setErrorMessage(null);
                    setDuplicateAlert(null);
                    setFixtureMismatchAlert(null);
                  }}
                  className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Choose Another Image</span>
                </button>
              </div>
            </div>

            {/* Quality Diagnostics Card */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      Automated Quality Gate
                    </h2>
                  </div>
                  {analyzingQuality ? (
                    <span className="text-xs text-slate-400 animate-pulse">
                      Analyzing pixels…
                    </span>
                  ) : qualityDiagnostics ? (
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-black font-mono px-2 py-0.5 rounded-full ${
                          qualityDiagnostics.overallPass
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400 border border-red-500/20"
                        }`}
                      >
                        {qualityDiagnostics.score}% Score
                      </span>
                    </div>
                  ) : null}
                </div>

                {analyzingQuality && (
                  <div className="py-8 text-center space-y-2">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                    <p className="text-xs text-slate-500">
                      Evaluating sharpness, resolution, and exposure…
                    </p>
                  </div>
                )}

                {!analyzingQuality && qualityDiagnostics && (
                  <div className="space-y-3">
                    <div className="space-y-2 text-xs">
                      {/* Resolution Check */}
                      <div className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            Image Resolution
                          </span>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {qualityDiagnostics.checks.resolution.message}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            qualityDiagnostics.checks.resolution.passed
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                              : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                          }`}
                        >
                          {qualityDiagnostics.checks.resolution.passed
                            ? "Pass"
                            : "Fail"}
                        </span>
                      </div>

                      {/* Blur / Sharpness Check */}
                      <div className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            Focus & Text Sharpness
                          </span>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {qualityDiagnostics.checks.blur.message}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            qualityDiagnostics.checks.blur.passed
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                              : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                          }`}
                        >
                          {qualityDiagnostics.checks.blur.passed
                            ? "Sharp"
                            : "Blurry"}
                        </span>
                      </div>

                      {/* Exposure Check */}
                      <div className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            Lighting & Exposure
                          </span>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {qualityDiagnostics.checks.exposure.message}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            qualityDiagnostics.checks.exposure.passed
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                          }`}
                        >
                          {qualityDiagnostics.checks.exposure.passed
                            ? "Optimal"
                            : "Suboptimal"}
                        </span>
                      </div>
                    </div>

                    {/* Retake Guidance (if any) */}
                    {qualityDiagnostics.retakePrompts.length > 0 && (
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-500/20 rounded-xl space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>Quality Recommendations</span>
                        </div>
                        <ul className="list-disc list-inside text-[11px] text-amber-800 dark:text-amber-300 space-y-0.5">
                          {qualityDiagnostics.retakePrompts.map(
                            (prompt, idx) => (
                              <li key={idx}>{prompt}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Extraction Action Strip */}
              <div className="space-y-3">
                {duplicateAlert && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-500/30 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                      <ShieldAlert className="h-4 w-4 text-amber-600" />
                      <span>Potential Duplicate Scorecard Detected</span>
                    </div>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      {duplicateAlert.message}
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={() => handleProceedToExtraction(true)}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition"
                      >
                        Override & Re-Extract Match
                      </button>
                      {duplicateAlert.existingMatchId && (
                        <Link
                          href={`/matches/${duplicateAlert.existingMatchId}`}
                          className="text-xs text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>View Existing Match</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-500/20 rounded-xl text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  onClick={() => handleProceedToExtraction(false)}
                  disabled={
                    extracting ||
                    analyzingQuality ||
                    (qualityDiagnostics !== null &&
                      !qualityDiagnostics.overallPass)
                  }
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                    qualityDiagnostics?.overallPass
                      ? "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/30 cursor-pointer"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {extracting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Extracting & Reconciling 16 Players…</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="h-4 w-4" />
                      <span>Proceed to Maker-Checker Review</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
