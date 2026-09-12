"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, ArrowLeft, Plus, Check, RefreshCw, AlertCircle } from "lucide-react";

interface AliasItem {
  id: number;
  alias: string;
  playerId: number;
  confidence: number;
  status: string;
  approvedBy: string | null;
  player: {
    canonicalName: string;
  };
}

interface PlayerOption {
  id: number;
  canonicalName: string;
}

export default function NameResolverPage() {
  const [aliases, setAliases] = useState<AliasItem[]>([]);
  const [players, setPlayers] = useState<PlayerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAlias, setNewAlias] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  const fetchAliases = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/aliases");
      const data = await res.json();
      if (data.aliases) setAliases(data.aliases);
      if (data.players) {
        setPlayers(data.players);
        if (data.players.length > 0) setSelectedPlayerId(data.players[0].id);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAliases();
  }, []);

  const handleAddAlias = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlias || !selectedPlayerId) return;

    try {
      const res = await fetch("/api/aliases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alias: newAlias, playerId: selectedPlayerId }),
      });
      if (res.ok) {
        setNewAlias("");
        fetchAliases();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20">
                Identity Resolution
              </span>
              <span className="text-xs font-mono text-slate-500">Learned Mappings</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              Player Name Resolver
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Maps handwriting and OCR spelling variations to canonical player records with rollback protection.
            </p>
          </div>
        </div>

        <button
          onClick={fetchAliases}
          className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 transition self-start sm:self-auto"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Add New Alias Form */}
      <form
        onSubmit={handleAddAlias}
        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row gap-3 items-end"
      >
        <div className="flex-1 w-full">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Handwritten / Raw OCR Alias
          </label>
          <input
            type="text"
            placeholder="e.g. MANEESH, SUNNY P"
            value={newAlias}
            onChange={(e) => setNewAlias(e.target.value)}
            className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          />
        </div>

        <div className="flex-1 w-full">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Maps to Canonical Player
          </label>
          <select
            value={selectedPlayerId || ""}
            onChange={(e) => setSelectedPlayerId(Number(e.target.value))}
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.canonicalName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition shrink-0 w-full sm:w-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Learned Mapping</span>
        </button>
      </form>

      {/* Active Mappings Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Active Learned Aliases ({aliases.length})
          </span>
          <span className="text-[11px] text-slate-400">
            Future scorecard scans will automatically link these variants
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="sports-table text-xs">
            <thead>
              <tr>
                <th>Raw Variant</th>
                <th>Maps To Canonical Player</th>
                <th>Confidence</th>
                <th>Status</th>
                <th>Approved By</th>
              </tr>
            </thead>
            <tbody>
              {aliases.map((al) => (
                <tr key={al.id}>
                  <td className="font-mono font-bold text-slate-900 dark:text-white">
                    {al.alias}
                  </td>
                  <td className="font-semibold text-purple-600 dark:text-purple-400">
                    {al.player.canonicalName}
                  </td>
                  <td className="font-mono">{(al.confidence * 100).toFixed(0)}%</td>
                  <td>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-500/20">
                      {al.status}
                    </span>
                  </td>
                  <td className="text-slate-500">{al.approvedBy || "System"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
