'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { useDailyDealsStore, formatDealTime } from '@/stores/dailyDeals'
import { useTranslation } from '@/stores/language'

interface DealCountdownProps {
  compact?: boolean
}

export function DealCountdown({ compact = false }: DealCountdownProps) {
  const { language } = useTranslation()
  const { getTimeUntilRefresh } = useDailyDealsStore()
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTime(getTimeUntilRefresh())

    const timer = setInterval(() => {
      setTime(getTimeUntilRefresh())
    }, 1000)

    return () => clearInterval(timer)
  }, [getTimeUntilRefresh])

  if (!mounted) {
    return (
      <div className={`flex items-center gap-2 ${compact ? '' : 'justify-center'}`}>
        <Clock className="h-4 w-4 animate-pulse" />
        <span className="text-sm">--:--:--</span>
      </div>
    )
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Clock className="h-4 w-4" />
        <span className="font-mono font-semibold">
          {formatDealTime(time.hours)}:{formatDealTime(time.minutes)}:{formatDealTime(time.seconds)}
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm text-muted-foreground">
        {language === 'id' ? 'Berakhir dalam' : 'Ends in'}
      </p>
      <div className="flex items-center gap-1">
        <div className="bg-foreground text-background px-2 py-1 rounded text-lg font-bold font-mono min-w-[2.5rem] text-center">
          {formatDealTime(time.hours)}
        </div>
        <span className="text-xl font-bold">:</span>
        <div className="bg-foreground text-background px-2 py-1 rounded text-lg font-bold font-mono min-w-[2.5rem] text-center">
          {formatDealTime(time.minutes)}
        </div>
        <span className="text-xl font-bold">:</span>
        <div className="bg-foreground text-background px-2 py-1 rounded text-lg font-bold font-mono min-w-[2.5rem] text-center">
          {formatDealTime(time.seconds)}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {language === 'id' ? 'Penawaran baru setiap hari!' : 'New deals every day!'}
      </p>
    </div>
  )
}
