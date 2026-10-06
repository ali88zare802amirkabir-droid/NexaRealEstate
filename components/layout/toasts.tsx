"use client";

import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";

export function Toasts() {
  const { toasts, dispatch } = useApp();
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 start-4 z-70 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2" role="region" aria-live="polite" aria-label="اعلان‌های سیستم">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cn("pointer-events-auto flex items-start gap-2.5 rounded-xl border border-edge bg-surface px-3.5 py-2.5 shadow-pop", "animate-[toastIn_.18s_ease-out]")}
        >
          <span className="mt-0.5 shrink-0">
            {t.variant === "success" ? <CheckCircle2 className="size-4 text-ok" /> : null}
            {t.variant === "danger" ? <XCircle className="size-4 text-danger" /> : null}
            {t.variant === "warning" ? <AlertTriangle className="size-4 text-warn" /> : null}
            {t.variant === "info" ? <Info className="size-4 text-accent" /> : null}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[12.5px] font-semibold text-ink">{t.title}</span>
            {t.description ? <span className="mt-0.5 block text-[11.5px] leading-5 text-ink-3">{t.description}</span> : null}
          </span>
          <button onClick={() => dispatch({ type: "DISMISS_TOAST", payload: t.id })} aria-label="بستن" className="focusable shrink-0 rounded p-0.5 text-ink-3 hover:bg-surface-2 hover:text-ink">
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
