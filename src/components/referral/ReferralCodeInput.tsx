'use client'

import { useState } from 'react'
import { Gift, Check, X, Loader2 } from 'lucide-react'
import { useTranslation } from '@/stores/language'
import { REFERRAL_CONFIG } from '@/stores/referral'

interface ReferralCodeInputProps {
  value: string
  onChange: (value: string) => void
  onValidated?: (isValid: boolean) => void
}

export function ReferralCodeInput({ value, onChange, onValidated }: ReferralCodeInputProps) {
  const { language } = useTranslation()
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<'valid' | 'invalid' | null>(null)
  const [showInput, setShowInput] = useState(!!value)

  const validateCode = async (code: string) => {
    if (!code || code.length < 6) {
      setValidationResult(null)
      onValidated?.(false)
      return
    }

    setIsValidating(true)

    // Simulate API validation
    await new Promise((resolve) => setTimeout(resolve, 800))

    // For demo, accept codes starting with "UC"
    const isValid = code.toUpperCase().startsWith('AN') && code.length >= 8

    setValidationResult(isValid ? 'valid' : 'invalid')
    setIsValidating(false)
    onValidated?.(isValid)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase()
    onChange(newValue)
    setValidationResult(null)
  }

  const handleBlur = () => {
    if (value) {
      validateCode(value)
    }
  }

  if (!showInput) {
    return (
      <button
        type="button"
        onClick={() => setShowInput(true)}
        className="flex items-center gap-2 text-sm text-primary hover:underline"
      >
        <Gift className="h-4 w-4" />
        {language === 'id' ? 'Punya kode referral?' : 'Have a referral code?'}
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {language === 'id' ? 'Kode Referral (opsional)' : 'Referral Code (optional)'}
      </label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Gift className="h-4 w-4 text-muted-foreground" />
        </div>

        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="UCXXXXXXXX"
          maxLength={12}
          className={`w-full pl-10 pr-10 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 transition-colors ${
            validationResult === 'valid'
              ? 'border-green-500 focus:ring-green-500/20'
              : validationResult === 'invalid'
              ? 'border-red-500 focus:ring-red-500/20'
              : 'focus:ring-primary/20'
          }`}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isValidating && <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />}
          {!isValidating && validationResult === 'valid' && (
            <Check className="h-4 w-4 text-green-500" />
          )}
          {!isValidating && validationResult === 'invalid' && (
            <X className="h-4 w-4 text-red-500" />
          )}
        </div>
      </div>

      {validationResult === 'valid' && (
        <p className="text-xs text-green-600 flex items-center gap-1">
          <Check className="h-3 w-3" />
          {language === 'id'
            ? `Kode valid! Kamu akan dapat ${REFERRAL_CONFIG.refereePoints} points & diskon ${REFERRAL_CONFIG.refereeDiscount}%`
            : `Valid code! You'll get ${REFERRAL_CONFIG.refereePoints} points & ${REFERRAL_CONFIG.refereeDiscount}% off`}
        </p>
      )}

      {validationResult === 'invalid' && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <X className="h-3 w-3" />
          {language === 'id' ? 'Kode tidak valid' : 'Invalid referral code'}
        </p>
      )}

      {!validationResult && (
        <p className="text-xs text-muted-foreground">
          {language === 'id'
            ? `Masukkan kode dari teman untuk dapat ${REFERRAL_CONFIG.refereePoints} points & diskon ${REFERRAL_CONFIG.refereeDiscount}%`
            : `Enter a friend's code to get ${REFERRAL_CONFIG.refereePoints} points & ${REFERRAL_CONFIG.refereeDiscount}% off`}
        </p>
      )}
    </div>
  )
}
