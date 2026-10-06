"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PropertyCard } from "@/components/property-card";
import { useApp } from "@/lib/store";
import { Badge, Select, Input, Button, IconButton, EmptyState } from "@/components/ui";
import { Filter, X, Grid, List } from "lucide-react";

const PURPOSES = ["All", "Buy", "Rent"] as const;
const TYPES = ["All", "آپارتمان", "ویلا", "خانه ویلایی", "پنت‌هاوس", "زمین", "تجاری"] as const;

const SORT_OPTIONS = [
  { value: "newest", label: "جدیدترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "area-desc", label: "بزرگ‌ترین" },
  { value: "popular", label: "محبوب‌ترین" },
] as const;

export default function PropertiesPage() {
  const { properties, areas } = useApp();
  const [filter, setFilter] = useState({
    query: "",
    purpose: "All" as (typeof PURPOSES)[number],
    type: "All" as (typeof TYPES)[number],
    area: "All",
    priceMin: 0,
    priceMax: 2000000000,
    beds: 0,
    hasElevator: false,
    hasBalcony: false,
    hasParking: false,
    furnished: false,
  });
  const [sort, setSort] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const activeProperties = properties.filter((p) => p.status === "Active");

  const filtered = activeProperties.filter((p) => {
    if (filter.query) {
      const q = filter.query.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.address.toLowerCase().includes(q)) return false;
    }
    if (filter.purpose !== "All" && p.purpose !== filter.purpose) return false;
    if (filter.type !== "All" && p.type !== filter.type) return false;
    if (filter.area !== "All" && p.areaId !== filter.area) return false;
    if (p.price < filter.priceMin || p.price > filter.priceMax) return false;
    if (filter.beds > 0 && p.beds < filter.beds) return false;
    if (filter.hasElevator && !p.elevator) return false;
    if (filter.hasBalcony && !p.balcony) return false;
    if (filter.hasParking && p.parking === 0) return false;
    if (filter.furnished && !p.furnished) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "area-desc": return b.area - a.area;
      case "popular": return b.views - a.views;
      default: return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
  });

  const clearFilters = () => {
    setFilter({
      query: "",
      purpose: "All",
      type: "All",
      area: "All",
      priceMin: 0,
      priceMax: 2000000000,
      beds: 0,
      hasElevator: false,
      hasBalcony: false,
      hasParking: false,
      furnished: false,
    });
  };

  const hasActiveFilters = filter.query || filter.purpose !== "All" || filter.type !== "All" || filter.area !== "All" || filter.priceMin > 0 || filter.priceMax < 2000000000 || filter.beds > 0 || filter.hasElevator || filter.hasBalcony || filter.hasParking || filter.furnished;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-edge pb-3">
        <div>
          <h1 className="text-[20px] font-extrabold text-ink">جستجوی املاک</h1>
          <p className="text-[12.5px] text-ink-3">
            {activeProperties.length} ملک فعال — {sorted.length} نتیجه
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            variant={showFilters ? "primary" : "ghost"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="size-3.5" />
            فیلترها
            {hasActiveFilters ? <Badge tone="accent" size="xs">فعال</Badge> : null}
          </Button>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-40 text-[12px]"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
          <div className="flex items-center border border-edge rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              aria-pressed={viewMode === "grid"}
              aria-label="نمایش گریدی"
              className={cn("p-1.5", viewMode === "grid" ? "bg-accent/15 text-accent" : "text-ink-3 hover:text-ink")}
            >
              <Grid className="size-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"}
              aria-label="نمایش لیستی"
              className={cn("p-1.5", viewMode === "list" ? "bg-accent/15 text-accent" : "text-ink-3 hover:text-ink")}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="panel space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[13.5px] font-bold text-ink">فیلترهای پیشرفته</h3>
            <Button size="xs" variant="ghost" onClick={clearFilters}>
              <X className="size-3.5" />
              پاک کردن همه
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Input
              label="جستجو"
              value={filter.query}
              onChange={(e) => setFilter((f) => ({ ...f, query: e.target.value }))}
              placeholder="نام، آدرس، منطقه…"
            />

            <Select
              label="کاربری"
              value={filter.purpose}
              onChange={(e) => setFilter((f) => ({ ...f, purpose: e.target.value as typeof filter.purpose }))}
            >
              {PURPOSES.map((v) => (
                <option key={v} value={v}>{v === "All" ? "همه" : v === "Buy" ? "خرید" : "اجاره"}</option>
              ))}
            </Select>

            <Select
              label="نوع ملک"
              value={filter.type}
              onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value as typeof filter.type }))}
            >
              {TYPES.map((v) => (
                <option key={v} value={v}>{v === "All" ? "همه" : v}</option>
              ))}
            </Select>

            <Select
              label="منطقه"
              value={filter.area}
              onChange={(e) => setFilter((f) => ({ ...f, area: e.target.value }))}
            >
              <option value="All">همه</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </Select>

            <div className="space-y-2">
              <label className="text-[11.5px] font-semibold text-ink">محدوده قیمت</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  value={filter.priceMin}
                  onChange={(e) => setFilter((f) => ({ ...f, priceMin: Number(e.target.value) || 0 }))}
                  placeholder="حداقل"
                />
                <Input
                  type="number"
                  value={filter.priceMax}
                  onChange={(e) => setFilter((f) => ({ ...f, priceMax: Number(e.target.value) || 2000000000 }))}
                  placeholder="حداکثر"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <Select
              label="حداقل خواب"
              value={filter.beds}
              onChange={(e) => setFilter((f) => ({ ...f, beds: Number(e.target.value) }))}
            >
              <option value={0}>بدون محدودیت</option>
              <option value={1}>۱+</option>
              <option value={2}>۲+</option>
              <option value={3}>۳+</option>
              <option value={4}>۴+</option>
            </Select>

            <div className="flex flex-wrap gap-2 pt-6">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={filter.hasElevator} onChange={(e) => setFilter((f) => ({ ...f, hasElevator: e.target.checked }))} className="size-3.5 accent-accent" />
                <span className="text-[12px] text-ink-2">آسانسور</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={filter.hasBalcony} onChange={(e) => setFilter((f) => ({ ...f, hasBalcony: e.target.checked }))} className="size-3.5 accent-accent" />
                <span className="text-[12px] text-ink-2">بالکن</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={filter.hasParking} onChange={(e) => setFilter((f) => ({ ...f, hasParking: e.target.checked }))} className="size-3.5 accent-accent" />
                <span className="text-[12px] text-ink-2">پارکینگ</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={filter.furnished} onChange={(e) => setFilter((f) => ({ ...f, furnished: e.target.checked }))} className="size-3.5 accent-accent" />
                <span className="text-[12px] text-ink-2">مبله</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {sorted.length === 0 ? (
        <EmptyState
          icon={<Filter className="size-6" />}
          title="ملکی یافت نشد"
          description="فیلترها را تغییر دهید یا جستجو را بازتر کنید."
          action={
            <Button size="sm" variant="primary" onClick={clearFilters}>
              پاک کردن فیلترها
            </Button>
          }
        />
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-edge">
              {sorted.map((p) => (
                <PropertyCard key={p.id} property={p} compact={true} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}