"use client";

import { useState, useMemo } from "react";
import { cn, formatDate, formatMoney, formatNumber } from "@/lib/utils";
import { Badge, Button, Input, EmptyState, Table, THead, TBody, TRow, THeadCell, TCell } from "@/components/ui";
import { CalendarDays, Clock, MapPin, User, CheckCircle2, X, Trash2, Eye } from "lucide-react";
import { useApp } from "@/lib/store";
import type { Agent, Customer, Property, Viewing } from "@/lib/types";

interface JoinedViewing extends Viewing {
  property?: Property;
  agent?: Agent;
  customer?: Customer;
}

export default function ViewingsPage() {
  const { viewings, properties, agents, customers, toggleFavorite, toggleCompare, isFavorite, isComparing } = useApp();

  const allViewings = useMemo(() => {
    return viewings.map((v) => ({
      ...v,
      property: properties.find((p) => p.id === v.propertyId),
      agent: agents.find((a) => a.id === v.agentId),
      customer: customers.find((c) => c.id === v.customerId),
    }));
  }, [viewings, properties, agents, customers]);

  const statusLabels: Record<string, { label: string; color: string }> = {
    Scheduled: { label: "برنامه‌ریزی شده", color: "accent" },
    Confirmed: { label: "تأیید شده", color: "ok" },
    Completed: { label: "انجام شده", color: "ok" },
    Cancelled: { label: "لغو شده", color: "danger" },
  };

  const statusColors: Record<string, string> = {
    Scheduled: "bg-accent/10 text-accent",
    Confirmed: "bg-ok/10 text-ok",
    Completed: "bg-ok/10 text-ok",
    Cancelled: "bg-danger/10 text-danger",
  };

  const columns: { key: string; label: string; render: (v: JoinedViewing) => React.ReactNode }[] = [
    { key: "date", label: "تاریخ", render: (v: JoinedViewing) => formatDate(v.date) },
    { key: "time", label: "ساعت", render: (v: JoinedViewing) => v.time },
    { key: "property", label: " ملک", render: (v: JoinedViewing) => v.property?.title ?? "—" },
    { key: "agent", label: "مشاور", render: (v: JoinedViewing) => v.agent?.name ?? "—" },
    { key: "type", label: "نوع", render: (v: JoinedViewing) => v.type },
    { key: "status", label: "وضعیت", render: (v: JoinedViewing) => (
      <Badge tone={statusColors[v.status]} size="sm">{statusLabels[v.status].label}</Badge>
    ) },
    { key: "actions", label: "عملیات", render: (v: JoinedViewing) => (
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" className="text-[11px]">
          <Eye className="size-3.5" />
          جزئیات
        </Button>
        {v.status === "Scheduled" || v.status === "Confirmed" ? (
          <Button size="sm" variant="ghost" className="text-[11px]">
            <X className="size-3.5" />
            لغو
          </Button>
        ) : null}
      </div>
    ) },
  ];

  const emptyState = {
    icon: <CalendarDays className="size-6" />,
    title: "هنوز درخواست بازدید ثبت نشده",
    description: "درخواست‌های بازدید پس از ثبت در detailed property pages نمایش داده می‌شوند.",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-edge pb-3">
        <h1 className="text-[20px] font-extrabold text-ink">درخواست‌های بازدید</h1>
        <Badge tone="accent" size="xs">
          {viewings.length} درخواست
        </Badge>
      </div>

      {viewings.length === 0 ? (
        <EmptyState {...emptyState} />
      ) : (
        <Table>
          <THead>
            {columns.map((col) => (
              <THeadCell key={col.key} className="text-[11px] font-medium text-ink-3">
                {col.label}
              </THeadCell>
            ))}
          </THead>
          <TBody>
            {allViewings.slice(0, 20).map((v) => (
              <TRow key={v.id} className="border-b border-edge/60 last:border-0">
                {columns.map((col) => (
                  <TCell key={col.key} className="text-[11.5px] font-medium text-ink">
                    {col.render(v)}
                  </TCell>
                ))}
              </TRow>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}