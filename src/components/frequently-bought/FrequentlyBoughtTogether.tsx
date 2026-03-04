'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, Plus, ShoppingCart, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBundlesStore, BundleProduct } from '@/stores/bundles'
import { useCartStore, formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

interface FrequentlyBoughtTogetherProps {
  productId: string
  currentProduct: {
    id: string
    name: string
    nameId: string
    price: number
    originalPrice?: number
    slug: string
  }
}

export function FrequentlyBoughtTogether({ productId, currentProduct }: FrequentlyBoughtTogetherProps) {
  const { language } = useTranslation()
  const { getBundleForProduct, calculateBundlePrice } = useBundlesStore()
  const { openCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const bundle = getBundleForProduct(productId)

  useEffect(() => {
    setMounted(true)
    // Pre-select all items by default
    if (bundle) {
      setSelectedIds(bundle.products.map(p => p.id))
    }
  }, [bundle])

  if (!mounted || !bundle || bundle.products.length === 0) {
    return null
  }

  const toggleProduct = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const selectAll = () => {
    setSelectedIds(bundle.products.map(p => p.id))
  }

  const { originalTotal, discountedTotal, savings, discountPercent } = calculateBundlePrice(bundle, selectedIds)

  // Total including the main product
  const mainProductPrice = currentProduct.price
  const grandTotal = mainProductPrice + discountedTotal
  const grandOriginal = mainProductPrice + originalTotal

  const handleAddAllToCart = () => {
    if (selectedIds.length === 0) {
      toast.error(language === 'id' ? 'Pilih minimal satu produk' : 'Select at least one product')
      return
    }

    // In a real app, we'd add all selected items to cart with proper variants
    // For now, just show success toast
    const itemCount = selectedIds.length + 1 // +1 for main product
    toast.success(
      language === 'id'
        ? `${itemCount} produk ditambahkan ke keranjang!`
        : `${itemCount} items added to cart!`
    )
    openCart()
  }

  const allSelected = selectedIds.length === bundle.products.length

  return (
    <div className="bg-gradient-to-br from-primary/5 via-background to-primary/5 rounded-2xl p-6 border">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">
          {language === 'id' ? 'Sering Dibeli Bersama' : 'Frequently Bought Together'}
        </h2>
        <span className="text-sm text-muted-foreground">
          ({bundle.timesOrderedTogether.toLocaleString()} {language === 'id' ? 'kali' : 'times'})
        </span>
      </div>

      {/* Products Grid */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Main Product (always included) */}
        <div className="relative">
          <div className="w-24 h-24 md:w-28 md:h-28 bg-muted rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/20" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
            <Check className="h-3 w-3" />
          </div>
        </div>

        {/* Plus Sign */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
          <Plus className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Bundle Products */}
        {bundle.products.map((product, index) => (
          <div key={product.id} className="flex items-center gap-4">
            <button
              onClick={() => toggleProduct(product.id)}
              className={`relative group transition-all ${
                selectedIds.includes(product.id) ? '' : 'opacity-50'
              }`}
            >
              <div className="w-24 h-24 md:w-28 md:h-28 bg-muted rounded-lg overflow-hidden border-2 transition-colors group-hover:border-primary/50"
                style={{
                  borderColor: selectedIds.includes(product.id) ? 'hsl(var(--primary))' : 'transparent'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/15" />
              </div>
              <div className={`absolute -bottom-1 -right-1 rounded-full p-1 transition-colors ${
                selectedIds.includes(product.id)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted border'
              }`}>
                {selectedIds.includes(product.id) ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Plus className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
            </button>

            {index < bundle.products.length - 1 && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                <Plus className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Product Details */}
      <div className="space-y-3 mb-6">
        {/* Main Product */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span className="font-medium">
              {language === 'id' ? currentProduct.nameId : currentProduct.name}
            </span>
            <span className="text-xs text-muted-foreground">
              ({language === 'id' ? 'Produk ini' : 'This item'})
            </span>
          </div>
          <span className="font-semibold">{formatPrice(currentProduct.price)}</span>
        </div>

        {/* Bundle Products */}
        {bundle.products.map((product) => (
          <div key={product.id} className="flex items-center justify-between text-sm">
            <button
              onClick={() => toggleProduct(product.id)}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                selectedIds.includes(product.id)
                  ? 'bg-primary border-primary'
                  : 'border-muted-foreground/30'
              }`}>
                {selectedIds.includes(product.id) && (
                  <Check className="h-3 w-3 text-primary-foreground" />
                )}
              </div>
              <span className={selectedIds.includes(product.id) ? 'font-medium' : 'text-muted-foreground'}>
                {language === 'id' ? product.nameId : product.name}
              </span>
            </button>
            <div className="flex items-center gap-2">
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className={`font-semibold ${selectedIds.includes(product.id) ? '' : 'text-muted-foreground'}`}>
                {formatPrice(product.price)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Summary */}
      <div className="bg-background rounded-xl p-4 mb-4 space-y-2">
        {allSelected && savings > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {language === 'id' ? 'Diskon bundle' : 'Bundle discount'}
            </span>
            <span className="text-green-600 font-medium">-{discountPercent}%</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="font-medium">
            {language === 'id' ? 'Total untuk' : 'Total for'} {selectedIds.length + 1} {language === 'id' ? 'produk' : 'items'}
          </span>
          <div className="text-right">
            {allSelected && savings > 0 && (
              <span className="text-sm text-muted-foreground line-through mr-2">
                {formatPrice(grandOriginal)}
              </span>
            )}
            <span className="text-xl font-bold text-primary">{formatPrice(grandTotal)}</span>
          </div>
        </div>

        {allSelected && savings > 0 && (
          <div className="flex items-center justify-end gap-1 text-sm text-green-600">
            <Sparkles className="h-4 w-4" />
            <span>
              {language === 'id' ? 'Hemat' : 'You save'} {formatPrice(savings)}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleAddAllToCart}
          className="flex-1"
          size="lg"
          disabled={selectedIds.length === 0}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {language === 'id' ? 'Tambahkan Semua ke Keranjang' : 'Add All to Cart'}
        </Button>

        {!allSelected && (
          <Button
            onClick={selectAll}
            variant="outline"
            size="lg"
          >
            {language === 'id' ? 'Pilih Semua' : 'Select All'}
          </Button>
        )}
      </div>

      {/* Bundle Tip */}
      {!allSelected && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          {language === 'id'
            ? `Pilih semua untuk diskon ${bundle.bundleDiscount}%`
            : `Select all items for ${bundle.bundleDiscount}% bundle discount`
          }
        </p>
      )}
    </div>
  )
}
