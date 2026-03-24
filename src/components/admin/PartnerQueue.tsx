'use client'

import { useState } from 'react'
import {
  Users,
  CheckCircle,
  XCircle,
  Store,
  Phone,
  Mail,
  Clock,
  Eye,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePartnerStore, Partner } from '@/stores/partner'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

interface PartnerDetailModalProps {
  partner: Partner
  onClose: () => void
  onApprove: () => void
  onReject: () => void
}

function PartnerDetailModal({ partner, onClose, onApprove, onReject }: PartnerDetailModalProps) {
  const { language } = useTranslation()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApprove = async () => {
    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 500))
    onApprove()
    setIsProcessing(false)
  }

  const handleReject = async () => {
    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 500))
    onReject()
    setIsProcessing(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            {language === 'id' ? 'Detail Partner' : 'Partner Details'}
          </h2>

          {/* Shop Info */}
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <Store className="h-5 w-5 text-primary" />
              <span className="font-semibold">{partner.shopName}</span>
            </div>
            <p className="text-sm text-muted-foreground">{partner.shopAddress}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'id' ? 'Lokasi' : 'Location'}: {partner.block && `Blok ${partner.block}`}{partner.floor && `, Lt. ${partner.floor}`}
            </p>
          </div>

          {/* Owner Info */}
          <div className="space-y-3 mb-4">
            <h4 className="font-medium text-sm">
              {language === 'id' ? 'Informasi Pemilik' : 'Owner Information'}
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">{language === 'id' ? 'Nama' : 'Name'}</p>
                <p className="font-medium">{partner.ownerName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{language === 'id' ? 'No. Toko' : 'Shop No.'}</p>
                <p className="font-medium font-mono">{partner.shopNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" /> WhatsApp
                </p>
                <p className="font-medium">{partner.whatsapp}</p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Email
                </p>
                <p className="font-medium">{partner.email}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2 mb-4">
            <h4 className="font-medium text-sm">
              {language === 'id' ? 'Lokasi Toko' : 'Shop Location'}
            </h4>
            <p className="text-sm">{partner.shopAddress}</p>
            <p className="text-xs text-muted-foreground">
              {partner.block && `Blok ${partner.block}`}
              {partner.floor && `, Lt. ${partner.floor}`}
            </p>
          </div>

          {/* Bank Info */}
          <div className="space-y-2 mb-4">
            <h4 className="font-medium text-sm">
              {language === 'id' ? 'Rekening Bank' : 'Bank Account'}
            </h4>
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <p className="font-medium">{partner.bankName}</p>
              <p className="font-mono">{partner.bankAccountNumber}</p>
              <p className="text-muted-foreground">a.n. {partner.bankAccountName}</p>
            </div>
          </div>

          {/* Commission Rate */}
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg mb-6">
            <span className="text-sm">{language === 'id' ? 'Komisi UC' : 'Alyanoor Commission'}</span>
            <span className="font-bold text-primary">{partner.commissionRate}%</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              {language === 'id' ? 'Tutup' : 'Close'}
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isProcessing}
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              {language === 'id' ? 'Tolak' : 'Reject'}
            </Button>
            <Button onClick={handleApprove} disabled={isProcessing} className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              {language === 'id' ? 'Setujui' : 'Approve'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PartnerQueue() {
  const { language } = useTranslation()
  const { partners, updatePartnerStatus } = usePartnerStore()
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)

  const pendingPartners = partners.filter((p) => p.status === 'pending')

  const handleApprove = (partner: Partner) => {
    updatePartnerStatus(partner.id, 'active')
    toast.success(
      language === 'id'
        ? `${partner.shopName} berhasil disetujui!`
        : `${partner.shopName} approved successfully!`
    )
    setSelectedPartner(null)
  }

  const handleReject = (partner: Partner) => {
    updatePartnerStatus(partner.id, 'rejected', 'Dokumen tidak lengkap')
    toast.error(
      language === 'id'
        ? `${partner.shopName} ditolak`
        : `${partner.shopName} rejected`
    )
    setSelectedPartner(null)
  }

  if (pendingPartners.length === 0) {
    return (
      <div className="bg-background rounded-xl p-6 border text-center">
        <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-50" />
        <p className="text-muted-foreground">
          {language === 'id' ? 'Tidak ada partner menunggu approval' : 'No partners awaiting approval'}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-background rounded-xl border overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            {language === 'id' ? 'Partner Menunggu Approval' : 'Partners Awaiting Approval'}
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs">
              {pendingPartners.length}
            </span>
          </h3>
        </div>

        <div className="divide-y">
          {pendingPartners.map((partner) => (
            <div
              key={partner.id}
              className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => setSelectedPartner(partner)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{partner.shopName}</p>
                    <p className="text-sm text-muted-foreground">{partner.ownerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(partner.appliedAt).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPartner && (
        <PartnerDetailModal
          partner={selectedPartner}
          onClose={() => setSelectedPartner(null)}
          onApprove={() => handleApprove(selectedPartner)}
          onReject={() => handleReject(selectedPartner)}
        />
      )}
    </>
  )
}
