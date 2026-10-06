"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Gallery } from "@/components/gallery";
import { PropertyCard } from "@/components/property-card";
import { ViewingFlow } from "@/components/viewing-flow";
import { Badge, Button, Avatar, Rating, EmptyState } from "@/components/ui";
import {
  Heart, GitCompareArrows, MapPin, BedDouble, Bath, Car, Square,
  Share2, ChevronRight, CalendarDays, Video, Phone, ShieldCheck,
  Building2, Clock, Eye, CheckCircle2, X,
} from "lucide-react";
import { cn, formatArea, formatMoney, formatNumber, PURPOSE_LABELS, statusVariant, formatRelative } from "@/lib/utils";
import { useApp } from "@/lib/store";
import type { Viewing } from "@/lib/types";

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { propertyById, agentById, areas, properties, isFavorite, isComparing, toggleFavorite, toggleCompare, viewings, requestViewing, customerById, reviews } = useApp();
  const [viewingOpen, setViewingOpen] = useState(false);
  const [featured, setFeatured] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("nexa-realestate:featured") ?? "[]");
    } catch {
      return [];
    }
  });

  const property = propertyById(params.id);

  if (!property) {
    return (
      <EmptyState
        icon={<Building2 className="size-6" />}
        title="ملک پیدا نشد"
        description="این ملک وجود ندارد یا حذف شده است."
        action={
          <Button size="sm" variant="primary" onClick={() => router.push("/properties")}>
            بازگشت به املاک
          </Button>
        }
      />
    );
  }

  const agent = agentById(property.agentId);
  const area = areas.find((a) => a.id === property.areaId);
  const fav = isFavorite(property.id);
  const comparing = isComparing(property.id);
  const similar = properties.filter((p) => p.id !== property.id && p.areaId === property.areaId && p.status === "Active").slice(0, 6);
  const propertyViewings = viewings.filter((v) => v.propertyId === property.id);
  const customer = customerById("cus-001");
  const agentReviewCount = agent ? reviews.filter((r) => r.agentId === agent.id).length : 0;

  const features = [
    { label: "آسانسور", value: property.elevator, Icon: Building2 },
    { label: "بالکن", value: property.balcony, Icon: ShieldCheck },
    { label: "انباری", value: property.storage, Icon: Square },
    { label: "تهویه", value: property.ac, Icon: Clock },
    { label: "شوفاژ مرکزی", value: property.heating, Icon: CheckCircle2 },
    { label: "مبله", value: property.furnished, Icon: X },
  ];

  const toggleFeatured = (id: string) => {
    const next = featured.includes(id) ? featured.filter((f: string) => f !== id) : [...featured, id];
    setFeatured(next);
    try {
      localStorage.setItem("nexa-realestate:featured", JSON.stringify(next));
    } catch {}
  };

  const handleViewingSubmit = (viewing: Viewing) => {
    requestViewing(viewing);
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[11.5px] text-ink-3">
        <button onClick={() => router.push("/")} className="hover:text-ink">خانه</button>
        <ChevronLeft className="size-3" />
        <button onClick={() => router.push("/properties")} className="hover:text-ink">املاک</button>
        <ChevronLeft className="size-3" />
        <span className="text-ink">{property.title}</span>
      </nav>

      {/* Header */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {/* Gallery */}
          <Gallery
            tone={property.imageTone}
            type={property.type as "apartment"}
            title={property.title}
            count={6}
          />

          {/* Info */}
          <div className="panel space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[20px] font-extrabold text-ink">{property.title}</h1>
                  <Badge tone={property.purpose === "Buy" ? "accent" : "cyan"}>
                    {PURPOSE_LABELS[property.purpose]}
                  </Badge>
                  {property.status !== "Active" ? (
                    <Badge tone={statusVariant(property.status)}>
                      {property.status === "Sold" ? "فروخته شده" : property.status === "Rented" ? "اجاره داده شده" : property.status === "Pending" ? "در انتظار" : "پیش‌نویس"}
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-ink-3">
                  <MapPin className="size-4" />
                  {property.address}
                  {area ? <span className="text-ink-3">— {area.name}</span> : null}
                </p>
              </div>
              <div className="text-end">
                <p className="text-[24px] font-extrabold text-ink">{formatMoney(property.price)}</p>
                {property.purpose === "Rent" ? <p className="text-[12px] text-ink-3">تومان / ماه</p> : <p className="text-[12px] text-ink-3">قیمت تمام‌شده</p>}
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "متراژ", value: formatArea(property.area), Icon: Square },
                { label: "خواب", value: property.beds > 0 ? formatNumber(property.beds) : "—", Icon: BedDouble },
                { label: "سرویس", value: formatNumber(property.baths), Icon: Bath },
                { label: "پارکینگ", value: property.parking > 0 ? formatNumber(property.parking) : "—", Icon: Car },
              ].map(({ label, value, Icon }) => (
                <div key={label} className="flex items-center gap-2.5 rounded-xl border border-edge bg-surface-2 p-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-surface text-ink-3">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-ink">{value}</p>
                    <p className="text-[11px] text-ink-3">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div>
              <h3 className="mb-3 text-[13px] font-bold text-ink">امکانات و ویژگی‌ها</h3>
              <div className="flex flex-wrap gap-2">
                {features.map(({ label, value, Icon }) => (
                  <div
                    key={label}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px]",
                      value ? "border-edge bg-surface-2 text-ink-2" : "border-edge/50 text-ink-3",
                    )}
                  >
                    <Icon className={cn("size-3.5", value ? "text-ok" : "text-ink-3")} />
                    {label}
                    {value ? <CheckCircle2 className="size-3 text-ok" /> : <X className="size-3 text-ink-3" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="mb-2 text-[13px] font-bold text-ink">توضیحات</h3>
              <p className="text-[13px] leading-7 text-ink-2">{property.description}</p>
            </div>

            {/* Property views */}
            <div className="flex flex-wrap items-center gap-4 border-t border-edge pt-4 text-[12px] text-ink-3">
              <span className="flex items-center gap-1"><Eye className="size-3.5" />{formatNumber(property.views)} بازدید</span>
              <span className="flex items-center gap-1"><Heart className="size-3.5" />{formatNumber(property.favorites)} علاقه‌مند</span>
              <span className="flex items-center gap-1"><Clock className="size-3.5" />افزوده شد {formatRelative(property.publishedAt)}</span>
              <span className="flex items-center gap-1"><CalendarDays className="size-3.5" />سال ساخت {formatNumber(property.yearBuilt)}</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Actions */}
          <div className="panel space-y-3">
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={() => setViewingOpen(true)}
              >
                <CalendarDays className="size-4" />
                درخواست بازدید
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => toggleFavorite(property.id)}
                className={cn(
                  "focusable flex items-center justify-center gap-1.5 rounded-lg border py-2 text-[12px] font-medium transition-colors",
                  fav ? "border-danger/40 bg-danger/10 text-danger" : "border-edge text-ink-2 hover:bg-surface-2",
                )}
              >
                <Heart className={cn("size-4", fav && "fill-current")} />
                {fav ? "در علاقه‌مندی‌ها" : "علاقه‌مندی"}
              </button>
              <button
                onClick={() => toggleCompare(property.id)}
                className={cn(
                  "focusable flex items-center justify-center gap-1.5 rounded-lg border py-2 text-[12px] font-medium transition-colors",
                  comparing ? "border-accent/40 bg-accent/10 text-accent" : "border-edge text-ink-2 hover:bg-surface-2",
                )}
              >
                <GitCompareArrows className="size-4" />
                {comparing ? "در مقایسه" : "مقایسه"}
              </button>
            </div>
            <Button variant="ghost" size="md" className="w-full">
              <Share2 className="size-4" />
              اشتراک‌گذاری
            </Button>
          </div>

          {/* Agent */}
          {agent ? (
            <div className="panel space-y-4">
              <div>
                <h3 className="mb-3 text-[13px] font-bold text-ink">مشاور ملک</h3>
                <button
                  onClick={() => router.push(`/agents/${agent.id}`)}
                  className="flex w-full items-center gap-3 text-start"
                >
                  <Avatar name={agent.name} color={agent.avatarColor} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-bold text-ink">{agent.name}</p>
                    <p className="text-[11.5px] text-ink-3">{agent.area} — {agent.city}</p>
                    <div className="mt-1 flex items-center gap-1">
                      <Rating value={agent.rating} size="xs" />
                      <span className="text-[11px] text-ink-3">({agentReviewCount} نظر)</span>
                    </div>
                  </div>
                  <span className="text-[12px] font-semibold text-accent">مشاهده</span>
                </button>
              </div>

              <div className="space-y-2 border-t border-edge pt-3">
                <a href={`tel:${agent.phone}`} className="focusable flex items-center gap-2.5 rounded-lg border border-edge bg-surface-2 p-2.5 transition-colors hover:bg-surface">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Phone className="size-4" />
                  </span>
                  <div>
                    <p className="text-[12.5px] font-bold text-ink">تماس تلفنی</p>
                    <p className="text-[11px] text-ink-3" dir="ltr">{agent.phone}</p>
                  </div>
                </a>
                <button className="focusable flex w-full items-center gap-2.5 rounded-lg border border-edge bg-surface-2 p-2.5 transition-colors hover:bg-surface">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
                    <Video className="size-4" />
                  </span>
                  <div>
                    <p className="text-[12.5px] font-bold text-ink">بازدید مجازی</p>
                    <p className="text-[11px] text-ink-3">ارائه‌دهی آنلاین</p>
                  </div>
                </button>
              </div>
            </div>
          ) : null}

          {/* Property stats */}
          <div className="panel">
            <h3 className="mb-3 text-[13px] font-bold text-ink">وضعیت ملک</h3>
            <dl className="space-y-2.5 text-[12.5px]">
              <div className="flex justify-between">
                <dt className="text-ink-3">وضعیت</dt>
                <dd>
                  <Badge tone={statusVariant(property.status)} size="xs">
                    {property.status === "Active" ? "فعال" : property.status === "Sold" ? "فروخته شده" : property.status === "Rented" ? "اجاره داده شده" : property.status === "Pending" ? "در انتظار" : "پیش‌نویس"}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-3">نوع</dt>
                <dd className="font-semibold text-ink">{property.type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-3">سال ساخت</dt>
                <dd className="font-semibold text-ink">{formatNumber(property.yearBuilt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-3">بازدید</dt>
                <dd className="font-semibold text-ink">{formatNumber(property.views)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-3">علاقه‌مندی‌ها</dt>
                <dd className="font-semibold text-ink">{formatNumber(property.favorites)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Similar properties */}
      {similar.length > 0 ? (
        <div className="panel space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-ink">املاک مشابه در {area?.name ?? "این منطقه"}</h2>
            <Button size="sm" variant="ghost" onClick={() => router.push(`/properties?area=${property.areaId}`)}>
              مشاهده همه
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      ) : null}

      {/* Viewing modal */}
      {agent ? (
        <ViewingFlow
          property={property}
          agentName={agent.name}
          agentColor={agent.avatarColor}
          open={viewingOpen}
          onClose={() => setViewingOpen(false)}
          onSubmit={handleViewingSubmit}
        />
      ) : null}
    </div>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
