// Derived analytics — every KPI/chart comes from here. Never hardcode in pages.

import { properties, activeProperties } from "@/data/properties";
import { agents } from "@/data/agents";
import { customers } from "@/data/customers";
import { areas } from "@/data/areas";
import { reviews } from "@/data/reviews";
import { viewings } from "@/data/viewings";
import { conversations } from "@/data/conversations";
import { NOW, DAY } from "@/lib/rng";

export const totalProperties = properties.length;
export const forSale = properties.filter((p) => p.purpose === "Buy" && p.status === "Active");
export const forRent = properties.filter((p) => p.purpose === "Rent" && p.status === "Active");
export const totalAgents = agents.length;
export const activeAgents = agents.filter((a) => a.rating >= 4.5);
export const totalCustomers = customers.length;
export const totalViewings = viewings.length;
export const upcomingViewings = viewings.filter((v) => v.status === "Scheduled" || v.status === "Confirmed");
export const completedViewings = viewings.filter((v) => v.status === "Completed");
export const totalConversations = conversations.length;
export const totalViews = properties.reduce((s, p) => s + p.views, 0);
export const totalFavorites = properties.reduce((s, p) => s + p.favorites, 0);
export const totalInquiries = properties.reduce((s, p) => s + p.inquiries, 0);
export const conversionRate = totalViews > 0 ? Math.round((totalInquiries / totalViews) * 1000) / 10 : 0;

export const avgSalePrice = forSale.length ? Math.round(forSale.reduce((s, p) => s + p.price, 0) / forSale.length) : 0;
export const avgRent = forRent.length ? Math.round(forRent.reduce((s, p) => s + p.price, 0) / forRent.length) : 0;
export const avgArea = activeProperties.length ? Math.round(activeProperties.reduce((s, p) => s + p.area, 0) / activeProperties.length) : 0;
export const avgRating = reviews.length ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10 : 0;

export interface Kpi {
  label: string;
  value: string;
  hint: string;
  tone: "accent" | "ok" | "warn" | "danger" | "cyan" | "violet";
}

export function overviewKpis(): Kpi[] {
  return [
    { label: "ملک فعال", value: formatNum(activeProperties.length), hint: `${formatNum(totalProperties)} کل ملک`, tone: "accent" },
    { label: "برای خرید", value: formatNum(forSale.length), hint: `میانگین ${formatMoney(avgSalePrice, true)}`, tone: "cyan" },
    { label: "برای اجاره", value: formatNum(forRent.length), hint: `میانگین ${formatMoney(avgRent, true)}`, tone: "violet" },
    { label: "بازدید پیش‌رو", value: formatNum(upcomingViewings.length), hint: `${formatNum(completedViewings.length)} انجام‌شده`, tone: "ok" },
    { label: "نرخ تبدیل", value: `${formatNum(conversionRate)}٪`, hint: `${formatNum(totalInquiries)} استعلام`, tone: "warn" },
    { label: "مشتریان", value: formatNum(totalCustomers), hint: `${formatNum(totalAgents)} مشاور`, tone: "accent" },
  ];
}

function formatNum(v: number) {
  return v.toLocaleString("fa-IR");
}

function formatMoney(v: number, compact = false) {
  if (compact && Math.abs(v) >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} میلیارد`;
  if (compact && Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} میلیون`;
  return `${Math.round(v).toLocaleString("fa-IR")} تومان`;
}

export function dailySeries(days: number) {
  const out: { label: string; views: number; leads: number; viewings: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(NOW - i * DAY);
    const key = d.toISOString().slice(0, 10);
    const dayViewings = viewings.filter((v) => v.date.slice(0, 10) === key);
    const dayConversations = conversations.filter((c) => c.lastMessageAt.slice(0, 10) === key);
    out.push({
      label: d.toLocaleDateString("fa-IR", { day: "numeric", month: "short" }),
      views: properties.reduce((s, p) => s + (p.publishedAt.slice(0, 10) === key ? p.views : 0), 0),
      leads: dayConversations.length,
      viewings: dayViewings.length,
    });
  }
  return out;
}

export function propertyPerformance(limit = 8) {
  return [...activeProperties]
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
    .map((p) => ({
      id: p.id,
      label: p.title,
      views: p.views,
      favorites: p.favorites,
      inquiries: p.inquiries,
      value: p.views,
    }));
}

export function topListings(limit = 6) {
  return [...activeProperties].sort((a, b) => b.favorites - a.favorites).slice(0, limit);
}

export function areaStats(limit = 8) {
  return areas
    .map((a) => {
      const list = properties.filter((p) => p.areaId === a.id);
      return {
        id: a.id,
        label: a.name,
        count: list.length,
        avgPrice: list.length ? Math.round(list.reduce((s, p) => s + p.price, 0) / list.length) : 0,
        value: list.length,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function agentStats(limit = 8) {
  return agents
    .map((a) => {
      const list = properties.filter((p) => p.agentId === a.id);
      const agentReviews = reviews.filter((r) => r.agentId === a.id);
      const agentViewings = viewings.filter((v) => v.agentId === a.id);
      return {
        id: a.id,
        label: a.name,
        listings: list.length,
        sold: list.filter((p) => p.status === "Sold" || p.status === "Rented").length,
        rating: a.rating,
        viewings: agentViewings.length,
        reviews: agentReviews.length,
        value: list.length,
      };
    })
    .sort((a, b) => b.listings - a.listings)
    .slice(0, limit);
}

export function ratingDistribution() {
  return [5, 4, 3, 2, 1].map((star) => ({
    label: `${star} ستاره`,
    value: reviews.filter((r) => r.rating === star).length,
    color: star >= 4 ? "#35d08a" : star === 3 ? "#f5b53d" : "#f4736f",
  }));
}

export function purposeBreakdown() {
  return [
    { label: "خرید", value: forSale.length, color: "#4c9aff" },
    { label: "اجاره", value: forRent.length, color: "#2fd4e8" },
  ];
}

export function typeBreakdown() {
  const types = ["آپارتمان", "ویلا", "خانه ویلایی", "پنت‌هاوس", "زمین", "تجاری"];
  return types.map((t) => ({
    label: t,
    value: activeProperties.filter((p) => p.type === t).length,
  }));
}
