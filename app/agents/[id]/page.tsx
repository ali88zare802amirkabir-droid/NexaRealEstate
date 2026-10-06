"use client";

import { useParams, useRouter } from "next/navigation";
import { cn, formatDate, formatMoney, formatNumber } from "@/lib/utils";
import { PropertyCard } from "@/components/property-card";
import { useApp } from "@/lib/store";
import { Badge, Button, EmptyState, Panel, Avatar, Rating } from "@/components/ui";
import { ChevronLeft, MapPin, Star, CalendarDays, Phone, MessageCircle, Building2, Award, TrendingUp } from "lucide-react";

export default function AgentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { agentById, properties, reviews } = useApp();

  const agent = agentById(params.id);

  if (!agent) {
    return (
      <EmptyState
        icon={<Building2 className="size-6" />}
        title="مشاور پیدا نشد"
        description="این مشاور وجود ندارد یا حذف شده است."
        action={
          <Button size="sm" variant="primary" onClick={() => router.push("/agents")}>
            بازگشت به مشاوران
          </Button>
        }
      />
    );
  }

  const agentProperties = properties.filter((p) => p.agentId === agent.id);
  const activeProperties = agentProperties.filter((p) => p.status === "Active");
  const agentReviewCount = reviews.filter((r) => r.agentId === agent.id).length;

  return (
    <div className="space-y-8">
      <nav className="flex items-center gap-1.5 text-[11.5px] text-ink-3">
        <button onClick={() => router.push("/")} className="hover:text-ink">خانه</button>
        <ChevronLeft className="size-3" />
        <button onClick={() => router.push("/agents")} className="hover:text-ink">مشاوران</button>
        <ChevronLeft className="size-3" />
        <span className="text-ink">{agent.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Sidebar */}
        <div className="space-y-5">
          <Panel className="space-y-5">
            <div className="flex flex-col items-center text-center">
              <Avatar name={agent.name} color={agent.avatarColor} size="xl" />
              <h2 className="mt-3 text-[18px] font-extrabold text-ink">{agent.name}</h2>
              <p className="text-[12px] text-ink-3">{agent.area} — {agent.city}</p>
            </div>

            <div className="flex items-center justify-center gap-1">
              <Rating value={agent.rating} size="sm" />
              <span className="text-[11px] text-ink-3">({agentReviewCount} نظر)</span>
            </div>

            <div className="border-t border-edge pt-4 space-y-2 text-[12px]">
              <div className="flex justify-between">
                <span className="text-ink-3">فهرست‌های فعال</span>
                <span className="font-semibold text-ink">{activeProperties.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-3">کل ملکی‌ها</span>
                <span className="font-semibold text-ink">{agentProperties.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-3">سال‌های تجربه</span>
                <span className="font-semibold text-ink">{agent.experience}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-edge pt-4">
              <a href={`tel:${agent.phone}`} className="focusable flex items-center gap-2 rounded-lg border border-edge bg-surface-2 p-3 transition-colors hover:bg-surface">
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Phone className="size-4" />
                </span>
                <div className="text-start">
                  <p className="text-[12px] font-bold text-ink">تماس تلفنی</p>
                  <p className="text-[11px] text-ink-3" dir="ltr">{agent.phone}</p>
                </div>
              </a>
              <button className="focusable flex items-center gap-2 rounded-lg border border-edge bg-surface-2 p-3 transition-colors hover:bg-surface">
                <span className="flex size-9 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
                  <MessageCircle className="size-4" />
                </span>
                <div className="text-start">
                  <p className="text-[12px] font-bold text-ink">پیام‌رسانی</p>
                  <p className="text-[11px] text-ink-3">شروع گفتگو</p>
                </div>
              </button>
            </div>
          </Panel>

          <Panel>
            <h3 className="mb-3 text-[13px] font-bold text-ink">اختصاصات</h3>
            <div className="flex flex-wrap gap-2">
              {agent.specialties.map((s, i) => (
                <Badge key={i} tone="default" size="xs">
                  {s}
                </Badge>
              ))}
            </div>
          </Panel>

          <Panel>
            <h3 className="mb-3 text-[13px] font-bold text-ink">محیط‌های فعال</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-ink">{agent.area}</span>
                <span className="text-ink-3">{agent.city}</span>
              </div>
              {agent.specialties.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-[12px]">
                  <span className="text-ink">{s}</span>
                  <span className="text-ink-3">تخصص {i + 1}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Main */}
        <div className="space-y-6">
          <Panel className="space-y-4">
            <h2 className="text-[15px] font-bold text-ink">درباره مشاور</h2>
            <p className="text-[13px] leading-7 text-ink-2">{agent.bio}</p>

            <h3 className="mt-4 text-[13px] font-bold text-ink">آمار عملکرد</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="panel flex flex-col items-center text-center p-4">
                <TrendingUp className="size-5 text-accent" />
                <p className="mt-1 text-[18px] font-extrabold text-ink">{formatNumber(agentProperties.reduce((s, p) => s + p.views, 0))}</p>
                <p className="text-[11px] text-ink-3">کل بازدید ملکی‌ها</p>
              </div>
              <div className="panel flex flex-col items-center text-center p-4">
                <Star className="size-5 text-warn" />
                <p className="mt-1 text-[18px] font-extrabold text-ink">{formatNumber(agentProperties.reduce((s, p) => s + p.favorites, 0))}</p>
                <p className="text-[11px] text-ink-3">کل علاقه‌مندی‌ها</p>
              </div>
              <div className="panel flex flex-col items-center text-center p-4">
                <CalendarDays className="size-5 text-cyan" />
                <p className="mt-1 text-[18px] font-extrabold text-ink">{agent.experience}</p>
                <p className="text-[11px] text-ink-3">سال تجربه</p>
              </div>
              <div className="panel flex flex-col items-center text-center p-4">
                <Award className="size-5 text-violet" />
                <p className="mt-1 text-[18px] font-extrabold text-ink">{agentReviewCount}</p>
                <p className="text-[11px] text-ink-3">تعداد نظرات</p>
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-bold text-ink">ملکی‌های این مشاور</h2>
              <Badge tone="accent" size="xs">
                {agentProperties.length}
              </Badge>
            </div>

            {activeProperties.length === 0 ? (
              <EmptyState
                icon={<Building2 className="size-6" />}
                title="ملک فعالی وجود ندارد"
                description="این مشاور در حال حاضر هیچ ملک فعالی برای نمایش ندارد."
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {activeProperties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}