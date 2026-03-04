'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Clock,
  AlertCircle,
  Tag,
} from 'lucide-react'
import { formatPrice } from '@/stores/cart'

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  totalProducts: number
  totalResellers: number
  pendingResellers: number
}

// Mock stats for dashboard
const mockStats: DashboardStats = {
  totalOrders: 1284,
  pendingOrders: 23,
  totalRevenue: 892400000,
  totalProducts: 156,
  totalResellers: 48,
  pendingResellers: 5,
}

const recentOrders = [
  { id: 'UC-A1B2C3D4', customer: 'Siti Rahma', total: 498000, status: 'paid', date: '2 min ago' },
  { id: 'UC-E5F6G7H8', customer: 'Budi Santoso', total: 1247000, status: 'processing', date: '15 min ago' },
  { id: 'UC-I9J0K1L2', customer: 'Dewi Lestari', total: 329000, status: 'shipped', date: '1 hour ago' },
  { id: 'UC-M3N4O5P6', customer: 'Ahmad Fauzi', total: 756000, status: 'pending', date: '2 hours ago' },
  { id: 'UC-Q7R8S9T0', customer: 'Nina Putri', total: 189000, status: 'delivered', date: '3 hours ago' },
]

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminDashboard() {
  const [stats] = useState<DashboardStats>(mockStats)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon={DollarSign}
          trend="+12.5%"
          color="text-green-600"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          trend="+8.2%"
          badge={stats.pendingOrders > 0 ? `${stats.pendingOrders} pending` : undefined}
        />
        <StatCard
          title="Products"
          value={stats.totalProducts.toString()}
          icon={Package}
          color="text-blue-600"
        />
        <StatCard
          title="Resellers"
          value={stats.totalResellers.toString()}
          icon={Users}
          badge={stats.pendingResellers > 0 ? `${stats.pendingResellers} pending` : undefined}
          color="text-purple-600"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-background rounded-xl border">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-muted-foreground">
                <th className="px-6 py-3 font-medium">Order</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-6 py-4 font-mono text-sm">{order.id}</td>
                  <td className="px-6 py-4 text-sm">{order.customer}</td>
                  <td className="px-6 py-4 text-sm font-medium">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickAction
          href="/admin/orders"
          icon={Clock}
          title="Pending Orders"
          description={`${stats.pendingOrders} orders awaiting processing`}
          color="text-yellow-600 bg-yellow-50"
        />
        <QuickAction
          href="/admin/resellers"
          icon={AlertCircle}
          title="Reseller Applications"
          description={`${stats.pendingResellers} applications to review`}
          color="text-purple-600 bg-purple-50"
        />
        <QuickAction
          href="/admin/deals"
          icon={Tag}
          title="Manage Deals"
          description="Create daily deals and flash sales"
          color="text-blue-600 bg-blue-50"
        />
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  badge,
  color = 'text-foreground',
}: {
  title: string
  value: string
  icon: any
  trend?: string
  badge?: string
  color?: string
}) {
  return (
    <div className="bg-background rounded-xl border p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{title}</span>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center gap-2 mt-1">
        {trend && (
          <span className="text-xs text-green-600 flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" /> {trend}
          </span>
        )}
        {badge && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
    </div>
  )
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
  color,
}: {
  href: string
  icon: any
  title: string
  description: string
  color: string
}) {
  return (
    <Link href={href} className="bg-background rounded-xl border p-6 hover:border-primary transition-colors">
      <div className={`inline-flex p-2 rounded-lg ${color} mb-3`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </Link>
  )
}
