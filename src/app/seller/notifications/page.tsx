'use client'

import { useState } from 'react'
import { Bell, MessageCircle, Mail, ShoppingBag, DollarSign, Package, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SellerNotification {
  id: string
  channel: 'whatsapp' | 'email' | 'push'
  type: string
  title: string
  message: string
  status: 'pending' | 'sent' | 'failed'
  sent_at: string | null
  created_at: string
}

const typeIcons: Record<string, typeof ShoppingBag> = {
  new_order: ShoppingBag,
  order_shipped: Package,
  settlement_ready: DollarSign,
}

const channelIcons: Record<string, typeof MessageCircle> = {
  whatsapp: MessageCircle,
  email: Mail,
  push: Bell,
}

const mockNotifications: SellerNotification[] = [
  {
    id: '1',
    channel: 'whatsapp',
    type: 'new_order',
    title: 'Pesanan Baru!',
    message: 'Ada pesanan baru UC-A1B2C3D4 sebesar Rp 345.000. Segera proses ya!',
    status: 'sent',
    sent_at: '2026-03-05 09:31',
    created_at: '2026-03-05 09:30',
  },
  {
    id: '2',
    channel: 'whatsapp',
    type: 'new_order',
    title: 'Pesanan Baru!',
    message: 'Ada pesanan baru UC-E5F6G7H8 sebesar Rp 99.000. Segera proses ya!',
    status: 'sent',
    sent_at: '2026-03-05 08:16',
    created_at: '2026-03-05 08:15',
  },
  {
    id: '3',
    channel: 'whatsapp',
    type: 'settlement_ready',
    title: 'Settlement Siap',
    message: 'Settlement periode 24 Feb - 2 Mar sebesar Rp 4.050.000 telah ditransfer ke rekening BCA Anda.',
    status: 'sent',
    sent_at: '2026-03-04 10:00',
    created_at: '2026-03-04 10:00',
  },
  {
    id: '4',
    channel: 'whatsapp',
    type: 'new_order',
    title: 'Pesanan Baru!',
    message: 'Ada pesanan baru UC-I9J0K1L2 sebesar Rp 258.000. Segera proses ya!',
    status: 'sent',
    sent_at: '2026-03-04 16:01',
    created_at: '2026-03-04 16:00',
  },
  {
    id: '5',
    channel: 'whatsapp',
    type: 'new_order',
    title: 'Pesanan Baru!',
    message: 'Ada pesanan baru UC-M3N4O5P6 sebesar Rp 1.068.000. Segera proses ya!',
    status: 'failed',
    sent_at: null,
    created_at: '2026-03-03 11:00',
  },
]

export default function SellerNotificationsPage() {
  const [filter, setFilter] = useState('all')

  const filtered = mockNotifications.filter(
    (n) => filter === 'all' || n.type === filter
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifikasi</h1>
        <Button variant="outline" size="sm">
          <CheckCheck className="h-4 w-4 mr-1" /> Tandai Semua Dibaca
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Semua' },
          { id: 'new_order', label: 'Pesanan Baru' },
          { id: 'settlement_ready', label: 'Settlement' },
          { id: 'order_shipped', label: 'Pengiriman' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((n) => {
          const TypeIcon = typeIcons[n.type] || Bell
          const ChannelIcon = channelIcons[n.channel] || Bell
          return (
            <div
              key={n.id}
              className={`bg-background rounded-xl border p-5 flex items-start gap-4 ${
                n.status === 'failed' ? 'border-red-200' : ''
              }`}
            >
              <div className={`p-2.5 rounded-lg shrink-0 ${
                n.type === 'new_order' ? 'bg-blue-100 text-blue-600' :
                n.type === 'settlement_ready' ? 'bg-green-100 text-green-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                <TypeIcon className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sm">{n.title}</h3>
                  {n.status === 'failed' && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 font-medium">
                      Gagal terkirim
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ChannelIcon className="h-3 w-3" />
                    {n.channel === 'whatsapp' ? 'WhatsApp' : n.channel === 'email' ? 'Email' : 'Push'}
                  </span>
                  <span>{n.created_at}</span>
                  {n.sent_at && <span>Terkirim {n.sent_at}</span>}
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">Belum ada notifikasi</div>
        )}
      </div>
    </div>
  )
}
