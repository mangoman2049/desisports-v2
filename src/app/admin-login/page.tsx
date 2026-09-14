"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin";
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) {
      setError("Please enter your admin key.");
      return;
    }

    setLoading(true);
    setError("");

    // Set admin key as a cookie for middleware to validate on subsequent page loads
    document.cookie = `admin-key=${encodeURIComponent(adminKey.trim())}; path=/; max-age=86400; SameSite=Strict`;

    // Redirect to the originally requested admin page
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-4">
          <Lock className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Admin Access
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Enter your admin key to access the DesiSports dashboard.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input
            type="password"
            placeholder="Admin Key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            autoComplete="off"
            autoFocus
          />
        </div>

        {error && (
          <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Access Dashboard"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="text-center text-[11px] text-slate-400 dark:text-slate-600 mt-6">
        Contact your administrator if you don&apos;t have access credentials.
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <Suspense fallback={<div className="text-slate-400 text-sm">Loading...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}

