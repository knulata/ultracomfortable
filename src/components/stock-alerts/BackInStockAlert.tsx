'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, Mail, Users, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStockAlertsStore } from '@/stores/stockAlerts'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

interface BackInStockAlertProps {
  productId: string
  productSlug: string
  productName: string
  productNameId: string
  variantId: string
  size: string
  color: string
  variant?: 'inline' | 'modal' | 'compact'
}

export function BackInStockAlert({
  productId,
  productSlug,
  productName,
  productNameId,
  variantId,
  size,
  color,
  variant = 'inline',
}: BackInStockAlertProps) {
  const { language } = useTranslation()
  const {
    subscribeToAlert,
    unsubscribeFromAlert,
    isSubscribed,
    getWaitlistCount,
  } = useStockAlertsStore()

  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showEmailInput, setShowEmailInput] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const subscribed = mounted ? isSubscribed(variantId) : false
  const waitlistCount = mounted ? getWaitlistCount(variantId) : 0

  const handleSubscribe = async () => {
    if (showEmailInput && !email) {
      toast.error(language === 'id' ? 'Masukkan email Anda' : 'Please enter your email')
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    subscribeToAlert({
      productId,
      productSlug,
      productName,
      productNameId,
      variantId,
      size,
      color,
      email: email || undefined,
    })

    setIsLoading(false)
    setShowEmailInput(false)
    setEmail('')

    toast.success(
      language === 'id'
        ? 'Anda akan diberitahu saat stok tersedia!'
        : "We'll notify you when it's back in stock!"
    )
  }

  const handleUnsubscribe = () => {
    unsubscribeFromAlert(variantId)
    toast.success(
      language === 'id'
        ? 'Notifikasi dibatalkan'
        : 'Alert removed'
    )
  }

  if (!mounted) {
    return (
      <div className="animate-pulse bg-muted rounded-lg h-24" />
    )
  }

  // Compact variant - just a button
  if (variant === 'compact') {
    return (
      <Button
        variant={subscribed ? 'outline' : 'secondary'}
        size="sm"
        onClick={subscribed ? handleUnsubscribe : handleSubscribe}
        disabled={isLoading}
        className="gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : subscribed ? (
          <>
            <BellOff className="h-4 w-4" />
            {language === 'id' ? 'Batalkan' : 'Cancel Alert'}
          </>
        ) : (
          <>
            <Bell className="h-4 w-4" />
            {language === 'id' ? 'Beritahu Saya' : 'Notify Me'}
          </>
        )}
      </Button>
    )
  }

  // Inline variant - full card
  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
          <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900 dark:text-amber-100">
            {language === 'id' ? 'Stok Habis' : 'Out of Stock'}
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {color} - {size}
          </p>
        </div>
      </div>

      {subscribed ? (
        // Already subscribed state
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Check className="h-4 w-4" />
            <span>
              {language === 'id'
                ? 'Anda akan diberitahu saat tersedia'
                : "You'll be notified when available"
              }
            </span>
          </div>

          {waitlistCount > 1 && (
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
              <Users className="h-3.5 w-3.5" />
              <span>
                {waitlistCount.toLocaleString()} {language === 'id' ? 'orang menunggu' : 'people waiting'}
              </span>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleUnsubscribe}
            className="text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100"
          >
            <BellOff className="h-4 w-4 mr-2" />
            {language === 'id' ? 'Batalkan Notifikasi' : 'Cancel Notification'}
          </Button>
        </div>
      ) : (
        // Subscribe state
        <div className="space-y-3">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {language === 'id'
              ? 'Dapatkan notifikasi saat produk ini kembali tersedia.'
              : 'Get notified when this item is back in stock.'
            }
          </p>

          {waitlistCount > 0 && (
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
              <Users className="h-3.5 w-3.5" />
              <span>
                {waitlistCount.toLocaleString()} {language === 'id' ? 'orang menunggu' : 'people waiting'}
              </span>
            </div>
          )}

          {showEmailInput ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={language === 'id' ? 'Email Anda' : 'Your email'}
                    className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  size="sm"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    language === 'id' ? 'Kirim' : 'Submit'
                  )}
                </Button>
              </div>
              <button
                onClick={() => setShowEmailInput(false)}
                className="text-xs text-muted-foreground hover:underline"
              >
                {language === 'id' ? 'Batal' : 'Cancel'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Bell className="h-4 w-4 mr-2" />
                )}
                {language === 'id' ? 'Beritahu Saya' : 'Notify Me'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEmailInput(true)}
                className="flex-1 sm:flex-none"
              >
                <Mail className="h-4 w-4 mr-2" />
                {language === 'id' ? 'Via Email' : 'Get Email'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
