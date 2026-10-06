// NexaRealEstate domain types

export type PropertyType = "آپارتمان" | "ویلا" | "خانه ویلایی" | "پنت‌هاوس" | "زمین" | "تجاری";
export type Purpose = "Buy" | "Rent";
export type PropertyStatus = "Active" | "Pending" | "Sold" | "Rented" | "Draft";
export type ViewingStatus = "Scheduled" | "Confirmed" | "Completed" | "Cancelled";
export type ViewingType = "حضوری" | "مجازی" | "تلفنی";
export type ReviewStatus = "Published" | "Hidden" | "Flagged";
export type CustomerStatus = "Active" | "New" | "VIP" | "Blocked";
export type NotificationType =
  | "new_inquiry"
  | "new_review"
  | "viewing_request"
  | "viewing_reminder"
  | "favorite_activity"
  | "listing_approved"
  | "price_change";

export interface Area {
  id: string;
  name: string;
  city: string;
  district: string;
  avgPrice: number;
  listings: number;
  rating: number;
  mapX: number;
  mapY: number;
}

export interface Agent {
  id: string;
  name: string;
  city: string;
  area: string;
  email: string;
  phone: string;
  avatarColor: string;
  rating: number;
  experience: number;
  specialties: string[];
  responseTime: string;
  joinedAt: string;
  bio: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  status: CustomerStatus;
  city: string;
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  lastOrderAt: string;
  joinedAt: string;
  favorites: string[];
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  type: PropertyType;
  purpose: Purpose;
  price: number;
  area: number;
  beds: number;
  baths: number;
  parking: number;
  yearBuilt: number;
  furnished: boolean;
  elevator: boolean;
  balcony: boolean;
  storage: boolean;
  security: boolean;
  ac: boolean;
  heating: boolean;
  address: string;
  city: string;
  areaId: string;
  agentId: string;
  status: PropertyStatus;
  views: number;
  favorites: number;
  inquiries: number;
  imageTone: number;
  mapX: number;
  mapY: number;
  coords: string;
  description: string;
  features: string[];
  nearby: string[];
  publishedAt: string;
  isMine: boolean;
}

export interface Review {
  id: string;
  propertyId: string;
  agentId: string;
  customerId: string;
  rating: number;
  title: string;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
  helpful: number;
}

export interface Viewing {
  id: string;
  propertyId: string;
  customerId: string;
  agentId: string;
  date: string;
  time: string;
  type: ViewingType;
  status: ViewingStatus;
  note: string;
  createdAt: string;
}

export interface Message {
  id: string;
  from: "agent" | "customer";
  text: string;
  at: string;
}

export interface Conversation {
  id: string;
  propertyId: string;
  customerId: string;
  agentId: string;
  subject: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
  messages: Message[];
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarColor: string;
}

export interface AppSettings {
  companyName: string;
  supportEmail: string;
  timezone: string;
  currency: string;
  defaultCommissionRate: number;
  payoutThreshold: number;
  autoApproveSellers: boolean;
  orders: {
    newOrderNotifications: boolean;
    lowStockAlerts: boolean;
    reviewAlerts: boolean;
    payoutAlerts: boolean;
  };
  appearance: {
    theme: "dark" | "light" | "system";
    density: "compact" | "comfortable";
    reducedMotion: boolean;
  };
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: "success" | "danger" | "info" | "warning";
}
