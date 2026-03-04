'use client'

import { useState } from 'react'
import { Search, Plus, Edit2, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/stores/cart'

interface ProductRow {
  id: string
  name: string
  slug: string
  category: string
  basePrice: number
  salePrice: number | null
  stock: number
  totalSold: number
  rating: number
  isActive: boolean
  isFeatured: boolean
}

const mockProducts: ProductRow[] = [
  { id: '1', name: 'Oversized Cotton Tee', slug: 'oversized-cotton-tee', category: 'Women - Tops', basePrice: 249000, salePrice: 199000, stock: 150, totalSold: 1250, rating: 4.8, isActive: true, isFeatured: true },
  { id: '2', name: 'High Waist Wide Leg Jeans', slug: 'high-waist-wide-leg-jeans', category: 'Women - Bottoms', basePrice: 449000, salePrice: null, stock: 85, totalSold: 890, rating: 4.6, isActive: true, isFeatured: false },
  { id: '3', name: 'Floral Midi Dress', slug: 'floral-midi-dress', category: 'Women - Dresses', basePrice: 499000, salePrice: 399000, stock: 60, totalSold: 2100, rating: 4.9, isActive: true, isFeatured: true },
  { id: '4', name: 'Cropped Cardigan', slug: 'cropped-cardigan', category: 'Women - Outerwear', basePrice: 449000, salePrice: 349000, stock: 45, totalSold: 678, rating: 4.7, isActive: true, isFeatured: false },
  { id: '5', name: 'Linen Blazer', slug: 'linen-blazer', category: 'Women - Outerwear', basePrice: 749000, salePrice: 599000, stock: 30, totalSold: 345, rating: 4.8, isActive: true, isFeatured: false },
  { id: '6', name: 'Vintage Denim Jacket', slug: 'vintage-denim-jacket', category: 'Men - Outerwear', basePrice: 549000, salePrice: null, stock: 0, totalSold: 456, rating: 4.7, isActive: false, isFeatured: false },
  { id: '7', name: 'Ribbed Tank Top', slug: 'ribbed-tank-top', category: 'Women - Tops', basePrice: 149000, salePrice: null, stock: 200, totalSold: 1890, rating: 4.4, isActive: true, isFeatured: false },
  { id: '8', name: 'Canvas Tote Bag', slug: 'canvas-tote-bag', category: 'Accessories', basePrice: 199000, salePrice: null, stock: 120, totalSold: 678, rating: 4.6, isActive: true, isFeatured: true },
]

export default function AdminProductsPage() {
  const [search, setSearch] = useState('')
  const [products] = useState<ProductRow[]>(mockProducts)

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Total Products</div>
          <div className="text-2xl font-bold">{products.length}</div>
        </div>
        <div className="bg-background rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Active</div>
          <div className="text-2xl font-bold text-green-600">{products.filter(p => p.isActive).length}</div>
        </div>
        <div className="bg-background rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Out of Stock</div>
          <div className="text-2xl font-bold text-red-600">{products.filter(p => p.stock === 0).length}</div>
        </div>
        <div className="bg-background rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">On Sale</div>
          <div className="text-2xl font-bold text-orange-600">{products.filter(p => p.salePrice !== null).length}</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search products..."
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
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Stock</th>
              <th className="px-6 py-3 font-medium">Sold</th>
              <th className="px-6 py-3 font-medium">Rating</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-xs">
                      {product.isFeatured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                    </div>
                    <span className="text-sm font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{product.category}</td>
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
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-muted rounded-lg" title="Edit">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 hover:bg-muted rounded-lg" title={product.isActive ? 'Deactivate' : 'Activate'}>
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
