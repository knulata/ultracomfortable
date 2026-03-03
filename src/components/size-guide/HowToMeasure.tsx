'use client'

import { ProductCategory } from '@/stores/sizeGuide'
import { useTranslation } from '@/stores/language'
import { Ruler, Circle, ArrowUpDown } from 'lucide-react'

interface HowToMeasureProps {
  category: ProductCategory
}

export function HowToMeasure({ category }: HowToMeasureProps) {
  const { language } = useTranslation()

  const measurements = [
    {
      key: 'chest',
      icon: Circle,
      label: language === 'id' ? 'Lingkar Dada' : 'Chest',
      description: language === 'id' ? category.measurementGuide.chestId : category.measurementGuide.chest,
      position: 'top-[25%]',
    },
    {
      key: 'waist',
      icon: Circle,
      label: language === 'id' ? 'Lingkar Pinggang' : 'Waist',
      description: language === 'id' ? category.measurementGuide.waistId : category.measurementGuide.waist,
      position: 'top-[40%]',
    },
    {
      key: 'hips',
      icon: Circle,
      label: language === 'id' ? 'Lingkar Pinggul' : 'Hips',
      description: language === 'id' ? category.measurementGuide.hipsId : category.measurementGuide.hips,
      position: 'top-[55%]',
    },
  ]

  if (category.measurementGuide.length) {
    measurements.push({
      key: 'length',
      icon: ArrowUpDown,
      label: language === 'id' ? 'Panjang' : 'Length',
      description: language === 'id' ? category.measurementGuide.lengthId! : category.measurementGuide.length,
      position: 'top-[70%]',
    })
  }

  return (
    <div className="space-y-6">
      {/* Tips */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <h4 className="font-semibold flex items-center gap-2 mb-3">
          <Ruler className="h-4 w-4 text-primary" />
          {language === 'id' ? 'Tips Mengukur' : 'Measuring Tips'}
        </h4>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            {language === 'id'
              ? 'Gunakan pita pengukur yang fleksibel'
              : 'Use a flexible measuring tape'}
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            {language === 'id'
              ? 'Ukur langsung di kulit atau pakaian dalam tipis'
              : 'Measure directly on skin or thin undergarments'}
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            {language === 'id'
              ? 'Berdiri tegak dengan posisi alami'
              : 'Stand straight in a natural posture'}
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            {language === 'id'
              ? 'Jangan tarik pita terlalu kencang'
              : "Don't pull the tape too tight"}
          </li>
        </ul>
      </div>

      {/* Visual Guide */}
      <div className="flex gap-6">
        {/* Body Illustration */}
        <div className="relative w-32 flex-shrink-0">
          <div className="aspect-[1/2.5] bg-gradient-to-b from-muted to-muted/50 rounded-full relative">
            {/* Head */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-muted rounded-full border-2 border-background" />

            {/* Measurement lines */}
            <div className="absolute top-[25%] left-0 right-0 border-t-2 border-dashed border-primary/50" />
            <div className="absolute top-[40%] left-0 right-0 border-t-2 border-dashed border-primary/50" />
            <div className="absolute top-[55%] left-0 right-0 border-t-2 border-dashed border-primary/50" />

            {/* Labels */}
            <div className="absolute top-[25%] -right-2 translate-x-full -translate-y-1/2">
              <span className="text-xs font-medium bg-primary text-primary-foreground px-1.5 py-0.5 rounded">1</span>
            </div>
            <div className="absolute top-[40%] -right-2 translate-x-full -translate-y-1/2">
              <span className="text-xs font-medium bg-primary text-primary-foreground px-1.5 py-0.5 rounded">2</span>
            </div>
            <div className="absolute top-[55%] -right-2 translate-x-full -translate-y-1/2">
              <span className="text-xs font-medium bg-primary text-primary-foreground px-1.5 py-0.5 rounded">3</span>
            </div>
          </div>
        </div>

        {/* Measurement Instructions */}
        <div className="flex-1 space-y-4">
          {measurements.map((m, index) => (
            <div key={m.key} className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                {index + 1}
              </div>
              <div>
                <h5 className="font-medium text-sm">{m.label}</h5>
                <p className="text-xs text-muted-foreground mt-0.5">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
