'use client'

import { useState, useEffect } from 'react'
import { Gift, Flame, X } from 'lucide-react'
import { useTranslation } from '@/stores/language'
import { useEngagementStore } from '@/stores/engagement'
import { DailySpinWheel } from './DailySpinWheel'
import { StreakRewards } from './StreakRewards'
import { toast } from 'sonner'

export function EngagementHub() {
  const { language } = useTranslation()
  const { recordVisit, checkCanSpin, checkStreak, addPoints } = useEngagementStore()
  const [showSpinWheel, setShowSpinWheel] = useState(false)
  const [showStreakRewards, setShowStreakRewards] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasNewReward, setHasNewReward] = useState(false)

  const canSpin = checkCanSpin()
  const currentStreak = checkStreak()

  useEffect(() => {
    // Record visit on mount
    recordVisit()

    // Check if user has unclaimed rewards
    if (canSpin) {
      setHasNewReward(true)
      // Auto-show spin wheel for first-time users after 3 seconds
      const timer = setTimeout(() => {
        setShowSpinWheel(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleSpinWin = (prize: any) => {
    // Add points if applicable
    const points = parseInt(prize.value) || 0
    if (points > 0) {
      addPoints(points)
    }
    toast.success(
      language === 'id'
        ? `Selamat! Anda mendapat ${prize.labelId}!`
        : `Congratulations! You won ${prize.label}!`
    )
  }

  return (
    <>
      {/* Floating Rewards Button */}
      <div className="fixed bottom-4 right-4 z-40">
        {/* Expanded Menu */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 bg-background rounded-2xl shadow-2xl border p-3 min-w-[200px] animate-in slide-in-from-bottom-2 duration-200">
            {/* Close */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute -top-2 -right-2 p-1 bg-muted rounded-full"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="text-xs text-muted-foreground mb-2 px-1">
              {language === 'id' ? 'Hadiah Harian' : 'Daily Rewards'}
            </p>

            {/* Spin Wheel */}
            <button
              onClick={() => {
                setShowSpinWheel(true)
                setIsExpanded(false)
                setHasNewReward(false)
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                canSpin
                  ? 'bg-gradient-to-r from-primary/10 to-yellow-500/10 hover:from-primary/20 hover:to-yellow-500/20'
                  : 'bg-muted/50'
              }`}
            >
              <div className={`p-2 rounded-full ${canSpin ? 'bg-primary/20' : 'bg-muted'}`}>
                <Gift className={`h-5 w-5 ${canSpin ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">
                  {language === 'id' ? 'Putar & Menang' : 'Spin & Win'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {canSpin
                    ? language === 'id' ? '1 putaran gratis!' : '1 free spin!'
                    : language === 'id' ? 'Besok lagi!' : 'Come back tomorrow!'}
                </p>
              </div>
              {canSpin && (
                <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>

            {/* Streak */}
            <button
              onClick={() => {
                setShowStreakRewards(true)
                setIsExpanded(false)
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors mt-1"
            >
              <div className="p-2 rounded-full bg-orange-100">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">
                  {language === 'id' ? 'Streak Harian' : 'Daily Streak'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentStreak} {language === 'id' ? 'hari berturut-turut' : 'day streak'}
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative w-14 h-14 bg-gradient-to-br from-primary to-yellow-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Gift className="h-6 w-6 text-primary-foreground" />

          {/* Notification badge */}
          {hasNewReward && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">!</span>
            </span>
          )}

          {/* Streak badge */}
          {currentStreak > 0 && (
            <span className="absolute -bottom-1 -left-1 flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-500 rounded-full">
              <Flame className="h-3 w-3 text-white" />
              <span className="text-xs text-white font-bold">{currentStreak}</span>
            </span>
          )}
        </button>
      </div>

      {/* Modals */}
      <DailySpinWheel
        isOpen={showSpinWheel}
        onClose={() => setShowSpinWheel(false)}
        onWin={handleSpinWin}
      />

      <StreakRewards
        isOpen={showStreakRewards}
        onClose={() => setShowStreakRewards(false)}
      />
    </>
  )
}
