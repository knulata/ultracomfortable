'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice, useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

export default function WishlistPage() {
  const { t, language } = useTranslation()
  const { items, removeItem } = useWishlistStore()
  const { addItem: addToCart, openCart } = useCartStore()

  const handleRemove = (id: string) => {
    removeItem(id)
    toast.success(language === 'id' ? 'Dihapus dari favorit' : 'Removed from wishlist')
  }

  const handleAddToCart = (item: typeof items[0]) => {
    // Create mock variant and product for cart
    const mockVariant = {
      id: `${item.id}-variant`,
      product_id: item.id,
      sku: item.slug,
      size: 'M',
      color: 'Default',
      color_hex: '#000000',
      price_adjustment: 0,
      stock: 10,
      images: [item.image],
      is_active: true,
      created_at: new Date().toISOString(),
    }

    const mockProduct = {
      id: item.id,
      brand_id: 'uc',
      category_id: 'general',
      name: item.name,
      slug: item.slug,
      description: '',
      base_price: item.originalPrice ?? item.price,
      sale_price: item.originalPrice ? item.price : null,
      images: [item.image],
      tags: [],
      is_active: true,
      is_featured: false,
      total_sold: 0,
      rating_avg: 0,
      rating_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    addToCart(mockVariant, mockProduct, 1)
    toast.success(language === 'id' ? 'Ditambahkan ke keranjang' : 'Added to cart')
    openCart()
  }

  const handleAddAllToCart = () => {
    items.forEach(item => {
      const mockVariant = {
        id: `${item.id}-variant`,
        product_id: item.id,
        sku: item.slug,
        size: 'M',
        color: 'Default',
        color_hex: '#000000',
        price_adjustment: 0,
        stock: 10,
        images: [item.image],
        is_active: true,
        created_at: new Date().toISOString(),
      }

      const mockProduct = {
        id: item.id,
        brand_id: 'uc',
        category_id: 'general',
        name: item.name,
        slug: item.slug,
        description: '',
        base_price: item.originalPrice ?? item.price,
        sale_price: item.originalPrice ? item.price : null,
        images: [item.image],
        tags: [],
        is_active: true,
        is_featured: false,
        total_sold: 0,
        rating_avg: 0,
        rating_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      addToCart(mockVariant, mockProduct, 1)
    })
    toast.success(language === 'id' ? 'Semua item ditambahkan ke keranjang' : 'All items added to cart')
    openCart()
  }

  return (
    <div className="space-y-6">
      <div className="bg-background rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t.account.wishlist}</h1>
            <p className="text-muted-foreground">{items.length} {t.account.items}</p>
          </div>
          {items.length > 0 && (
            <Button variant="outline" onClick={handleAddAllToCart}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              {language === 'id' ? 'Tambah Semua ke Keranjang' : 'Add All to Cart'}
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">
              {language === 'id' ? 'Favorit Anda kosong' : 'Your wishlist is empty'}
            </p>
            <p className="text-muted-foreground mb-6">
              {language === 'id' ? 'Simpan item yang Anda suka untuk nanti' : 'Save items you love for later'}
            </p>
            <Button asChild>
              <Link href="/products">
                {language === 'id' ? 'Temukan Produk' : 'Discover Products'}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const hasDiscount = item.originalPrice && item.originalPrice > item.price
              const discountPercent = hasDiscount
                ? Math.round((1 - item.price / item.originalPrice!) * 100)
                : 0

              return (
                <div key={item.id} className="group relative">
                  <Link href={`/products/${item.slug}`}>
                    <div className="aspect-[3/4] bg-muted rounded-lg mb-3 relative overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />
                      )}

                      {hasDiscount && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-2 right-2 p-2 bg-background/80 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors"
                    title={t.common.remove}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="space-y-2">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-medium hover:text-primary transition-colors">{item.name}</h3>
                    </Link>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {formatPrice(item.price)}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(item.originalPrice!)}
                        </span>
                      )}
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => handleAddToCart(item)}
                    >
                      {t.productDetail.addToCart}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
