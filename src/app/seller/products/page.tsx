'use client'

import { useState, useRef } from 'react'
import { Plus, Upload, Search, Edit2, Eye, EyeOff, Star, FileSpreadsheet, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/stores/cart'
import { toast } from 'sonner'

interface ProductRow {
  id: string
  name: string
  category: string
  basePrice: number
  salePrice: number | null
  stock: number
  variants: number
  totalSold: number
  rating: number
  isActive: boolean
}

// Mock data
const mockProducts: ProductRow[] = [
  { id: '1', name: 'Kaos Oversized Premium', category: 'Women - Tops', basePrice: 89000, salePrice: null, stock: 250, variants: 12, totalSold: 1890, rating: 4.8, isActive: true },
  { id: '2', name: 'Celana Kulot Linen', category: 'Women - Bottoms', basePrice: 125000, salePrice: 99000, stock: 180, variants: 8, totalSold: 1245, rating: 4.7, isActive: true },
  { id: '3', name: 'Dress Midi Bunga', category: 'Women - Dresses', basePrice: 159000, salePrice: 129000, stock: 95, variants: 6, totalSold: 876, rating: 4.9, isActive: true },
  { id: '4', name: 'Blazer Linen Crop', category: 'Women - Outerwear', basePrice: 189000, salePrice: null, stock: 0, variants: 4, totalSold: 456, rating: 4.6, isActive: false },
  { id: '5', name: 'Hijab Voal Premium', category: 'Accessories', basePrice: 49000, salePrice: 39000, stock: 500, variants: 20, totalSold: 3200, rating: 4.8, isActive: true },
]

interface CSVRow {
  name: string
  description: string
  category: string
  basePrice: number
  salePrice?: number
  sku: string
  sizes: string
  colors: string
  stockPerVariant: number
}

export default function SellerProductsPage() {
  const [products] = useState<ProductRow[]>(mockProducts)
  const [search, setSearch] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [csvData, setCsvData] = useState<CSVRow[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n').filter(l => l.trim())
      if (lines.length < 2) {
        toast.error('File CSV kosong atau tidak valid')
        return
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      const rows: CSVRow[] = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        const row: any = {}
        headers.forEach((h, idx) => {
          row[h] = values[idx] || ''
        })

        rows.push({
          name: row.name || row.nama || '',
          description: row.description || row.deskripsi || '',
          category: row.category || row.kategori || 'women',
          basePrice: parseInt(row.base_price || row.harga || '0'),
          salePrice: row.sale_price || row.harga_promo ? parseInt(row.sale_price || row.harga_promo) : undefined,
          sku: row.sku || row.kode || `SKU-${i}`,
          sizes: row.sizes || row.ukuran || 'S,M,L,XL',
          colors: row.colors || row.warna || 'Black,White',
          stockPerVariant: parseInt(row.stock || row.stok || '10'),
        })
      }

      setCsvData(rows.filter(r => r.name && r.basePrice > 0))
      setShowUpload(true)
      toast.success(`${rows.length} produk ditemukan dalam CSV`)
    }
    reader.readAsText(file)

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleBulkUpload = async () => {
    setIsUploading(true)
    // In production, call bulkCreateProducts server action
    await new Promise(r => setTimeout(r, 1500))
    toast.success(`${csvData.length} produk berhasil diupload!`)
    setCsvData([])
    setShowUpload(false)
    setIsUploading(false)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produk Saya</h1>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleCSVUpload}
          />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" /> Upload CSV
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" /> Tambah Produk
          </Button>
        </div>
      </div>

      {/* CSV Preview Modal */}
      {showUpload && csvData.length > 0 && (
        <div className="bg-background rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
              Preview Upload CSV ({csvData.length} produk)
            </h2>
            <button onClick={() => { setShowUpload(false); setCsvData([]) }}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="overflow-x-auto max-h-64">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Nama</th>
                  <th className="px-3 py-2 font-medium">Kategori</th>
                  <th className="px-3 py-2 font-medium">Harga</th>
                  <th className="px-3 py-2 font-medium">SKU</th>
                  <th className="px-3 py-2 font-medium">Ukuran</th>
                  <th className="px-3 py-2 font-medium">Warna</th>
                  <th className="px-3 py-2 font-medium">Stok</th>
                </tr>
              </thead>
              <tbody>
                {csvData.slice(0, 20).map((row, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="px-3 py-2 font-medium">{row.name}</td>
                    <td className="px-3 py-2">{row.category}</td>
                    <td className="px-3 py-2">{formatPrice(row.basePrice)}</td>
                    <td className="px-3 py-2 font-mono text-xs">{row.sku}</td>
                    <td className="px-3 py-2">{row.sizes}</td>
                    <td className="px-3 py-2">{row.colors}</td>
                    <td className="px-3 py-2">{row.stockPerVariant}/varian</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <Button onClick={handleBulkUpload} disabled={isUploading}>
              <Check className="h-4 w-4 mr-2" />
              {isUploading ? 'Mengupload...' : `Upload ${csvData.length} Produk`}
            </Button>
            <Button variant="outline" onClick={() => { setShowUpload(false); setCsvData([]) }}>
              Batal
            </Button>
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
            <strong>Format CSV:</strong> name, description, category, base_price, sale_price, sku, sizes, colors, stock<br />
            <strong>Contoh:</strong> Kaos Oversized,Kaos cotton premium,women,89000,,KOS-001,&quot;S,M,L,XL&quot;,&quot;Black,White&quot;,20
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Total Produk</div>
          <div className="text-2xl font-bold">{products.length}</div>
        </div>
        <div className="bg-background rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Aktif</div>
          <div className="text-2xl font-bold text-green-600">{products.filter(p => p.isActive).length}</div>
        </div>
        <div className="bg-background rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Stok Habis</div>
          <div className="text-2xl font-bold text-red-600">{products.filter(p => p.stock === 0).length}</div>
        </div>
        <div className="bg-background rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Total Terjual</div>
          <div className="text-2xl font-bold">{products.reduce((s, p) => s + p.totalSold, 0).toLocaleString()}</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Products Table */}
      <div className="bg-background rounded-xl border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-muted-foreground">
              <th className="px-6 py-3 font-medium">Produk</th>
              <th className="px-6 py-3 font-medium">Harga</th>
              <th className="px-6 py-3 font-medium">Stok</th>
              <th className="px-6 py-3 font-medium">Varian</th>
              <th className="px-6 py-3 font-medium">Terjual</th>
              <th className="px-6 py-3 font-medium">Rating</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium">{product.name}</div>
                  <div className="text-xs text-muted-foreground">{product.category}</div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {product.salePrice ? (
                    <div>
                      <span className="font-medium">{formatPrice(product.salePrice)}</span>
                      <span className="text-xs text-muted-foreground line-through ml-1">{formatPrice(product.basePrice)}</span>
                    </div>
                  ) : (
                    <span className="font-medium">{formatPrice(product.basePrice)}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 20 ? 'text-yellow-600' : ''}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{product.variants}</td>
                <td className="px-6 py-4 text-sm">{product.totalSold.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> {product.rating}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-muted rounded-lg" title="Edit"><Edit2 className="h-4 w-4" /></button>
                    <button className="p-1.5 hover:bg-muted rounded-lg" title={product.isActive ? 'Nonaktifkan' : 'Aktifkan'}>
                      {product.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
