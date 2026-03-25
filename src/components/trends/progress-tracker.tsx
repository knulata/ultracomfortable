'use client'

import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

interface ProgressTrackerProps {
  current: number
  target?: number
  language?: 'id' | 'en'
}

function getProgressColor(current: number) {
  if (current >= 400) return 'bg-green-500'
  if (current >= 250) return 'bg-yellow-500'
  if (current >= 100) return 'bg-orange-500'
  return 'bg-red-500'
}

const milestones = [100, 250, 500]

export function ProgressTracker({ current, target = 500, language = 'id' }: ProgressTrackerProps) {
  const prevRef = useRef(current)
  const percent = Math.min((current / target) * 100, 100)

  useEffect(() => {
    const prev = prevRef.current
    prevRef.current = current

    for (const milestone of milestones) {
      if (prev < milestone && current >= milestone) {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.7 } })
        break
      }
    }
  }, [current])

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          {language === 'id' ? 'Target Harian' : 'Daily Target'}
        </h3>
        <div className="text-right">
          <span className="text-2xl font-bold tabular-nums">{current}</span>
          <span className="text-sm text-muted-foreground">/{target}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getProgressColor(current)}`}
          style={{ width: `${percent}%` }}
        />

        {/* Milestone markers */}
        {milestones.map((m) => (
          <div
            key={m}
            className="absolute top-0 h-full w-px bg-foreground/20"
            style={{ left: `${(m / target) * 100}%` }}
          />
        ))}
      </div>

      {/* Milestone labels */}
      <div className="relative mt-1 flex text-[10px] text-muted-foreground">
        {milestones.map((m) => (
          <span
            key={m}
            className="absolute -translate-x-1/2"
            style={{ left: `${(m / target) * 100}%` }}
          >
            {m}
          </span>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {current === 0
          ? language === 'id'
            ? 'Menunggu komitmen pertama'
            : 'Waiting for first commitment'
          : language === 'id'
            ? `${current} model dikomit hari ini`
            : `${current} models committed today`}
      </p>
    </div>
  )
}
