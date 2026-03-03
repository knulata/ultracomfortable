'use client'

import { useState } from 'react'
import { Tag, Search, Gift, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { useCouponStore, Coupon, isExpiringSoon } from '@/stores/coupon'
import { CouponCard } from '@/components/coupon'
import { toast } from 'sonner'
import Link from 'next/link'

type FilterTab = 'all' | 'available' | 'expiring' | 'used'

export default function CouponsPage() {
  const { language } = useTranslation()
  const { availableCoupons, usedCoupons } = useCouponStore()

  const [activeTab, setActiveTab] = useState<FilterTab>('available')
  const [searchQuery, setSearchQuery] = useState('')

  const now = new Date()

  // Filter coupons based on tab
  const getFilteredCoupons = (): Coupon[] => {
    let filtered = availableCoupons

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.descriptionId.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    switch (activeTab) {
      case 'available':
        return filtered.filter(
          (c) =>
            c.isActive &&
            now >= new Date(c.validFrom) &&
            now <= new Date(c.validUntil) &&
            c.usedCount < c.usageLimit
        )
      case 'expiring':
        return filtered.filter(
          (c) =>
            c.isActive &&
            now <= new Date(c.validUntil) &&
            c.usedCount < c.usageLimit &&
            isExpiringSoon(c)
        )
      case 'used':
        return filtered.filter((c) => c.usedCount >= c.usageLimit || now > new Date(c.validUntil))
      default:
        return filtered
    }
  }

  const filteredCoupons = getFilteredCoupons()

  const tabs: { id: FilterTab; label: string; labelId: string; count: number }[] = [
    {
      id: 'available',
      label: 'Available',
      labelId: 'Tersedia',
      count: availableCoupons.filter(
        (c) =>
          c.isActive &&
          now >= new Date(c.validFrom) &&
          now <= new Date(c.validUntil) &&
          c.usedCount < c.usageLimit
      ).length,
    },
    {
      id: 'expiring',
      label: 'Expiring Soon',
      labelId: 'Segera Berakhir',
      count: availableCoupons.filter(
        (c) =>
          c.isActive &&
          now <= new Date(c.validUntil) &&
          c.usedCount < c.usageLimit &&
          isExpiringSoon(c)
      ).length,
    },
    {
      id: 'used',
      label: 'Used/Expired',
      labelId: 'Terpakai/Kadaluarsa',
      count: availableCoupons.filter(
        (c) => c.usedCount >= c.usageLimit || now > new Date(c.validUntil)
      ).length,
    },
    {
      id: 'all',
      label: 'All',
      labelId: 'Semua',
      count: availableCoupons.length,
    },
  ]

  const handleUseCoupon = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success(
      language === 'id'
        ? `Kode ${code} disalin! Gunakan saat checkout.`
        : `Code ${code} copied! Use it at checkout.`
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          {language === 'id' ? 'Kupon Saya' : 'My Coupons'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === 'id'
            ? 'Kelola dan gunakan kupon untuk diskon'
            : 'Manage and use coupons for discounts'}
        </p>
      </div>

      {/* Add Coupon Code */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Gift className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">
              {language === 'id' ? 'Punya Kode Kupon?' : 'Have a Coupon Code?'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'id'
                ? 'Masukkan kode saat checkout untuk mendapat diskon'
                : 'Enter the code at checkout to get your discount'}
            </p>
          </div>
          <Button asChild>
            <Link href="/checkout">
              {language === 'id' ? 'Ke Checkout' : 'Go to Checkout'}
            </Link>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'id' ? 'Cari kupon...' : 'Search coupons...'}
          className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {language === 'id' ? tab.labelId : tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab.id ? 'bg-white/20' : 'bg-background'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Coupon List */}
      {filteredCoupons.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-2">
            {activeTab === 'available'
              ? language === 'id'
                ? 'Tidak ada kupon tersedia'
                : 'No coupons available'
              : activeTab === 'expiring'
              ? language === 'id'
                ? 'Tidak ada kupon yang segera berakhir'
                : 'No expiring coupons'
              : language === 'id'
              ? 'Tidak ada kupon ditemukan'
              : 'No coupons found'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {language === 'id'
              ? 'Cek kembali nanti untuk kupon baru!'
              : 'Check back later for new coupons!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCoupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} onUse={handleUseCoupon} />
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="bg-muted/50 rounded-xl p-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          {language === 'id' ? 'Tips Kupon' : 'Coupon Tips'}
        </h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            {language === 'id'
              ? 'Kupon hanya bisa digunakan satu per transaksi'
              : 'Only one coupon can be used per transaction'}
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            {language === 'id'
              ? 'Pastikan keranjang memenuhi minimal pembelian'
              : 'Make sure your cart meets the minimum order value'}
          </li>
          <li className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
            {language === 'id'
              ? 'Gunakan kupon sebelum tanggal kadaluarsa'
              : 'Use coupons before they expire'}
          </li>
        </ul>
      </div>
    </div>
  )
}
