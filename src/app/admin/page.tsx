'use client'

import {
  AdminStats,
  QuickActions,
  PartnerQueue,
  OrderMonitor,
  PayoutQueue,
  InventoryAlerts,
} from '@/components/admin'
import { useTranslation } from '@/stores/language'

export default function AdminDashboard() {
  const { language } = useTranslation()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">
          {language === 'id' ? 'Dashboard Admin' : 'Admin Dashboard'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'id'
            ? 'Selamat datang! Berikut ringkasan operasional hari ini.'
            : "Welcome back! Here's today's operational overview."}
        </p>
      </div>

      {/* Stats Overview */}
      <AdminStats />

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Partner Approval Queue */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              {language === 'id' ? 'Partner Baru' : 'New Partners'}
            </h2>
            <PartnerQueue />
          </div>

          {/* Payout Queue */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              {language === 'id' ? 'Antrian Payout' : 'Payout Queue'}
            </h2>
            <PayoutQueue />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Order Monitor */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              {language === 'id' ? 'Monitor Pesanan' : 'Order Monitor'}
            </h2>
            <OrderMonitor />
          </div>

          {/* Inventory Alerts */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              {language === 'id' ? 'Alert Inventori' : 'Inventory Alerts'}
            </h2>
            <InventoryAlerts />
          </div>
        </div>
      </div>
    </div>
  )
}
