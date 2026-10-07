"use client";

import { useState } from "react";
import { cn, formatMoney, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { PropertyCard } from "@/components/property-card";
import { useApp } from "@/lib/store";
import { MapPin, TrendingUp, Heart, CalendarCheck, Home as HomeIcon } from "lucide-react";

export default function DiscoverPage() {
  const { properties, favorites, areas } = useApp();
  const [filter, setFilter] = useState({
    purpose: "All",
    type: "All",
    priceMax: 0,
    area: "All",
  });

  const activeProperties = properties.filter((p) => p.status === "Active");
  const areaStats = areas.map((a) => ({ ...a, count: properties.filter((p) => p.areaId === a.id).length })).sort((a, b) => b.count - a.count);

  const filteredProperties = activeProperties.filter((p) => {
    if (filter.purpose !== "All" && p.purpose !== filter.purpose) return false;
    if (filter.type !== "All" && p.type !== filter.type) return false;
    if (filter.priceMax > 0 && p.price > filter.priceMax) return false;
    if (filter.area !== "All" && p.areaId !== filter.area) return false;
    return true;
  });

  const stats = [
    { label: "خریدنی", value: activeProperties.filter((p) => p.purpose === "Buy").length, icon: HomeIcon, color: "bg-accent/15 text-accent" },
    { label: "اجاره‌ای", value: activeProperties.filter((p) => p.purpose === "Rent").length, icon: CalendarCheck, color: "bg-cyan/15 text-cyan" },
    { label: "محبوب‌ترین", value: favorites.length, icon: Heart, color: "bg-danger/15 text-danger" },
    { label: "نمای کلی", value: activeProperties.length, icon: TrendingUp, color: "bg-indigo/15 text-indigo" },
  ];

  return (
    <div className="space-y-8">
      <section className="panel relative overflow-hidden p-0">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(520px 200px at 85% 0%, rgba(76,154,255,0.22), transparent 70%), radial-gradient(420px 180px at 10% 100%, rgba(47,212,232,0.14), transparent 70%)",
          }}
        />
        <div className="relative flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-semibold text-accent">پلتفرم خرید، فروش و اجاره ملک</p>
            <h1 className="mt-1.5 text-[22px] font-extrabold leading-9 text-ink sm:text-[26px]">
              خانه بعدی‌ات را همین‌جا پیدا کن
            </h1>
            <p className="mt-1.5 max-w-xl text-[13px] leading-6 text-ink-3">
              {formatNumber(activeProperties.length)} ملک فعال در {formatNumber(areas.length)} منطقه — جستجو، مقایسه روی نقشه، بازدید و گفتگو با مشاور، همه در یک‌جا.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a
                href="/properties"
                className="focusable inline-flex h-9 items-center gap-2 rounded-lg bg-accent px-4 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
              >
                مشاهده املاک
              </a>
              <a
                href="/map"
                className="focusable inline-flex h-9 items-center gap-2 rounded-lg border border-edge bg-surface-2 px-4 text-[13px] font-semibold text-ink-2 transition-colors hover:text-ink"
              >
                <MapPin className="size-4" />
                جستجو روی نقشه
              </a>
            </div>
          </div>
          <div className="grid shrink-0 grid-cols-2 gap-2.5 lg:w-72">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-2.5 rounded-xl border border-edge bg-surface/70 p-3">
                  <div className={cn("flex size-9 items-center justify-center rounded-lg", s.color)}>
                    <Icon className="size-4.5" />
                  </div>
                  <div>
                    <p className="text-[14px] font-extrabold text-ink">{formatNumber(s.value)}</p>
                    <p className="text-[10.5px] text-ink-3">{s.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="panel grid gap-4 md:grid-cols-[240px_1fr]">
        <aside className="space-y-5 border-e border-edge pe-5">
          <div>
            <label className="block text-[12.5px] font-bold text-ink mb-2">کاربری</label>
            <div className="flex flex-col gap-2">
              {["All", "Buy", "Rent"].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilter((f) => ({ ...f, purpose: p }))}
                  className={cn(
                    "text-start text-[12px] px-3 py-1.5 rounded-lg transition-colors",
                    filter.purpose === p ? "bg-accent/15 text-accent font-semibold" : "text-ink-3 hover:bg-surface-2",
                  )}
                >
                  {p === "All" ? "همه" : p === "Buy" ? "خرید" : "اجاره"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-ink mb-2">نوع ملک</label>
            <div className="flex flex-col gap-2">
              {["All", "آپارتمان", "ویلا", "خانه ویلایی", "پنت‌هاوس", "زمین", "تجاری"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter((f) => ({ ...f, type: t }))}
                  className={cn(
                    "text-start text-[12px] px-3 py-1.5 rounded-lg transition-colors",
                    filter.type === t ? "bg-accent/15 text-accent font-semibold" : "text-ink-3 hover:bg-surface-2",
                  )}
                >
                  {t === "All" ? "همه" : t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-ink mb-2">نمای کلی منطقه‌ها</label>
            <div className="space-y-2">
              {areaStats.slice(0, 8).map((a) => (
                <button
                  key={a.id}
                  onClick={() => setFilter((f) => ({ ...f, area: a.id }))}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 rounded-lg transition-colors",
                    filter.area === a.id ? "bg-accent/15 text-accent font-semibold" : "text-ink-3 hover:bg-surface-2",
                  )}
                >
                  <span>{a.name}</span>
                  <Badge tone="default" size="xs" className="text-ink-2">
                    {a.count}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[12.5px] font-bold text-ink">
              {filteredProperties.length} ملک — نمایش {Math.min(filteredProperties.length, 24)} مورد از {activeProperties.length}
            </p>
              <select
                value={filter.priceMax}
                onChange={(e) => setFilter((f) => ({ ...f, priceMax: Number(e.target.value) }))}
                className="field py-1 text-[11.5px]"
                aria-label="سقف قیمت"
              >
              <option value={0}>بدون سقف قیمت</option>
              <option value={10_000_000_000}>تا ۱۰ میلیارد</option>
              <option value={50_000_000_000}>تا ۵۰ میلیارد</option>
              <option value={200_000_000_000}>تا ۲۰۰ میلیارد</option>
            </select>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.slice(0, 24).map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>

          {filteredProperties.length === 0 ? (
            <div className="py-12 text-center">
              <HomeIcon className="mx-auto size-10 text-ink-3" />
              <p className="mt-2 text-[13.5px] font-bold text-ink">ملکی یافت نشد</p>
              <p className="text-[12px] text-ink-3">فیلترها را تغییر دهید یا محدوده قیمت را گسترش دهید.</p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="panel grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {areaStats.slice(0, 8).map((a) => {
          const percent = (a.count / activeProperties.length) * 100;
          return (
            <div key={a.id} className="space-y-2">
              <div className="flex items-center justify-between text-[12.5px] font-semibold text-ink">
                <span>{a.name}</span>
                <span className="text-ink-3">{a.count} ملک</span>
              </div>
              <div className="h-2 w-full rounded-full bg-edge">
                <div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
