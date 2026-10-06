"use client";

import { useMemo, useState } from "react";
import { cn, formatDate, formatMoney, formatNumber, VIEWING_TYPE_LABELS } from "@/lib/utils";
import { PropertyImage } from "./property-image";
import { Avatar, Badge, Button, Input, Select } from "@/components/ui";
import { CheckCircle2, ChevronLeft, ChevronRight, CalendarDays, Clock, Video, Phone, MapPin } from "lucide-react";
import type { Property, Viewing, ViewingType } from "@/lib/types";

const STEPS = ["تاریخ", "ساعت", "نوع بازدید", "اطلاعات تماس", "بررسی و ثبت"] as const;
const TIMES = ["۰۹:۰۰", "۱۰:۰۰", "۱۱:۰۰", "۱۲:۰۰", "۱۴:۰۰", "۱۵:۰۰", "۱۶:۰۰", "۱۷:۰۰", "۱۸:۰۰"];
const TYPES: ViewingType[] = ["حضوری", "مجازی", "تلفنی"];

export function ViewingFlow({
  property,
  agentName,
  agentColor,
  open,
  onClose,
  onSubmit,
}: {
  property: Property;
  agentName: string;
  agentColor: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (viewing: Viewing) => void;
}) {
  const [step, setStep] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<ViewingType>("حضوری");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState<Viewing | null>(null);

  const dates = useMemo(() => {
    const out: string[] = [];
    const base = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      out.push(d.toISOString().slice(0, 10));
    }
    return out;
  }, []);

  if (!open) return null;

  const canNext = () => {
    if (step === 0) return Boolean(date);
    if (step === 1) return Boolean(time);
    if (step === 2) return Boolean(type);
    if (step === 3) return name.trim().length > 1 && phone.trim().length >= 10;
    return true;
  };

  const next = () => {
    if (!canNext()) {
      setError(step === 0 ? "لطفاً تاریخ بازدید را انتخاب کنید." : step === 1 ? "لطفاً ساعت بازدید را انتخاب کنید." : step === 3 ? "نام و شماره تماس معتبر وارد کنید." : "");
      return;
    }
    setError("");
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const submit = () => {
    const viewing: Viewing = {
      id: `vwg-${Date.now().toString().slice(-5)}`,
      propertyId: property.id,
      customerId: "cus-001",
      agentId: property.agentId,
      date,
      time,
      type,
      status: "Scheduled",
      note,
      createdAt: new Date().toISOString(),
    };
    setDone(viewing);
    onSubmit(viewing);
  };

  const reset = () => {
    setStep(0);
    setDate("");
    setTime("");
    setType("حضوری");
    setName("");
    setPhone("");
    setNote("");
    setError("");
    setDone(null);
  };

  const close = () => {
    onClose();
    window.setTimeout(reset, 200);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center bg-black/60 backdrop-blur-[2px] sm:items-center sm:p-4" onMouseDown={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="درخواست بازدید"
        className="flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-edge bg-surface shadow-elevated sm:rounded-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-edge px-5 py-3.5">
          <div>
            <h2 className="text-sm font-bold text-ink">درخواست بازدید</h2>
            <p className="mt-0.5 truncate text-[11.5px] text-ink-3">{property.title}</p>
          </div>
          <button onClick={close} aria-label="بستن" className="focusable rounded-lg p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink">
            <ChevronLeft className="size-4" />
          </button>
        </header>

        {done ? (
          <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-ok/15 text-ok">
              <CheckCircle2 className="size-8" />
            </span>
            <div>
              <h3 className="text-[15px] font-extrabold text-ink">درخواست بازدید ثبت شد</h3>
              <p className="mt-1 text-[12.5px] text-ink-3">مشاور به‌زودی برای هماهنگی نهایی با شما تماس می‌گیرد.</p>
            </div>
            <div className="w-full space-y-2 rounded-xl border border-edge bg-surface-2 p-4 text-start">
              <Row label="شناسه بازدید" value={<span className="font-mono text-cyan">{done.id}</span>} />
              <Row label="ملک" value={property.title} />
              <Row label="تاریخ" value={formatDate(done.date)} />
              <Row label="ساعت" value={done.time} />
              <Row label="نوع" value={VIEWING_TYPE_LABELS[done.type]} />
              <Row label="مشاور" value={agentName} />
            </div>
            <Button variant="primary" className="w-full" onClick={close}>
              بستن
            </Button>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="border-b border-edge px-5 py-3">
              <div className="flex items-center justify-between">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={cn(
                          "flex size-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                          i < step ? "bg-ok text-white" : i === step ? "bg-accent text-white" : "bg-surface-2 text-ink-3",
                        )}
                      >
                        {i < step ? <CheckCircle2 className="size-3.5" /> : i + 1}
                      </span>
                      <span className={cn("text-[9.5px]", i === step ? "font-bold text-ink" : "text-ink-3")}>{s}</span>
                    </div>
                    {i < STEPS.length - 1 ? <span className={cn("mx-1 h-px flex-1", i < step ? "bg-ok" : "bg-edge")} /> : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {/* Step 0: date */}
              {step === 0 ? (
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-[13px] font-bold text-ink">
                    <CalendarDays className="size-4 text-accent" />
                    تاریخ بازدید
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {dates.map((d) => {
                      const dt = new Date(d);
                      const activeDate = date === d;
                      return (
                        <button
                          key={d}
                          onClick={() => setDate(d)}
                          aria-pressed={activeDate}
                          className={cn(
                            "focusable flex flex-col items-center rounded-xl border py-2.5 transition-colors",
                            activeDate ? "border-accent bg-accent/10 text-accent" : "border-edge text-ink-2 hover:bg-surface-2",
                          )}
                        >
                          <span className="text-[10px] text-ink-3">{dt.toLocaleDateString("fa-IR", { weekday: "short" })}</span>
                          <span className="mt-0.5 text-[15px] font-extrabold">{dt.toLocaleDateString("fa-IR", { day: "numeric" })}</span>
                          <span className="text-[10px] text-ink-3">{dt.toLocaleDateString("fa-IR", { month: "short" })}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* Step 1: time */}
              {step === 1 ? (
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-[13px] font-bold text-ink">
                    <Clock className="size-4 text-accent" />
                    ساعت بازدید
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {TIMES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTime(t)}
                        aria-pressed={time === t}
                        className={cn(
                          "focusable rounded-xl border py-2.5 text-[12.5px] font-semibold transition-colors",
                          time === t ? "border-accent bg-accent/10 text-accent" : "border-edge text-ink-2 hover:bg-surface-2",
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Step 2: type */}
              {step === 2 ? (
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-[13px] font-bold text-ink">نوع بازدید</h3>
                  <div className="grid gap-2">
                    {TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        aria-pressed={type === t}
                        className={cn(
                          "focusable flex items-center gap-3 rounded-xl border p-3 text-start transition-colors",
                          type === t ? "border-accent bg-accent/10" : "border-edge hover:bg-surface-2",
                        )}
                      >
                        <span className={cn("flex size-9 items-center justify-center rounded-lg", type === t ? "bg-accent/15 text-accent" : "bg-surface-2 text-ink-3")}>
                          {t === "حضوری" ? <MapPin className="size-4" /> : t === "مجازی" ? <Video className="size-4" /> : <Phone className="size-4" />}
                        </span>
                        <span>
                          <span className="block text-[12.5px] font-bold text-ink">{t}</span>
                          <span className="block text-[11px] text-ink-3">
                            {t === "حضوری" ? "حضور در محل ملک" : t === "مجازی" ? "بازدید آنلاین با ویدیو" : "مشاوره تلفنی با مشاور"}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Step 3: contact */}
              {step === 3 ? (
                <div className="space-y-3">
                  <h3 className="text-[13px] font-bold text-ink">اطلاعات تماس</h3>
                  <Input label="نام و نام خانوادگی *" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً علی محمدی" />
                  <Input label="شماره تماس *" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09123456789" inputMode="tel" hint="مشاور از این طریق با شما تماس می‌گیرد." />
                  <Input label="توضیح (اختیاری)" value={note} onChange={(e) => setNote(e.target.value)} placeholder="مثلاً ساعت ۱۶ بهتر است…" />
                </div>
              ) : null}

              {/* Step 4: review */}
              {step === 4 ? (
                <div className="space-y-3">
                  <h3 className="text-[13px] font-bold text-ink">بررسی و ثبت</h3>
                  <div className="overflow-hidden rounded-xl border border-edge">
                    <PropertyImage tone={property.imageTone} type={property.type as "apartment"} label="" className="aspect-[16/8] w-full" />
                    <div className="space-y-2 p-3">
                      <p className="truncate text-[12.5px] font-bold text-ink">{property.title}</p>
                      <p className="text-[11.5px] text-ink-3">{property.address}</p>
                      <div className="flex items-center justify-between border-t border-edge pt-2">
                        <span className="text-[13px] font-extrabold text-accent">{formatMoney(property.price)}</span>
                        <Badge tone={property.purpose === "Buy" ? "accent" : "cyan"} size="xs">
                          {property.purpose === "Buy" ? "خرید" : "اجاره"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <dl className="space-y-1.5 rounded-xl border border-edge bg-surface-2 p-3 text-[12px]">
                    <div className="flex justify-between"><dt className="text-ink-3">تاریخ</dt><dd className="font-semibold text-ink">{formatDate(date)}</dd></div>
                    <div className="flex justify-between"><dt className="text-ink-3">ساعت</dt><dd className="font-semibold text-ink">{time}</dd></div>
                    <div className="flex justify-between"><dt className="text-ink-3">نوع</dt><dd className="font-semibold text-ink">{VIEWING_TYPE_LABELS[type]}</dd></div>
                    <div className="flex justify-between"><dt className="text-ink-3">نام</dt><dd className="font-semibold text-ink">{name}</dd></div>
                    <div className="flex justify-between"><dt className="text-ink-3">تماس</dt><dd className="font-mono font-semibold text-ink" dir="ltr">{phone}</dd></div>
                    {note ? <div className="flex justify-between"><dt className="text-ink-3">توضیح</dt><dd className="font-semibold text-ink">{note}</dd></div> : null}
                  </dl>
                  <div className="flex items-center gap-2 rounded-xl border border-edge bg-surface-2 p-3">
                    <Avatar name={agentName} color={agentColor} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-bold text-ink">{agentName}</p>
                      <p className="text-[11px] text-ink-3">مشاور ملک — پاسخگویی در {formatNumber(2)} ساعت</p>
                    </div>
                  </div>
                </div>
              ) : null}

              {error ? (
                <p role="alert" className="mt-3 text-[12px] text-danger">
                  {error}
                </p>
              ) : null}
            </div>

            <footer className="flex items-center justify-between gap-2 border-t border-edge px-5 py-3">
              <Button size="sm" variant="ghost" onClick={() => (step === 0 ? close() : setStep(step - 1))}>
                <ChevronRight className="size-3.5" />
                {step === 0 ? "انصراف" : "قبلی"}
              </Button>
              {step < STEPS.length - 1 ? (
                <Button size="sm" variant="primary" onClick={next}>
                  مرحله بعد
                  <ChevronLeft className="size-3.5" />
                </Button>
              ) : (
                <Button size="sm" variant="primary" onClick={submit}>
                  ثبت درخواست بازدید
                </Button>
              )}
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-ink-3">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  );
}
