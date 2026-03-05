'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Clock, MessageSquare, Phone, MapPin, Building2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePartnerStore, Partner } from '@/stores/partner'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

const statusColors: Record<Partner['status'], string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  rejected: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
}

const statusLabels: Record<Partner['status'], { en: string; id: string }> = {
  pending: { en: 'Pending Review', id: 'Menunggu Review' },
  approved: { en: 'Approved', id: 'Disetujui' },
  active: { en: 'Active', id: 'Aktif' },
  suspended: { en: 'Suspended', id: 'Ditangguhkan' },
  rejected: { en: 'Rejected', id: 'Ditolak' },
}

interface PartnerDetailModalProps {
  partner: Partner
  onClose: () => void
  onApprove: () => void
  onReject: (reason: string) => void
}

function PartnerDetailModal({ partner, onClose, onApprove, onReject }: PartnerDetailModalProps) {
  const { language } = useTranslation()
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{partner.shopName}</h2>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[partner.status]}`}>
              {language === 'id' ? statusLabels[partner.status].id : statusLabels[partner.status].en}
            </span>
          </div>

          {/* Owner Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {partner.ownerName.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium">{partner.ownerName}</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'id' ? 'Pemilik' : 'Owner'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{partner.phone}</span>
              {partner.whatsapp !== partner.phone && (
                <span className="text-muted-foreground">| WA: {partner.whatsapp}</span>
              )}
            </div>

            {partner.email && (
              <div className="flex items-center gap-3 text-sm">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span>{partner.email}</span>
              </div>
            )}

            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{partner.shopAddress}, Pasar Tanah Abang</span>
            </div>
          </div>

          {/* Bank Info */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {language === 'id' ? 'Rekening Bank' : 'Bank Account'}
              </span>
            </div>
            <p className="text-sm">{partner.bankName}</p>
            <p className="text-sm font-mono">{partner.bankAccountNumber}</p>
            <p className="text-sm text-muted-foreground">a.n. {partner.bankAccountName}</p>
          </div>

          {/* Commission */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm">
                {language === 'id' ? 'Komisi' : 'Commission Rate'}
              </span>
              <span className="text-xl font-bold text-primary">{partner.commissionRate}%</span>
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-xs text-muted-foreground mb-6">
            <p>
              {language === 'id' ? 'Mendaftar:' : 'Applied:'}{' '}
              {new Date(partner.appliedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            {partner.approvedAt && (
              <p>
                {language === 'id' ? 'Disetujui:' : 'Approved:'}{' '}
                {new Date(partner.approvedAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>

          {/* Actions */}
          {partner.status === 'pending' && (
            <div className="space-y-3">
              {showRejectForm ? (
                <div className="space-y-2">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder={language === 'id' ? 'Alasan penolakan...' : 'Rejection reason...'}
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-destructive h-24 resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowRejectForm(false)}
                      className="flex-1"
                    >
                      {language === 'id' ? 'Batal' : 'Cancel'}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onReject(rejectReason)}
                      className="flex-1"
                      disabled={!rejectReason.trim()}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {language === 'id' ? 'Tolak' : 'Reject'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectForm(true)}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {language === 'id' ? 'Tolak' : 'Reject'}
                  </Button>
                  <Button onClick={onApprove} className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {language === 'id' ? 'Setujui' : 'Approve'}
                  </Button>
                </div>
              )}
            </div>
          )}

          <Button variant="ghost" onClick={onClose} className="w-full mt-3">
            {language === 'id' ? 'Tutup' : 'Close'}
          </Button>
        </div>
      </div>
    </div>
  )
}

type FilterStatus = 'all' | Partner['status']

export function PartnerApprovalList() {
  const { language } = useTranslation()
  const { partners, updatePartnerStatus } = usePartnerStore()
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)

  const filteredPartners = partners.filter((p) => filter === 'all' || p.status === filter)

  const handleApprove = (partner: Partner) => {
    updatePartnerStatus(partner.id, 'active')
    toast.success(
      language === 'id'
        ? `${partner.shopName} berhasil disetujui!`
        : `${partner.shopName} has been approved!`
    )
    setSelectedPartner(null)
  }

  const handleReject = (partner: Partner, reason: string) => {
    updatePartnerStatus(partner.id, 'rejected', reason)
    toast.success(
      language === 'id'
        ? `${partner.shopName} telah ditolak`
        : `${partner.shopName} has been rejected`
    )
    setSelectedPartner(null)
  }

  const pendingCount = partners.filter((p) => p.status === 'pending').length

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'pending', 'active', 'suspended', 'rejected'] as FilterStatus[]).map((status) => {
          const count = status === 'all'
            ? partners.length
            : partners.filter((p) => p.status === status).length

          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {status === 'all'
                ? (language === 'id' ? 'Semua' : 'All')
                : (language === 'id' ? statusLabels[status].id : statusLabels[status].en)
              }
              {' '}({count})
            </button>
          )
        })}
      </div>

      {/* Pending Alert */}
      {pendingCount > 0 && filter !== 'pending' && (
        <button
          onClick={() => setFilter('pending')}
          className="w-full p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-300 flex items-center justify-center gap-2"
        >
          <Clock className="h-4 w-4" />
          {pendingCount} {language === 'id' ? 'partner menunggu review' : 'partners pending review'}
        </button>
      )}

      {/* Partner List */}
      {filteredPartners.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {language === 'id' ? 'Tidak ada partner' : 'No partners found'}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="bg-background border rounded-xl p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-semibold text-primary">
                      {partner.shopName.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold truncate">{partner.shopName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[partner.status]}`}>
                        {language === 'id' ? statusLabels[partner.status].id : statusLabels[partner.status].en}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{partner.ownerName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {partner.shopAddress}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPartner(partner)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              {partner.status === 'pending' && (
                <div className="flex gap-2 mt-3 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPartner(partner)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {language === 'id' ? 'Review' : 'Review'}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(partner)}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {language === 'id' ? 'Setujui' : 'Approve'}
                  </Button>
                </div>
              )}

              {partner.status === 'rejected' && partner.statusNote && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">{language === 'id' ? 'Alasan:' : 'Reason:'}</span>{' '}
                    {partner.statusNote}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedPartner && (
        <PartnerDetailModal
          partner={selectedPartner}
          onClose={() => setSelectedPartner(null)}
          onApprove={() => handleApprove(selectedPartner)}
          onReject={(reason) => handleReject(selectedPartner, reason)}
        />
      )}
    </div>
  )
}
