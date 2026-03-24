'use client'

import { useState } from 'react'
import { ShoppingBag, Video, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'

const TIKTOK_SHOP_URL = process.env.NEXT_PUBLIC_TIKTOK_SHOP_URL || ''
const TIKTOK_LIVE_URL = process.env.NEXT_PUBLIC_TIKTOK_LIVE_URL || ''

interface TikTokShopButtonProps {
  productId?: string
  variant?: 'shop' | 'live' | 'both'
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

/**
 * TikTok Shop / Live Shopping Button
 * Links to Alyanoor's TikTok Shop or Live stream
 */
export function TikTokShopButton({
  productId,
  variant = 'both',
  size = 'default',
  className = '',
}: TikTokShopButtonProps) {
  const { language } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)

  const shopUrl = productId
    ? `${TIKTOK_SHOP_URL}/product/${productId}`
    : TIKTOK_SHOP_URL

  const handleShopClick = () => {
    if (shopUrl) {
      window.open(shopUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleLiveClick = () => {
    if (TIKTOK_LIVE_URL) {
      window.open(TIKTOK_LIVE_URL, '_blank', 'noopener,noreferrer')
    }
  }

  if (!TIKTOK_SHOP_URL && !TIKTOK_LIVE_URL) {
    return null
  }

  if (variant === 'shop') {
    return (
      <Button
        onClick={handleShopClick}
        size={size}
        variant="outline"
        className={`bg-black text-white hover:bg-gray-800 border-black ${className}`}
      >
        <TikTokIcon className="h-4 w-4 mr-2" />
        {language === 'id' ? 'Beli di TikTok Shop' : 'Buy on TikTok Shop'}
        <ExternalLink className="h-3 w-3 ml-2" />
      </Button>
    )
  }

  if (variant === 'live') {
    return (
      <Button
        onClick={handleLiveClick}
        size={size}
        className={`bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white ${className}`}
      >
        <Video className="h-4 w-4 mr-2 animate-pulse" />
        {language === 'id' ? 'Tonton Live' : 'Watch Live'}
        <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">
          LIVE
        </span>
      </Button>
    )
  }

  // Both variant - show both buttons
  return (
    <div className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      {TIKTOK_SHOP_URL && (
        <Button
          onClick={handleShopClick}
          size={size}
          variant="outline"
          className="bg-black text-white hover:bg-gray-800 border-black flex-1"
        >
          <TikTokIcon className="h-4 w-4 mr-2" />
          {language === 'id' ? 'TikTok Shop' : 'TikTok Shop'}
          <ExternalLink className="h-3 w-3 ml-2" />
        </Button>
      )}

      {TIKTOK_LIVE_URL && (
        <Button
          onClick={handleLiveClick}
          size={size}
          className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white flex-1"
        >
          <Video className="h-4 w-4 mr-2" />
          {language === 'id' ? 'Live Shopping' : 'Live Shopping'}
        </Button>
      )}
    </div>
  )
}

/**
 * TikTok Live Banner
 * Show when there's an active live stream
 */
export function TikTokLiveBanner() {
  const { language } = useTranslation()
  const [dismissed, setDismissed] = useState(false)

  // In production, check if there's actually a live stream
  const isLive = !!TIKTOK_LIVE_URL

  if (!isLive || dismissed) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white py-2 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="font-semibold text-sm">LIVE</span>
          </span>
          <span className="text-sm">
            {language === 'id'
              ? 'Kami sedang live! Dapatkan diskon eksklusif'
              : "We're live! Get exclusive discounts"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white text-pink-600 hover:bg-gray-100"
            onClick={() => window.open(TIKTOK_LIVE_URL, '_blank')}
          >
            <Video className="h-4 w-4 mr-1" />
            {language === 'id' ? 'Tonton' : 'Watch'}
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="text-white/80 hover:text-white"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * TikTok Icon SVG
 */
function TikTokIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

export default TikTokShopButton
