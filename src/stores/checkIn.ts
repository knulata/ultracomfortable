import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CheckInDay {
  date: string // YYYY-MM-DD
  points: number
  streakDay: number
}

export interface CheckInReward {
  day: number
  points: number
  bonus?: {
    type: 'coupon' | 'multiplier' | 'gift'
    value: string
    description: string
    descriptionId: string
  }
}

// Daily rewards configuration - increases with streak
export const DAILY_REWARDS: CheckInReward[] = [
  { day: 1, points: 5 },
  { day: 2, points: 10 },
  { day: 3, points: 15 },
  { day: 4, points: 20 },
  { day: 5, points: 30 },
  { day: 6, points: 40 },
  {
    day: 7,
    points: 50,
    bonus: {
      type: 'coupon',
      value: '10%',
      description: '10% Off Coupon',
      descriptionId: 'Kupon Diskon 10%',
    },
  },
]

// Milestone bonuses
export const MILESTONE_REWARDS = [
  { streak: 7, points: 100, label: '1 Week', labelId: '1 Minggu' },
  { streak: 14, points: 200, label: '2 Weeks', labelId: '2 Minggu' },
  { streak: 30, points: 500, label: '1 Month', labelId: '1 Bulan' },
  { streak: 60, points: 1000, label: '2 Months', labelId: '2 Bulan' },
  { streak: 90, points: 2000, label: '3 Months', labelId: '3 Bulan' },
]

interface CheckInState {
  // Check-in history
  checkInHistory: CheckInDay[]

  // Current streak
  currentStreak: number

  // Longest streak ever
  longestStreak: number

  // Total points earned from check-ins
  totalCheckInPoints: number

  // Last check-in date
  lastCheckInDate: string | null

  // Has checked in today
  hasCheckedInToday: boolean

  // Show check-in modal
  showCheckInModal: boolean

  // Today's reward (after checking in)
  todayReward: CheckInReward | null

  // Actions
  checkIn: () => CheckInReward | null
  canCheckIn: () => boolean
  getStreakDay: () => number
  getTodayReward: () => CheckInReward
  openCheckInModal: () => void
  closeCheckInModal: () => void
  getCheckInForDate: (date: string) => CheckInDay | undefined
  getMilestoneProgress: () => { current: number; next: typeof MILESTONE_REWARDS[0] | null; progress: number }
}

// Helper to get today's date string
const getTodayString = () => {
  return new Date().toISOString().split('T')[0]
}

// Helper to check if two dates are consecutive
const areConsecutiveDays = (date1: string, date2: string) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = d2.getTime() - d1.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)
  return diffDays === 1
}

// Generate mock history for demo
const generateMockHistory = (): CheckInDay[] => {
  const history: CheckInDay[] = []
  const today = new Date()

  // Generate last 5 days of check-ins (simulating a streak)
  for (let i = 5; i >= 1; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const streakDay = 6 - i
    history.push({
      date: dateStr,
      points: DAILY_REWARDS[(streakDay - 1) % 7].points,
      streakDay,
    })
  }

  return history
}

const mockHistory = generateMockHistory()

export const useCheckInStore = create<CheckInState>()(
  persist(
    (set, get) => ({
      checkInHistory: mockHistory,
      currentStreak: 5, // Demo: 5 day streak
      longestStreak: 12,
      totalCheckInPoints: 80, // Sum of 5+10+15+20+30
      lastCheckInDate: mockHistory[mockHistory.length - 1]?.date || null,
      hasCheckedInToday: false,
      showCheckInModal: false,
      todayReward: null,

      canCheckIn: () => {
        const { lastCheckInDate } = get()
        const today = getTodayString()
        return lastCheckInDate !== today
      },

      getStreakDay: () => {
        const { currentStreak, lastCheckInDate } = get()
        const today = getTodayString()

        if (!lastCheckInDate) return 1

        // If last check-in was yesterday, continue streak
        if (areConsecutiveDays(lastCheckInDate, today)) {
          return ((currentStreak) % 7) + 1
        }

        // If last check-in was today, return current position
        if (lastCheckInDate === today) {
          return (currentStreak % 7) || 7
        }

        // Streak broken, start from day 1
        return 1
      },

      getTodayReward: () => {
        const streakDay = get().getStreakDay()
        return DAILY_REWARDS[streakDay - 1] || DAILY_REWARDS[0]
      },

      checkIn: () => {
        const { canCheckIn, lastCheckInDate, currentStreak, longestStreak, totalCheckInPoints, checkInHistory } = get()

        if (!canCheckIn()) return null

        const today = getTodayString()
        let newStreak = 1

        // Check if continuing streak
        if (lastCheckInDate && areConsecutiveDays(lastCheckInDate, today)) {
          newStreak = currentStreak + 1
        }

        const streakDay = ((newStreak - 1) % 7) + 1
        const reward = DAILY_REWARDS[streakDay - 1]

        const newCheckIn: CheckInDay = {
          date: today,
          points: reward.points,
          streakDay,
        }

        // Check for milestone bonus
        let milestoneBonus = 0
        const milestone = MILESTONE_REWARDS.find(m => m.streak === newStreak)
        if (milestone) {
          milestoneBonus = milestone.points
        }

        set({
          checkInHistory: [...checkInHistory, newCheckIn],
          currentStreak: newStreak,
          longestStreak: Math.max(longestStreak, newStreak),
          totalCheckInPoints: totalCheckInPoints + reward.points + milestoneBonus,
          lastCheckInDate: today,
          hasCheckedInToday: true,
          todayReward: reward,
        })

        return reward
      },

      openCheckInModal: () => set({ showCheckInModal: true }),
      closeCheckInModal: () => set({ showCheckInModal: false }),

      getCheckInForDate: (date: string) => {
        return get().checkInHistory.find(c => c.date === date)
      },

      getMilestoneProgress: () => {
        const { currentStreak } = get()
        const nextMilestone = MILESTONE_REWARDS.find(m => m.streak > currentStreak)

        if (!nextMilestone) {
          return { current: currentStreak, next: null, progress: 100 }
        }

        const prevMilestone = MILESTONE_REWARDS.filter(m => m.streak <= currentStreak).pop()
        const start = prevMilestone?.streak || 0
        const progress = ((currentStreak - start) / (nextMilestone.streak - start)) * 100

        return { current: currentStreak, next: nextMilestone, progress }
      },
    }),
    {
      name: 'alyanoor-checkin-storage',
    }
  )
)
