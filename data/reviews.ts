import type { Review } from "@/lib/types";
import { makeRng, randInt, pick, daysAgo } from "@/lib/rng";
import { customers } from "./customers";
import { agents } from "./agents";
import { properties } from "./properties";

const rng = makeRng(404040);

const TITLES: Record<number, string[]> = {
  5: ["عالی بود", "کاملاً راضی‌ام", "تجربه فوق‌العاده", "به شدت توصیه می‌کنم"],
  4: ["خوب بود", "راضی‌ام", "قابل قبول", "در مجموع خوب"],
  3: ["متوسط بود", "انتظار بیشتری داشتم", "بد نیست"],
  2: ["ضعیف بود", "راضی نبودم", "کیفیت پایین"],
  1: ["اصلاً خوب نبود", "ناراضی هستم", "تجربه بدی داشت"],
};

const COMMENTS: Record<number, string[]> = {
  5: ["مشاور بسیار حرفه‌ای و صبور بود. فرآیند کامل و شفاف پیش رفت.", "ملک دقیقاً مطابق توضیحات بود و بازدید بدون مشکل انجام شد.", "از انتخاب تا امضای قرارداد، همه چیز منظم بود. ممنون از زحماتشان.", "اطلاعات کامل و به‌موقع دریافت کردم. حتماً دوباره همکاری می‌کنم."],
  4: ["خوب بود ولی کمی بیشتر زمان برای هماهنگی لازم بود.", "ملک مناسبی بود؛ فقط تصاویر کمی متفاوت از واقعیت بند.", "در مجموع راضی‌ام؛ پاسخگویی سریع‌تر می‌توانست باشد."],
  3: ["متوسط بود؛ نه خیلی خوب نه خیلی بد.", "انتظار بیشتری از این قیمت داشتم."],
  2: ["کیفیت خدمات پایین‌تر از انتظارم بود. پیشنهاد نمی‌کنم.", "اطلاعات ناقص داده شد و مجبور شدم خودم بررسی کنم."],
  1: ["اصلاً مطابق توضیحات نبود و زمان زیادی هدر رفت.", "تجربه بدی داشتم؛ پاسخگویی نداشتند."],
};

export const reviews: Review[] = Array.from({ length: 40 }, (_, i) => {
  const property = properties[i % properties.length];
  const customer = customers[i % customers.length];
  const agent = agents.find((a) => a.id === property.agentId) ?? agents[0];
  const rating = randInt(rng, 1, 5);
  const roll = rng();
  const status: Review["status"] = roll > 0.88 ? "Flagged" : roll > 0.8 ? "Hidden" : "Published";

  return {
    id: `rev-${String(i + 1).padStart(3, "0")}`,
    propertyId: property.id,
    agentId: agent.id,
    customerId: customer.id,
    rating,
    title: pick(rng, TITLES[rating]),
    comment: pick(rng, COMMENTS[rating]),
    status,
    createdAt: daysAgo(randInt(rng, 1, 200), randInt(rng, 0, 20)),
    helpful: randInt(rng, 0, 80),
  } satisfies Review;
});

export const reviewById = (id: string) => reviews.find((r) => r.id === id);
export const reviewsByAgent = (agentId: string) => reviews.filter((r) => r.agentId === agentId);
export const reviewsByProperty = (propertyId: string) => reviews.filter((r) => r.propertyId === propertyId && r.status !== "Hidden");
export const reviewsByCustomer = (customerId: string) => reviews.filter((r) => r.customerId === customerId);
