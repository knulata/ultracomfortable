'use client'

import { TrendingUp, Users, AlertTriangle, BarChart3 } from 'lucide-react'
import type { DailyMetrics } from '@/types/trends'

interface KPIStripProps {
  metrics: DailyMetrics | null | undefined
  isLoading: boolean
  gapCount?: number
  language?: 'id' | 'en'
}

function KPICard({
  value,
  target,
  label,
  icon: Icon,
  isLoading,
}: {
  value: number
  target?: number
  label: string
  icon: React.ElementType
  isLoading: boolean
}) {
  if (isLoading) {
    return (
      <div className="flex min-w-[120px] flex-col items-center rounded-lg border bg-card p-3">
        <div className="h-8 w-16 animate-pulse rounded bg-muted" />
        <div className="mt-1 h-3 w-20 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  return (
    <div className="flex min-w-[120px] flex-col items-center rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50">
      <Icon className="mb-1 h-4 w-4 text-muted-foreground" />
      <div className="text-2xl font-bold tabular-nums">
        {value}
        {target && (
          <span className="text-sm font-normal text-muted-foreground">/{target}</span>
        )}
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

export function KPIStrip({ metrics, isLoading, gapCount = 0, language = 'id' }: KPIStripProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      <KPICard
        value={metrics?.models_committed ?? 0}
        target={500}
        label={language === 'id' ? 'Model Hari Ini' : 'Models Today'}
        icon={TrendingUp}
        isLoading={isLoading}
      />
      <KPICard
        value={metrics?.partners_responded ?? 0}
        label={language === 'id' ? 'Partner Merespon' : 'Partners Responded'}
        icon={Users}
        isLoading={isLoading}
      />
      <KPICard
        value={gapCount}
        label={language === 'id' ? 'Gap (tanpa partner)' : 'Gaps (no partner)'}
        icon={AlertTriangle}
        isLoading={isLoading}
      />
      <KPICard
        value={metrics?.trends_detected ?? 0}
        label={language === 'id' ? 'Total Trend' : 'Total Trends'}
        icon={BarChart3}
        isLoading={isLoading}
      />
    </div>
  )
}
