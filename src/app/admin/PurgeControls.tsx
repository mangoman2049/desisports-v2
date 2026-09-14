"use client";

import { useState } from "react";
import { Trash2, RotateCcw, AlertTriangle, Check, RefreshCw, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PurgeControls() {
  const router = useRouter();
  const [purging, setPurging] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState("");

  const handlePurge = async (mode: "uploads" | "reset") => {
    if (!adminKey.trim()) {
      setStatusMessage("Enter your admin key to perform this action.");
      return;
    }

    const confirmMsg =
      mode === "uploads"
        ? "Are you sure you want to purge all test scorecard uploads?"
        : "Reset database to clean seeded demo state? This will re-seed Manish Pandey and initial match history.";

    if (!window.confirm(confirmMsg)) return;

    setPurging(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/purge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey.trim(),
        },
        body: JSON.stringify({ mode }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage(data.message);
        setTimeout(() => {
          router.refresh();
        }, 1200);
      } else if (res.status === 401) {
        setStatusMessage("Error: Invalid admin key. Access denied.");
      } else {
        setStatusMessage(`Error: ${data.error || "Purge failed"}`);
      }
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300">
          <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Admin Testing & Sandbox Controls
          </span>
        </div>
        <span className="text-[10px] text-slate-500">Fast iteration during intake testing</span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        Testing scorecard intake? You can purge your recent uploads or cleanly reset the database back to the demo baseline anytime.
      </p>

      {/* Secure admin key input — no hardcoded secrets */}
      <div className="flex items-center gap-2">
        <Lock className="h-3.5 w-3.5 text-slate-400" />
        <input
          type="password"
          placeholder="Enter admin key"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <button
          onClick={() => handlePurge("uploads")}
          disabled={purging}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5 text-rose-500" />
          <span>Purge Uploaded Scorecards</span>
        </button>

        <button
          onClick={() => handlePurge("reset")}
          disabled={purging}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
        >
          {purging ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RotateCcw className="h-3.5 w-3.5" />
          )}
          <span>Reset to Clean Demo Baseline</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
}

