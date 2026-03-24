'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Crown,
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
  Percent,
  Calendar,
  ChevronRight,
  Star,
  Gift,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useResellerStore, RESELLER_TIERS, Reseller } from '@/stores/reseller'
import { useTranslation } from '@/stores/language'
import { formatPrice } from '@/stores/cart'

function ResellerDashboardContent({ reseller }: { reseller: Reseller }) {
  const { language } = useTranslation()
  const { getResellerTier, getOrdersForReseller } = useResellerStore()

  const currentTier = getResellerTier(reseller)
  const orders = getOrdersForReseller(reseller.id)

  // Find next tier
  const currentTierIndex = RESELLER_TIERS.findIndex((t) => t.id === currentTier.id)
  const nextTier = currentTierIndex < RESELLER_TIERS.length - 1 ? RESELLER_TIERS[currentTierIndex + 1] : null

  // Calculate progress to next tier
  const getProgressToNextTier = () => {
    if (!nextTier) return { ordersProgress: 100, spentProgress: 100 }

    const ordersProgress = Math.min(
      100,
      (reseller.ordersThisMonth / nextTier.minOrdersPerMonth) * 100
    )
    const spentProgress = Math.min(
      100,
      (reseller.totalSpent / nextTier.minTotalSpent) * 100
    )

    return { ordersProgress, spentProgress }
  }

  const progress = getProgressToNextTier()

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString))
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 py-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-80 mb-1">
                {language === 'id' ? 'Selamat datang,' : 'Welcome,'}
              </p>
              <h1 className="text-xl font-bold">{reseller.name}</h1>
              <p className="text-sm opacity-80">{reseller.businessName}</p>
            </div>
            <div className={`px-3 py-1.5 rounded-full ${currentTier.color}`}>
              <span className="text-lg">{currentTier.badge}</span>
              <span className="ml-1 text-sm font-medium">
                {language === 'id' ? currentTier.nameId : currentTier.name}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          {reseller.status === 'pending' && (
            <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-300" />
                <div>
                  <p className="font-medium text-yellow-100">
                    {language === 'id' ? 'Menunggu Verifikasi' : 'Pending Verification'}
                  </p>
                  <p className="text-xs text-yellow-200/80">
                    {language === 'id'
                      ? 'Tim kami akan menghubungi Anda dalam 1-2 hari kerja'
                      : 'Our team will contact you within 1-2 business days'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {reseller.status === 'approved' && (
            <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <div>
                  <p className="font-medium text-green-100">
                    {language === 'id' ? 'Akun Aktif' : 'Account Active'}
                  </p>
                  <p className="text-xs text-green-200/80">
                    {language === 'id' ? 'Anda bisa menikmati harga reseller' : 'You can enjoy reseller pricing'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-lg mx-auto px-4 -mt-4">
        <div className="bg-background rounded-xl border shadow-sm p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{reseller.totalOrders}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'id' ? 'Total Order' : 'Total Orders'}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{reseller.ordersThisMonth}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'id' ? 'Bulan Ini' : 'This Month'}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">-{currentTier.discountPercent}%</p>
              <p className="text-xs text-muted-foreground">
                {language === 'id' ? 'Diskon' : 'Discount'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Spent */}
      <div className="max-w-lg mx-auto px-4 mt-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4">
          <p className="text-sm opacity-90 mb-1">
            {language === 'id' ? 'Total Belanja' : 'Total Spent'}
          </p>
          <p className="text-3xl font-bold">{formatPrice(reseller.totalSpent)}</p>
          {reseller.lastOrderAt && (
            <p className="text-xs opacity-75 mt-1">
              {language === 'id' ? 'Order terakhir:' : 'Last order:'} {formatDate(reseller.lastOrderAt)}
            </p>
          )}
        </div>
      </div>

      {/* Tier Progress */}
      {nextTier && reseller.status === 'approved' && (
        <div className="max-w-lg mx-auto px-4 mt-4">
          <div className="bg-background rounded-xl border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {language === 'id' ? 'Progress ke' : 'Progress to'} {nextTier.badge} {language === 'id' ? nextTier.nameId : nextTier.name}
              </h3>
              <span className="text-sm text-primary font-medium">
                -{nextTier.discountPercent}%
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">
                    {language === 'id' ? 'Order bulan ini' : 'Orders this month'}
                  </span>
                  <span className="font-medium">
                    {reseller.ordersThisMonth}/{nextTier.minOrdersPerMonth}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${progress.ordersProgress}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">
                    {language === 'id' ? 'Total belanja' : 'Total spent'}
                  </span>
                  <span className="font-medium">
                    {formatPrice(reseller.totalSpent)} / {formatPrice(nextTier.minTotalSpent)}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${progress.spentProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Benefits */}
      <div className="max-w-lg mx-auto px-4 mt-4">
        <div className="bg-background rounded-xl border p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Gift className="h-4 w-4 text-primary" />
            {language === 'id' ? 'Benefit Anda' : 'Your Benefits'}
          </h3>
          <ul className="space-y-2">
            {(language === 'id' ? currentTier.benefitsId : currentTier.benefits).map((benefit, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      {reseller.status === 'approved' && (
        <div className="max-w-lg mx-auto px-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <Button asChild className="h-auto py-4">
              <Link href="/products">
                <div className="text-center">
                  <ShoppingCart className="h-6 w-6 mx-auto mb-1" />
                  <span className="text-sm">{language === 'id' ? 'Belanja' : 'Shop'}</span>
                </div>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto py-4">
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                <div className="text-center">
                  <Phone className="h-6 w-6 mx-auto mb-1" />
                  <span className="text-sm">{language === 'id' ? 'Hubungi CS' : 'Contact CS'}</span>
                </div>
              </a>
            </Button>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="max-w-lg mx-auto px-4 mt-6 pb-8">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Package className="h-4 w-4" />
          {language === 'id' ? 'Order Terakhir' : 'Recent Orders'}
        </h3>

        {orders.length === 0 ? (
          <div className="bg-background rounded-xl border p-6 text-center">
            <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              {language === 'id'
                ? 'Belum ada order. Mulai belanja sekarang!'
                : 'No orders yet. Start shopping now!'}
            </p>
            {reseller.status === 'approved' && (
              <Button className="mt-4" asChild>
                <Link href="/products">
                  {language === 'id' ? 'Lihat Produk' : 'Browse Products'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="bg-background rounded-xl border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">#{order.id.slice(-6).toUpperCase()}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'delivered'
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'shipped'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {order.items.length} {language === 'id' ? 'item' : 'items'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold">{formatPrice(order.finalTotal)}</span>
                  <span className="text-xs text-green-600">
                    {language === 'id' ? 'Hemat' : 'Saved'} {formatPrice(order.totalDiscount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Tiers Reference */}
      <div className="max-w-lg mx-auto px-4 pb-8">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Crown className="h-4 w-4" />
          {language === 'id' ? 'Level Reseller' : 'Reseller Tiers'}
        </h3>
        <div className="space-y-2">
          {RESELLER_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`bg-background rounded-lg border p-3 ${
                tier.id === currentTier.id ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{tier.badge}</span>
                  <span className="font-medium text-sm">
                    {language === 'id' ? tier.nameId : tier.name}
                  </span>
                  {tier.id === currentTier.id && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      {language === 'id' ? 'Level Anda' : 'Your Level'}
                    </span>
                  )}
                </div>
                <span className="font-bold text-primary">-{tier.discountPercent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PendingApproval() {
  const { language } = useTranslation()

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-yellow-600" />
        </div>
        <h1 className="text-xl font-bold mb-2">
          {language === 'id' ? 'Pendaftaran Diterima!' : 'Registration Received!'}
        </h1>
        <p className="text-muted-foreground mb-6">
          {language === 'id'
            ? 'Tim kami sedang memverifikasi data Anda. Anda akan dihubungi via WhatsApp dalam 1-2 hari kerja.'
            : 'Our team is verifying your data. You will be contacted via WhatsApp within 1-2 business days.'}
        </p>
        <Button asChild>
          <Link href="/">
            {language === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
          </Link>
        </Button>
      </div>
    </div>
  )
}

function NotRegistered() {
  const { language } = useTranslation()

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-xl font-bold mb-2">
          {language === 'id' ? 'Jadi Reseller UC' : 'Become a Alyanoor Reseller'}
        </h1>
        <p className="text-muted-foreground mb-6">
          {language === 'id'
            ? 'Dapatkan harga khusus hingga 20% lebih murah dan benefit eksklusif lainnya!'
            : 'Get special pricing up to 20% cheaper and other exclusive benefits!'}
        </p>
        <div className="space-y-3">
          <Button className="w-full" asChild>
            <Link href="/reseller/daftar">
              {language === 'id' ? 'Daftar Sekarang' : 'Register Now'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/reseller">
              {language === 'id' ? 'Pelajari Program' : 'Learn More'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function ResellerDashboardInner() {
  const searchParams = useSearchParams()
  const { resellers } = useResellerStore()
  const [reseller, setReseller] = useState<Reseller | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const phone = searchParams.get('phone')
    if (phone) {
      const found = resellers.find((r) => r.phone === phone || r.whatsapp === phone)
      setReseller(found || null)
    } else {
      // Demo: show first reseller or most recent pending
      const pending = resellers.find((r) => r.status === 'pending')
      const approved = resellers.find((r) => r.status === 'approved')
      setReseller(pending || approved || null)
    }
    setLoading(false)
  }, [searchParams, resellers])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!reseller) {
    return <NotRegistered />
  }

  return <ResellerDashboardContent reseller={reseller} />
}

export default function ResellerDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResellerDashboardInner />
    </Suspense>
  )
}
