"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MapView } from "@/components/map-view";
import { PropertyCard } from "@/components/property-card";
import { Heart, GitCompareArrows } from "lucide-react";
import { useApp } from "@/lib/store";

export default function MapPage() {
  const { properties, isFavorite, toggleFavorite, isComparing, toggleCompare } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string | null) => {
    setSelectedId(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-edge pb-3">
        <h1 className="text-[20px] font-extrabold text-ink">نقشه املاک</h1>
        <p className="text-[12.5px] text-ink-3">
          {properties.length} ملک روی نقشه — برای دیدن جزئیات، روی مارکرها کلیک کنید
        </p>
      </div>

      <MapView
        properties={properties}
        selectedId={selectedId}
        onSelect={handleSelect}
        height="h-[520px]"
      />

      {selectedId ? (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-bold text-ink">ملک انتخاب‌شده</h2>
            <button onClick={() => setSelectedId(null)} className="text-[12px] text-ink-3 hover:text-accent">
              очитка
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
            <PropertyCard property={properties.find((p) => p.id === selectedId)!} compact={false} />
            <div className="space-y-4">
              <div className="panel">
                <h3 className="mb-3 text-[13px] font-bold text-ink">ابزارها</h3>
                <div className="grid gap-2">
                  <button
                    onClick={() => toggleFavorite(selectedId!)}
                    className={cn(
                      "focusable flex items-center justify-center gap-1.5 rounded-lg border py-2 text-[12px] font-medium transition-colors",
                      isFavorite(selectedId!) ? "border-danger/40 bg-danger/10 text-danger" : "border-edge text-ink-2 hover:bg-surface-2",
                    )}
                  >
                    <Heart className={cn("size-4", isFavorite(selectedId!) && "fill-current")} />
                    {isFavorite(selectedId!) ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
                  </button>
                  <button
                    onClick={() => toggleCompare(selectedId!)}
                    className={cn(
                      "focusable flex items-center justify-center gap-1.5 rounded-lg border py-2 text-[12px] font-medium transition-colors",
                      isComparing(selectedId!) ? "border-accent/40 bg-accent/10 text-accent" : "border-edge text-ink-2 hover:bg-surface-2",
                    )}
                  >
                    <GitCompareArrows className="size-4" />
                    {isComparing(selectedId!) ? "حذف از مقایسه" : "افزودن به مقایسه"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
