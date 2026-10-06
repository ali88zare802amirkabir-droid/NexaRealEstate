import type { Viewing } from "@/lib/types";
import { makeRng, randInt, pick, daysAgo, daysAhead } from "@/lib/rng";
import { customers } from "./customers";
import { agents } from "./agents";
import { properties } from "./properties";

const rng = makeRng(606060);

const TIMES = ["۱۰:۰۰", "۱۱:۰۰", "۱۲:۰۰", "۱۴:۰۰", "۱۵:۰۰", "۱۶:۰۰", "۱۷:۰۰", "۱۸:۰۰"];
const TYPES = ["حضوری", "مجازی", "تلفنی"] as const;

export const viewings: Viewing[] = Array.from({ length: 40 }, (_, i) => {
  const property = properties[i % properties.length];
  const customer = customers[(i * 3 + 1) % customers.length];
  const agent = agents.find((a) => a.id === property.agentId) ?? agents[0];

  const upcoming = i < 18;
  const status: Viewing["status"] = upcoming
    ? rng() > 0.25
      ? "Scheduled"
      : "Confirmed"
    : rng() > 0.5
      ? "Completed"
      : "Cancelled";

  const date = upcoming ? daysAhead(randInt(rng, 1, 21)) : daysAgo(randInt(rng, 1, 120));

  return {
    id: `vwg-${String(1000 + i)}`,
    propertyId: property.id,
    customerId: customer.id,
    agentId: agent.id,
    date,
    time: pick(rng, TIMES),
    type: pick(rng, TYPES),
    status,
    note: rng() > 0.6 ? "لطفاً قبل از بازدید هماهنگ شود." : "",
    createdAt: daysAgo(randInt(rng, 1, 60)),
  } satisfies Viewing;
});

export const viewingById = (id: string) => viewings.find((v) => v.id === id);
export const viewingsByProperty = (propertyId: string) => viewings.filter((v) => v.propertyId === propertyId);
export const viewingsByAgent = (agentId: string) => viewings.filter((v) => v.agentId === agentId);
export const viewingsByCustomer = (customerId: string) => viewings.filter((v) => v.customerId === customerId);
