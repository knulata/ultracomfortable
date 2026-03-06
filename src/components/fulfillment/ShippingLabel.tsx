'use client'

import { useState, useRef } from 'react'
import { Truck, Printer, Package, MapPin, Phone, User, QrCode, Copy, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFulfillmentStore, FulfillmentOrder, courierNames } from '@/stores/fulfillment'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

interface ShippingLabelCardProps {
  order: FulfillmentOrder
  onShip: () => void
}

function ShippingLabelCard({ order, onShip }: ShippingLabelCardProps) {
  const { language } = useTranslation()
  const [copied, setCopied] = useState(false)

  const copyAWB = () => {
    if (order.awbNumber) {
      navigator.clipboard.writeText(order.awbNumber)
      setCopied(true)
      toast.success(language === 'id' ? 'AWB disalin!' : 'AWB copied!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Shipping Label - ${order.orderNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: system-ui, -apple-system, sans-serif; padding: 10mm; }
            .label { border: 2px solid #000; padding: 16px; max-width: 400px; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 12px; }
            .logo { font-size: 24px; font-weight: bold; }
            .courier { font-size: 18px; font-weight: bold; text-align: right; }
            .courier-service { font-size: 12px; color: #666; }
            .awb { font-size: 20px; font-family: monospace; font-weight: bold; text-align: center; padding: 12px; background: #f0f0f0; margin-bottom: 12px; }
            .qr { width: 80px; height: 80px; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
            .section { margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #ddd; }
            .section-title { font-size: 10px; color: #666; text-transform: uppercase; margin-bottom: 4px; }
            .section-content { font-size: 12px; }
            .section-content strong { display: block; font-size: 14px; }
            .items { font-size: 11px; }
            .items li { margin-bottom: 4px; }
            .footer { display: flex; justify-content: space-between; font-size: 10px; color: #666; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="header">
              <div class="logo">UC</div>
              <div>
                <div class="courier">${courierNames[order.courier]}</div>
                <div class="courier-service">${order.shippingService}</div>
              </div>
            </div>

            <div class="awb">${order.awbNumber || 'AWB PENDING'}</div>

            <div class="qr">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="60" height="60">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="3" height="3"/>
                <rect x="18" y="14" width="3" height="3"/>
                <rect x="14" y="18" width="3" height="3"/>
                <rect x="18" y="18" width="3" height="3"/>
              </svg>
            </div>

            <div class="section">
              <div class="section-title">Penerima / Recipient</div>
              <div class="section-content">
                <strong>${order.customerName}</strong>
                ${order.customerPhone}<br>
                ${order.customerAddress}<br>
                ${order.customerCity}, ${order.customerProvince} ${order.customerPostalCode}
              </div>
            </div>

            <div class="section">
              <div class="section-title">Pengirim / Sender</div>
              <div class="section-content">
                <strong>UC Fulfillment</strong>
                Tanah Abang, Jakarta Pusat
              </div>
            </div>

            <div class="section">
              <div class="section-title">Isi Paket / Contents (${order.totalQuantity} pcs)</div>
              <ul class="items">
                ${order.items.map(item => `<li>${item.productName} (${item.quantity}x)</li>`).join('')}
              </ul>
            </div>

            <div class="footer">
              <span>Order: ${order.orderNumber}</span>
              <span>Weight: ${order.weight}g</span>
              <span>${new Date().toLocaleDateString('id-ID')}</span>
            </div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="bg-background border rounded-xl p-4">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="font-mono font-semibold">{order.orderNumber}</p>
          <p className="text-sm text-muted-foreground">
            {courierNames[order.courier]} {order.shippingService}
          </p>
        </div>
        <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">
          {language === 'id' ? 'Siap Kirim' : 'Ready'}
        </span>
      </div>

      {/* AWB */}
      <div className="bg-muted/50 rounded-lg p-3 mb-4">
        <p className="text-xs text-muted-foreground mb-1">AWB / Resi</p>
        <div className="flex items-center justify-between">
          <p className="font-mono font-bold text-lg">{order.awbNumber || '-'}</p>
          <button
            onClick={copyAWB}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {copied ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Recipient */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-start gap-2">
          <User className="h-4 w-4 text-muted-foreground mt-0.5" />
          <span>{order.customerName}</span>
        </div>
        <div className="flex items-start gap-2">
          <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
          <span>{order.customerPhone}</span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          <span>{order.customerAddress}, {order.customerCity}</span>
        </div>
      </div>

      {/* Items */}
      <div className="bg-muted/30 rounded-lg p-3 mb-4">
        <p className="text-xs text-muted-foreground mb-2">
          {order.totalQuantity} pcs • {order.weight}g
        </p>
        <ul className="text-sm space-y-1">
          {order.items.map((item) => (
            <li key={item.productId} className="flex justify-between">
              <span className="truncate">{item.productName}</span>
              <span className="text-muted-foreground">{item.quantity}x</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={handlePrint} className="flex-1">
          <Printer className="h-4 w-4 mr-2" />
          {language === 'id' ? 'Cetak Label' : 'Print Label'}
        </Button>
        <Button onClick={onShip} className="flex-1">
          <Truck className="h-4 w-4 mr-2" />
          {language === 'id' ? 'Tandai Dikirim' : 'Mark Shipped'}
        </Button>
      </div>
    </div>
  )
}

export function ShippingLabel() {
  const { language } = useTranslation()
  const { orders, markShipped } = useFulfillmentStore()

  // Orders ready to ship
  const readyOrders = orders.filter((o) => o.status === 'ready_to_ship')

  const handleShip = (order: FulfillmentOrder) => {
    markShipped(order.id)
    toast.success(
      language === 'id'
        ? `Order ${order.orderNumber} sudah dikirim!`
        : `Order ${order.orderNumber} shipped!`
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800">
        <div>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">{readyOrders.length}</p>
          <p className="text-sm text-green-600 dark:text-green-500">
            {language === 'id' ? 'Siap untuk dikirim' : 'Ready to ship'}
          </p>
        </div>
        <Truck className="h-8 w-8 text-green-600 dark:text-green-500" />
      </div>

      {/* Ready Orders */}
      {readyOrders.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>{language === 'id' ? 'Tidak ada order siap kirim' : 'No orders ready to ship'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {readyOrders.map((order) => (
            <ShippingLabelCard
              key={order.id}
              order={order}
              onShip={() => handleShip(order)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
