'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, ThumbsUp, ThumbsDown, CheckCircle, User, ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from '@/stores/language'
import {
  Review,
  useReviewsStore,
  formatRelativeTime,
  getSizeFeedbackLabel,
  getSizeFeedbackColor,
} from '@/stores/reviews'
import { toast } from 'sonner'

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { language } = useTranslation()
  const { voteReview, hasUserVoted } = useReviewsStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const userVote = hasUserVoted(review.id)
  const shouldTruncate = review.content.length > 200
  const displayContent = shouldTruncate && !isExpanded ? review.content.slice(0, 200) + '...' : review.content

  const handleVote = (vote: 'helpful' | 'not_helpful') => {
    voteReview(review.id, vote)
    if (userVote !== vote) {
      toast.success(
        language === 'id'
          ? 'Terima kasih atas feedback Anda'
          : 'Thanks for your feedback'
      )
    }
  }

  const openPhotoModal = (index: number) => {
    setCurrentPhotoIndex(index)
    setShowPhotoModal(true)
  }

  return (
    <>
      <div className="py-6 border-b last:border-b-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              {review.userAvatar ? (
                <Image
                  src={review.userAvatar}
                  alt={review.userName}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="text-primary font-semibold">
                  {review.userName.charAt(0)}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{review.userName}</span>
                {review.isVerifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <CheckCircle className="h-3 w-3" />
                    {language === 'id' ? 'Pembelian Terverifikasi' : 'Verified Purchase'}
                  </span>
                )}
              </div>

              {/* Rating & Date */}
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatRelativeTime(review.createdAt, language)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Size & Body Info */}
        {(review.sizeOrdered || review.colorOrdered || review.height || review.weight || review.sizeFeedback) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {review.sizeOrdered && (
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                {language === 'id' ? 'Ukuran:' : 'Size:'} {review.sizeOrdered}
              </span>
            )}
            {review.colorOrdered && (
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                {language === 'id' ? 'Warna:' : 'Color:'} {review.colorOrdered}
              </span>
            )}
            {review.height && (
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                {review.height}
              </span>
            )}
            {review.weight && (
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                {review.weight}
              </span>
            )}
            {review.sizeFeedback && (
              <span className={`text-xs px-2 py-1 rounded-full ${getSizeFeedbackColor(review.sizeFeedback)}`}>
                {getSizeFeedbackLabel(review.sizeFeedback, language)}
              </span>
            )}
          </div>
        )}

        {/* Title & Content */}
        {review.title && <h4 className="font-semibold mb-2">{review.title}</h4>}
        <p className="text-muted-foreground leading-relaxed">
          {displayContent}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-primary mt-2 hover:underline"
          >
            {isExpanded ? (
              <>
                {language === 'id' ? 'Lebih sedikit' : 'Show less'}
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                {language === 'id' ? 'Selengkapnya' : 'Read more'}
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        )}

        {/* Photos */}
        {review.photos.length > 0 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {review.photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => openPhotoModal(index)}
                className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all relative"
              >
                <Image
                  src={photo.url}
                  alt={`Review photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Helpful */}
        <div className="flex items-center gap-4 mt-4">
          <span className="text-xs text-muted-foreground">
            {language === 'id' ? 'Apakah ini membantu?' : 'Was this helpful?'}
          </span>
          <button
            onClick={() => handleVote('helpful')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
              userVote === 'helpful'
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <ThumbsUp className={`h-4 w-4 ${userVote === 'helpful' ? 'fill-current' : ''}`} />
            <span>{review.helpfulCount}</span>
          </button>
          <button
            onClick={() => handleVote('not_helpful')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
              userVote === 'not_helpful'
                ? 'bg-red-50 text-red-500'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <ThumbsDown className={`h-4 w-4 ${userVote === 'not_helpful' ? 'fill-current' : ''}`} />
            <span>{review.notHelpfulCount}</span>
          </button>
        </div>
      </div>

      {/* Photo Modal */}
      {showPhotoModal && review.photos.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <button
            onClick={() => setShowPhotoModal(false)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {review.photos.length > 1 && (
            <>
              <button
                onClick={() => setCurrentPhotoIndex((prev) => (prev - 1 + review.photos.length) % review.photos.length)}
                className="absolute left-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={() => setCurrentPhotoIndex((prev) => (prev + 1) % review.photos.length)}
                className="absolute right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          <div className="relative w-full max-w-3xl h-[80vh] mx-4">
            <Image
              src={review.photos[currentPhotoIndex].url}
              alt={`Review photo ${currentPhotoIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {review.photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {review.photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
