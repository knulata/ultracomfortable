'use client'

import { Phone, MapPin, Calendar, ShoppingBag, TrendingUp, MessageCircle, MoreVertical, Check, X, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reseller, useResellerStore, RESELLER_TIERS } from '@/stores/reseller'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

interface ResellerCardProps {
  reseller: Reseller
  onViewDetails?: () => void
}

export function ResellerCard({ reseller, onViewDetails }: ResellerCardProps) {
  const { language } = useTranslation()
  const { getResellerTier, updateResellerStatus } = useResellerStore()

  const tier = getResellerTier(reseller)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const handleApprove = () => {
    updateResellerStatus(reseller.id, 'approved')
    toast.success(language === 'id' ? 'Reseller disetujui!' : 'Reseller approved!')
  }

  const handleReject = () => {
    updateResellerStatus(reseller.id, 'rejected')
    toast.success(language === 'id' ? 'Reseller ditolak' : 'Reseller rejected')
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      language === 'id'
        ? `Halo ${reseller.name}, terima kasih telah menjadi reseller kami!`
        : `Hello ${reseller.name}, thank you for being our reseller!`
    )
    window.open(`https://wa.me/62${reseller.whatsapp.replace(/^0/, '')}?text=${message}`, '_blank')
  }

  const statusBadge = () => {
    switch (reseller.status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            <Clock className="h-3 w-3" />
            {language === 'id' ? 'Menunggu' : 'Pending'}
          </span>
        )
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            <Check className="h-3 w-3" />
            {language === 'id' ? 'Aktif' : 'Active'}
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
            <X className="h-3 w-3" />
            {language === 'id' ? 'Ditolak' : 'Rejected'}
          </span>
        )
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
            {language === 'id' ? 'Ditangguhkan' : 'Suspended'}
          </span>
        )
    }
  }

  return (
    <div className="bg-background border rounded-xl p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{reseller.businessName}</h3>
            {statusBadge()}
          </div>
          <p className="text-sm text-muted-foreground">{reseller.name}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${tier.color}`}>
          {tier.badge} {language === 'id' ? tier.nameId : tier.name}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-1.5 text-sm mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-3.5 w-3.5" />
          <span>{reseller.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">{reseller.address}, {reseller.city}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{language === 'id' ? 'Bergabung' : 'Joined'}: {formatDate(reseller.joinedAt)}</span>
        </div>
      </div>

      {/* Stats */}
      {reseller.status === 'approved' && (
        <div className="grid grid-cols-3 gap-3 py-3 border-y mb-4">
          <div className="text-center">
            <p className="text-lg font-bold">{reseller.totalOrders}</p>
            <p className="text-xs text-muted-foreground">
              {language === 'id' ? 'Total Order' : 'Total Orders'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{reseller.ordersThisMonth}</p>
            <p className="text-xs text-muted-foreground">
              {language === 'id' ? 'Bulan Ini' : 'This Month'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-green-600">{formatPrice(reseller.totalSpent)}</p>
            <p className="text-xs text-muted-foreground">
              {language === 'id' ? 'Total Belanja' : 'Total Spent'}
            </p>
          </div>
        </div>
      )}

      {/* Notes */}
      {reseller.notes && (
        <p className="text-xs text-muted-foreground italic mb-4 p-2 bg-muted/50 rounded">
          📝 {reseller.notes}
        </p>
      )}

      {/* Actions */}
      {reseller.status === 'pending' ? (
        <div className="flex gap-2">
          <Button onClick={handleApprove} size="sm" className="flex-1">
            <Check className="h-4 w-4 mr-1" />
            {language === 'id' ? 'Setujui' : 'Approve'}
          </Button>
          <Button onClick={handleReject} size="sm" variant="outline" className="flex-1">
            <X className="h-4 w-4 mr-1" />
            {language === 'id' ? 'Tolak' : 'Reject'}
          </Button>
        </div>
      ) : reseller.status === 'approved' ? (
        <div className="flex gap-2">
          <Button onClick={openWhatsApp} size="sm" variant="outline" className="flex-1">
            <MessageCircle className="h-4 w-4 mr-1" />
            WhatsApp
          </Button>
          {onViewDetails && (
            <Button onClick={onViewDetails} size="sm" variant="ghost">
              <MoreVertical className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : null}
    </div>
  )
}
