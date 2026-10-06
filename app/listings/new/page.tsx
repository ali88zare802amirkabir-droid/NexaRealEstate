"use client";

import { useState } from "react";
import { cn, formatMoney, formatNumber } from "@/lib/utils";
import { Badge, Button, Input, TextArea, Select } from "@/components/ui";
import { ChevronLeft, ChevronRight, Plus, Check, X } from "lucide-react";
import { useApp } from "@/lib/store";
import type { Property, PropertyStatus } from "@/lib/types";

const STEPS = ["اطلاعات پایه", "ویژگی‌ها", "نقشه", "مشاهده", "بررسی"] as const;
const PURPOSES = ["Buy", "Rent"] as const;
const TYPES = ["آپارتمان", "ویلا", "خانه ویلایی", "پنت‌هاوس", "زمین", "تجاری"] as const;
const PURPOSE_LABELS: Record<string, string> = { Buy: "خرید", Rent: "اجاره" };
const TYPE_LABELS: Record<string, string> = { "آپارتمان": "آپارتمان", "ویلا": "ویلا", "خانه ویلایی": "خانه ویلایی", "پنت‌هاوس": "پنت‌هاوس", "زمین": "زمین", "تجاری": "تجاری" };
const CITIES = ["تهران", "مشهد", "اصفهان", "شیراز", "تبریز", "کرمانشاه", "رشت", "یزد"];

export default function AddPropertyPage() {
  const { areas } = useApp();
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    title: "",
    price: "",
    city: "",
    area: "All",
    purpose: "Buy" as (typeof PURPOSES)[number],
    type: "آپارتمان" as (typeof TYPES)[number],
    beds: 3,
    baths: 2,
    area_size: 120,
    parking: 1,
    yearBuilt: 2015,
    floor: 5,
    status: "Active" as PropertyStatus,
    description: "",
    elevator: true,
    balcony: true,
    storage: true,
    security: false,
    ac: false,
    heating: true,
    furnished: false,
    address: "",
    landmark: "",
    mapX: 50,
    mapY: 50,
    imageCount: 6,
  });

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const update = (key: keyof typeof form, value: unknown) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = () => {
    // In real app, this would call the store/create property API
    const property: Property = {
      id: `prp-${Date.now().toString().slice(-5)}`,
      slug: `prp-${Date.now().toString(36)}`,
      title: form.title,
      type: form.type,
      purpose: form.purpose,
      price: Number(form.price) || 0,
      area: form.area_size,
      beds: form.beds,
      baths: form.baths,
      parking: form.parking,
      yearBuilt: form.yearBuilt,
      furnished: form.furnished,
      elevator: form.elevator,
      balcony: form.balcony,
      storage: form.storage,
      security: form.security,
      ac: form.ac,
      heating: form.heating,
      address: form.address,
      city: form.city,
      areaId: form.area === "All" ? (areas[0]?.id ?? "") : form.area,
      agentId: "agt-001",
      status: form.status,
      views: 0,
      favorites: 0,
      inquiries: 0,
      imageTone: Math.floor(Math.random() * 8),
      mapX: form.mapX,
      mapY: form.mapY,
      coords: `${form.mapX},${form.mapY}`,
      description: form.description,
      features: [
        form.elevator && "آسانسور",
        form.balcony && "بالکن",
        form.storage && "انباری",
        form.security && "سیستم امنیتی",
        form.ac && "کولر گازی",
        form.heating && "شوفاژ",
        form.furnished && "مبله",
      ].filter((f): f is string => Boolean(f)),
      nearby: form.landmark ? [form.landmark] : [],
      publishedAt: new Date().toISOString(),
      isMine: true,
    };
    alert(`ملک «${form.title}» (ID: ${property.id}) آماده ثبت است.\n\nنکته: در نسخه واقعی، اینجا به backend ارسال می‌شود.`);
    setStep(0);
    setForm({
      title: "",
      price: "",
      city: "",
      area: "All",
      purpose: "Buy",
      type: "آپارتمان",
      beds: 3,
      baths: 2,
      area_size: 120,
      parking: 1,
      yearBuilt: 2015,
      floor: 5,
    status: "Active" as PropertyStatus,
      description: "",
      elevator: true,
      balcony: true,
      storage: true,
      security: false,
      ac: false,
      heating: true,
      furnished: false,
      address: "",
      landmark: "",
      mapX: 50,
      mapY: 50,
      imageCount: 6,
    });
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="عنوان ملک *"
                placeholder="مثال: آپارتمان لوکس ۱۲۰ متری در سعادت‌آباد"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
              />
              <Input
                label="قیمت (تومان) *"
                placeholder="مثال: ۵۰۰۰۰۰۰۰۰۰۰"
                type="number"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
              />
              <Select
                label="کاربری *"
                value={form.purpose}
                onChange={(e) => update("purpose", e.target.value)}
              >
                {PURPOSES.map((p) => (
                  <option key={p} value={p}>{PURPOSE_LABELS[p]}</option>
                ))}
              </Select>
              <Select
                label="نوع ملک *"
                value={form.type}
                onChange={(e) => update("type", e.target.value)}
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>{TYPE_LABELS[t]}</option>
                ))}
              </Select>
              <Input
                label="شهر *"
                placeholder="مثال: تهران"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
              <Select
                label="منطقه"
                value={form.area}
                onChange={(e) => update("area", e.target.value)}
              >
                <option value="All">همه</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Input label="خواب" type="number" min={1} value={form.beds} onChange={(e) => update("beds", Number(e.target.value))} />
              <Input label="سرویس" type="number" min={1} value={form.baths} onChange={(e) => update("baths", Number(e.target.value))} />
              <Input label="متراژ (متر)" type="number" min={1} value={form.area_size} onChange={(e) => update("area_size", Number(e.target.value))} />
              <Input label="پارکینگ" type="number" min={0} value={form.parking} onChange={(e) => update("parking", Number(e.target.value))} />
              <Input label="سال ساخت" type="number" min={1000} value={form.yearBuilt} onChange={(e) => update("yearBuilt", Number(e.target.value))} />
              <Input label="طبقه" type="number" min={-1} value={form.floor} onChange={(e) => update("floor", Number(e.target.value))} />
            </div>

            <div className="rounded-xl border border-edge bg-surface-2 p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[12.5px] font-bold text-ink">وضعیت انتشار</label>
                <Badge tone={form.status === "Active" ? "accent" : "default"} size="xs">
                  {form.status === "Active" ? "فعال" : "پیش‌نویس"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => update("status", "Active")}
                  className={cn(
                    "focusable flex-1 rounded-lg border py-2 text-center text-[12px] font-medium transition-colors",
                    form.status === "Active" ? "border-accent bg-accent/10 text-accent" : "border-edge text-ink-3 hover:bg-surface-2",
                  )}
                >
                  انتشار عمومی
                </button>
                <button
                  type="button"
                  onClick={() => update("status", "Pending")}
                  className={cn(
                    "focusable flex-1 rounded-lg border py-2 text-center text-[12px] font-medium transition-colors",
                    form.status === "Pending" ? "border-accent bg-accent/10 text-accent" : "border-edge text-ink-3 hover:bg-surface-2",
                  )}
                >
                  در انتظار بررسی
                </button>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-[12.5px] font-bold text-ink">توضیحات ملک *</label>
              <TextArea
                placeholder="توضیحاتی درباره ملک بنویسید (آدرس دقیق، امکانات، ویژگی‌ها و...)"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2.5 block text-[12.5px] font-bold text-ink">امکانات</label>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { key: "elevator", label: "آسانسور" },
                  { key: "balcony", label: "بالکن" },
                  { key: "storage", label: "انباری" },
                  { key: "security", label: "سیستم امنیتی" },
                  { key: "ac", label: "کولر گازی/اسپیلت" },
                  { key: "heating", label: "شوفاژ/بخاری" },
                  { key: "furnished", label: "مبله" },
                ].map((f) => (
                  <label key={f.key} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-edge bg-surface-2 p-2.5 transition-colors hover:border-accent/50">
                    <div className={cn("size-5 shrink-0 rounded border-2 flex items-center justify-center", form[f.key as keyof typeof form] ? "border-accent bg-accent" : "border-edge bg-white")} style={{ backgroundColor: form[f.key as keyof typeof form] ? "#155e75" : undefined }}>
                      {form[f.key as keyof typeof form] ? <Check className="size-3.5 text-white" /> : null}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={!!form[f.key as keyof typeof form]}
                      onChange={(e) => update(f.key as keyof typeof form, e.target.checked)}
                    />
                    <span className="text-[12.5px] font-medium text-ink">{f.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-2.5 block text-[12.5px] font-bold text-ink">آدرس دقیق *</label>
              <Input
                placeholder="نام خیابان، کوچه، پلاک و مشخصات..."
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2.5 block text-[12.5px] font-bold text-ink">نقطه عطف / دسترسی</label>
              <Input
                placeholder="نزدیک به... / دسترسی به... / نماد..."
                value={form.landmark}
                onChange={(e) => update("landmark", e.target.value)}
              />
            </div>
            <div className="rounded-xl border border-edge bg-surface-2 p-4">
              <p className="mb-3 text-[12px] text-ink-3">
                مختصات نقشه به صورت درصدی تنظیم می‌شود. در نسخه واقعی، نقشه گوگل یا OpenStreetMap لود می‌شود و کاربر می‌تواند مارکر را بکشد.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="مختصات X (0-100)" type="number" min={0} max={100} value={form.mapX} onChange={(e) => update("mapX", Math.min(100, Math.max(0, Number(e.target.value))))} />
                <Input label="مختصات Y (0-100)" type="number" min={0} max={100} value={form.mapY} onChange={(e) => update("mapY", Math.min(100, Math.max(0, Number(e.target.value))))} />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <label className="mb-2.5 block text-[12.5px] font-bold text-ink">تصاویر ملک</label>
            <div className="grid gap-3 sm:grid-cols-3">
              {Array.from({ length: form.imageCount }).map((_, i) => (
                <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-edge">
                  <div className="absolute inset-0 flex items-center justify-center bg-surface-2">
                    <Plus className="size-6 text-ink-3" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    aria-label={`تصویر ${i + 1}`}
                  />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-ink-3">
              حداقل {form.imageCount} تصویر بارگذاری کنید. فرمت‌های JPEG/PNG پشتیبانی می‌شوند.
            </p>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="rounded-xl border border-edge bg-surface-2 p-4">
              <div className="mb-3 flex items-center justify-between border-b border-edge pb-3">
                <span className="text-[12px] font-bold text-ink">{form.title || "عنوان ملک"}</span>
                <Badge tone="default" size="xs">ID: demo-{Date.now().toString().slice(-4)}</Badge>
              </div>
              <dl className="grid gap-3 text-[12.5px]">
                <div className="flex justify-between">
                  <dt className="text-ink-3">کاربری</dt>
                  <dd className="font-semibold text-ink">{PURPOSE_LABELS[form.purpose]}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-3">نوع ملک</dt>
                  <dd className="font-semibold text-ink">{TYPE_LABELS[form.type]}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-3">قیمت</dt>
                  <dd className="font-semibold text-ink">{formatMoney(Number(form.price) || 0)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-3">شهر / منطقه</dt>
                  <dd className="font-semibold text-ink">
                    {form.city || "—"} / {form.area === "All" ? "همه" : form.area}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-3">مشخصات</dt>
                  <dd className="font-semibold text-ink">
                    {form.beds} خواب · {form.baths} سرویس · {form.area_size} متر · {form.parking} پارکینگ
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-3">امکانات</dt>
                  <dd className="font-semibold text-ink">
                    {[
                      form.elevator && "آسانسور",
                      form.balcony && "بالکن",
                      form.storage && "انباری",
                      form.security && "امنیت",
                      form.ac && "کولر",
                      form.heating && "گرمایش",
                      form.furnished && "مبله",
                    ].filter(Boolean).join(", ") || "—"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-edge bg-surface-2 p-3">
              <Check className="size-4 text-ok" />
              <p className="text-[11px] text-ink-3">
                تمام فیلدها با ستاره (*) اجباری هستند. پس از ثبت، ملک شما {form.status === "Active" ? "به صورت عمومی نمایش داده می‌شود" : "در وضعیت پیش‌نویس قرار می‌گیرد"}.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-edge pb-3">
        <div>
          <h1 className="text-[20px] font-extrabold text-ink">افزودن ملک جدید</h1>
          <p className="text-[12.5px] text-ink-3">
            {step + 1} از {STEPS.length} — {STEPS[step]}
          </p>
        </div>
        <Button size="xs" variant="ghost" onClick={() => setStep(0)}>
          <X className="size-3.5" />
          خروج
        </Button>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-[11px] font-bold transition-all",
                  i < step ? "bg-accent text-white scale-110" : i === step ? "ring-2 ring-accent bg-surface-2 text-ink scale-105" : "bg-edge text-ink-3",
                )}
              >
                {i < step ? <Check className="size-4" /> : i + 1}
              </span>
              <span className={cn("mt-1 text-[9px]", i === step ? "font-bold text-ink" : "text-ink-3")}>{s}</span>
            </div>
            {i < STEPS.length - 1 ? <span className={cn("mx-1 h-px flex-1", i < step ? "bg-accent" : "bg-edge/50")} /> : null}
          </div>
        ))}
      </div>

      <div className="panel min-h-80">{renderStep()}</div>

      <div className="flex items-center justify-between gap-2 pt-2">
        <Button size="sm" variant="ghost" onClick={prev} disabled={step === 0}>
          <ChevronRight className="size-3.5" />
          قبلی
        </Button>
        {step < STEPS.length - 1 ? (
          <Button size="sm" variant="primary" onClick={next}>
            بعدی
            <ChevronLeft className="size-3.5" />
          </Button>
        ) : (
          <Button size="sm" variant="primary" onClick={handleSubmit}>
            ثبت ملک
          </Button>
        )}
      </div>
    </div>
  );
}