'use client'

import { CheckCircle, Circle, Package, CreditCard, Settings, Truck, MapPin, Home, X, RefreshCw } from 'lucide-react'
import { TrackingEvent, TrackingEventType, formatOrderDate } from '@/stores/orders'
import { useTranslation } from '@/stores/language'

interface OrderTimelineProps {
  events: TrackingEvent[]
  compact?: boolean
}

function getEventIcon(type: TrackingEventType) {
  switch (type) {
    case 'order_placed':
      return Package
    case 'payment_confirmed':
      return CreditCard
    case 'processing':
      return Settings
    case 'picked_up':
    case 'in_transit':
      return Truck
    case 'arrived_at_hub':
      return MapPin
    case 'out_for_delivery':
      return Truck
    case 'delivered':
      return Home
    case 'cancelled':
      return X
    case 'refund_initiated':
    case 'refund_completed':
      return RefreshCw
    default:
      return Circle
  }
}

export function OrderTimeline({ events, compact = false }: OrderTimelineProps) {
  const { language } = useTranslation()

  // Sort events: completed first (newest to oldest), then pending
  const sortedEvents = [...events].sort((a, b) => {
    if (a.isCompleted && !b.isCompleted) return -1
    if (!a.isCompleted && b.isCompleted) return 1
    if (a.isCompleted && b.isCompleted) return b.timestamp - a.timestamp
    return 0
  })

  // For compact mode, show only latest 3 completed + all pending
  const displayEvents = compact
    ? sortedEvents.slice(0, 4)
    : sortedEvents

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-muted" />

      <div className="space-y-0">
        {displayEvents.map((event, index) => {
          const Icon = getEventIcon(event.type)
          const isLatest = index === 0 && event.isCompleted
          const isCancelled = event.type === 'cancelled'

          return (
            <div key={event.id} className="flex gap-4 relative">
              {/* Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 transition-all ${
                  event.isCompleted
                    ? isCancelled
                      ? 'bg-red-500 text-white'
                      : isLatest
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                        : 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {event.isCompleted ? (
                  <Icon className="h-4 w-4" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 pb-6 ${!event.isCompleted && 'opacity-50'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`font-medium ${isLatest ? 'text-primary' : ''} ${isCancelled ? 'text-red-500' : ''}`}>
                      {language === 'id' ? event.titleId : event.title}
                    </p>
                    {event.isCompleted && (event.description || event.descriptionId) && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {language === 'id' ? event.descriptionId : event.description}
                      </p>
                    )}
                    {event.location && event.isCompleted && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </p>
                    )}
                  </div>
                  {event.isCompleted && event.timestamp > 0 && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatOrderDate(event.timestamp, language === 'id' ? 'id' : 'en')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {compact && events.length > 4 && (
        <p className="text-sm text-muted-foreground pl-12 mt-2">
          {language === 'id'
            ? `+${events.length - 4} aktivitas lainnya`
            : `+${events.length - 4} more activities`
          }
        </p>
      )}
    </div>
  )
}
