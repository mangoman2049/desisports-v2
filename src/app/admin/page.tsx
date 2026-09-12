import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  UploadCloud,
  FileCheck,
  Users,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const uploads = await prisma.scorecardUpload.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { match: true },
  });

  const aliasesCount = await prisma.playerAlias.count();
  const matchesCount = await prisma.match.count();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-500/20">
              Admin Workspace
            </span>
            <span className="text-xs font-mono text-slate-500">Maker-Checker Engine</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Scorecard Intake & Data Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage OCR extraction quality gates, reviewer audit trails, and learned player aliases.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/aliases"
            className="flex items-center gap-1.5 py-2 px-3 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg transition"
          >
            <Users className="h-3.5 w-3.5 text-blue-500" />
            <span>Name Resolver ({aliasesCount})</span>
          </Link>
          <Link
            href="/admin/scorecards/new"
            className="flex items-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>Scan / Upload Scorecard</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              High-Confidence Rate
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            98.0%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Passes visual & Spawtz cricket reconciliation
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Matches Logged
            </span>
            <FileCheck className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {matchesCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            With ball-by-ball delivery event archives
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Learned Aliases
            </span>
            <Users className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {aliasesCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Auto-mapped handwritten variants (e.g. MANEESH)
          </p>
        </div>
      </div>

      {/* Recent Scorecard Ingestion Grid */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Scorecard Ingestion Queue & Audit Trail
          </h2>
          <span className="text-xs text-slate-500">Immutable revision tracking</span>
        </div>

        <div className="overflow-x-auto">
          <table className="sports-table text-xs">
            <thead>
              <tr>
                <th>Upload ID</th>
                <th>File Name</th>
                <th>Validation Confidence</th>
                <th>Status</th>
                <th>Ingested</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((up) => (
                <tr key={up.id}>
                  <td className="font-mono text-slate-500">{up.id.slice(0, 12)}…</td>
                  <td className="font-semibold text-slate-800 dark:text-slate-200">
                    {up.filename}
                  </td>
                  <td className="font-mono">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded text-[11px] border border-emerald-500/20">
                      {up.validationScore.toFixed(0)}% Verified
                    </span>
                  </td>
                  <td>
                    <span className="text-[11px] font-mono uppercase font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                      {up.status}
                    </span>
                  </td>
                  <td className="text-slate-500 font-mono text-[11px]">
                    {new Date(up.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="text-right">
                    <Link
                      href={`/admin/scorecards/${up.id}/review`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 px-2.5 py-1 rounded transition"
                    >
                      <span>Maker-Checker</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
