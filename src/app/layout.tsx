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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UC | Ultra Comfortable - Fashion for Everyone",
  description: "Discover affordable, trendy fashion at UC. Shop the latest styles in women's, men's, and kids' clothing. Free shipping on orders over Rp 500.000.",
  keywords: ["fashion", "clothing", "UC", "Ultra Comfortable", "Indonesia", "affordable fashion"],
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
        </Providers>
      </body>
    </html>
  );
}
