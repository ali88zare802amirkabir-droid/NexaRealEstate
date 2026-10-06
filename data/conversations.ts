import type { Conversation, Message } from "@/lib/types";
import { makeRng, randInt, pick, daysAgo } from "@/lib/rng";
import { customers } from "./customers";
import { agents } from "./agents";
import { properties } from "./properties";

const rng = makeRng(505050);

const AGENT_OPENERS = [
  "سلام، وقت بخیر. چطور می‌توانم کمکتان کنم؟",
  "سلام! به نکار ریل استیت خوش آمدید. در چه موردی می‌توانم راهنمایی کنم؟",
  "سلام، پیگیری ملک هستید؟ خوشحال می‌شم کمک کنم.",
  "وقت بخیر! اگر سؤالی درباره ملک مورد نظرتان دارید، بپرسید.",
];

const CUSTOMER_REPLIES = [
  "سلام، می‌خواستم درباره قیمت و شرایط خرید بیشتر بدونم.",
  "آیا امکان بازدید حضوری هفته آینده هست؟",
  "می‌خواستم بدانم آیا ملک هنوز موجود است؟",
  "لطفاً اطلاعات بیشتری درباره موقعیت و امکانات بدهید.",
  "ممنون از پاسخگویی. فایل ملک را می‌فرستید؟",
];

const AGENT_CLOSERS = [
  "حتماً. هماهنگی لازم را انجام می‌دهم و به شما اطلاع می‌دهم.",
  "بله، فایل کامل ملک را برایتان ارسال می‌کنم.",
  "عالیه. برای بازدید هماهنگ می‌کنم و زمان دقیق را اعلام می‌کنم.",
  "بله، ملک همچنان موجود است. چه روزی برای شما مناسب است؟",
];

function buildMessages(seed: number): Message[] {
  const count = randInt(rng, 2, 5);
  const out: Message[] = [];
  let t = new Date(daysAgo(randInt(rng, 1, 30))).getTime();

  for (let i = 0; i < count; i++) {
    t += randInt(rng, 1, 48) * 3_600_000;
    const fromAgent = i % 2 === 0;
    out.push({
      id: `msg-${seed}-${i}`,
      from: fromAgent ? "agent" : "customer",
      text: fromAgent ? pick(rng, AGENT_OPENERS.concat(AGENT_CLOSERS)) : pick(rng, CUSTOMER_REPLIES),
      at: new Date(t).toISOString(),
    });
  }
  return out;
}

export const conversations: Conversation[] = Array.from({ length: 50 }, (_, i) => {
  const property = properties[i % properties.length];
  const customer = customers[(i * 7 + 3) % customers.length];
  const agent = agents.find((a) => a.id === property.agentId) ?? agents[0];
  const messages = buildMessages(i + 1);
  const last = messages[messages.length - 1];

  return {
    id: `cnv-${String(i + 1).padStart(3, "0")}`,
    propertyId: property.id,
    customerId: customer.id,
    agentId: agent.id,
    subject: `پیگیری ${property.title}`,
    lastMessage: last.text,
    lastMessageAt: last.at,
    unread: rng() > 0.55 ? randInt(rng, 1, 4) : 0,
    messages,
  } satisfies Conversation;
});

export const conversationById = (id: string) => conversations.find((c) => c.id === id);
export const conversationsByAgent = (agentId: string) => conversations.filter((c) => c.agentId === agentId);
export const conversationsByCustomer = (customerId: string) => conversations.filter((c) => c.customerId === customerId);
export const conversationsByProperty = (propertyId: string) => conversations.filter((c) => c.propertyId === propertyId);
