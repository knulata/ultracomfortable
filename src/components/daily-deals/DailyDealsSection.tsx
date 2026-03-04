'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Flame, ChevronRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDailyDealsStore } from '@/stores/dailyDeals'
import { useTranslation } from '@/stores/language'
import { DealCard } from './DealCard'
import { DealCountdown } from './DealCountdown'

export function DailyDealsSection() {
  const { language } = useTranslation()
  const { getHeroDeal, getRegularDeals } = useDailyDealsStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const heroDeal = mounted ? getHeroDeal() : null
  const regularDeals = mounted ? getRegularDeals() : []

  if (!mounted) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="h-64 bg-muted rounded-2xl animate-pulse" />
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-950/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {language === 'id' ? 'Penawaran Hari Ini' : "Today's Deals"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {language === 'id' ? 'Diskon spesial, hanya hari ini!' : 'Special discounts, today only!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-foreground/5 px-4 py-2 rounded-full">
              <Clock className="h-4 w-4 text-amber-500" />
              <DealCountdown compact />
            </div>
            <Button variant="ghost" size="sm" className="hidden md:flex" asChild>
              <Link href="/daily-deals">
                {language === 'id' ? 'Lihat Semua' : 'View All'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Hero Deal */}
        {heroDeal && (
          <div className="mb-6">
            <DealCard deal={heroDeal} isHero />
          </div>
        )}

        {/* Regular Deals Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {regularDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-6 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link href="/daily-deals">
              {language === 'id' ? 'Lihat Semua Penawaran' : 'View All Deals'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
