'use client'

import { useState } from 'react'
import { TrendCard, TrendCardSkeleton } from './trend-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, SlidersHorizontal } from 'lucide-react'
import type { TrendScoreView, TrendFilters } from '@/types/trends'

const categories = [
  { value: 'all', labelId: 'Semua', labelEn: 'All' },
  { value: 'gamis', labelId: 'Gamis', labelEn: 'Gamis' },
  { value: 'hijab', labelId: 'Hijab', labelEn: 'Hijab' },
  { value: 'abaya', labelId: 'Abaya', labelEn: 'Abaya' },
  { value: 'mukena', labelId: 'Mukena', labelEn: 'Mukena' },
  { value: 'khimar', labelId: 'Khimar', labelEn: 'Khimar' },
  { value: 'outer', labelId: 'Outer', labelEn: 'Outer' },
]

const sortOptions = [
  { value: 'score', labelId: 'Skor Tertinggi', labelEn: 'Highest Score' },
  { value: 'newest', labelId: 'Terbaru', labelEn: 'Newest' },
  { value: 'most_sold', labelId: 'Paling Banyak Terjual', labelEn: 'Most Sold' },
]

interface TrendGridProps {
  trends: TrendScoreView[] | undefined
  isLoading: boolean
  committedTrendIds: Set<string>
  onCommit: (trend: TrendScoreView) => void
  onFilterChange: (filters: TrendFilters) => void
  onRefresh?: () => void
  language?: 'id' | 'en'
}

export function TrendGrid({
  trends,
  isLoading,
  committedTrendIds,
  onCommit,
  onFilterChange,
  onRefresh,
  language = 'id',
}: TrendGridProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeSort, setActiveSort] = useState('score')

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    onFilterChange({ category, sortBy: activeSort as TrendFilters['sortBy'] })
  }

  const handleSortChange = (sort: string) => {
    setActiveSort(sort)
    onFilterChange({ category: activeCategory, sortBy: sort as TrendFilters['sortBy'] })
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <Badge
              key={cat.value}
              variant={activeCategory === cat.value ? 'default' : 'outline'}
              className="cursor-pointer whitespace-nowrap transition-colors"
              onClick={() => handleCategoryChange(cat.value)}
            >
              {language === 'id' ? cat.labelId : cat.labelEn}
            </Badge>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <select
            value={activeSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="rounded-md border bg-background px-2 py-1 text-xs"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {language === 'id' ? opt.labelId : opt.labelEn}
              </option>
            ))}
          </select>

          {onRefresh && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <TrendCardSkeleton key={i} />
          ))}
        </div>
      ) : !trends || trends.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <SlidersHorizontal className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <h3 className="text-lg font-medium">
            {language === 'id' ? 'Belum ada trend hari ini' : 'No trends today'}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            {language === 'id'
              ? 'Kami sedang mengumpulkan data dari berbagai platform. Cek lagi nanti.'
              : 'We are collecting data from multiple platforms. Check back later.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {trends.map((trend) => (
            <TrendCard
              key={trend.id}
              trend={trend}
              onCommit={onCommit}
              isCommitted={committedTrendIds.has(trend.id)}
              language={language}
            />
          ))}
        </div>
      )}
    </div>
  )
}
