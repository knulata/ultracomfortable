'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'

type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'oblong'
type HijabStyle = 'pashmina' | 'square' | 'instant' | 'bergo' | 'khimar'

interface StyleRecommendation {
  style: HijabStyle
  name: string
  nameId: string
  description: string
  descriptionId: string
  tips: string[]
  tipsId: string[]
  products: string[]
}

const faceShapes: { id: FaceShape; name: string; nameId: string; description: string; descriptionId: string; icon: string }[] = [
  {
    id: 'oval',
    name: 'Oval',
    nameId: 'Oval',
    description: 'Balanced proportions, slightly longer than wide',
    descriptionId: 'Proporsi seimbang, sedikit lebih panjang dari lebar',
    icon: '🥚',
  },
  {
    id: 'round',
    name: 'Round',
    nameId: 'Bulat',
    description: 'Equal width and length, soft curves',
    descriptionId: 'Lebar dan panjang sama, lengkungan lembut',
    icon: '🌕',
  },
  {
    id: 'square',
    name: 'Square',
    nameId: 'Kotak',
    description: 'Strong jawline, equal width at forehead and jaw',
    descriptionId: 'Rahang tegas, lebar dahi dan rahang sama',
    icon: '⬜',
  },
  {
    id: 'heart',
    name: 'Heart',
    nameId: 'Hati',
    description: 'Wide forehead, narrow chin',
    descriptionId: 'Dahi lebar, dagu sempit',
    icon: '💜',
  },
  {
    id: 'oblong',
    name: 'Oblong',
    nameId: 'Panjang',
    description: 'Longer than wide, straight cheeks',
    descriptionId: 'Lebih panjang dari lebar, pipi lurus',
    icon: '📱',
  },
]

const recommendations: Record<FaceShape, StyleRecommendation[]> = {
  oval: [
    {
      style: 'pashmina',
      name: 'Pashmina',
      nameId: 'Pashmina',
      description: 'Any pashmina style works beautifully with oval faces',
      descriptionId: 'Semua gaya pashmina cocok dengan wajah oval',
      tips: ['Try volume on top', 'Experiment with different draping styles', 'Side drape looks elegant'],
      tipsId: ['Coba volume di atas', 'Eksperimen dengan berbagai gaya draping', 'Draping samping terlihat elegan'],
      products: ['pashmina-diamond-italiano'],
    },
    {
      style: 'square',
      name: 'Square Hijab',
      nameId: 'Hijab Segi Empat',
      description: 'Perfect for creating any look you want',
      descriptionId: 'Sempurna untuk menciptakan tampilan apapun',
      tips: ['Turkish style', 'Malaysian style', 'Simple everyday style'],
      tipsId: ['Gaya Turki', 'Gaya Malaysia', 'Gaya simpel sehari-hari'],
      products: ['premium-voal-square-hijab'],
    },
  ],
  round: [
    {
      style: 'pashmina',
      name: 'Pashmina with Volume',
      nameId: 'Pashmina dengan Volume',
      description: 'Add height on top to elongate your face',
      descriptionId: 'Tambahkan tinggi di atas untuk memanjangkan wajah',
      tips: ['Create volume at the crown', 'Avoid tight wrapping around cheeks', 'Let fabric drape loosely'],
      tipsId: ['Buat volume di ubun-ubun', 'Hindari membungkus ketat di pipi', 'Biarkan kain terurai longgar'],
      products: ['pashmina-diamond-italiano'],
    },
    {
      style: 'khimar',
      name: 'Long Khimar',
      nameId: 'Khimar Panjang',
      description: 'Vertical lines help elongate the face',
      descriptionId: 'Garis vertikal membantu memanjangkan wajah',
      tips: ['Choose longer lengths', 'Avoid too much fabric at sides', 'Pet (visor) adds height'],
      tipsId: ['Pilih yang lebih panjang', 'Hindari terlalu banyak kain di samping', 'Pet menambah tinggi'],
      products: ['khimar-pet-ceruti', 'khimar-syari-jumbo'],
    },
  ],
  square: [
    {
      style: 'pashmina',
      name: 'Soft Draping Pashmina',
      nameId: 'Pashmina Draping Lembut',
      description: 'Soft draping softens angular features',
      descriptionId: 'Draping lembut melunakkan fitur angular',
      tips: ['Loose draping around jawline', 'Avoid tight styles', 'Layer for softness'],
      tipsId: ['Draping longgar di rahang', 'Hindari gaya ketat', 'Layer untuk kelembutan'],
      products: ['pashmina-diamond-italiano'],
    },
    {
      style: 'instant',
      name: 'Instant Hijab',
      nameId: 'Hijab Instan',
      description: 'Pre-styled for effortless soft look',
      descriptionId: 'Sudah di-styling untuk tampilan lembut',
      tips: ['Choose flowing fabrics', 'Jersey works well', 'Avoid structured styles'],
      tipsId: ['Pilih kain yang mengalir', 'Jersey cocok', 'Hindari gaya terstruktur'],
      products: ['jersey-instant-hijab'],
    },
  ],
  heart: [
    {
      style: 'square',
      name: 'Chin Coverage Style',
      nameId: 'Gaya Menutupi Dagu',
      description: 'Balance narrow chin with fabric volume below',
      descriptionId: 'Seimbangkan dagu sempit dengan volume kain di bawah',
      tips: ['Create volume at chin level', 'Avoid too much volume on top', 'Side draping works well'],
      tipsId: ['Buat volume di level dagu', 'Hindari terlalu banyak volume di atas', 'Draping samping cocok'],
      products: ['premium-voal-square-hijab'],
    },
    {
      style: 'bergo',
      name: 'Bergo with Chest Coverage',
      nameId: 'Bergo dengan Coverage Dada',
      description: 'Even coverage balances face shape',
      descriptionId: 'Coverage merata menyeimbangkan bentuk wajah',
      tips: ['Choose medium length', 'Avoid tight cap styles', 'Soft fabrics recommended'],
      tipsId: ['Pilih panjang sedang', 'Hindari gaya cap ketat', 'Kain lembut direkomendasikan'],
      products: ['bergo-daily-sport'],
    },
  ],
  oblong: [
    {
      style: 'square',
      name: 'Side Volume Style',
      nameId: 'Gaya Volume Samping',
      description: 'Add width to balance long face',
      descriptionId: 'Tambahkan lebar untuk menyeimbangkan wajah panjang',
      tips: ['Create volume at sides', 'Avoid styles that add height', 'Horizontal draping works'],
      tipsId: ['Buat volume di samping', 'Hindari gaya yang menambah tinggi', 'Draping horizontal cocok'],
      products: ['premium-voal-square-hijab'],
    },
    {
      style: 'instant',
      name: 'Layered Instant',
      nameId: 'Instan Berlayer',
      description: 'Layers add visual width',
      descriptionId: 'Layer menambah lebar visual',
      tips: ['Choose styles with layers', 'Avoid long vertical draping', 'Medium length best'],
      tipsId: ['Pilih gaya dengan layer', 'Hindari draping vertikal panjang', 'Panjang sedang terbaik'],
      products: ['jersey-instant-hijab'],
    },
  ],
}

export default function HijabGuidePage() {
  const { language } = useTranslation()
  const [selectedShape, setSelectedShape] = useState<FaceShape | null>(null)
  const [step, setStep] = useState<'select' | 'result'>('select')

  const handleSelectShape = (shape: FaceShape) => {
    setSelectedShape(shape)
    setStep('result')
  }

  const handleReset = () => {
    setSelectedShape(null)
    setStep('select')
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Breadcrumb */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              {language === 'id' ? 'Beranda' : 'Home'}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">
              {language === 'id' ? 'Panduan Hijab' : 'Hijab Guide'}
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'id' ? 'Panduan Hijab Sesuai Bentuk Wajah' : 'Hijab Guide by Face Shape'}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {language === 'id'
              ? 'Temukan gaya hijab yang paling cocok dengan bentuk wajah Anda untuk tampilan yang lebih memukau'
              : 'Find the hijab style that best suits your face shape for a more stunning look'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {step === 'select' ? (
          <>
            {/* Face Shape Selection */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold text-center mb-8">
                {language === 'id' ? 'Pilih Bentuk Wajah Anda' : 'Select Your Face Shape'}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {faceShapes.map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => handleSelectShape(shape.id)}
                    className="bg-background rounded-xl p-6 border hover:border-primary hover:shadow-lg transition-all text-center group"
                  >
                    <div className="text-4xl mb-3">{shape.icon}</div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {language === 'id' ? shape.nameId : shape.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {language === 'id' ? shape.descriptionId : shape.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Tips Section */}
              <div className="mt-12 bg-background rounded-xl p-6 border">
                <h3 className="font-semibold mb-4">
                  {language === 'id' ? 'Cara Menentukan Bentuk Wajah' : 'How to Determine Your Face Shape'}
                </h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">1</span>
                    {language === 'id'
                      ? 'Ikat rambut ke belakang dan lihat wajah di cermin'
                      : 'Tie your hair back and look at your face in the mirror'}
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">2</span>
                    {language === 'id'
                      ? 'Perhatikan bagian terlebar: dahi, pipi, atau rahang'
                      : 'Notice the widest part: forehead, cheeks, or jaw'}
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">3</span>
                    {language === 'id'
                      ? 'Bandingkan panjang dan lebar wajah Anda'
                      : 'Compare the length and width of your face'}
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">4</span>
                    {language === 'id'
                      ? 'Perhatikan bentuk rahang: bulat, kotak, atau runcing'
                      : 'Notice your jawline: round, square, or pointed'}
                  </li>
                </ol>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Results */}
            {selectedShape && (
              <div className="max-w-4xl mx-auto">
                <button
                  onClick={handleReset}
                  className="text-sm text-primary hover:underline mb-6 flex items-center gap-1"
                >
                  ← {language === 'id' ? 'Pilih bentuk wajah lain' : 'Choose different face shape'}
                </button>

                <div className="bg-background rounded-xl p-6 border mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">
                      {faceShapes.find(s => s.id === selectedShape)?.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">
                        {language === 'id' ? 'Wajah ' : ''}
                        {language === 'id'
                          ? faceShapes.find(s => s.id === selectedShape)?.nameId
                          : faceShapes.find(s => s.id === selectedShape)?.name}
                        {language === 'id' ? '' : ' Face'}
                      </h2>
                      <p className="text-muted-foreground">
                        {language === 'id'
                          ? faceShapes.find(s => s.id === selectedShape)?.descriptionId
                          : faceShapes.find(s => s.id === selectedShape)?.description}
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-6">
                  {language === 'id' ? 'Gaya Hijab yang Direkomendasikan' : 'Recommended Hijab Styles'}
                </h3>

                <div className="space-y-6">
                  {recommendations[selectedShape].map((rec, index) => (
                    <div key={index} className="bg-background rounded-xl p-6 border">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2">
                            {language === 'id' ? rec.nameId : rec.name}
                          </h4>
                          <p className="text-muted-foreground mb-4">
                            {language === 'id' ? rec.descriptionId : rec.description}
                          </p>

                          <h5 className="font-medium text-sm mb-2">
                            {language === 'id' ? 'Tips Styling:' : 'Styling Tips:'}
                          </h5>
                          <ul className="space-y-2">
                            {(language === 'id' ? rec.tipsId : rec.tips).map((tip, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="md:w-48 flex-shrink-0">
                          <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                            <span className="text-4xl">🧕</span>
                          </div>
                          <Button className="w-full" asChild>
                            <Link href={`/products/${rec.products[0]}`}>
                              {language === 'id' ? 'Lihat Produk' : 'View Products'}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-12 bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-xl p-8 text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    {language === 'id' ? 'Masih Bingung?' : 'Still Confused?'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {language === 'id'
                      ? 'Konsultasikan dengan tim styling kami untuk rekomendasi personal'
                      : 'Consult with our styling team for personal recommendations'}
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/style">
                      {language === 'id' ? 'Chat dengan Stylist' : 'Chat with Stylist'}
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
