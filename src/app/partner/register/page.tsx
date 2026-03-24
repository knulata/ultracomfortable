'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Store, Camera, Package, Truck, CheckCircle, Percent } from 'lucide-react'
import { PartnerRegistrationForm } from '@/components/partner'
import { useTranslation } from '@/stores/language'

export default function PartnerRegisterPage() {
  const { language } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="max-w-4xl mx-auto p-4">
          <div className="h-8 bg-muted rounded animate-pulse w-32 mb-8" />
          <div className="h-64 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-4xl mx-auto p-4">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {language === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
        </Link>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 md:p-8 mb-8 border border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Store className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {language === 'id' ? 'Daftar Jadi Partner UC' : 'Become a Alyanoor Partner'}
              </h1>
              <p className="text-muted-foreground">
                {language === 'id' ? 'Tanah Abang Fulfillment Center' : 'Tanah Abang Fulfillment Center'}
              </p>
            </div>
          </div>

          <p className="text-muted-foreground mb-6">
            {language === 'id'
              ? 'Titipkan barang Anda, kami yang foto, upload, packing, dan kirim. Fokus jualan, biarkan kami urus sisanya!'
              : 'Consign your products with us. We handle photos, uploads, packing, and shipping. Focus on selling, let us handle the rest!'
            }
          </p>

          {/* Benefits */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: Camera,
                title: language === 'id' ? 'Foto Profesional' : 'Professional Photos',
                desc: language === 'id' ? 'Produk difoto dengan lighting studio' : 'Products photographed with studio lighting',
              },
              {
                icon: Package,
                title: language === 'id' ? 'Upload & Kelola' : 'Upload & Manage',
                desc: language === 'id' ? 'Listing produk dikelola tim UC' : 'Product listings managed by Alyanoor team',
              },
              {
                icon: Truck,
                title: language === 'id' ? 'Packing & Kirim' : 'Pack & Ship',
                desc: language === 'id' ? 'QC, packing rapi, dan pengiriman' : 'QC, neat packing, and shipping',
              },
              {
                icon: Percent,
                title: language === 'id' ? 'Komisi 15%' : '15% Commission',
                desc: language === 'id' ? 'Semua layanan sudah termasuk' : 'All services included',
              },
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{benefit.title}</p>
                  <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-background rounded-2xl border p-6 md:p-8">
          <h2 className="text-lg font-semibold mb-6 text-center">
            {language === 'id' ? 'Form Pendaftaran Partner' : 'Partner Registration Form'}
          </h2>
          <PartnerRegistrationForm />
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            {language === 'id' ? 'Ada pertanyaan?' : 'Have questions?'}{' '}
            <a href="https://wa.me/6281234567890" className="text-primary hover:underline">
              {language === 'id' ? 'Hubungi kami di WhatsApp' : 'Contact us on WhatsApp'}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
