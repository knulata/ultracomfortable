import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface StylePreferences {
  style: 'casual' | 'formal' | 'trendy' | 'minimalist' | 'bohemian' | null
  occasions: string[]
  budget: 'budget' | 'mid' | 'premium' | null
  colors: string[]
  bodyType: 'petite' | 'regular' | 'tall' | 'curvy' | 'athletic' | null
  avoidColors: string[]
  favoriteCategories: string[]
}

export interface ChatMessage {
  id: string
  type: 'stylist' | 'user' | 'options' | 'products'
  content: string
  options?: { label: string; labelId: string; value: string; icon?: string }[]
  products?: RecommendedProduct[]
  timestamp: Date
}

export interface RecommendedProduct {
  id: string
  name: string
  nameId: string
  price: number
  originalPrice?: number
  category: string
  slug: string
  matchReason: string
  matchReasonId: string
  matchScore: number
}

interface StylistState {
  // Quiz state
  isOpen: boolean
  currentStep: number
  preferences: StylePreferences
  chatHistory: ChatMessage[]
  hasCompletedQuiz: boolean
  stylistName: string

  // Actions
  openStylist: () => void
  closeStylist: () => void
  setPreference: <K extends keyof StylePreferences>(key: K, value: StylePreferences[K]) => void
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  nextStep: () => void
  resetQuiz: () => void
  completeQuiz: () => void
}

export const useStylistStore = create<StylistState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      currentStep: 0,
      preferences: {
        style: null,
        occasions: [],
        budget: null,
        colors: [],
        bodyType: null,
        avoidColors: [],
        favoriteCategories: [],
      },
      chatHistory: [],
      hasCompletedQuiz: false,
      stylistName: 'Kira',

      openStylist: () => set({ isOpen: true }),
      closeStylist: () => set({ isOpen: false }),

      setPreference: (key, value) =>
        set((state) => ({
          preferences: { ...state.preferences, [key]: value },
        })),

      addMessage: (message) =>
        set((state) => ({
          chatHistory: [
            ...state.chatHistory,
            {
              ...message,
              id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              timestamp: new Date(),
            },
          ],
        })),

      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

      resetQuiz: () =>
        set({
          currentStep: 0,
          preferences: {
            style: null,
            occasions: [],
            budget: null,
            colors: [],
            bodyType: null,
            avoidColors: [],
            favoriteCategories: [],
          },
          chatHistory: [],
          hasCompletedQuiz: false,
        }),

      completeQuiz: () => set({ hasCompletedQuiz: true }),
    }),
    {
      name: 'alyanoor-stylist',
      partialize: (state) => ({
        preferences: state.preferences,
        hasCompletedQuiz: state.hasCompletedQuiz,
      }),
    }
  )
)

// Product recommendation logic
export const getPersonalizedRecommendations = (
  preferences: StylePreferences,
  allProducts: RecommendedProduct[]
): RecommendedProduct[] => {
  return allProducts
    .map((product) => {
      let score = 50 // Base score

      // Style matching
      if (preferences.style) {
        const styleMatches: Record<string, string[]> = {
          casual: ['tee', 'jeans', 'sneakers', 'hoodie', 'joggers'],
          formal: ['blazer', 'dress', 'heels', 'blouse', 'trousers'],
          trendy: ['crop', 'oversized', 'printed', 'statement'],
          minimalist: ['basic', 'solid', 'classic', 'neutral'],
          bohemian: ['floral', 'maxi', 'embroidered', 'flowy'],
        }
        const keywords = styleMatches[preferences.style] || []
        if (keywords.some((kw) => product.name.toLowerCase().includes(kw))) {
          score += 20
        }
      }

      // Budget matching
      if (preferences.budget) {
        const budgetRanges = {
          budget: { min: 0, max: 250000 },
          mid: { min: 200000, max: 500000 },
          premium: { min: 400000, max: Infinity },
        }
        const range = budgetRanges[preferences.budget]
        if (product.price >= range.min && product.price <= range.max) {
          score += 15
        }
      }

      // Color matching
      if (preferences.colors.length > 0) {
        const productColors = product.name.toLowerCase()
        if (preferences.colors.some((c) => productColors.includes(c.toLowerCase()))) {
          score += 10
        }
      }

      // Avoid colors
      if (preferences.avoidColors.length > 0) {
        const productName = product.name.toLowerCase()
        if (preferences.avoidColors.some((c) => productName.includes(c.toLowerCase()))) {
          score -= 30
        }
      }

      return { ...product, matchScore: score }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 8)
}
