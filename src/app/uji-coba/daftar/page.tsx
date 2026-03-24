'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft,
  User,
  Store,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTrialStore } from '@/stores/trial'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

type Step = 'info' | 'schedule' | 'confirm'

const timeSlots = [
  { value: '09:00-12:00', label: '09:00 - 12:00' },
  { value: '13:00-16:00', label: '13:00 - 16:00' },
  { value: '16:00-18:00', label: '16:00 - 18:00' },
]

export default function TrialRegisterPage() {
  const router = useRouter()
  const { language } = useTranslation()
  const { registerTrial, scheduleDropOff, getParticipantByWhatsapp } = useTrialStore()

  const [step, setStep] = useState<Step>('info')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form data
  const [ownerName, setOwnerName] = useState('')
  const [shopName, setShopName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [shopLocation, setShopLocation] = useState('')
  const [dropOffDate, setDropOffDate] = useState('')
  const [dropOffTime, setDropOffTime] = useState('')

  const validateInfo = () => {
    if (!ownerName.trim()) {
      toast.error(language === 'id' ? 'Masukkan nama Anda' : 'Enter your name')
      return false
    }
    if (!shopName.trim()) {
      toast.error(language === 'id' ? 'Masukkan nama toko' : 'Enter shop name')
      return false
    }
    if (!whatsapp.trim() || whatsapp.length < 10) {
      toast.error(language === 'id' ? 'Masukkan nomor WhatsApp valid' : 'Enter valid WhatsApp number')
      return false
    }
    if (!shopLocation.trim()) {
      toast.error(language === 'id' ? 'Masukkan lokasi toko' : 'Enter shop location')
      return false
    }

    // Check if already registered
    const existing = getParticipantByWhatsapp(whatsapp)
    if (existing) {
      toast.error(
        language === 'id'
          ? 'Nomor WhatsApp sudah terdaftar. Cek dashboard Anda.'
          : 'WhatsApp number already registered. Check your dashboard.'
      )
      return false
    }

    return true
  }

  const validateSchedule = () => {
    if (!dropOffDate) {
      toast.error(language === 'id' ? 'Pilih tanggal drop-off' : 'Select drop-off date')
      return false
    }
    if (!dropOffTime) {
      toast.error(language === 'id' ? 'Pilih waktu drop-off' : 'Select drop-off time')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (step === 'info' && validateInfo()) {
      setStep('schedule')
    } else if (step === 'schedule' && validateSchedule()) {
      setStep('confirm')
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500))

    // Register and schedule
    const id = registerTrial({
      ownerName,
      shopName,
      whatsapp,
      shopLocation,
    })
    scheduleDropOff(id, dropOffDate, dropOffTime)

    toast.success(
      language === 'id'
        ? 'Pendaftaran berhasil! Kami akan hubungi Anda via WhatsApp.'
        : 'Registration successful! We will contact you via WhatsApp.'
    )

    // Redirect to success page or dashboard
    router.push(`/uji-coba/dashboard?wa=${whatsapp}`)
  }

  // Get minimum date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  // Get maximum date (2 weeks from now)
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 14)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/uji-coba">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-semibold">
              {language === 'id' ? 'Daftar Uji Coba' : 'Register Trial'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {language === 'id' ? 'Program 10 Potong' : '10 Pieces Program'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-background px-4 py-4 border-b">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            {['info', 'schedule', 'confirm'].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s
                      ? 'bg-primary text-primary-foreground'
                      : ['info', 'schedule', 'confirm'].indexOf(step) > i
                      ? 'bg-green-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {['info', 'schedule', 'confirm'].indexOf(step) > i ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 2 && (
                  <div
                    className={`w-16 sm:w-24 h-1 mx-2 rounded ${
                      ['info', 'schedule', 'confirm'].indexOf(step) > i
                        ? 'bg-green-500'
                        : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{language === 'id' ? 'Info' : 'Info'}</span>
            <span>{language === 'id' ? 'Jadwal' : 'Schedule'}</span>
            <span>{language === 'id' ? 'Konfirmasi' : 'Confirm'}</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-lg mx-auto p-4">
        {step === 'info' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">
              {language === 'id' ? 'Informasi Anda' : 'Your Information'}
            </h2>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                {language === 'id' ? 'Nama Pemilik' : 'Owner Name'}
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder={language === 'id' ? 'Contoh: Ibu Dewi' : 'e.g., Mrs. Dewi'}
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Store className="h-4 w-4" />
                {language === 'id' ? 'Nama Toko' : 'Shop Name'}
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder={language === 'id' ? 'Contoh: Dewi Collection' : 'e.g., Dewi Collection'}
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4" />
                WhatsApp
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="08123456789"
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'id'
                  ? 'Update penjualan akan dikirim ke nomor ini'
                  : 'Sales updates will be sent to this number'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" />
                {language === 'id' ? 'Lokasi Toko di Tanah Abang' : 'Shop Location in Tanah Abang'}
              </label>
              <input
                type="text"
                value={shopLocation}
                onChange={(e) => setShopLocation(e.target.value)}
                placeholder={language === 'id' ? 'Contoh: Blok A Lt. 2 No. 45' : 'e.g., Block A Floor 2 No. 45'}
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button onClick={handleNext} className="w-full" size="lg">
              {language === 'id' ? 'Lanjut' : 'Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 'schedule' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">
              {language === 'id' ? 'Jadwal Drop-Off' : 'Drop-Off Schedule'}
            </h2>

            <div className="bg-primary/10 rounded-lg p-4 mb-4">
              <p className="text-sm">
                {language === 'id'
                  ? 'Bawa 10 potong barang Anda ke gudang UC di Tanah Abang pada jadwal yang Anda pilih.'
                  : 'Bring your 10 pieces to the Alyanoor warehouse in Tanah Abang at your selected schedule.'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4" />
                {language === 'id' ? 'Pilih Tanggal' : 'Select Date'}
              </label>
              <input
                type="date"
                value={dropOffDate}
                onChange={(e) => setDropOffDate(e.target.value)}
                min={minDate}
                max={maxDateStr}
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4" />
                {language === 'id' ? 'Pilih Waktu' : 'Select Time'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.value}
                    onClick={() => setDropOffTime(slot.value)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      dropOffTime === slot.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:border-primary/50'
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('info')} className="flex-1">
                {language === 'id' ? 'Kembali' : 'Back'}
              </Button>
              <Button onClick={handleNext} className="flex-1">
                {language === 'id' ? 'Lanjut' : 'Continue'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">
              {language === 'id' ? 'Konfirmasi Pendaftaran' : 'Confirm Registration'}
            </h2>

            <div className="bg-background border rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{language === 'id' ? 'Nama' : 'Name'}</span>
                <span className="font-medium">{ownerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{language === 'id' ? 'Toko' : 'Shop'}</span>
                <span className="font-medium">{shopName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">WhatsApp</span>
                <span className="font-medium">{whatsapp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{language === 'id' ? 'Lokasi' : 'Location'}</span>
                <span className="font-medium">{shopLocation}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === 'id' ? 'Drop-off' : 'Drop-off'}</span>
                  <span className="font-medium">
                    {new Date(dropOffDate).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-muted-foreground">{language === 'id' ? 'Waktu' : 'Time'}</span>
                  <span className="font-medium">{dropOffTime}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl p-4">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                {language === 'id' ? 'Yang Perlu Disiapkan:' : 'What to Prepare:'}
              </h3>
              <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                <li>✓ 10 {language === 'id' ? 'potong barang fashion wanita' : 'pieces of women fashion items'}</li>
                <li>✓ {language === 'id' ? 'Harga jual yang diinginkan per item' : 'Desired selling price per item'}</li>
                <li>✓ {language === 'id' ? 'KTP untuk verifikasi' : 'ID card for verification'}</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('schedule')} className="flex-1">
                {language === 'id' ? 'Kembali' : 'Back'}
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {language === 'id' ? 'Mendaftar...' : 'Registering...'}
                  </span>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {language === 'id' ? 'Konfirmasi' : 'Confirm'}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
