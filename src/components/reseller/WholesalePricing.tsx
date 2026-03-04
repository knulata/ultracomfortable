'use client'

import { useState } from 'react'
import { Package, Tag, TrendingDown, Calculator } from 'lucide-react'
import { useResellerStore, WHOLESALE_PRICE_TIERS, RESELLER_TIERS } from '@/stores/reseller'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'

interface WholesalePricingProps {
  basePrice: number
  productName?: string
  showCalculator?: boolean
}

export function WholesalePricing({ basePrice, productName, showCalculator = true }: WholesalePricingProps) {
  const { language } = useTranslation()
  const { getWholesalePrice } = useResellerStore()
  const [quantity, setQuantity] = useState(12)
  const [selectedTier, setSelectedTier] = useState<string>('')

  const pricing = getWholesalePrice(basePrice, quantity, selectedTier || undefined)

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
          <Package className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-bold text-amber-900 dark:text-amber-100">
            {language === 'id' ? 'Harga Grosir' : 'Wholesale Pricing'}
          </h3>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            {language === 'id' ? 'Makin banyak, makin murah!' : 'Buy more, save more!'}
          </p>
        </div>
      </div>

      {/* Price Tiers Table */}
      <div className="bg-white dark:bg-background rounded-lg overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-2 px-3 font-medium">
                {language === 'id' ? 'Jumlah' : 'Quantity'}
              </th>
              <th className="text-right py-2 px-3 font-medium">
                {language === 'id' ? 'Harga/pcs' : 'Price/pc'}
              </th>
              <th className="text-right py-2 px-3 font-medium">
                {language === 'id' ? 'Diskon' : 'Discount'}
              </th>
            </tr>
          </thead>
          <tbody>
            {WHOLESALE_PRICE_TIERS.map((tier, index) => {
              const tierPrice = Math.round(basePrice * (1 - tier.discountPercent / 100))
              const isActive = quantity >= tier.minQuantity &&
                (index === WHOLESALE_PRICE_TIERS.length - 1 || quantity < WHOLESALE_PRICE_TIERS[index + 1].minQuantity)

              return (
                <tr
                  key={tier.minQuantity}
                  className={`border-b last:border-0 ${isActive ? 'bg-amber-100 dark:bg-amber-900/30' : ''}`}
                >
                  <td className="py-2 px-3">
                    <span className={isActive ? 'font-semibold' : ''}>
                      {tier.minQuantity}+ pcs
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({language === 'id' ? tier.labelId : tier.label})
                    </span>
                  </td>
                  <td className={`text-right py-2 px-3 ${isActive ? 'font-semibold text-amber-700 dark:text-amber-300' : ''}`}>
                    {formatPrice(tierPrice)}
                  </td>
                  <td className="text-right py-2 px-3">
                    {tier.discountPercent > 0 ? (
                      <span className="text-green-600 font-medium">-{tier.discountPercent}%</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Calculator */}
      {showCalculator && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Calculator className="h-4 w-4" />
            {language === 'id' ? 'Kalkulator Harga' : 'Price Calculator'}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">
                {language === 'id' ? 'Jumlah (pcs)' : 'Quantity (pcs)'}
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">
                {language === 'id' ? 'Level Reseller' : 'Reseller Tier'}
              </label>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{language === 'id' ? 'Bukan Reseller' : 'Not a Reseller'}</option>
                {RESELLER_TIERS.map((tier) => (
                  <option key={tier.id} value={tier.id}>
                    {tier.badge} {language === 'id' ? tier.nameId : tier.name} (-{tier.discountPercent}%)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result */}
          <div className="bg-white dark:bg-background rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {language === 'id' ? 'Harga normal' : 'Regular price'}
              </span>
              <span className="line-through text-muted-foreground">
                {formatPrice(basePrice * quantity)}
              </span>
            </div>

            {pricing.wholesaleDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {language === 'id' ? `Diskon grosir (${pricing.priceTier.labelId})` : `Wholesale (${pricing.priceTier.label})`}
                </span>
                <span className="text-green-600">-{formatPrice(pricing.wholesaleDiscount)}</span>
              </div>
            )}

            {pricing.resellerDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {language === 'id' ? 'Diskon reseller' : 'Reseller discount'}
                </span>
                <span className="text-green-600">-{formatPrice(pricing.resellerDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between pt-2 border-t">
              <span className="font-medium">
                {language === 'id' ? 'Total' : 'Total'}
              </span>
              <div className="text-right">
                <span className="text-lg font-bold text-amber-700 dark:text-amber-300">
                  {formatPrice(pricing.totalPrice)}
                </span>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(pricing.unitPrice)}/pcs
                </p>
              </div>
            </div>

            {pricing.savings > 0 && (
              <div className="flex items-center justify-center gap-1 text-sm text-green-600 bg-green-50 dark:bg-green-950/30 py-1.5 rounded">
                <TrendingDown className="h-4 w-4" />
                <span className="font-medium">
                  {language === 'id' ? 'Hemat' : 'You save'} {formatPrice(pricing.savings)}!
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
