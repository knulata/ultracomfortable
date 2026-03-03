'use client'

import { Star, Camera, TrendingDown, Minus, TrendingUp } from 'lucide-react'
import { ReviewSummary as ReviewSummaryType } from '@/stores/reviews'
import { useTranslation } from '@/stores/language'

interface ReviewSummaryProps {
  summary: ReviewSummaryType
  onFilterByRating?: (rating: number | null) => void
  onShowPhotosOnly?: () => void
}

export function ReviewSummary({ summary, onFilterByRating, onShowPhotosOnly }: ReviewSummaryProps) {
  const { language } = useTranslation()

  const { averageRating, totalReviews, ratingDistribution, sizeFeedbackDistribution, photoCount } = summary

  const totalSizeFeedback = sizeFeedbackDistribution.runs_small + sizeFeedbackDistribution.true_to_size + sizeFeedbackDistribution.runs_large
  const sizePercentages = totalSizeFeedback > 0 ? {
    runs_small: Math.round((sizeFeedbackDistribution.runs_small / totalSizeFeedback) * 100),
    true_to_size: Math.round((sizeFeedbackDistribution.true_to_size / totalSizeFeedback) * 100),
    runs_large: Math.round((sizeFeedbackDistribution.runs_large / totalSizeFeedback) * 100),
  } : { runs_small: 0, true_to_size: 0, runs_large: 0 }

  // Determine dominant size feedback
  const dominantFit = sizePercentages.true_to_size >= 50 ? 'true_to_size' :
    sizePercentages.runs_small > sizePercentages.runs_large ? 'runs_small' : 'runs_large'

  return (
    <div className="bg-muted/30 rounded-2xl p-6">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Overall Rating */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${star <= Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-muted'}`}
                />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground">
            {totalReviews} {language === 'id' ? 'ulasan' : 'reviews'}
          </p>

          {/* Photo Reviews Badge */}
          {photoCount > 0 && (
            <button
              onClick={onShowPhotosOnly}
              className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary hover:underline"
            >
              <Camera className="h-4 w-4" />
              {photoCount} {language === 'id' ? 'foto' : 'photos'}
            </button>
          )}
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating as keyof typeof ratingDistribution]
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

            return (
              <button
                key={rating}
                onClick={() => onFilterByRating?.(rating)}
                className="flex items-center gap-2 w-full group"
              >
                <span className="text-sm text-muted-foreground w-6">{rating}</span>
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all group-hover:bg-amber-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
              </button>
            )
          })}
        </div>

        {/* Size Feedback */}
        {totalSizeFeedback > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">
              {language === 'id' ? 'Bagaimana ukurannya?' : 'How does it fit?'}
            </h4>

            {/* Visual Size Indicator */}
            <div className="relative h-8 bg-muted rounded-full overflow-hidden mb-3">
              <div className="absolute inset-0 flex">
                <div
                  className="bg-blue-400 transition-all"
                  style={{ width: `${sizePercentages.runs_small}%` }}
                />
                <div
                  className="bg-green-400 transition-all"
                  style={{ width: `${sizePercentages.true_to_size}%` }}
                />
                <div
                  className="bg-orange-400 transition-all"
                  style={{ width: `${sizePercentages.runs_large}%` }}
                />
              </div>

              {/* Indicator Arrow */}
              <div
                className="absolute top-full mt-1 -translate-x-1/2"
                style={{
                  left: dominantFit === 'runs_small' ? '15%' :
                        dominantFit === 'true_to_size' ? '50%' : '85%'
                }}
              >
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-foreground" />
              </div>
            </div>

            {/* Labels */}
            <div className="flex justify-between text-xs text-muted-foreground mt-4">
              <div className="flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-blue-500" />
                <span>{language === 'id' ? 'Kekecilan' : 'Runs Small'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Minus className="h-3 w-3 text-green-500" />
                <span>{language === 'id' ? 'Pas' : 'True to Size'}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-orange-500" />
                <span>{language === 'id' ? 'Kebesaran' : 'Runs Large'}</span>
              </div>
            </div>

            {/* Recommendation */}
            <p className="text-sm text-center mt-4 text-muted-foreground">
              {dominantFit === 'true_to_size' && (
                language === 'id' ? '✓ Sebagian besar pembeli bilang ukurannya pas' : '✓ Most buyers say it fits true to size'
              )}
              {dominantFit === 'runs_small' && (
                language === 'id' ? '↑ Pertimbangkan size up' : '↑ Consider sizing up'
              )}
              {dominantFit === 'runs_large' && (
                language === 'id' ? '↓ Pertimbangkan size down' : '↓ Consider sizing down'
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
