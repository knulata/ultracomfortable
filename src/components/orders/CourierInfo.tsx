'use client'

import { Truck, ExternalLink, Phone, Copy, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourierInfo as CourierInfoType } from '@/stores/orders'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

interface CourierInfoProps {
  courier: CourierInfoType
  showDriver?: boolean
}

// Courier logos/colors
const courierStyles: Record<string, { bg: string; text: string }> = {
  JNE: { bg: 'bg-red-50', text: 'text-red-600' },
  JNT: { bg: 'bg-red-50', text: 'text-red-500' },
  SICEPAT: { bg: 'bg-orange-50', text: 'text-orange-600' },
  ANTERAJA: { bg: 'bg-green-50', text: 'text-green-600' },
  GOJEK: { bg: 'bg-green-50', text: 'text-green-600' },
  GRAB: { bg: 'bg-green-50', text: 'text-green-600' },
}

export function CourierInfo({ courier, showDriver = true }: CourierInfoProps) {
  const { language } = useTranslation()
  const style = courierStyles[courier.code] || { bg: 'bg-muted', text: 'text-foreground' }

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(courier.trackingNumber)
    toast.success(language === 'id' ? 'Nomor resi disalin' : 'Tracking number copied')
  }

  const handleTrack = () => {
    if (courier.trackingUrl) {
      window.open(courier.trackingUrl, '_blank')
    }
  }

  const handleCallDriver = () => {
    if (courier.driverPhone) {
      window.location.href = `tel:${courier.driverPhone}`
    }
  }

  return (
    <div className="space-y-4">
      {/* Courier & Tracking */}
      <div className={`p-4 rounded-xl ${style.bg}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${style.text}`}>
            <Truck className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className={`font-semibold ${style.text}`}>{courier.name}</p>
            {courier.estimatedDelivery && (
              <p className="text-sm text-muted-foreground">
                {language === 'id' ? 'Estimasi:' : 'Est:'} {courier.estimatedDelivery}
              </p>
            )}
          </div>
        </div>

        {/* Tracking Number */}
        <div className="flex items-center gap-2 bg-white rounded-lg p-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">
              {language === 'id' ? 'Nomor Resi' : 'Tracking Number'}
            </p>
            <p className="font-mono font-semibold">{courier.trackingNumber}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleCopyTracking}>
            <Copy className="h-4 w-4" />
          </Button>
          {courier.trackingUrl && (
            <Button variant="ghost" size="icon" onClick={handleTrack}>
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>

        {courier.trackingUrl && (
          <Button
            variant="outline"
            className="w-full mt-3 bg-white"
            onClick={handleTrack}
          >
            <MapPin className="h-4 w-4 mr-2" />
            {language === 'id' ? 'Lacak di Website Kurir' : 'Track on Courier Website'}
          </Button>
        )}
      </div>

      {/* Driver Info */}
      {showDriver && courier.driverName && (
        <div className="p-4 rounded-xl border bg-muted/30">
          <p className="text-sm text-muted-foreground mb-2">
            {language === 'id' ? 'Kurir Pengiriman' : 'Delivery Driver'}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">
                  {courier.driverName.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium">{courier.driverName}</p>
                {courier.driverPhone && (
                  <p className="text-sm text-muted-foreground">{courier.driverPhone}</p>
                )}
              </div>
            </div>
            {courier.driverPhone && (
              <Button variant="outline" size="sm" onClick={handleCallDriver}>
                <Phone className="h-4 w-4 mr-2" />
                {language === 'id' ? 'Hubungi' : 'Call'}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
