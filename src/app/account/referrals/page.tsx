'use client'

import { useState } from 'react'
import {
  Gift,
  Users,
  Copy,
  Check,
  Share2,
  MessageCircle,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { useReferralStore, REFERRAL_CONFIG } from '@/stores/referral'
import { toast } from 'sonner'

export default function ReferralsPage() {
  const { language } = useTranslation()
  const {
    referralCode,
    referrals,
    totalReferrals,
    successfulReferrals,
    totalPointsEarned,
    getReferralLink
  } = useReferralStore()

  const [copied, setCopied] = useState(false)

  const referralLink = getReferralLink()

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    toast.success(language === 'id' ? 'Kode disalin!' : 'Code copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast.success(language === 'id' ? 'Link disalin!' : 'Link copied!')
  }

  const shareVia = (platform: 'whatsapp' | 'email' | 'twitter') => {
    const message = language === 'id'
      ? `Hai! Pakai kode referral saya ${referralCode} untuk dapat diskon 10% di UC. Daftar di: ${referralLink}`
      : `Hey! Use my referral code ${referralCode} to get 10% off at UC. Sign up here: ${referralLink}`

    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
      email: `mailto:?subject=${encodeURIComponent('Join UC!')}&body=${encodeURIComponent(message)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
    }

    window.open(urls[platform], '_blank')
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date))
  }

  const getStatusBadge = (status: 'pending' | 'completed' | 'expired') => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-green-100 text-green-700',
      expired: 'bg-gray-100 text-gray-600',
    }
    const labels = {
      pending: { en: 'Pending', id: 'Menunggu' },
      completed: { en: 'Completed', id: 'Selesai' },
      expired: { en: 'Expired', id: 'Kadaluarsa' },
    }
    const icons = {
      pending: Clock,
      completed: CheckCircle,
      expired: XCircle,
    }
    const Icon = icons[status]

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        <Icon className="h-3 w-3" />
        {labels[status][language === 'id' ? 'id' : 'en']}
      </span>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          {language === 'id' ? 'Program Referral' : 'Referral Program'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === 'id'
            ? 'Ajak teman dan dapatkan hadiah bersama'
            : 'Invite friends and earn rewards together'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 text-center">
          <Users className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold">{totalReferrals}</p>
          <p className="text-xs text-muted-foreground">
            {language === 'id' ? 'Total Undangan' : 'Total Invites'}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl p-4 text-center">
          <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{successfulReferrals}</p>
          <p className="text-xs text-muted-foreground">
            {language === 'id' ? 'Berhasil' : 'Successful'}
          </p>
        </div>
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-xl p-4 text-center">
          <Sparkles className="h-6 w-6 text-amber-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{totalPointsEarned.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">
            {language === 'id' ? 'Points Didapat' : 'Points Earned'}
          </p>
        </div>
      </div>

      {/* Referral Code Card */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">
              {language === 'id' ? 'Kode Referral Kamu' : 'Your Referral Code'}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold tracking-wider">{referralCode}</span>
              <button
                onClick={copyCode}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <Gift className="h-12 w-12 opacity-50" />
        </div>

        {/* Share Buttons */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <p className="text-sm opacity-90 mb-3">
            {language === 'id' ? 'Bagikan via:' : 'Share via:'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => shareVia('whatsapp')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </button>
            <button
              onClick={() => shareVia('email')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
            >
              <Copy className="h-4 w-4" />
              {language === 'id' ? 'Salin Link' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-muted/50 rounded-xl p-6">
        <h2 className="font-semibold mb-4">
          {language === 'id' ? 'Cara Kerja' : 'How It Works'}
        </h2>
        <div className="space-y-4">
          {[
            {
              step: 1,
              title: language === 'id' ? 'Bagikan Kode' : 'Share Your Code',
              desc: language === 'id'
                ? 'Kirim kode referral kamu ke teman-teman'
                : 'Send your referral code to friends',
            },
            {
              step: 2,
              title: language === 'id' ? 'Teman Mendaftar' : 'Friend Signs Up',
              desc: language === 'id'
                ? `Teman dapat ${REFERRAL_CONFIG.refereePoints} points & diskon ${REFERRAL_CONFIG.refereeDiscount}%`
                : `Friend gets ${REFERRAL_CONFIG.refereePoints} points & ${REFERRAL_CONFIG.refereeDiscount}% off`,
            },
            {
              step: 3,
              title: language === 'id' ? 'Teman Berbelanja' : 'Friend Makes Purchase',
              desc: language === 'id'
                ? `Min. belanja Rp ${REFERRAL_CONFIG.minOrderValue.toLocaleString('id-ID')}`
                : `Min. order Rp ${REFERRAL_CONFIG.minOrderValue.toLocaleString('id-ID')}`,
            },
            {
              step: 4,
              title: language === 'id' ? 'Kamu Dapat Hadiah!' : 'You Get Rewarded!',
              desc: language === 'id'
                ? `Dapat ${REFERRAL_CONFIG.referrerPoints} UC Points per referral`
                : `Earn ${REFERRAL_CONFIG.referrerPoints} UC Points per referral`,
            },
          ].map((item, index, arr) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                {item.step}
              </div>
              <div className="flex-1 pt-1">
                <h3 className="font-medium text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              {index < arr.length - 1 && (
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Referral History */}
      <div>
        <h2 className="font-semibold mb-4">
          {language === 'id' ? 'Riwayat Referral' : 'Referral History'}
        </h2>

        {referrals.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-xl">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {language === 'id'
                ? 'Belum ada referral. Mulai ajak teman!'
                : 'No referrals yet. Start inviting friends!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-4 bg-background border rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {referral.referredUserName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{referral.referredUserName}</p>
                    <p className="text-xs text-muted-foreground">
                      {referral.referredUserEmail} • {formatDate(referral.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(referral.status)}
                  {referral.status === 'completed' && (
                    <p className="text-xs text-green-600 mt-1">
                      +{referral.pointsEarned} points
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Terms */}
      <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-4">
        <p className="font-medium mb-2">
          {language === 'id' ? 'Syarat & Ketentuan:' : 'Terms & Conditions:'}
        </p>
        <ul className="space-y-1 list-disc list-inside">
          <li>
            {language === 'id'
              ? `Referral selesai setelah teman melakukan pembelian min. Rp ${REFERRAL_CONFIG.minOrderValue.toLocaleString('id-ID')}`
              : `Referral completes when friend makes a purchase of min. Rp ${REFERRAL_CONFIG.minOrderValue.toLocaleString('id-ID')}`}
          </li>
          <li>
            {language === 'id'
              ? `Referral kadaluarsa setelah ${REFERRAL_CONFIG.expiryDays} hari jika tidak ada pembelian`
              : `Referral expires after ${REFERRAL_CONFIG.expiryDays} days if no purchase is made`}
          </li>
          <li>
            {language === 'id'
              ? 'Points dapat digunakan untuk potongan harga (100 points = Rp 1.000)'
              : 'Points can be redeemed for discounts (100 points = Rp 1,000)'}
          </li>
        </ul>
      </div>
    </div>
  )
}
