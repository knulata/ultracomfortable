'use client'

import Link from 'next/link'
import { Zap, ChevronRight, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { FlashSale, useFlashSaleStore, getTimeUntilStart } from '@/stores/flashSale'
import { FlashSaleCountdown } from './FlashSaleCountdown'
import { useState, useEffect } from 'react'

interface FlashSaleBannerProps {
  variant?: 'default' | 'compact' | 'hero'
}

export function FlashSaleBanner({ variant = 'default' }: FlashSaleBannerProps) {
  const { language } = useTranslation()
  const { getActiveFlashSale, getUpcomingFlashSales, getFlashSaleStatus } = useFlashSaleStore()

  const activeSale = getActiveFlashSale()
  const upcomingSales = getUpcomingFlashSales()
  const nextSale = upcomingSales[0]

  // For upcoming sale countdown
  const [timeUntilStart, setTimeUntilStart] = useState(
    nextSale ? getTimeUntilStart(nextSale.startTime) : null
  )

  useEffect(() => {
    if (!nextSale) return

    const timer = setInterval(() => {
      setTimeUntilStart(getTimeUntilStart(nextSale.startTime))
    }, 1000)

    return () => clearInterval(timer)
  }, [nextSale])

  // No sales to show
  if (!activeSale && !nextSale) {
    return null
  }

  if (variant === 'compact') {
    // Compact strip banner for header
    if (activeSale) {
      return (
        <Link
          href="/flash-sale"
          className={`block bg-gradient-to-r ${activeSale.bannerColor} text-white py-1.5 px-4`}
        >
          <div className="container mx-auto flex items-center justify-center gap-3 text-sm">
            <Zap className="h-4 w-4 animate-pulse" />
            <span className="font-medium">
              {language === 'id' ? activeSale.nameId : activeSale.name}
            </span>
            <span className="hidden sm:inline">-</span>
            <span className="hidden sm:inline">
              {language === 'id' ? activeSale.descriptionId : activeSale.description}
            </span>
            <FlashSaleCountdown endTime={activeSale.endTime} variant="compact" showLabel={false} />
            <ChevronRight className="h-4 w-4" />
          </div>
        </Link>
      )
    }

    // Upcoming sale strip
    if (nextSale && timeUntilStart && timeUntilStart.total > 0) {
      return (
        <Link
          href="/flash-sale"
          className={`block bg-gradient-to-r ${nextSale.bannerColor} text-white py-1.5 px-4`}
        >
          <div className="container mx-auto flex items-center justify-center gap-3 text-sm">
            <Bell className="h-4 w-4" />
            <span className="font-medium">
              {language === 'id' ? `${nextSale.nameId} dimulai dalam` : `${nextSale.name} starts in`}
            </span>
            <span className="font-mono font-bold">
              {timeUntilStart.hours}h {timeUntilStart.minutes}m {timeUntilStart.seconds}s
            </span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </Link>
      )
    }

    return null
  }

  if (variant === 'hero') {
    // Large hero banner for flash sale page
    const sale = activeSale || nextSale
    if (!sale) return null

    const isActive = activeSale !== null

    return (
      <div className={`bg-gradient-to-r ${sale.bannerColor} text-white rounded-2xl p-8 md:p-12`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-8 w-8" />
              <span className="text-sm font-medium uppercase tracking-wider opacity-90">
                {isActive
                  ? language === 'id' ? 'Sedang Berlangsung' : 'Live Now'
                  : language === 'id' ? 'Segera Hadir' : 'Coming Soon'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {language === 'id' ? sale.nameId : sale.name}
            </h1>
            <p className="text-lg opacity-90">
              {language === 'id' ? sale.descriptionId : sale.description}
            </p>
          </div>

          <div className="text-center">
            {isActive ? (
              <>
                <p className="text-sm mb-2 opacity-90">
                  {language === 'id' ? 'Berakhir dalam' : 'Ends in'}
                </p>
                <FlashSaleCountdown endTime={sale.endTime} variant="large" showLabel={false} />
              </>
            ) : (
              <>
                <p className="text-sm mb-2 opacity-90">
                  {language === 'id' ? 'Dimulai dalam' : 'Starts in'}
                </p>
                <FlashSaleCountdown endTime={sale.startTime} variant="large" showLabel={false} />
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => {
                    // Would implement notification subscription
                  }}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  {language === 'id' ? 'Ingatkan Saya' : 'Remind Me'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Default variant - card style
  const sale = activeSale || nextSale
  if (!sale) return null

  const isActive = activeSale !== null

  return (
    <Link
      href="/flash-sale"
      className={`block bg-gradient-to-r ${sale.bannerColor} text-white rounded-xl p-6 hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">
                {language === 'id' ? sale.nameId : sale.name}
              </h3>
              {isActive && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full animate-pulse">
                  LIVE
                </span>
              )}
            </div>
            <p className="text-sm opacity-90">
              {language === 'id' ? sale.descriptionId : sale.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isActive ? (
            <FlashSaleCountdown endTime={sale.endTime} variant="default" showLabel={true} />
          ) : (
            <div className="text-right">
              <p className="text-xs opacity-75">
                {language === 'id' ? 'Dimulai dalam' : 'Starts in'}
              </p>
              {timeUntilStart && (
                <p className="font-mono font-bold">
                  {timeUntilStart.hours}:{String(timeUntilStart.minutes).padStart(2, '0')}:{String(timeUntilStart.seconds).padStart(2, '0')}
                </p>
              )}
            </div>
          )}
          <ChevronRight className="h-5 w-5" />
        </div>
      </div>
    </Link>
  )
}
