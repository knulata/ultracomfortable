'use client'

import { useState, useMemo, useCallback } from 'react'
import { Flame, TrendingUp } from 'lucide-react'
import { TrendGrid } from '@/components/trends/trend-grid'
import { TrendCard } from '@/components/trends/trend-card'
import { CommitSheet } from '@/components/trends/commit-sheet'
import { LiveAlert } from '@/components/trends/live-alert'
import { PhotoUploader } from '@/components/trends/photo-uploader'
import { MatchResults } from '@/components/trends/match-results'
import {
  useTrends,
  useCommitToTrend,
  usePartnerResponses,
  useRecommendedTrends,
  useUploadPhoto,
} from '@/lib/hooks/use-trends'
import { usePartner, usePartnerStats } from '@/lib/hooks/use-partner'
import { useTranslation } from '@/stores/language'
import type { TrendFilters, TrendScoreView, PhotoMatchResult } from '@/types/trends'

export default function PartnerTrendsPage() {
  const { language } = useTranslation()
  const [filters, setFilters] = useState<TrendFilters>({})
  const [selectedTrend, setSelectedTrend] = useState<TrendScoreView | null>(null)
  const [matchResults, setMatchResults] = useState<PhotoMatchResult[] | null>(null)

  const partnerQuery = usePartner()
  const partner = partnerQuery.data
  const partnerId = partner?.id ?? null

  const statsQuery = usePartnerStats(partnerId)
  const trendsQuery = useTrends(filters)
  const recommendedQuery = useRecommendedTrends(partnerId, partner?.specialties ?? [])
  const responsesQuery = usePartnerResponses(partnerId)
  const commitMutation = useCommitToTrend()
  const uploadMutation = useUploadPhoto()

  const committedTrendIds = useMemo(() => {
    const ids = new Set<string>()
    responsesQuery.data?.forEach((r) => {
      if (r.response === 'bisa') ids.add(r.trend_id)
    })
    return ids
  }, [responsesQuery.data])

  // Find viral trend for live alert (score > 0.8 and first_seen < 24h ago)
  const viralTrend = useMemo(() => {
    if (!trendsQuery.data) return null
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    return trendsQuery.data.find(
      (t) => t.computed_score > 0.8 && t.first_seen_at > oneDayAgo && t.commitments === 0
    ) ?? null
  }, [trendsQuery.data])

  const handleCommit = useCallback(
    async (data: { price: number; quantity: number; leadTime: number }) => {
      if (!partnerId || !selectedTrend) return
      await commitMutation.mutateAsync({
        partner_id: partnerId,
        trend_id: selectedTrend.id,
        price_offered: data.price,
        quantity_offered: data.quantity,
        lead_time_days: data.leadTime,
      })
    },
    [partnerId, selectedTrend, commitMutation]
  )

  const handlePhotoUpload = useCallback(
    (file: File, type: 'stock' | 'fabric') => {
      if (!partnerId) return
      uploadMutation.mutate({ partnerId, file, photoType: type })
      // Match results would come from a separate API call after upload
      // For now, clear previous results
      setMatchResults(null)
    },
    [partnerId, uploadMutation]
  )

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    const name = partner?.owner_name ?? ''
    if (language === 'id') {
      if (hour < 11) return `Selamat pagi, ${name}!`
      if (hour < 15) return `Selamat siang, ${name}!`
      if (hour < 18) return `Selamat sore, ${name}!`
      return `Selamat malam, ${name}!`
    }
    return `Hello, ${name}!`
  }, [partner?.owner_name, language])

  const trendCount = trendsQuery.data?.length ?? 0

  return (
    <div className="space-y-6 pb-8">
      {/* Greeting + Stats */}
      <div>
        <h1 className="text-xl font-bold">
          {greeting} <Flame className="inline h-5 w-5 text-orange-500" />{' '}
          <span className="text-muted-foreground font-normal text-base">
            {trendCount > 0 &&
              (language === 'id'
                ? `${trendCount} gaya baru trending hari ini`
                : `${trendCount} new trending styles today`)}
          </span>
        </h1>
        {statsQuery.data && (
          <p className="mt-1 text-sm text-muted-foreground">
            {language === 'id'
              ? `Komitmen Anda: ${statsQuery.data.todayCommitted} hari ini · Tingkat pemenuhan: ${Math.round(statsQuery.data.fulfillmentRate)}%`
              : `Your commitments: ${statsQuery.data.todayCommitted} today · Fulfillment rate: ${Math.round(statsQuery.data.fulfillmentRate)}%`}
          </p>
        )}
      </div>

      {/* Live Alert */}
      <LiveAlert
        trend={viralTrend}
        onCommit={setSelectedTrend}
        language={language}
      />

      {/* Recommended for You */}
      {recommendedQuery.data && recommendedQuery.data.length > 0 && (
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-4 w-4" />
            {language === 'id' ? 'Direkomendasikan untuk Anda' : 'Recommended for You'}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {recommendedQuery.data.map((trend) => (
              <TrendCard
                key={trend.id}
                trend={trend}
                onCommit={setSelectedTrend}
                isCommitted={committedTrendIds.has(trend.id)}
                language={language}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Trending */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">
          {language === 'id' ? 'Semua Trending' : 'All Trending'}
        </h2>
        <TrendGrid
          trends={trendsQuery.data}
          isLoading={trendsQuery.isLoading}
          committedTrendIds={committedTrendIds}
          onCommit={setSelectedTrend}
          onFilterChange={setFilters}
          language={language}
        />
      </div>

      {/* Photo Upload + Matching */}
      <div className="border-t pt-6">
        <PhotoUploader
          onUpload={handlePhotoUpload}
          isUploading={uploadMutation.isPending}
          language={language}
        />

        {matchResults && (
          <div className="mt-4">
            <MatchResults
              results={matchResults}
              isLoading={false}
              onCommit={setSelectedTrend}
              language={language}
            />
          </div>
        )}
      </div>

      {/* Commit Bottom Sheet */}
      {selectedTrend && (
        <CommitSheet
          trend={selectedTrend}
          onClose={() => setSelectedTrend(null)}
          onCommit={handleCommit}
          isSubmitting={commitMutation.isPending}
          language={language}
        />
      )}
    </div>
  )
}
