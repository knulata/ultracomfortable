'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Answer {
  id: string
  questionId: string
  content: string
  authorName: string
  authorType: 'customer' | 'seller' | 'verified_buyer'
  createdAt: string
  helpfulCount: number
  isVerifiedPurchase: boolean
}

export interface Question {
  id: string
  productId: string
  content: string
  authorName: string
  createdAt: string
  answers: Answer[]
  helpfulCount: number
  isAnswered: boolean
}

interface ProductQAState {
  questions: Question[]
  // User's helpful votes (to prevent duplicate voting)
  helpfulVotes: { questionId?: string; answerId?: string }[]

  // Actions
  getQuestionsForProduct: (productId: string) => Question[]
  getQuestionCount: (productId: string) => number
  getAnsweredCount: (productId: string) => number
  addQuestion: (productId: string, content: string, authorName: string) => void
  addAnswer: (questionId: string, content: string, authorName: string, authorType: Answer['authorType'], isVerifiedPurchase?: boolean) => void
  markHelpful: (type: 'question' | 'answer', id: string) => void
  hasVotedHelpful: (type: 'question' | 'answer', id: string) => boolean
}

// Mock Q&A data
const mockQuestions: Question[] = [
  {
    id: 'q1',
    productId: 'product-1',
    content: 'Does this shirt shrink after washing?',
    authorName: 'Budi S.',
    createdAt: '2024-01-15T10:30:00Z',
    helpfulCount: 24,
    isAnswered: true,
    answers: [
      {
        id: 'a1',
        questionId: 'q1',
        content: 'Hi! This shirt is pre-washed so it won\'t shrink significantly. We recommend washing in cold water and air drying for best results.',
        authorName: 'UC Official',
        authorType: 'seller',
        createdAt: '2024-01-15T14:20:00Z',
        helpfulCount: 18,
        isVerifiedPurchase: false,
      },
      {
        id: 'a2',
        questionId: 'q1',
        content: 'I\'ve washed mine 10+ times and it\'s still the same size. Great quality!',
        authorName: 'Rina M.',
        authorType: 'verified_buyer',
        createdAt: '2024-01-16T09:15:00Z',
        helpfulCount: 12,
        isVerifiedPurchase: true,
      },
    ],
  },
  {
    id: 'q2',
    productId: 'product-1',
    content: 'Is this true to size? I\'m usually M but sometimes need L for oversized fit.',
    authorName: 'Dewi A.',
    createdAt: '2024-01-20T16:45:00Z',
    helpfulCount: 31,
    isAnswered: true,
    answers: [
      {
        id: 'a3',
        questionId: 'q2',
        content: 'This is already an oversized fit, so if you normally wear M, stick with M for the intended relaxed look. Going up to L would be very loose.',
        authorName: 'UC Official',
        authorType: 'seller',
        createdAt: '2024-01-20T18:00:00Z',
        helpfulCount: 25,
        isVerifiedPurchase: false,
      },
    ],
  },
  {
    id: 'q3',
    productId: 'product-1',
    content: 'What\'s the fabric weight? Is it see-through for the white color?',
    authorName: 'Andi P.',
    createdAt: '2024-02-01T11:20:00Z',
    helpfulCount: 15,
    isAnswered: true,
    answers: [
      {
        id: 'a4',
        questionId: 'q3',
        content: 'The fabric is 220gsm which is medium-heavy weight. The white is not see-through at all!',
        authorName: 'Maya K.',
        authorType: 'verified_buyer',
        createdAt: '2024-02-02T08:30:00Z',
        helpfulCount: 11,
        isVerifiedPurchase: true,
      },
    ],
  },
  {
    id: 'q4',
    productId: 'product-1',
    content: 'Can I exchange if the size doesn\'t fit?',
    authorName: 'Sari W.',
    createdAt: '2024-02-10T14:00:00Z',
    helpfulCount: 8,
    isAnswered: true,
    answers: [
      {
        id: 'a5',
        questionId: 'q4',
        content: 'Yes! We offer free exchanges within 14 days of delivery. Just make sure the tags are still attached and the item is unworn.',
        authorName: 'UC Official',
        authorType: 'seller',
        createdAt: '2024-02-10T15:30:00Z',
        helpfulCount: 6,
        isVerifiedPurchase: false,
      },
    ],
  },
  {
    id: 'q5',
    productId: 'product-1',
    content: 'Is the beige color more cream or tan?',
    authorName: 'Lisa N.',
    createdAt: '2024-02-15T09:00:00Z',
    helpfulCount: 5,
    isAnswered: false,
    answers: [],
  },
]

export const useProductQAStore = create<ProductQAState>()(
  persist(
    (set, get) => ({
      questions: mockQuestions,
      helpfulVotes: [],

      getQuestionsForProduct: (productId) => {
        return get().questions
          .filter((q) => q.productId === productId)
          .sort((a, b) => b.helpfulCount - a.helpfulCount)
      },

      getQuestionCount: (productId) => {
        return get().questions.filter((q) => q.productId === productId).length
      },

      getAnsweredCount: (productId) => {
        return get().questions.filter((q) => q.productId === productId && q.isAnswered).length
      },

      addQuestion: (productId, content, authorName) => {
        const newQuestion: Question = {
          id: `q-${Date.now()}`,
          productId,
          content,
          authorName,
          createdAt: new Date().toISOString(),
          helpfulCount: 0,
          isAnswered: false,
          answers: [],
        }

        set((state) => ({
          questions: [newQuestion, ...state.questions],
        }))
      },

      addAnswer: (questionId, content, authorName, authorType, isVerifiedPurchase = false) => {
        const newAnswer: Answer = {
          id: `a-${Date.now()}`,
          questionId,
          content,
          authorName,
          authorType,
          createdAt: new Date().toISOString(),
          helpfulCount: 0,
          isVerifiedPurchase,
        }

        set((state) => ({
          questions: state.questions.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  answers: [...q.answers, newAnswer],
                  isAnswered: true,
                }
              : q
          ),
        }))
      },

      markHelpful: (type, id) => {
        if (get().hasVotedHelpful(type, id)) return

        if (type === 'question') {
          set((state) => ({
            questions: state.questions.map((q) =>
              q.id === id ? { ...q, helpfulCount: q.helpfulCount + 1 } : q
            ),
            helpfulVotes: [...state.helpfulVotes, { questionId: id }],
          }))
        } else {
          set((state) => ({
            questions: state.questions.map((q) => ({
              ...q,
              answers: q.answers.map((a) =>
                a.id === id ? { ...a, helpfulCount: a.helpfulCount + 1 } : a
              ),
            })),
            helpfulVotes: [...state.helpfulVotes, { answerId: id }],
          }))
        }
      },

      hasVotedHelpful: (type, id) => {
        const votes = get().helpfulVotes
        if (type === 'question') {
          return votes.some((v) => v.questionId === id)
        }
        return votes.some((v) => v.answerId === id)
      },
    }),
    {
      name: 'alyanoor-product-qa',
      partialize: (state) => ({ helpfulVotes: state.helpfulVotes }),
    }
  )
)
