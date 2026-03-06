'use client'

import { useState, useRef } from 'react'
import { QrCode, Printer, Download, Package, MapPin, Tag, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIntakeStore, IntakeItem } from '@/stores/intake'
import { useTranslation } from '@/stores/language'

interface LabelProps {
  item: IntakeItem
  showQR?: boolean
}

function Label({ item, showQR = true }: LabelProps) {
  return (
    <div className="border-2 border-dashed border-gray-400 p-4 w-[300px] bg-white text-black">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-2">
        <div className="font-bold text-lg">UC</div>
        <div className="text-xs text-gray-600">{new Date().toLocaleDateString('id-ID')}</div>
      </div>

      {/* Main Content */}
      <div className="flex gap-3">
        {/* QR Code Placeholder */}
        {showQR && (
          <div className="w-20 h-20 border border-gray-300 flex items-center justify-center bg-gray-50">
            <QrCode className="h-16 w-16 text-gray-400" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 text-sm">
          <p className="font-bold text-base truncate">{item.sku}</p>
          <p className="truncate">{item.productName}</p>
          <p className="text-gray-600 truncate">{item.shopName}</p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-3 pt-2 border-t border-gray-300 grid grid-cols-3 gap-2 text-xs">
        <div>
          <span className="text-gray-500">Qty</span>
          <p className="font-bold">{item.quantity} pcs</p>
        </div>
        <div>
          <span className="text-gray-500">Rak</span>
          <p className="font-bold">{item.rackLocation}</p>
        </div>
        <div>
          <span className="text-gray-500">Cat</span>
          <p className="font-bold">{item.category}</p>
        </div>
      </div>

      {/* Variants */}
      {item.hasVariants && item.variants && item.variants.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-300">
          <p className="text-xs text-gray-500 mb-1">Varian:</p>
          <div className="flex flex-wrap gap-1">
            {item.variants.map((v, i) => (
              <span key={i} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                {v.size}/{v.color} ({v.quantity})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-gray-300 flex justify-between text-xs text-gray-500">
        <span>ID: {item.partnerId}</span>
        <span>{item.id}</span>
      </div>
    </div>
  )
}

export function InventoryLabel() {
  const { language } = useTranslation()
  const { items } = useIntakeStore()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const printRef = useRef<HTMLDivElement>(null)

  // Get items that need labels (recently dropped off or no photos yet)
  const recentItems = items
    .filter((item) => ['drop_off', 'pending_photo', 'photographing', 'editing'].includes(item.status))
    .slice(0, 20)

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selectedItems.length === recentItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(recentItems.map((i) => i.id))
    }
  }

  const handlePrint = () => {
    if (selectedItems.length === 0) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const selectedItemsData = items.filter((i) => selectedItems.includes(i.id))

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>UC Inventory Labels</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: system-ui, -apple-system, sans-serif; }
            .label {
              border: 2px dashed #888;
              padding: 16px;
              width: 300px;
              page-break-inside: avoid;
              margin-bottom: 16px;
            }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 8px; }
            .header .logo { font-weight: bold; font-size: 18px; }
            .header .date { font-size: 10px; color: #666; }
            .content { display: flex; gap: 12px; }
            .qr { width: 80px; height: 80px; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; background: #f9f9f9; }
            .qr svg { width: 64px; height: 64px; color: #999; }
            .info { flex: 1; font-size: 12px; }
            .info .sku { font-weight: bold; font-size: 14px; }
            .info .shop { color: #666; }
            .details { margin-top: 12px; padding-top: 8px; border-top: 1px solid #ddd; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 10px; }
            .details span { color: #666; }
            .details p { font-weight: bold; }
            .variants { margin-top: 8px; padding-top: 8px; border-top: 1px solid #ddd; font-size: 10px; }
            .variants span { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; margin-right: 4px; }
            .footer { margin-top: 12px; padding-top: 8px; border-top: 1px solid #ddd; display: flex; justify-content: space-between; font-size: 10px; color: #666; }
            @media print {
              .label { margin: 10mm; }
            }
          </style>
        </head>
        <body>
          ${selectedItemsData.map((item) => `
            <div class="label">
              <div class="header">
                <div class="logo">UC</div>
                <div class="date">${new Date().toLocaleDateString('id-ID')}</div>
              </div>
              <div class="content">
                <div class="qr">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="3" height="3"/>
                    <rect x="18" y="14" width="3" height="3"/>
                    <rect x="14" y="18" width="3" height="3"/>
                    <rect x="18" y="18" width="3" height="3"/>
                  </svg>
                </div>
                <div class="info">
                  <p class="sku">${item.sku}</p>
                  <p>${item.productName}</p>
                  <p class="shop">${item.shopName}</p>
                </div>
              </div>
              <div class="details">
                <div><span>Qty</span><p>${item.quantity} pcs</p></div>
                <div><span>Rak</span><p>${item.rackLocation}</p></div>
                <div><span>Cat</span><p>${item.category}</p></div>
              </div>
              ${item.hasVariants && item.variants ? `
                <div class="variants">
                  <p style="color: #666; margin-bottom: 4px;">Varian:</p>
                  ${item.variants.map((v) => `<span>${v.size}/${v.color} (${v.quantity})</span>`).join('')}
                </div>
              ` : ''}
              <div class="footer">
                <span>ID: ${item.partnerId}</span>
                <span>${item.id}</span>
              </div>
            </div>
          `).join('')}
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            {language === 'id' ? 'Label Inventori' : 'Inventory Labels'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === 'id'
              ? 'Cetak label dengan QR code untuk produk'
              : 'Print labels with QR codes for products'
            }
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={selectAll}
          >
            {selectedItems.length === recentItems.length
              ? (language === 'id' ? 'Batal Pilih' : 'Deselect All')
              : (language === 'id' ? 'Pilih Semua' : 'Select All')
            }
          </Button>
          <Button
            size="sm"
            onClick={handlePrint}
            disabled={selectedItems.length === 0}
          >
            <Printer className="h-4 w-4 mr-2" />
            {language === 'id' ? 'Cetak' : 'Print'} ({selectedItems.length})
          </Button>
        </div>
      </div>

      {/* Item Selection */}
      {recentItems.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>{language === 'id' ? 'Tidak ada produk untuk dicetak' : 'No products to print'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recentItems.map((item) => (
            <label
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedItems.includes(item.id)
                  ? 'bg-primary/5 border-primary'
                  : 'hover:bg-muted/50'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
                className="rounded"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium">{item.sku}</span>
                  <span className="text-xs px-1.5 py-0.5 bg-muted rounded">{item.category}</span>
                </div>
                <p className="text-sm truncate">{item.productName}</p>
                <p className="text-xs text-muted-foreground">
                  {item.shopName} • {item.quantity} pcs • {item.rackLocation}
                </p>
              </div>
            </label>
          ))}
        </div>
      )}

      {/* Preview */}
      {selectedItems.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">
            {language === 'id' ? 'Preview Label' : 'Label Preview'}
          </h4>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4" ref={printRef}>
              {items
                .filter((i) => selectedItems.includes(i.id))
                .slice(0, 3)
                .map((item) => (
                  <Label key={item.id} item={item} />
                ))
              }
              {selectedItems.length > 3 && (
                <div className="w-[300px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-muted-foreground">
                  +{selectedItems.length - 3} {language === 'id' ? 'label lainnya' : 'more labels'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
