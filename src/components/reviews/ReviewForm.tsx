'use client'

import { useState, useRef } from 'react'
import { Star, Camera, X, TrendingDown, Minus, TrendingUp, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { useReviewsStore, SizeFeedback } from '@/stores/reviews'
import { toast } from 'sonner'

interface ReviewFormProps {
  productId: string
  productName: string
  onClose: () => void
  onSuccess?: () => void
}

export function ReviewForm({ productId, productName, onClose, onSuccess }: ReviewFormProps) {
  const { language } = useTranslation()
  const { addReview } = useReviewsStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([])
  const [sizeFeedback, setSizeFeedback] = useState<SizeFeedback | undefined>(undefined)
  const [sizeOrdered, setSizeOrdered] = useState('')
  const [colorOrdered, setColorOrdered] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + photos.length > 5) {
      toast.error(language === 'id' ? 'Maksimal 5 foto' : 'Maximum 5 photos')
      return
    }

    const newPreviewUrls = files.map(file => URL.createObjectURL(file))
    setPhotos(prev => [...prev, ...files])
    setPhotoPreviewUrls(prev => [...prev, ...newPreviewUrls])
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
    setPhotoPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error(language === 'id' ? 'Pilih rating' : 'Please select a rating')
      return
    }

    if (!content.trim()) {
      toast.error(language === 'id' ? 'Tulis ulasan' : 'Please write a review')
      return
    }

    setIsSubmitting(true)

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // In production, photos would be uploaded to cloud storage
    // For now, use the preview URLs as placeholders
    addReview({
      productId,
      userId: 'current-user',
      userName: language === 'id' ? 'Anda' : 'You',
      rating,
      title: title || undefined,
      content,
      photos: photoPreviewUrls.map((url, i) => ({
        id: `photo-new-${i}`,
        url,
      })),
      sizeFeedback,
      sizeOrdered: sizeOrdered || undefined,
      colorOrdered: colorOrdered || undefined,
      height: height || undefined,
      weight: weight || undefined,
      isVerifiedPurchase: true,
    })

    setIsSubmitting(false)
    toast.success(language === 'id' ? 'Ulasan berhasil dikirim! +50 Alya Points' : 'Review submitted successfully! +50 Alya Points')
    onSuccess?.()
    onClose()
  }

  const getRatingLabel = (r: number) => {
    const labels = {
      1: { en: 'Poor', id: 'Buruk' },
      2: { en: 'Fair', id: 'Kurang' },
      3: { en: 'Good', id: 'Cukup' },
      4: { en: 'Very Good', id: 'Bagus' },
      5: { en: 'Excellent', id: 'Sangat Bagus' },
    }
    return labels[r as keyof typeof labels]?.[language === 'id' ? 'id' : 'en'] || ''
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold">
            {language === 'id' ? 'Tulis Ulasan' : 'Write a Review'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Product Name */}
          <p className="text-sm text-muted-foreground">
            {language === 'id' ? 'Untuk:' : 'For:'} <span className="font-medium text-foreground">{productName}</span>
          </p>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'id' ? 'Rating' : 'Rating'} *
            </label>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted hover:text-amber-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {(hoverRating || rating) > 0 && (
                <span className="text-sm text-muted-foreground">
                  {getRatingLabel(hoverRating || rating)}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'id' ? 'Judul (opsional)' : 'Title (optional)'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={language === 'id' ? 'Ringkasan ulasanmu' : 'Summarize your review'}
              className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={100}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'id' ? 'Ulasan' : 'Review'} *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={language === 'id' ? 'Ceritakan pengalamanmu dengan produk ini...' : 'Tell us about your experience with this product...'}
              className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {content.length}/1000
            </p>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'id' ? 'Tambah Foto (opsional)' : 'Add Photos (optional)'}
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              {language === 'id' ? 'Foto dengan produk akan mendapat +50 Alya Points!' : 'Photos with the product earn +50 Alya Points!'}
            </p>

            <div className="flex flex-wrap gap-3">
              {photoPreviewUrls.map((url, index) => (
                <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}

              {photos.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 hover:border-primary hover:text-primary transition-colors"
                >
                  <Camera className="h-5 w-5" />
                  <span className="text-xs">{language === 'id' ? 'Tambah' : 'Add'}</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>

          {/* Size Feedback */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'id' ? 'Bagaimana ukurannya?' : 'How does it fit?'}
            </label>
            <div className="flex gap-2">
              {[
                { value: 'runs_small' as SizeFeedback, icon: TrendingDown, label: { en: 'Runs Small', id: 'Kekecilan' }, color: 'text-blue-600 border-blue-200 bg-blue-50' },
                { value: 'true_to_size' as SizeFeedback, icon: Minus, label: { en: 'True to Size', id: 'Pas' }, color: 'text-green-600 border-green-200 bg-green-50' },
                { value: 'runs_large' as SizeFeedback, icon: TrendingUp, label: { en: 'Runs Large', id: 'Kebesaran' }, color: 'text-orange-600 border-orange-200 bg-orange-50' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSizeFeedback(sizeFeedback === option.value ? undefined : option.value)}
                  className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                    sizeFeedback === option.value
                      ? option.color
                      : 'border-muted hover:border-muted-foreground/30'
                  }`}
                >
                  <option.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{option.label[language === 'id' ? 'id' : 'en']}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size, Color & Body Info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">
                {language === 'id' ? 'Size dipesan' : 'Size ordered'}
              </label>
              <select
                value={sizeOrdered}
                onChange={(e) => setSizeOrdered(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{language === 'id' ? 'Pilih' : 'Select'}</option>
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">
                {language === 'id' ? 'Warna dipesan' : 'Color ordered'}
              </label>
              <input
                type="text"
                value={colorOrdered}
                onChange={(e) => setColorOrdered(e.target.value)}
                placeholder={language === 'id' ? 'Contoh: Hitam' : 'E.g., Black'}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">
                {language === 'id' ? 'Tinggi' : 'Height'}
              </label>
              <input
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="165cm"
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-muted-foreground">
                {language === 'id' ? 'Berat' : 'Weight'}
              </label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="55kg"
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t">
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {language === 'id' ? 'Mengirim...' : 'Submitting...'}
                </>
              ) : (
                language === 'id' ? 'Kirim Ulasan' : 'Submit Review'
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              {language === 'id'
                ? 'Dengan mengirim, kamu setuju ulasanmu dapat ditampilkan di UC'
                : 'By submitting, you agree your review may be displayed on UC'}
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
