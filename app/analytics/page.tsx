"use client";

import { useState, useMemo } from "react";
import { cn, formatDate, formatMoney, formatNumber } from "@/lib/utils";
import { Panel, Badge, Button, Select } from "@/components/ui";
import { TrendingUp, Users, Building2, DollarSign, CalendarDays, MapPin, PieChart, BarChart2, Activity, Eye, Heart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useApp } from "@/lib/store";
import { BarChart, LineChart, PieChart as PieChartComp, AreaChart } from "@/components/charts";
import { dailySeries, typeBreakdown, purposeBreakdown, areaStats } from "@/lib/metrics";

const PERIODS = [
  { value: "7d", label: "۷ روز اخیر" },
  { value: "30d", label: "۳۰ روز اخیر" },
  { value: "90d", label: "۳ ماه اخیر" },
  { value: "1y", label: "۱ سال اخیر" },
] as const;

const KPI_TONE: Record<string, string> = {
  accent: "bg-accent/15 text-accent",
  cyan: "bg-cyan/15 text-cyan",
  danger: "bg-danger/15 text-danger",
  violet: "bg-violet/15 text-violet",
  ok: "bg-ok/15 text-ok",
  warn: "bg-warn/15 text-warn",
};

export default function AnalyticsPage() {
  const { properties, agents, viewings, customers, areas, reviews } = useApp();
  const [period, setPeriod] = useState("30d");

  const activeProps = properties.filter((p) => p.status === "Active");
  const totalViews = activeProps.reduce((s, p) => s + p.views, 0);
  const totalFavs = activeProps.reduce((s, p) => s + p.favorites, 0);
  const scheduledViewings = viewings.filter((v) => v.status === "Scheduled" || v.status === "Confirmed").length;
  const completedViewings = viewings.filter((v) => v.status === "Completed").length;
  const totalRevenue = properties.filter((p) => p.status === "Sold").reduce((s, p) => s + p.price, 0);

  const kpis = [
    { label: "ملک‌های فعال", value: activeProps.length, icon: Building2, color: "accent", delta: "+12%", deltaLabel: "از ماه قبل" },
    { label: "بازدید کل", value: totalViews, icon: Eye, color: "cyan", delta: "+8%", deltaLabel: "از ماه قبل" },
    { label: "علاقه‌مندی‌ها", value: totalFavs, icon: Heart, color: "danger", delta: "+15%", deltaLabel: "از ماه قبل" },
    { label: "درخواست بازدید", value: scheduledViewings, icon: CalendarDays, color: "violet", delta: "+5%", deltaLabel: "از ماه قبل" },
    { label: "فروش‌های نهایی", value: properties.filter((p) => p.status === "Sold").length, icon: TrendingUp, color: "ok", delta: "+3%", deltaLabel: "از ماه قبل" },
    { label: "مجموع درآمد", value: formatMoney(totalRevenue), icon: DollarSign, color: "warn", delta: "+22%", deltaLabel: "از ماه قبل" },
    { label: "مشاوران فعال", value: agents.length, icon: Users, color: "violet", delta: "0%", deltaLabel: "بدون تغییر" },
    { label: "مشتریان", value: customers.length, icon: Users, color: "ok", delta: "+7%", deltaLabel: "از ماه قبل" },
  ];

  const viewsData = dailySeries(14);
  const typeData = typeBreakdown();
  const purposeData = purposeBreakdown();
  const regionData = areaStats(8);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-edge pb-3">
        <div>
          <h1 className="text-[20px] font-extrabold text-ink">تحلیل و آمار</h1>
          <p className="text-[12.5px] text-ink-3">نمای کلی عملکرد پلتفرم املاک</p>
        </div>
        <Select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-36 text-[12px]">
          {PERIODS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </Select>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          const deltaColor = kpi.delta.startsWith("+") ? "ok" : kpi.delta.startsWith("-") ? "danger" : "ink-3";
          return (
            <Panel key={i} className="flex items-center gap-3">
              <div className={cn("flex size-10 items-center justify-center rounded-lg", KPI_TONE[kpi.color] ?? KPI_TONE.accent)}>
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[17px] font-extrabold text-ink">{kpi.value}</p>
                <p className="text-[11px] text-ink-3">{kpi.label}</p>
                <p className="mt-0.5 text-[10px] flex items-center gap-1">
                  <span className={cn("font-semibold", deltaColor === "ok" && "text-ok", deltaColor === "danger" && "text-danger", deltaColor === "ink-3" && "text-ink-3")}>
                    {deltaColor === "ok" ? <ArrowUpRight className="size-3" /> : deltaColor === "danger" ? <ArrowDownRight className="size-3" /> : ""}
                    {kpi.delta}
                  </span>
                  <span className="text-ink-3">{kpi.deltaLabel}</span>
                </p>
              </div>
            </Panel>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Panel>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13.5px] font-bold text-ink">بازدیدها و بازدیدهای ملک (۱۴ روز)</h2>
          </div>
          <BarChart
            data={viewsData}
            xKey="label"
            series={[
              { key: "views", label: "بازدید صفحه", color: "accent" },
              { key: "viewings", label: "بازدید ملک", color: "cyan" },
            ]}
            height={280}
            showLegend
          />
        </Panel>

        <Panel>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13.5px] font-bold text-ink">توزیع بر اساس نوع ملک</h2>
          </div>
          <PieChartComp
            data={typeData}
            labelKey="label"
            valueKey="value"
            colors={["accent", "cyan", "violet", "warn", "ok", "indigo"]}
            height={280}
            showLegend
          />
        </Panel>

        <Panel className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13.5px] font-bold text-ink">میانگین قیمت بر اساس منطقه</h2>
          </div>
          <LineChart
            data={regionData}
            xKey="label"
            series={[
              { key: "avgPrice", label: "میانگین قیمت", color: "accent" },
            ]}
            height={280}
            showLegend
            formatValue={(v) => v > 1000000000 ? `${(v / 1000000000).toFixed(1)}م` : v > 1000000 ? `${(v / 1000000).toFixed(0)}ه` : String(v)}
          />
        </Panel>

        <Panel>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13.5px] font-bold text-ink">مقایسه خرید vs اجاره</h2>
          </div>
          <BarChart
            data={purposeData}
            xKey="label"
            series={[
              { key: "value", label: "تعداد", color: "accent" },
            ]}
            height={280}
            showLegend
            horizontal
          />
        </Panel>

        <Panel className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13.5px] font-bold text-ink">ملک‌ها بر اساس منطقه</h2>
          </div>
          <AreaChart
            data={regionData}
            xKey="label"
            series={[
              { key: "count", label: "تعداد ملک", color: "accent" },
            ]}
            height={280}
            showLegend
          />
        </Panel>
      </div>

      {/* Top agents table */}
      <Panel>
        <h2 className="mb-4 text-[13.5px] font-bold text-ink">بهترین مشاوران</h2>
        <div className="table-wrap">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-edge">
                <th className="th">مشاور</th>
                <th className="th text-center">ملک‌ها</th>
                <th className="th text-center">بازدید</th>
                <th className="th text-center">فروش/اجاره</th>
                <th className="th text-center">امتیاز</th>
                <th className="th text-center">درآمد</th>
              </tr>
            </thead>
            <tbody>
              {agents.slice(0, 8).map((agent) => {
                const agentProps = properties.filter((p) => p.agentId === agent.id);
                const agentViews = agentProps.reduce((s, p) => s + p.views, 0);
                const agentSales = agentProps.filter((p) => p.status === "Sold" || p.status === "Rented").length;
                const agentRevenue = agentProps.filter((p) => p.status === "Sold").reduce((s, p) => s + p.price, 0);
                return (
                  <tr key={agent.id} className="border-b border-edge/60 last:border-0">
                    <td className="td">
                      <div className="flex items-center gap-2">
                        <span className="size-8 rounded-full bg-surface-2 flex items-center justify-center">
                          <Users className="size-4 text-ink-3" />
                        </span>
                        <span className="text-[12.5px] font-semibold text-ink">{agent.name}</span>
                      </div>
                    </td>
                    <td className="td text-center text-[12px] text-ink">{agentProps.length}</td>
                    <td className="td text-center text-[12px] text-ink">{formatNumber(agentViews)}</td>
                    <td className="td text-center text-[12px] text-ink">{agentSales}</td>
                    <td className="td text-center text-[12px] text-ink">
                      <span className="inline-flex items-center gap-1">
                        {[1,2,3,4,5].map((i) => (
                          <span key={i} className={cn("size-3", i <= agent.rating ? "text-warn" : "text-edge")}>★</span>
                        ))}
                        <span className="text-[10px] text-ink-3">({reviews.filter((r) => r.agentId === agent.id).length})</span>
                      </span>
                    </td>
                    <td className="td text-center text-[12px] font-bold text-ink">{formatMoney(agentRevenue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}