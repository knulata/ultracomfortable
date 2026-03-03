'use client'

import { OrderStatus, getStatusLabel, getStatusColor } from '@/stores/orders'
import { useTranslation } from '@/stores/language'

interface OrderStatusBadgeProps {
  status: OrderStatus
  size?: 'sm' | 'md' | 'lg'
}

export function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const { language } = useTranslation()

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-sm font-medium',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full ${getStatusColor(status)} ${sizeClasses[size]}`}
    >
      {getStatusLabel(status, language === 'id' ? 'id' : 'en')}
    </span>
  )
}
