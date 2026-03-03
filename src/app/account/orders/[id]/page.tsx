'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, Package, MapPin, CreditCard, Copy, MessageCircle, RotateCcw, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/stores/cart'
import { useOrdersStore, Order, formatOrderDate } from '@/stores/orders'
import { useTranslation } from '@/stores/language'
import { OrderTimeline, OrderStatusBadge, CourierInfo } from '@/components/orders'
import { toast } from 'sonner'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { language } = useTranslation()
  const { getOrderById } = useOrdersStore()
  const [order, setOrder] = useState<Order | undefined>(undefined)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (params.id) {
      const foundOrder = getOrderById(params.id as string)
      setOrder(foundOrder)
    }
  }, [params.id, getOrderById])

  const handleCopyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.id)
      toast.success(language === 'id' ? 'ID Pesanan disalin' : 'Order ID copied')
    }
  }

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-muted rounded-xl h-32" />
        <div className="bg-muted rounded-xl h-64" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-muted rounded-xl h-48" />
          <div className="bg-muted rounded-xl h-48" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="bg-background rounded-xl p-12 text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          {language === 'id' ? 'Pesanan tidak ditemukan' : 'Order not found'}
        </h2>
        <p className="text-muted-foreground mb-6">
          {language === 'id'
            ? 'Pesanan yang Anda cari tidak ada atau telah dihapus.'
            : 'The order you are looking for does not exist or has been removed.'}
        </p>
        <Button onClick={() => router.push('/account/orders')}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          {language === 'id' ? 'Kembali ke Pesanan' : 'Back to Orders'}
        </Button>
      </div>
    )
  }

  const canReview = order.status === 'delivered'
  const canReturn = order.status === 'delivered' && order.deliveredAt &&
    (Date.now() - order.deliveredAt) < 7 * 24 * 60 * 60 * 1000 // 7 days

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-background rounded-xl p-6">
        <Link href="/account/orders" className="inline-flex items-center text-sm text-primary hover:underline mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          {language === 'id' ? 'Kembali ke Pesanan' : 'Back to Orders'}
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">{order.id}</h1>
              <OrderStatusBadge status={order.status} size="lg" />
            </div>
            <p className="text-muted-foreground">
              {language === 'id' ? 'Dipesan pada' : 'Placed on'} {formatOrderDate(order.createdAt, language === 'id' ? 'id' : 'en')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyOrderId}>
              <Copy className="h-4 w-4 mr-2" />
              {language === 'id' ? 'Salin ID' : 'Copy ID'}
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              {language === 'id' ? 'Bantuan' : 'Help'}
            </Button>
          </div>
        </div>
      </div>

      {/* Order Status & Courier */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="bg-background rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-6">
            {language === 'id' ? 'Status Pesanan' : 'Order Status'}
          </h2>
          <OrderTimeline events={order.trackingEvents} />
        </div>

        {/* Courier Info */}
        {order.courier && (
          <div className="bg-background rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">
              {language === 'id' ? 'Informasi Pengiriman' : 'Shipping Information'}
            </h2>
            <CourierInfo
              courier={order.courier}
              showDriver={order.status === 'out_for_delivery'}
            />
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 bg-background rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            {language === 'id' ? 'Barang' : 'Items'} ({order.items.length})
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-20 h-24 bg-muted rounded-lg flex-shrink-0 relative overflow-hidden">
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
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {language === 'id' && item.nameId ? item.nameId : item.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.variant}</p>
                  <p className="text-sm mt-1">
                    {language === 'id' ? 'Jumlah:' : 'Qty:'} {item.quantity}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  <p className="text-sm text-muted-foreground">{formatPrice(item.price)} {language === 'id' ? '/pcs' : 'each'}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-2">
            <Button variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              {language === 'id' ? 'Beli Lagi' : 'Buy Again'}
            </Button>
            {canReview && (
              <Button variant="outline" className="flex-1">
                <Star className="h-4 w-4 mr-2" />
                {language === 'id' ? 'Tulis Ulasan' : 'Write Review'}
              </Button>
            )}
            {canReturn && (
              <Button variant="outline" className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                {language === 'id' ? 'Ajukan Pengembalian' : 'Request Return'}
              </Button>
            )}
          </div>
        </div>

        {/* Order Summary & Info */}
        <div className="space-y-6">
          <div className="bg-background rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">
              {language === 'id' ? 'Ringkasan Pesanan' : 'Order Summary'}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {language === 'id' ? 'Ongkir' : 'Shipping'}
                </span>
                <span className={order.shippingCost === 0 ? 'text-green-600' : ''}>
                  {order.shippingCost === 0 ? 'GRATIS' : formatPrice(order.shippingCost)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>{language === 'id' ? 'Diskon' : 'Discount'}</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-3 border-t">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {language === 'id' ? 'Alamat Pengiriman' : 'Shipping Address'}
            </h2>
            <div className="text-sm space-y-1">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
              <p className="text-muted-foreground">{order.shippingAddress.address}</p>
              <p className="text-muted-foreground">
                {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
              </p>
              {order.shippingAddress.notes && (
                <p className="text-muted-foreground italic mt-2">
                  {language === 'id' ? 'Catatan:' : 'Notes:'} {order.shippingAddress.notes}
                </p>
              )}
            </div>
          </div>

          <div className="bg-background rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {language === 'id' ? 'Pembayaran' : 'Payment'}
            </h2>
            <p className="text-sm font-medium">{order.paymentMethod}</p>
            {order.paidAt && (
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'id' ? 'Dibayar pada' : 'Paid on'} {formatOrderDate(order.paidAt, language === 'id' ? 'id' : 'en')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
