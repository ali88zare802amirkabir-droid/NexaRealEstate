"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge, Button, Input, Table, THead, TBody, TRow, THeadCell, TCell } from "@/components/ui";
import { Users, Bell, Shield, CreditCard, Building2, MessageCircle, Globe, Lock, Mail, Phone, MapPin, User, CreditCard as CreditCardIcon } from "lucide-react";

const CITIES = [
  { name: "تهران", id: "city-01", agents: 12, properties: 210, users: 450 },
  { name: "مشهد", id: "city-02", agents: 8, properties: 180, users: 320 },
  { name: "اصفهان", id: "city-03", agents: 7, properties: 150, users: 280 },
  { name: "شیراز", id: "city-04", agents: 5, properties: 120, users: 240 },
  { name: "تبریز", id: "city-05", agents: 4, properties: 90, users: 180 },
];

const SETTINGS_TABS = [
  { id: "profile", label: "پروفایل", icon: User },
  { id: "notifications", label: "اعلان‌ها", icon: Bell },
  { id: "security", label: "امنیت", icon: Shield },
  { id: "billing", label: "صورتحساب", icon: CreditCardIcon },
  { id: "social", label: "شبکه‌های اجتماعی", icon: Globe },
  { id: "locations", label: "موقعیت‌ها", icon: MapPin },
] as const;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-edge pb-3">
        <h1 className="text-[20px] font-extrabold text-ink">تنظیمات</h1>
        <div className="flex items-center gap-2">
          <Badge tone="accent" size="xs">+3 اعلان جدید</Badge>
          <Badge tone="success" size="xs">۱۰۰٪ آپدیت شده</Badge>
        </div>
      </div>

      <div className="panel p-0 overflow-hidden lg:flex lg:min-h-[640px]">
        <aside className="border-e border-edge w-64 hidden lg:block p-4">
          <div className="flex items-center gap-3 mb-6 px-3">
            <span className="size-10 rounded-full bg-surface-2 flex items-center justify-center">
              <User className="size-5" />
            </span>
            <div>
              <p className="text-[13px] font-bold text-ink">مدیر سیستم</p>
              <p className="text-[11px] text-ink-3">support@nexarealestate.com</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "focusable flex items-center gap-2 rounded-lg px-3 py-2.5 text-start text-[12.5px] font-medium transition-colors",
                    activeTab === tab.id ? "bg-accent/15 text-accent" : "text-ink-3 hover:bg-surface-2 hover:text-ink",
                  )}
                >
                  <Icon className="size-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 lg:p-6 p-4">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "billing" && <BillingTab />}
          {activeTab === "social" && <SocialTab />}
          {activeTab === "locations" && <LocationsTab />}
        </main>
      </div>
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[16px] font-bold text-ink mb-1">پروفایل کاربری</h2>
        <p className="text-[12px] text-ink-3">مدیریت اطلاعات حساب کاربری شما.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input label="نام کامل" defaultValue="مدیر سیستم" />
        <Input label="ایمیل" type="email" defaultValue="support@nexarealestate.com" />
        <Input label="شماره تلفن" defaultValue="+98-2125444444" dir="ltr" />
        <Input label="شناسه کاربر" defaultValue="adm-001" readOnly />
      </div>

      <div className="rounded-xl border border-edge bg-surface-2 p-4">
        <h3 className="text-[13px] font-bold text-ink mb-3">نقش‌ها</h3>
        <div className="flex flex-wrap gap-2">
          <Badge tone="accent" size="xs">ادمین</Badge>
          <Badge tone="default" size="xs">مدیر سرور</Badge>
          <Badge tone="default" size="xs">لاگ‌نویس</Badge>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button size="sm" variant="ghost">لغو</Button>
        <Button size="sm" variant="primary">ذخیره تغییرات</Button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[16px] font-bold text-ink mb-1">اعلان‌ها</h2>
        <p className="text-[12px] text-ink-3">مدیریت اعلان‌های سیستم، ایمیل و SMS.</p>
      </div>

      <div className="rounded-xl border border-edge bg-surface-2 p-4">
        <h3 className="text-[13px] font-bold text-ink mb-3">کانال‌های ارسال</h3>
        <div className="space-y-3">
          {[
            { label: "اعلان‌های درون برنامه‌ای", desc: "درخواست‌های بازدید جدید، تغییرات وضعیت", icon: Bell },
            { label: "اعلان‌های ایمیلی", desc: "رویدادهای مهم روزانه، گزارش‌های هفتگی", icon: Mail },
            { label: "اعلان‌های SMS", desc: "درخواست‌های بازدید فوری، تأیید شده‌ها", icon: Phone },
          ].map((n) => {
            const Icon = n.icon;
            return (
              <div key={n.label} className="flex items-center justify-between border-b border-edge/60 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-surface text-ink-3">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-[12.5px] font-semibold text-ink">{n.label}</p>
                    <p className="text-[11px] text-ink-3">{n.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="ok" size="xs">فعال</Badge>
                  <button className="text-[11px] text-ink-3 hover:text-ink">تنظیمات</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button size="sm" variant="ghost">لغو</Button>
        <Button size="sm" variant="primary">ذخیره تغییرات</Button>
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[16px] font-bold text-ink mb-1">امنیت</h2>
        <p className="text-[12px] text-ink-3">مدیریت کلمه‌عبور، احراز هویت دو مرحله‌ای و مجوزهای API.</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-edge bg-surface-2 p-4">
          <h3 className="text-[13px] font-bold text-ink mb-3">امنیت حساب</h3>
          <div className="flex items-center justify-between border-b border-edge/60 pb-3 last:border-0 last:pb-0">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-surface text-ok">
                <Lock className="size-4" />
              </span>
              <div>
                <p className="text-[12.5px] font-semibold text-ink">کلمه‌عبور</p>
                <p className="text-[11px] text-ink-3">آخرین تغییر: ۳۰ روز پیش</p>
              </div>
            </div>
            <Button size="xs" variant="outline">تغییر کلمه‌عبور</Button>
          </div>

          <div className="flex items-center justify-between border-b border-edge/60 pb-3 last:border-0 last:pb-0">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-surface text-warn">
                <Shield className="size-4" />
              </span>
              <div>
                <p className="text-[12.5px] font-semibold text-ink">احراز هویت دو مرحله‌ای</p>
                <p className="text-[11px] text-ink-3">در حال غیرفعال</p>
              </div>
            </div>
            <Button size="xs" variant="primary">فعال کردن</Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button size="sm" variant="ghost">لغو</Button>
        <Button size="sm" variant="primary">ذخیره تغییرات</Button>
      </div>
    </div>
  );
}

function BillingTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[16px] font-bold text-ink mb-1">صورتحساب و پرداخت</h2>
        <p className="text-[12px] text-ink-3">مدیریت اشتراک، پرداخت‌ها و فاکتورها.</p>
      </div>

      <div className="rounded-xl border border-edge bg-surface-2 p-4">
        <h3 className="text-[13px] font-bold text-ink mb-3">وضعیت اشتراک</h3>
        <div className="flex items-center justify-between border-b border-edge/60 pb-3 last:border-0 last:pb-0">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-surface text-accent">
              <CreditCardIcon className="size-4" />
            </span>
            <div>
              <p className="text-[12.5px] font-semibold text-ink">پلن پریمیوم</p>
              <p className="text-[11px] text-ink-3">باقیمانده: ۱۲ روز</p>
            </div>
          </div>
          <Badge tone="ok" size="xs">فعال</Badge>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-[11.5px] text-ink-3">تاریخ بعدی: ۲۶ اکتبر ۲۰۲۴</p>
          <p className="text-[11.5px] text-ink-3">قیمت: ۱۲۹۹۰۰۰ تومان / ماه</p>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button size="sm" variant="ghost">لغو</Button>
        <Button size="sm" variant="primary">مدیریت اشتراک</Button>
      </div>
    </div>
  );
}

function SocialTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[16px] font-bold text-ink mb-1">شبکه‌های اجتماعی</h2>
        <p className="text-[12px] text-ink-3">مدیریت حساب‌های شبکه‌های اجتماعی NexaRealEstate.</p>
      </div>

      <div className="space-y-3">
        {[
          { label: "اینستاگرام", desc: "@nexarealestate_official", icon: Globe },
          { label: "توییتر", desc: "@NexaEstate", icon: Globe },
          { label: "تلگرام", desc: "@NexaEstate_Official", icon: MessageCircle },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center justify-between rounded-xl border border-edge bg-surface-2 p-3">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-surface text-ink-3">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-[12.5px] font-semibold text-ink">{s.label}</p>
                  <p className="text-[11px] text-ink-3">{s.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="ok" size="xs">متصل</Badge>
                <button className="text-[11px] text-danger">حذف</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button size="sm" variant="ghost">لغو</Button>
        <Button size="sm" variant="primary">ذخیره تغییرات</Button>
      </div>
    </div>
  );
}

function LocationsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[16px] font-bold text-ink mb-1">مدیریت موقعیت‌ها</h2>
        <p className="text-[12px] text-ink-3">تنظیم و فعال‌سازی شهرهای تحت پوشش.</p>
      </div>

      <Table>
        <THead>
          <THeadCell className="text-[11px] font-medium text-ink-3">شهر</THeadCell>
          <THeadCell className="text-[11px] font-medium text-ink-3">مشاوران</THeadCell>
          <THeadCell className="text-[11px] font-medium text-ink-3">ملک‌ها</THeadCell>
          <THeadCell className="text-[11px] font-medium text-ink-3">کاربران</THeadCell>
          <THeadCell className="text-[11px] font-medium text-ink-3">وضعیت</THeadCell>
        </THead>
        <TBody>
          {CITIES.map((c) => (
            <TRow key={c.id} className="border-b border-edge/60 last:border-0">
              <TCell className="text-[12.5px] font-semibold text-ink">{c.name}</TCell>
              <TCell className="text-[12px] text-ink-3">{c.agents}</TCell>
              <TCell className="text-[12px] text-ink-3">{c.properties}</TCell>
              <TCell className="text-[12px] text-ink-3">{c.users}</TCell>
              <TCell>
                <Badge tone="ok" size="xs">فعال</Badge>
              </TCell>
            </TRow>
          ))}
        </TBody>
      </Table>
    </div>
  );
}