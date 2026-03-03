'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Gift, X, ChevronRight } from 'lucide-react'
import { useTranslation } from '@/stores/language'
import { REFERRAL_CONFIG } from '@/stores/referral'

interface ReferralBannerProps {
  variant?: 'full' | 'compact'
  dismissible?: boolean
}

export function ReferralBanner({ variant = 'full', dismissible = true }: ReferralBannerProps) {
  const { language } = useTranslation()
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  if (variant === 'compact') {
    return (
      <Link
        href="/account/referrals"
        className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-3 hover:from-primary/15 hover:to-primary/10 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Gift className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {language === 'id' ? 'Ajak Teman, Dapat Hadiah!' : 'Invite Friends, Get Rewards!'}
            </p>
            <p className="text-xs text-muted-foreground">
              {language === 'id'
                ? `Dapat ${REFERRAL_CONFIG.referrerPoints} points per referral`
                : `Earn ${REFERRAL_CONFIG.referrerPoints} points per referral`}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </Link>
    )
  }

  return (
    <div className="relative bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="relative flex items-center gap-6">
        <div className="hidden sm:flex w-16 h-16 rounded-full bg-white/20 items-center justify-center flex-shrink-0">
          <Gift className="h-8 w-8" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">
            {language === 'id'
              ? 'Ajak Teman, Dapat Hadiah Bersama!'
              : 'Invite Friends, Earn Together!'}
          </h3>
          <p className="text-sm opacity-90 mb-4">
            {language === 'id'
              ? `Temanmu dapat diskon ${REFERRAL_CONFIG.refereeDiscount}% + ${REFERRAL_CONFIG.refereePoints} points. Kamu dapat ${REFERRAL_CONFIG.referrerPoints} points setiap referral berhasil!`
              : `Your friend gets ${REFERRAL_CONFIG.refereeDiscount}% off + ${REFERRAL_CONFIG.refereePoints} points. You earn ${REFERRAL_CONFIG.referrerPoints} points for every successful referral!`}
          </p>
          <Link
            href="/account/referrals"
            className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/90 transition-colors"
          >
            {language === 'id' ? 'Mulai Ajak Teman' : 'Start Inviting'}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
