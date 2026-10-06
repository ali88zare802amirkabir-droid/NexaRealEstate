import type { Notification } from "@/lib/types";
import { makeRng, randInt, pick, daysAgo } from "@/lib/rng";
import { viewings } from "./viewings";
import { properties } from "./properties";
import { reviews } from "./reviews";
import { conversations } from "./conversations";

const rng = makeRng(303030);

type Kind = Notification["type"];

function build(): Notification[] {
  const out: Notification[] = [];
  let n = 0;

  const push = (type: Kind, title: string, message: string, link: string | null, read: boolean, days: number) => {
    n++;
    out.push({
      id: `ntf-${String(n).padStart(3, "0")}`,
      type,
      title,
      message,
      read,
      link,
      createdAt: daysAgo(days, randInt(rng, 0, 22)),
    } satisfies Notification);
  };

  for (const v of viewings.filter((x) => x.status === "Scheduled").slice(0, 8)) {
    const p = properties.find((x) => x.id === v.propertyId);
    push("viewing_request", "درخواست بازدید جدید", `بازدید ${v.date} ساعت ${v.time} برای «${p?.title}» ثبت شد.`, `/viewings/${v.id}`, rng() > 0.4, randInt(rng, 0, 10));
  }

  for (const c of conversations.filter((x) => x.unread > 0).slice(0, 8)) {
    const p = properties.find((x) => x.id === c.propertyId);
    push("new_inquiry", "استعلام جدید", `پیام جدیدی درباره «${p?.title}» دریافت شد.`, `/messages/${c.id}`, rng() > 0.5, randInt(rng, 0, 14));
  }

  for (const r of reviews.filter((x) => x.status === "Flagged").slice(0, 5)) {
    const p = properties.find((x) => x.id === r.propertyId);
    push("new_review", "دیدگاه جدید برای بررسی", `دیدگاهی با امتیاز ${r.rating} برای «${p?.title}» ثبت شد.`, "/reviews", false, randInt(rng, 0, 6));
  }

  for (const p of properties.filter((x) => x.status === "Active").slice(0, 6)) {
    push("listing_approved", "ملک منتشر شد", `ملک «${p.title}» با موفقیت منتشر شد.`, `/properties/${p.id}`, true, randInt(rng, 10, 60));
  }

  for (const p of properties.filter((x) => x.status === "Sold" || x.status === "Rented").slice(0, 5)) {
    push("price_change", "تغییر قیمت", `قیمت «${p.title}» به‌روزرسانی شد.`, `/properties/${p.id}`, true, randInt(rng, 10, 60));
  }

  while (out.length < 30) {
    const p = pick(rng, properties);
    const kind = pick(rng, ["viewing_reminder", "favorite_activity", "price_change"] as Kind[]);
    if (kind === "viewing_reminder") push(kind, "یادآوری بازدید", `بازدید فردا ساعت ۱۰:۰۰ برای «${p.title}» است.`, "/viewings", true, randInt(rng, 12, 70));
    else if (kind === "favorite_activity") push(kind, "فعالیت علاقه‌مندی", `«${p.title}» به علاقه‌مندی‌های شما اضافه شد.`, `/favorites`, true, randInt(rng, 12, 70));
    else push(kind, "تغییر قیمت", `قیمت «${p.title}» تغییر کرد.`, `/properties/${p.id}`, true, randInt(rng, 12, 70));
  }

  return out.slice(0, 30);
}

export const notifications: Notification[] = build();
