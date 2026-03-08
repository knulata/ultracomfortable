'use client'

import { useState } from 'react'
import {
  Sparkles,
  Search,
  CheckCircle,
  Clock,
  Package,
  TrendingUp,
  Phone,
  Store,
  Calendar,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTrialStore, TrialParticipant, TrialStatus } from '@/stores/trial'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

type FilterType = 'all' | 'active' | 'scheduled' | 'completed'

const statusConfig: Record<TrialStatus, { label: { en: string; id: string }; color: string }> = {
  registered: {
    label: { en: 'Registered', id: 'Terdaftar' },
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  },
  scheduled: {
    label: { en: 'Scheduled', id: 'Terjadwal' },
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  items_received: {
    label: { en: 'Items Received', id: 'Barang Diterima' },
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  processing: {
    label: { en: 'Processing', id: 'Diproses' },
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  live: {
    label: { en: 'Live', id: 'Live' },
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  completed: {
    label: { en: 'Completed', id: 'Selesai' },
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  },
  converted: {
    label: { en: 'Converted!', id: 'Konversi!' },
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  returned: {
    label: { en: 'Returned', id: 'Dikembalikan' },
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
}

export default function AdminTrialsPage() {
  const { language } = useTranslation()
  const { participants, getTrialStats, startTrial, completeTrial, convertToPartner } = useTrialStore()
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const stats = getTrialStats()

  const filteredParticipants = participants.filter((p) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !p.shopName.toLowerCase().includes(query) &&
        !p.ownerName.toLowerCase().includes(query) &&
        !p.whatsapp.includes(query)
      ) {
        return false
      }
    }

    if (filter === 'all') return true
    if (filter === 'active') return ['items_received', 'processing', 'live'].includes(p.status)
    if (filter === 'scheduled') return ['registered', 'scheduled'].includes(p.status)
    if (filter === 'completed') return ['completed', 'converted', 'returned'].includes(p.status)
    return true
  })

  // Sort by registration date descending
  filteredParticipants.sort(
    (a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
  )

  const statusCounts = {
    all: participants.length,
    active: participants.filter((p) => ['items_received', 'processing', 'live'].includes(p.status)).length,
    scheduled: participants.filter((p) => ['registered', 'scheduled'].includes(p.status)).length,
    completed: participants.filter((p) => ['completed', 'converted', 'returned'].includes(p.status)).length,
  }

  const handleStartTrial = (p: TrialParticipant) => {
    startTrial(p.id)
    toast.success(
      language === 'id'
        ? `Trial ${p.shopName} dimulai!`
        : `Trial for ${p.shopName} started!`
    )
  }

  const handleConvert = (p: TrialParticipant) => {
    convertToPartner(p.id)
    toast.success(
      language === 'id'
        ? `${p.shopName} menjadi partner!`
        : `${p.shopName} became a partner!`
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          {language === 'id' ? 'Program Uji Coba' : 'Trial Program'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'id'
            ? 'Kelola peserta program 10 potong'
            : 'Manage 10 pieces program participants'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4">
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
            {language === 'id' ? 'Total Terdaftar' : 'Total Registered'}
          </p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {stats.totalRegistered}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4">
          <p className="text-xs text-green-600 dark:text-green-400 mb-1">
            {language === 'id' ? 'Trial Aktif' : 'Active Trials'}
          </p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            {stats.activeTrials}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-4">
          <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">
            {language === 'id' ? 'Konversi' : 'Converted'}
          </p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {stats.converted}
          </p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4">
          <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">
            {language === 'id' ? 'Rate Konversi' : 'Conversion Rate'}
          </p>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
            {stats.conversionRate.toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-background rounded-xl p-4 border">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'id' ? 'Cari peserta...' : 'Search participants...'}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {(['all', 'scheduled', 'active', 'completed'] as FilterType[]).map((status) => (
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
                : status === 'scheduled'
                ? (language === 'id' ? 'Terjadwal' : 'Scheduled')
                : status === 'active'
                ? (language === 'id' ? 'Aktif' : 'Active')
                : (language === 'id' ? 'Selesai' : 'Completed')
              }{' '}
              ({statusCounts[status]})
            </button>
          ))}
        </div>
      </div>

      {/* Participant List */}
      <div className="bg-background rounded-xl border overflow-hidden">
        {filteredParticipants.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>{language === 'id' ? 'Tidak ada peserta' : 'No participants found'}</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredParticipants.map((participant) => {
              const status = statusConfig[participant.status]
              return (
                <div key={participant.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Store className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{participant.shopName}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            {language === 'id' ? status.label.id : status.label.en}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{participant.ownerName}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {participant.whatsapp}
                          </span>
                          <span>{participant.shopLocation}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {participant.status === 'live' && (
                        <div className="mb-2">
                          <p className="text-lg font-bold text-green-600">
                            {participant.totalSold}/10 {language === 'id' ? 'Terjual' : 'Sold'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(participant.totalRevenue)}
                          </p>
                        </div>
                      )}

                      {participant.status === 'scheduled' && (
                        <div className="text-sm mb-2">
                          <p className="flex items-center gap-1 text-amber-600">
                            <Calendar className="h-3 w-3" />
                            {new Date(participant.dropOffDate!).toLocaleDateString('id-ID')}
                          </p>
                          <p className="text-xs text-muted-foreground">{participant.dropOffTime}</p>
                        </div>
                      )}

                      {participant.status === 'items_received' && (
                        <Button size="sm" onClick={() => handleStartTrial(participant)}>
                          <ArrowRight className="h-4 w-4 mr-1" />
                          {language === 'id' ? 'Mulai Trial' : 'Start Trial'}
                        </Button>
                      )}

                      {participant.status === 'live' && participant.totalSold >= 5 && (
                        <Button size="sm" onClick={() => handleConvert(participant)}>
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {language === 'id' ? 'Konversi' : 'Convert'}
                        </Button>
                      )}

                      {participant.status === 'converted' && (
                        <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                          <CheckCircle className="h-4 w-4" />
                          {language === 'id' ? 'Partner' : 'Partner'}
                        </span>
                      )}
                    </div>
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
