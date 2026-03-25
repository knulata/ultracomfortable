'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'
import type { TrendScoreView } from '@/types/trends'

interface CommitSheetProps {
  trend: TrendScoreView | null
  onClose: () => void
  onCommit: (data: { price: number; quantity: number; leadTime: number }) => Promise<void>
  isSubmitting: boolean
  language?: 'id' | 'en'
}

export function CommitSheet({ trend, onClose, onCommit, isSubmitting, language = 'id' }: CommitSheetProps) {
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [leadTime, setLeadTime] = useState('7')

  if (!trend) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const priceNum = parseInt(price)
    const qtyNum = parseInt(quantity)
    if (!priceNum || !qtyNum) {
      toast.error(language === 'id' ? 'Isi semua field' : 'Fill all fields')
      return
    }

    try {
      await onCommit({ price: priceNum, quantity: qtyNum, leadTime: parseInt(leadTime) })
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } })
      toast.success(
        language === 'id'
          ? `Komitmen tercatat! ${qtyNum} pcs`
          : `Commitment recorded! ${qtyNum} pcs`
      )
      onClose()
    } catch {
      toast.error(language === 'id' ? 'Gagal. Coba lagi.' : 'Failed. Try again.')
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t bg-background p-4 shadow-lg animate-in slide-in-from-bottom duration-300">
        <div className="mx-auto w-12 h-1 rounded-full bg-muted-foreground/20 mb-4" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Trend preview */}
        <div className="flex gap-3 mb-4">
          {trend.representative_image_url && (
            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md">
              <Image
                src={trend.representative_image_url}
                alt={trend.name ?? ''}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h3 className="font-medium">{trend.name ?? 'Trending style'}</h3>
            <p className="text-sm text-muted-foreground">
              {trend.category} &middot; {trend.commitments} partner
            </p>
          </div>
        </div>

        {/* Commit form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium">
              {language === 'id' ? 'Harga Jual (Rp)' : 'Selling Price (Rp)'}
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="189000"
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              min={1000}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              {language === 'id' ? 'Jumlah (pcs)' : 'Quantity (pcs)'}
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="50"
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              min={1}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              {language === 'id' ? 'Waktu Produksi' : 'Production Time'}
            </label>
            <select
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="3">3 {language === 'id' ? 'hari' : 'days'}</option>
              <option value="5">5 {language === 'id' ? 'hari' : 'days'}</option>
              <option value="7">7 {language === 'id' ? 'hari' : 'days'}</option>
              <option value="14">14 {language === 'id' ? 'hari' : 'days'}</option>
            </select>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === 'id' ? 'Memproses...' : 'Processing...'}
              </>
            ) : (
              language === 'id' ? 'Konfirmasi Komitmen' : 'Confirm Commitment'
            )}
          </Button>
        </form>
      </div>
    </>
  )
}
