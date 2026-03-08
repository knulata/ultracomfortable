'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Package,
  Wallet,
  AlertTriangle,
  Settings,
  ShieldCheck,
  ChevronRight,
  Bell,
} from 'lucide-react'
import { useTranslation } from '@/stores/language'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { language } = useTranslation()

  const sidebarLinks = [
    {
      href: '/admin',
      label: language === 'id' ? 'Dashboard' : 'Dashboard',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/admin/partners',
      label: language === 'id' ? 'Partner' : 'Partners',
      icon: Users,
    },
    {
      href: '/admin/orders',
      label: language === 'id' ? 'Pesanan' : 'Orders',
      icon: Package,
    },
    {
      href: '/admin/payouts',
      label: language === 'id' ? 'Payout' : 'Payouts',
      icon: Wallet,
    },
    {
      href: '/admin/inventory',
      label: language === 'id' ? 'Inventori' : 'Inventory',
      icon: AlertTriangle,
    },
    {
      href: '/admin/settings',
      label: language === 'id' ? 'Pengaturan' : 'Settings',
      icon: Settings,
    },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white border-b border-slate-700">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">UC Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold">
                A
              </div>
              <span className="text-sm">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              {language === 'id' ? 'Beranda' : 'Home'}
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Admin</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-background rounded-xl p-4 sticky top-24">
              <nav className="space-y-1">
                {sidebarLinks.map((link) => {
                  const isActive = link.exact
                    ? pathname === link.href
                    : pathname.startsWith(link.href)

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <link.icon className="h-4 w-4" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
