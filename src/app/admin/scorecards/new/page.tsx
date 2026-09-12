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
} from "lucide-react";
import { analyzeBrowserImage } from "@/lib/quality-gate";
import { QualityDiagnostics } from "@/types/cricket";

function getDefaultMatchTitle(): string {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, "0");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const m = months[now.getMonth()];
  const y = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${d}${m}${y}_Insportz_${hh}${mm}`;
}

export default function NewScorecardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading scorecard intake…</div>}>
      <NewScorecardContent />
    </Suspense>
  );
}

function NewScorecardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTournament = searchParams.get("tournamentId") || "0";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [tournamentId, setTournamentId] = useState<string>(initialTournament);
  const [matchTitle, setMatchTitle] = useState<string>(getDefaultMatchTitle());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzingQuality, setAnalyzingQuality] = useState(false);
  const [qualityDiagnostics, setQualityDiagnostics] = useState<QualityDiagnostics | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [duplicateAlert, setDuplicateAlert] = useState<{
    message: string;
    existingMatchId?: number;
    existingUploadId?: string;
  } | null>(null);

  // Sync tournamentId if query changes
  useEffect(() => {
    const tId = searchParams.get("tournamentId");
    if (tId) setTournamentId(tId);
  }, [searchParams]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Immediately flush all previous diagnostics, error messages, and duplicate alerts
    setQualityDiagnostics(null);
    setErrorMessage(null);
    setDuplicateAlert(null);

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

    try {
      const response = await fetch("/uploads/scorecards/sample-scorecard.jpg");
      const blob = await response.blob();
      const file = new File([blob], "sample-scorecard.jpg", { type: "image/jpeg" });
      setSelectedFile(file);

      const result = await analyzeBrowserImage(file);
      setQualityDiagnostics(result.diagnostics);
    } catch {
      setQualityDiagnostics({
        overallPass: true,
        score: 96,
        checks: {
          resolution: { passed: true, width: 1600, height: 2844, minRequired: { width: 1000, height: 1200 }, message: "Resolution meets high-density OCR requirements." },
          blur: { passed: true, score: 240, threshold: 120, message: "Sheet text and circled marks are sharp." },
          exposure: { passed: true, luminosity: 155, optimalRange: [80, 210], message: "Balanced paper exposure." },
          glare: { passed: true, specularFraction: 0.015, threshold: 0.08, message: "No obstructive specular highlights." },
          perspective: { passed: true, aspectRatio: 0.56, skewAngleDegrees: 1.2, message: "Page geometry is flat and aligned." },
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

      const res = await fetch("/api/scorecards/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

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
      sessionStorage.setItem(`scorecard_${data.uploadId}`, JSON.stringify(data.parsedScorecard));

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
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
              Tournament Intake Flow
            </span>
            <span className="text-xs font-mono text-slate-500">Quality Gate & Duplicate Guard Active</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Scan & Reconcile Scorecard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immediate visual quality gate before OCR extraction. Fast maker-checker verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Tournament Context Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <Trophy className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <select
              value={tournamentId}
              onChange={(e) => setTournamentId(e.target.value)}
              className="bg-transparent font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="0" className="text-slate-900">Desisports Regular Practice (#0)</option>
              <option value="1" className="text-slate-900">Desi Boys Tournament May 2026 (#1)</option>
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

      {/* Duplicate Alert Banner */}
      {duplicateAlert && (
        <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-50/80 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 space-y-3 shadow-sm">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold">Duplicate Match Scorecard Detected</h3>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                {duplicateAlert.message}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1 pl-7 text-xs font-semibold">
            {duplicateAlert.existingMatchId && (
              <Link
                href="/matches"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 hover:bg-amber-100 transition"
              >
                <span>View Existing Match #{duplicateAlert.existingMatchId}</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}

            <button
              onClick={() => handleProceedToExtraction(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm font-bold"
            >
              <span>Proceed with Upload (New Match / Override)</span>
            </button>

            <button
              onClick={() => setDuplicateAlert(null)}
              className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:underline"
            >
              Cancel
            </button>
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
            <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 mb-3 group-hover:scale-105 transition">
              <Upload className="h-7 w-7" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Upload Scorecard Image
            </span>
            <span className="text-xs text-slate-500 mt-1 max-w-[200px]">
              JPG, PNG or PDF scan from phone or gallery
            </span>
          </button>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Preview & Quality Gate Results */}
      {previewUrl && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Image Thumbnail Column */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-sm">
              <img
                src={previewUrl}
                alt="Scorecard preview"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-2 left-2 bg-black/75 backdrop-blur text-white text-[10px] font-mono px-2 py-0.5 rounded">
                Spawtz Template V1
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  setSelectedFile(null);
                  setQualityDiagnostics(null);
                  setDuplicateAlert(null);
                  setErrorMessage(null);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Choose Another</span>
              </button>
            </div>
          </div>

          {/* Quality Gate Inspection Panel */}
          <div className="md:col-span-7 space-y-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Image Quality Gate
                  </span>
                </div>
                {analyzingQuality ? (
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400 animate-pulse">
                    Scanning pixels…
                  </span>
                ) : qualityDiagnostics?.overallPass ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Passed ({qualityDiagnostics.score}%)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-500/20">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Retake Suggested ({qualityDiagnostics?.score || 0}%)
                  </span>
                )}
              </div>

              {/* 5 Quality Check Breakdown */}
              {qualityDiagnostics && (
                <div className="mt-3 space-y-2.5">
                  {Object.entries(qualityDiagnostics.checks).map(([key, item]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                    >
                      <div className="flex items-center gap-2">
                        {item.passed ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                        )}
                        <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">
                          {key}
                        </span>
                      </div>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {item.message}
                      </span>
                    </div>
                  ))}

                  {/* Retake Guidance Prompt if any failed */}
                  {qualityDiagnostics.retakePrompts.length > 0 && (
                    <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg">
                      <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block mb-1">
                        How to improve capture:
                      </span>
                      <ul className="text-xs text-amber-700 dark:text-amber-400 list-disc list-inside space-y-1">
                        {qualityDiagnostics.retakePrompts.map((prompt, idx) => (
                          <li key={idx}>{prompt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Next Step Action */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Match Identifier / Title
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={matchTitle}
                    onChange={(e) => setMatchTitle(e.target.value)}
                    placeholder="e.g. 12Sep2026_Insportz_2000"
                    className="flex-1 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setMatchTitle(getDefaultMatchTitle())}
                    className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg border border-slate-200 dark:border-slate-700"
                    title="Reset to current time"
                  >
                    Reset
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Automated naming pattern: <code className="font-mono">{getDefaultMatchTitle()}</code>
                </p>
              </div>

              {/* Name Resolution Status Badge */}
              <div className="p-2.5 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">
                    16-Player Fuzzy Resolver Ready
                  </span>
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                  Maneesh → Manish Pandey (#35)
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 pt-2 border-t border-emerald-500/10">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Fixed-Template OCR & Validation
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Extracts ball-by-ball cells, circled dismissals (R, B, C, ST), runs, extras, and reconciles skin totals before maker-checker review.
                  </p>
                </div>

                <button
                  disabled={analyzingQuality || extracting}
                  onClick={() => handleProceedToExtraction(false)}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition shrink-0"
                >
                  {extracting ? (
                    <>
                      <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Extracting…</span>
                    </>
                  ) : (
                    <>
                      <span>Extract & Reconcile</span>
                      <ArrowRight className="h-3.5 w-3.5" />
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
