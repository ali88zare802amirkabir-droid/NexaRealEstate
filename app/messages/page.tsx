"use client";

import { useMemo } from "react";
import { cn, formatDate, formatRelative } from "@/lib/utils";
import { Badge, EmptyState, Table, THead, TBody, TRow, THeadCell, TCell } from "@/components/ui";
import { MessageCircle } from "lucide-react";
import { useApp } from "@/lib/store";

export default function MessagesPage() {
  const { conversations, customerById, agentById, propertyById } = useApp();

  const totalUnread = useMemo(() => {
    return conversations.reduce((s, c) => s + c.unread, 0);
  }, [conversations]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-edge pb-3">
        <h1 className="text-[20px] font-extrabold text-ink">پیامک‌ها</h1>
        {totalUnread > 0 ? (
          <Badge tone="accent" size="xs">
            {totalUnread}
          </Badge>
        ) : null}
      </div>

      {conversations.length === 0 ? (
        <EmptyState
          icon={<MessageCircle className="size-6" />}
          title="هنوز پیامی نیست"
          description="گفتگوها و پیامک‌ها بعد از شروع ارتباط با کاربران نمایش داده می‌شوند."
        />
      ) : (
        <Table>
          <THead>
            <THeadCell className="text-[11px] font-medium text-ink-3">موضوع</THeadCell>
            <THeadCell className="text-[11px] font-medium text-ink-3">مشتری</THeadCell>
            <THeadCell className="text-[11px] font-medium text-ink-3">آخرین پیام</THeadCell>
            <THeadCell className="text-[11px] font-medium text-ink-3">زمان</THeadCell>
            <THeadCell className="text-[11px] font-medium text-ink-3">وضعیت</THeadCell>
          </THead>
          <TBody>
            {conversations.map((c) => {
              const customer = customerById(c.customerId);
              const agent = agentById(c.agentId);
              const property = propertyById(c.propertyId);
              return (
                <TRow key={c.id}>
                  <TCell className="text-[12px] font-semibold text-ink">
                    <span className="block max-w-56 truncate">{c.subject}</span>
                    <span className="block max-w-56 truncate text-[10.5px] font-normal text-ink-3">
                      {property?.title ?? c.propertyId} · {agent?.name ?? ""}
                    </span>
                  </TCell>
                  <TCell className="text-[11.5px] text-ink-2">{customer?.name ?? c.customerId}</TCell>
                  <TCell className="text-[11.5px] text-ink-3" align="left">
                    <span className="block max-w-64 truncate">{c.lastMessage}</span>
                  </TCell>
                  <TCell className="text-[11.5px] text-ink-3">
                    <span title={formatDate(c.lastMessageAt)}>{formatRelative(c.lastMessageAt)}</span>
                  </TCell>
                  <TCell>
                    {c.unread > 0 ? (
                      <Badge tone="accent" size="xs">
                        {c.unread} خوانده‌نشده
                      </Badge>
                    ) : (
                      <span className={cn("text-[11px]", "text-ink-3")}>خوانده شده</span>
                    )}
                  </TCell>
                </TRow>
              );
            })}
          </TBody>
        </Table>
      )}
    </div>
  );
}
