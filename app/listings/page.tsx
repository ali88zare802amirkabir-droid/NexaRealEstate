"use client";

import { useState, useMemo } from "react";
import { cn, formatDate, formatMoney, formatNumber } from "@/lib/utils";
import { Badge, Button, EmptyState, Table, THead, TBody, TRow, THeadCell, TCell } from "@/components/ui";
import { Building2, Plus, CalendarDays, TrendingUp, MapPin, Eye } from "lucide-react";
import { useApp } from "@/lib/store";

export default function ListingsPage() {
  const { properties, agents, customerById } = useApp();

  const userProperties = useMemo(() => {
    return properties.filter((p) => p.isMine);
  }, [properties]);

  const active = userProperties.filter((p) => p.status === "Active");
  const sold = userProperties.filter((p) => p.status === "Sold");
  const rented = userProperties.filter((p) => p.status === "Rented");
  const pending = userProperties.filter((p) => p.status === "Pending");

  const getAgentName = (id: string) => {
    const agent = agents.find((a) => a.id === id);
    return agent?.name ?? "—";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-edge pb-3">
        <h1 className="text-[20px] font-extrabold text-ink">فهرست املاک من</h1>
        <Button size="sm" variant="primary" onClick={() => {}}>
          <Plus className="size-4" />
          افزودن ملک جدید
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="panel flex items-center gap-3 p-4">
          <Building2 className="size-5 text-accent" />
          <div>
            <p className="text-[18px] font-extrabold text-ink">{active.length}</p>
            <p className="text-[11px] text-ink-3">فعال</p>
          </div>
        </div>
        <div className="panel flex items-center gap-3 p-4">
          <CalendarDays className="size-5 text-ok" />
          <div>
            <p className="text-[18px] font-extrabold text-ink">{pending.length}</p>
            <p className="text-[11px] text-ink-3">در انتظار</p>
          </div>
        </div>
        <div className="panel flex items-center gap-3 p-4">
          <TrendingUp className="size-5 text-warn" />
          <div>
            <p className="text-[18px] font-extrabold text-ink">{sold.length}</p>
            <p className="text-[11px] text-ink-3">فروخته شده</p>
          </div>
        </div>
        <div className="panel flex items-center gap-3 p-4">
          <MapPin className="size-5 text-cyan" />
          <div>
            <p className="text-[18px] font-extrabold text-ink">{rented.length}</p>
            <p className="text-[11px] text-ink-3">اجاره داده شده</p>
          </div>
        </div>
      </div>

      <Table>
        <THead>
          <THeadCell className="text-[11px] font-medium text-ink-3">ملک</THeadCell>
          <THeadCell className="text-[11px] font-medium text-ink-3">موقعیت</THeadCell>
          <THeadCell className="text-[11px] font-medium text-ink-3">قیمت</THeadCell>
          <THeadCell className="text-[11px] font-medium text-ink-3">وضعیت</THeadCell>
          <THeadCell className="text-[11px] font-medium text-ink-3">مشاور</THeadCell>
          <THeadCell className="text-[11px] font-medium text-ink-3">بازدید</THeadCell>
          <THeadCell className="text-[11px] font-medium text-ink-3">عملیات</THeadCell>
        </THead>
        <TBody>
          {userProperties.map((p) => (
            <TRow key={p.id} className="border-b border-edge/60 last:border-0">
              <TCell>
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-lg bg-surface-2 overflow-hidden">
                    <img src="https://picsum.photos/seed/seed12345/80/80" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-ink">{p.title}</p>
                    <p className="text-[11px] text-ink-3">ID: {p.id}</p>
                  </div>
                </div>
              </TCell>
              <TCell className="text-[12px] text-ink-3">
                {p.city}, {p.area}
              </TCell>
              <TCell className="text-[12.5px] font-bold text-ink">{formatMoney(p.price)}</TCell>
              <TCell className="text-[11.5px]">
                <Badge tone={p.status === "Active" ? "accent" : p.status === "Pending" ? "warning" : p.status === "Sold" ? "ok" : "cyan"} size="xs">
                  {p.status === "Active" ? "فعال" : p.status === "Pending" ? "در انتظار" : p.status === "Sold" ? "فروخته شده" : "اجاره داده شده"}
                </Badge>
              </TCell>
              <TCell className="text-[12px] text-ink">{getAgentName(p.agentId)}</TCell>
              <TCell className="text-[12px] text-ink-2">
                <div className="flex items-center gap-1">
                  <Eye className="size-3.5" />
                  {formatNumber(p.views)}
                </div>
              </TCell>
              <TCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-[11px]">
                    مشاهده
                  </Button>
                  <Button size="sm" variant="ghost" className="text-[11px]">
                    ویرایش
                  </Button>
                  <Button size="sm" variant="ghost" className="text-danger text-[11px]">
                    حذف
                  </Button>
                </div>
              </TCell>
            </TRow>
          ))}
        </TBody>
      </Table>
    </div>
  );
}