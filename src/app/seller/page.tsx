'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Package,
  ShoppingCart,
  Wallet,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Bell,
  BarChart3,
} from 'lucide-react'
import { formatPrice } from '@/stores/cart'

// Mock stats (replaced by real data when DB is connected)
const defaultStats = {
  totalProducts: 24,
  totalOrders: 156,
  totalRevenue: 89400000,
  totalSettled: 72000000,
  pendingSettlement: 17400000,
  pendingNotifications: 3,
}

export default function SellerDashboard() {
  const [stats] = useState(defaultStats)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Selamat Datang, Seller!</h1>
          <p className="text-sm text-muted-foreground mt-1">Ringkasan performa toko Anda</p>
        </div>
        <Link href="/seller/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90">
          <Package className="h-4 w-4" /> Tambah Produk
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Produk Aktif" value={stats.totalProducts.toString()} icon={Package} color="text-blue-600" />
        <StatCard title="Total Pesanan" value={stats.totalOrders.toString()} icon={ShoppingCart} color="text-green-600" />
        <StatCard title="Total Pendapatan" value={formatPrice(stats.totalRevenue)} icon={DollarSign} color="text-emerald-600" />
        <StatCard title="Saldo Pending" value={formatPrice(stats.pendingSettlement)} icon={Wallet} color="text-orange-600" />
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-background rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" /> Analisis Penjualan
          </h2>
          <Link href="/seller/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
            Lihat Semua <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Simple bar chart with CSS */}
        <div className="grid grid-cols-7 gap-2 items-end h-40">
          {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, i) => {
            const heights = [60, 45, 80, 55, 90, 100, 70]
            return (
              <div key={day} className="flex flex-col items-center gap-1">
                <div
                  className="w-full bg-primary/20 rounded-t-md relative overflow-hidden"
                  style={{ height: `${heights[i]}%` }}
                >
                  <div className="absolute bottom-0 w-full bg-primary rounded-t-md" style={{ height: `${heights[i] * 0.7}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{day}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/seller/products" className="bg-background rounded-xl border p-6 hover:border-primary transition-colors">
          <Package className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="font-semibold">Kelola Produk</h3>
          <p className="text-sm text-muted-foreground mt-1">Tambah, edit, atau upload produk CSV</p>
        </Link>
        <Link href="/seller/orders" className="bg-background rounded-xl border p-6 hover:border-primary transition-colors">
          <ShoppingCart className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="font-semibold">Pesanan Masuk</h3>
          <p className="text-sm text-muted-foreground mt-1">Proses dan kirim pesanan pelanggan</p>
        </Link>
        <Link href="/seller/settlements" className="bg-background rounded-xl border p-6 hover:border-primary transition-colors">
          <Wallet className="h-8 w-8 text-orange-600 mb-3" />
          <h3 className="font-semibold">Settlement</h3>
          <p className="text-sm text-muted-foreground mt-1">Lihat saldo dan riwayat pencairan</p>
        </Link>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string; icon: any; color: string }) {
  return (
    <div className="bg-background rounded-xl border p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{title}</span>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
