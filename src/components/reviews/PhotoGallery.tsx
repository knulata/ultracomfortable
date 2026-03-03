'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { ReviewPhoto } from '@/stores/reviews'

interface PhotoGalleryProps {
  photos: ReviewPhoto[]
  initialIndex?: number
  onClose: () => void
}

export function PhotoGallery({ photos, initialIndex = 0, onClose }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="h-6 w-6 text-white" />
      </button>

      {/* Main Image */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative max-w-4xl max-h-full">
          {/* In production, this would be actual images */}
          <div className="w-full h-[70vh] bg-gradient-to-br from-primary/30 to-primary/60 rounded-lg flex items-center justify-center">
            <ZoomIn className="h-12 w-12 text-white/50" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      {photos.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </>
      )}

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => setCurrentIndex(index)}
              className={`w-12 h-12 rounded-lg overflow-hidden transition-all ${
                index === currentIndex
                  ? 'ring-2 ring-white scale-110'
                  : 'opacity-50 hover:opacity-75'
              }`}
            >
              <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/60" />
            </button>
          ))}
        </div>
      )}

      {/* Counter */}
      <div className="absolute bottom-4 right-4 text-white/70 text-sm">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  )
}
