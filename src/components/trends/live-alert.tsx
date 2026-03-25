'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Flame, ArrowRight } from 'lucide-react'
import type { TrendScoreView } from '@/types/trends'

interface LiveAlertProps {
  trend: TrendScoreView | null
  onCommit: (trend: TrendScoreView) => void
  language?: 'id' | 'en'
}

export function LiveAlert({ trend, onCommit, language = 'id' }: LiveAlertProps) {
  const [dismissed, setDismissed] = useState(false)

  if (!trend || dismissed) return null

  const views = trend.social_velocity > 0
    ? `${Math.round(trend.social_velocity / 1000)}K`
    : ''

  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white">
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-2 rounded-full p-1 hover:bg-white/20"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3">
        <Flame className="mt-0.5 h-6 w-6 shrink-0 animate-pulse" />
        <div className="flex-1">
          <p className="font-bold">
            {language === 'id' ? 'TRENDING SEKARANG' : 'TRENDING NOW'}
          </p>
          <p className="mt-1 text-sm text-white/90">
            {trend.name ?? trend.category}
            {views && ` — ${views} views`}
          </p>
          <Button
            size="sm"
            variant="secondary"
            className="mt-2 bg-white text-orange-600 hover:bg-white/90"
            onClick={() => onCommit(trend)}
          >
            {language === 'id' ? 'Jadi yang pertama!' : 'Be the first!'}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
