'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Plus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { formatPrice, useCartStore } from '@/stores/cart'
import { toast } from 'sonner'

interface OutfitItem {
  id: string
  name: string
  nameId: string
  price: number
  category: string
  slug: string
}

interface CompleteTheLookProps {
  currentProduct: OutfitItem
  suggestedItems: OutfitItem[]
}

export function CompleteTheLook({ currentProduct, suggestedItems }: CompleteTheLookProps) {
  const { language } = useTranslation()
  const { addItem } = useCartStore()
  const [selectedItems, setSelectedItems] = useState<string[]>([currentProduct.id])

  const toggleItem = (id: string) => {
    if (id === currentProduct.id) return // Can't deselect current product
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const allItems = [currentProduct, ...suggestedItems]
  const selectedProducts = allItems.filter(item => selectedItems.includes(item.id))
  const totalPrice = selectedProducts.reduce((sum, item) => sum + item.price, 0)
  const bundleDiscount = selectedItems.length >= 3 ? 0.1 : selectedItems.length >= 2 ? 0.05 : 0
  const discountedPrice = totalPrice * (1 - bundleDiscount)

  const addAllToCart = () => {
    selectedProducts.forEach(item => {
      addItem({
        id: item.id,
        name: language === 'id' ? item.nameId : item.name,
        price: item.price,
        image: '',
        quantity: 1,
        size: 'M',
        color: 'Default',
      })
    })
    toast.success(
      language === 'id'
        ? `${selectedProducts.length} item ditambahkan ke keranjang!`
        : `${selectedProducts.length} items added to cart!`
    )
  }

  return (
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold">
          {language === 'id' ? 'Lengkapi Penampilanmu' : 'Complete the Look'}
        </h3>
      </div>

      {/* Outfit Builder */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
        {allItems.map((item, index) => (
          <div key={item.id} className="flex items-center">
            {/* Item Card */}
            <button
              onClick={() => toggleItem(item.id)}
              className={`relative flex-shrink-0 w-24 transition-all ${
                selectedItems.includes(item.id)
                  ? 'ring-2 ring-primary ring-offset-2 rounded-xl'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <div className="aspect-[3/4] bg-muted rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/30" />

                {/* Category label */}
                <span className="absolute bottom-1 left-1 right-1 text-[10px] font-medium bg-background/80 rounded px-1 py-0.5 truncate text-center">
                  {item.category}
                </span>

                {/* Checkmark */}
                {selectedItems.includes(item.id) && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              <p className="text-xs font-medium mt-1 truncate">
                {language === 'id' ? item.nameId : item.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatPrice(item.price)}
              </p>
            </button>

            {/* Plus connector */}
            {index < allItems.length - 1 && (
              <Plus className="h-4 w-4 text-muted-foreground mx-1 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Bundle Summary */}
      <div className="bg-background rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground">
              {selectedItems.length} {language === 'id' ? 'item dipilih' : 'items selected'}
            </p>
            <div className="flex items-center gap-2">
              {bundleDiscount > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(totalPrice)}
                </span>
              )}
              <span className="text-xl font-bold">
                {formatPrice(discountedPrice)}
              </span>
              {bundleDiscount > 0 && (
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  {language === 'id' ? `Hemat ${bundleDiscount * 100}%` : `Save ${bundleDiscount * 100}%`}
                </span>
              )}
            </div>
          </div>
          <Button onClick={addAllToCart} disabled={selectedItems.length === 0}>
            <ShoppingBag className="h-4 w-4 mr-2" />
            {language === 'id' ? 'Tambah Semua' : 'Add All'}
          </Button>
        </div>

        {/* Bundle discount hint */}
        {bundleDiscount === 0 && (
          <p className="text-xs text-primary">
            💡 {language === 'id' ? 'Pilih 2+ item untuk diskon 5%, 3+ item untuk diskon 10%!' : 'Select 2+ items for 5% off, 3+ items for 10% off!'}
          </p>
        )}
      </div>
    </div>
  )
}

// Sample suggested outfits for a product
export const getSuggestedOutfit = (productCategory: string): OutfitItem[] => {
  const outfits: Record<string, OutfitItem[]> = {
    top: [
      { id: 'sug1', name: 'High Waist Jeans', nameId: 'Jeans High Waist', price: 399000, category: 'Bottoms', slug: 'high-waist-jeans' },
      { id: 'sug2', name: 'Minimalist Sneakers', nameId: 'Sneakers Minimalis', price: 599000, category: 'Shoes', slug: 'minimalist-sneakers' },
      { id: 'sug3', name: 'Canvas Tote Bag', nameId: 'Tas Tote Kanvas', price: 249000, category: 'Bags', slug: 'canvas-tote-bag' },
    ],
    dress: [
      { id: 'sug1', name: 'Strappy Heels', nameId: 'Heels Tali', price: 499000, category: 'Shoes', slug: 'strappy-heels' },
      { id: 'sug2', name: 'Dainty Necklace', nameId: 'Kalung Tipis', price: 199000, category: 'Jewelry', slug: 'dainty-necklace' },
      { id: 'sug3', name: 'Clutch Bag', nameId: 'Tas Clutch', price: 349000, category: 'Bags', slug: 'clutch-bag' },
    ],
    default: [
      { id: 'sug1', name: 'Classic Belt', nameId: 'Sabuk Klasik', price: 199000, category: 'Accessories', slug: 'classic-belt' },
      { id: 'sug2', name: 'Sunglasses', nameId: 'Kacamata Hitam', price: 299000, category: 'Accessories', slug: 'sunglasses' },
      { id: 'sug3', name: 'Watch', nameId: 'Jam Tangan', price: 799000, category: 'Accessories', slug: 'watch' },
    ],
  }

  return outfits[productCategory] || outfits.default
}
