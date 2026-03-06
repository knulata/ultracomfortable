'use client'

import { useState, useEffect } from 'react'
import { Package, Camera, Upload, QrCode, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IntakeStats, DropOffForm, PhotoQueue, ProductListing, InventoryLabel } from '@/components/intake'
import { useTranslation } from '@/stores/language'

type TabType = 'overview' | 'dropoff' | 'photo' | 'listing' | 'labels'

const tabs: { id: TabType; labelEn: string; labelId: string; icon: React.ElementType }[] = [
  { id: 'overview', labelEn: 'Overview', labelId: 'Ringkasan', icon: Package },
  { id: 'dropoff', labelEn: 'Drop-off', labelId: 'Drop-off', icon: Plus },
  { id: 'photo', labelEn: 'Photo Studio', labelId: 'Studio Foto', icon: Camera },
  { id: 'listing', labelEn: 'Listing', labelId: 'Listing', icon: Upload },
  { id: 'labels', labelEn: 'Labels', labelId: 'Label', icon: QrCode },
]

export default function IntakePage() {
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
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            {language === 'id' ? 'Intake Produk' : 'Product Intake'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {language === 'id'
              ? 'Kelola penerimaan dan foto produk dari partner'
              : 'Manage product receiving and photography from partners'
            }
          </p>
        </div>

        <Button onClick={() => setActiveTab('dropoff')}>
          <Plus className="h-4 w-4 mr-2" />
          {language === 'id' ? 'Terima Barang' : 'Receive Items'}
        </Button>
      </div>

      {/* Stats Overview - Always visible */}
      <IntakeStats />

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
                {language === 'id' ? 'Alur Kerja Intake' : 'Intake Workflow'}
              </h3>
              <div className="grid sm:grid-cols-5 gap-4">
                {[
                  { step: 1, label: language === 'id' ? 'Terima Barang' : 'Receive', icon: Package },
                  { step: 2, label: language === 'id' ? 'Antri Foto' : 'Photo Queue', icon: Camera },
                  { step: 3, label: language === 'id' ? 'Edit Foto' : 'Edit Photos', icon: Camera },
                  { step: 4, label: language === 'id' ? 'Set Harga' : 'Set Price', icon: Upload },
                  { step: 5, label: language === 'id' ? 'Publish' : 'Publish', icon: Upload },
                ].map((item, index) => (
                  <div key={item.step} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </div>
                    <span className="text-sm">{item.label}</span>
                    {index < 4 && (
                      <span className="hidden sm:block text-muted-foreground">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setActiveTab('dropoff')}
                className="p-4 bg-background border rounded-xl text-left hover:border-primary/50 transition-colors"
              >
                <Plus className="h-6 w-6 text-green-600 mb-2" />
                <p className="font-medium">{language === 'id' ? 'Terima Barang Baru' : 'Receive New Items'}</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'id' ? 'Catat drop-off dari partner' : 'Record partner drop-offs'}
                </p>
              </button>

              <button
                onClick={() => setActiveTab('photo')}
                className="p-4 bg-background border rounded-xl text-left hover:border-primary/50 transition-colors"
              >
                <Camera className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-medium">{language === 'id' ? 'Studio Foto' : 'Photo Studio'}</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'id' ? 'Kelola antrian foto' : 'Manage photo queue'}
                </p>
              </button>

              <button
                onClick={() => setActiveTab('listing')}
                className="p-4 bg-background border rounded-xl text-left hover:border-primary/50 transition-colors"
              >
                <Upload className="h-6 w-6 text-purple-600 mb-2" />
                <p className="font-medium">{language === 'id' ? 'Listing Produk' : 'Product Listing'}</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'id' ? 'Set harga dan publish' : 'Set prices and publish'}
                </p>
              </button>

              <button
                onClick={() => setActiveTab('labels')}
                className="p-4 bg-background border rounded-xl text-left hover:border-primary/50 transition-colors"
              >
                <QrCode className="h-6 w-6 text-amber-600 mb-2" />
                <p className="font-medium">{language === 'id' ? 'Cetak Label' : 'Print Labels'}</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'id' ? 'Label dengan QR code' : 'Labels with QR codes'}
                </p>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'dropoff' && (
          <div className="max-w-2xl">
            <div className="bg-background border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {language === 'id' ? 'Terima Barang dari Partner' : 'Receive Items from Partner'}
              </h2>
              <DropOffForm onSuccess={() => setActiveTab('overview')} />
            </div>
          </div>
        )}

        {activeTab === 'photo' && (
          <div className="bg-background border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Camera className="h-5 w-5" />
              {language === 'id' ? 'Antrian Studio Foto' : 'Photo Studio Queue'}
            </h2>
            <PhotoQueue />
          </div>
        )}

        {activeTab === 'listing' && (
          <div className="bg-background border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5" />
              {language === 'id' ? 'Listing Produk' : 'Product Listing'}
            </h2>
            <ProductListing />
          </div>
        )}

        {activeTab === 'labels' && (
          <div className="bg-background border rounded-xl p-6">
            <InventoryLabel />
          </div>
        )}
      </div>
    </div>
  )
}
