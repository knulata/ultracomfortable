'use client'

import { Flame, Gift, Trophy, Target, Sparkles, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { useCheckInStore, DAILY_REWARDS, MILESTONE_REWARDS } from '@/stores/checkIn'
import { CheckInButton, CheckInCalendar } from '@/components/check-in'

export default function CheckInPage() {
  const { language } = useTranslation()
  const {
    currentStreak,
    longestStreak,
    totalCheckInPoints,
    canCheckIn,
    getStreakDay,
    getMilestoneProgress,
    openCheckInModal,
  } = useCheckInStore()

  const streakDay = getStreakDay()
  const { next: nextMilestone, progress: milestoneProgress } = getMilestoneProgress()
  const hasCheckedIn = !canCheckIn()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          {language === 'id' ? 'Check-in Harian' : 'Daily Check-in'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === 'id'
            ? 'Check-in setiap hari untuk mendapat hadiah!'
            : 'Check in every day to earn rewards!'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-5 w-5" />
            <span className="text-sm opacity-90">
              {language === 'id' ? 'Streak Saat Ini' : 'Current Streak'}
            </span>
          </div>
          <p className="text-3xl font-bold">{currentStreak}</p>
          <p className="text-xs opacity-75">
            {language === 'id' ? 'hari berturut-turut' : 'consecutive days'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5" />
            <span className="text-sm opacity-90">
              {language === 'id' ? 'Streak Terpanjang' : 'Longest Streak'}
            </span>
          </div>
          <p className="text-3xl font-bold">{longestStreak}</p>
          <p className="text-xs opacity-75">
            {language === 'id' ? 'hari' : 'days'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm opacity-90">
              {language === 'id' ? 'Total Points' : 'Total Points'}
            </span>
          </div>
          <p className="text-3xl font-bold">{totalCheckInPoints.toLocaleString()}</p>
          <p className="text-xs opacity-75">
            {language === 'id' ? 'dari check-in' : 'from check-ins'}
          </p>
        </div>
      </div>

      {/* Today's Check-in */}
      <div className="bg-background rounded-xl border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-lg">
              {language === 'id' ? 'Check-in Hari Ini' : "Today's Check-in"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {hasCheckedIn
                ? language === 'id'
                  ? 'Kamu sudah check-in hari ini!'
                  : "You've already checked in today!"
                : language === 'id'
                ? `Hari ke-${streakDay} - Dapatkan +${DAILY_REWARDS[streakDay - 1]?.points || 5} points`
                : `Day ${streakDay} - Earn +${DAILY_REWARDS[streakDay - 1]?.points || 5} points`}
            </p>
          </div>
          <CheckInButton />
        </div>

        {/* Weekly Progress */}
        <div className="grid grid-cols-7 gap-2">
          {DAILY_REWARDS.map((reward, index) => {
            const dayNum = index + 1
            const isPast = dayNum < streakDay
            const isCurrent = dayNum === streakDay && !hasCheckedIn
            const isCompleted = dayNum < streakDay || (dayNum === streakDay && hasCheckedIn)
            const isDay7 = dayNum === 7

            return (
              <div
                key={dayNum}
                className={`relative flex flex-col items-center p-3 rounded-xl transition-all ${
                  isCompleted
                    ? 'bg-green-100 text-green-700'
                    : isCurrent
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <span className="text-xs font-medium mb-2">
                  {language === 'id' ? 'Hari' : 'Day'} {dayNum}
                </span>

                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-white/20' : 'bg-background'
                }`}>
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : isDay7 ? (
                    <Gift className="h-5 w-5" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                </div>

                <span className="text-sm font-bold">+{reward.points}</span>

                {isDay7 && reward.bonus && (
                  <span className="text-[10px] mt-1 text-center leading-tight">
                    {language === 'id' ? reward.bonus.descriptionId : reward.bonus.description}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Milestone Progress */}
      {nextMilestone && (
        <div className="bg-background rounded-xl border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">
              {language === 'id' ? 'Milestone Berikutnya' : 'Next Milestone'}
            </h2>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {language === 'id' ? nextMilestone.labelId : nextMilestone.label} Streak
            </span>
            <span className="text-sm font-medium">
              {currentStreak} / {nextMilestone.streak} {language === 'id' ? 'hari' : 'days'}
            </span>
          </div>

          <div className="h-3 bg-muted rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all"
              style={{ width: `${milestoneProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {nextMilestone.streak - currentStreak} {language === 'id' ? 'hari lagi' : 'days to go'}
            </span>
            <span className="font-semibold text-primary">
              +{nextMilestone.points} {language === 'id' ? 'bonus points' : 'bonus points'}
            </span>
          </div>
        </div>
      )}

      {/* All Milestones */}
      <div className="bg-background rounded-xl border p-6">
        <h2 className="font-semibold mb-4">
          {language === 'id' ? 'Semua Milestone' : 'All Milestones'}
        </h2>

        <div className="space-y-3">
          {MILESTONE_REWARDS.map((milestone) => {
            const isAchieved = currentStreak >= milestone.streak

            return (
              <div
                key={milestone.streak}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isAchieved ? 'bg-green-50 border border-green-200' : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isAchieved ? 'bg-green-500 text-white' : 'bg-muted'
                  }`}>
                    {isAchieved ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Trophy className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${isAchieved ? 'text-green-700' : ''}`}>
                      {language === 'id' ? milestone.labelId : milestone.label} Streak
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {milestone.streak} {language === 'id' ? 'hari berturut-turut' : 'consecutive days'}
                    </p>
                  </div>
                </div>
                <div className={`font-bold ${isAchieved ? 'text-green-600' : 'text-muted-foreground'}`}>
                  +{milestone.points} pts
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Calendar */}
      <div>
        <h2 className="font-semibold mb-4">
          {language === 'id' ? 'Riwayat Check-in' : 'Check-in History'}
        </h2>
        <CheckInCalendar />
      </div>
    </div>
  )
}
