'use client'

import { useState, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { KPIStrip } from '@/components/trends/kpi-strip'
import { TrendGrid } from '@/components/trends/trend-grid'
import { ProgressTracker } from '@/components/trends/progress-tracker'
import { useTrends, useDailyMetrics, useGapAnalysis } from '@/lib/hooks/use-trends'
import { useTranslation } from '@/stores/language'
import type { TrendFilters, TrendScoreView } from '@/types/trends'

export default function AdminTrendsPage() {
  const { language } = useTranslation()
  const [filters, setFilters] = useState<TrendFilters>({})
  const [activeTab, setActiveTab] = useState<'all' | 'gaps'>('all')

  const trendsQuery = useTrends(filters)
  const metricsQuery = useDailyMetrics()
  const gapQuery = useGapAnalysis()

  const handleRefresh = useCallback(() => {
    trendsQuery.refetch()
    metricsQuery.refetch()
    gapQuery.refetch()
  }, [trendsQuery, metricsQuery, gapQuery])

  const displayTrends = activeTab === 'gaps' ? gapQuery.data : trendsQuery.data
  const isLoading = activeTab === 'gaps' ? gapQuery.isLoading : trendsQuery.isLoading

  // Admin view doesn't commit — placeholder handler
  const handleCommit = (trend: TrendScoreView) => {
    // Admin might want to view detail or manually assign
    console.log('Admin view trend:', trend.id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {language === 'id' ? 'Trend Intelligence' : 'Trend Intelligence'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {language === 'id'
              ? `Terakhir diperbarui: ${trendsQuery.dataUpdatedAt ? new Date(trendsQuery.dataUpdatedAt).toLocaleTimeString('id-ID') : '-'}`
              : `Last updated: ${trendsQuery.dataUpdatedAt ? new Date(trendsQuery.dataUpdatedAt).toLocaleTimeString() : '-'}`}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* KPI Strip */}
      <KPIStrip
        metrics={metricsQuery.data}
        isLoading={metricsQuery.isLoading}
        gapCount={gapQuery.data?.length ?? 0}
        language={language}
      />

      {/* Tab toggle */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          {language === 'id' ? 'Semua Trend' : 'All Trends'}
          {trendsQuery.data && ` (${trendsQuery.data.length})`}
        </button>
        <button
          onClick={() => setActiveTab('gaps')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'gaps'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          {language === 'id' ? 'Gap Analysis' : 'Gap Analysis'}
          {gapQuery.data && ` (${gapQuery.data.length})`}
        </button>
      </div>

      {/* Trend Grid */}
      <TrendGrid
        trends={displayTrends}
        isLoading={isLoading}
        committedTrendIds={new Set()}
        onCommit={handleCommit}
        onFilterChange={setFilters}
        onRefresh={handleRefresh}
        language={language}
      />

      {/* Progress Tracker */}
      <ProgressTracker
        current={metricsQuery.data?.models_committed ?? 0}
        language={language}
      />
    </div>
  )
}
