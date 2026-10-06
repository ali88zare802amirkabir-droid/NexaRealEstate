"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge, Button, Input, EmptyState, Table, THead, TBody, TRow, THeadCell, TCell, Select } from "@/components/ui";
import { User, Filter } from "lucide-react";
import { useApp } from "@/lib/store";

const AGENT_SORTS = [
  { value: "rating-desc", label: "امتیاز" },
  { value: "name", label: "نام" },
  { value: "listings", label: "فهرست" },
  { value: "reviews", label: "نظرات" },
] as const;

export default function AgentsPage() {
  const { agents, properties, reviews } = useApp();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("rating-desc");

  const listingCount = (id: string) => properties.filter((p) => p.agentId === id).length;
  const reviewCount = (id: string) => reviews.filter((r) => r.agentId === id).length;

  const filtered = agents.filter((a) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return a.name.toLowerCase().includes(q) ||
           a.city.toLowerCase().includes(q) ||
           a.area.toLowerCase().includes(q) ||
           a.email.toLowerCase().includes(q);
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "rating-desc": return b.rating - a.rating;
      case "name": return a.name.localeCompare(b.name);
      case "listings": return listingCount(b.id) - listingCount(a.id);
      case "reviews": return reviewCount(b.id) - reviewCount(a.id);
      default: return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-edge pb-3">
        <div>
          <h1 className="text-[20px] font-extrabold text-ink">فهرست مشاوران</h1>
          <p className="text-[12.5px] text-ink-3">
            {agents.length} مشاور فعال
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="جستجو براساس نام، ایمیل یا تخصص…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-48"
          />
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-36 text-[11.5px]"
          >
            {AGENT_SORTS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>
      </div>

      {agents.length === 0 ? (
        <EmptyState
          icon={<User className="size-6" />}
          title="هیچ مشاوری یافت نشد"
          description="CONSULTANTS پس از ثبت اطلاعات در سیستم نمایش داده می‌شوند."
        />
      ) : (
        <Table>
          <THead>
            <THeadCell className="text-[11px] font-medium text-ink-3">نام</THeadCell>
            <THeadCell className="text-[11px] font-medium text-ink-3">خصص</THeadCell>
            <THeadCell className="text-[11px] font-medium text-ink-3">امتیاز</THeadCell>
            <THeadCell className="text-[11px] font-medium text-ink-3">فهرست</THeadCell>
            <THeadCell className="text-[11px] font-medium text-ink-3">نظرات</THeadCell>
          </THead>
          <TBody>
            {sorted.map((agent) => (
              <TRow key={agent.id} className="border-b border-edge/60 last:border-0">
                <TCell className="text-[12.5px] font-semibold text-ink">{agent.name}</TCell>
                <TCell className="text-[12px] text-ink-3">{agent.city} — {agent.area}</TCell>
                <TCell className="text-[12px] text-ink">
                  <span className="inline-flex items-center gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <span key={i} className={cn("size-3", i <= agent.rating ? "text-warn" : "text-edge")}>
                        ★
                      </span>
                    ))}
                    <span className="ml-1 text-[10px] text-ink-3">({reviewCount(agent.id)})</span>
                  </span>
                </TCell>
                <TCell className="text-[12px] text-ink">{listingCount(agent.id)}</TCell>
                <TCell className="text-[12px] text-ink">{reviewCount(agent.id)}</TCell>
              </TRow>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}