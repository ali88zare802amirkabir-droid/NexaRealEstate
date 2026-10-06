"use client";

// Centralised, mutable app state. All demo interactions flow through here so
// the UI always reflects the same single source of truth.

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import type {
  AppSettings,
  Conversation,
  Customer,
  Notification,
  Property,
  Review,
  Toast,
  UserProfile,
  Viewing,
  ViewingStatus,
} from "@/lib/types";
import { properties as seedProperties, propertyById } from "@/data/properties";
import { agents as seedAgents } from "@/data/agents";
import { customers as seedCustomers } from "@/data/customers";
import { areas as seedAreas } from "@/data/areas";
import { reviews as seedReviews } from "@/data/reviews";
import { viewings as seedViewings } from "@/data/viewings";
import { conversations as seedConversations } from "@/data/conversations";
import { notifications as seedNotifications } from "@/data/notifications";
import { userProfile as seedProfile, defaultSettings } from "@/data/settings";
import { NOW } from "@/lib/rng";

export interface ToastMsg {
  id: string;
  title: string;
  description?: string;
  variant: "success" | "danger" | "info" | "warning";
}

interface State {
  properties: Property[];
  agents: typeof seedAgents;
  customers: typeof seedCustomers;
  areas: typeof seedAreas;
  reviews: typeof seedReviews;
  viewings: typeof seedViewings;
  conversations: typeof seedConversations;
  notifications: typeof seedNotifications;
  favorites: string[];
  comparison: string[];
  settings: AppSettings;
  profile: UserProfile;
  toasts: ToastMsg[];
  sidebarOpen: boolean;
  searchOpen: boolean;
  notificationsOpen: boolean;
}

type Action =
  | { type: "ADD_PROPERTY"; payload: Property }
  | { type: "UPDATE_PROPERTY"; payload: { id: string; updates: Partial<Property> } }
  | { type: "DUPLICATE_PROPERTY"; payload: string }
  | { type: "DELETE_PROPERTY"; payload: string }
  | { type: "TOGGLE_FAVORITE"; payload: string }
  | { type: "TOGGLE_COMPARE"; payload: string }
  | { type: "ADD_VIEWING"; payload: Viewing }
  | { type: "UPDATE_VIEWING"; payload: { id: string; updates: Partial<Viewing> } }
  | { type: "SEND_MESSAGE"; payload: { conversationId: string; text: string } }
  | { type: "MARK_CONVERSATION_READ"; payload: string }
  | { type: "READ_NOTIFICATION"; payload: string }
  | { type: "READ_ALL_NOTIFICATIONS" }
  | { type: "CLEAR_NOTIFICATIONS" }
  | { type: "ADD_TOAST"; payload: ToastMsg }
  | { type: "DISMISS_TOAST"; payload: string }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SIDEBAR"; payload: boolean }
  | { type: "TOGGLE_SEARCH" }
  | { type: "SET_SEARCH"; payload: boolean }
  | { type: "TOGGLE_NOTIFICATIONS" }
  | { type: "SET_NOTIFICATIONS"; payload: boolean }
  | { type: "UPDATE_SETTINGS"; payload: Partial<AppSettings> }
  | { type: "UPDATE_PROFILE"; payload: Partial<UserProfile> }
  | { type: "HYDRATE"; payload: Partial<State> };

const nowIso = () => new Date(NOW).toISOString();

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_PROPERTY":
      return { ...state, properties: [action.payload, ...state.properties] };

    case "UPDATE_PROPERTY":
      return {
        ...state,
        properties: state.properties.map((p) => (p.id === action.payload.id ? { ...p, ...action.payload.updates } : p)),
      };

    case "DUPLICATE_PROPERTY": {
      const src = state.properties.find((p) => p.id === action.payload);
      if (!src) return state;
      const copy: Property = {
        ...src,
        id: `prp-${Date.now().toString().slice(-6)}`,
        slug: `prp-${Date.now().toString(36)}`,
        title: `${src.title} (کپی)`,
        status: "Draft",
        views: 0,
        favorites: 0,
        inquiries: 0,
        publishedAt: nowIso(),
      };
      return { ...state, properties: [copy, ...state.properties] };
    }

    case "DELETE_PROPERTY":
      return { ...state, properties: state.properties.filter((p) => p.id !== action.payload) };

    case "TOGGLE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter((id) => id !== action.payload)
          : [...state.favorites, action.payload],
      };

    case "TOGGLE_COMPARE": {
      const has = state.comparison.includes(action.payload);
      if (has) return { ...state, comparison: state.comparison.filter((id) => id !== action.payload) };
      if (state.comparison.length >= 4) return state;
      return { ...state, comparison: [...state.comparison, action.payload] };
    }

    case "ADD_VIEWING":
      return { ...state, viewings: [action.payload, ...state.viewings] };

    case "UPDATE_VIEWING":
      return {
        ...state,
        viewings: state.viewings.map((v) => (v.id === action.payload.id ? { ...v, ...action.payload.updates } : v)),
      };

    case "SEND_MESSAGE": {
      const { conversationId, text } = action.payload;
      return {
        ...state,
        conversations: state.conversations.map((c) => {
          if (c.id !== conversationId) return c;
          const msg = { id: `msg-${Date.now()}`, from: "customer" as const, text, at: nowIso() };
          return { ...c, messages: [...c.messages, msg], lastMessage: text, lastMessageAt: msg.at, unread: 0 };
        }),
      };
    }

    case "MARK_CONVERSATION_READ":
      return {
        ...state,
        conversations: state.conversations.map((c) => (c.id === action.payload ? { ...c, unread: 0 } : c)),
      };

    case "READ_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.map((n) => (n.id === action.payload ? { ...n, read: true } : n)),
      };

    case "READ_ALL_NOTIFICATIONS":
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) };

    case "CLEAR_NOTIFICATIONS":
      return { ...state, notifications: [] };

    case "ADD_TOAST":
      return { ...state, toasts: [...state.toasts, action.payload] };

    case "DISMISS_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };

    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case "SET_SIDEBAR":
      return { ...state, sidebarOpen: action.payload };

    case "TOGGLE_SEARCH":
      return { ...state, searchOpen: !state.searchOpen };

    case "SET_SEARCH":
      return { ...state, searchOpen: action.payload };

    case "TOGGLE_NOTIFICATIONS":
      return { ...state, notificationsOpen: !state.notificationsOpen };

    case "SET_NOTIFICATIONS":
      return { ...state, notificationsOpen: action.payload };

    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case "UPDATE_PROFILE":
      return { ...state, profile: { ...state.profile, ...action.payload } };

    case "HYDRATE":
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

const initialState: State = {
  properties: seedProperties,
  agents: seedAgents,
  customers: seedCustomers,
  areas: seedAreas,
  reviews: seedReviews,
  viewings: seedViewings,
  conversations: seedConversations,
  notifications: seedNotifications,
  favorites: [],
  comparison: [],
  settings: defaultSettings,
  profile: seedProfile,
  toasts: [],
  sidebarOpen: true,
  searchOpen: false,
  notificationsOpen: false,
};

const StateCtx = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

const STORAGE_KEY = "nexarealestate-state-v1";

export function MarketProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<State>;
      dispatch({
        type: "HYDRATE",
        payload: {
          settings: saved.settings ?? defaultSettings,
          profile: saved.profile ?? seedProfile,
          sidebarOpen: saved.sidebarOpen ?? true,
          favorites: saved.favorites ?? [],
          comparison: saved.comparison ?? [],
        },
      });
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          settings: state.settings,
          profile: state.profile,
          sidebarOpen: state.sidebarOpen,
          favorites: state.favorites,
          comparison: state.comparison,
        }),
      );
    } catch {
      /* storage unavailable */
    }
  }, [state.settings, state.profile, state.sidebarOpen, state.favorites, state.comparison]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StateCtx.Provider value={value}>{children}</StateCtx.Provider>;
}

function useMarket() {
  const ctx = useContext(StateCtx);
  if (!ctx) throw new Error("useMarket must be used inside MarketProvider");
  return ctx;
}

let toastSeq = 0;

export function useApp() {
  const { state, dispatch } = useMarket();

  const toast = (title: string, variant: ToastMsg["variant"] = "success", description?: string) => {
    toastSeq += 1;
    const id = `t-${Date.now()}-${toastSeq}`;
    dispatch({ type: "ADD_TOAST", payload: { id, title, description, variant } });
    setTimeout(() => dispatch({ type: "DISMISS_TOAST", payload: id }), 4200);
  };

  return {
    ...state,
    toast,
    dispatch,

    propertyById: (id: string) => state.properties.find((p) => p.id === id) ?? propertyById(id),
    agentById: (id: string) => state.agents.find((a) => a.id === id),
    customerById: (id: string) => state.customers.find((c) => c.id === id),
    areaById: (id: string) => state.areas.find((a) => a.id === id),
    isFavorite: (id: string) => state.favorites.includes(id),
    isComparing: (id: string) => state.comparison.includes(id),
    favoritesCount: state.favorites.length,
    unreadMessages: state.conversations.reduce((s, c) => s + c.unread, 0),
    upcomingViewingsCount: state.viewings.filter((v) => v.status === "Scheduled" || v.status === "Confirmed").length,

    toggleFavorite: (id: string) => {
      const was = state.favorites.includes(id);
      dispatch({ type: "TOGGLE_FAVORITE", payload: id });
      toast(was ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد", "info");
    },
    toggleCompare: (id: string) => {
      const was = state.comparison.includes(id);
      if (!was && state.comparison.length >= 4) {
        toast("حداکثر ۴ ملک برای مقایسه", "warning");
        return;
      }
      dispatch({ type: "TOGGLE_COMPARE", payload: id });
      toast(was ? "از مقایسه حذف شد" : "به مقایسه اضافه شد", "info");
    },
    clearComparison: () => dispatch({ type: "HYDRATE", payload: { comparison: [] } }),

    addProperty: (property: Property) => {
      dispatch({ type: "ADD_PROPERTY", payload: property });
      toast("ملک جدید ثبت شد", "success", property.title);
    },
    updateProperty: (id: string, updates: Partial<Property>) => {
      dispatch({ type: "UPDATE_PROPERTY", payload: { id, updates } });
      toast("ملک به‌روزرسانی شد", "success");
    },
    duplicateProperty: (id: string) => {
      dispatch({ type: "DUPLICATE_PROPERTY", payload: id });
      toast("ملک کپی شد", "success", "نسخه کپی به‌صورت پیش‌نویس ساخته شد");
    },
    deleteProperty: (id: string) => {
      dispatch({ type: "DELETE_PROPERTY", payload: id });
      toast("ملک حذف شد", "danger");
    },

    requestViewing: (viewing: Viewing) => {
      dispatch({ type: "ADD_VIEWING", payload: viewing });
      toast("درخواست بازدید ثبت شد", "success", viewing.id);
    },
    updateViewing: (id: string, updates: Partial<Viewing>) => {
      dispatch({ type: "UPDATE_VIEWING", payload: { id, updates } });
      toast("وضعیت بازدید تغییر کرد", "success");
    },

    sendMessage: (conversationId: string, text: string) => {
      dispatch({ type: "SEND_MESSAGE", payload: { conversationId, text } });
    },
    markConversationRead: (id: string) => dispatch({ type: "MARK_CONVERSATION_READ", payload: id }),

    readNotification: (id: string) => dispatch({ type: "READ_NOTIFICATION", payload: id }),
    readAllNotifications: () => {
      dispatch({ type: "READ_ALL_NOTIFICATIONS" });
      toast("همه اعلان‌ها خوانده شد", "info");
    },
    clearNotifications: () => {
      dispatch({ type: "CLEAR_NOTIFICATIONS" });
      toast("اعلان‌ها پاک شد", "info");
    },

    updateSettings: (updates: Partial<AppSettings>) => {
      dispatch({ type: "UPDATE_SETTINGS", payload: updates });
      toast("تنظیمات ذخیره شد", "success");
    },
    updateProfile: (updates: Partial<UserProfile>) => {
      dispatch({ type: "UPDATE_PROFILE", payload: updates });
      toast("پروفایل ذخیره شد", "success");
    },

    toggleSidebar: () => dispatch({ type: "TOGGLE_SIDEBAR" }),
    setSidebar: (open: boolean) => dispatch({ type: "SET_SIDEBAR", payload: open }),
    toggleSearch: () => dispatch({ type: "TOGGLE_SEARCH" }),
    setSearch: (open: boolean) => dispatch({ type: "SET_SEARCH", payload: open }),
    toggleNotifications: () => dispatch({ type: "TOGGLE_NOTIFICATIONS" }),
    setNotifications: (open?: boolean) => {
      if (open === undefined) dispatch({ type: "TOGGLE_NOTIFICATIONS" });
      else dispatch({ type: "SET_NOTIFICATIONS", payload: open });
    },
  };
}

export const useMarketState = () => useMarket().state;
