"use client";

import { cn, formatArea, formatMoney, formatNumber, STATUS_LABELS } from "@/lib/utils";
import { PropertyImage } from "./property-image";
import { Badge, Button, EmptyState, IconButton } from "@/components/ui";
import { X, GitCompareArrows, Trash2 } from "lucide-react";
import type { Property } from "@/lib/types";

const ROWS: { key: string; label: string; get: (p: Property) => string }[] = [
  { key: "price", label: "قیمت", get: (p) => formatMoney(p.price) },
  { key: "area", label: "متراژ", get: (p) => formatArea(p.area) },
  { key: "beds", label: "خواب", get: (p) => (p.beds > 0 ? `${formatNumber(p.beds)} خواب` : "—") },
  { key: "baths", label: "سرویس", get: (p) => `${formatNumber(p.baths)} عدد` },
  { key: "parking", label: "پارکینگ", get: (p) => (p.parking > 0 ? `${formatNumber(p.parking)} عدد` : "ندارد") },
  { key: "yearBuilt", label: "سال ساخت", get: (p) => `${formatNumber(p.yearBuilt)}` },
  { key: "type", label: "نوع ملک", get: (p) => p.type },
  { key: "purpose", label: "کاربری", get: (p) => STATUS_LABELS[p.purpose] },
  { key: "status", label: "وضعیت", get: (p) => STATUS_LABELS[p.status] },
  { key: "views", label: "بازدید", get: (p) => formatNumber(p.views) },
  { key: "favorites", label: "علاقه‌مندی", get: (p) => formatNumber(p.favorites) },
];

const FEATURES: { key: keyof Property; label: string }[] = [
  { key: "elevator", label: "آسانسور" },
  { key: "balcony", label: "بالکن" },
  { key: "storage", label: "انباری" },
  { key: "security", label: "امنیت" },
  { key: "ac", label: "تهویه مطبوع" },
  { key: "heating", label: "شوفاژ مرکزی" },
  { key: "furnished", label: "مبله" },
];

export function Comparison({
  properties,
  onRemove,
  onClear,
  onBrowse,
}: {
  properties: Property[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onBrowse: () => void;
}) {
  if (properties.length === 0) {
    return (
      <EmptyState
        icon={<GitCompareArrows className="size-6" />}
        title="هنوز ملکی برای مقایسه انتخاب نشده"
        description="از صفحه املاک یا کشف، ملک‌ها را انتخاب کنید تا اینجا مقایسه شوند. حداکثر ۴ ملک."
        action={
          <Button size="sm" variant="primary" onClick={onBrowse}>
            مشاهده املاک
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GitCompareArrows className="size-4.5 text-accent" />
          <h2 className="text-[14px] font-bold text-ink">مقایسه املاک</h2>
          <Badge tone="accent" size="xs">
            {properties.length} از ۴
          </Badge>
        </div>
        <Button size="xs" variant="ghost" onClick={onClear}>
          <Trash2 className="size-3.5" />
          پاک کردن
        </Button>
      </div>

      <div className="table-wrap">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-edge">
              <th className="th w-36">ویژگی</th>
              {properties.map((p) => (
                <th key={p.id} className="th min-w-44 text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <PropertyImage tone={p.imageTone} type={p.type as "apartment"} label="" className="aspect-[16/9] w-full rounded-lg" />
                    <span className="max-w-40 truncate text-[11.5px] font-bold text-ink">{p.title}</span>
                    <IconButton label={`حذف ${p.title}`} size="xs" className="text-danger" onClick={() => onRemove(p.id)}>
                      <X className="size-3" />
                    </IconButton>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.key} className="border-b border-edge/60 last:border-0">
                <td className="td text-[11.5px] font-semibold text-ink-3">{row.label}</td>
                {properties.map((p) => {
                  const best = bestFor(row.key, properties);
                  const isBest = row.key !== "price" && row.key !== "views" && row.key !== "favorites" && row.get(p) === best && best !== "—";
                  return (
                    <td key={p.id} className={cn("td text-center", isBest && "font-bold text-ok")}>
                      {row.get(p)}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td className="td text-[11.5px] font-semibold text-ink-3">امکانات</td>
              {properties.map((p) => (
                <td key={p.id} className="td">
                  <div className="flex flex-wrap justify-center gap-1">
                    {FEATURES.filter((f) => p[f.key]).map((f) => (
                      <Badge key={f.key} tone="success" size="xs">
                        {f.label}
                      </Badge>
                    ))}
                    {FEATURES.every((f) => !p[f.key]) ? <span className="text-[11px] text-ink-3">—</span> : null}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="td text-[11.5px] font-semibold text-ink-3">آدرس</td>
              {properties.map((p) => (
                <td key={p.id} className="td text-center text-[11px] text-ink-3">{p.address}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-ink-3">
        مقایسه بر اساس داده‌های واقعی دمو انجام می‌شود. برای افزودن ملک به مقایسه، از دکمه «مقایسه» در کارت ملک استفاده کنید.
      </p>
    </div>
  );
}

function bestFor(key: string, list: Property[]): string {
  if (key === "area") return formatArea(Math.max(...list.map((p) => p.area)));
  if (key === "beds") return `${formatNumber(Math.max(...list.map((p) => p.beds)))} خواب`;
  if (key === "baths") return `${formatNumber(Math.max(...list.map((p) => p.baths)))} عدد`;
  if (key === "parking") return `${formatNumber(Math.max(...list.map((p) => p.parking)))} عدد`;
  if (key === "yearBuilt") return `${formatNumber(Math.max(...list.map((p) => p.yearBuilt)))}`;
  return "—";
}
