'use client'

import { useEffect } from 'react'
import { useSizeGuideStore, UserMeasurements } from '@/stores/sizeGuide'
import { useTranslation } from '@/stores/language'
import { Button } from '@/components/ui/button'
import { Calculator, Sparkles, RotateCcw } from 'lucide-react'

export function SizeCalculator() {
  const { language } = useTranslation()
  const {
    userMeasurements,
    recommendedSize,
    setMeasurement,
    calculateRecommendedSize,
    resetMeasurements,
  } = useSizeGuideStore()

  // Auto-calculate when measurements change
  useEffect(() => {
    const { chest, waist, hips } = userMeasurements
    if (chest || waist || hips) {
      calculateRecommendedSize()
    }
  }, [userMeasurements, calculateRecommendedSize])

  const handleInputChange = (key: keyof UserMeasurements, value: string) => {
    const numValue = value === '' ? null : parseInt(value, 10)
    if (numValue === null || (!isNaN(numValue) && numValue > 0 && numValue < 300)) {
      setMeasurement(key, numValue)
    }
  }

  const inputFields: { key: keyof UserMeasurements; label: string; labelId: string; placeholder: string; unit: string }[] = [
    { key: 'chest', label: 'Chest', labelId: 'Lingkar Dada', placeholder: '92', unit: 'cm' },
    { key: 'waist', label: 'Waist', labelId: 'Lingkar Pinggang', placeholder: '76', unit: 'cm' },
    { key: 'hips', label: 'Hips', labelId: 'Lingkar Pinggul', placeholder: '98', unit: 'cm' },
  ]

  const optionalFields: { key: keyof UserMeasurements; label: string; labelId: string; placeholder: string; unit: string }[] = [
    { key: 'height', label: 'Height', labelId: 'Tinggi Badan', placeholder: '165', unit: 'cm' },
    { key: 'weight', label: 'Weight', labelId: 'Berat Badan', placeholder: '60', unit: 'kg' },
  ]

  const hasAnyMeasurement = userMeasurements.chest || userMeasurements.waist || userMeasurements.hips

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">
            {language === 'id' ? 'Kalkulator Ukuran' : 'Size Calculator'}
          </h3>
        </div>
        {hasAnyMeasurement && (
          <Button variant="ghost" size="sm" onClick={resetMeasurements}>
            <RotateCcw className="h-4 w-4 mr-1" />
            {language === 'id' ? 'Reset' : 'Reset'}
          </Button>
        )}
      </div>

      {/* Main Measurements */}
      <div className="grid grid-cols-3 gap-4">
        {inputFields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium mb-1.5">
              {language === 'id' ? field.labelId : field.label}
            </label>
            <div className="relative">
              <input
                type="number"
                value={userMeasurements[field.key] ?? ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 pr-10 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-center"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {field.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Optional Measurements */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">
          {language === 'id' ? 'Opsional (untuk referensi)' : 'Optional (for reference)'}
        </p>
        <div className="grid grid-cols-2 gap-4">
          {optionalFields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs text-muted-foreground mb-1">
                {language === 'id' ? field.labelId : field.label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={userMeasurements[field.key] ?? ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-1.5 pr-10 border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary text-center"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {field.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Result */}
      {recommendedSize && (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {language === 'id' ? 'Ukuran yang direkomendasikan' : 'Your recommended size'}
              </p>
              <p className="text-2xl font-bold text-primary">{recommendedSize}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {language === 'id'
              ? 'Berdasarkan pengukuran Anda. Lihat tabel ukuran untuk detail lebih lanjut.'
              : 'Based on your measurements. Check the size chart for more details.'}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!hasAnyMeasurement && (
        <div className="text-center py-4 text-muted-foreground">
          <p className="text-sm">
            {language === 'id'
              ? 'Masukkan ukuran Anda untuk mendapatkan rekomendasi'
              : 'Enter your measurements to get a recommendation'}
          </p>
        </div>
      )}
    </div>
  )
}
