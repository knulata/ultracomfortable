'use client'

import Link from 'next/link'
import { Search, ShoppingBag, User, Menu, Heart, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore, formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'
import { LanguageToggle, LanguageToggleCompact } from '@/components/layout/LanguageToggle'
import { CheckInButton } from '@/components/check-in'
import { FlashSaleBanner } from '@/components/flash-sale'
import { NotificationBell } from '@/components/notifications'
import { useFlashSaleStore } from '@/stores/flashSale'
import { useState } from 'react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { items, openCart, getItemCount } = useCartStore()
  const { t } = useTranslation()
  const itemCount = getItemCount()
  const { getActiveFlashSale, getUpcomingFlashSales } = useFlashSaleStore()
  const hasFlashSale = getActiveFlashSale() || getUpcomingFlashSales().length > 0

  const categories = [
    { name: t.nav.newIn, href: '/new' },
    { name: t.nav.originals, href: '/originals', isOriginals: true },
    { name: t.nav.style, href: '/style' },
    { name: t.nav.women, href: '/women' },
    { name: t.nav.men, href: '/men' },
    { name: t.nav.kids, href: '/kids' },
    { name: t.nav.beauty, href: '/beauty' },
    { name: t.nav.sale, href: '/sale', highlight: true },
  ]

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Top Bar - Flash Sale or Free Shipping */}
      {hasFlashSale ? (
        <FlashSaleBanner variant="compact" />
      ) : (
        <div className="bg-secondary text-secondary-foreground text-xs py-1.5 text-center">
          <p>{t.nav.freeShipping}</p>
        </div>
      )}

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-primary">UC</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  category.highlight ? 'text-red-500' : ''
                } ${(category as any).isOriginals ? 'flex items-center gap-1' : ''}`}
              >
                {(category as any).isOriginals && <Sparkles className="h-3.5 w-3.5 text-primary" />}
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Toggle */}
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>
            <div className="sm:hidden">
              <LanguageToggleCompact />
            </div>

            {/* Daily Check-in */}
            <div className="hidden sm:block">
              <CheckInButton variant="compact" />
            </div>

            {/* Search */}
            <Link href="/search" className="p-2" aria-label={t.nav.search}>
              <Search className="h-5 w-5" />
            </Link>

            {/* Wishlist */}
            <Link href="/account/wishlist" className="p-2 hidden sm:block" aria-label={t.nav.wishlist}>
              <Heart className="h-5 w-5" />
            </Link>

            {/* Notifications */}
            <div className="hidden sm:block">
              <NotificationBell />
            </div>

            {/* Account */}
            <Link href="/account" className="p-2 hidden sm:block" aria-label={t.nav.account}>
              <User className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <button
              className="p-2 relative"
              onClick={openCart}
              aria-label={t.nav.cart}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-background shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-xl font-bold">
                <span className="text-primary">UC</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className={`flex items-center gap-2 py-3 px-4 text-base font-medium rounded-lg hover:bg-muted transition-colors ${
                    category.highlight ? 'text-red-500' : ''
                  } ${(category as any).isOriginals ? 'bg-primary/5' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {(category as any).isOriginals && <Sparkles className="h-4 w-4 text-primary" />}
                  {category.name}
                </Link>
              ))}
            </nav>

            <div className="border-t p-4 space-y-2">
              <Link
                href="/account"
                className="flex items-center gap-3 py-3 px-4 text-base font-medium rounded-lg hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                {t.nav.account}
              </Link>
              <Link
                href="/account/wishlist"
                className="flex items-center gap-3 py-3 px-4 text-base font-medium rounded-lg hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="h-5 w-5" />
                {t.nav.wishlist}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
