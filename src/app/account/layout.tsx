'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Package, Heart, MapPin, Settings, Gift, Users, Flame, Tag, LogOut, ChevronRight } from 'lucide-react'

const sidebarLinks = [
  { href: '/account', label: 'Dashboard', icon: User, exact: true },
  { href: '/account/orders', label: 'My Orders', icon: Package },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/points', label: 'UC Points', icon: Gift },
  { href: '/account/coupons', label: 'Coupons', icon: Tag },
  { href: '/account/check-in', label: 'Daily Check-in', icon: Flame },
  { href: '/account/referrals', label: 'Referrals', icon: Users },
  { href: '/account/settings', label: 'Settings', icon: Settings },
]

// Mock user data
const mockUser = {
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  avatar: null,
  membership_tier: 'gold' as const,
  points: 12450,
}

const tierColors = {
  bronze: 'bg-amber-700',
  silver: 'bg-gray-400',
  gold: 'bg-yellow-500',
  platinum: 'bg-purple-500',
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Breadcrumb */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">My Account</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-background rounded-xl p-6 sticky top-24">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{mockUser.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs text-white px-2 py-0.5 rounded-full capitalize ${tierColors[mockUser.membership_tier]}`}>
                      {mockUser.membership_tier}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {mockUser.points.toLocaleString()} pts
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {sidebarLinks.map((link) => {
                  const isActive = link.exact
                    ? pathname === link.href
                    : pathname.startsWith(link.href)

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <link.icon className="h-5 w-5" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  )
                })}

                <button className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-muted w-full text-left text-red-500">
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
