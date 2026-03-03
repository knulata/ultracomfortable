'use client'

import { useState, useEffect } from 'react'
import { X, Gift, Flame, Check, Sparkles, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { useCheckInStore, DAILY_REWARDS, CheckInReward } from '@/stores/checkIn'
import confetti from 'canvas-confetti'

export function CheckInModal() {
  const { language } = useTranslation()
  const {
    showCheckInModal,
    closeCheckInModal,
    checkIn,
    canCheckIn,
    getStreakDay,
    currentStreak,
    todayReward,
  } = useCheckInStore()

  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [earnedReward, setEarnedReward] = useState<CheckInReward | null>(null)

  const streakDay = getStreakDay()

  useEffect(() => {
    // Reset state when modal opens
    if (showCheckInModal) {
      setIsCheckedIn(!canCheckIn())
      setEarnedReward(todayReward)
    }
  }, [showCheckInModal, canCheckIn, todayReward])

  const handleCheckIn = () => {
    const reward = checkIn()
    if (reward) {
      setIsCheckedIn(true)
      setEarnedReward(reward)

      // Celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'],
      })
    }
  }

  if (!showCheckInModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeCheckInModal} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-background rounded-2xl shadow-xl overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <button
            onClick={closeCheckInModal}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-6 w-6" />
              <span className="text-lg font-bold">
                {currentStreak} {language === 'id' ? 'Hari Berturut-turut!' : 'Day Streak!'}
              </span>
            </div>
            <p className="text-sm opacity-90">
              {language === 'id'
                ? 'Check-in setiap hari untuk mendapat lebih banyak hadiah!'
                : 'Check in daily to earn more rewards!'}
            </p>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="p-4">
          <div className="grid grid-cols-7 gap-2">
            {DAILY_REWARDS.map((reward, index) => {
              const dayNum = index + 1
              const isPast = dayNum < streakDay
              const isCurrent = dayNum === streakDay
              const isFuture = dayNum > streakDay
              const isDay7 = dayNum === 7

              return (
                <div
                  key={dayNum}
                  className={`relative flex flex-col items-center p-2 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-primary text-primary-foreground scale-110 shadow-lg z-10'
                      : isPast
                      ? 'bg-green-100 text-green-700'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {/* Day label */}
                  <span className="text-[10px] font-medium mb-1">
                    {language === 'id' ? 'Hari' : 'Day'} {dayNum}
                  </span>

                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    isPast ? 'bg-green-500 text-white' : isCurrent ? 'bg-white/20' : 'bg-background'
                  }`}>
                    {isPast ? (
                      <Check className="h-4 w-4" />
                    ) : isDay7 ? (
                      <Gift className="h-4 w-4" />
                    ) : (
                      <Star className="h-4 w-4" />
                    )}
                  </div>

                  {/* Points */}
                  <span className="text-xs font-bold">+{reward.points}</span>

                  {/* Bonus indicator */}
                  {isDay7 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                      <Sparkles className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Day 7 Bonus Info */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-2 text-amber-700">
              <Gift className="h-4 w-4" />
              <span className="text-sm font-medium">
                {language === 'id' ? 'Bonus Hari ke-7:' : 'Day 7 Bonus:'}
              </span>
            </div>
            <p className="text-xs text-amber-600 mt-1">
              {language === 'id'
                ? '50 points + Kupon Diskon 10%!'
                : '50 points + 10% Off Coupon!'}
            </p>
          </div>
        </div>

        {/* Check-in Button */}
        <div className="p-4 pt-0">
          {isCheckedIn ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-green-600 mb-1">
                {language === 'id' ? 'Sudah Check-in!' : 'Checked In!'}
              </h3>
              {earnedReward && (
                <p className="text-sm text-muted-foreground">
                  {language === 'id' ? 'Kamu dapat' : 'You earned'}{' '}
                  <span className="font-bold text-primary">+{earnedReward.points} points</span>
                </p>
              )}
              <Button onClick={closeCheckInModal} variant="outline" className="mt-4">
                {language === 'id' ? 'Tutup' : 'Close'}
              </Button>
            </div>
          ) : (
            <Button onClick={handleCheckIn} className="w-full" size="lg">
              <Gift className="h-5 w-5 mr-2" />
              {language === 'id' ? 'Check-in Sekarang' : 'Check In Now'}
              <span className="ml-2 text-xs opacity-80">
                (+{DAILY_REWARDS[streakDay - 1]?.points || 5} pts)
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
