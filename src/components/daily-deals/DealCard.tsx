'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DailyDeal, useDailyDealsStore } from '@/stores/dailyDeals'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'

interface DealCardProps {
  deal: DailyDeal
  isHero?: boolean
}

export function DealCard({ deal, isHero = false }: DealCardProps) {
  const { language } = useTranslation()
  const { getSoldPercentage, getRemainingStock } = useDailyDealsStore()

  const soldPercentage = getSoldPercentage(deal)
  const remaining = getRemainingStock(deal)
  const isAlmostGone = remaining <= 10

  if (isHero) {
    return (
      <div className="relative bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto rounded-xl overflow-hidden">
            <Image
              src={deal.image}
              alt={deal.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{deal.discount}%
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-1 text-amber-600 text-sm font-medium mb-2">
              <Star className="h-4 w-4 fill-current" />
              {language === 'id' ? 'Penawaran Hari Ini' : 'Deal of the Day'}
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              {language === 'id' ? deal.nameId : deal.name}
            </h3>

            <p className="text-muted-foreground mb-4">
              {language === 'id' ? deal.descriptionId : deal.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(deal.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({deal.reviewCount})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-red-500">
                {formatPrice(deal.dealPrice)}
              </span>
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(deal.originalPrice)}
              </span>
            </div>

            {/* Stock Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className={isAlmostGone ? 'text-red-500 font-medium' : 'text-muted-foreground'}>
                  {isAlmostGone
                    ? language === 'id' ? 'Hampir habis!' : 'Almost gone!'
                    : language === 'id' ? `${deal.soldCount} terjual` : `${deal.soldCount} sold`
                  }
                </span>
                <span className="text-muted-foreground">
                  {remaining} {language === 'id' ? 'tersisa' : 'left'}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isAlmostGone ? 'bg-red-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
                  }`}
                  style={{ width: `${soldPercentage}%` }}
                />
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1" asChild>
                <Link href={`/products/${deal.slug}`}>
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {language === 'id' ? 'Beli Sekarang' : 'Buy Now'}
                </Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-3">
              {language === 'id'
                ? `Maks. ${deal.limitPerUser} per pelanggan`
                : `Max ${deal.limitPerUser} per customer`
              }
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Regular deal card
  return (
    <Link
      href={`/products/${deal.slug}`}
      className="group bg-background border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={deal.image}
          alt={deal.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
          -{deal.discount}%
        </div>
        {isAlmostGone && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs font-medium animate-pulse">
            {language === 'id' ? 'Hampir habis' : 'Almost gone'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-xs text-muted-foreground mb-1">
          {language === 'id' ? deal.categoryId : deal.category}
        </p>
        <h4 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {language === 'id' ? deal.nameId : deal.name}
        </h4>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-bold text-red-500">
            {formatPrice(deal.dealPrice)}
          </span>
          <span className="text-xs text-muted-foreground line-through">
            {formatPrice(deal.originalPrice)}
          </span>
        </div>

        {/* Stock Progress */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              isAlmostGone ? 'bg-red-500' : 'bg-amber-500'
            }`}
            style={{ width: `${soldPercentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {deal.soldCount}/{deal.totalStock} {language === 'id' ? 'terjual' : 'sold'}
        </p>
      </div>
    </Link>
  )
}
