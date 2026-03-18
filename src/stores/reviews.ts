'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SizeFeedback = 'runs_small' | 'true_to_size' | 'runs_large'

export interface ReviewPhoto {
  id: string
  url: string
  caption?: string
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number // 1-5
  title?: string
  content: string
  photos: ReviewPhoto[]
  sizeFeedback?: SizeFeedback
  sizeOrdered?: string
  colorOrdered?: string
  height?: string // e.g., "165cm"
  weight?: string // e.g., "55kg"
  helpfulCount: number
  notHelpfulCount: number
  isVerifiedPurchase: boolean
  createdAt: number
  updatedAt: number
}

export interface ReviewSummary {
  productId: string
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
  sizeFeedbackDistribution: {
    runs_small: number
    true_to_size: number
    runs_large: number
  }
  photoCount: number
}

export type ReviewSortBy = 'newest' | 'oldest' | 'highest' | 'lowest' | 'most_helpful' | 'with_photos'

export interface ReviewFilters {
  rating?: number
  withPhotos?: boolean
  sizeFeedback?: SizeFeedback
  verified?: boolean
}

interface ReviewsState {
  reviews: Review[]
  userVotes: Record<string, 'helpful' | 'not_helpful'>

  // Actions
  addReview: (review: Omit<Review, 'id' | 'helpfulCount' | 'notHelpfulCount' | 'createdAt' | 'updatedAt'>) => Review
  updateReview: (id: string, data: Partial<Review>) => void
  deleteReview: (id: string) => void
  voteReview: (reviewId: string, vote: 'helpful' | 'not_helpful') => void

  // Getters
  getReviewsByProduct: (productId: string, filters?: ReviewFilters, sortBy?: ReviewSortBy) => Review[]
  getReviewSummary: (productId: string) => ReviewSummary
  getUserReviewForProduct: (productId: string, userId: string) => Review | undefined
  hasUserVoted: (reviewId: string) => 'helpful' | 'not_helpful' | null
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'premium-cotton-tee',
    userId: 'user-1',
    userName: 'Sarah M.',
    rating: 5,
    title: 'Perfect everyday tee!',
    content: 'Love this shirt! The cotton is so soft and the fit is exactly what I was looking for. I\'m 165cm and ordered size M which fits perfectly. Will definitely buy more colors!',
    photos: [
      { id: 'photo-1', url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400' },
      { id: 'photo-2', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400' },
    ],
    sizeFeedback: 'true_to_size',
    sizeOrdered: 'M',
    colorOrdered: 'White',
    height: '165cm',
    weight: '55kg',
    helpfulCount: 24,
    notHelpfulCount: 2,
    isVerifiedPurchase: true,
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'rev-2',
    productId: 'premium-cotton-tee',
    userId: 'user-2',
    userName: 'Anita R.',
    rating: 4,
    title: 'Great quality, runs a bit small',
    content: 'The quality is amazing and the material feels premium. However, I would recommend sizing up if you prefer a looser fit. I usually wear S but this was a bit snug.',
    photos: [
      { id: 'photo-3', url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400' },
    ],
    sizeFeedback: 'runs_small',
    sizeOrdered: 'S',
    colorOrdered: 'Black',
    height: '158cm',
    weight: '50kg',
    helpfulCount: 18,
    notHelpfulCount: 1,
    isVerifiedPurchase: true,
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'rev-3',
    productId: 'premium-cotton-tee',
    userId: 'user-3',
    userName: 'Dewi K.',
    rating: 5,
    title: 'Best basic tee I own',
    content: 'Finally found a basic tee that doesn\'t shrink after washing! The color stays vibrant and the stitching is excellent. Highly recommend!',
    photos: [],
    sizeFeedback: 'true_to_size',
    sizeOrdered: 'L',
    colorOrdered: 'Navy',
    helpfulCount: 12,
    notHelpfulCount: 0,
    isVerifiedPurchase: true,
    createdAt: Date.now() - 21 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 21 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'rev-4',
    productId: 'premium-cotton-tee',
    userId: 'user-4',
    userName: 'Budi S.',
    rating: 3,
    title: 'Good but expected more',
    content: 'The shirt is okay, nothing special. Quality is decent for the price. Shipping was fast though!',
    photos: [],
    sizeFeedback: 'true_to_size',
    sizeOrdered: 'XL',
    colorOrdered: 'Gray',
    helpfulCount: 5,
    notHelpfulCount: 3,
    isVerifiedPurchase: true,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'rev-5',
    productId: 'premium-cotton-tee',
    userId: 'user-5',
    userName: 'Linda W.',
    rating: 5,
    title: 'Obsessed with this!',
    content: 'The fit, the feel, the color - everything is perfect! I bought 3 more in different colors. This is now my go-to everyday shirt.',
    photos: [
      { id: 'photo-4', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400' },
      { id: 'photo-5', url: 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=400' },
      { id: 'photo-6', url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400' },
    ],
    sizeFeedback: 'true_to_size',
    sizeOrdered: 'M',
    colorOrdered: 'Cream',
    height: '160cm',
    weight: '52kg',
    helpfulCount: 31,
    notHelpfulCount: 1,
    isVerifiedPurchase: true,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'rev-6',
    productId: 'flowy-midi-dress',
    userId: 'user-1',
    userName: 'Sarah M.',
    rating: 5,
    title: 'Beautiful dress!',
    content: 'This dress is absolutely gorgeous! The fabric flows beautifully and it\'s so comfortable. Perfect for both casual and slightly dressier occasions.',
    photos: [
      { id: 'photo-7', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400' },
    ],
    sizeFeedback: 'true_to_size',
    sizeOrdered: 'M',
    colorOrdered: 'Floral',
    height: '165cm',
    weight: '55kg',
    helpfulCount: 15,
    notHelpfulCount: 0,
    isVerifiedPurchase: true,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'rev-7',
    productId: 'flowy-midi-dress',
    userId: 'user-6',
    userName: 'Maya T.',
    rating: 4,
    title: 'Lovely but runs large',
    content: 'Such a pretty dress! The print is even nicer in person. I would recommend sizing down as it runs a bit large. I\'m usually M but S would have been better.',
    photos: [],
    sizeFeedback: 'runs_large',
    sizeOrdered: 'M',
    colorOrdered: 'Blue',
    height: '162cm',
    weight: '54kg',
    helpfulCount: 8,
    notHelpfulCount: 1,
    isVerifiedPurchase: true,
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'rev-8',
    productId: 'flowy-midi-dress',
    userId: 'user-7',
    userName: 'Rina A.',
    rating: 5,
    title: 'My new favorite!',
    content: 'I get so many compliments when I wear this dress! The material is lightweight and perfect for our weather. The length is great for my height (168cm).',
    photos: [
      { id: 'photo-8', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400' },
      { id: 'photo-9', url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400' },
    ],
    sizeFeedback: 'true_to_size',
    sizeOrdered: 'S',
    colorOrdered: 'Pink',
    height: '168cm',
    weight: '56kg',
    helpfulCount: 22,
    notHelpfulCount: 0,
    isVerifiedPurchase: true,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
]

export const useReviewsStore = create<ReviewsState>()(
  persist(
    (set, get) => ({
      reviews: mockReviews,
      userVotes: {},

      addReview: (reviewData) => {
        const newReview: Review = {
          ...reviewData,
          id: `rev-${Date.now()}`,
          helpfulCount: 0,
          notHelpfulCount: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }

        set((state) => ({
          reviews: [newReview, ...state.reviews],
        }))

        return newReview
      },

      updateReview: (id, data) => {
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === id
              ? { ...review, ...data, updatedAt: Date.now() }
              : review
          ),
        }))
      },

      deleteReview: (id) => {
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== id),
        }))
      },

      voteReview: (reviewId, vote) => {
        const currentVote = get().userVotes[reviewId]

        set((state) => {
          const reviews = state.reviews.map((review) => {
            if (review.id !== reviewId) return review

            let { helpfulCount, notHelpfulCount } = review

            // Remove previous vote if exists
            if (currentVote === 'helpful') helpfulCount--
            if (currentVote === 'not_helpful') notHelpfulCount--

            // Add new vote if different from current
            if (currentVote !== vote) {
              if (vote === 'helpful') helpfulCount++
              if (vote === 'not_helpful') notHelpfulCount++
            }

            return { ...review, helpfulCount, notHelpfulCount }
          })

          const userVotes = { ...state.userVotes }
          if (currentVote === vote) {
            delete userVotes[reviewId]
          } else {
            userVotes[reviewId] = vote
          }

          return { reviews, userVotes }
        })
      },

      getReviewsByProduct: (productId, filters, sortBy = 'newest') => {
        let reviews = get().reviews.filter((r) => r.productId === productId)

        // Apply filters
        if (filters) {
          if (filters.rating) {
            reviews = reviews.filter((r) => r.rating === filters.rating)
          }
          if (filters.withPhotos) {
            reviews = reviews.filter((r) => r.photos.length > 0)
          }
          if (filters.sizeFeedback) {
            reviews = reviews.filter((r) => r.sizeFeedback === filters.sizeFeedback)
          }
          if (filters.verified) {
            reviews = reviews.filter((r) => r.isVerifiedPurchase)
          }
        }

        // Sort
        const sortedReviews = [...reviews]
        switch (sortBy) {
          case 'newest':
            sortedReviews.sort((a, b) => b.createdAt - a.createdAt)
            break
          case 'oldest':
            sortedReviews.sort((a, b) => a.createdAt - b.createdAt)
            break
          case 'highest':
            sortedReviews.sort((a, b) => b.rating - a.rating)
            break
          case 'lowest':
            sortedReviews.sort((a, b) => a.rating - b.rating)
            break
          case 'most_helpful':
            sortedReviews.sort((a, b) => b.helpfulCount - a.helpfulCount)
            break
          case 'with_photos':
            sortedReviews.sort((a, b) => b.photos.length - a.photos.length)
            break
        }

        return sortedReviews
      },

      getReviewSummary: (productId) => {
        const reviews = get().reviews.filter((r) => r.productId === productId)

        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        const sizeFeedbackDistribution = { runs_small: 0, true_to_size: 0, runs_large: 0 }
        let totalRating = 0
        let photoCount = 0

        reviews.forEach((review) => {
          ratingDistribution[review.rating as keyof typeof ratingDistribution]++
          totalRating += review.rating
          photoCount += review.photos.length

          if (review.sizeFeedback) {
            sizeFeedbackDistribution[review.sizeFeedback]++
          }
        })

        return {
          productId,
          averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
          totalReviews: reviews.length,
          ratingDistribution,
          sizeFeedbackDistribution,
          photoCount,
        }
      },

      getUserReviewForProduct: (productId, userId) => {
        return get().reviews.find((r) => r.productId === productId && r.userId === userId)
      },

      hasUserVoted: (reviewId) => {
        return get().userVotes[reviewId] || null
      },
    }),
    {
      name: 'alyanoor-reviews',
      partialize: (state) => ({ userVotes: state.userVotes }),
    }
  )
)

// Helper functions
export function formatRelativeTime(timestamp: number, language: 'en' | 'id' = 'en'): string {
  const now = Date.now()
  const diff = now - timestamp
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))

  if (days === 0) {
    return language === 'id' ? 'Hari ini' : 'Today'
  } else if (days === 1) {
    return language === 'id' ? 'Kemarin' : 'Yesterday'
  } else if (days < 7) {
    return language === 'id' ? `${days} hari lalu` : `${days} days ago`
  } else if (days < 30) {
    const weeks = Math.floor(days / 7)
    return language === 'id' ? `${weeks} minggu lalu` : `${weeks} week${weeks > 1 ? 's' : ''} ago`
  } else if (days < 365) {
    const months = Math.floor(days / 30)
    return language === 'id' ? `${months} bulan lalu` : `${months} month${months > 1 ? 's' : ''} ago`
  } else {
    const years = Math.floor(days / 365)
    return language === 'id' ? `${years} tahun lalu` : `${years} year${years > 1 ? 's' : ''} ago`
  }
}

export function getSizeFeedbackLabel(feedback: SizeFeedback, language: 'en' | 'id' = 'en'): string {
  const labels = {
    runs_small: { en: 'Runs Small', id: 'Kekecilan' },
    true_to_size: { en: 'True to Size', id: 'Sesuai Ukuran' },
    runs_large: { en: 'Runs Large', id: 'Kebesaran' },
  }
  return labels[feedback][language]
}

export function getSizeFeedbackColor(feedback: SizeFeedback): string {
  const colors = {
    runs_small: 'text-orange-600 bg-orange-50',
    true_to_size: 'text-green-600 bg-green-50',
    runs_large: 'text-blue-600 bg-blue-50',
  }
  return colors[feedback]
}
