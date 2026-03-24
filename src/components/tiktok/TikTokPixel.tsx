'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || ''

// TikTok Pixel event types
type TikTokEvent =
  | 'ViewContent'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'PlaceAnOrder'
  | 'CompletePayment'
  | 'Search'
  | 'AddToWishlist'
  | 'Contact'
  | 'Subscribe'
  | 'SubmitForm'

interface TikTokEventParams {
  content_id?: string
  content_type?: string
  content_name?: string
  content_category?: string
  currency?: string
  value?: number
  quantity?: number
  price?: number
  query?: string
  description?: string
}

// Extend window type for TikTok Pixel
declare global {
  interface Window {
    ttq?: {
      load: (pixelId: string) => void
      page: () => void
      track: (event: TikTokEvent, params?: TikTokEventParams) => void
      identify: (params: { email?: string; phone?: string }) => void
    }
  }
}

/**
 * Track TikTok Pixel event
 */
export function trackTikTokEvent(
  event: TikTokEvent,
  params?: TikTokEventParams
) {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track(event, params)
  }
}

/**
 * Track page view
 */
export function trackPageView() {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.page()
  }
}

/**
 * Identify user for better attribution
 */
export function identifyUser(email?: string, phone?: string) {
  if (typeof window !== 'undefined' && window.ttq && (email || phone)) {
    window.ttq.identify({ email, phone })
  }
}

// Pre-built tracking functions for common events
export const tiktokEvents = {
  viewProduct: (product: {
    id: string
    name: string
    category: string
    price: number
  }) => {
    trackTikTokEvent('ViewContent', {
      content_id: product.id,
      content_name: product.name,
      content_category: product.category,
      content_type: 'product',
      currency: 'IDR',
      value: product.price,
    })
  },

  addToCart: (product: {
    id: string
    name: string
    price: number
    quantity: number
  }) => {
    trackTikTokEvent('AddToCart', {
      content_id: product.id,
      content_name: product.name,
      content_type: 'product',
      currency: 'IDR',
      value: product.price * product.quantity,
      quantity: product.quantity,
      price: product.price,
    })
  },

  initiateCheckout: (value: number, itemCount: number) => {
    trackTikTokEvent('InitiateCheckout', {
      content_type: 'product',
      currency: 'IDR',
      value,
      quantity: itemCount,
    })
  },

  placeOrder: (orderId: string, value: number, itemCount: number) => {
    trackTikTokEvent('PlaceAnOrder', {
      content_id: orderId,
      content_type: 'product',
      currency: 'IDR',
      value,
      quantity: itemCount,
    })
  },

  completePayment: (orderId: string, value: number) => {
    trackTikTokEvent('CompletePayment', {
      content_id: orderId,
      content_type: 'product',
      currency: 'IDR',
      value,
    })
  },

  search: (query: string) => {
    trackTikTokEvent('Search', {
      query,
    })
  },

  addToWishlist: (product: { id: string; name: string; price: number }) => {
    trackTikTokEvent('AddToWishlist', {
      content_id: product.id,
      content_name: product.name,
      content_type: 'product',
      currency: 'IDR',
      value: product.price,
    })
  },

  subscribe: (email: string) => {
    trackTikTokEvent('Subscribe', {
      description: 'Newsletter subscription',
    })
    identifyUser(email)
  },
}

/**
 * TikTok Pixel Component
 * Add this to your root layout to enable tracking
 */
export function TikTokPixel() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track page views on route change
  useEffect(() => {
    if (TIKTOK_PIXEL_ID) {
      trackPageView()
    }
  }, [pathname, searchParams])

  if (!TIKTOK_PIXEL_ID) {
    return null
  }

  return (
    <>
      <Script
        id="tiktok-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;
              var ttq=w[t]=w[t]||[];
              ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
              ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
              for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
              ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
              ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
              ttq.load('${TIKTOK_PIXEL_ID}');
              ttq.page();
            }(window, document, 'ttq');
          `,
        }}
      />
    </>
  )
}

export default TikTokPixel
