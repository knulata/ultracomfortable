'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, MapPin } from 'lucide-react'
import { useTranslation } from '@/stores/language'
import { formatPrice } from '@/stores/cart'

interface Activity {
  id: string
  name: string
  city: string
  product: string
  productId: string
  price: number
  timeAgo: string
}

// Indonesian names and cities for realistic feel
const indonesianNames = [
  'Siti', 'Dewi', 'Rina', 'Maya', 'Putri', 'Ayu', 'Novi', 'Dian', 'Fitri', 'Wulan',
  'Budi', 'Andi', 'Rudi', 'Doni', 'Eko', 'Agus', 'Rizky', 'Fajar', 'Bayu', 'Arief',
]

const indonesianCities = [
  'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Palembang',
  'Tangerang', 'Depok', 'Bekasi', 'Yogyakarta', 'Malang', 'Solo', 'Denpasar', 'Batam',
]

const products = [
  { name: 'Oversized Cotton Tee', nameId: 'Kaos Oversized Katun', price: 199000 },
  { name: 'Slim Fit Jeans', nameId: 'Jeans Slim Fit', price: 449000 },
  { name: 'Casual Blazer', nameId: 'Blazer Kasual', price: 699000 },
  { name: 'Printed Midi Dress', nameId: 'Gaun Midi Bermotif', price: 399000 },
  { name: 'Cropped Cardigan', nameId: 'Kardigan Crop', price: 349000 },
  { name: 'Satin Blouse', nameId: 'Blus Satin', price: 299000 },
  { name: 'Wide Leg Trousers', nameId: 'Celana Lebar', price: 449000 },
  { name: 'Ribbed Tank Top', nameId: 'Tank Top Ribbed', price: 149000 },
]

const generateActivity = (): Activity => {
  const product = products[Math.floor(Math.random() * products.length)]
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: indonesianNames[Math.floor(Math.random() * indonesianNames.length)],
    city: indonesianCities[Math.floor(Math.random() * indonesianCities.length)],
    product: product.name,
    productId: product.nameId,
    price: product.price,
    timeAgo: `${Math.floor(Math.random() * 5) + 1}`,
  }
}

export function LiveActivityFeed() {
  const { language } = useTranslation()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show first activity after 5 seconds
    const initialTimeout = setTimeout(() => {
      showNewActivity()
    }, 5000)

    return () => clearTimeout(initialTimeout)
  }, [])

  const showNewActivity = () => {
    const newActivity = generateActivity()
    setActivity(newActivity)
    setIsVisible(true)

    // Hide after 4 seconds
    setTimeout(() => {
      setIsVisible(false)

      // Show next activity after random interval (8-15 seconds)
      const nextInterval = Math.random() * 7000 + 8000
      setTimeout(showNewActivity, nextInterval)
    }, 4000)
  }

  if (!activity || !isVisible) return null

  return (
    <div
      className={`fixed bottom-4 left-4 z-40 max-w-xs transition-all duration-500 ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}
    >
      <div className="bg-background/95 backdrop-blur-sm border rounded-xl p-3 shadow-lg">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="p-2 bg-green-100 rounded-full flex-shrink-0">
            <ShoppingBag className="h-4 w-4 text-green-600" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              <span className="text-primary">{activity.name}</span>
              {' '}
              {language === 'id' ? 'baru saja membeli' : 'just purchased'}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {language === 'id' ? activity.productId : activity.product}
            </p>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {activity.city}
              </span>
              <span>•</span>
              <span>{activity.timeAgo} {language === 'id' ? 'menit lalu' : 'min ago'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact version for product pages - shows "X people viewing"
export function ViewingNow({ count }: { count?: number }) {
  const { language } = useTranslation()
  const [viewers, setViewers] = useState(count || Math.floor(Math.random() * 20) + 5)

  useEffect(() => {
    // Randomly fluctuate viewers
    const interval = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2
        return Math.max(3, prev + change)
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span className="text-muted-foreground">
        <span className="font-medium text-foreground">{viewers}</span>
        {' '}
        {language === 'id' ? 'orang sedang melihat ini' : 'people viewing this'}
      </span>
    </div>
  )
}

// "X sold in last 24h" badge
export function RecentSales({ productId }: { productId: string }) {
  const { language } = useTranslation()
  const sales = Math.floor(Math.random() * 50) + 10

  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
      <span className="text-orange-500">🔥</span>
      {sales} {language === 'id' ? 'terjual dalam 24 jam terakhir' : 'sold in last 24h'}
    </div>
  )
}
