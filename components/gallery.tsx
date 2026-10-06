"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PropertyImage } from "./property-image";
import { IconButton, Modal } from "@/components/ui";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

const VARIANTS = ["apartment", "villa", "penthouse", "land"] as const;

export function Gallery({
  tone,
  type,
  title,
  count = 5,
  className,
}: {
  tone: number;
  type: (typeof VARIANTS)[number];
  title: string;
  count?: number;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const images = Array.from({ length: count }, (_, i) => ({ tone: (tone + i) % 8, type, label: `${title} — تصویر ${i + 1}` }));

  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);
  const next = () => setActive((a) => (a + 1) % images.length);

  return (
    <div className={className}>
      <div className="group relative overflow-hidden rounded-xl border border-edge">
        <button onClick={() => setFullscreen(true)} className="block w-full" aria-label="مشاهده تمام‌صفحه">
          <PropertyImage tone={images[active].tone} type={images[active].type} label={images[active].label} className="aspect-[16/10] w-full" />
        </button>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-3">
          <span className="text-[11px] font-semibold text-white">
            {active + 1} / {images.length}
          </span>
          <div className="flex gap-1.5">
            <button onClick={prev} aria-label="تصویر قبلی" className="focusable flex size-7 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30">
              <ChevronRight className="size-4" />
            </button>
            <button onClick={next} aria-label="تصویر بعدی" className="focusable flex size-7 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30">
              <ChevronLeft className="size-4" />
            </button>
            <button onClick={() => setFullscreen(true)} aria-label="تمام‌صفحه" className="focusable flex size-7 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30">
              <Maximize2 className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`تصویر ${i + 1}`}
            aria-current={i === active}
            className={cn("focusable shrink-0 overflow-hidden rounded-lg border-2 transition-all", i === active ? "border-accent" : "border-transparent opacity-60 hover:opacity-100")}
          >
            <PropertyImage tone={img.tone} type={img.type} label="" className="aspect-[4/3] w-24" />
          </button>
        ))}
      </div>

      <Modal open={fullscreen} onClose={() => setFullscreen(false)} title={title} size="xl">
        <div className="relative">
          <PropertyImage tone={images[active].tone} type={images[active].type} label={images[active].label} className="aspect-[16/9] w-full rounded-xl" />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[12px] text-ink-3">
              {active + 1} از {images.length}
            </span>
            <div className="flex gap-2">
              <IconButton label="قبلی" onClick={prev}>
                <ChevronRight className="size-4" />
              </IconButton>
              <IconButton label="بعدی" onClick={next}>
                <ChevronLeft className="size-4" />
              </IconButton>
              <IconButton label="بستن" onClick={() => setFullscreen(false)}>
                <X className="size-4" />
              </IconButton>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
