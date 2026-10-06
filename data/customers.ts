import type { Customer } from "@/lib/types";
import { makeRng, randInt, pick, daysAgo } from "@/lib/rng";

const rng = makeRng(20261001);

const firstNames = [
  "علی", "زهرا", "محمد", "فاطمه", "رضا", "مریم", "حسین", "سارا", "امیر", "نرگس",
  "مهدی", "الهام", "سعید", "پریسا", "بهرام", "شیما", "کاوه", "نیلوفر", "فرهاد", "لیلا",
  "پویا", "مینا", "آرش", "سپیده", "بابک", "رها", "مجید", "گلناز", "نیما", "هدی",
];
const lastNames = [
  "محمدی", "حسینی", "رضایی", "کریمی", "احمدی", "صادقی", "نوری", "قاسمی", "رستمی", "عباسی",
  "جعفری", "موسوی", "کاظمی", "شریفی", "بهرامی", "زارع", "ملکی", "طاهری", "سالمی", "یوسفی",
];
const cities = ["تهران", "مشهد", "اصفهان", "شیراز", "تبریز", "کرج", "اهواز", "قم", "رشت", "یزد"];
const colors = ["#4c9aff", "#2fd4e8", "#35d08a", "#f5b53d", "#9d8bf5", "#f4736f"];

export const customers: Customer[] = Array.from({ length: 50 }, (_, i) => {
  const name = `${pick(rng, firstNames)} ${pick(rng, lastNames)}`;
  const totalOrders = randInt(rng, 0, 6);
  const avg = randInt(rng, 200, 3_000) * 1_000_000;
  const roll = rng();
  const status: Customer["status"] = roll > 0.9 ? "VIP" : roll > 0.82 ? "New" : roll > 0.02 ? "Active" : "Blocked";

  return {
    id: `cus-${String(i + 1).padStart(3, "0")}`,
    name,
    email: `customer${i + 1}@mail.com`,
    avatarColor: colors[i % colors.length],
    status,
    city: pick(rng, cities),
    totalOrders,
    totalSpent: totalOrders * avg,
    avgOrderValue: avg,
    lastOrderAt: daysAgo(randInt(rng, 0, 90), randInt(rng, 0, 20)),
    joinedAt: daysAgo(randInt(rng, 40, 700)),
    favorites: [],
  } satisfies Customer;
});

export const customerById = (id: string) => customers.find((c) => c.id === id);
export const customerName = (id: string) => customerById(id)?.name ?? "—";
