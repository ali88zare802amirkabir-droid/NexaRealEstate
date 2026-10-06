import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexaRealEstate — پلتفرم خرید و فروش ملک",
  description:
    "جستجو و کشف ملک برای خرید و اجاره، با نقشه، مقایسه، بازدید و مشاورین حرفه‌ای",
  keywords: ["ملک", "خرید ملک", "اجاره ملک", "آپارتمان", "ویلا", " مشاور املاک"],
  openGraph: {
    title: "NexaRealEstate",
    description: "پلتفرم خرید، فروش و اجاره ملک با نقشه و مقایسه",
    type: "website",
    locale: "fa_IR",
  },
};

export const viewport: Viewport = {
  themeColor: "#080b11",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className="min-h-screen bg-bg text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}