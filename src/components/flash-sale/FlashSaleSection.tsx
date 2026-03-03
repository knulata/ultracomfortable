'use client'

import Link from 'next/link'
import { Zap, ChevronRight, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { useFlashSaleStore, getTimeUntilStart } from '@/stores/flashSale'
import { FlashSaleCountdown } from './FlashSaleCountdown'
import { FlashSaleCard } from './FlashSaleCard'
import { useState, useEffect } from 'react'

interface FlashSaleSectionProps {
  maxProducts?: number
}

export function FlashSaleSection({ maxProducts = 6 }: FlashSaleSectionProps) {
  const { language } = useTranslation()
  const { getActiveFlashSale, getUpcomingFlashSales } = useFlashSaleStore()

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

  // Show active sale products
  if (activeSale) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className={`bg-gradient-to-r ${activeSale.bannerColor} text-white rounded-t-2xl p-6`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">
                      {language === 'id' ? activeSale.nameId : activeSale.name}
                    </h2>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full animate-pulse">
                      LIVE
                    </span>
                  </div>
                  <p className="text-sm opacity-90">
                    {language === 'id' ? activeSale.descriptionId : activeSale.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <FlashSaleCountdown endTime={activeSale.endTime} variant="default" />
                <Link
                  href="/flash-sale"
                  className="flex items-center gap-1 text-sm font-medium hover:underline"
                >
                  {language === 'id' ? 'Lihat Semua' : 'View All'}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="bg-gradient-to-b from-red-50 to-background rounded-b-2xl p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {activeSale.products.slice(0, maxProducts).map((product) => (
                <FlashSaleCard key={product.id} product={product} variant="compact" />
              ))}
            </div>

            {activeSale.products.length > maxProducts && (
              <div className="text-center mt-6">
                <Button asChild variant="outline">
                  <Link href="/flash-sale">
                    {language === 'id'
                      ? `Lihat ${activeSale.products.length - maxProducts} produk lainnya`
                      : `View ${activeSale.products.length - maxProducts} more products`}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Show upcoming sale preview
  if (nextSale && timeUntilStart && timeUntilStart.total > 0) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className={`bg-gradient-to-r ${nextSale.bannerColor} text-white rounded-2xl p-8`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <Zap className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm opacity-90 uppercase tracking-wider">
                    {language === 'id' ? 'Segera Hadir' : 'Coming Soon'}
                  </p>
                  <h2 className="text-2xl font-bold">
                    {language === 'id' ? nextSale.nameId : nextSale.name}
                  </h2>
                  <p className="text-sm opacity-90">
                    {language === 'id' ? nextSale.descriptionId : nextSale.description}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm mb-2 opacity-90">
                  {language === 'id' ? 'Dimulai dalam' : 'Starts in'}
                </p>
                <FlashSaleCountdown endTime={nextSale.startTime} variant="large" showLabel={false} />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    // Would implement notification subscription
                  }}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  {language === 'id' ? 'Ingatkan Saya' : 'Remind Me'}
                </Button>
                <Button asChild variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20">
                  <Link href="/flash-sale">
                    {language === 'id' ? 'Lihat Preview' : 'See Preview'}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Preview Products */}
            {nextSale.products.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm font-medium mb-4 opacity-90">
                  {language === 'id' ? 'Produk yang akan diskon:' : 'Products on sale:'}
                </p>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {nextSale.products.slice(0, 4).map((product) => (
                    <div
                      key={product.id}
                      className="flex-shrink-0 w-24 text-center"
                    >
                      <div className="w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center text-3xl mb-2">
                        {product.product.category_id === 'tops' ? '👕' :
                         product.product.category_id === 'bottoms' ? '👖' :
                         product.product.category_id === 'dresses' ? '👗' :
                         product.product.category_id === 'outerwear' ? '🧥' : '🛍️'}
                      </div>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                        -{product.discount}%
                      </span>
                    </div>
                  ))}
                  {nextSale.products.length > 4 && (
                    <div className="flex-shrink-0 w-24 flex items-center justify-center">
                      <span className="text-sm opacity-75">
                        +{nextSale.products.length - 4} more
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // No flash sales to show
  return null
}
