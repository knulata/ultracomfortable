'use client'

import { useState } from 'react'
import { Users, CheckCircle, Clock, XCircle, Store, Search } from 'lucide-react'
import { usePartnerStore, Partner } from '@/stores/partner'

type PartnerStatus = Partner['status']
import { useTranslation } from '@/stores/language'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type FilterType = 'all' | 'pending' | 'active' | 'rejected'

const statusConfig: Record<PartnerStatus, { label: { en: string; id: string }; color: string }> = {
  pending: {
    label: { en: 'Pending', id: 'Menunggu' },
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  approved: {
    label: { en: 'Approved', id: 'Disetujui' },
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  active: {
    label: { en: 'Active', id: 'Aktif' },
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  suspended: {
    label: { en: 'Suspended', id: 'Ditangguhkan' },
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  rejected: {
    label: { en: 'Rejected', id: 'Ditolak' },
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  },
}

export default function AdminPartnersPage() {
  const { language } = useTranslation()
  const { partners, updatePartnerStatus } = usePartnerStore()
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPartners = partners.filter((partner) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !partner.shopName.toLowerCase().includes(query) &&
        !partner.ownerName.toLowerCase().includes(query)
      ) {
        return false
      }
    }

    if (filter === 'all') return true
    return partner.status === filter
  })

  const statusCounts = {
    all: partners.length,
    pending: partners.filter((p) => p.status === 'pending').length,
    active: partners.filter((p) => p.status === 'active').length,
    rejected: partners.filter((p) => p.status === 'rejected').length,
  }

  const handleApprove = (partner: Partner) => {
    updatePartnerStatus(partner.id, 'active')
    toast.success(
      language === 'id'
        ? `${partner.shopName} berhasil disetujui!`
        : `${partner.shopName} approved!`
    )
  }

  const handleReject = (partner: Partner) => {
    updatePartnerStatus(partner.id, 'rejected', 'Dokumen tidak lengkap')
    toast.error(
      language === 'id' ? `${partner.shopName} ditolak` : `${partner.shopName} rejected`
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          {language === 'id' ? 'Manajemen Partner' : 'Partner Management'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'id'
            ? 'Kelola partner dan approval'
            : 'Manage partners and approvals'}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-background rounded-xl p-4 border">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'id' ? 'Cari partner...' : 'Search partners...'}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {(['all', 'pending', 'active', 'rejected'] as FilterType[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {status === 'all'
                ? (language === 'id' ? 'Semua' : 'All')
                : status === 'pending'
                ? (language === 'id' ? 'Menunggu' : 'Pending')
                : status === 'active'
                ? (language === 'id' ? 'Aktif' : 'Active')
                : (language === 'id' ? 'Ditolak' : 'Rejected')
              }{' '}
              ({statusCounts[status]})
            </button>
          ))}
        </div>
      </div>

      {/* Partner List */}
      <div className="bg-background rounded-xl border overflow-hidden">
        {filteredPartners.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>{language === 'id' ? 'Tidak ada partner' : 'No partners found'}</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredPartners.map((partner) => {
              const status = statusConfig[partner.status]
              return (
                <div key={partner.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Store className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{partner.shopName}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            {language === 'id' ? status.label.id : status.label.en}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{partner.ownerName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {partner.block && `Blok ${partner.block}`} • {partner.commissionRate}% commission
                        </p>
                      </div>
                    </div>

                    {partner.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(partner)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={() => handleApprove(partner)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
