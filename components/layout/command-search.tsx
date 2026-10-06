"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatMoney, formatNumber, cn } from "@/lib/utils";
import { Badge, EmptyState } from "@/components/ui";
import { useApp } from "@/lib/store";

interface Group {
  id: string;
  title: string;
  items: { href: string; title: string; meta: string }[];
}

export function CommandSearch() {
  const { searchOpen, setSearch, properties, agents, areas } = useApp();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch(true);
      }
      if (e.key === "Escape") setSearch(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setSearch]);

  useEffect(() => {
    if (!searchOpen) {
      setQuery("");
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [searchOpen]);

  const groups = useMemo<Group[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: Group[] = [];

    const propertyHits = properties
      .filter((p) => p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.type.includes(q))
      .slice(0, 5)
      .map((p) => ({ href: `/properties/${p.id}`, title: p.title, meta: `${p.type} · ${formatMoney(p.price, true)}` }));
    if (propertyHits.length) out.push({ id: "properties", title: "املاک", items: propertyHits });

    const agentHits = agents
      .filter((a) => a.name.toLowerCase().includes(q) || a.area.toLowerCase().includes(q) || a.city.toLowerCase().includes(q))
      .slice(0, 4)
      .map((a) => ({ href: `/agents/${a.id}`, title: a.name, meta: `مشاور · ${a.area}` }));
    if (agentHits.length) out.push({ id: "agents", title: "مشاوران", items: agentHits });

    const areaHits = areas
      .filter((a) => a.name.toLowerCase().includes(q) || a.city.toLowerCase().includes(q))
      .slice(0, 4)
      .map((a) => ({ href: `/map?area=${a.id}`, title: a.name, meta: `${a.city} · ${formatNumber(a.listings)} ملک` }));
    if (areaHits.length) out.push({ id: "areas", title: "مناطق", items: areaHits });

    return out;
  }, [query, properties, agents, areas]);

  if (!searchOpen) return null;

  const total = groups.reduce((s, g) => s + g.items.length, 0);

  return (
    <div className="fixed inset-0 z-60 flex items-start justify-center bg-black/55 px-4 pt-[8vh] backdrop-blur-[2px]" onMouseDown={() => setSearch(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="جستجوی سراسری"
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-edge bg-surface shadow-elevated"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-edge px-4">
          <svg className="size-4 shrink-0 text-ink-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="نام ملک، منطقه یا مشاور…"
            aria-label="عبارت جستجو"
            className="h-12 min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-3"
          />
          <kbd className="shrink-0 rounded border border-edge px-1.5 py-0.5 font-mono text-[10px] text-ink-3">Esc</kbd>
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {!query.trim() ? (
            <EmptyState compact title="جستجوی سراسری" description="برای شروع، نام ملک، منطقه یا مشاور را بنویسید." />
          ) : total === 0 ? (
            <EmptyState compact title="نتیجه‌ای یافت نشد" description={`برای «${query}» هیچ موردی پیدا نشد.`} />
          ) : (
            <div className="p-2">
              {groups.map((g) => (
                <section key={g.id} className="mb-1.5 last:mb-0">
                  <h3 className="px-2 py-1.5 text-[10.5px] font-bold uppercase tracking-wide text-ink-3">{g.title}</h3>
                  <ul>
                    {g.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setSearch(false)}
                          className="focusable flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-2"
                        >
                          <span className="truncate text-[12.5px] text-ink">{item.title}</span>
                          <span className="shrink-0 text-[11px] text-ink-3">{item.meta}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between border-t border-edge px-4 py-2 text-[10.5px] text-ink-3">
          <span>{formatNumber(total)} نتیجه</span>
          <span className="hidden sm:inline">برای بستن Esc را بزنید</span>
        </footer>
      </div>
    </div>
  );
}
