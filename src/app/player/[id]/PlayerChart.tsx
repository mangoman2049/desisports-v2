"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

interface RunsChartProps {
  dates: string[];
  runs: number[];
}

export function RunsTrendChart({ dates, runs }: RunsChartProps) {
  const data = dates.map((d, i) => ({
    date: d,
    runs: runs[i] || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 20, right: 15, left: -25, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={{ stroke: "#e2e8f0" }}
          dy={5}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
          domain={[0, "dataMax + 4"]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0f172a",
            borderRadius: "10px",
            border: "none",
            color: "#fff",
            fontSize: "12px",
            padding: "6px 10px",
          }}
          formatter={(value: any) => [`${value} Runs`, "Scored"]}
        />
        <Line
          type="monotone"
          dataKey="runs"
          stroke="#10b981"
          strokeWidth={2.5}
          dot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "#ffffff" }}
          activeDot={{ r: 7, fill: "#059669" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface MomentumChartProps {
  dates: string[];
  contributions: number[];
}

export function ContributionMomentumChart({ dates, contributions }: MomentumChartProps) {
  const data = dates.map((d, i) => ({
    date: d,
    contribution: contributions[i] || 0,
  }));

  const gradientOffset = () => {
    if (!contributions || contributions.length === 0) return 0.5;
    const dataMax = Math.max(...contributions);
    const dataMin = Math.min(...contributions);
    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;
    if (dataMax === dataMin) return 0.5;
    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 20, right: 15, left: -25, bottom: 0 }}>
        <defs>
          <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset={off} stopColor="#10b981" stopOpacity={0.4} />
            <stop offset={off} stopColor="#ef4444" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={{ stroke: "#e2e8f0" }}
          dy={5}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0f172a",
            borderRadius: "10px",
            border: "none",
            color: "#fff",
            fontSize: "12px",
            padding: "6px 10px",
          }}
          formatter={(value: any) => [`${value > 0 ? "+" : ""}${value} Impact`, "Contribution"]}
        />
        <Area
          type="monotone"
          dataKey="contribution"
          stroke="#10b981"
          strokeWidth={2.5}
          fill="url(#splitColor)"
          dot={{ r: 4, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
