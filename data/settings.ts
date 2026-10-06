import type { UserProfile, AppSettings } from "@/lib/types";

export const userProfile: UserProfile = {
  name: "سارا نیک‌پی",
  email: "sara.nikpai@nexarealestate.ir",
  role: "مشاور املاک",
  avatarColor: "#4c9aff",
};

export const defaultSettings: AppSettings = {
  companyName: "NexaRealEstate",
  supportEmail: "support@nexarealestate.ir",
  timezone: "Asia/Tehran",
  currency: "IRR",
  defaultCommissionRate: 2,
  payoutThreshold: 50_000_000,
  autoApproveSellers: false,
  orders: {
    newOrderNotifications: true,
    lowStockAlerts: true,
    reviewAlerts: true,
    payoutAlerts: true,
  },
  appearance: {
    theme: "dark",
    density: "comfortable",
    reducedMotion: false,
  },
};
