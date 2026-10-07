"use client";

import {
  ResponsiveContainer,
  BarChart as RBarChart,
  Bar,
  LineChart as RLineChart,
  Line,
  AreaChart as RAreaChart,
  Area,
  PieChart as RPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export const CHART_HEX: Record<string, string> = {
  accent: "#4c9aff",
  cyan: "#2fd4e8",
  danger: "#f4736f",
  ok: "#35d08a",
  warn: "#f5b53d",
  violet: "#9d8bf5",
  indigo: "#818cf8",
};

const hex = (name: string) => CHART_HEX[name] ?? name;

const faNum = (v: number | string) => Number(v).toLocaleString("fa-IR");

function DarkTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-edge bg-surface-elevated px-3 py-2 shadow-pop" dir="rtl">
      {label !== undefined ? <p className="mb-1 text-[11px] font-bold text-ink">{String(label)}</p> : null}
      <div className="space-y-1">
        {payload.map((p: any, i: number) => (
          <p key={i} className="flex items-center gap-1.5 text-[11px] text-ink-2">
            <span className="size-2 rounded-full" style={{ backgroundColor: p.color ?? p.payload?.fill }} />
            {p.name}: <span className="font-bold text-ink">{formatter ? formatter(p.value) : faNum(p.value)}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

const AXIS_TICK = { fontSize: 10, fill: "#8b9bb0" } as const;

interface SeriesDef {
  key: string;
  label: string;
  color: string;
}

interface ChartProps {
  data: any[];
  xKey: string;
  series: SeriesDef[];
  height?: number;
  showLegend?: boolean;
  formatValue?: (value: number) => string;
  horizontal?: boolean;
}

export function BarChart({ data, xKey, series, height = 280, showLegend = true, formatValue, horizontal = false }: ChartProps) {
  if (!data.length) return null;
  const fmt = formatValue ?? faNum;
  return (
    <div style={{ height }} dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <RBarChart data={data} layout={horizontal ? "vertical" : "horizontal"} margin={{ top: 8, right: 8, bottom: 8, left: 8 }} barGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke="#223041" vertical={!horizontal} horizontal={horizontal} />
          {horizontal ? (
            <>
              <XAxis type="number" tick={AXIS_TICK} tickFormatter={fmt} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey={xKey} tick={AXIS_TICK} width={80} axisLine={false} tickLine={false} />
            </>
          ) : (
            <>
              <XAxis dataKey={xKey} tick={AXIS_TICK} axisLine={false} tickLine={false} interval="preserveStart" minTickGap={24} />
              <YAxis tick={AXIS_TICK} tickFormatter={fmt} axisLine={false} tickLine={false} width={48} orientation="right" />
            </>
          )}
          <Tooltip content={<DarkTooltip formatter={formatValue} />} cursor={{ fill: "#17202d" }} />
          {showLegend ? <Legend wrapperStyle={{ fontSize: 11 }} /> : null}
          {series.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.label} fill={hex(s.color)} radius={horizontal ? [4, 8, 8, 4] : [6, 6, 2, 2]} maxBarSize={26} />
          ))}
        </RBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LineChart({ data, xKey, series, height = 280, showLegend = true, formatValue }: ChartProps) {
  if (!data.length) return null;
  const fmt = formatValue ?? faNum;
  return (
    <div style={{ height }} dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <RLineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#223041" />
          <XAxis dataKey={xKey} tick={AXIS_TICK} axisLine={false} tickLine={false} interval="preserveStart" minTickGap={24} />
          <YAxis tick={AXIS_TICK} tickFormatter={fmt} axisLine={false} tickLine={false} width={56} orientation="right" />
          <Tooltip content={<DarkTooltip formatter={formatValue} />} />
          {showLegend ? <Legend wrapperStyle={{ fontSize: 11 }} /> : null}
          {series.map((s) => (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={hex(s.color)} strokeWidth={2.5} dot={{ r: 3, fill: hex(s.color) }} activeDot={{ r: 5 }} />
          ))}
        </RLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PieChart({
  data,
  labelKey,
  valueKey,
  colors = ["accent", "cyan", "violet", "warn", "ok", "indigo"],
  height = 280,
  showLegend = true,
}: {
  data: any[];
  labelKey: string;
  valueKey: string;
  colors?: string[];
  height?: number;
  showLegend?: boolean;
}) {
  if (!data.length) return null;
  return (
    <div style={{ height }} dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <RPieChart>
          <Pie data={data} dataKey={valueKey} nameKey={labelKey} innerRadius="52%" outerRadius="80%" paddingAngle={2} strokeWidth={0}>
            {data.map((_, i) => (
              <Cell key={i} fill={hex(colors[i % colors.length])} />
            ))}
          </Pie>
          <Tooltip content={<DarkTooltip />} />
          {showLegend ? <Legend wrapperStyle={{ fontSize: 11 }} /> : null}
        </RPieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AreaChart({ data, xKey, series, height = 280, showLegend = true, formatValue }: ChartProps) {
  if (!data.length) return null;
  const fmt = formatValue ?? faNum;
  return (
    <div style={{ height }} dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <RAreaChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`ag-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={hex(s.color)} stopOpacity={0.45} />
                <stop offset="100%" stopColor={hex(s.color)} stopOpacity={0.04} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#223041" />
          <XAxis dataKey={xKey} tick={AXIS_TICK} axisLine={false} tickLine={false} interval="preserveStart" minTickGap={24} />
          <YAxis tick={AXIS_TICK} tickFormatter={fmt} axisLine={false} tickLine={false} width={48} orientation="right" />
          <Tooltip content={<DarkTooltip formatter={formatValue} />} cursor={{ stroke: "#2d3e52" }} />
          {showLegend ? <Legend wrapperStyle={{ fontSize: 11 }} /> : null}
          {series.map((s) => (
            <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={hex(s.color)} strokeWidth={2.5} fill={`url(#ag-${s.key})`} />
          ))}
        </RAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
