'use client'

import { useState } from 'react'
import { Package, MapPin, CheckCircle, Circle, ClipboardList, Box, Printer, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFulfillmentStore, FulfillmentOrder, FulfillmentItem, courierNames } from '@/stores/fulfillment'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

interface PickItemProps {
  item: FulfillmentItem
  onPick: () => void
}

function PickItem({ item, onPick }: PickItemProps) {
  const { language } = useTranslation()

  return (
    <div className={`p-3 border rounded-lg ${item.picked ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={onPick}
          disabled={item.picked}
          className={`mt-0.5 ${item.picked ? 'text-green-600' : 'text-muted-foreground hover:text-primary'}`}
        >
          {item.picked ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`font-medium ${item.picked ? 'line-through text-muted-foreground' : ''}`}>
            {item.productName}
          </p>
          <p className="text-sm text-muted-foreground">
            SKU: {item.sku} • Qty: {item.quantity}
          </p>
          <div className="flex items-center gap-2 mt-1 text-sm">
            <MapPin className="h-3 w-3 text-primary" />
            <span className="font-mono font-semibold text-primary">{item.rackLocation}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{item.partnerName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface OrderPickPackProps {
  order: FulfillmentOrder
  onComplete: () => void
}

function OrderPickPack({ order, onComplete }: OrderPickPackProps) {
  const { language } = useTranslation()
  const { markItemPicked, markAllItemsPicked, completeQC, completePacking } = useFulfillmentStore()
  const [expanded, setExpanded] = useState(true)
  const [qcNote, setQcNote] = useState('')

  const pickedCount = order.items.filter((i) => i.picked).length
  const allPicked = pickedCount === order.items.length
  const isQC = order.status === 'qc'
  const isPacking = order.status === 'packing'

  const handlePickAll = () => {
    markAllItemsPicked(order.id)
    toast.success(language === 'id' ? 'Semua item sudah dipick!' : 'All items picked!')
  }

  const handlePassQC = () => {
    completeQC(order.id, true)
    toast.success(language === 'id' ? 'QC passed, lanjut packing!' : 'QC passed, proceed to packing!')
  }

  const handleFailQC = () => {
    if (!qcNote.trim()) {
      toast.error(language === 'id' ? 'Masukkan catatan QC!' : 'Enter QC note!')
      return
    }
    completeQC(order.id, false, qcNote)
    toast.error(language === 'id' ? 'QC gagal, order dikembalikan' : 'QC failed, order returned')
  }

  const handleCompletePacking = () => {
    completePacking(order.id, 'Staff') // In real app, this would be the logged-in user
    toast.success(language === 'id' ? 'Packing selesai, siap kirim!' : 'Packing complete, ready to ship!')
    onComplete()
  }

  return (
    <div className="bg-background border rounded-xl overflow-hidden">
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              order.status === 'pending' || order.status === 'picking'
                ? 'bg-amber-100 text-amber-700'
                : order.status === 'qc'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {order.status === 'pending' || order.status === 'picking' ? (
                <ClipboardList className="h-5 w-5" />
              ) : order.status === 'qc' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <Box className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="font-mono font-semibold">{order.orderNumber}</p>
              <p className="text-sm text-muted-foreground">
                {order.customerName} • {order.customerCity}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {pickedCount}/{order.items.length}
            </span>
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {expanded && (
        <div className="px-4 pb-4 border-t">
          {/* Picking Phase */}
          {(order.status === 'pending' || order.status === 'picking') && (
            <>
              <div className="py-3 space-y-2">
                {order.items.map((item) => (
                  <PickItem
                    key={item.productId}
                    item={item}
                    onPick={() => markItemPicked(order.id, item.productId)}
                  />
                ))}
              </div>
              <Button
                onClick={handlePickAll}
                disabled={allPicked}
                className="w-full"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {allPicked
                  ? (language === 'id' ? 'Semua Sudah Dipick' : 'All Picked')
                  : (language === 'id' ? 'Selesai Pick → QC' : 'Complete Pick → QC')
                }
              </Button>
            </>
          )}

          {/* QC Phase */}
          {isQC && (
            <div className="py-3 space-y-3">
              <p className="text-sm text-muted-foreground">
                {language === 'id'
                  ? 'Periksa semua item sebelum packing:'
                  : 'Check all items before packing:'
                }
              </p>
              <ul className="text-sm space-y-1">
                {order.items.map((item) => (
                  <li key={item.productId} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {item.productName} ({item.quantity}x)
                  </li>
                ))}
              </ul>

              <div>
                <label className="text-sm font-medium block mb-1">
                  {language === 'id' ? 'Catatan QC (jika ada masalah)' : 'QC Note (if any issues)'}
                </label>
                <textarea
                  value={qcNote}
                  onChange={(e) => setQcNote(e.target.value)}
                  placeholder={language === 'id' ? 'Catatan...' : 'Notes...'}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleFailQC} className="flex-1">
                  {language === 'id' ? 'QC Gagal' : 'QC Failed'}
                </Button>
                <Button onClick={handlePassQC} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {language === 'id' ? 'QC Passed → Pack' : 'QC Passed → Pack'}
                </Button>
              </div>
            </div>
          )}

          {/* Packing Phase */}
          {isPacking && (
            <div className="py-3 space-y-3">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm font-medium mb-2">
                  {language === 'id' ? 'Detail Pengiriman' : 'Shipping Details'}
                </p>
                <div className="text-sm space-y-1">
                  <p><span className="text-muted-foreground">{language === 'id' ? 'Kurir:' : 'Courier:'}</span> {courierNames[order.courier]} {order.shippingService}</p>
                  <p><span className="text-muted-foreground">{language === 'id' ? 'Berat:' : 'Weight:'}</span> {order.weight}g</p>
                  <p><span className="text-muted-foreground">{language === 'id' ? 'Alamat:' : 'Address:'}</span> {order.customerAddress}, {order.customerCity}</p>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <p className="text-sm font-medium mb-1">
                  {language === 'id' ? 'Checklist Packing' : 'Packing Checklist'}
                </p>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    {language === 'id' ? 'Produk sesuai order' : 'Products match order'}
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    {language === 'id' ? 'Bubble wrap / packing aman' : 'Bubble wrap / safe packing'}
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    {language === 'id' ? 'Thank you card' : 'Thank you card'}
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    {language === 'id' ? 'Label pengiriman' : 'Shipping label'}
                  </li>
                </ul>
              </div>

              <Button onClick={handleCompletePacking} className="w-full">
                <Box className="h-4 w-4 mr-2" />
                {language === 'id' ? 'Selesai Packing → Siap Kirim' : 'Complete Packing → Ready'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function PickPack() {
  const { language } = useTranslation()
  const { orders } = useFulfillmentStore()

  // Orders that need picking or packing
  const pickPackOrders = orders.filter((o) =>
    ['pending', 'picking', 'qc', 'packing'].includes(o.status)
  )

  // Sort by priority then by status (pending first)
  const statusOrder = { pending: 0, picking: 1, qc: 2, packing: 3 }
  const priorityOrder = { same_day: 0, express: 1, normal: 2 }
  pickPackOrders.sort((a, b) => {
    const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
    if (pDiff !== 0) return pDiff
    return (statusOrder[a.status as keyof typeof statusOrder] || 99) - (statusOrder[b.status as keyof typeof statusOrder] || 99)
  })

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-amber-600">
            {orders.filter((o) => o.status === 'pending').length}
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            {language === 'id' ? 'Pending' : 'Pending'}
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {orders.filter((o) => o.status === 'picking').length}
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-400">
            {language === 'id' ? 'Picking' : 'Picking'}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {orders.filter((o) => o.status === 'qc').length}
          </p>
          <p className="text-xs text-purple-700 dark:text-purple-400">QC</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-indigo-600">
            {orders.filter((o) => o.status === 'packing').length}
          </p>
          <p className="text-xs text-indigo-700 dark:text-indigo-400">
            {language === 'id' ? 'Packing' : 'Packing'}
          </p>
        </div>
      </div>

      {/* Pick/Pack List */}
      {pickPackOrders.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>{language === 'id' ? 'Tidak ada order untuk diproses' : 'No orders to process'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pickPackOrders.map((order) => (
            <OrderPickPack
              key={order.id}
              order={order}
              onComplete={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  )
}
