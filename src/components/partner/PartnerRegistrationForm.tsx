'use client'

import { useState } from 'react'
import { Store, User, Phone, MapPin, Building2, CreditCard, Percent, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePartnerStore } from '@/stores/partner'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

interface FormData {
  ownerName: string
  shopName: string
  phone: string
  whatsapp: string
  email: string
  block: string
  floor: string
  shopNumber: string
  bankName: string
  bankAccountNumber: string
  bankAccountName: string
}

const initialFormData: FormData = {
  ownerName: '',
  shopName: '',
  phone: '',
  whatsapp: '',
  email: '',
  block: '',
  floor: '',
  shopNumber: '',
  bankName: '',
  bankAccountNumber: '',
  bankAccountName: '',
}

const BANK_OPTIONS = ['BCA', 'Mandiri', 'BRI', 'BNI', 'CIMB Niaga', 'Permata', 'Danamon', 'BSI', 'Lainnya']
const BLOCK_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Metro', 'Aula', 'Lainnya']
const FLOOR_OPTIONS = ['LG', '1', '2', '3', '4', '5', '6']

export function PartnerRegistrationForm() {
  const { language } = useTranslation()
  const { addPartner } = usePartnerStore()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateStep = (stepNum: number): boolean => {
    switch (stepNum) {
      case 1:
        if (!formData.ownerName || !formData.shopName || !formData.phone) {
          toast.error(language === 'id' ? 'Lengkapi semua data' : 'Please fill all fields')
          return false
        }
        return true
      case 2:
        if (!formData.block || !formData.floor || !formData.shopNumber) {
          toast.error(language === 'id' ? 'Lengkapi lokasi toko' : 'Please fill shop location')
          return false
        }
        return true
      case 3:
        if (!formData.bankName || !formData.bankAccountNumber || !formData.bankAccountName) {
          toast.error(language === 'id' ? 'Lengkapi data bank' : 'Please fill bank details')
          return false
        }
        return true
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const shopAddress = `Blok ${formData.block} Lt. ${formData.floor} No. ${formData.shopNumber}`

    addPartner({
      ownerName: formData.ownerName,
      shopName: formData.shopName,
      phone: formData.phone,
      whatsapp: formData.whatsapp || formData.phone,
      email: formData.email || undefined,
      shopAddress,
      block: formData.block,
      floor: formData.floor,
      shopNumber: formData.shopNumber,
      bankName: formData.bankName,
      bankAccountNumber: formData.bankAccountNumber,
      bankAccountName: formData.bankAccountName,
      commissionRate: 15, // Default 15%
      status: 'pending',
    })

    setIsSubmitting(false)
    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">
          {language === 'id' ? 'Pendaftaran Berhasil!' : 'Registration Successful!'}
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {language === 'id'
            ? 'Terima kasih telah mendaftar sebagai partner UC. Tim kami akan menghubungi Anda dalam 1-2 hari kerja untuk verifikasi.'
            : 'Thank you for registering as a AlyaNoor partner. Our team will contact you within 1-2 business days for verification.'
          }
        </p>
        <div className="bg-muted/50 rounded-lg p-4 max-w-sm mx-auto">
          <p className="text-sm text-muted-foreground mb-2">
            {language === 'id' ? 'Langkah selanjutnya:' : 'Next steps:'}
          </p>
          <ol className="text-sm text-left space-y-2">
            <li className="flex items-start gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">1</span>
              <span>{language === 'id' ? 'Verifikasi WhatsApp dari tim UC' : 'WhatsApp verification from AlyaNoor team'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">2</span>
              <span>{language === 'id' ? 'Tanda tangan perjanjian kerjasama' : 'Sign partnership agreement'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">3</span>
              <span>{language === 'id' ? 'Mulai drop barang ke gudang UC' : 'Start dropping items at AlyaNoor warehouse'}</span>
            </li>
          </ol>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              s < step
                ? 'bg-green-500 text-white'
                : s === step
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}>
              {s < step ? '✓' : s}
            </div>
            {s < 3 && (
              <div className={`w-16 sm:w-24 h-1 mx-2 rounded ${
                s < step ? 'bg-green-500' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              {language === 'id' ? 'Informasi Pemilik & Toko' : 'Owner & Shop Information'}
            </h2>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              {language === 'id' ? 'Nama Pemilik' : 'Owner Name'} *
            </label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => updateField('ownerName', e.target.value)}
              placeholder="Haji Muhammad Yusuf"
              className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              {language === 'id' ? 'Nama Toko' : 'Shop Name'} *
            </label>
            <input
              type="text"
              value={formData.shopName}
              onChange={(e) => updateField('shopName', e.target.value)}
              placeholder="Toko Kain Berkah"
              className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              {language === 'id' ? 'Nomor HP' : 'Phone Number'} *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="081234567890"
              className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              {language === 'id' ? 'Nomor WhatsApp' : 'WhatsApp Number'}
            </label>
            <input
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => updateField('whatsapp', e.target.value)}
              placeholder={language === 'id' ? 'Sama dengan HP jika kosong' : 'Same as phone if empty'}
              className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              Email ({language === 'id' ? 'opsional' : 'optional'})
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="toko@email.com"
              className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Button onClick={nextStep} className="w-full" size="lg">
            {language === 'id' ? 'Lanjutkan' : 'Continue'}
          </Button>
        </div>
      )}

      {/* Step 2: Location */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              {language === 'id' ? 'Lokasi Toko di Tanah Abang' : 'Shop Location in Tanah Abang'}
            </h2>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              Blok *
            </label>
            <select
              value={formData.block}
              onChange={(e) => updateField('block', e.target.value)}
              className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{language === 'id' ? 'Pilih Blok' : 'Select Block'}</option>
              {BLOCK_OPTIONS.map((block) => (
                <option key={block} value={block}>Blok {block}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              {language === 'id' ? 'Lantai' : 'Floor'} *
            </label>
            <select
              value={formData.floor}
              onChange={(e) => updateField('floor', e.target.value)}
              className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{language === 'id' ? 'Pilih Lantai' : 'Select Floor'}</option>
              {FLOOR_OPTIONS.map((floor) => (
                <option key={floor} value={floor}>
                  {floor === 'LG' ? 'LG (Lower Ground)' : `Lantai ${floor}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              {language === 'id' ? 'Nomor Toko' : 'Shop Number'} *
            </label>
            <input
              type="text"
              value={formData.shopNumber}
              onChange={(e) => updateField('shopNumber', e.target.value)}
              placeholder="15-16"
              className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <p className="font-medium mb-1">
              {language === 'id' ? 'Alamat Lengkap:' : 'Full Address:'}
            </p>
            <p className="text-muted-foreground">
              {formData.block && formData.floor && formData.shopNumber
                ? `Blok ${formData.block} Lt. ${formData.floor} No. ${formData.shopNumber}, Pasar Tanah Abang`
                : (language === 'id' ? 'Lengkapi data di atas' : 'Fill in the data above')
              }
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={prevStep} variant="outline" className="flex-1" size="lg">
              {language === 'id' ? 'Kembali' : 'Back'}
            </Button>
            <Button onClick={nextStep} className="flex-1" size="lg">
              {language === 'id' ? 'Lanjutkan' : 'Continue'}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Bank Details */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              {language === 'id' ? 'Rekening Bank untuk Pencairan' : 'Bank Account for Payouts'}
            </h2>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              {language === 'id' ? 'Nama Bank' : 'Bank Name'} *
            </label>
            <select
              value={formData.bankName}
              onChange={(e) => updateField('bankName', e.target.value)}
              className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{language === 'id' ? 'Pilih Bank' : 'Select Bank'}</option>
              {BANK_OPTIONS.map((bank) => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              {language === 'id' ? 'Nomor Rekening' : 'Account Number'} *
            </label>
            <input
              type="text"
              value={formData.bankAccountNumber}
              onChange={(e) => updateField('bankAccountNumber', e.target.value)}
              placeholder="1234567890"
              className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              {language === 'id' ? 'Nama Pemilik Rekening' : 'Account Holder Name'} *
            </label>
            <input
              type="text"
              value={formData.bankAccountName}
              onChange={(e) => updateField('bankAccountName', e.target.value)}
              placeholder="Muhammad Yusuf"
              className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm">
            <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">
              ⚠️ {language === 'id' ? 'Penting' : 'Important'}
            </p>
            <p className="text-amber-700 dark:text-amber-300">
              {language === 'id'
                ? 'Pastikan nama rekening sesuai dengan nama pemilik toko untuk kelancaran pencairan.'
                : 'Make sure the account name matches the shop owner name for smooth payouts.'
              }
            </p>
          </div>

          {/* Commission Info */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="h-5 w-5 text-primary" />
              <span className="font-semibold">
                {language === 'id' ? 'Komisi UC' : 'AlyaNoor Commission'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {language === 'id'
                ? 'UC mengambil komisi 15% dari setiap penjualan. Ini mencakup:'
                : 'UC takes 15% commission from each sale. This includes:'
              }
            </p>
            <ul className="text-sm space-y-1">
              <li>✓ {language === 'id' ? 'Foto produk profesional' : 'Professional product photography'}</li>
              <li>✓ {language === 'id' ? 'Upload & kelola listing' : 'Upload & manage listings'}</li>
              <li>✓ {language === 'id' ? 'Penyimpanan di gudang' : 'Warehouse storage'}</li>
              <li>✓ {language === 'id' ? 'Quality control sebelum kirim' : 'Quality control before shipping'}</li>
              <li>✓ {language === 'id' ? 'Packing & labeling' : 'Packing & labeling'}</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button onClick={prevStep} variant="outline" className="flex-1" size="lg">
              {language === 'id' ? 'Kembali' : 'Back'}
            </Button>
            <Button onClick={handleSubmit} className="flex-1" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {language === 'id' ? 'Mendaftar...' : 'Registering...'}
                </span>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {language === 'id' ? 'Daftar Sekarang' : 'Register Now'}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
