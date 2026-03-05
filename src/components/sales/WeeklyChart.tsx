'use client'

import { useSalesStore } from '@/stores/sales'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'

export function WeeklyChart() {
  const { language } = useTranslation()
  const { getWeeklySummary } = useSalesStore()

  const weeklyData = getWeeklySummary()
  const maxValue = Math.max(...weeklyData.map((d) => d.total), 1)

  return (
    <div className="bg-background border rounded-xl p-4">
      <h3 className="font-semibold mb-4">
        {language === 'id' ? 'Penjualan 7 Hari Terakhir' : 'Last 7 Days Sales'}
      </h3>

      {/* Bar Chart */}
      <div className="flex items-end justify-between gap-2 h-40 mb-2">
        {weeklyData.map((day, index) => {
          const height = (day.total / maxValue) * 100
          const isToday = index === weeklyData.length - 1

          return (
            <div key={day.date} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center justify-end h-32">
                {day.total > 0 && (
                  <span className="text-xs text-muted-foreground mb-1 hidden sm:block">
                    {(day.total / 1000000).toFixed(1)}jt
                  </span>
                )}
                <div
                  className={`w-full max-w-[40px] rounded-t-lg transition-all ${
                    isToday
                      ? 'bg-gradient-to-t from-green-600 to-green-400'
                      : 'bg-gradient-to-t from-primary/80 to-primary/40'
                  }`}
                  style={{ height: `${Math.max(height, 4)}%` }}
                />
              </div>
              <span className={`text-xs mt-2 ${isToday ? 'font-bold text-green-600' : 'text-muted-foreground'}`}>
                {day.date}
              </span>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="flex justify-between pt-3 border-t text-sm">
        <div>
          <span className="text-muted-foreground">
            {language === 'id' ? 'Total 7 hari:' : '7-day total:'}
          </span>
          <span className="font-semibold ml-2">
            {formatPrice(weeklyData.reduce((sum, d) => sum + d.total, 0))}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">
            {language === 'id' ? 'Rata-rata:' : 'Average:'}
          </span>
          <span className="font-semibold ml-2">
            {formatPrice(Math.round(weeklyData.reduce((sum, d) => sum + d.total, 0) / 7))}
          </span>
        </div>
      </div>
    </div>
  )
}
