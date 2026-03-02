import Link from 'next/link'
import { ChevronLeft, Package, Truck, CheckCircle, MapPin, CreditCard, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/stores/cart'

// Mock order detail
const mockOrder = {
  id: 'UC-12345678',
  date: '2026-02-28',
  status: 'shipped',
  subtotal: 598000,
  shipping: 0,
  discount: 0,
  total: 598000,
  payment_method: 'GoPay',
  tracking: 'JNE1234567890',
  shipping_address: {
    name: 'Sarah Johnson',
    phone: '081234567890',
    address: 'Jl. Sudirman No. 123, Apt 4B',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    postal_code: '12190',
  },
  items: [
    { name: 'Oversized Cotton T-Shirt', variant: 'Black / M', quantity: 2, price: 199000, image: null },
    { name: 'High-Waist Wide Leg Pants', variant: 'Beige / S', quantity: 1, price: 299000, image: null },
  ],
  timeline: [
    { status: 'Order Placed', date: '2026-02-28 10:30', completed: true },
    { status: 'Payment Confirmed', date: '2026-02-28 10:32', completed: true },
    { status: 'Processing', date: '2026-02-28 14:00', completed: true },
    { status: 'Shipped', date: '2026-03-01 09:15', completed: true },
    { status: 'Delivered', date: null, completed: false },
  ],
}

export default function OrderDetailPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-background rounded-xl p-6">
        <Link href="/account/orders" className="inline-flex items-center text-sm text-primary hover:underline mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{mockOrder.id}</h1>
            <p className="text-muted-foreground">Placed on {mockOrder.date}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy Order ID
            </Button>
            <Button variant="outline" size="sm">
              Need Help?
            </Button>
          </div>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="bg-background rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-6">Order Status</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />
          <div className="space-y-6">
            {mockOrder.timeline.map((step, index) => (
              <div key={index} className="flex gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                  step.completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step.completed ? <CheckCircle className="h-4 w-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                </div>
                <div className="flex-1 pb-2">
                  <p className={`font-medium ${!step.completed && 'text-muted-foreground'}`}>{step.status}</p>
                  {step.date && <p className="text-sm text-muted-foreground">{step.date}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {mockOrder.tracking && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Tracking Number</p>
                <p className="font-mono font-medium">{mockOrder.tracking}</p>
              </div>
            </div>
            <Button size="sm">Track Package</Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 bg-background rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Items ({mockOrder.items.length})</h2>
          <div className="space-y-4">
            {mockOrder.items.map((item, index) => (
              <div key={index} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-20 h-24 bg-muted rounded-lg flex-shrink-0 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.variant}</p>
                  <p className="text-sm mt-1">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  <p className="text-sm text-muted-foreground">{formatPrice(item.price)} each</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-2">
            <Button variant="outline" className="flex-1">Buy Again</Button>
            <Button variant="outline" className="flex-1">Write Review</Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-background rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(mockOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className={mockOrder.shipping === 0 ? 'text-green-600' : ''}>
                  {mockOrder.shipping === 0 ? 'FREE' : formatPrice(mockOrder.shipping)}
                </span>
              </div>
              {mockOrder.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(mockOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-3 border-t">
                <span>Total</span>
                <span>{formatPrice(mockOrder.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Address
            </h2>
            <div className="text-sm space-y-1">
              <p className="font-medium">{mockOrder.shipping_address.name}</p>
              <p className="text-muted-foreground">{mockOrder.shipping_address.phone}</p>
              <p className="text-muted-foreground">{mockOrder.shipping_address.address}</p>
              <p className="text-muted-foreground">
                {mockOrder.shipping_address.city}, {mockOrder.shipping_address.province} {mockOrder.shipping_address.postal_code}
              </p>
            </div>
          </div>

          <div className="bg-background rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment
            </h2>
            <p className="text-sm">{mockOrder.payment_method}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
