// NexaRealEstate utilities

import { cn as cnImpl } from "./clsx";
import type { PropertyStatus, ViewingStatus, ReviewStatus, CustomerStatus, NotificationType } from "./types";

export const cn = cnImpl;

export const uid = (prefix = "id") => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

/* ---------- labels ---------- */

export const STATUS_LABELS: Record<string, string> = {
  Active: "فعال",
  Pending: "در انتظار",
  Sold: "فروخته شده",
  Rented: "اجاره داده شده",
  Draft: "پیش‌نویس",
  Scheduled: "زمان‌بندی شده",
  Confirmed: "تأیید شده",
  Completed: "انجام شده",
  Cancelled: "لغو شده",
  Published: "منتشر شده",
  Hidden: "پنهان",
  Flagged: "علامت‌گذاری",
  New: "جدید",
  VIP: "ویژه",
  Blocked: "مسدود",
  Buy: "خرید",
  Rent: "اجاره",
};

export const PURPOSE_LABELS: Record<string, string> = {
  Buy: "خرید",
  Rent: "اجاره",
};

export const VIEWING_TYPE_LABELS: Record<string, string> = {
  "حضوری": "حضوری",
  "مجازی": "مجازی",
  "تلفنی": "تلفنی",
};

export const NOTIFICATION_LABELS: Record<string, string> = {
  new_inquiry: "استعلام جدید",
  new_review: "دیدگاه جدید",
  viewing_request: "درخواست بازدید",
  viewing_reminder: "یادآوری بازدید",
  favorite_activity: "فعالیت علاقه‌مندی",
  listing_approved: "ملک منتشر شد",
  price_change: "تغییر قیمت",
};

/* ---------- formatting ---------- */

export function formatMoney(value: number, compact = false) {
  if (compact && Math.abs(value) >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} میلیارد`;
  if (compact && Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} میلیون`;
  if (compact && Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)} هزار`;
  return `${Math.round(value).toLocaleString("fa-IR")} تومان`;
}

export function formatNumber(value: number) {
  return value.toLocaleString("fa-IR");
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fa-IR", { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelative(iso: string, now = Date.now()) {
  const diff = now - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "همین حالا";
  if (mins < 60) return `${mins} دقیقه پیش`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ساعت پیش`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} روز پیش`;
  return formatDate(iso);
}

export function formatArea(sqm: number) {
  return `${formatNumber(sqm)} متر`;
}

/* ---------- badges ---------- */

export function statusVariant(status: string): string {
  const map: Record<string, string> = {
    Active: "success",
    Confirmed: "success",
    Completed: "success",
    Published: "success",
    Sold: "success",
    Rented: "success",
    Pending: "warning",
    Scheduled: "warning",
    Draft: "default",
    Hidden: "default",
    Cancelled: "danger",
    Flagged: "danger",
    Blocked: "danger",
    New: "info",
    VIP: "violet",
  };
  return map[status] ?? "default";
}

export const propertyStatuses: PropertyStatus[] = ["Active", "Pending", "Sold", "Rented", "Draft"];
export const viewingStatuses: ViewingStatus[] = ["Scheduled", "Confirmed", "Completed", "Cancelled"];
export const reviewStatuses: ReviewStatus[] = ["Published", "Hidden", "Flagged"];
export const customerStatuses: CustomerStatus[] = ["Active", "New", "VIP", "Blocked"];
export const notificationTypes: NotificationType[] = [
  "new_inquiry",
  "new_review",
  "viewing_request",
  "viewing_reminder",
  "favorite_activity",
  "listing_approved",
  "price_change",
];

export function toastVariantFromStatus(status: string): "success" | "danger" | "info" | "warning" {
  if (status === "Completed" || status === "Confirmed" || status === "Published") return "success";
  if (status === "Cancelled" || status === "Flagged") return "danger";
  if (status === "Scheduled" || status === "Pending") return "warning";
  return "info";
}
