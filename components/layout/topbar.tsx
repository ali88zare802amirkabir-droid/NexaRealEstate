"use client";

import { Avatar, Badge, Button, IconButton } from "@/components/ui";
import { NotificationsPanel } from "./notifications-panel";
import { CommandSearch } from "./command-search";
import { ICONS } from "./nav";
import { useApp } from "@/lib/store";

export function Topbar() {
  const { setSearch, profile, setNotifications } = useApp();
  const unread = useUnreadCount();

  return (
    <header className="sticky top-0 z-30 border-b border-edge bg-surface/85 backdrop-blur-md">
      <div className="flex items-center gap-3 px-3 py-2.5 sm:px-5">
        <button
          onClick={() => setSearch(true)}
          className="focusable flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-edge bg-surface-2 px-3 text-start text-[12.5px] text-ink-3 transition-colors hover:border-edge-strong sm:max-w-md"
          aria-label="جستجوی سراسری"
          aria-keyshortcuts="Control+K Meta+K"
        >
          <ICONS.Search className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">جستجوی ملک، منطقه یا مشاور…</span>
          <kbd className="ms-auto hidden shrink-0 rounded border border-edge px-1.5 py-0.5 font-mono text-[10px] text-ink-3 sm:inline">Ctrl K</kbd>
        </button>

        <div className="ms-auto flex items-center gap-1.5">
          <Button size="sm" variant="primary" onClick={() => setSearch(true)} className="hidden sm:inline-flex">
            <ICONS.Search className="size-3.5" />
            جستجوی سریع
          </Button>

          <NotificationsPanel>
            <IconButton label={unread > 0 ? `اعلان‌ها (${unread} خوانده‌نشده)` : "اعلان‌ها"} variant="ghost" onClick={() => setNotifications()}>
              <span className="relative inline-flex">
                <ICONS.Bell className="size-4.5" />
                {unread > 0 ? (
                  <span className="absolute -end-1 -top-1 flex size-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white">
                    {unread > 9 ? "۹+" : unread}
                  </span>
                ) : null}
              </span>
            </IconButton>
          </NotificationsPanel>

          <span className="ms-1 hidden items-center gap-2 rounded-lg border border-edge px-2 py-1 sm:flex">
            <Avatar name={profile.name} color={profile.avatarColor} size="xs" />
            <span className="text-[12px] font-medium text-ink-2">{profile.name}</span>
            <Badge tone="accent" size="xs">
              مشاور
            </Badge>
          </span>
        </div>
      </div>

      <CommandSearch />
    </header>
  );
}

function useUnreadCount() {
  const { notifications } = useApp();
  return notifications.filter((n) => !n.read).length;
}
