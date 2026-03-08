'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  Camera,
  ShoppingBag,
  Calendar,
  ArrowRight,
  Sparkles,
  Phone,
  Store,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTrialStore, TrialParticipant, TrialItem } from '@/stores/trial'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'

function TrialItemCard({ item }: { item: TrialItem }) {
  const { language } = useTranslation()

  const statusConfig = {
    pending: { label: language === 'id' ? 'Menunggu Foto' : 'Pending Photo', color: 'bg-amber-100 text-amber-700' },
    photographed: { label: language === 'id' ? 'Sudah Difoto' : 'Photographed', color: 'bg-blue-100 text-blue-700' },
    listed: { label: language === 'id' ? 'Live di Toko' : 'Live on Store', color: 'bg-green-100 text-green-700' },
    sold: { label: language === 'id' ? 'Terjual!' : 'Sold!', color: 'bg-purple-100 text-purple-700' },
    returned: { label: language === 'id' ? 'Dikembalikan' : 'Returned', color: 'bg-gray-100 text-gray-700' },
  }

  const status = statusConfig[item.status]

  return (
    <div className={`p-3 rounded-lg border ${item.status === 'sold' ? 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900' : 'bg-background'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm">{item.productName}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {item.size && `${item.size} `}{item.color}
        </span>
        {item.status === 'sold' ? (
          <span className="font-bold text-purple-600">{formatPrice(item.soldPrice || 0)}</span>
        ) : item.sellingPrice ? (
          <span className="text-muted-foreground">{formatPrice(item.sellingPrice)}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </div>
    </div>
  )
}

function TrialDashboardContent({ participant }: { participant: TrialParticipant }) {
  const { language } = useTranslation()
  const { convertToPartner, returnItems } = useTrialStore()

  const soldItems = participant.items.filter((i) => i.status === 'sold')
  const listedItems = participant.items.filter((i) => i.status === 'listed')
  const pendingItems = participant.items.filter((i) => ['pending', 'photographed'].includes(i.status))

  const progressPercent = (soldItems.length / participant.itemCount) * 100

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 py-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 text-sm opacity-80 mb-2">
            <Sparkles className="h-4 w-4" />
            {language === 'id' ? 'Program Uji Coba 10 Potong' : '10 Pieces Trial Program'}
          </div>
          <h1 className="text-xl font-bold">{participant.shopName}</h1>
          <p className="text-sm opacity-80">{participant.ownerName}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-lg mx-auto px-4 -mt-4">
        <div className="bg-background rounded-xl border shadow-sm p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-600">{soldItems.length}</p>
              <p className="text-xs text-muted-foreground">{language === 'id' ? 'Terjual' : 'Sold'}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{listedItems.length}</p>
              <p className="text-xs text-muted-foreground">{language === 'id' ? 'Live' : 'Live'}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{pendingItems.length}</p>
              <p className="text-xs text-muted-foreground">{language === 'id' ? 'Proses' : 'Processing'}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">
                {language === 'id' ? 'Progress Penjualan' : 'Sales Progress'}
              </span>
              <span className="font-medium">{soldItems.length}/10</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Card */}
      <div className="max-w-lg mx-auto px-4 mt-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4">
          <p className="text-sm opacity-90 mb-1">
            {language === 'id' ? 'Total Pendapatan Anda' : 'Your Total Earnings'}
          </p>
          <p className="text-3xl font-bold">{formatPrice(participant.totalEarnings)}</p>
          <p className="text-xs opacity-75 mt-1">
            {language === 'id' ? 'Setelah komisi 15%' : 'After 15% commission'}
          </p>
        </div>
      </div>

      {/* Trial Status */}
      {participant.status === 'live' && participant.daysRemaining && (
        <div className="max-w-lg mx-auto px-4 mt-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-800 dark:text-blue-300">
                  {participant.daysRemaining} {language === 'id' ? 'Hari Tersisa' : 'Days Remaining'}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {language === 'id'
                    ? 'Trial berakhir ' + new Date(participant.trialEndDate!).toLocaleDateString('id-ID')
                    : 'Trial ends ' + new Date(participant.trialEndDate!).toLocaleDateString('en-US')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item List */}
      <div className="max-w-lg mx-auto px-4 mt-6">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Package className="h-4 w-4" />
          {language === 'id' ? 'Barang Anda' : 'Your Items'} ({participant.itemCount})
        </h2>

        {participant.items.length === 0 ? (
          <div className="bg-background rounded-xl border p-6 text-center">
            <Camera className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              {language === 'id'
                ? 'Barang Anda sedang diproses. Anda akan mendapat notifikasi WhatsApp saat sudah live.'
                : 'Your items are being processed. You will receive a WhatsApp notification when live.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {participant.items.map((item) => (
              <TrialItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {participant.status === 'live' && (
        <div className="max-w-lg mx-auto px-4 mt-6 pb-8">
          <div className="bg-background rounded-xl border p-4">
            <h3 className="font-semibold mb-3">
              {language === 'id' ? 'Puas dengan hasilnya?' : 'Satisfied with the results?'}
            </h3>

            <div className="space-y-2">
              <Button className="w-full" size="lg" asChild>
                <Link href="/partner/register">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  {language === 'id' ? 'Lanjut Jadi Partner Penuh' : 'Become Full Partner'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button variant="outline" className="w-full" size="lg" asChild>
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                  <Phone className="mr-2 h-4 w-4" />
                  {language === 'id' ? 'Konsultasi via WhatsApp' : 'Consult via WhatsApp'}
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Scheduled Status */}
      {participant.status === 'scheduled' && (
        <div className="max-w-lg mx-auto px-4 mt-6">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-amber-600" />
              <div>
                <p className="font-semibold text-amber-800 dark:text-amber-300">
                  {language === 'id' ? 'Jadwal Drop-Off' : 'Drop-Off Schedule'}
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  {new Date(participant.dropOffDate!).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}{' '}
                  • {participant.dropOffTime}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-700 dark:text-amber-400 font-medium mb-2">
                {language === 'id' ? 'Yang perlu dibawa:' : 'What to bring:'}
              </p>
              <ul className="text-sm text-amber-600 dark:text-amber-500 space-y-1">
                <li>✓ 10 potong barang fashion wanita</li>
                <li>✓ Daftar harga jual per item</li>
                <li>✓ KTP untuk verifikasi</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function NotFound() {
  const { language } = useTranslation()

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="text-center">
        <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h1 className="text-xl font-bold mb-2">
          {language === 'id' ? 'Data Tidak Ditemukan' : 'Data Not Found'}
        </h1>
        <p className="text-muted-foreground mb-6">
          {language === 'id'
            ? 'Nomor WhatsApp tidak terdaftar dalam program trial.'
            : 'WhatsApp number not registered in trial program.'}
        </p>
        <Button asChild>
          <Link href="/uji-coba">
            {language === 'id' ? 'Daftar Sekarang' : 'Register Now'}
          </Link>
        </Button>
      </div>
    </div>
  )
}

function TrialDashboardInner() {
  const searchParams = useSearchParams()
  const { getParticipantByWhatsapp, participants } = useTrialStore()
  const [participant, setParticipant] = useState<TrialParticipant | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const wa = searchParams.get('wa')
    if (wa) {
      const found = getParticipantByWhatsapp(wa)
      setParticipant(found || null)
    } else {
      // Demo: show first active trial
      const active = participants.find((p) =>
        ['scheduled', 'items_received', 'processing', 'live'].includes(p.status)
      )
      setParticipant(active || null)
    }
    setLoading(false)
  }, [searchParams, getParticipantByWhatsapp, participants])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!participant) {
    return <NotFound />
  }

  return <TrialDashboardContent participant={participant} />
}

export default function TrialDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TrialDashboardInner />
    </Suspense>
  )
}
