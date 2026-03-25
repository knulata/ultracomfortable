'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, ShoppingBag, Check, Users } from 'lucide-react'
import type { TrendScoreView } from '@/types/trends'

const platformIcons: Record<string, string> = {
  shopee: '🛒',
  tokopedia: '🟢',
  instagram: '📸',
  tiktok: '🎵',
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

interface TrendCardProps {
  trend: TrendScoreView
  onCommit: (trend: TrendScoreView) => void
  isCommitted?: boolean
  language?: 'id' | 'en'
}

export function TrendCard({ trend, onCommit, isCommitted, language = 'id' }: TrendCardProps) {
  const [imageError, setImageError] = useState(false)
  const scorePercent = Math.min(Math.round(trend.computed_score * 100), 100)

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg">
      {/* Image section - 80% of card */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        {trend.representative_image_url && !imageError ? (
          <Image
            src={trend.representative_image_url}
            alt={trend.name ?? 'Trend fashion'}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Score badge - top right */}
        <div className="absolute right-2 top-2">
          <Badge
            variant="secondary"
            className="bg-black/60 text-white backdrop-blur-sm border-0 font-mono text-xs"
          >
            <TrendingUp className="mr-1 h-3 w-3" />
            {scorePercent}
          </Badge>
        </div>

        {/* Category tag - bottom left */}
        {trend.category && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-white/90 text-foreground backdrop-blur-sm border-0 text-xs capitalize">
              {trend.category}
            </Badge>
          </div>
        )}

        {/* Platform indicators - bottom right */}
        {trend.cross_platform_count > 0 && (
          <div className="absolute bottom-2 right-2 flex gap-0.5">
            {Object.entries(platformIcons).slice(0, trend.cross_platform_count).map(([key, icon]) => (
              <span key={key} className="text-xs" title={key}>
                {icon}
              </span>
            ))}
          </div>
        )}

        {/* Committed overlay */}
        {isCommitted && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
            <Badge className="bg-green-600 text-white text-sm px-3 py-1">
              <Check className="mr-1 h-4 w-4" />
              {language === 'id' ? 'Sudah komit' : 'Committed'}
            </Badge>
          </div>
        )}
      </div>

      {/* Info section - 20% */}
      <div className="p-3 space-y-2">
        <p className="text-sm font-medium line-clamp-1">
          {trend.name ?? (language === 'id' ? 'Gaya trending' : 'Trending style')}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {trend.commitments} partner
          </span>
          {trend.marketplace_sales_signal > 0 && (
            <span>{Math.round(trend.marketplace_sales_signal)} terjual</span>
          )}
        </div>

        {!isCommitted && (
          <Button
            size="sm"
            className="w-full opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              onCommit(trend)
            }}
          >
            {language === 'id' ? 'Saya Bisa' : 'I Can Make This'}
          </Button>
        )}
      </div>
    </div>
  )
}

export function TrendCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="aspect-[2/3] w-full animate-pulse bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-8 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}
