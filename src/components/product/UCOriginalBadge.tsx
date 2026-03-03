'use client'

import { Sparkles } from 'lucide-react'

interface UCOriginalBadgeProps {
  variant?: 'default' | 'small' | 'large' | 'dark'
  className?: string
}

export function UCOriginalBadge({ variant = 'default', className = '' }: UCOriginalBadgeProps) {
  const variants = {
    default: 'bg-black text-white px-2.5 py-1 text-xs',
    small: 'bg-black text-white px-2 py-0.5 text-[10px]',
    large: 'bg-black text-white px-3 py-1.5 text-sm',
    dark: 'bg-white text-black px-2.5 py-1 text-xs',
  }

  const iconSizes = {
    default: 'h-3 w-3',
    small: 'h-2.5 w-2.5',
    large: 'h-4 w-4',
    dark: 'h-3 w-3',
  }

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full ${variants[variant]} ${className}`}>
      <Sparkles className={iconSizes[variant]} />
      UC Original
    </span>
  )
}
