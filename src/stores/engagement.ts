import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface EngagementState {
  // Daily spin
  lastSpinDate: string | null
  canSpinToday: boolean
  totalSpins: number

  // Streak
  currentStreak: number
  lastVisitDate: string | null
  streakClaimedToday: boolean

  // Points from engagement
  engagementPoints: number

  // Actions
  recordSpin: () => void
  recordVisit: () => void
  claimStreakReward: (points: number) => void
  addPoints: (points: number) => void
  checkCanSpin: () => boolean
  checkStreak: () => number
}

const getToday = () => new Date().toISOString().split('T')[0]

const isYesterday = (dateStr: string) => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return dateStr === yesterday.toISOString().split('T')[0]
}

export const useEngagementStore = create<EngagementState>()(
  persist(
    (set, get) => ({
      lastSpinDate: null,
      canSpinToday: true,
      totalSpins: 0,
      currentStreak: 0,
      lastVisitDate: null,
      streakClaimedToday: false,
      engagementPoints: 0,

      recordSpin: () => {
        const today = getToday()
        set({
          lastSpinDate: today,
          canSpinToday: false,
          totalSpins: get().totalSpins + 1,
        })
      },

      recordVisit: () => {
        const today = getToday()
        const { lastVisitDate, currentStreak } = get()

        if (lastVisitDate === today) {
          // Already visited today
          return
        }

        let newStreak = 1
        if (lastVisitDate && isYesterday(lastVisitDate)) {
          // Continued streak
          newStreak = currentStreak + 1
        }

        set({
          lastVisitDate: today,
          currentStreak: newStreak,
          streakClaimedToday: false,
          canSpinToday: get().lastSpinDate !== today,
        })
      },

      claimStreakReward: (points: number) => {
        set({
          streakClaimedToday: true,
          engagementPoints: get().engagementPoints + points,
        })
      },

      addPoints: (points: number) => {
        set({ engagementPoints: get().engagementPoints + points })
      },

      checkCanSpin: () => {
        const today = getToday()
        return get().lastSpinDate !== today
      },

      checkStreak: () => {
        const { lastVisitDate, currentStreak } = get()
        const today = getToday()

        if (!lastVisitDate) return 0
        if (lastVisitDate === today) return currentStreak
        if (isYesterday(lastVisitDate)) return currentStreak
        return 0 // Streak broken
      },
    }),
    {
      name: 'uc-engagement',
    }
  )
)
