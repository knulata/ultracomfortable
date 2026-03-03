'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Heart, ShoppingBag, Share2, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { formatPrice, useCartStore } from '@/stores/cart'
import { toast } from 'sonner'

// Lookbook data (in production, fetch from API)
const lookbooksData: Record<string, {
  id: string
  title: string
  titleId: string
  description: string
  descriptionId: string
  coverGradient: string
  looks: {
    id: string
    title: string
    titleId: string
    description: string
    descriptionId: string
    products: { id: string; name: string; nameId: string; price: number; slug: string; category: string }[]
  }[]
}> = {
  'lb-1': {
    id: 'lb-1',
    title: 'Weekend Wanderer',
    titleId: 'Weekend Santai',
    description: 'Effortless pieces for your days off. Comfortable, stylish, and ready for wherever the day takes you.',
    descriptionId: 'Outfit effortless untuk hari liburmu. Nyaman, stylish, dan siap untuk kemana pun harimu membawamu.',
    coverGradient: 'from-amber-400 to-orange-500',
    looks: [
      {
        id: 'look-1',
        title: 'Coffee Run',
        titleId: 'Ngopi Pagi',
        description: 'Simple and chic for your morning caffeine fix',
        descriptionId: 'Simpel dan chic untuk ngopi pagi',
        products: [
          { id: 'p1', name: 'Oversized Cotton Tee', nameId: 'Kaos Katun Oversized', price: 199000, slug: 'oversized-cotton-tee', category: 'Top' },
          { id: 'p2', name: 'High Waist Joggers', nameId: 'Joggers High Waist', price: 299000, slug: 'high-waist-joggers', category: 'Bottom' },
          { id: 'p3', name: 'Canvas Slip-ons', nameId: 'Slip-on Kanvas', price: 249000, slug: 'canvas-slip-ons', category: 'Shoes' },
        ],
      },
      {
        id: 'look-2',
        title: 'Brunch with Friends',
        titleId: 'Brunch Bareng Teman',
        description: 'Elevated casual for weekend gatherings',
        descriptionId: 'Kasual elevated untuk kumpul weekend',
        products: [
          { id: 'p4', name: 'Linen Button-Up', nameId: 'Kemeja Linen', price: 349000, slug: 'linen-button-up', category: 'Top' },
          { id: 'p5', name: 'Relaxed Denim', nameId: 'Denim Relaxed', price: 399000, slug: 'relaxed-denim', category: 'Bottom' },
          { id: 'p6', name: 'Woven Belt', nameId: 'Sabuk Anyaman', price: 149000, slug: 'woven-belt', category: 'Accessory' },
          { id: 'p7', name: 'Leather Sandals', nameId: 'Sandal Kulit', price: 299000, slug: 'leather-sandals', category: 'Shoes' },
        ],
      },
      {
        id: 'look-3',
        title: 'Park Day',
        titleId: 'Hari di Taman',
        description: 'Relaxed layers for outdoor activities',
        descriptionId: 'Layer santai untuk aktivitas outdoor',
        products: [
          { id: 'p8', name: 'Cropped Hoodie', nameId: 'Hoodie Crop', price: 329000, slug: 'cropped-hoodie', category: 'Top' },
          { id: 'p9', name: 'Biker Shorts', nameId: 'Shorts Biker', price: 179000, slug: 'biker-shorts', category: 'Bottom' },
          { id: 'p10', name: 'Chunky Sneakers', nameId: 'Sneakers Chunky', price: 449000, slug: 'chunky-sneakers', category: 'Shoes' },
          { id: 'p11', name: 'Baseball Cap', nameId: 'Topi Baseball', price: 129000, slug: 'baseball-cap', category: 'Accessory' },
        ],
      },
      {
        id: 'look-4',
        title: 'Sunset Stroll',
        titleId: 'Jalan Sore',
        description: 'Effortlessly pretty for golden hour',
        descriptionId: 'Cantik effortless untuk golden hour',
        products: [
          { id: 'p12', name: 'Flowy Midi Dress', nameId: 'Dress Midi Flowy', price: 449000, slug: 'flowy-midi-dress', category: 'Dress' },
          { id: 'p13', name: 'Denim Jacket', nameId: 'Jaket Denim', price: 499000, slug: 'denim-jacket', category: 'Outerwear' },
          { id: 'p14', name: 'Strappy Sandals', nameId: 'Sandal Tali', price: 279000, slug: 'strappy-sandals', category: 'Shoes' },
        ],
      },
    ],
  },
  // Add more lookbooks as needed
}

export default function LookbookDetailPage() {
  const params = useParams()
  const lookbookId = params.lookbookId as string
  const { language } = useTranslation()
  const { addItem } = useCartStore()
  const [currentLookIndex, setCurrentLookIndex] = useState(0)
  const [savedLooks, setSavedLooks] = useState<string[]>([])

  const lookbook = lookbooksData[lookbookId] || lookbooksData['lb-1']
  const currentLook = lookbook.looks[currentLookIndex]

  const handleAddToCart = (product: typeof currentLook.products[0]) => {
    const mockVariant = {
      id: `${product.id}-variant`,
      product_id: product.id,
      sku: product.slug,
      size: 'M',
      color: 'Default',
      color_hex: '#000000',
      price_adjustment: 0,
      stock: 10,
      images: [],
      is_active: true,
      created_at: new Date().toISOString(),
    }

    const mockProduct = {
      id: product.id,
      brand_id: 'uc',
      category_id: product.category.toLowerCase(),
      name: language === 'id' ? product.nameId : product.name,
      slug: product.slug,
      description: '',
      base_price: product.price,
      sale_price: null,
      images: [],
      tags: [],
      is_active: true,
      is_featured: false,
      total_sold: 0,
      rating_avg: 0,
      rating_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    addItem(mockVariant, mockProduct, 1)
    toast.success(language === 'id' ? 'Ditambahkan ke keranjang!' : 'Added to cart!')
  }

  const handleAddAllToCart = () => {
    currentLook.products.forEach(p => handleAddToCart(p))
    toast.success(language === 'id' ? 'Semua item ditambahkan!' : 'All items added!')
  }

  const toggleSave = (lookId: string) => {
    setSavedLooks(prev =>
      prev.includes(lookId) ? prev.filter(id => id !== lookId) : [...prev, lookId]
    )
  }

  const nextLook = () => {
    setCurrentLookIndex(prev => (prev + 1) % lookbook.looks.length)
  }

  const prevLook = () => {
    setCurrentLookIndex(prev => (prev - 1 + lookbook.looks.length) % lookbook.looks.length)
  }

  const getTotalPrice = () => {
    return currentLook.products.reduce((sum, p) => sum + p.price, 0)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/style" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>{language === 'id' ? 'Kembali' : 'Back'}</span>
            </Link>
            <h1 className="font-semibold">
              {language === 'id' ? lookbook.titleId : lookbook.title}
            </h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Lookbook Description */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className={`inline-block w-16 h-1 rounded-full bg-gradient-to-r ${lookbook.coverGradient} mb-4`} />
          <h2 className="text-3xl font-bold mb-4">
            {language === 'id' ? lookbook.titleId : lookbook.title}
          </h2>
          <p className="text-muted-foreground">
            {language === 'id' ? lookbook.descriptionId : lookbook.description}
          </p>
        </div>

        {/* Current Look */}
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Image */}
            <div className="relative">
              <div className={`aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br ${lookbook.coverGradient}`}>
                <div className="absolute inset-0 bg-black/10" />

                {/* Look Number */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-black px-4 py-2 rounded-full text-sm font-medium">
                  Look {currentLookIndex + 1}/{lookbook.looks.length}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevLook}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextLook}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Product Dots */}
                {currentLook.products.map((product, i) => (
                  <div
                    key={product.id}
                    className="absolute w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform"
                    style={{
                      top: `${20 + i * 20}%`,
                      left: `${35 + (i % 2) * 25}%`,
                    }}
                  >
                    <span className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                ))}
              </div>

              {/* Look Thumbnails */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {lookbook.looks.map((look, i) => (
                  <button
                    key={look.id}
                    onClick={() => setCurrentLookIndex(i)}
                    className={`flex-shrink-0 w-16 h-20 rounded-lg bg-gradient-to-br ${lookbook.coverGradient} transition-all ${
                      i === currentLookIndex ? 'ring-2 ring-primary ring-offset-2' : 'opacity-50 hover:opacity-75'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Look Details */}
            <div>
              <h3 className="text-2xl font-bold mb-2">
                {language === 'id' ? currentLook.titleId : currentLook.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {language === 'id' ? currentLook.descriptionId : currentLook.description}
              </p>

              {/* Products */}
              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {language === 'id' ? 'Dalam Look Ini' : 'In This Look'}
                </h4>
                {currentLook.products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between bg-background rounded-xl p-4 border">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg" />
                      <div>
                        <span className="text-xs text-muted-foreground">{product.category}</span>
                        <p className="font-medium">{language === 'id' ? product.nameId : product.name}</p>
                        <p className="text-primary font-semibold">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => handleAddToCart(product)}>
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total & Actions */}
              <div className="bg-primary/5 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{language === 'id' ? 'Total Look' : 'Complete Look'}</p>
                    <p className="text-2xl font-bold">{formatPrice(getTotalPrice())}</p>
                  </div>
                  <Button size="lg" onClick={handleAddAllToCart}>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {language === 'id' ? 'Beli Semua' : 'Shop the Look'}
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => toggleSave(currentLook.id)}
                >
                  <Bookmark className={`h-4 w-4 mr-2 ${savedLooks.includes(currentLook.id) ? 'fill-current' : ''}`} />
                  {language === 'id' ? 'Simpan Look' : 'Save Look'}
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  {language === 'id' ? 'Bagikan' : 'Share'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* More Looks */}
        <div className="mt-16">
          <h3 className="text-xl font-bold mb-6 text-center">
            {language === 'id' ? 'Looks Lainnya' : 'More Looks'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {lookbook.looks.map((look, i) => (
              <button
                key={look.id}
                onClick={() => setCurrentLookIndex(i)}
                className={`aspect-[3/4] rounded-xl bg-gradient-to-br ${lookbook.coverGradient} relative overflow-hidden transition-all ${
                  i === currentLookIndex ? 'ring-2 ring-primary ring-offset-2' : 'hover:scale-105'
                }`}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-3 left-3 text-white text-left">
                  <p className="text-xs opacity-80">Look {i + 1}</p>
                  <p className="text-sm font-medium">{language === 'id' ? look.titleId : look.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
