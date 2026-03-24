import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { EngagementHub } from "@/components/engagement/EngagementHub";
import { LiveActivityFeed } from "@/components/engagement/LiveActivityFeed";
import { UCStylist, StylistButton } from "@/components/stylist";
import { CheckInModal } from "@/components/check-in";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alyanoor - Modest Fashion Indonesia",
  description: "Discover elegant modest fashion at Alyanoor. Premium quality hijab, abaya, and Muslim fashion from Tanah Abang. Free shipping on orders over Rp 500.000.",
  keywords: ["modest fashion", "hijab", "Muslim fashion", "Alyanoor", "Indonesia", "Tanah Abang", "abaya"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <EngagementHub />
          <LiveActivityFeed />
          <StylistButton />
          <UCStylist />
          <CheckInModal />
        </Providers>
      </body>
    </html>
  );
}
