'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, Send, Sparkles, ShoppingBag, RotateCcw, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStylistStore, StylePreferences, RecommendedProduct } from '@/stores/stylist'
import { useTranslation } from '@/stores/language'
import { formatPrice, useCartStore } from '@/stores/cart'
import { toast } from 'sonner'

// Quiz steps configuration
const quizSteps = [
  {
    id: 'welcome',
    messageEn: "Hi! I'm Kira, your personal UC stylist. I'll help you discover pieces that match your unique style. Ready to find your perfect look?",
    messageId: "Hai! Aku Kira, stylist pribadi UC-mu. Aku akan bantu kamu menemukan pakaian yang sesuai dengan gayamu. Siap menemukan tampilan sempurnamu?",
    options: [
      { label: "Let's go!", labelId: 'Ayo mulai!', value: 'start', icon: '✨' },
      { label: 'Maybe later', labelId: 'Nanti saja', value: 'later', icon: '👋' },
    ],
  },
  {
    id: 'style',
    messageEn: "What's your go-to style? Pick the one that feels most like YOU.",
    messageId: 'Apa gaya favoritmu? Pilih yang paling menggambarkan dirimu.',
    preferenceKey: 'style' as keyof StylePreferences,
    options: [
      { label: 'Casual & Comfy', labelId: 'Kasual & Nyaman', value: 'casual', icon: '👕' },
      { label: 'Formal & Polished', labelId: 'Formal & Rapi', value: 'formal', icon: '👔' },
      { label: 'Trendy & Bold', labelId: 'Trendy & Berani', value: 'trendy', icon: '🔥' },
      { label: 'Minimalist & Clean', labelId: 'Minimalis & Bersih', value: 'minimalist', icon: '⚪' },
      { label: 'Bohemian & Free', labelId: 'Bohemian & Bebas', value: 'bohemian', icon: '🌸' },
    ],
  },
  {
    id: 'occasion',
    messageEn: "Perfect choice! Now, what occasions do you usually dress for? (Pick all that apply)",
    messageId: 'Pilihan bagus! Sekarang, untuk acara apa biasanya kamu berdandan? (Pilih semua yang sesuai)',
    preferenceKey: 'occasions' as keyof StylePreferences,
    multiSelect: true,
    options: [
      { label: 'Everyday', labelId: 'Sehari-hari', value: 'everyday', icon: '☀️' },
      { label: 'Work/Office', labelId: 'Kerja/Kantor', value: 'work', icon: '💼' },
      { label: 'Date Night', labelId: 'Kencan', value: 'date', icon: '💕' },
      { label: 'Party/Events', labelId: 'Pesta/Acara', value: 'party', icon: '🎉' },
      { label: 'Vacation', labelId: 'Liburan', value: 'vacation', icon: '🏖️' },
    ],
  },
  {
    id: 'budget',
    messageEn: "Got it! What's your typical budget per item?",
    messageId: 'Oke! Berapa budget-mu biasanya per item?',
    preferenceKey: 'budget' as keyof StylePreferences,
    options: [
      { label: 'Budget-friendly (under Rp250K)', labelId: 'Hemat (di bawah Rp250K)', value: 'budget', icon: '💰' },
      { label: 'Mid-range (Rp250K-500K)', labelId: 'Menengah (Rp250K-500K)', value: 'mid', icon: '💎' },
      { label: 'Premium (Rp500K+)', labelId: 'Premium (Rp500K+)', value: 'premium', icon: '👑' },
    ],
  },
  {
    id: 'colors',
    messageEn: "Almost there! Which colors do you love wearing?",
    messageId: 'Hampir selesai! Warna apa yang kamu suka pakai?',
    preferenceKey: 'colors' as keyof StylePreferences,
    multiSelect: true,
    options: [
      { label: 'Neutrals', labelId: 'Netral', value: 'neutral', icon: '🤍' },
      { label: 'Black', labelId: 'Hitam', value: 'black', icon: '🖤' },
      { label: 'Earth Tones', labelId: 'Warna Tanah', value: 'earth', icon: '🤎' },
      { label: 'Pastels', labelId: 'Pastel', value: 'pastel', icon: '💜' },
      { label: 'Bold & Bright', labelId: 'Cerah & Terang', value: 'bright', icon: '❤️' },
    ],
  },
  {
    id: 'complete',
    messageEn: "You have amazing taste! Based on your style profile, I've handpicked some pieces just for you. Let me show you my top recommendations...",
    messageId: 'Seleramu luar biasa! Berdasarkan profil gayamu, aku sudah pilihkan beberapa item khusus untukmu. Ini rekomendasi terbaikku...',
  },
]

// Mock product database for recommendations
const productDatabase: RecommendedProduct[] = [
  // Casual
  { id: 'p1', name: 'Oversized Cotton Tee', nameId: 'Kaos Katun Oversized', price: 199000, category: 'casual', slug: 'oversized-cotton-tee', matchReason: 'Perfect for your casual style', matchReasonId: 'Sempurna untuk gaya kasualmu', matchScore: 0 },
  { id: 'p2', name: 'Relaxed Fit Joggers', nameId: 'Joggers Relaxed Fit', price: 299000, category: 'casual', slug: 'relaxed-fit-joggers', matchReason: 'Comfy and stylish', matchReasonId: 'Nyaman dan stylish', matchScore: 0 },
  { id: 'p3', name: 'Classic Denim Jacket', nameId: 'Jaket Denim Klasik', price: 449000, category: 'casual', slug: 'classic-denim-jacket', matchReason: 'A timeless layering piece', matchReasonId: 'Outer klasik yang timeless', matchScore: 0 },
  // Formal
  { id: 'p4', name: 'Tailored Blazer', nameId: 'Blazer Tailored', price: 699000, category: 'formal', slug: 'tailored-blazer', matchReason: 'Elevates any outfit', matchReasonId: 'Meningkatkan tampilan apapun', matchScore: 0 },
  { id: 'p5', name: 'Silk Blouse', nameId: 'Blus Sutra', price: 399000, category: 'formal', slug: 'silk-blouse', matchReason: 'Elegant and sophisticated', matchReasonId: 'Elegan dan berkelas', matchScore: 0 },
  { id: 'p6', name: 'High-Waist Trousers', nameId: 'Celana High-Waist', price: 449000, category: 'formal', slug: 'high-waist-trousers', matchReason: 'Polished office look', matchReasonId: 'Tampilan kantor yang rapi', matchScore: 0 },
  // Trendy
  { id: 'p7', name: 'Cropped Cardigan', nameId: 'Kardigan Crop', price: 349000, category: 'trendy', slug: 'cropped-cardigan', matchReason: 'On-trend layering', matchReasonId: 'Layering yang trendy', matchScore: 0 },
  { id: 'p8', name: 'Wide Leg Jeans', nameId: 'Jeans Wide Leg', price: 399000, category: 'trendy', slug: 'wide-leg-jeans', matchReason: 'Fashion-forward silhouette', matchReasonId: 'Siluet yang fashionable', matchScore: 0 },
  { id: 'p9', name: 'Statement Print Dress', nameId: 'Dress Bermotif Statement', price: 499000, category: 'trendy', slug: 'statement-print-dress', matchReason: 'Bold and eye-catching', matchReasonId: 'Berani dan menarik perhatian', matchScore: 0 },
  // Minimalist
  { id: 'p10', name: 'Basic White Tee', nameId: 'Kaos Putih Basic', price: 149000, category: 'minimalist', slug: 'basic-white-tee', matchReason: 'Wardrobe essential', matchReasonId: 'Item wajib di lemari', matchScore: 0 },
  { id: 'p11', name: 'Neutral Linen Pants', nameId: 'Celana Linen Netral', price: 399000, category: 'minimalist', slug: 'neutral-linen-pants', matchReason: 'Clean and effortless', matchReasonId: 'Bersih dan effortless', matchScore: 0 },
  { id: 'p12', name: 'Structured Tote Bag', nameId: 'Tas Tote Structured', price: 599000, category: 'minimalist', slug: 'structured-tote-bag', matchReason: 'Minimalist accessory', matchReasonId: 'Aksesoris minimalis', matchScore: 0 },
  // Bohemian
  { id: 'p13', name: 'Floral Maxi Dress', nameId: 'Dress Maxi Floral', price: 449000, category: 'bohemian', slug: 'floral-maxi-dress', matchReason: 'Free-spirited vibes', matchReasonId: 'Vibes bebas dan santai', matchScore: 0 },
  { id: 'p14', name: 'Embroidered Blouse', nameId: 'Blus Bordir', price: 349000, category: 'bohemian', slug: 'embroidered-blouse', matchReason: 'Artisan details', matchReasonId: 'Detail artisan', matchScore: 0 },
  { id: 'p15', name: 'Woven Crossbody Bag', nameId: 'Tas Selempang Anyaman', price: 299000, category: 'bohemian', slug: 'woven-crossbody-bag', matchReason: 'Boho-chic accessory', matchReasonId: 'Aksesoris boho-chic', matchScore: 0 },
  // Budget options
  { id: 'p16', name: 'Ribbed Tank Top', nameId: 'Tank Top Ribbed', price: 129000, category: 'casual', slug: 'ribbed-tank-top', matchReason: 'Budget-friendly basic', matchReasonId: 'Basic yang hemat', matchScore: 0 },
  { id: 'p17', name: 'Cotton Shorts', nameId: 'Celana Pendek Katun', price: 179000, category: 'casual', slug: 'cotton-shorts', matchReason: 'Affordable comfort', matchReasonId: 'Nyaman dan terjangkau', matchScore: 0 },
  // Premium options
  { id: 'p18', name: 'Cashmere Sweater', nameId: 'Sweater Kasmir', price: 899000, category: 'premium', slug: 'cashmere-sweater', matchReason: 'Luxurious feel', matchReasonId: 'Terasa mewah', matchScore: 0 },
  { id: 'p19', name: 'Leather Handbag', nameId: 'Tas Kulit', price: 1299000, category: 'premium', slug: 'leather-handbag', matchReason: 'Investment piece', matchReasonId: 'Investasi fashion', matchScore: 0 },
]

export function UCStylist() {
  const { language } = useTranslation()
  const { addItem } = useCartStore()
  const {
    isOpen,
    closeStylist,
    currentStep,
    preferences,
    setPreference,
    nextStep,
    resetQuiz,
    completeQuiz,
    hasCompletedQuiz,
  } = useStylistStore()

  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const currentQuizStep = quizSteps[currentStep]

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentStep, isTyping])

  // Generate recommendations when quiz is complete
  useEffect(() => {
    if (currentStep === quizSteps.length - 1) {
      const filtered = productDatabase.filter((product) => {
        let matches = true

        // Style filter
        if (preferences.style) {
          const styleCategories: Record<string, string[]> = {
            casual: ['casual'],
            formal: ['formal'],
            trendy: ['trendy'],
            minimalist: ['minimalist'],
            bohemian: ['bohemian'],
          }
          matches = matches && styleCategories[preferences.style]?.includes(product.category)
        }

        // Budget filter
        if (preferences.budget) {
          const budgetRanges: Record<string, { min?: number; max?: number }> = {
            budget: { max: 250000 },
            mid: { min: 200000, max: 600000 },
            premium: { min: 500000 },
          }
          const range = budgetRanges[preferences.budget]
          if (range?.max && product.price > range.max) matches = false
          if (range?.min && product.price < range.min) matches = false
        }

        return matches
      })

      // Score and sort
      const scored = filtered.map((p) => ({
        ...p,
        matchScore: Math.floor(Math.random() * 20) + 80, // 80-100 match score
      }))

      setRecommendations(scored.slice(0, 6))
      completeQuiz()
    }
  }, [currentStep, preferences, completeQuiz])

  const handleOptionSelect = (value: string) => {
    const step = quizSteps[currentStep]

    if (value === 'later') {
      closeStylist()
      return
    }

    if (step.multiSelect) {
      setSelectedOptions((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      )
    } else {
      // Single select - save and move to next
      if (step.preferenceKey) {
        setPreference(step.preferenceKey, value as any)
      }
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        nextStep()
      }, 800)
    }
  }

  const handleMultiSelectConfirm = () => {
    const step = quizSteps[currentStep]
    if (step.preferenceKey && selectedOptions.length > 0) {
      setPreference(step.preferenceKey, selectedOptions as any)
    }
    setSelectedOptions([])
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      nextStep()
    }, 800)
  }

  const handleAddToCart = (product: RecommendedProduct) => {
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
      category_id: product.category,
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

  const handleStartOver = () => {
    resetQuiz()
    setSelectedOptions([])
    setRecommendations([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeStylist} />

      {/* Chat Window */}
      <div className="relative w-full sm:max-w-md h-[85vh] sm:h-[600px] bg-background rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Kira</h3>
                <p className="text-xs opacity-90">
                  {language === 'id' ? 'UC Personal Stylist' : 'UC Personal Stylist'}
                </p>
              </div>
            </div>
            <button onClick={closeStylist} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Previous messages (simplified - show current step message) */}
          {quizSteps.slice(0, currentStep + 1).map((step, index) => (
            <div key={step.id}>
              {/* Stylist Message */}
              <div className="flex gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                  <p className="text-sm">
                    {language === 'id' ? step.messageId : step.messageEn}
                  </p>
                </div>
              </div>

              {/* User's selection (if not current step) */}
              {index < currentStep && step.options && (
                <div className="flex justify-end mb-3">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 max-w-[70%]">
                    <p className="text-sm">
                      {step.multiSelect && step.preferenceKey
                        ? (preferences[step.preferenceKey] as string[])
                            ?.map((v) => {
                              const opt = step.options?.find((o) => o.value === v)
                              return language === 'id' ? opt?.labelId : opt?.label
                            })
                            .join(', ')
                        : (() => {
                            const val = step.preferenceKey ? preferences[step.preferenceKey] : null
                            const opt = step.options?.find((o) => o.value === val)
                            return opt ? (language === 'id' ? opt.labelId : opt.label) : ''
                          })()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {currentStep === quizSteps.length - 1 && recommendations.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground text-center">
                {language === 'id' ? 'Rekomendasi untukmu' : 'Picked for you'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {recommendations.map((product) => (
                  <div key={product.id} className="bg-muted/50 rounded-xl overflow-hidden">
                    <Link href={`/products/${product.slug}`} onClick={closeStylist}>
                      <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/30 relative">
                        <span className="absolute top-2 right-2 text-xs font-medium bg-green-500 text-white px-2 py-0.5 rounded-full">
                          {product.matchScore}% match
                        </span>
                      </div>
                    </Link>
                    <div className="p-3">
                      <Link href={`/products/${product.slug}`} onClick={closeStylist}>
                        <h4 className="text-sm font-medium line-clamp-1 hover:text-primary transition-colors">
                          {language === 'id' ? product.nameId : product.name}
                        </h4>
                      </Link>
                      <p className="text-xs text-muted-foreground mb-2">
                        {language === 'id' ? product.matchReasonId : product.matchReason}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions after recommendations */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={handleStartOver}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {language === 'id' ? 'Mulai Ulang' : 'Start Over'}
                </Button>
                <Button size="sm" className="flex-1" asChild onClick={closeStylist}>
                  <Link href="/products">
                    {language === 'id' ? 'Lihat Semua' : 'See All'}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Options Area */}
        {currentQuizStep?.options && currentStep < quizSteps.length - 1 && !isTyping && (
          <div className="border-t p-4 bg-muted/30">
            <div className="flex flex-wrap gap-2">
              {currentQuizStep.options.map((option) => {
                const isSelected = currentQuizStep.multiSelect
                  ? selectedOptions.includes(option.value)
                  : false

                return (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect(option.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border hover:border-primary hover:text-primary'
                    }`}
                  >
                    {option.icon && <span className="mr-1">{option.icon}</span>}
                    {language === 'id' ? option.labelId : option.label}
                  </button>
                )
              })}
            </div>

            {/* Confirm button for multi-select */}
            {currentQuizStep.multiSelect && selectedOptions.length > 0 && (
              <Button className="w-full mt-3" onClick={handleMultiSelectConfirm}>
                {language === 'id' ? 'Lanjut' : 'Continue'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
