import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { translations, Language, TranslationKeys } from '@/lib/i18n/translations'

interface LanguageState {
  language: Language
  t: TranslationKeys
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'id', // Default to Indonesian
      t: translations.id,

      setLanguage: (lang: Language) => {
        set({
          language: lang,
          t: translations[lang],
        })
      },

      toggleLanguage: () => {
        const currentLang = get().language
        const newLang = currentLang === 'en' ? 'id' : 'en'
        set({
          language: newLang,
          t: translations[newLang],
        })
      },
    }),
    {
      name: 'alyanoor-lang-v2',
      partialize: (state) => ({ language: state.language }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.t = translations[state.language]
        }
      },
    }
  )
)

// Hook for easy access
export function useTranslation() {
  const { t, language, setLanguage, toggleLanguage } = useLanguageStore()
  return { t, language, setLanguage, toggleLanguage }
}
