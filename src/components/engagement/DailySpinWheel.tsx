'use client'

import { useState, useRef } from 'react'
import { X, Gift, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import confetti from 'canvas-confetti'

interface Prize {
  id: string
  label: string
  labelId: string
  color: string
  probability: number
  value: string
}

const prizes: Prize[] = [
  { id: 'points50', label: '50 Points', labelId: '50 Poin', color: '#c9a87c', probability: 25, value: '50' },
  { id: 'points100', label: '100 Points', labelId: '100 Poin', color: '#10b981', probability: 20, value: '100' },
  { id: 'shipping', label: 'Free Shipping', labelId: 'Gratis Ongkir', color: '#3b82f6', probability: 15, value: 'free_shipping' },
  { id: 'discount5', label: '5% Off', labelId: 'Diskon 5%', color: '#f59e0b', probability: 15, value: '5%' },
  { id: 'discount10', label: '10% Off', labelId: 'Diskon 10%', color: '#ef4444', probability: 10, value: '10%' },
  { id: 'points200', label: '200 Points', labelId: '200 Poin', color: '#8b5cf6', probability: 8, value: '200' },
  { id: 'discount15', label: '15% Off', labelId: 'Diskon 15%', color: '#ec4899', probability: 5, value: '15%' },
  { id: 'jackpot', label: 'JACKPOT 500 Points!', labelId: 'JACKPOT 500 Poin!', color: '#ffd700', probability: 2, value: '500' },
]

interface DailySpinWheelProps {
  isOpen: boolean
  onClose: () => void
  onWin: (prize: Prize) => void
}

export function DailySpinWheel({ isOpen, onClose, onWin }: DailySpinWheelProps) {
  const { language } = useTranslation()
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [winner, setWinner] = useState<Prize | null>(null)
  const wheelRef = useRef<HTMLDivElement>(null)

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setWinner(null)

    // Weighted random selection
    const totalWeight = prizes.reduce((sum, p) => sum + p.probability, 0)
    let random = Math.random() * totalWeight
    let selectedPrize = prizes[0]

    for (const prize of prizes) {
      random -= prize.probability
      if (random <= 0) {
        selectedPrize = prize
        break
      }
    }

    // Calculate rotation (multiple full rotations + land on prize)
    const prizeIndex = prizes.findIndex(p => p.id === selectedPrize.id)
    const segmentAngle = 360 / prizes.length
    const targetAngle = 360 - (prizeIndex * segmentAngle + segmentAngle / 2)
    const fullRotations = 5 * 360 // 5 full spins
    const newRotation = rotation + fullRotations + targetAngle + Math.random() * 10 - 5

    setRotation(newRotation)

    // Show result after animation
    setTimeout(() => {
      setIsSpinning(false)
      setWinner(selectedPrize)
      onWin(selectedPrize)

      // Celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c9a87c', '#ffd700', '#ff6b6b', '#10b981'],
      })
    }, 4000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-gradient-to-b from-primary/20 to-background rounded-3xl p-6 max-w-md w-full shadow-2xl border border-primary/30">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary/20 rounded-full text-primary text-sm font-medium mb-2">
            <Sparkles className="h-4 w-4" />
            {language === 'id' ? 'Hadiah Harian' : 'Daily Reward'}
          </div>
          <h2 className="text-2xl font-bold">
            {language === 'id' ? 'Putar & Menang!' : 'Spin & Win!'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {language === 'id' ? 'Putar roda untuk hadiah gratis!' : 'Spin the wheel for free prizes!'}
          </p>
        </div>

        {/* Wheel */}
        <div className="relative w-72 h-72 mx-auto mb-6">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-primary drop-shadow-lg" />
          </div>

          {/* Wheel container */}
          <div
            ref={wheelRef}
            className="w-full h-full rounded-full border-4 border-primary shadow-xl overflow-hidden"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {prizes.map((prize, index) => {
                const angle = 360 / prizes.length
                const startAngle = index * angle - 90
                const endAngle = startAngle + angle
                const startRad = (startAngle * Math.PI) / 180
                const endRad = (endAngle * Math.PI) / 180
                const x1 = 50 + 50 * Math.cos(startRad)
                const y1 = 50 + 50 * Math.sin(startRad)
                const x2 = 50 + 50 * Math.cos(endRad)
                const y2 = 50 + 50 * Math.sin(endRad)
                const largeArc = angle > 180 ? 1 : 0

                // Text position
                const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180
                const textX = 50 + 32 * Math.cos(midAngle)
                const textY = 50 + 32 * Math.sin(midAngle)
                const textRotation = (startAngle + endAngle) / 2 + 90

                return (
                  <g key={prize.id}>
                    <path
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={prize.color}
                      stroke="#fff"
                      strokeWidth="0.5"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="white"
                      fontSize="4"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    >
                      {language === 'id' ? prize.labelId : prize.label}
                    </text>
                  </g>
                )
              })}
              {/* Center circle */}
              <circle cx="50" cy="50" r="8" fill="#0a0a0a" stroke="#c9a87c" strokeWidth="2" />
              <text x="50" y="50" fill="#c9a87c" fontSize="4" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
                UC
              </text>
            </svg>
          </div>
        </div>

        {/* Result or Spin Button */}
        {winner ? (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/20 rounded-full mb-4">
              <Gift className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">
                {language === 'id' ? `Selamat! Anda mendapat ${winner.labelId}` : `Congratulations! You won ${winner.label}`}
              </span>
            </div>
            <Button onClick={onClose} className="w-full">
              {language === 'id' ? 'Klaim Hadiah' : 'Claim Prize'}
            </Button>
          </div>
        ) : (
          <Button
            onClick={spinWheel}
            disabled={isSpinning}
            size="lg"
            className="w-full text-lg h-14 bg-gradient-to-r from-primary to-yellow-500 hover:from-primary/90 hover:to-yellow-500/90"
          >
            {isSpinning ? (
              <span className="animate-pulse">{language === 'id' ? 'Memutar...' : 'Spinning...'}</span>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                {language === 'id' ? 'PUTAR SEKARANG!' : 'SPIN NOW!'}
              </>
            )}
          </Button>
        )}

        {/* Daily limit notice */}
        <p className="text-xs text-center text-muted-foreground mt-4">
          {language === 'id' ? '1x putar gratis per hari. Login untuk lebih banyak!' : '1 free spin per day. Login for more!'}
        </p>
      </div>
    </div>
  )
}
