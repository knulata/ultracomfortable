'use client'

import { useState, useEffect } from 'react'
import { Users, Search, Filter, Plus, Download, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useResellerStore, RESELLER_TIERS } from '@/stores/reseller'
import { useTranslation } from '@/stores/language'
import { ResellerCard, ResellerStats, WholesalePricing } from '@/components/reseller'

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected'
type FilterTier = 'all' | string

export default function ResellersPage() {
  const { language } = useTranslation()
  const { resellers } = useResellerStore()
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [filterTier, setFilterTier] = useState<FilterTier>('all')
  const [activeTab, setActiveTab] = useState<'overview' | 'resellers' | 'pricing'>('overview')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse w-48" />
        <div className="h-64 bg-muted rounded-xl animate-pulse" />
      </div>
    )
  }

  // Filter resellers
  const filteredResellers = resellers.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery)

    const matchesStatus = filterStatus === 'all' || r.status === filterStatus
    const matchesTier = filterTier === 'all' || r.tierId === filterTier

    return matchesSearch && matchesStatus && matchesTier
  })

  const pendingCount = resellers.filter((r) => r.status === 'pending').length

  const broadcastWhatsApp = () => {
    const message = encodeURIComponent(
      language === 'id'
        ? 'Halo reseller! Ada promo spesial untuk Anda. Hubungi kami untuk info lebih lanjut.'
        : 'Hello resellers! We have a special promo for you. Contact us for more info.'
    )
    // In real app, this would open a broadcast list or use WA Business API
    window.open(`https://wa.me/?text=${message}`, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            {language === 'id' ? 'Kelola Reseller' : 'Manage Resellers'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'id'
              ? 'Kelola reseller dan harga grosir Anda'
              : 'Manage your resellers and wholesale pricing'
            }
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={broadcastWhatsApp}>
            <MessageCircle className="h-4 w-4 mr-2" />
            {language === 'id' ? 'Broadcast WA' : 'WA Broadcast'}
          </Button>
        </div>
      </div>

      {/* Pending Alert */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-200">
                {pendingCount} {language === 'id' ? 'reseller menunggu persetujuan' : 'resellers waiting for approval'}
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400">
                {language === 'id' ? 'Tinjau dan setujui untuk mulai berjualan' : 'Review and approve to start selling'}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setActiveTab('resellers')
                setFilterStatus('pending')
              }}
            >
              {language === 'id' ? 'Tinjau' : 'Review'}
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-background shadow text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {language === 'id' ? 'Ringkasan' : 'Overview'}
        </button>
        <button
          onClick={() => setActiveTab('resellers')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'resellers'
              ? 'bg-background shadow text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {language === 'id' ? 'Daftar Reseller' : 'Reseller List'}
          {pendingCount > 0 && (
            <span className="ml-2 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'pricing'
              ? 'bg-background shadow text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {language === 'id' ? 'Harga Grosir' : 'Wholesale Pricing'}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <ResellerStats />
      )}

      {activeTab === 'resellers' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'id' ? 'Cari nama, toko, atau nomor HP...' : 'Search name, store, or phone...'}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">{language === 'id' ? 'Semua Status' : 'All Status'}</option>
              <option value="pending">{language === 'id' ? 'Menunggu' : 'Pending'}</option>
              <option value="approved">{language === 'id' ? 'Aktif' : 'Active'}</option>
              <option value="rejected">{language === 'id' ? 'Ditolak' : 'Rejected'}</option>
            </select>

            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">{language === 'id' ? 'Semua Level' : 'All Tiers'}</option>
              {RESELLER_TIERS.map((tier) => (
                <option key={tier.id} value={tier.id}>
                  {tier.badge} {language === 'id' ? tier.nameId : tier.name}
                </option>
              ))}
            </select>
          </div>

          {/* Results */}
          <p className="text-sm text-muted-foreground">
            {language === 'id'
              ? `Menampilkan ${filteredResellers.length} dari ${resellers.length} reseller`
              : `Showing ${filteredResellers.length} of ${resellers.length} resellers`
            }
          </p>

          {/* Reseller Grid */}
          {filteredResellers.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResellers.map((reseller) => (
                <ResellerCard key={reseller.id} reseller={reseller} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-xl">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">
                {language === 'id' ? 'Tidak ada reseller' : 'No resellers found'}
              </p>
              <p className="text-muted-foreground">
                {language === 'id'
                  ? 'Coba ubah filter pencarian Anda'
                  : 'Try adjusting your search filters'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'pricing' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {language === 'id' ? 'Contoh Kalkulasi Harga' : 'Price Calculation Example'}
            </h2>
            <WholesalePricing basePrice={199000} productName="Kaos Oversized Premium" />
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">
                {language === 'id' ? 'Level Reseller & Benefit' : 'Reseller Tiers & Benefits'}
              </h2>
              <div className="space-y-3">
                {RESELLER_TIERS.map((tier) => (
                  <div key={tier.id} className="bg-background border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold px-2 py-1 rounded ${tier.color}`}>
                        {tier.badge} {language === 'id' ? tier.nameId : tier.name}
                      </span>
                      <span className="text-green-600 font-bold">-{tier.discountPercent}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {language === 'id'
                        ? `Min. ${tier.minOrdersPerMonth} order/bulan, total belanja Rp${(tier.minTotalSpent / 1000000).toFixed(0)}jt+`
                        : `Min. ${tier.minOrdersPerMonth} orders/month, total spent Rp${(tier.minTotalSpent / 1000000).toFixed(0)}M+`
                      }
                    </p>
                    <ul className="text-sm space-y-1">
                      {(language === 'id' ? tier.benefitsId : tier.benefits).map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
