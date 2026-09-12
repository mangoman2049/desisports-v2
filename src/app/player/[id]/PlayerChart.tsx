"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  data: {
    labels: string[];
    runs: number[];
    wickets: number[];
    contributions: number[];
  };
}

export default function PlayerChart({ data }: Props) {
  const chartPoints = data.labels.map((label, idx) => ({
    name: label,
    runs: data.runs[idx] || 0,
    wickets: data.wickets[idx] || 0,
    contribution: data.contributions[idx] || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#64748b" }}
          tickLine={false}
          axisLine={{ stroke: "#cbd5e1" }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#64748b" }}
          tickLine={false}
          axisLine={{ stroke: "#cbd5e1" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0f172a",
            borderColor: "#1e293b",
            borderRadius: "8px",
            color: "#f8fafc",
            fontSize: "12px",
          }}
          itemStyle={{ padding: 0 }}
        />
        <Bar dataKey="runs" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={32} name="Runs" />
        <Line
          type="monotone"
          dataKey="contribution"
          stroke="#9333ea"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#9333ea" }}
          name="Contribution"
        />
        <Line
          type="monotone"
          dataKey="wickets"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ r: 3, fill: "#2563eb" }}
          name="Wickets"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
