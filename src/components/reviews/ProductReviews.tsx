'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Camera, Star, ChevronDown, PenLine, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { useReviewsStore, ReviewSortBy, ReviewFilters, ReviewPhoto } from '@/stores/reviews'
import { ReviewSummary } from './ReviewSummary'
import { ReviewCard } from './ReviewCard'
import { ReviewForm } from './ReviewForm'

interface ProductReviewsProps {
  productId: string
  productName: string
}

type FilterOption = 'all' | 'with_photos' | '5' | '4' | '3' | '2' | '1'

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { language } = useTranslation()
  const { getReviewsByProduct, getReviewSummary } = useReviewsStore()

  const [sortBy, setSortBy] = useState<ReviewSortBy>('newest')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showPhotoGallery, setShowPhotoGallery] = useState(false)
  const [galleryPhotos, setGalleryPhotos] = useState<ReviewPhoto[]>([])
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [visibleCount, setVisibleCount] = useState(5)

  // Build filters from filterBy
  const filters: ReviewFilters | undefined = useMemo(() => {
    if (filterBy === 'all') return undefined
    if (filterBy === 'with_photos') return { withPhotos: true }
    return { rating: parseInt(filterBy) }
  }, [filterBy])

  // Get reviews from store
  const reviews = getReviewsByProduct(productId, filters, sortBy)
  const summary = getReviewSummary(productId)

  const visibleReviews = reviews.slice(0, visibleCount)
  const hasMore = reviews.length > visibleCount

  // Get all photos from all reviews
  const allPhotos = useMemo(() => {
    const allReviews = getReviewsByProduct(productId)
    return allReviews.flatMap(r => r.photos)
  }, [productId, getReviewsByProduct])

  const handleShowAllPhotos = () => {
    setGalleryPhotos(allPhotos)
    setGalleryIndex(0)
    setShowPhotoGallery(true)
  }

  const sortOptions: { value: ReviewSortBy; label: string; labelId: string }[] = [
    { value: 'newest', label: 'Most Recent', labelId: 'Terbaru' },
    { value: 'most_helpful', label: 'Most Helpful', labelId: 'Paling Membantu' },
    { value: 'highest', label: 'Highest Rating', labelId: 'Rating Tertinggi' },
    { value: 'lowest', label: 'Lowest Rating', labelId: 'Rating Terendah' },
    { value: 'with_photos', label: 'With Photos', labelId: 'Dengan Foto' },
  ]

  const filterOptions: { value: FilterOption; label: string; labelId: string }[] = [
    { value: 'all', label: 'All Reviews', labelId: 'Semua Ulasan' },
    { value: 'with_photos', label: 'With Photos', labelId: 'Dengan Foto' },
    { value: '5', label: '5 Stars', labelId: '5 Bintang' },
    { value: '4', label: '4 Stars', labelId: '4 Bintang' },
    { value: '3', label: '3 Stars', labelId: '3 Bintang' },
    { value: '2', label: '2 Stars', labelId: '2 Bintang' },
    { value: '1', label: '1 Star', labelId: '1 Bintang' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {language === 'id' ? 'Ulasan Pembeli' : 'Customer Reviews'}
        </h2>
        <Button onClick={() => setShowReviewForm(true)}>
          <PenLine className="h-4 w-4 mr-2" />
          {language === 'id' ? 'Tulis Ulasan' : 'Write a Review'}
        </Button>
      </div>

      {/* Summary */}
      {summary.totalReviews > 0 && (
        <ReviewSummary
          summary={summary}
          onFilterByRating={(rating) => setFilterBy(rating ? rating.toString() as FilterOption : 'all')}
          onShowPhotosOnly={handleShowAllPhotos}
        />
      )}

      {/* Photo Strip */}
      {allPhotos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Camera className="h-4 w-4" />
              {language === 'id' ? 'Foto dari Pembeli' : 'Customer Photos'}
              <span className="text-muted-foreground font-normal">({allPhotos.length})</span>
            </h3>
            <button
              onClick={handleShowAllPhotos}
              className="text-sm text-primary hover:underline"
            >
              {language === 'id' ? 'Lihat Semua' : 'View All'}
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allPhotos.slice(0, 8).map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => {
                  setGalleryPhotos(allPhotos)
                  setGalleryIndex(index)
                  setShowPhotoGallery(true)
                }}
                className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all relative"
              >
                <Image
                  src={photo.url}
                  alt=""
                  fill
                  className="object-cover"
                />
              </button>
            ))}
            {allPhotos.length > 8 && (
              <button
                onClick={handleShowAllPhotos}
                className="flex-shrink-0 w-20 h-20 rounded-lg bg-muted flex items-center justify-center text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                +{allPhotos.length - 8}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filters & Sort */}
      <div className="flex flex-wrap items-center gap-3 py-4 border-y">
        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-muted transition-colors"
          >
            <span className="text-muted-foreground">{language === 'id' ? 'Urutkan:' : 'Sort:'}</span>
            <span className="font-medium">
              {sortOptions.find(o => o.value === sortBy)?.[language === 'id' ? 'labelId' : 'label']}
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {showSortDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
              <div className="absolute top-full left-0 mt-1 w-48 bg-background border rounded-lg shadow-lg z-20 py-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value)
                      setShowSortDropdown(false)
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors ${
                      sortBy === option.value ? 'bg-primary/10 text-primary' : ''
                    }`}
                  >
                    {language === 'id' ? option.labelId : option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.slice(0, 4).map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterBy(option.value)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                filterBy === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {option.value === 'with_photos' && <Camera className="h-3 w-3 inline mr-1" />}
              {language === 'id' ? option.labelId : option.label}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <span className="text-sm text-muted-foreground ml-auto">
          {reviews.length} {language === 'id' ? 'ulasan' : 'reviews'}
        </span>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="py-12 text-center">
          <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {filterBy !== 'all'
              ? (language === 'id' ? 'Tidak ada ulasan dengan filter ini' : 'No reviews match this filter')
              : (language === 'id' ? 'Belum ada ulasan' : 'No reviews yet')
            }
          </h3>
          <p className="text-muted-foreground mb-4">
            {filterBy !== 'all'
              ? (language === 'id' ? 'Coba filter lain' : 'Try a different filter')
              : (language === 'id' ? 'Jadilah yang pertama mengulas produk ini' : 'Be the first to review this product')
            }
          </p>
          {filterBy === 'all' && (
            <Button onClick={() => setShowReviewForm(true)}>
              <PenLine className="h-4 w-4 mr-2" />
              {language === 'id' ? 'Tulis Ulasan' : 'Write a Review'}
            </Button>
          )}
        </div>
      ) : (
        <div>
          {visibleReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}

          {/* Load More */}
          {hasMore && (
            <div className="text-center py-6">
              <Button
                variant="outline"
                onClick={() => setVisibleCount(prev => prev + 5)}
              >
                {language === 'id' ? 'Muat Lebih Banyak' : 'Load More'}
                <span className="text-muted-foreground ml-2">
                  ({reviews.length - visibleCount} {language === 'id' ? 'lagi' : 'more'})
                </span>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          productId={productId}
          productName={productName}
          onClose={() => setShowReviewForm(false)}
        />
      )}

      {/* Photo Gallery Modal */}
      {showPhotoGallery && galleryPhotos.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <button
            onClick={() => setShowPhotoGallery(false)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {galleryPhotos.length > 1 && (
            <>
              <button
                onClick={() => setGalleryIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length)}
                className="absolute left-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={() => setGalleryIndex((prev) => (prev + 1) % galleryPhotos.length)}
                className="absolute right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          <div className="relative w-full max-w-3xl h-[80vh] mx-4">
            <Image
              src={galleryPhotos[galleryIndex].url}
              alt={`Photo ${galleryIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {galleryPhotos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryPhotos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setGalleryIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === galleryIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
