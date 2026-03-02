'use client'

import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useCartStore, formatPrice } from '@/stores/cart'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore()
  const subtotal = getSubtotal()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-background shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Shopping Bag ({items.length})</h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Your bag is empty</p>
              <p className="text-sm text-muted-foreground mb-6">
                Looks like you haven&apos;t added anything yet.
              </p>
              <Button onClick={closeCart} asChild>
                <Link href="/new">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const price = item.product.sale_price ?? item.product.base_price
                const adjustedPrice = price + item.variant.price_adjustment

                return (
                  <li key={item.variantId} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                    {/* Image */}
                    <div className="relative w-20 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      {item.product.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ShoppingBag className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.variant.color} / {item.variant.size}
                      </p>
                      <p className="text-sm font-semibold mt-1">
                        {formatPrice(adjustedPrice)}
                      </p>

                      {/* Quantity */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1 hover:bg-muted rounded"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="p-1 hover:bg-muted rounded"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="p-1 text-muted-foreground hover:text-destructive self-start"
                      aria-label="Remove item"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Shipping and taxes calculated at checkout
            </p>
            <Button className="w-full" size="lg" asChild>
              <Link href="/checkout" onClick={closeCart}>
                Checkout
              </Link>
            </Button>
            <Button variant="outline" className="w-full" onClick={closeCart}>
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
