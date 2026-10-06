"use client";

import { useMemo, useState } from "react";
import { cn, formatMoney } from "@/lib/utils";
import type { Property } from "@/lib/types";
import { IconButton, Badge } from "@/components/ui";
import { Plus, Minus, LocateFixed, List, Map as MapIcon, X } from "lucide-react";

const ZOOMS = [1, 1.5, 2, 3];

/**
 * Self-contained mock map. No external map API — a stylised city grid with
 * roads, blocks, a park and water, with property markers positioned by
 * percentage coordinates. Markers and the list stay in two-way sync.
 */
export function MapView({
  properties,
  selectedId,
  onSelect,
  height = "h-[520px]",
  showList = true,
}: {
  properties: Property[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  height?: string;
  showList?: boolean;
}) {
  const [zoomIdx, setZoomIdx] = useState(1);
  const [query, setQuery] = useState("");
  const [layout, setLayout] = useState<"split" | "map" | "list">("split");

  const zoom = ZOOMS[zoomIdx];

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return properties;
    return properties.filter((p) => p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.city.includes(q));
  }, [properties, query]);

  const selected = properties.find((p) => p.id === selectedId) ?? null;

  return (
    <div className={cn("flex flex-col gap-3", showList && "xl:flex-row")}>
      {/* Map */}
      <div className={cn("panel relative overflow-hidden p-0", showList ? "xl:flex-1" : "w-full")}>
        <div className={cn("relative w-full overflow-hidden", height)}>
          <div
            className="absolute inset-0 transition-transform duration-300"
            style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
          >
            <MapCanvas />
            {visible.map((p) => {
              const isSelected = p.id === selectedId;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelect(isSelected ? null : p.id)}
                  className="group absolute -translate-x-1/2 -translate-y-full"
                  style={{ left: `${p.mapX}%`, top: `${p.mapY}%` }}
                  aria-label={`${p.title} — ${formatMoney(p.price, true)}`}
                  aria-pressed={isSelected}
                >
                  <span
                    className={cn(
                      "flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-bold shadow-card transition-all duration-150",
                      isSelected
                        ? "border-accent bg-accent text-white scale-110"
                        : "border-edge bg-surface text-ink group-hover:border-accent group-hover:text-accent",
                    )}
                  >
                    {formatMoney(p.price, true)}
                  </span>
                  <span className={cn("mx-auto block size-2 -translate-y-1 rotate-45", isSelected ? "bg-accent" : "bg-surface group-hover:bg-accent")} />
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="absolute end-3 top-3 z-10 flex flex-col gap-1.5">
            <IconButton label="بزرگ‌نمایی" onClick={() => setZoomIdx((i) => Math.min(ZOOMS.length - 1, i + 1))} disabled={zoomIdx >= ZOOMS.length - 1}>
              <Plus className="size-4" />
            </IconButton>
            <IconButton label="کوچک‌نمایی" onClick={() => setZoomIdx((i) => Math.max(0, i - 1))} disabled={zoomIdx <= 0}>
              <Minus className="size-4" />
            </IconButton>
            <IconButton label="بازنشانی زوم" onClick={() => setZoomIdx(1)}>
              <LocateFixed className="size-4" />
            </IconButton>
          </div>

          <div className="absolute start-3 top-3 z-10 flex gap-1 rounded-lg border border-edge bg-surface/90 p-1 backdrop-blur">
            <button
              onClick={() => setLayout("split")}
              aria-pressed={layout === "split"}
              className={cn("flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium", layout === "split" ? "bg-accent/15 text-accent" : "text-ink-3")}
            >
              <MapIcon className="size-3.5" />
              ترکیبی
            </button>
            <button
              onClick={() => setLayout("map")}
              aria-pressed={layout === "map"}
              className={cn("flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium", layout === "map" ? "bg-accent/15 text-accent" : "text-ink-3")}
            >
              <MapIcon className="size-3.5" />
              نقشه
            </button>
            <button
              onClick={() => setLayout("list")}
              aria-pressed={layout === "list"}
              className={cn("flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium", layout === "list" ? "bg-accent/15 text-accent" : "text-ink-3")}
            >
              <List className="size-3.5" />
              لیست
            </button>
          </div>

          <div className="absolute bottom-3 start-3 z-10 w-56">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی منطقه یا آدرس…"
              aria-label="جستجو در نقشه"
              className="field py-1.5 text-[12px]"
            />
          </div>

          <div className="absolute bottom-3 end-3 z-10">
            <Badge tone="default" className="bg-surface/90 backdrop-blur">
              {formatNumber(visible.length)} ملک
            </Badge>
          </div>
        </div>

        {/* Selected property card */}
        {selected ? (
          <div className="absolute bottom-14 start-3 z-10 w-72 rounded-xl border border-edge bg-surface p-3 shadow-pop">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[12.5px] font-bold text-ink">{selected.title}</p>
                <p className="truncate text-[11px] text-ink-3">{selected.address}</p>
              </div>
              <button onClick={() => onSelect(null)} aria-label="بستن" className="focusable rounded p-0.5 text-ink-3 hover:bg-surface-2 hover:text-ink">
                <X className="size-3.5" />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[13px] font-extrabold text-accent">{formatMoney(selected.price, true)}</span>
              <Badge tone={selected.purpose === "Buy" ? "accent" : "cyan"} size="xs">
                {selected.purpose === "Buy" ? "خرید" : "اجاره"}
              </Badge>
            </div>
          </div>
        ) : null}
      </div>

      {/* List */}
      {showList && layout !== "map" ? (
        <div className={cn("panel flex max-h-[520px] flex-col p-0", layout === "list" ? "w-full" : "xl:w-80")}>
          <div className="border-b border-edge px-4 py-3">
            <h3 className="text-[12.5px] font-bold text-ink">املاک روی نقشه</h3>
            <p className="text-[11px] text-ink-3">{formatNumber(visible.length)} نتیجه — برای انتخاب روی مارکر بزنید</p>
          </div>
          <ul className="flex-1 divide-y divide-edge overflow-y-auto">
            {visible.slice(0, 30).map((p) => {
              const isSelected = p.id === selectedId;
              return (
                <li key={p.id}>
                  <button
                    onClick={() => onSelect(isSelected ? null : p.id)}
                    aria-pressed={isSelected}
                    className={cn("flex w-full items-center gap-2.5 px-3 py-2.5 text-start transition-colors", isSelected ? "bg-accent/10" : "hover:bg-surface-2")}
                  >
                    <span className={cn("size-2 shrink-0 rounded-full", isSelected ? "bg-accent" : "bg-edge-strong")} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-semibold text-ink">{p.title}</span>
                      <span className="block truncate text-[10.5px] text-ink-3">
                        {p.area} متر · {p.beds} خواب
                      </span>
                    </span>
                    <span className="shrink-0 text-[11.5px] font-bold text-ink">{formatMoney(p.price, true)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function MapCanvas() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
      <rect width="100" height="100" fill="#0e1620" />
      {/* city blocks */}
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 8 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={c * 13 + 1} y={r * 17 + 1} width="11" height="15" rx="1" fill="#16202d" stroke="#1e2937" strokeWidth="0.2" />
        )),
      )}
      {/* roads */}
      <rect x="0" y="33" width="100" height="2.4" fill="#223041" />
      <rect x="0" y="66" width="100" height="2.4" fill="#223041" />
      <rect x="33" y="0" width="2.4" height="100" fill="#223041" />
      <rect x="66" y="0" width="2.4" height="100" fill="#223041" />
      <rect x="0" y="49" width="100" height="1.6" fill="#1b2836" />
      <rect x="49" y="0" width="1.6" height="100" fill="#1b2836" />
      {/* park */}
      <rect x="36" y="36" width="10" height="10" rx="2" fill="#0b3f2a" opacity="0.8" />
      <rect x="70" y="70" width="12" height="10" rx="2" fill="#0b3f2a" opacity="0.7" />
      {/* water */}
      <path d="M0 84 Q25 78 50 84 T100 82 V100 H0 Z" fill="#0d4451" opacity="0.8" />
    </svg>
  );
}

function formatNumber(v: number) {
  return v.toLocaleString("fa-IR");
}
