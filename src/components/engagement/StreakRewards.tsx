'use client'

import { useState, useEffect } from 'react'
import { X, Flame, Gift, Check, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import confetti from 'canvas-confetti'

interface StreakDay {
  day: number
  reward: string
  rewardId: string
  points: number
  claimed: boolean
  available: boolean
}

const defaultStreak: StreakDay[] = [
  { day: 1, reward: '10 Points', rewardId: '10 Poin', points: 10, claimed: false, available: true },
  { day: 2, reward: '15 Points', rewardId: '15 Poin', points: 15, claimed: false, available: false },
  { day: 3, reward: '20 Points', rewardId: '20 Poin', points: 20, claimed: false, available: false },
  { day: 4, reward: '25 Points', rewardId: '25 Poin', points: 25, claimed: false, available: false },
  { day: 5, reward: '30 Points', rewardId: '30 Poin', points: 30, claimed: false, available: false },
  { day: 6, reward: '40 Points', rewardId: '40 Poin', points: 40, claimed: false, available: false },
  { day: 7, reward: '100 Points + Free Shipping', rewardId: '100 Poin + Gratis Ongkir', points: 100, claimed: false, available: false },
]

interface StreakRewardsProps {
  isOpen: boolean
  onClose: () => void
}

export function StreakRewards({ isOpen, onClose }: StreakRewardsProps) {
  const { language } = useTranslation()
  const [streak, setStreak] = useState(defaultStreak)
  const [currentStreak, setCurrentStreak] = useState(1)
  const [totalPoints, setTotalPoints] = useState(0)

  const claimReward = (day: number) => {
    const dayIndex = day - 1
    if (!streak[dayIndex].available || streak[dayIndex].claimed) return

    // Claim the reward
    setStreak(prev => prev.map((d, i) => {
      if (i === dayIndex) return { ...d, claimed: true }
      if (i === dayIndex + 1) return { ...d, available: true }
      return d
    }))

    setTotalPoints(prev => prev + streak[dayIndex].points)
    setCurrentStreak(day)

    // Celebration
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#c9a87c', '#ffd700'],
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-background rounded-3xl p-6 max-w-md w-full shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-3">
            <Flame className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">
            {language === 'id' ? 'Hadiah Streak Harian' : 'Daily Streak Rewards'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {language === 'id'
              ? 'Kunjungi setiap hari untuk hadiah lebih besar!'
              : 'Visit daily for bigger rewards!'}
          </p>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Flame className="h-6 w-6 text-orange-500" />
          <span className="text-3xl font-bold text-orange-500">{currentStreak}</span>
          <span className="text-muted-foreground">
            {language === 'id' ? 'hari berturut-turut' : 'day streak'}
          </span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {streak.map((day) => (
            <button
              key={day.day}
              onClick={() => claimReward(day.day)}
              disabled={!day.available || day.claimed}
              className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                day.claimed
                  ? 'bg-green-100 border-2 border-green-500'
                  : day.available
                  ? 'bg-primary/10 border-2 border-primary animate-pulse cursor-pointer hover:scale-105'
                  : 'bg-muted border-2 border-transparent'
              }`}
            >
              {/* Day number */}
              <span className={`text-xs font-medium ${day.claimed ? 'text-green-600' : day.available ? 'text-primary' : 'text-muted-foreground'}`}>
                {language === 'id' ? 'Hari' : 'Day'} {day.day}
              </span>

              {/* Icon */}
              {day.claimed ? (
                <Check className="h-5 w-5 text-green-500 mt-1" />
              ) : day.available ? (
                <Gift className="h-5 w-5 text-primary mt-1" />
              ) : (
                <Lock className="h-4 w-4 text-muted-foreground mt-1" />
              )}

              {/* Day 7 special indicator */}
              {day.day === 7 && !day.claimed && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
              )}
            </button>
          ))}
        </div>

        {/* Today's Reward */}
        <div className="bg-muted/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {language === 'id' ? 'Hadiah Hari Ini' : "Today's Reward"}
              </p>
              <p className="font-semibold text-lg">
                {language === 'id'
                  ? streak.find(d => d.available && !d.claimed)?.rewardId || 'Semua diklaim!'
                  : streak.find(d => d.available && !d.claimed)?.reward || 'All claimed!'}
              </p>
            </div>
            {streak.some(d => d.available && !d.claimed) && (
              <Button
                onClick={() => {
                  const available = streak.find(d => d.available && !d.claimed)
                  if (available) claimReward(available.day)
                }}
              >
                {language === 'id' ? 'Klaim' : 'Claim'}
              </Button>
            )}
          </div>
        </div>

        {/* Total Points */}
        <div className="text-center text-sm text-muted-foreground">
          {language === 'id' ? 'Total poin dikumpulkan minggu ini:' : 'Total points collected this week:'}{' '}
          <span className="font-bold text-primary">{totalPoints}</span>
        </div>
      </div>
    </div>
  )
}

// Mini streak indicator for header/nav
export function StreakIndicator({ onClick }: { onClick: () => void }) {
  const [streak] = useState(Math.floor(Math.random() * 7) + 1)

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-orange-100 to-red-100 rounded-full hover:from-orange-200 hover:to-red-200 transition-colors"
    >
      <Flame className="h-4 w-4 text-orange-500" />
      <span className="text-sm font-bold text-orange-600">{streak}</span>
    </button>
  )
}
