"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MOBILE_NAV } from "./nav";
import { useApp } from "@/lib/store";

export function MobileNav() {
  const pathname = usePathname();
  const { setSidebar } = useApp();

  return (
    <nav aria-label="ناوبری موبایل" className="fixed inset-x-0 bottom-0 z-30 border-t border-edge bg-surface/95 backdrop-blur-md lg:hidden">
      <ul className="grid grid-cols-5">
        {MOBILE_NAV.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={() => setSidebar(false)}
                aria-current={isActive ? "page" : undefined}
                className={cn("flex flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors", isActive ? "text-accent" : "text-ink-3")}
              >
                {item.icon}
                <span className="truncate px-0.5">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
