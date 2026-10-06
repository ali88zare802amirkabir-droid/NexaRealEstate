"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  actions,
  breadcrumb,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {breadcrumb?.length ? (
          <nav aria-label="مسیر" className="mb-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-ink-3">
            {breadcrumb.map((b, i) => (
              <span key={b.label} className="flex items-center gap-1.5">
                {i > 0 ? <span aria-hidden="true">/</span> : null}
                {b.href ? (
                  <a href={b.href} className="transition-colors hover:text-accent">
                    {b.label}
                  </a>
                ) : (
                  <span className="text-ink-2">{b.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        <h1 className="truncate text-xl font-extrabold tracking-tight text-ink sm:text-[22px]">{title}</h1>
        {subtitle ? <p className="mt-1 text-[12.5px] text-ink-3">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function Toolbar({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-wrap items-center gap-2", className)}>{children}</div>;
}

export function StatCard({
  label,
  value,
  hint,
  tone = "accent",
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "accent" | "ok" | "warn" | "danger" | "cyan" | "violet";
  icon?: ReactNode;
}) {
  const ring: Record<string, string> = {
    accent: "text-accent bg-accent/12",
    ok: "text-ok bg-ok/12",
    warn: "text-warn bg-warn/12",
    danger: "text-danger bg-danger/12",
    cyan: "text-cyan bg-cyan/12",
    violet: "text-violet bg-violet/12",
  };

  return (
    <article className="panel p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[11.5px] text-ink-3">{label}</p>
          <p className="mt-1 truncate text-lg font-extrabold text-ink">{value}</p>
          {hint ? <p className="mt-0.5 truncate text-[11px] text-ink-3">{hint}</p> : null}
        </div>
        {icon ? <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", ring[tone])}>{icon}</span> : null}
      </div>
    </article>
  );
}
