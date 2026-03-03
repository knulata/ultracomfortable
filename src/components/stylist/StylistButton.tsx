'use client'

import { useState, useEffect } from 'react'
import { Sparkles, X } from 'lucide-react'
import { useStylistStore } from '@/stores/stylist'
import { useTranslation } from '@/stores/language'

export function StylistButton() {
  const { language } = useTranslation()
  const { openStylist, hasCompletedQuiz, isOpen } = useStylistStore()
  const [showPrompt, setShowPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Show prompt after 10 seconds for first-time visitors
  useEffect(() => {
    if (hasCompletedQuiz || dismissed) return

    const timer = setTimeout(() => {
      setShowPrompt(true)
    }, 10000)

    return () => clearTimeout(timer)
  }, [hasCompletedQuiz, dismissed])

  // Auto-hide prompt after 8 seconds
  useEffect(() => {
    if (!showPrompt) return

    const timer = setTimeout(() => {
      setShowPrompt(false)
    }, 8000)

    return () => clearTimeout(timer)
  }, [showPrompt])

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowPrompt(false)
    setDismissed(true)
  }

  if (isOpen) return null

  return (
    <div className="fixed bottom-24 right-4 z-40">
      {/* Prompt bubble */}
      {showPrompt && (
        <div className="absolute bottom-full right-0 mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="relative bg-background rounded-2xl shadow-lg border p-4 max-w-[250px]">
            <button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 w-6 h-6 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
            <p className="text-sm font-medium mb-1">
              {language === 'id' ? 'Butuh bantuan memilih?' : 'Need help choosing?'}
            </p>
            <p className="text-xs text-muted-foreground">
              {language === 'id'
                ? 'Kira bisa bantu temukan style yang cocok untukmu!'
                : 'Let Kira help you find your perfect style!'}
            </p>
            {/* Arrow */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-background border-r border-b rotate-45" />
          </div>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={openStylist}
        className="group relative w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
      >
        {/* Pulse animation for first-time users */}
        {!hasCompletedQuiz && (
          <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25" />
        )}

        <Sparkles className="h-6 w-6 text-primary-foreground" />

        {/* Badge for returning users */}
        {hasCompletedQuiz && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}

        {/* Tooltip on hover */}
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-foreground text-background text-sm font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {hasCompletedQuiz
            ? language === 'id' ? 'Lihat rekomendasimu' : 'See your picks'
            : language === 'id' ? 'Temukan gayamu' : 'Find your style'}
        </span>
      </button>
    </div>
  )
}
