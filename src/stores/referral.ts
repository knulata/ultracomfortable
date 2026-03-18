'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Referral {
  id: string
  referredUserId: string
  referredUserName: string
  referredUserEmail: string
  status: 'pending' | 'completed' | 'expired'
  pointsEarned: number
  createdAt: Date
  completedAt?: Date
}

export interface ReferralReward {
  id: string
  type: 'referrer' | 'referee'
  points: number
  description: string
  descriptionId: string
  referralId: string
  createdAt: Date
}

// Referral tiers for bonus multipliers
export interface ReferralTier {
  id: string
  name: string
  nameId: string
  minReferrals: number
  bonusMultiplier: number
  badge: string
  color: string
}

export const REFERRAL_TIERS: ReferralTier[] = [
  { id: 'starter', name: 'Starter', nameId: 'Pemula', minReferrals: 0, bonusMultiplier: 1, badge: '🌱', color: 'text-gray-600 bg-gray-100' },
  { id: 'advocate', name: 'Advocate', nameId: 'Pendukung', minReferrals: 3, bonusMultiplier: 1.25, badge: '⭐', color: 'text-blue-600 bg-blue-100' },
  { id: 'ambassador', name: 'Ambassador', nameId: 'Duta', minReferrals: 10, bonusMultiplier: 1.5, badge: '🏆', color: 'text-purple-600 bg-purple-100' },
  { id: 'champion', name: 'Champion', nameId: 'Juara', minReferrals: 25, bonusMultiplier: 2, badge: '👑', color: 'text-amber-600 bg-amber-100' },
]

// Mock leaderboard data
export interface LeaderboardEntry {
  rank: number
  userName: string
  referralCount: number
  tier: ReferralTier
}

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userName: 'Anisa M.', referralCount: 47, tier: REFERRAL_TIERS[3] },
  { rank: 2, userName: 'Rizky A.', referralCount: 32, tier: REFERRAL_TIERS[3] },
  { rank: 3, userName: 'Dian P.', referralCount: 28, tier: REFERRAL_TIERS[3] },
  { rank: 4, userName: 'Fajar S.', referralCount: 19, tier: REFERRAL_TIERS[2] },
  { rank: 5, userName: 'Putri H.', referralCount: 15, tier: REFERRAL_TIERS[2] },
]

interface ReferralState {
  // User's referral code
  referralCode: string

  // List of people this user has referred
  referrals: Referral[]

  // Rewards earned from referrals
  rewards: ReferralReward[]

  // Code used when signing up (if any)
  usedReferralCode: string | null

  // Stats
  totalReferrals: number
  successfulReferrals: number
  totalPointsEarned: number

  // Actions
  generateReferralCode: (userId: string) => void
  addReferral: (referral: Omit<Referral, 'id' | 'createdAt'>) => void
  completeReferral: (referralId: string) => void
  setUsedReferralCode: (code: string) => void
  addReward: (reward: Omit<ReferralReward, 'id' | 'createdAt'>) => void
  getReferralLink: () => string
  getCurrentTier: () => ReferralTier
  getNextTier: () => ReferralTier | null
  getReferralsToNextTier: () => number
  getTierProgress: () => number
}

// Generate a unique referral code from user ID
const generateCode = (userId: string): string => {
  const prefix = 'AN'
  const hash = userId.slice(-4).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}${hash}${random}`
}

// Referral program configuration
export const REFERRAL_CONFIG = {
  // Points given to referrer when referee makes first purchase
  referrerPoints: 500,
  // Points given to referee on signup
  refereePoints: 100,
  // Discount percentage for referee's first order
  refereeDiscount: 10,
  // Minimum order value to complete referral
  minOrderValue: 100000,
  // Referral expiry days
  expiryDays: 30,
}

// Mock referrals for demo
const mockReferrals: Referral[] = [
  {
    id: 'ref-1',
    referredUserId: 'user-123',
    referredUserName: 'Sari W.',
    referredUserEmail: 's***i@email.com',
    status: 'completed',
    pointsEarned: 500,
    createdAt: new Date('2026-02-15'),
    completedAt: new Date('2026-02-18'),
  },
  {
    id: 'ref-2',
    referredUserId: 'user-456',
    referredUserName: 'Andi P.',
    referredUserEmail: 'a***i@email.com',
    status: 'completed',
    pointsEarned: 500,
    createdAt: new Date('2026-02-20'),
    completedAt: new Date('2026-02-25'),
  },
  {
    id: 'ref-3',
    referredUserId: 'user-789',
    referredUserName: 'Maya R.',
    referredUserEmail: 'm***a@email.com',
    status: 'pending',
    pointsEarned: 0,
    createdAt: new Date('2026-03-01'),
  },
]

const mockRewards: ReferralReward[] = [
  {
    id: 'reward-1',
    type: 'referrer',
    points: 500,
    description: 'Referral completed: Sari W.',
    descriptionId: 'Referral selesai: Sari W.',
    referralId: 'ref-1',
    createdAt: new Date('2026-02-18'),
  },
  {
    id: 'reward-2',
    type: 'referrer',
    points: 500,
    description: 'Referral completed: Andi P.',
    descriptionId: 'Referral selesai: Andi P.',
    referralId: 'ref-2',
    createdAt: new Date('2026-02-25'),
  },
]

export const useReferralStore = create<ReferralState>()(
  persist(
    (set, get) => ({
      referralCode: 'UCUSER1234',
      referrals: mockReferrals,
      rewards: mockRewards,
      usedReferralCode: null,
      totalReferrals: mockReferrals.length,
      successfulReferrals: mockReferrals.filter(r => r.status === 'completed').length,
      totalPointsEarned: mockRewards.reduce((sum, r) => sum + r.points, 0),

      generateReferralCode: (userId) => {
        const code = generateCode(userId)
        set({ referralCode: code })
      },

      addReferral: (referral) => {
        const newReferral: Referral = {
          ...referral,
          id: `ref-${Date.now()}`,
          createdAt: new Date(),
        }
        set((state) => ({
          referrals: [newReferral, ...state.referrals],
          totalReferrals: state.totalReferrals + 1,
        }))
      },

      completeReferral: (referralId) => {
        set((state) => {
          const updatedReferrals = state.referrals.map((r) =>
            r.id === referralId
              ? { ...r, status: 'completed' as const, completedAt: new Date(), pointsEarned: REFERRAL_CONFIG.referrerPoints }
              : r
          )

          // Add reward
          const referral = state.referrals.find(r => r.id === referralId)
          const newReward: ReferralReward = {
            id: `reward-${Date.now()}`,
            type: 'referrer',
            points: REFERRAL_CONFIG.referrerPoints,
            description: `Referral completed: ${referral?.referredUserName || 'User'}`,
            descriptionId: `Referral selesai: ${referral?.referredUserName || 'User'}`,
            referralId,
            createdAt: new Date(),
          }

          return {
            referrals: updatedReferrals,
            rewards: [newReward, ...state.rewards],
            successfulReferrals: state.successfulReferrals + 1,
            totalPointsEarned: state.totalPointsEarned + REFERRAL_CONFIG.referrerPoints,
          }
        })
      },

      setUsedReferralCode: (code) => {
        set({ usedReferralCode: code })
      },

      addReward: (reward) => {
        const newReward: ReferralReward = {
          ...reward,
          id: `reward-${Date.now()}`,
          createdAt: new Date(),
        }
        set((state) => ({
          rewards: [newReward, ...state.rewards],
          totalPointsEarned: state.totalPointsEarned + reward.points,
        }))
      },

      getReferralLink: () => {
        const { referralCode } = get()
        // In production, this would be the actual domain
        return `https://ultracomfortable.com/register?ref=${referralCode}`
      },

      getCurrentTier: () => {
        const { successfulReferrals } = get()
        const tier = [...REFERRAL_TIERS]
          .reverse()
          .find((t) => successfulReferrals >= t.minReferrals)
        return tier || REFERRAL_TIERS[0]
      },

      getNextTier: () => {
        const currentTier = get().getCurrentTier()
        const currentIndex = REFERRAL_TIERS.findIndex((t) => t.id === currentTier.id)
        return currentIndex < REFERRAL_TIERS.length - 1
          ? REFERRAL_TIERS[currentIndex + 1]
          : null
      },

      getReferralsToNextTier: () => {
        const nextTier = get().getNextTier()
        if (!nextTier) return 0
        return nextTier.minReferrals - get().successfulReferrals
      },

      getTierProgress: () => {
        const currentTier = get().getCurrentTier()
        const nextTier = get().getNextTier()
        if (!nextTier) return 100
        const current = get().successfulReferrals - currentTier.minReferrals
        const total = nextTier.minReferrals - currentTier.minReferrals
        return Math.round((current / total) * 100)
      },
    }),
    {
      name: 'alyanoor-referral-storage',
    }
  )
)

// Helper: Validate referral code format
export function isValidReferralCode(code: string): boolean {
  return /^UC[A-Z0-9]{4,10}$/i.test(code)
}
