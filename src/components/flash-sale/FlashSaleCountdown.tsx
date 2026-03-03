'use client'

import { useState, useEffect } from 'react'
import { getTimeRemaining, formatTimeUnit } from '@/stores/flashSale'

interface FlashSaleCountdownProps {
  endTime: Date
  variant?: 'default' | 'compact' | 'large'
  onEnd?: () => void
  label?: string
  labelId?: string
  showLabel?: boolean
}

export function FlashSaleCountdown({
  endTime,
  variant = 'default',
  onEnd,
  label = 'Ends in',
  labelId = 'Berakhir dalam',
  showLabel = true,
}: FlashSaleCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endTime))
  const [language] = useState('en') // Could integrate with useTranslation

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(endTime)
      setTimeLeft(remaining)

      if (remaining.total <= 0) {
        clearInterval(timer)
        onEnd?.()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime, onEnd])

  if (timeLeft.total <= 0) {
    return (
      <span className="text-muted-foreground text-sm">
        {language === 'id' ? 'Telah berakhir' : 'Ended'}
      </span>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1 text-sm">
        {showLabel && (
          <span className="text-muted-foreground mr-1">
            {language === 'id' ? labelId : label}
          </span>
        )}
        <span className="font-mono font-bold text-red-500">
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {formatTimeUnit(timeLeft.hours)}:{formatTimeUnit(timeLeft.minutes)}:{formatTimeUnit(timeLeft.seconds)}
        </span>
      </div>
    )
  }

  if (variant === 'large') {
    return (
      <div className="text-center">
        {showLabel && (
          <p className="text-sm text-muted-foreground mb-2">
            {language === 'id' ? labelId : label}
          </p>
        )}
        <div className="flex items-center justify-center gap-2">
          {timeLeft.days > 0 && (
            <>
              <div className="bg-red-500 text-white rounded-lg px-3 py-2 min-w-[60px]">
                <div className="text-2xl font-bold font-mono">{formatTimeUnit(timeLeft.days)}</div>
                <div className="text-xs uppercase opacity-80">
                  {language === 'id' ? 'Hari' : 'Days'}
                </div>
              </div>
              <span className="text-2xl font-bold text-red-500">:</span>
            </>
          )}
          <div className="bg-red-500 text-white rounded-lg px-3 py-2 min-w-[60px]">
            <div className="text-2xl font-bold font-mono">{formatTimeUnit(timeLeft.hours)}</div>
            <div className="text-xs uppercase opacity-80">
              {language === 'id' ? 'Jam' : 'Hours'}
            </div>
          </div>
          <span className="text-2xl font-bold text-red-500">:</span>
          <div className="bg-red-500 text-white rounded-lg px-3 py-2 min-w-[60px]">
            <div className="text-2xl font-bold font-mono">{formatTimeUnit(timeLeft.minutes)}</div>
            <div className="text-xs uppercase opacity-80">
              {language === 'id' ? 'Menit' : 'Mins'}
            </div>
          </div>
          <span className="text-2xl font-bold text-red-500">:</span>
          <div className="bg-red-500 text-white rounded-lg px-3 py-2 min-w-[60px]">
            <div className="text-2xl font-bold font-mono">{formatTimeUnit(timeLeft.seconds)}</div>
            <div className="text-xs uppercase opacity-80">
              {language === 'id' ? 'Detik' : 'Secs'}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className="flex items-center gap-1.5">
      {showLabel && (
        <span className="text-sm text-muted-foreground">
          {language === 'id' ? labelId : label}
        </span>
      )}
      <div className="flex items-center gap-1">
        {timeLeft.days > 0 && (
          <>
            <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-1 rounded min-w-[28px] text-center font-mono">
              {formatTimeUnit(timeLeft.days)}
            </span>
            <span className="text-red-500 font-bold">:</span>
          </>
        )}
        <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-1 rounded min-w-[28px] text-center font-mono">
          {formatTimeUnit(timeLeft.hours)}
        </span>
        <span className="text-red-500 font-bold">:</span>
        <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-1 rounded min-w-[28px] text-center font-mono">
          {formatTimeUnit(timeLeft.minutes)}
        </span>
        <span className="text-red-500 font-bold">:</span>
        <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-1 rounded min-w-[28px] text-center font-mono">
          {formatTimeUnit(timeLeft.seconds)}
        </span>
      </div>
    </div>
  )
}
