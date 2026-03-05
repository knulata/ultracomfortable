'use client'

import { Package, TrendingUp } from 'lucide-react'
import { useSalesStore } from '@/stores/sales'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'

export function TopProducts() {
  const { language } = useTranslation()
  const { getDailySummary } = useSalesStore()

  const today = getDailySummary(new Date())
  const topProducts = today.topProducts

  if (topProducts.length === 0) {
    return (
      <div className="bg-background border rounded-xl p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          {language === 'id' ? 'Produk Terlaris Hari Ini' : "Today's Best Sellers"}
        </h3>
        <p className="text-sm text-muted-foreground text-center py-4">
          {language === 'id' ? 'Belum ada penjualan hari ini' : 'No sales today yet'}
        </p>
      </div>
    )
  }

  const maxRevenue = Math.max(...topProducts.map((p) => p.revenue))

  return (
    <div className="bg-background border rounded-xl p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        {language === 'id' ? 'Produk Terlaris Hari Ini' : "Today's Best Sellers"}
      </h3>

      <div className="space-y-3">
        {topProducts.map((product, index) => {
          const percentage = (product.revenue / maxRevenue) * 100

          return (
            <div key={product.productName}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-200 text-gray-700' :
                    index === 2 ? 'bg-amber-100 text-amber-700' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium truncate max-w-[150px]">
                    {product.productName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold">
                    {formatPrice(product.revenue)}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({product.quantity} pcs)
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-amber-500' :
                    'bg-primary/50'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
