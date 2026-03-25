'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchTrends,
  fetchTrendItems,
  fetchDailyMetrics,
  fetchGapAnalysis,
  commitToTrend,
  fetchPartnerAllocations,
  fetchPartnerResponses,
  uploadPartnerPhoto,
} from '@/lib/supabase/trends'
import type { TrendFilters, CommitData, TrendScoreView } from '@/types/trends'

export function useTrends(filters?: TrendFilters) {
  return useQuery({
    queryKey: ['trends', filters],
    queryFn: () => fetchTrends(filters),
    staleTime: 60_000,
    refetchInterval: 120_000,
  })
}

export function useTrendItems(trendId: string | null) {
  return useQuery({
    queryKey: ['trend-items', trendId],
    queryFn: () => fetchTrendItems(trendId!),
    enabled: !!trendId,
  })
}

export function useDailyMetrics() {
  return useQuery({
    queryKey: ['daily-metrics'],
    queryFn: fetchDailyMetrics,
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}

export function useGapAnalysis() {
  return useQuery({
    queryKey: ['gap-analysis'],
    queryFn: fetchGapAnalysis,
    staleTime: 60_000,
  })
}

export function useCommitToTrend() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CommitData) => commitToTrend(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trends'] })
      queryClient.invalidateQueries({ queryKey: ['daily-metrics'] })
      queryClient.invalidateQueries({ queryKey: ['partner-responses'] })
      queryClient.invalidateQueries({ queryKey: ['partner-stats'] })
    },
  })
}

export function usePartnerAllocations(partnerId: string | null) {
  return useQuery({
    queryKey: ['partner-allocations', partnerId],
    queryFn: () => fetchPartnerAllocations(partnerId!),
    enabled: !!partnerId,
  })
}

export function usePartnerResponses(partnerId: string | null) {
  return useQuery({
    queryKey: ['partner-responses', partnerId],
    queryFn: () => fetchPartnerResponses(partnerId!),
    enabled: !!partnerId,
  })
}

export function useUploadPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ partnerId, file, photoType }: { partnerId: string; file: File; photoType: 'stock' | 'fabric' }) =>
      uploadPartnerPhoto(partnerId, file, photoType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-photos'] })
    },
  })
}

export function useRecommendedTrends(partnerId: string | null, specialties: string[]) {
  const trendsQuery = useTrends({ sortBy: 'score' })

  const recommended = (trendsQuery.data ?? []).filter((trend: TrendScoreView) => {
    if (!trend.category) return true
    if (specialties.length === 0) return true
    return specialties.includes(trend.category)
  }).slice(0, 5)

  return {
    ...trendsQuery,
    data: recommended,
  }
}
