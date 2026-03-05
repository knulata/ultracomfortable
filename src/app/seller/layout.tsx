'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  Bell,
  ArrowLeft,
  Store,
} from 'lucide-react'

const navItems = [
  { href: '/seller', label: 'Dashboard', labelId: 'Dasbor', icon: LayoutDashboard },
  { href: '/seller/products', label: 'Products', labelId: 'Produk', icon: Package },
  { href: '/seller/orders', label: 'Orders', labelId: 'Pesanan', icon: ShoppingCart },
  { href: '/seller/settlements', label: 'Settlements', labelId: 'Settlement', icon: Wallet },
  { href: '/seller/notifications', label: 'Notifications', labelId: 'Notifikasi', icon: Bell },
]

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="text-lg font-bold flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              Seller Center
            </span>
          </div>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/seller' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.labelId}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
