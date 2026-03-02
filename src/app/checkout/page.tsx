'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, ChevronLeft, ShoppingBag, MapPin, CreditCard, Check, Truck, Shield, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore, formatPrice } from '@/stores/cart'
import { toast } from 'sonner'

// Indonesian provinces for dropdown
const provinces = [
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Banten',
  'Yogyakarta', 'Bali', 'Sumatera Utara', 'Sumatera Selatan', 'Kalimantan Timur',
  'Sulawesi Selatan', 'Other'
]

// Payment methods
const paymentMethods = [
  {
    id: 'e-wallet',
    name: 'E-Wallet',
    options: [
      { id: 'gopay', name: 'GoPay', icon: '💚' },
      { id: 'ovo', name: 'OVO', icon: '💜' },
      { id: 'dana', name: 'DANA', icon: '💙' },
      { id: 'shopeepay', name: 'ShopeePay', icon: '🧡' },
    ]
  },
  {
    id: 'qris',
    name: 'QRIS',
    options: [
      { id: 'qris', name: 'QRIS (All E-Wallets)', icon: '📱' },
    ]
  },
  {
    id: 'va',
    name: 'Virtual Account',
    options: [
      { id: 'bca_va', name: 'BCA Virtual Account', icon: '🏦' },
      { id: 'bni_va', name: 'BNI Virtual Account', icon: '🏦' },
      { id: 'bri_va', name: 'BRI Virtual Account', icon: '🏦' },
      { id: 'mandiri_va', name: 'Mandiri Virtual Account', icon: '🏦' },
      { id: 'permata_va', name: 'Permata Virtual Account', icon: '🏦' },
    ]
  },
  {
    id: 'paylater',
    name: 'Pay Later',
    options: [
      { id: 'akulaku', name: 'Akulaku', icon: '📅' },
      { id: 'kredivo', name: 'Kredivo', icon: '📅' },
    ]
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    options: [
      { id: 'credit_card', name: 'Visa / Mastercard / JCB', icon: '💳' },
    ]
  },
]

// Shipping options
const shippingOptions = [
  { id: 'regular', name: 'Regular (3-5 days)', price: 15000 },
  { id: 'express', name: 'Express (1-2 days)', price: 30000 },
  { id: 'same_day', name: 'Same Day (Jakarta only)', price: 50000 },
]

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation'

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping')
  const [isProcessing, setIsProcessing] = useState(false)

  // Form state
  const [shippingForm, setShippingForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    notes: '',
  })

  const [selectedShipping, setSelectedShipping] = useState('regular')
  const [selectedPayment, setSelectedPayment] = useState('')

  // Calculations
  const subtotal = getSubtotal()
  const shippingCost = shippingOptions.find(o => o.id === selectedShipping)?.price ?? 0
  const discount = 0 // Would come from coupon
  const total = subtotal + shippingCost - discount

  // Free shipping threshold
  const freeShippingThreshold = 500000
  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold
  const amountToFreeShipping = freeShippingThreshold - subtotal

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!shippingForm.fullName || !shippingForm.phone || !shippingForm.address ||
        !shippingForm.city || !shippingForm.province || !shippingForm.postalCode) {
      toast.error('Please fill in all required fields')
      return
    }

    setCurrentStep('payment')
  }

  const handlePaymentSubmit = async () => {
    if (!selectedPayment) {
      toast.error('Please select a payment method')
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // In real implementation, this would call Midtrans API
    toast.success('Order placed successfully!')
    setCurrentStep('confirmation')
    setIsProcessing(false)
  }

  // Empty cart state
  if (items.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add some items to checkout</p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-primary">UC</span>
            </Link>

            {/* Progress Steps */}
            <div className="hidden md:flex items-center gap-2">
              {[
                { id: 'shipping', label: 'Shipping', icon: MapPin },
                { id: 'payment', label: 'Payment', icon: CreditCard },
                { id: 'confirmation', label: 'Confirmation', icon: Check },
              ].map((step, index) => {
                const isActive = currentStep === step.id
                const isCompleted =
                  (currentStep === 'payment' && step.id === 'shipping') ||
                  (currentStep === 'confirmation' && ['shipping', 'payment'].includes(step.id))

                return (
                  <div key={step.id} className="flex items-center">
                    {index > 0 && (
                      <div className={`w-12 h-0.5 mx-2 ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
                    )}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                      isActive ? 'bg-primary text-primary-foreground' :
                      isCompleted ? 'bg-primary/20 text-primary' : 'text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <step.icon className="h-4 w-4" />
                      )}
                      <span className="font-medium">{step.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {currentStep === 'confirmation' ? (
          // Order Confirmation
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. We&apos;ve sent a confirmation email to {shippingForm.email || 'your email'}.
            </p>

            <div className="bg-background rounded-xl p-6 text-left mb-6">
              <div className="flex justify-between mb-4">
                <span className="text-muted-foreground">Order Number</span>
                <span className="font-mono font-medium">UC-{Date.now().toString().slice(-8)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Delivery</span>
                <span className="font-medium">
                  {selectedShipping === 'same_day' ? 'Today' :
                   selectedShipping === 'express' ? '1-2 days' : '3-5 days'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <Link href="/account/orders">Track Order</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Form */}
              {currentStep === 'shipping' && (
                <div className="bg-background rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Shipping Address
                  </h2>

                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={shippingForm.fullName}
                          onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                          className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={shippingForm.phone}
                          onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                          className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="08xxxxxxxxxx"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={shippingForm.email}
                        onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                        className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={shippingForm.address}
                        onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                        className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        rows={3}
                        placeholder="Street address, apartment, building, etc."
                        required
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={shippingForm.city}
                          onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                          className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Jakarta Selatan"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">
                          Province <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={shippingForm.province}
                          onChange={(e) => setShippingForm({ ...shippingForm, province: e.target.value })}
                          className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                          required
                        >
                          <option value="">Select</option>
                          {provinces.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">
                          Postal Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={shippingForm.postalCode}
                          onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                          className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="12345"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Delivery Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={shippingForm.notes}
                        onChange={(e) => setShippingForm({ ...shippingForm, notes: e.target.value })}
                        className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Gate code, landmark, etc."
                      />
                    </div>

                    {/* Shipping Method */}
                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Shipping Method
                      </h3>
                      <div className="space-y-2">
                        {shippingOptions.map((option) => {
                          const isFree = qualifiesForFreeShipping && option.id === 'regular'
                          return (
                            <label
                              key={option.id}
                              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedShipping === option.id ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name="shipping"
                                  value={option.id}
                                  checked={selectedShipping === option.id}
                                  onChange={() => setSelectedShipping(option.id)}
                                  className="w-4 h-4 text-primary"
                                />
                                <span>{option.name}</span>
                              </div>
                              <span className={`font-medium ${isFree ? 'text-green-600' : ''}`}>
                                {isFree ? 'FREE' : formatPrice(option.price)}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Continue to Payment
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </div>
              )}

              {/* Payment Selection */}
              {currentStep === 'payment' && (
                <div className="bg-background rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Payment Method
                    </h2>
                    <button
                      onClick={() => setCurrentStep('shipping')}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back to Shipping
                    </button>
                  </div>

                  {/* Shipping Summary */}
                  <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{shippingForm.fullName}</p>
                        <p className="text-sm text-muted-foreground">{shippingForm.phone}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {shippingForm.address}, {shippingForm.city}, {shippingForm.province} {shippingForm.postalCode}
                        </p>
                      </div>
                      <button
                        onClick={() => setCurrentStep('shipping')}
                        className="text-sm text-primary hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id}>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">{method.name}</h3>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {method.options.map((option) => (
                            <label
                              key={option.id}
                              className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedPayment === option.id ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground'
                              }`}
                            >
                              <input
                                type="radio"
                                name="payment"
                                value={option.id}
                                checked={selectedPayment === option.id}
                                onChange={() => setSelectedPayment(option.id)}
                                className="w-4 h-4 text-primary"
                              />
                              <span className="text-xl">{option.icon}</span>
                              <span className="font-medium">{option.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="lg"
                    className="w-full mt-6"
                    onClick={handlePaymentSubmit}
                    disabled={!selectedPayment || isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay {formatPrice(total)}
                        <Lock className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-background rounded-xl p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                  {items.map((item) => {
                    const price = item.product.sale_price ?? item.product.base_price
                    const adjustedPrice = price + item.variant.price_adjustment

                    return (
                      <div key={item.variantId} className="flex gap-3">
                        <div className="w-16 h-20 bg-muted rounded-lg flex-shrink-0 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />
                          <span className="absolute bottom-1 right-1 bg-background/80 text-xs px-1.5 rounded">
                            x{item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.variant.color} / {item.variant.size}
                          </p>
                          <p className="text-sm font-semibold mt-1">
                            {formatPrice(adjustedPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Coupon Code */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button variant="outline" size="sm">
                    Apply
                  </Button>
                </div>

                {/* Totals */}
                <div className="space-y-2 py-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={qualifiesForFreeShipping && selectedShipping === 'regular' ? 'text-green-600' : ''}>
                      {qualifiesForFreeShipping && selectedShipping === 'regular' ? 'FREE' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">{formatPrice(total)}</span>
                </div>

                {/* Free shipping progress */}
                {!qualifiesForFreeShipping && (
                  <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                    <p className="text-sm">
                      Add <span className="font-semibold text-primary">{formatPrice(amountToFreeShipping)}</span> more for free shipping!
                    </p>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(subtotal / freeShippingThreshold) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Trust badges */}
                <div className="mt-6 pt-4 border-t flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    Secure
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="h-4 w-4" />
                    Encrypted
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
