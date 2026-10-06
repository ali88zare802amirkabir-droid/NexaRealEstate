import type { Property } from "@/lib/types";
import { makeRng, randInt, pick, pickMany, daysAgo } from "@/lib/rng";
import { areas } from "./areas";
import { agents } from "./agents";

const rng = makeRng(808080);

const TYPES = ["آپارتمان", "ویلا", "خانه ویلایی", "پنت‌هاوس", "زمین", "تجاری"] as const;
const PURPOSES = ["Buy", "Rent"] as const;
const STATUSES = ["Active", "Pending", "Sold", "Rented", "Draft"] as const;

const STREETS = ["خیابان ولیعصر", "خیابان شریعتی", "خیابان انقلاب", "خیابان آزادی", "بلوار کشاورز", "خیابان جمهوری", "خیابان فردوسی", "بلوار پاسداران", "خیابان مطهری", "خیابان کرمان"];
const FEATURES = ["پارکینگ", "آسانسور", "بالکن", "انباری", "امنیت", "سرمایش مرکزی", "تهویه مطبوع", "شوفاژ مرکزی", "آشپزخانه مدرن", "حیاط", "استخر", "سالن ورزشی", "ویو شهر", "نورگیری عالی", "کابینت های‌گلاس"];
const NEARBY = ["مدرسه", "بیمارستان", "پارک", "فروشگاه", "ایستگاه مترو", "دانشگاه", "بانک", "کافه", "سوپرمارکت", "مکان تفریحی"];

const DESCRIPTIONS = [
  "ملکی با طراحی مدرن و نورگیری عالی در یکی از بهترین مناطق شهر. دسترسی آسان به حمل‌ونقل عمومی و مراکز خرید.",
  "واحدی دنج و آرام با چیدمان هوشمندانه و مصالح ساختمانی درجه یک. مناسب خانواده‌هایی که به دنبال کیفیت زندگی هستند.",
  "ملکی لوکس با ویو باز و فضای سبز اختصاصی. نزدیکی به امکانات شهری و محیطی امن و آرام.",
  "فرصت سرمایه‌گذاری عالی با بازدهی اجاره بالا. موقعیت مکانی استراتژیک و تقاضای بازار قوی.",
  "خانه‌ای ایده‌آل برای خانواده با فضای داخلی گسترده و حیاط اختصاصی. منطقه‌ای آرام با زیرساخت کامل.",
  "ملکی با معماری خاص و فضای داخلی بهینه. مناسب برای زندگی مدرن یا سرمایه‌گذاری بلندمدت.",
];

function slugify(type: string, index: number) {
  return `prp-${String(index + 1).padStart(3, "0")}`;
}

export const properties: Property[] = Array.from({ length: 80 }, (_, i) => {
  const type = pick(rng, TYPES);
  const purpose = pick(rng, PURPOSES);
  const area = areas[i % areas.length];
  const agent = agents[(i * 5 + 2) % agents.length];
  const isMine = agent.id === "agt-01";

  const beds = type === "زمین" || type === "تجاری" ? 0 : type === "ویلا" || type === "خانه ویلایی" ? randInt(rng, 3, 5) : randInt(rng, 1, 3);
  const baths = beds > 0 ? Math.max(1, beds - randInt(rng, 0, 1)) : randInt(rng, 1, 2);
  const areaSize = type === "زمین" ? randInt(rng, 300, 2000) : type === "ویلا" || type === "خانه ویلایی" ? randInt(rng, 180, 600) : type === "پنت‌هاوس" ? randInt(rng, 200, 400) : randInt(rng, 70, 220);
  const yearBuilt = randInt(rng, 1385, 1405);

  const basePrice =
    purpose === "Rent"
      ? Math.round((areaSize * randInt(rng, 8, 25) * 1000) / 100_000) * 100_000
      : Math.round((areaSize * area.avgPrice * randInt(rng, 85, 130)) / 100_000) * 100_000;

  const statusRoll = rng();
  const status: Property["status"] = statusRoll > 0.86 ? "Sold" : statusRoll > 0.78 ? "Rented" : statusRoll > 0.7 ? "Pending" : statusRoll > 0.64 ? "Draft" : "Active";

  const features = pickMany(rng, FEATURES, randInt(rng, 4, 8));
  const nearby = pickMany(rng, NEARBY, randInt(rng, 3, 5));

  return {
    id: `prp-${String(i + 1).padStart(3, "0")}`,
    slug: slugify(type, i),
    title: `${type} ${area.name} ${beds > 0 ? `${beds} خواب` : ""}`.trim(),
    type,
    purpose,
    price: basePrice,
    area: areaSize,
    beds,
    baths,
    parking: type === "زمین" ? 0 : randInt(rng, 0, 2),
    yearBuilt,
    furnished: rng() > 0.6,
    elevator: type === "آپارتمان" || type === "پنت‌هاوس" ? rng() > 0.25 : false,
    balcony: rng() > 0.4,
    storage: rng() > 0.35,
    security: rng() > 0.3,
    ac: rng() > 0.2,
    heating: rng() > 0.25,
    address: `${area.city}، ${area.name}، ${pick(rng, STREETS)}، پلاک ${randInt(rng, 1, 240)}`,
    city: area.city,
    areaId: area.id,
    agentId: agent.id,
    status,
    views: randInt(rng, 50, 12_000),
    favorites: randInt(rng, 0, 320),
    inquiries: randInt(rng, 0, 45),
    imageTone: i % 8,
    mapX: Math.min(96, Math.max(4, area.mapX + randInt(rng, -6, 6))),
    mapY: Math.min(96, Math.max(4, area.mapY + randInt(rng, -6, 6))),
    coords: `${(35.6 + rng() * 0.4).toFixed(4)}, ${(51.2 + rng() * 0.5).toFixed(4)}`,
    description: pick(rng, DESCRIPTIONS),
    features,
    nearby,
    publishedAt: daysAgo(randInt(rng, 1, 300)),
    isMine,
  } satisfies Property;
});

export const propertyById = (id: string) => properties.find((p) => p.id === id);
export const propertyBySlug = (slug: string) => properties.find((p) => p.slug === slug);

export const activeProperties = properties.filter((p) => p.status === "Active");

export const myListings = properties.filter((p) => p.isMine);

export const relatedProperties = (propertyId: string, limit = 4) => {
  const property = propertyById(propertyId);
  if (!property) return [];
  return activeProperties
    .filter((p) => p.id !== propertyId && (p.areaId === property.areaId || p.type === property.type))
    .slice(0, limit);
};

export const recentlyViewed = (excludeId: string | null, limit = 6) =>
  [...activeProperties].sort((a, b) => b.views - a.views).filter((p) => p.id !== excludeId).slice(0, limit);
