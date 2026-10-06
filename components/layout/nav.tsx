"use client";

import type { ReactNode } from "react";
import {
  Compass,
  Building2,
  Map,
  Heart,
  CalendarCheck,
  MessageSquare,
  Users,
  Home,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  LogOut,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
}

export const NAV: NavItem[] = [
  { id: "discover", label: "کشف", href: "/", icon: <Compass className="size-4.5" /> },
  { id: "properties", label: "املاک", href: "/properties", icon: <Building2 className="size-4.5" /> },
  { id: "map", label: "نقشه", href: "/map", icon: <Map className="size-4.5" /> },
  { id: "favorites", label: "علاقه‌مندی‌ها", href: "/favorites", icon: <Heart className="size-4.5" /> },
  { id: "viewings", label: "بازدیدها", href: "/viewings", icon: <CalendarCheck className="size-4.5" /> },
  { id: "messages", label: "پیام‌ها", href: "/messages", icon: <MessageSquare className="size-4.5" /> },
  { id: "agents", label: "مشاوران", href: "/agents", icon: <Users className="size-4.5" /> },
  { id: "listings", label: "ملک‌های من", href: "/listings", icon: <Home className="size-4.5" /> },
  { id: "analytics", label: "آنالیتیکس", href: "/analytics", icon: <BarChart3 className="size-4.5" /> },
  { id: "settings", label: "تنظیمات", href: "/settings", icon: <Settings className="size-4.5" /> },
];

export const MOBILE_NAV = NAV.slice(0, 5);

export const ICONS = { Bell, Search, Menu, LogOut };
