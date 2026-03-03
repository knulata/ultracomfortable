'use client'

import { Flame, Gift, Check } from 'lucide-react'
import { useTranslation } from '@/stores/language'
import { useCheckInStore, DAILY_REWARDS } from '@/stores/checkIn'

interface CheckInButtonProps {
  variant?: 'default' | 'compact' | 'banner'
}

export function CheckInButton({ variant = 'default' }: CheckInButtonProps) {
  const { language } = useTranslation()
  const { openCheckInModal, canCheckIn, currentStreak, getStreakDay } = useCheckInStore()

  const hasCheckedIn = !canCheckIn()
  const streakDay = getStreakDay()
  const todayPoints = DAILY_REWARDS[streakDay - 1]?.points || 5

  if (variant === 'compact') {
    return (
      <button
        onClick={openCheckInModal}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          hasCheckedIn
            ? 'bg-green-100 text-green-700'
            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 animate-pulse'
        }`}
      >
        {hasCheckedIn ? (
          <>
            <Check className="h-4 w-4" />
            <Flame className="h-4 w-4" />
            <span>{currentStreak}</span>
          </>
        ) : (
          <>
            <Gift className="h-4 w-4" />
            <span>{language === 'id' ? 'Check-in' : 'Check-in'}</span>
          </>
        )}
      </button>
    )
  }

  if (variant === 'banner') {
    return (
      <button
        onClick={openCheckInModal}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white text-left hover:from-amber-600 hover:to-orange-600 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              hasCheckedIn ? 'bg-green-500' : 'bg-white/20'
            }`}>
              {hasCheckedIn ? (
                <Check className="h-6 w-6 text-white" />
              ) : (
                <Gift className="h-6 w-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5" />
                <span className="font-bold">
                  {currentStreak} {language === 'id' ? 'Hari Streak' : 'Day Streak'}
                </span>
              </div>
              <p className="text-sm opacity-90">
                {hasCheckedIn
                  ? language === 'id'
                    ? 'Sudah check-in hari ini!'
                    : 'Already checked in today!'
                  : language === 'id'
                  ? `Check-in untuk dapat +${todayPoints} points`
                  : `Check in to earn +${todayPoints} points`}
              </p>
            </div>
          </div>
          {!hasCheckedIn && (
            <div className="bg-white text-amber-600 px-4 py-2 rounded-lg font-semibold text-sm group-hover:bg-amber-50 transition-colors">
              {language === 'id' ? 'Klaim' : 'Claim'}
            </div>
          )}
        </div>
      </button>
    )
  }

  // Default variant
  return (
    <button
      onClick={openCheckInModal}
      className={`flex flex-col items-center p-4 rounded-xl transition-all ${
        hasCheckedIn
          ? 'bg-green-50 border-2 border-green-200'
          : 'bg-gradient-to-br from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl hover:scale-105'
      }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
        hasCheckedIn ? 'bg-green-100' : 'bg-white/20'
      }`}>
        {hasCheckedIn ? (
          <Check className="h-6 w-6 text-green-600" />
        ) : (
          <Gift className="h-6 w-6" />
        )}
      </div>

      <div className="flex items-center gap-1 mb-1">
        <Flame className={`h-4 w-4 ${hasCheckedIn ? 'text-orange-500' : ''}`} />
        <span className={`font-bold ${hasCheckedIn ? 'text-foreground' : ''}`}>
          {currentStreak}
        </span>
      </div>

      <span className={`text-xs ${hasCheckedIn ? 'text-muted-foreground' : 'opacity-90'}`}>
        {hasCheckedIn
          ? language === 'id'
            ? 'Selesai'
            : 'Done'
          : language === 'id'
          ? 'Check-in'
          : 'Check-in'}
      </span>

      {!hasCheckedIn && (
        <span className="text-xs mt-1 opacity-75">+{todayPoints} pts</span>
      )}
    </button>
  )
}
