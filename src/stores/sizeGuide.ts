import { create } from 'zustand'

export interface SizeData {
  size: string
  chest: { min: number; max: number }
  waist: { min: number; max: number }
  hips: { min: number; max: number }
  length?: { min: number; max: number }
}

export interface ProductCategory {
  id: string
  name: string
  nameId: string
  sizes: SizeData[]
  measurementGuide: {
    chest: string
    chestId: string
    waist: string
    waistId: string
    hips: string
    hipsId: string
    length?: string
    lengthId?: string
  }
}

// Size data for different product categories
export const sizeCategories: ProductCategory[] = [
  {
    id: 'tops',
    name: 'Tops & T-Shirts',
    nameId: 'Atasan & Kaos',
    sizes: [
      { size: 'XS', chest: { min: 81, max: 86 }, waist: { min: 61, max: 66 }, hips: { min: 86, max: 91 } },
      { size: 'S', chest: { min: 86, max: 91 }, waist: { min: 66, max: 71 }, hips: { min: 91, max: 96 } },
      { size: 'M', chest: { min: 91, max: 97 }, waist: { min: 71, max: 76 }, hips: { min: 96, max: 101 } },
      { size: 'L', chest: { min: 97, max: 102 }, waist: { min: 76, max: 81 }, hips: { min: 101, max: 106 } },
      { size: 'XL', chest: { min: 102, max: 107 }, waist: { min: 81, max: 86 }, hips: { min: 106, max: 111 } },
      { size: 'XXL', chest: { min: 107, max: 114 }, waist: { min: 86, max: 94 }, hips: { min: 111, max: 119 } },
    ],
    measurementGuide: {
      chest: 'Measure around the fullest part of your chest, keeping the tape horizontal.',
      chestId: 'Ukur keliling bagian terlebar dada, pastikan pita pengukur horizontal.',
      waist: 'Measure around your natural waistline, keeping the tape comfortably loose.',
      waistId: 'Ukur keliling pinggang alami, pastikan pita pengukur tidak terlalu ketat.',
      hips: 'Measure around the fullest part of your hips.',
      hipsId: 'Ukur keliling bagian terlebar pinggul.',
    },
  },
  {
    id: 'bottoms',
    name: 'Pants & Shorts',
    nameId: 'Celana',
    sizes: [
      { size: 'XS', chest: { min: 81, max: 86 }, waist: { min: 61, max: 66 }, hips: { min: 86, max: 91 }, length: { min: 95, max: 100 } },
      { size: 'S', chest: { min: 86, max: 91 }, waist: { min: 66, max: 71 }, hips: { min: 91, max: 96 }, length: { min: 98, max: 103 } },
      { size: 'M', chest: { min: 91, max: 97 }, waist: { min: 71, max: 76 }, hips: { min: 96, max: 101 }, length: { min: 100, max: 105 } },
      { size: 'L', chest: { min: 97, max: 102 }, waist: { min: 76, max: 81 }, hips: { min: 101, max: 106 }, length: { min: 102, max: 107 } },
      { size: 'XL', chest: { min: 102, max: 107 }, waist: { min: 81, max: 86 }, hips: { min: 106, max: 111 }, length: { min: 104, max: 109 } },
      { size: 'XXL', chest: { min: 107, max: 114 }, waist: { min: 86, max: 94 }, hips: { min: 111, max: 119 }, length: { min: 106, max: 111 } },
    ],
    measurementGuide: {
      chest: 'Measure around the fullest part of your chest.',
      chestId: 'Ukur keliling bagian terlebar dada.',
      waist: 'Measure around where you normally wear your pants.',
      waistId: 'Ukur keliling pinggang tempat celana biasanya dipakai.',
      hips: 'Measure around the fullest part of your hips and buttocks.',
      hipsId: 'Ukur keliling bagian terlebar pinggul dan bokong.',
      length: 'Measure from your waist to where you want the pants to end.',
      lengthId: 'Ukur dari pinggang hingga panjang celana yang diinginkan.',
    },
  },
  {
    id: 'dresses',
    name: 'Dresses & Skirts',
    nameId: 'Dress & Rok',
    sizes: [
      { size: 'XS', chest: { min: 81, max: 86 }, waist: { min: 61, max: 66 }, hips: { min: 86, max: 91 } },
      { size: 'S', chest: { min: 86, max: 91 }, waist: { min: 66, max: 71 }, hips: { min: 91, max: 96 } },
      { size: 'M', chest: { min: 91, max: 97 }, waist: { min: 71, max: 76 }, hips: { min: 96, max: 101 } },
      { size: 'L', chest: { min: 97, max: 102 }, waist: { min: 76, max: 81 }, hips: { min: 101, max: 106 } },
      { size: 'XL', chest: { min: 102, max: 107 }, waist: { min: 81, max: 86 }, hips: { min: 106, max: 111 } },
      { size: 'XXL', chest: { min: 107, max: 114 }, waist: { min: 86, max: 94 }, hips: { min: 111, max: 119 } },
    ],
    measurementGuide: {
      chest: 'Measure around the fullest part of your bust.',
      chestId: 'Ukur keliling bagian terlebar dada.',
      waist: 'Measure around your natural waistline (narrowest part).',
      waistId: 'Ukur keliling pinggang alami (bagian tersempit).',
      hips: 'Measure around the fullest part of your hips.',
      hipsId: 'Ukur keliling bagian terlebar pinggul.',
    },
  },
  {
    id: 'outerwear',
    name: 'Jackets & Outerwear',
    nameId: 'Jaket & Outerwear',
    sizes: [
      { size: 'XS', chest: { min: 86, max: 91 }, waist: { min: 66, max: 71 }, hips: { min: 91, max: 96 } },
      { size: 'S', chest: { min: 91, max: 97 }, waist: { min: 71, max: 76 }, hips: { min: 96, max: 101 } },
      { size: 'M', chest: { min: 97, max: 102 }, waist: { min: 76, max: 81 }, hips: { min: 101, max: 106 } },
      { size: 'L', chest: { min: 102, max: 107 }, waist: { min: 81, max: 86 }, hips: { min: 106, max: 111 } },
      { size: 'XL', chest: { min: 107, max: 114 }, waist: { min: 86, max: 94 }, hips: { min: 111, max: 119 } },
      { size: 'XXL', chest: { min: 114, max: 122 }, waist: { min: 94, max: 102 }, hips: { min: 119, max: 127 } },
    ],
    measurementGuide: {
      chest: 'Measure over a light shirt for outerwear sizing.',
      chestId: 'Ukur di atas kaos tipis untuk ukuran outerwear.',
      waist: 'Measure around your natural waistline.',
      waistId: 'Ukur keliling pinggang alami.',
      hips: 'Measure around the fullest part of your hips.',
      hipsId: 'Ukur keliling bagian terlebar pinggul.',
    },
  },
]

export interface UserMeasurements {
  chest: number | null
  waist: number | null
  hips: number | null
  height: number | null
  weight: number | null
}

interface SizeGuideState {
  isOpen: boolean
  selectedCategory: string
  userMeasurements: UserMeasurements
  recommendedSize: string | null
  openSizeGuide: (category?: string) => void
  closeSizeGuide: () => void
  setCategory: (category: string) => void
  setMeasurement: (key: keyof UserMeasurements, value: number | null) => void
  calculateRecommendedSize: () => void
  resetMeasurements: () => void
}

export const useSizeGuideStore = create<SizeGuideState>((set, get) => ({
  isOpen: false,
  selectedCategory: 'tops',
  userMeasurements: {
    chest: null,
    waist: null,
    hips: null,
    height: null,
    weight: null,
  },
  recommendedSize: null,

  openSizeGuide: (category = 'tops') => {
    set({ isOpen: true, selectedCategory: category })
  },

  closeSizeGuide: () => {
    set({ isOpen: false })
  },

  setCategory: (category) => {
    set({ selectedCategory: category, recommendedSize: null })
  },

  setMeasurement: (key, value) => {
    set((state) => ({
      userMeasurements: { ...state.userMeasurements, [key]: value },
      recommendedSize: null,
    }))
  },

  calculateRecommendedSize: () => {
    const { selectedCategory, userMeasurements } = get()
    const category = sizeCategories.find((c) => c.id === selectedCategory)

    if (!category) return

    const { chest, waist, hips } = userMeasurements

    // Need at least one measurement to recommend
    if (!chest && !waist && !hips) {
      set({ recommendedSize: null })
      return
    }

    // Find best matching size
    let bestSize = 'M' // default
    let bestScore = Infinity

    for (const sizeData of category.sizes) {
      let score = 0
      let measurements = 0

      if (chest) {
        const mid = (sizeData.chest.min + sizeData.chest.max) / 2
        score += Math.abs(chest - mid)
        measurements++
      }

      if (waist) {
        const mid = (sizeData.waist.min + sizeData.waist.max) / 2
        score += Math.abs(waist - mid)
        measurements++
      }

      if (hips) {
        const mid = (sizeData.hips.min + sizeData.hips.max) / 2
        score += Math.abs(hips - mid)
        measurements++
      }

      if (measurements > 0) {
        const avgScore = score / measurements
        if (avgScore < bestScore) {
          bestScore = avgScore
          bestSize = sizeData.size
        }
      }
    }

    set({ recommendedSize: bestSize })
  },

  resetMeasurements: () => {
    set({
      userMeasurements: {
        chest: null,
        waist: null,
        hips: null,
        height: null,
        weight: null,
      },
      recommendedSize: null,
    })
  },
}))
