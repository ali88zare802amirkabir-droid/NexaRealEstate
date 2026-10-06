"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV, ICONS } from "./nav";
import { Avatar, Badge } from "@/components/ui";
import { useApp } from "@/lib/store";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebar, favoritesCount, unreadMessages, profile } = useApp();

  return (
    <>
      {!sidebarOpen ? (
        <button
          onClick={() => setSidebar(true)}
          aria-label="باز کردن منو"
          aria-expanded={sidebarOpen}
          className="focusable fixed top-3 start-3 z-50 flex size-9 items-center justify-center rounded-lg border border-edge bg-surface text-ink-2 shadow-pop lg:hidden"
        >
          <ICONS.Menu className="size-4.5" />
        </button>
      ) : null}

      <aside
        aria-label="منوی اصلی"
        className={cn(
          "fixed inset-y-0 start-0 z-40 flex w-60 max-w-[82vw] flex-col border-e border-edge bg-surface transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-edge px-4 py-3.5">
          <Link href="/" className="focusable flex items-center gap-2.5 rounded-lg" aria-label="NexaRealEstate">
            <span className="flex size-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M3 11 12 3l9 8" />
                <path d="M5 10v10h14V10" />
                <path d="M9 20v-6h6v6" />
              </svg>
            </span>
            <span className="text-[15px] font-extrabold tracking-tight text-ink">NexaRealEstate</span>
          </Link>
          <button
            onClick={() => setSidebar(false)}
            aria-label="بستن منو"
            className="focusable rounded-lg p-1 text-ink-3 hover:bg-surface-2 hover:text-ink lg:hidden"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2.5" aria-label="بخش‌ها">
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebar(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "focusable flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors duration-100",
                      isActive ? "bg-accent/10 text-accent" : "text-ink-2 hover:bg-surface-2 hover:text-ink",
                    )}
                  >
                    <span className={cn("shrink-0", isActive ? "text-accent" : "text-ink-3")}>{item.icon}</span>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.id === "favorites" && favoritesCount > 0 ? (
                      <Badge tone="danger" size="xs">
                        {favoritesCount}
                      </Badge>
                    ) : null}
                    {item.id === "messages" && unreadMessages > 0 ? (
                      <Badge tone="accent" size="xs">
                        {unreadMessages}
                      </Badge>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-edge p-2.5">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <Avatar name={profile.name} color={profile.avatarColor} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-ink">{profile.name}</p>
              <p className="truncate text-[11px] text-ink-3">{profile.role}</p>
            </div>
            <ICONS.LogOut className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
          </div>
        </div>
      </aside>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebar(false)} aria-hidden="true" />
      ) : null}
    </>
  );
}
