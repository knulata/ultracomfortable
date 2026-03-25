'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import type { PhotoMatchResult, TrendScoreView } from '@/types/trends'

interface MatchResultsProps {
  results: PhotoMatchResult[] | null
  isLoading: boolean
  onCommit: (trend: TrendScoreView) => void
  language?: 'id' | 'en'
}

function getSimilarityColor(similarity: number) {
  if (similarity >= 0.8) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  if (similarity >= 0.6) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
  return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
}

export function MatchResults({ results, isLoading, onCommit, language = 'id' }: MatchResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  if (!results) return null

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <Search className="mb-3 h-10 w-10 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">
          {language === 'id'
            ? 'Tidak ditemukan kecocokan. Coba foto lain?'
            : 'No matches found. Try another photo?'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">
        {language === 'id'
          ? `${results.length} kecocokan ditemukan`
          : `${results.length} matches found`}
      </h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {results.map((result) => (
          <div
            key={result.trend.id}
            className={`relative overflow-hidden rounded-lg border ${
              result.similarity < 0.6 ? 'opacity-50' : ''
            }`}
          >
            <div className="relative aspect-[2/3] w-full bg-muted">
              {result.trend.representative_image_url && (
                <Image
                  src={result.trend.representative_image_url}
                  alt={result.trend.name ?? ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              )}

              {/* Similarity badge */}
              <div className="absolute right-1.5 top-1.5">
                <Badge className={`text-xs ${getSimilarityColor(result.similarity)}`}>
                  {Math.round(result.similarity * 100)}%
                </Badge>
              </div>

              <div className="absolute bottom-1.5 left-1.5">
                <Badge className={`text-xs ${getSimilarityColor(result.similarity)}`}>
                  {result.label}
                </Badge>
              </div>
            </div>

            <div className="p-2">
              <p className="text-xs font-medium line-clamp-1">
                {result.trend.name ?? result.trend.category}
              </p>
              {result.similarity >= 0.6 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-1.5 w-full text-xs h-7"
                  onClick={() => onCommit(result.trend)}
                >
                  {language === 'id' ? 'Saya Bisa' : 'I Can Make'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
