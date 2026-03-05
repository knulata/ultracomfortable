'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Store, CheckCircle, TrendingUp, Users, Truck, Shield, ArrowRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const benefits = [
  { icon: TrendingUp, title: 'Jangkau Jutaan Pembeli', titleEn: 'Reach Millions of Buyers', desc: 'Platform kami menghubungkan produk Anda ke pembeli di seluruh Indonesia.' },
  { icon: Store, title: 'Gratis Daftar', titleEn: 'Free to Register', desc: 'Tidak ada biaya pendaftaran. Komisi hanya 10% per penjualan.' },
  { icon: Truck, title: 'Logistik Terintegrasi', titleEn: 'Integrated Logistics', desc: 'Pengiriman otomatis dengan JNE, J&T, SiCepat, dan lainnya.' },
  { icon: Shield, title: 'Pembayaran Aman', titleEn: 'Secure Payments', desc: 'Settlement mingguan langsung ke rekening bank Anda.' },
]

export default function SellPage() {
  const [form, setForm] = useState({
    storeName: '',
    fullName: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    city: 'Jakarta',
    marketLocation: '',
    bankName: '',
    bankAccountNumber: '',
    bankAccountName: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.storeName || !form.fullName || !form.phone || !form.whatsapp || !form.address) {
      toast.error('Lengkapi semua kolom wajib')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/sellers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal mendaftar')
      }

      setIsSubmitted(true)
    } catch (err: any) {
      toast.error(err.message || 'Gagal mendaftar. Coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Pendaftaran Berhasil!</h1>
          <p className="text-muted-foreground mb-6">
            Tim kami akan meninjau toko Anda dalam 1-2 hari kerja.
            Kami akan menghubungi via WhatsApp di <strong>{form.whatsapp}</strong>.
          </p>
          <Button asChild>
            <Link href="/">Kembali ke Beranda</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Jualan di <span className="text-primary">UC</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Daftarkan toko Tanah Abang Anda dan jangkau pembeli di seluruh Indonesia. Gratis, mudah, dan cepat.
          </p>
          <a href="#daftar" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary/90 transition">
            Daftar Sekarang <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-center mb-10">Kenapa Jualan di UC?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-background rounded-xl border p-6 text-center">
                <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-4">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="daftar" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-background rounded-xl border p-8">
            <h2 className="text-2xl font-bold mb-2">Daftar Sebagai Seller</h2>
            <p className="text-muted-foreground mb-6">Isi form di bawah untuk mendaftarkan toko Anda.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Nama Toko <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.storeName}
                  onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Contoh: Rina Fashion"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nama pemilik toko"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="email@contoh.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    No. Telepon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="08xxxxxxxxxx"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    No. WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="08xxxxxxxxxx"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Alamat Toko <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={2}
                  placeholder="Alamat lengkap toko"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Kota</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Jakarta"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Lokasi Pasar</label>
                  <input
                    type="text"
                    value={form.marketLocation}
                    onChange={(e) => setForm({ ...form, marketLocation: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Contoh: Tanah Abang Blok A Lt.3 No.45"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Info Rekening Bank (untuk settlement)
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Nama Bank</label>
                    <select
                      value={form.bankName}
                      onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                      className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    >
                      <option value="">Pilih Bank</option>
                      <option value="BCA">BCA</option>
                      <option value="BNI">BNI</option>
                      <option value="BRI">BRI</option>
                      <option value="Mandiri">Mandiri</option>
                      <option value="CIMB">CIMB Niaga</option>
                      <option value="Permata">Permata</option>
                      <option value="BSI">BSI</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">No. Rekening</label>
                    <input
                      type="text"
                      value={form.bankAccountNumber}
                      onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })}
                      className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Atas Nama</label>
                    <input
                      type="text"
                      value={form.bankAccountName}
                      onChange={(e) => setForm({ ...form, bankAccountName: e.target.value })}
                      className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Nama pemilik rekening"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Mendaftar...' : 'Daftar Sebagai Seller'}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Dengan mendaftar, Anda menyetujui Syarat & Ketentuan Seller UC.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 text-center">
        <p className="text-muted-foreground mb-2">Ada pertanyaan?</p>
        <a
          href="https://wa.me/6281234567890?text=Halo%20UC%2C%20saya%20mau%20tanya%20soal%20jualan%20di%20UC"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-green-600 font-semibold hover:underline"
        >
          <Phone className="h-4 w-4" /> Hubungi kami via WhatsApp
        </a>
      </section>
    </div>
  )
}
