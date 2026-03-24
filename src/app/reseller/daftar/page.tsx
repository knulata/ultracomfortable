'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft,
  User,
  Store,
  Phone,
  Mail,
  MapPin,
  Building,
  CheckCircle,
  ArrowRight,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useResellerStore } from '@/stores/reseller'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

type Step = 'personal' | 'business' | 'confirm'

export default function ResellerRegisterPage() {
  const router = useRouter()
  const { language } = useTranslation()
  const { addReseller, resellers } = useResellerStore()

  const [step, setStep] = useState<Step>('personal')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form data
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  const validatePersonal = () => {
    if (!name.trim()) {
      toast.error(language === 'id' ? 'Masukkan nama lengkap' : 'Enter your full name')
      return false
    }
    if (!phone.trim() || phone.length < 10) {
      toast.error(language === 'id' ? 'Masukkan nomor HP valid' : 'Enter valid phone number')
      return false
    }
    if (!whatsapp.trim() || whatsapp.length < 10) {
      toast.error(language === 'id' ? 'Masukkan nomor WhatsApp valid' : 'Enter valid WhatsApp number')
      return false
    }

    // Check if already registered
    const existing = resellers.find((r) => r.phone === phone || r.whatsapp === whatsapp)
    if (existing) {
      toast.error(
        language === 'id'
          ? 'Nomor HP/WhatsApp sudah terdaftar. Hubungi admin untuk info.'
          : 'Phone/WhatsApp already registered. Contact admin for info.'
      )
      return false
    }

    return true
  }

  const validateBusiness = () => {
    if (!businessName.trim()) {
      toast.error(language === 'id' ? 'Masukkan nama toko/bisnis' : 'Enter business name')
      return false
    }
    if (!address.trim()) {
      toast.error(language === 'id' ? 'Masukkan alamat lengkap' : 'Enter full address')
      return false
    }
    if (!city.trim()) {
      toast.error(language === 'id' ? 'Masukkan kota' : 'Enter city')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (step === 'personal' && validatePersonal()) {
      setStep('business')
    } else if (step === 'business' && validateBusiness()) {
      setStep('confirm')
    }
  }

  const handleSubmit = async () => {
    if (!agreeTerms) {
      toast.error(
        language === 'id'
          ? 'Anda harus menyetujui syarat dan ketentuan'
          : 'You must agree to terms and conditions'
      )
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500))

    // Register reseller
    addReseller({
      name,
      businessName,
      phone,
      whatsapp,
      email: email || undefined,
      address,
      city,
      tierId: 'bronze',
      status: 'pending',
      notes: businessType ? `Jenis usaha: ${businessType}` : undefined,
    })

    toast.success(
      language === 'id'
        ? 'Pendaftaran berhasil! Tim kami akan menghubungi Anda dalam 1-2 hari kerja.'
        : 'Registration successful! Our team will contact you within 1-2 business days.'
    )

    // Redirect to success/dashboard
    router.push('/reseller/dashboard')
  }

  const businessTypes = [
    { value: 'offline', label: language === 'id' ? 'Toko Offline' : 'Offline Store' },
    { value: 'online', label: language === 'id' ? 'Toko Online' : 'Online Store' },
    { value: 'both', label: language === 'id' ? 'Keduanya' : 'Both' },
    { value: 'dropship', label: 'Dropshipper' },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/reseller">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-semibold">
              {language === 'id' ? 'Daftar Reseller' : 'Reseller Registration'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {language === 'id' ? 'Bergabung dengan jaringan reseller UC' : 'Join the Alyanoor reseller network'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-background px-4 py-4 border-b">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            {['personal', 'business', 'confirm'].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s
                      ? 'bg-primary text-primary-foreground'
                      : ['personal', 'business', 'confirm'].indexOf(step) > i
                      ? 'bg-green-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {['personal', 'business', 'confirm'].indexOf(step) > i ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 2 && (
                  <div
                    className={`w-16 sm:w-24 h-1 mx-2 rounded ${
                      ['personal', 'business', 'confirm'].indexOf(step) > i
                        ? 'bg-green-500'
                        : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{language === 'id' ? 'Data Diri' : 'Personal'}</span>
            <span>{language === 'id' ? 'Bisnis' : 'Business'}</span>
            <span>{language === 'id' ? 'Konfirmasi' : 'Confirm'}</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-lg mx-auto p-4">
        {step === 'personal' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">
              {language === 'id' ? 'Data Diri' : 'Personal Information'}
            </h2>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                {language === 'id' ? 'Nama Lengkap' : 'Full Name'} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'id' ? 'Contoh: Siti Aminah' : 'e.g., Siti Aminah'}
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4" />
                {language === 'id' ? 'Nomor HP' : 'Phone Number'} *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08123456789"
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4" />
                WhatsApp *
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
                  ? 'Notifikasi order dan promo akan dikirim ke nomor ini'
                  : 'Order notifications and promos will be sent to this number'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4" />
                Email ({language === 'id' ? 'Opsional' : 'Optional'})
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button onClick={handleNext} className="w-full" size="lg">
              {language === 'id' ? 'Lanjut' : 'Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 'business' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">
              {language === 'id' ? 'Data Bisnis' : 'Business Information'}
            </h2>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Store className="h-4 w-4" />
                {language === 'id' ? 'Nama Toko/Bisnis' : 'Business Name'} *
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={language === 'id' ? 'Contoh: Toko Berkah Jaya' : 'e.g., Berkah Jaya Store'}
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Building className="h-4 w-4" />
                {language === 'id' ? 'Jenis Usaha' : 'Business Type'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {businessTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setBusinessType(type.value)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      businessType === type.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:border-primary/50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" />
                {language === 'id' ? 'Alamat Lengkap' : 'Full Address'} *
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={language === 'id' ? 'Jl. Contoh No. 123, Kelurahan, Kecamatan' : 'Street address, district, etc.'}
                rows={3}
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" />
                {language === 'id' ? 'Kota' : 'City'} *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={language === 'id' ? 'Contoh: Jakarta Pusat' : 'e.g., Central Jakarta'}
                className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('personal')} className="flex-1">
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
              <h3 className="font-medium text-sm text-muted-foreground">
                {language === 'id' ? 'Data Diri' : 'Personal Info'}
              </h3>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{language === 'id' ? 'Nama' : 'Name'}</span>
                <span className="font-medium">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{language === 'id' ? 'HP' : 'Phone'}</span>
                <span className="font-medium">{phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">WhatsApp</span>
                <span className="font-medium">{whatsapp}</span>
              </div>
              {email && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{email}</span>
                </div>
              )}

              <div className="border-t pt-3 mt-3">
                <h3 className="font-medium text-sm text-muted-foreground mb-3">
                  {language === 'id' ? 'Data Bisnis' : 'Business Info'}
                </h3>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === 'id' ? 'Toko' : 'Store'}</span>
                  <span className="font-medium">{businessName}</span>
                </div>
                {businessType && (
                  <div className="flex justify-between mt-2">
                    <span className="text-muted-foreground">{language === 'id' ? 'Jenis' : 'Type'}</span>
                    <span className="font-medium">
                      {businessTypes.find((t) => t.value === businessType)?.label}
                    </span>
                  </div>
                )}
                <div className="flex justify-between mt-2">
                  <span className="text-muted-foreground">{language === 'id' ? 'Kota' : 'City'}</span>
                  <span className="font-medium">{city}</span>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 rounded-xl p-4">
              <h3 className="font-semibold text-primary mb-2">
                {language === 'id' ? 'Apa yang terjadi selanjutnya?' : 'What happens next?'}
              </h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    {language === 'id'
                      ? 'Tim kami akan review pendaftaran Anda dalam 1-2 hari kerja'
                      : 'Our team will review your application within 1-2 business days'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    {language === 'id'
                      ? 'Anda akan dihubungi via WhatsApp untuk verifikasi'
                      : 'You will be contacted via WhatsApp for verification'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    {language === 'id'
                      ? 'Setelah disetujui, Anda langsung dapat harga reseller!'
                      : 'Once approved, you immediately get reseller pricing!'}
                  </span>
                </li>
              </ul>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">
                {language === 'id'
                  ? 'Saya menyetujui syarat dan ketentuan program reseller UC'
                  : 'I agree to the Alyanoor reseller program terms and conditions'}
              </span>
            </label>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('business')} className="flex-1">
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
                    {language === 'id' ? 'Daftar Sekarang' : 'Register Now'}
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
