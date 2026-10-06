"use client";

import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { MobileNav } from "./mobile-nav";
import { Toasts } from "./toasts";
import { useApp } from "@/lib/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useApp();

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      {/* Logical padding keeps the content clear of the sidebar in RTL */}
      <div className={cn("flex min-h-screen flex-col transition-[padding] duration-300", sidebarOpen ? "lg:ps-60" : "lg:ps-0")}>
        <Topbar />
        <main className="flex-1 px-3 pb-24 pt-4 sm:px-5 lg:px-6 lg:pb-8">{children}</main>
      </div>
      <MobileNav />
      <Toasts />
    </div>
  );
}
