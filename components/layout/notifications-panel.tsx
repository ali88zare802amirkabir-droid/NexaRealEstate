"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { cn, formatRelative } from "@/lib/utils";
import { Badge, Button, EmptyState } from "@/components/ui";
import { useApp } from "@/lib/store";
import type { Notification } from "@/lib/types";

const TONE: Record<Notification["type"], { label: string; tone: string; dot: string }> = {
  new_inquiry: { label: "استعلام جدید", tone: "text-accent", dot: "bg-accent" },
  new_review: { label: "دیدگاه جدید", tone: "text-warn", dot: "bg-warn" },
  viewing_request: { label: "درخواست بازدید", tone: "text-cyan", dot: "bg-cyan" },
  viewing_reminder: { label: "یادآوری بازدید", tone: "text-warn", dot: "bg-warn" },
  favorite_activity: { label: "علاقه‌مندی", tone: "text-danger", dot: "bg-danger" },
  listing_approved: { label: "انتشار ملک", tone: "text-ok", dot: "bg-ok" },
  price_change: { label: "تغییر قیمت", tone: "text-violet", dot: "bg-violet" },
};

export function NotificationsPanel({ children }: { children: ReactNode }) {
  const { notifications, notificationsOpen, setNotifications, readNotification, readAllNotifications, clearNotifications } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <>
      {children}

      {notificationsOpen ? (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setNotifications(false)} aria-hidden="true" />
          <section role="dialog" aria-label="مرکز اعلان‌ها" className="fixed inset-y-0 end-0 z-50 flex w-full max-w-sm flex-col border-s border-edge bg-surface shadow-elevated">
            <header className="flex items-center justify-between gap-2 border-b border-edge px-4 py-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-ink">اعلان‌ها</h2>
                {unread > 0 ? (
                  <Badge tone="accent" size="xs">
                    {unread} خوانده‌نشده
                  </Badge>
                ) : null}
              </div>
              <Button size="xs" variant="ghost" onClick={() => setNotifications(false)} aria-label="بستن اعلان‌ها">
                بستن
              </Button>
            </header>

            <div className="flex items-center gap-2 border-b border-edge px-4 py-2">
              <Button size="xs" variant="outline" onClick={readAllNotifications} disabled={unread === 0}>
                خواندن همه
              </Button>
              <Button size="xs" variant="ghost" onClick={clearNotifications} disabled={notifications.length === 0}>
                پاک کردن
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <EmptyState compact title="اعلانی وجود ندارد" description="همه اعلان‌ها پاک شده‌اند." />
              ) : (
                <ul className="divide-y divide-edge">
                  {notifications.map((n) => {
                    const meta = TONE[n.type];
                    const body = (
                      <>
                        <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", meta.dot)} aria-hidden="true" />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className={cn("text-[10px] font-bold", meta.tone)}>{meta.label}</span>
                            <span className="text-[10px] text-ink-3">{formatRelative(n.createdAt)}</span>
                            {!n.read ? <Badge tone="accent" size="xs">جدید</Badge> : null}
                          </span>
                          <span className="mt-0.5 block text-[12.5px] font-semibold text-ink">{n.title}</span>
                          <span className="mt-0.5 block text-[11.5px] leading-5 text-ink-3">{n.message}</span>
                        </span>
                      </>
                    );

                    return (
                      <li key={n.id} className={cn("row-hover transition-colors", !n.read && "bg-accent/[0.04]")}>
                        {n.link ? (
                          <Link
                            href={n.link}
                            onClick={() => {
                              readNotification(n.id);
                              setNotifications(false);
                            }}
                            className="flex w-full items-start gap-2.5 px-4 py-3"
                          >
                            {body}
                          </Link>
                        ) : (
                          <button onClick={() => readNotification(n.id)} className="flex w-full items-start gap-2.5 px-4 py-3 text-start">
                            {body}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        </>
      ) : null}
    </>
  );
}
