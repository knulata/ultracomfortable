'use client'

import { useState } from 'react'
import { Upload, Tag, DollarSign, CheckCircle, Image, TrendingUp, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIntakeStore, IntakeItem } from '@/stores/intake'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

interface ListingCardProps {
  item: IntakeItem
  onSetPrice: (sellingPrice: number) => void
  onPublish: () => void
}

function ListingCard({ item, onSetPrice, onPublish }: ListingCardProps) {
  const { language } = useTranslation()
  const [sellingPrice, setSellingPrice] = useState(item.sellingPrice?.toString() || item.suggestedPrice?.toString() || '')

  const costPrice = item.costPrice
  const price = parseInt(sellingPrice) || 0
  const profit = price - costPrice
  const margin = price > 0 ? Math.round((profit / price) * 100) : 0
  const partnerEarning = price * 0.85 // 85% to partner (15% commission)

  const isGoodMargin = margin >= 35
  const isPriceSet = price > costPrice

  const handlePriceChange = (value: string) => {
    setSellingPrice(value)
    const numValue = parseInt(value) || 0
    if (numValue > 0) {
      onSetPrice(numValue)
    }
  }

  return (
    <div className="bg-background border rounded-xl p-4">
      <div className="flex gap-4 mb-4">
        {/* Product Images */}
        <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
          {item.photoCount > 0 ? (
            <div className="relative w-full h-full">
              <Image className="h-8 w-8 text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              <span className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                {item.photoCount}
              </span>
            </div>
          ) : (
            <Image className="h-8 w-8 text-muted-foreground" />
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{item.productName}</h3>
          <p className="text-sm text-muted-foreground">{item.shopName}</p>
          <p className="text-xs text-muted-foreground mt-1">
            SKU: {item.sku} • {item.quantity} pcs • {item.category}
          </p>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">
              {language === 'id' ? 'Harga Modal' : 'Cost Price'}
            </p>
            <p className="font-semibold">{formatPrice(costPrice)}</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">
              {language === 'id' ? 'Saran Harga' : 'Suggested Price'}
            </p>
            <p className="font-semibold text-primary">
              {formatPrice(item.suggestedPrice || 0)}
            </p>
          </div>
        </div>

        {/* Selling Price Input */}
        <div>
          <label className="text-sm font-medium block mb-1">
            <Tag className="h-4 w-4 inline mr-1" />
            {language === 'id' ? 'Harga Jual' : 'Selling Price'}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder={item.suggestedPrice?.toString()}
              className="w-full pl-12 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Margin Info */}
        {isPriceSet && (
          <div className={`rounded-lg p-3 ${isGoodMargin ? 'bg-green-50 dark:bg-green-950/30' : 'bg-amber-50 dark:bg-amber-950/30'}`}>
            <div className="flex items-center justify-between text-sm">
              <span className={isGoodMargin ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}>
                {language === 'id' ? 'Profit per pcs' : 'Profit per pc'}
              </span>
              <span className={`font-semibold ${isGoodMargin ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
                +{formatPrice(profit)} ({margin}%)
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-muted-foreground">
                {language === 'id' ? 'Partner dapat (85%)' : 'Partner gets (85%)'}
              </span>
              <span className="font-medium">{formatPrice(partnerEarning)}</span>
            </div>

            {!isGoodMargin && (
              <div className="flex items-center gap-2 mt-2 text-xs text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-3 w-3" />
                {language === 'id' ? 'Margin rendah, pertimbangkan naikkan harga' : 'Low margin, consider raising price'}
              </div>
            )}
          </div>
        )}

        {/* Quick Price Buttons */}
        <div className="flex gap-2">
          {[1.5, 1.7, 2.0].map((multiplier) => {
            const quickPrice = Math.ceil((costPrice * multiplier) / 5000) * 5000
            return (
              <button
                key={multiplier}
                onClick={() => handlePriceChange(quickPrice.toString())}
                className={`flex-1 py-2 px-3 text-xs rounded-lg border transition-colors ${
                  parseInt(sellingPrice) === quickPrice
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'hover:border-primary'
                }`}
              >
                {Math.round((multiplier - 1) * 100)}%
                <br />
                <span className="font-semibold">{formatPrice(quickPrice)}</span>
              </button>
            )
          })}
        </div>

        {/* Publish Button */}
        <Button
          onClick={onPublish}
          disabled={!isPriceSet}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {language === 'id' ? 'Publish ke Store' : 'Publish to Store'}
        </Button>
      </div>
    </div>
  )
}

export function ProductListing() {
  const { language } = useTranslation()
  const { items, updateItemPricing, updateItemStatus } = useIntakeStore()

  // Items ready for listing (pending_upload or listing status)
  const listingItems = items.filter((item) =>
    ['pending_upload', 'listing'].includes(item.status)
  )

  const handleSetPrice = (itemId: string, sellingPrice: number) => {
    const item = items.find((i) => i.id === itemId)
    if (item) {
      updateItemPricing(itemId, item.suggestedPrice || sellingPrice, sellingPrice)
      updateItemStatus(itemId, 'listing')
    }
  }

  const handlePublish = (item: IntakeItem) => {
    updateItemStatus(item.id, 'active')
    toast.success(
      language === 'id'
        ? `${item.productName} berhasil dipublish!`
        : `${item.productName} published successfully!`
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
        <div>
          <p className="text-2xl font-bold">{listingItems.length}</p>
          <p className="text-sm text-muted-foreground">
            {language === 'id' ? 'Siap untuk listing' : 'Ready to list'}
          </p>
        </div>
        <TrendingUp className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* Listing Items */}
      {listingItems.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Upload className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>{language === 'id' ? 'Tidak ada produk siap listing' : 'No products ready for listing'}</p>
          <p className="text-sm mt-1">
            {language === 'id'
              ? 'Produk akan muncul setelah foto selesai diedit'
              : 'Products will appear after photo editing is complete'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {listingItems.map((item) => (
            <ListingCard
              key={item.id}
              item={item}
              onSetPrice={(price) => handleSetPrice(item.id, price)}
              onPublish={() => handlePublish(item)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
