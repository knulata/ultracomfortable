'use client'

import { useState } from 'react'
import { Package, User, Hash, MapPin, Plus, Minus, CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIntakeStore } from '@/stores/intake'
import { usePartnerStore } from '@/stores/partner'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

const CATEGORIES = [
  'Gamis', 'Hijab', 'Tunik', 'Rok', 'Celana', 'Outer', 'Dress', 'Blouse', 'Kaftan', 'Set', 'Lainnya'
]

interface DropOffFormProps {
  onSuccess?: () => void
}

export function DropOffForm({ onSuccess }: DropOffFormProps) {
  const { language } = useTranslation()
  const { partners } = usePartnerStore()
  const { addItem } = useIntakeStore()

  const activePartners = partners.filter((p) => p.status === 'active')

  const [selectedPartner, setSelectedPartner] = useState('')
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [costPrice, setCostPrice] = useState('')
  const [rackLocation, setRackLocation] = useState('')
  const [description, setDescription] = useState('')
  const [hasVariants, setHasVariants] = useState(false)
  const [variants, setVariants] = useState<{ size: string; color: string; quantity: number }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const partner = activePartners.find((p) => p.id === selectedPartner)

  const addVariant = () => {
    setVariants([...variants, { size: '', color: '', quantity: 1 }])
  }

  const updateVariant = (index: number, field: string, value: string | number) => {
    setVariants(variants.map((v, i) =>
      i === index ? { ...v, [field]: value } : v
    ))
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const totalVariantQuantity = variants.reduce((sum, v) => sum + v.quantity, 0)

  const handleSubmit = async () => {
    if (!selectedPartner || !productName || !category || !costPrice) {
      toast.error(language === 'id' ? 'Lengkapi semua data wajib!' : 'Please fill all required fields!')
      return
    }

    if (hasVariants && variants.length === 0) {
      toast.error(language === 'id' ? 'Tambahkan minimal 1 varian!' : 'Add at least 1 variant!')
      return
    }

    setIsSubmitting(true)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 500))

    const finalQuantity = hasVariants ? totalVariantQuantity : quantity

    addItem({
      partnerId: partner!.id,
      partnerName: partner!.ownerName,
      shopName: partner!.shopName,
      productName,
      category,
      description,
      quantity: finalQuantity,
      costPrice: parseInt(costPrice),
      rackLocation,
      hasVariants,
      variants: hasVariants ? variants : undefined,
    })

    toast.success(
      language === 'id'
        ? `${productName} berhasil dicatat! (${finalQuantity} pcs)`
        : `${productName} recorded! (${finalQuantity} pcs)`
    )

    // Reset form
    setProductName('')
    setCategory('')
    setQuantity(1)
    setCostPrice('')
    setRackLocation('')
    setDescription('')
    setHasVariants(false)
    setVariants([])
    setIsSubmitting(false)

    onSuccess?.()
  }

  return (
    <div className="space-y-6">
      {/* Partner Selection */}
      <div>
        <label className="text-sm font-medium block mb-2">
          <User className="h-4 w-4 inline mr-2" />
          {language === 'id' ? 'Partner *' : 'Partner *'}
        </label>
        <select
          value={selectedPartner}
          onChange={(e) => setSelectedPartner(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">{language === 'id' ? 'Pilih Partner' : 'Select Partner'}</option>
          {activePartners.map((p) => (
            <option key={p.id} value={p.id}>
              {p.shopName} - {p.ownerName} ({p.shopAddress})
            </option>
          ))}
        </select>
      </div>

      {selectedPartner && (
        <>
          {/* Product Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">
                {language === 'id' ? 'Nama Produk *' : 'Product Name *'}
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder={language === 'id' ? 'Gamis Syari Premium' : 'Premium Syari Gamis'}
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                {language === 'id' ? 'Kategori *' : 'Category *'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{language === 'id' ? 'Pilih Kategori' : 'Select Category'}</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity & Price */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">
                {language === 'id' ? 'Harga Modal (per pcs) *' : 'Cost Price (per pc) *'}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                <input
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  placeholder="150000"
                  className="w-full pl-12 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {!hasVariants && (
              <div>
                <label className="text-sm font-medium block mb-1">
                  {language === 'id' ? 'Jumlah (pcs)' : 'Quantity (pcs)'}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-muted"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-muted"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Variants Toggle */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasVariants}
                onChange={(e) => {
                  setHasVariants(e.target.checked)
                  if (e.target.checked && variants.length === 0) {
                    addVariant()
                  }
                }}
                className="rounded"
              />
              <span className="text-sm font-medium">
                {language === 'id' ? 'Ada Varian (ukuran/warna)' : 'Has Variants (size/color)'}
              </span>
            </label>
          </div>

          {/* Variants */}
          {hasVariants && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {language === 'id' ? 'Daftar Varian' : 'Variant List'}
                </span>
                <span className="text-xs text-muted-foreground">
                  Total: {totalVariantQuantity} pcs
                </span>
              </div>

              {variants.map((variant, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={variant.size}
                    onChange={(e) => updateVariant(index, 'size', e.target.value)}
                    placeholder={language === 'id' ? 'Ukuran (M/L/XL)' : 'Size (M/L/XL)'}
                    className="flex-1 px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={variant.color}
                    onChange={(e) => updateVariant(index, 'color', e.target.value)}
                    placeholder={language === 'id' ? 'Warna' : 'Color'}
                    className="flex-1 px-3 py-2 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    value={variant.quantity}
                    onChange={(e) => updateVariant(index, 'quantity', parseInt(e.target.value) || 1)}
                    min={1}
                    className="w-16 px-3 py-2 border rounded-lg bg-background text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={() => removeVariant(index)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <Button variant="outline" size="sm" onClick={addVariant} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {language === 'id' ? 'Tambah Varian' : 'Add Variant'}
              </Button>
            </div>
          )}

          {/* Rack Location */}
          <div>
            <label className="text-sm font-medium block mb-1">
              <MapPin className="h-4 w-4 inline mr-2" />
              {language === 'id' ? 'Lokasi Rak (opsional)' : 'Rack Location (optional)'}
            </label>
            <input
              type="text"
              value={rackLocation}
              onChange={(e) => setRackLocation(e.target.value.toUpperCase())}
              placeholder="A-05-2"
              className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'id' ? 'Format: BARIS-RAK-POSISI (kosongkan untuk auto)' : 'Format: ROW-SHELF-POSITION (leave empty for auto)'}
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium block mb-1">
              {language === 'id' ? 'Catatan (opsional)' : 'Notes (optional)'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={language === 'id' ? 'Catatan tambahan...' : 'Additional notes...'}
              rows={2}
              className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Summary */}
          {productName && costPrice && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-medium mb-2">
                {language === 'id' ? 'Ringkasan' : 'Summary'}
              </h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === 'id' ? 'Produk' : 'Product'}</span>
                  <span>{productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === 'id' ? 'Jumlah' : 'Quantity'}</span>
                  <span>{hasVariants ? totalVariantQuantity : quantity} pcs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === 'id' ? 'Harga Modal' : 'Cost Price'}</span>
                  <span>{formatPrice(parseInt(costPrice) || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === 'id' ? 'Total Modal' : 'Total Cost'}</span>
                  <span className="font-semibold">
                    {formatPrice((parseInt(costPrice) || 0) * (hasVariants ? totalVariantQuantity : quantity))}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !productName || !category || !costPrice}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {language === 'id' ? 'Menyimpan...' : 'Saving...'}
              </span>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                {language === 'id' ? 'Catat Drop-Off' : 'Record Drop-Off'}
              </>
            )}
          </Button>
        </>
      )}
    </div>
  )
}
