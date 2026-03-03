'use client'

import { useState } from 'react'
import { X, Ruler, Calculator, HelpCircle } from 'lucide-react'
import { useSizeGuideStore, sizeCategories } from '@/stores/sizeGuide'
import { useTranslation } from '@/stores/language'
import { SizeChart } from './SizeChart'
import { HowToMeasure } from './HowToMeasure'
import { SizeCalculator } from './SizeCalculator'

type Tab = 'chart' | 'measure' | 'calculator'

export function SizeGuideModal() {
  const { language } = useTranslation()
  const { isOpen, selectedCategory, recommendedSize, closeSizeGuide, setCategory } = useSizeGuideStore()
  const [activeTab, setActiveTab] = useState<Tab>('chart')

  if (!isOpen) return null

  const category = sizeCategories.find((c) => c.id === selectedCategory) || sizeCategories[0]

  const tabs: { id: Tab; icon: typeof Ruler; label: string; labelId: string }[] = [
    { id: 'chart', icon: Ruler, label: 'Size Chart', labelId: 'Tabel Ukuran' },
    { id: 'calculator', icon: Calculator, label: 'Find My Size', labelId: 'Cari Ukuranku' },
    { id: 'measure', icon: HelpCircle, label: 'How to Measure', labelId: 'Cara Mengukur' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeSizeGuide} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-background rounded-2xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-semibold">
              {language === 'id' ? 'Panduan Ukuran' : 'Size Guide'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {language === 'id' ? category.nameId : category.name}
            </p>
          </div>
          <button
            onClick={closeSizeGuide}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Category Selector */}
        <div className="px-4 py-3 border-b overflow-x-auto">
          <div className="flex gap-2">
            {sizeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {language === 'id' ? cat.nameId : cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 py-2 border-b">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {language === 'id' ? tab.labelId : tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'chart' && (
            <SizeChart category={category} recommendedSize={recommendedSize} />
          )}
          {activeTab === 'calculator' && <SizeCalculator />}
          {activeTab === 'measure' && <HowToMeasure category={category} />}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-muted/50 border-t p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              {language === 'id'
                ? 'Ukuran dalam sentimeter (cm)'
                : 'All measurements in centimeters (cm)'}
            </p>
            {recommendedSize && (
              <p className="font-medium text-primary">
                {language === 'id' ? 'Rekomendasi: ' : 'Recommended: '}
                {recommendedSize}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
