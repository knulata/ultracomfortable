'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Package,
  Camera,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
  Store,
  Sparkles,
  MessageCircle,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'

export default function UjiCobaPage() {
  const { language } = useTranslation()

  const benefits = [
    {
      icon: Package,
      title: language === 'id' ? 'Cuma 10 Potong' : 'Just 10 Pieces',
      description: language === 'id'
        ? 'Tidak perlu banyak stok. Cukup 10 potong untuk memulai.'
        : "No need for large inventory. Just 10 pieces to start.",
    },
    {
      icon: Camera,
      title: language === 'id' ? 'Foto Profesional Gratis' : 'Free Professional Photos',
      description: language === 'id'
        ? 'Tim kami foto produk Anda dengan kualitas studio.'
        : 'Our team photographs your products with studio quality.',
    },
    {
      icon: Shield,
      title: language === 'id' ? 'Tanpa Risiko' : 'Zero Risk',
      description: language === 'id'
        ? 'Tidak laku? Ambil kembali kapan saja. Gratis.'
        : "Didn't sell? Take them back anytime. Free.",
    },
    {
      icon: Clock,
      title: language === 'id' ? '14 Hari Trial' : '14-Day Trial',
      description: language === 'id'
        ? 'Lihat hasil nyata dalam 2 minggu.'
        : 'See real results in 2 weeks.',
    },
    {
      icon: MessageCircle,
      title: language === 'id' ? 'Laporan via WhatsApp' : 'WhatsApp Reports',
      description: language === 'id'
        ? 'Update penjualan langsung ke WA Anda.'
        : 'Sales updates directly to your WhatsApp.',
    },
    {
      icon: TrendingUp,
      title: language === 'id' ? 'Bayar Saat Laku' : 'Pay When Sold',
      description: language === 'id'
        ? 'Komisi 15% hanya dari barang yang terjual.'
        : '15% commission only on items sold.',
    },
  ]

  const steps = [
    {
      number: '1',
      title: language === 'id' ? 'Daftar' : 'Register',
      description: language === 'id'
        ? 'Isi form singkat, pilih jadwal drop-off'
        : 'Fill short form, pick drop-off schedule',
    },
    {
      number: '2',
      title: language === 'id' ? 'Antar 10 Potong' : 'Drop Off 10 Pieces',
      description: language === 'id'
        ? 'Bawa ke gudang UC, kami terima & foto'
        : 'Bring to AlyaNoor warehouse, we receive & photograph',
    },
    {
      number: '3',
      title: language === 'id' ? 'Kami Jualkan' : 'We Sell',
      description: language === 'id'
        ? 'Produk live di toko online UC'
        : 'Products go live on AlyaNoor online store',
    },
    {
      number: '4',
      title: language === 'id' ? 'Terima Uang' : 'Get Paid',
      description: language === 'id'
        ? 'Transfer otomatis setiap minggu'
        : 'Automatic transfer every week',
    },
  ]

  const faqs = [
    {
      q: language === 'id' ? 'Berapa biaya pendaftaran?' : 'What is the registration fee?',
      a: language === 'id'
        ? 'GRATIS! Tidak ada biaya pendaftaran atau bulanan.'
        : 'FREE! No registration or monthly fees.',
    },
    {
      q: language === 'id' ? 'Bagaimana jika tidak laku?' : 'What if items do not sell?',
      a: language === 'id'
        ? 'Ambil kembali kapan saja. Tidak ada penalti.'
        : 'Take them back anytime. No penalties.',
    },
    {
      q: language === 'id' ? 'Kapan saya dibayar?' : 'When do I get paid?',
      a: language === 'id'
        ? 'Setiap Senin untuk penjualan minggu sebelumnya.'
        : 'Every Monday for the previous week sales.',
    },
    {
      q: language === 'id' ? 'Produk apa yang bisa dijual?' : 'What products can I sell?',
      a: language === 'id'
        ? 'Fashion wanita: gamis, tunik, hijab, outer, dll.'
        : "Women's fashion: gamis, tunic, hijab, outer, etc.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            {language === 'id' ? 'Program Trial Eksklusif' : 'Exclusive Trial Program'}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {language === 'id' ? 'Uji Coba' : 'Try With'}{' '}
            <span className="text-primary">10 Potong</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {language === 'id'
              ? 'Jualan online tanpa repot. Titip 10 potong, kami foto, upload, pack, dan kirim. Anda tinggal terima uang!'
              : 'Sell online hassle-free. Drop off 10 pieces, we photograph, upload, pack, and ship. You just receive money!'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/uji-coba/daftar">
                {language === 'id' ? 'Daftar Sekarang' : 'Register Now'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                {language === 'id' ? 'Tanya via WhatsApp' : 'Ask via WhatsApp'}
              </a>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {language === 'id' ? '100+ Seller Sudah Coba' : '100+ Sellers Tried'}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {language === 'id' ? '85% Lanjut Jadi Partner' : '85% Became Partners'}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {language === 'id' ? 'Gratis Tanpa Syarat' : 'Free No Strings'}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">
            {language === 'id' ? 'Cara Kerja' : 'How It Works'}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground text-xl font-bold flex items-center justify-center mx-auto mb-3">
                  {step.number}
                </div>
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">
            {language === 'id' ? 'Keuntungan Untuk Anda' : 'Benefits For You'}
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            {language === 'id'
              ? 'Fokus jualan di toko, biarkan kami urus online'
              : 'Focus on your shop, let us handle online'}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div
                  key={index}
                  className="bg-background border rounded-xl p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">
            {language === 'id' ? 'Kata Mereka Yang Sudah Coba' : 'What Trial Users Say'}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background rounded-xl p-6 border">
              <p className="text-muted-foreground mb-4">
                "{language === 'id'
                  ? 'Awalnya ragu, tapi setelah 10 potong pertama laku 8, langsung saya tambahin 50 potong lagi!'
                  : 'Was skeptical at first, but after 8 of 10 pieces sold, I immediately added 50 more!'}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Ibu Dewi</p>
                  <p className="text-sm text-muted-foreground">Dewi Collection, Blok A</p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-xl p-6 border">
              <p className="text-muted-foreground mb-4">
                "{language === 'id'
                  ? 'Saya tidak perlu mikir soal foto dan packing. Tinggal titip, terima transfer tiap Senin.'
                  : "I don't need to think about photos and packing. Just drop off, receive transfer every Monday."}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Pak Hendra</p>
                  <p className="text-sm text-muted-foreground">Hendra Fashion, Blok B</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">
            {language === 'id' ? 'Pertanyaan Umum' : 'FAQ'}
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-muted/50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'id' ? 'Siap Mencoba?' : 'Ready to Try?'}
          </h2>
          <p className="text-lg opacity-90 mb-8">
            {language === 'id'
              ? 'Daftar sekarang, antar 10 potong besok, mulai jualan lusa!'
              : 'Register now, drop off 10 pieces tomorrow, start selling the day after!'}
          </p>

          <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
            <Link href="/uji-coba/daftar">
              {language === 'id' ? 'Daftar Gratis Sekarang' : 'Register Free Now'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <p className="mt-4 text-sm opacity-75">
            {language === 'id'
              ? 'Atau hubungi WhatsApp: 0812-3456-7890'
              : 'Or contact WhatsApp: 0812-3456-7890'}
          </p>
        </div>
      </section>
    </div>
  )
}
