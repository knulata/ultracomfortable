'use client'

import { useState, useEffect } from 'react'
import { Truck, Package, ClipboardList, RotateCcw, Box } from 'lucide-react'
import { FulfillmentStats, OrderQueue, PickPack, ShippingLabel, ReturnsManager } from '@/components/fulfillment'
import { useTranslation } from '@/stores/language'

type TabType = 'overview' | 'pickpack' | 'shipping' | 'returns'

const tabs: { id: TabType; labelEn: string; labelId: string; icon: React.ElementType }[] = [
  { id: 'overview', labelEn: 'All Orders', labelId: 'Semua Order', icon: Package },
  { id: 'pickpack', labelEn: 'Pick & Pack', labelId: 'Pick & Pack', icon: ClipboardList },
  { id: 'shipping', labelEn: 'Shipping', labelId: 'Pengiriman', icon: Truck },
  { id: 'returns', labelEn: 'Returns', labelId: 'Retur', icon: RotateCcw },
]

export default function FulfillmentPage() {
  const { language } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse w-48" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-muted rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Truck className="h-6 w-6" />
          {language === 'id' ? 'Fulfillment' : 'Fulfillment'}
        </h1>
        <p className="text-muted-foreground text-sm">
          {language === 'id'
            ? 'Kelola order, pick & pack, dan pengiriman'
            : 'Manage orders, pick & pack, and shipping'
          }
        </p>
      </div>

      {/* Stats Overview - Always visible */}
      <FulfillmentStats />

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded-t-lg ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {language === 'id' ? tab.labelId : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Workflow Guide */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
              <h3 className="font-semibold mb-4">
                {language === 'id' ? 'Alur Fulfillment' : 'Fulfillment Workflow'}
              </h3>
              <div className="grid sm:grid-cols-6 gap-3">
                {[
                  { step: 1, label: language === 'id' ? 'Order Masuk' : 'New Order', color: 'bg-amber-500' },
                  { step: 2, label: language === 'id' ? 'Picking' : 'Picking', color: 'bg-blue-500' },
                  { step: 3, label: 'QC', color: 'bg-purple-500' },
                  { step: 4, label: language === 'id' ? 'Packing' : 'Packing', color: 'bg-indigo-500' },
                  { step: 5, label: language === 'id' ? 'Siap Kirim' : 'Ready', color: 'bg-green-500' },
                  { step: 6, label: language === 'id' ? 'Dikirim' : 'Shipped', color: 'bg-cyan-500' },
                ].map((item, index) => (
                  <div key={item.step} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${item.color} text-white flex items-center justify-center text-xs font-bold`}>
                      {item.step}
                    </div>
                    <span className="text-sm">{item.label}</span>
                    {index < 5 && (
                      <span className="hidden sm:block text-muted-foreground ml-auto">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Queue */}
            <div className="bg-background border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                {language === 'id' ? 'Antrian Order' : 'Order Queue'}
              </h2>
              <OrderQueue />
            </div>
          </div>
        )}

        {activeTab === 'pickpack' && (
          <div className="bg-background border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              {language === 'id' ? 'Pick & Pack' : 'Pick & Pack'}
            </h2>
            <PickPack />
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="bg-background border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5" />
              {language === 'id' ? 'Siap Kirim' : 'Ready to Ship'}
            </h2>
            <ShippingLabel />
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="bg-background border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              {language === 'id' ? 'Kelola Retur' : 'Manage Returns'}
            </h2>
            <ReturnsManager />
          </div>
        )}
      </div>
    </div>
  )
}
