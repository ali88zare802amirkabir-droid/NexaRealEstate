"use client";

import Link from "next/link";
import { Heart, MapPin, BedDouble, Bath, Car, GitCompareArrows, Eye } from "lucide-react";
import { cn, formatArea, formatMoney, formatNumber, PURPOSE_LABELS, statusVariant } from "@/lib/utils";
import { PropertyImage } from "./property-image";
import { Badge, IconButton, Rating } from "@/components/ui";
import { useApp } from "@/lib/store";
import type { Property } from "@/lib/types";

export function PropertyCard({ property, compact }: { property: Property; compact?: boolean }) {
  const { isFavorite, isComparing, toggleFavorite, toggleCompare, agentById } = useApp();
  const fav = isFavorite(property.id);
  const comparing = isComparing(property.id);
  const agent = agentById(property.agentId);

  return (
    <article className="group panel flex flex-col overflow-hidden p-0 transition-shadow duration-150 hover:shadow-card-hover">
      <div className="relative">
        <Link href={`/properties/${property.id}`} className="block" aria-label={property.title}>
          <PropertyImage tone={property.imageTone} type={property.type as "apartment"} className={cn("block w-full", compact ? "aspect-[16/10]" : "aspect-[16/11]")} />
        </Link>

        <div className="absolute start-2.5 top-2.5 flex flex-col items-start gap-1.5">
          <Badge tone={property.purpose === "Buy" ? "accent" : "cyan"} size="xs">
            {PURPOSE_LABELS[property.purpose]}
          </Badge>
          {property.status !== "Active" ? (
            <Badge tone={statusVariant(property.status)} size="xs">
              {property.status === "Sold" ? "فروخته شده" : property.status === "Rented" ? "اجاره داده شده" : property.status === "Pending" ? "در انتظار" : "پیش‌نویس"}
            </Badge>
          ) : null}
        </div>

        <div className="absolute end-2.5 top-2.5 flex flex-col gap-1.5">
          <button
            onClick={() => toggleFavorite(property.id)}
            aria-label={fav ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
            aria-pressed={fav}
            className={cn(
              "focusable flex size-8 items-center justify-center rounded-lg border backdrop-blur transition-colors",
              fav ? "border-danger/40 bg-danger/15 text-danger" : "border-edge bg-surface/85 text-ink-2 hover:text-ink",
            )}
          >
            <Heart className={cn("size-4", fav && "fill-current")} />
          </button>
          <button
            onClick={() => toggleCompare(property.id)}
            aria-label={comparing ? "حذف از مقایسه" : "افزودن به مقایسه"}
            aria-pressed={comparing}
            className={cn(
              "focusable flex size-8 items-center justify-center rounded-lg border backdrop-blur transition-colors",
              comparing ? "border-accent/40 bg-accent/15 text-accent" : "border-edge bg-surface/85 text-ink-2 hover:text-ink",
            )}
          >
            <GitCompareArrows className="size-4" />
          </button>
        </div>

        <div className="absolute bottom-2.5 start-2.5">
          <span className="inline-flex items-center gap-1 rounded-lg bg-black/55 px-2 py-1 text-[11px] font-bold text-white backdrop-blur">
            <Eye className="size-3" />
            {formatNumber(property.views)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link href={`/properties/${property.id}`} className="line-clamp-1 text-[13.5px] font-bold text-ink hover:text-accent">
              {property.title}
            </Link>
          </div>
          <p className="mt-1 flex items-center gap-1 truncate text-[11.5px] text-ink-3">
            <MapPin className="size-3 shrink-0" />
            {property.address}
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11.5px] text-ink-2">
          <span className="flex items-center gap-1">
            <BedDouble className="size-3.5 text-ink-3" />
            {property.beds > 0 ? formatNumber(property.beds) : "—"}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="size-3.5 text-ink-3" />
            {formatNumber(property.baths)}
          </span>
          <span className="flex items-center gap-1">
            <Car className="size-3.5 text-ink-3" />
            {property.parking > 0 ? formatNumber(property.parking) : "—"}
          </span>
          <span className="ms-auto text-[11px] text-ink-3">{formatArea(property.area)}</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-edge pt-2.5">
          <div>
            <p className="text-[15px] font-extrabold text-ink">{formatMoney(property.price)}</p>
            {property.purpose === "Rent" ? <p className="text-[10px] text-ink-3">اجاره ماهانه</p> : null}
          </div>
          {agent ? (
            <div className="flex items-center gap-1.5">
              <Rating value={agent.rating} size="xs" />
              <span className="max-w-20 truncate text-[10.5px] text-ink-3">{agent.name}</span>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
