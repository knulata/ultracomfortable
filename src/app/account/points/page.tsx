'use client'

import { Gift, Star, ShoppingBag, MessageSquare, Users, TrendingUp, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/stores/cart'

const mockUser = {
  points: 12450,
  lifetime_points: 25600,
  membership_tier: 'gold' as const,
}

const tiers = [
  { name: 'Bronze', min: 0, max: 999, discount: 0, color: 'bg-amber-700' },
  { name: 'Silver', min: 1000, max: 4999, discount: 2, color: 'bg-gray-400' },
  { name: 'Gold', min: 5000, max: 19999, discount: 5, color: 'bg-yellow-500' },
  { name: 'Platinum', min: 20000, max: Infinity, discount: 10, color: 'bg-purple-500' },
]

const earnMethods = [
  { icon: ShoppingBag, title: 'Shop', desc: '1 point per Rp 1,000 spent', points: '1pt/Rp1K' },
  { icon: MessageSquare, title: 'Write Reviews', desc: 'Photo review earns more', points: '50-100 pts' },
  { icon: Users, title: 'Refer Friends', desc: 'When they make first purchase', points: '500 pts' },
  { icon: Star, title: 'Daily Check-in', desc: 'Log in daily to earn', points: '5 pts' },
]

const mockHistory = [
  { id: '1', type: 'earned', desc: 'Order UC-12345678', points: 598, date: '2026-02-28' },
  { id: '2', type: 'earned', desc: 'Photo Review - Oversized Tee', points: 100, date: '2026-02-25' },
  { id: '3', type: 'redeemed', desc: 'Discount on Order UC-12345676', points: -500, date: '2026-02-15' },
  { id: '4', type: 'earned', desc: 'Order UC-12345676', points: 847, date: '2026-02-15' },
  { id: '5', type: 'bonus', desc: 'Welcome Bonus', points: 100, date: '2026-01-01' },
]

export default function PointsPage() {
  const currentTier = tiers.find(t => mockUser.points >= t.min && mockUser.points <= t.max)!
  const nextTier = tiers.find(t => t.min > mockUser.points)
  const progressToNext = nextTier
    ? ((mockUser.points - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Your UC Points</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{mockUser.points.toLocaleString()}</span>
              <span className="text-muted-foreground">pts</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              = {formatPrice(mockUser.points * 10)} value
            </p>
          </div>
          <Button size="lg">
            <Gift className="h-5 w-5 mr-2" />
            Redeem Points
          </Button>
        </div>
      </div>

      {/* Membership Tier */}
      <div className="bg-background rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Membership Tier</h2>

        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 rounded-full ${currentTier.color} flex items-center justify-center`}>
            <Star className="h-8 w-8 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold">{currentTier.name}</p>
            <p className="text-muted-foreground">
              {currentTier.discount > 0 ? `${currentTier.discount}% discount on all orders` : 'Base member'}
            </p>
          </div>
        </div>

        {nextTier && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to {nextTier.name}</span>
              <span className="font-medium">
                {mockUser.points.toLocaleString()} / {nextTier.min.toLocaleString()} pts
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${nextTier.color} rounded-full transition-all`}
                style={{ width: `${progressToNext}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Earn {(nextTier.min - mockUser.points).toLocaleString()} more points to unlock {nextTier.name}!
            </p>
          </div>
        )}

        {/* All Tiers */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          {tiers.map((tier) => {
            const isActive = tier.name === currentTier.name
            return (
              <div
                key={tier.name}
                className={`p-3 rounded-lg text-center ${
                  isActive ? 'bg-primary/10 ring-2 ring-primary' : 'bg-muted/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full ${tier.color} mx-auto mb-2`} />
                <p className={`text-sm font-medium ${isActive ? 'text-primary' : ''}`}>{tier.name}</p>
                <p className="text-xs text-muted-foreground">
                  {tier.discount > 0 ? `${tier.discount}% off` : 'Base'}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* How to Earn */}
      <div className="bg-background rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">How to Earn Points</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {earnMethods.map((method, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="p-3 bg-primary/10 rounded-lg">
                <method.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{method.title}</p>
                <p className="text-sm text-muted-foreground">{method.desc}</p>
              </div>
              <span className="text-sm font-semibold text-primary">{method.points}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Points History */}
      <div className="bg-background rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Points History</h2>
          <button className="text-sm text-primary hover:underline flex items-center">
            View All <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          {mockHistory.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.type === 'earned' ? 'bg-green-100' :
                  item.type === 'bonus' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  {item.type === 'earned' ? <TrendingUp className="h-5 w-5 text-green-600" /> :
                   item.type === 'bonus' ? <Gift className="h-5 w-5 text-yellow-600" /> :
                   <ShoppingBag className="h-5 w-5 text-red-600" />}
                </div>
                <div>
                  <p className="font-medium">{item.desc}</p>
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                </div>
              </div>
              <span className={`font-semibold ${item.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {item.points > 0 ? '+' : ''}{item.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Redeem Info */}
      <div className="bg-muted/50 rounded-xl p-6">
        <h3 className="font-semibold mb-2">Redemption Rules</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 100 points = Rp 1,000 discount</li>
          <li>• Minimum redemption: 500 points</li>
          <li>• Points expire 12 months after earning</li>
          <li>• Cannot be combined with other promotions</li>
        </ul>
      </div>
    </div>
  )
}
