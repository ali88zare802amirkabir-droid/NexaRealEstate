"use client";

import { useApp } from "@/lib/store";
import { PropertyCard } from "@/components/property-card";
import { Comparison } from "@/components/comparison";
import { Badge, Button, EmptyState } from "@/components/ui";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const { favorites, properties, toggleFavorite, toggleCompare, clearComparison, isComparing } = useApp();
  const favProperties = properties.filter((p) => favorites.includes(p.id));
  const compared = favProperties.filter((p) => isComparing(p.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-edge pb-3">
        <h1 className="text-[20px] font-extrabold text-ink">علاقه‌مندی‌های من</h1>
        <Badge tone="accent" size="xs">
          {favProperties.length}
        </Badge>
      </div>

      {favProperties.length === 0 ? (
        <EmptyState
          icon={<Heart className="size-6" />}
          title="هنوز علاقه‌مندی ندارید"
          description="از صفحه املاک، روی قلب ملکی بزنید تا به علاقه‌مندی‌های شما اضافه شود."
        />
      ) : (
        <>
          {compared.length > 0 ? (
            <div className="panel space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-ink">مقایسه ملکی‌ها</h2>
                <Button size="xs" variant="ghost" onClick={clearComparison}>
                  پاک کردن مقایسه
                </Button>
              </div>
              <Comparison
                properties={compared}
                onRemove={(id) => toggleCompare(id)}
                onClear={clearComparison}
                onBrowse={() => {}}
              />
            </div>
          ) : null}

          <div>
            <h2 className="text-[15px] font-bold text-ink">املاک مورد علاقه</h2>
            <p className="text-[12px] text-ink-3 mb-4">
              {favProperties.length} ملک در لیست علاقه‌مندی‌های شما
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {favProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
