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
    priceRange: { min: 0, max: 1000000 },
    area: "All",
  });

  const activeProperties = properties.filter((p) => p.status === "Active");
  const areaStats = areas.map((a) => ({ ...a, count: properties.filter((p) => p.areaId === a.id).length })).sort((a, b) => b.count - a.count);

  const filteredProperties = activeProperties.filter((p) => {
    if (filter.purpose !== "All" && p.purpose !== filter.purpose) return false;
    if (filter.type !== "All" && p.type !== filter.type) return false;
    if (p.price < filter.priceRange.min || p.price > filter.priceRange.max) return false;
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
      <section>
        <h1 className="text-[20px] font-extrabold text-ink">کاوش املاک</h1>
        <p className="text-[13.5px] text-ink-3">املاک برگزیده و آنلاین در سراسر ایران را کشف کنید.</p>
      </section>

      <section className="panel grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center gap-3">
              <div className={cn("flex size-10 items-center justify-center rounded-lg", s.color)}>
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-[13.5px] font-bold text-ink">{s.value.toLocaleString("fa-IR")}</p>
                <p className="text-[11px] text-ink-3">{s.label}</p>
              </div>
            </div>
          );
        })}
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
                value={filter.priceRange.max}
                onChange={(e) => setFilter((f) => ({ ...f, priceRange: { ...f.priceRange, max: Number(e.target.value) } }))}
                className="field py-1 text-[11.5px]"
              >
              <option value="200000">۲۰۰٫۰۰۰٫۰۰۰</option>
              <option value="500000">۵۰۰٫۰۰۰٫۰۰۰</option>
              <option value="1000000" selected>۱٫۰۰۰٫۰۰۰٫۰۰۰</option>
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
