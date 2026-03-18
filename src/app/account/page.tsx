import Link from 'next/link'
import { Package, Heart, MapPin, Gift, ChevronRight, Truck, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/stores/cart'
import { ReferralBanner } from '@/components/referral'

// Mock data
const mockUser = {
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  membership_tier: 'gold' as const,
  points: 12450,
  next_tier_points: 20000,
}

const mockRecentOrders = [
  {
    id: 'UC-12345678',
    date: '2026-02-28',
    status: 'shipped',
    total: 598000,
    items: 3,
  },
  {
    id: 'UC-12345677',
    date: '2026-02-20',
    status: 'delivered',
    total: 299000,
    items: 1,
  },
  {
    id: 'UC-12345676',
    date: '2026-02-15',
    status: 'delivered',
    total: 847000,
    items: 4,
  },
]

const mockWishlistItems = [
  { id: '1', name: 'Oversized Blazer', price: 549000, sale_price: 399000 },
  { id: '2', name: 'Pleated Midi Skirt', price: 299000, sale_price: null },
  { id: '3', name: 'Ribbed Knit Top', price: 199000, sale_price: 149000 },
]

const statusConfig = {
  pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-50', icon: Clock },
  paid: { label: 'Paid', color: 'text-blue-600 bg-blue-50', icon: CheckCircle },
  processing: { label: 'Processing', color: 'text-blue-600 bg-blue-50', icon: Package },
  shipped: { label: 'Shipped', color: 'text-purple-600 bg-purple-50', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-green-600 bg-green-50', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-600 bg-red-50', icon: Clock },
}

const tierBenefits = {
  bronze: { discount: 0, freeShipping: false },
  silver: { discount: 2, freeShipping: false },
  gold: { discount: 5, freeShipping: true },
  platinum: { discount: 10, freeShipping: true },
}

export default function AccountDashboard() {
  const benefits = tierBenefits[mockUser.membership_tier]
  const progressToNextTier = (mockUser.points / mockUser.next_tier_points) * 100

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-background rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {mockUser.name.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">
          Manage your orders, wishlist, and account settings.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/account/orders" className="bg-background rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold mt-3">{mockRecentOrders.length}</p>
          <p className="text-sm text-muted-foreground">Total Orders</p>
        </Link>

        <Link href="/account/wishlist" className="bg-background rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Heart className="h-5 w-5 text-pink-600" />
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold mt-3">{mockWishlistItems.length}</p>
          <p className="text-sm text-muted-foreground">Wishlist Items</p>
        </Link>

        <Link href="/account/addresses" className="bg-background rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold mt-3">2</p>
          <p className="text-sm text-muted-foreground">Saved Addresses</p>
        </Link>

        <Link href="/account/points" className="bg-background rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Gift className="h-5 w-5 text-yellow-600" />
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold mt-3">{mockUser.points.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Alya Points</p>
        </Link>
      </div>

      {/* Membership Status */}
      <div className="bg-background rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Membership Status</h2>
          <Link href="/account/points" className="text-sm text-primary hover:underline">
            View Benefits
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl font-bold capitalize">{mockUser.membership_tier}</span>
              <span className="text-sm text-muted-foreground">Member</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress to Platinum</span>
                <span className="font-medium">{mockUser.points.toLocaleString()} / {mockUser.next_tier_points.toLocaleString()} pts</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min(progressToNextTier, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Earn {(mockUser.next_tier_points - mockUser.points).toLocaleString()} more points to reach Platinum!
              </p>
            </div>
          </div>

          <div className="sm:w-48 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-2">Your Benefits:</p>
            <ul className="text-sm space-y-1">
              {benefits.discount > 0 && (
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {benefits.discount}% discount
                </li>
              )}
              {benefits.freeShipping && (
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Free shipping
                </li>
              )}
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Early access
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Referral Banner */}
      <ReferralBanner />

      {/* Recent Orders */}
      <div className="bg-background rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm text-primary hover:underline">
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {mockRecentOrders.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig]
            const StatusIcon = status.icon

            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items} items • {order.date}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold">{formatPrice(order.total)}</p>
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${status.color}`}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Wishlist Preview */}
      <div className="bg-background rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Wishlist</h2>
          <Link href="/account/wishlist" className="text-sm text-primary hover:underline">
            View All
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {mockWishlistItems.map((item) => (
            <div key={item.id} className="group">
              <div className="aspect-[3/4] bg-muted rounded-lg mb-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />
              </div>
              <p className="text-sm font-medium line-clamp-1">{item.name}</p>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                  {formatPrice(item.sale_price ?? item.price)}
                </span>
                {item.sale_price && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(item.price)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
