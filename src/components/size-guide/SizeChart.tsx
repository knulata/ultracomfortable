'use client'

import { ProductCategory } from '@/stores/sizeGuide'
import { useTranslation } from '@/stores/language'

interface SizeChartProps {
  category: ProductCategory
  recommendedSize?: string | null
}

export function SizeChart({ category, recommendedSize }: SizeChartProps) {
  const { language } = useTranslation()

  const hasLength = category.sizes.some((s) => s.length)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-3 px-4 text-left font-semibold bg-muted/50">
              {language === 'id' ? 'Ukuran' : 'Size'}
            </th>
            <th className="py-3 px-4 text-center font-semibold bg-muted/50">
              {language === 'id' ? 'Dada (cm)' : 'Chest (cm)'}
            </th>
            <th className="py-3 px-4 text-center font-semibold bg-muted/50">
              {language === 'id' ? 'Pinggang (cm)' : 'Waist (cm)'}
            </th>
            <th className="py-3 px-4 text-center font-semibold bg-muted/50">
              {language === 'id' ? 'Pinggul (cm)' : 'Hips (cm)'}
            </th>
            {hasLength && (
              <th className="py-3 px-4 text-center font-semibold bg-muted/50">
                {language === 'id' ? 'Panjang (cm)' : 'Length (cm)'}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {category.sizes.map((size) => {
            const isRecommended = recommendedSize === size.size
            return (
              <tr
                key={size.size}
                className={`border-b transition-colors ${
                  isRecommended
                    ? 'bg-primary/10 border-primary/30'
                    : 'hover:bg-muted/30'
                }`}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${isRecommended ? 'text-primary' : ''}`}>
                      {size.size}
                    </span>
                    {isRecommended && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        {language === 'id' ? 'Direkomendasikan' : 'Recommended'}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-center text-muted-foreground">
                  {size.chest.min} - {size.chest.max}
                </td>
                <td className="py-3 px-4 text-center text-muted-foreground">
                  {size.waist.min} - {size.waist.max}
                </td>
                <td className="py-3 px-4 text-center text-muted-foreground">
                  {size.hips.min} - {size.hips.max}
                </td>
                {hasLength && (
                  <td className="py-3 px-4 text-center text-muted-foreground">
                    {size.length ? `${size.length.min} - ${size.length.max}` : '-'}
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
