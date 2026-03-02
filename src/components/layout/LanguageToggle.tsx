'use client'

import { useLanguageStore } from '@/stores/language'
import { Globe } from 'lucide-react'

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguageStore()

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
      title={language === 'en' ? 'Switch to Indonesian' : 'Ganti ke Bahasa Inggris'}
    >
      <Globe className="h-4 w-4" />
      <span className="uppercase">{language}</span>
    </button>
  )
}

// Compact version for mobile
export function LanguageToggleCompact() {
  const { language, toggleLanguage } = useLanguageStore()

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center w-8 h-8 text-xs font-bold rounded-full border hover:bg-muted transition-colors"
      title={language === 'en' ? 'Switch to Indonesian' : 'Ganti ke Bahasa Inggris'}
    >
      {language.toUpperCase()}
    </button>
  )
}
