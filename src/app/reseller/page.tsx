'use client'

import Link from 'next/link'
import {
  TrendingUp,
  Package,
  Truck,
  CreditCard,
  MessageCircle,
  Shield,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Percent,
  Crown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { RESELLER_TIERS, WHOLESALE_PRICE_TIERS } from '@/stores/reseller'
import { formatPrice } from '@/stores/cart'

export default function ResellerPage() {
  const { language } = useTranslation()

  const benefits = [
    {
      icon: Percent,
      title: language === 'id' ? 'Diskon Hingga 20%' : 'Up to 20% Discount',
      description: language === 'id'
        ? 'Dapatkan harga khusus reseller, makin banyak beli makin murah'
        : 'Get exclusive reseller pricing, bigger orders mean bigger savings',
    },
    {
      icon: Package,
      title: language === 'id' ? 'Stok Prioritas' : 'Priority Stock',
      description: language === 'id'
        ? 'Akses produk baru dan hot items sebelum yang lain'
        : 'Access new products and hot items before others',
    },
    {
      icon: Truck,
      title: language === 'id' ? 'Gratis Ongkir' : 'Free Shipping',
      description: language === 'id'
        ? 'Gratis ongkir untuk tier Silver ke atas'
        : 'Free shipping for Silver tier and above',
    },
    {
      icon: CreditCard,
      title: language === 'id' ? 'Tempo Pembayaran' : 'Credit Terms',
      description: language === 'id'
        ? 'Bayar nanti dengan sistem Net 7-14 hari untuk tier Gold+'
        : 'Pay later with Net 7-14 day terms for Gold+ tiers',
    },
    {
      icon: MessageCircle,
      title: language === 'id' ? 'Dukungan Khusus' : 'Dedicated Support',
      description: language === 'id'
        ? 'Tim support khusus via WhatsApp untuk reseller'
        : 'Dedicated WhatsApp support team for resellers',
    },
    {
      icon: Shield,
      title: language === 'id' ? 'Garansi Kualitas' : 'Quality Guarantee',
      description: language === 'id'
        ? 'Garansi tukar jika ada cacat produksi'
        : 'Exchange guarantee for manufacturing defects',
    },
  ]

  const steps = [
    {
      number: '1',
      title: language === 'id' ? 'Daftar' : 'Register',
      description: language === 'id'
        ? 'Isi form pendaftaran reseller'
        : 'Fill out the reseller registration form',
    },
    {
      number: '2',
      title: language === 'id' ? 'Verifikasi' : 'Verification',
      description: language === 'id'
        ? 'Tim kami review dalam 1-2 hari kerja'
        : 'Our team reviews within 1-2 business days',
    },
    {
      number: '3',
      title: language === 'id' ? 'Aktivasi' : 'Activation',
      description: language === 'id'
        ? 'Terima akses harga reseller & mulai belanja'
        : 'Receive reseller pricing access & start ordering',
    },
    {
      number: '4',
      title: language === 'id' ? 'Naik Level' : 'Level Up',
      description: language === 'id'
        ? 'Beli lebih banyak, naik tier, dapat benefit lebih'
        : 'Order more, level up, get more benefits',
    },
  ]

  const faqs = [
    {
      q: language === 'id' ? 'Berapa minimum order?' : 'What is the minimum order?',
      a: language === 'id'
        ? 'Tidak ada minimum order. Tapi diskon grosir mulai dari 6 pcs (½ lusin).'
        : 'No minimum order. But wholesale discounts start from 6 pcs (½ dozen).',
    },
    {
      q: language === 'id' ? 'Berapa lama proses approval?' : 'How long is the approval process?',
      a: language === 'id'
        ? '1-2 hari kerja setelah data lengkap diterima.'
        : '1-2 business days after complete data is received.',
    },
    {
      q: language === 'id' ? 'Bagaimana cara naik tier?' : 'How do I level up?',
      a: language === 'id'
        ? 'Tier otomatis naik berdasarkan jumlah order per bulan dan total belanja.'
        : 'Tiers automatically upgrade based on monthly orders and total spending.',
    },
    {
      q: language === 'id' ? 'Apakah ada biaya pendaftaran?' : 'Is there a registration fee?',
      a: language === 'id'
        ? 'GRATIS! Tidak ada biaya pendaftaran atau biaya bulanan.'
        : 'FREE! No registration or monthly fees.',
    },
  ]

  // Example wholesale pricing calculation
  const exampleBasePrice = 150000
  const exampleQuantities = [1, 6, 12, 24]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <Users className="h-4 w-4" />
            {language === 'id' ? 'Program Reseller UC' : 'Alyanoor Reseller Program'}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {language === 'id' ? 'Jadi Reseller, ' : 'Become a Reseller, '}
            <span className="text-primary">{language === 'id' ? 'Untung Lebih' : 'Earn More'}</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {language === 'id'
              ? 'Dapatkan harga grosir eksklusif hingga 20% lebih murah. Stok prioritas, gratis ongkir, dan dukungan khusus.'
              : 'Get exclusive wholesale pricing up to 20% cheaper. Priority stock, free shipping, and dedicated support.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/reseller/daftar">
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
              {language === 'id' ? '500+ Reseller Aktif' : '500+ Active Resellers'}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {language === 'id' ? 'Gratis Pendaftaran' : 'Free Registration'}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {language === 'id' ? 'Approval 1-2 Hari' : '1-2 Day Approval'}
            </div>
          </div>
        </div>
      </section>

      {/* Tier Levels */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">
            {language === 'id' ? 'Level Reseller & Keuntungan' : 'Reseller Tiers & Benefits'}
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            {language === 'id'
              ? 'Makin sering order, makin besar diskon dan benefit Anda'
              : 'Order more frequently, get bigger discounts and benefits'}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {RESELLER_TIERS.map((tier, index) => (
              <div
                key={tier.id}
                className={`bg-background rounded-xl p-6 border-2 transition-all ${
                  index === 2 ? 'border-primary shadow-lg scale-105' : 'border-transparent'
                }`}
              >
                {index === 2 && (
                  <div className="text-center mb-2">
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                      {language === 'id' ? 'Populer' : 'Popular'}
                    </span>
                  </div>
                )}
                <div className="text-center mb-4">
                  <span className="text-4xl">{tier.badge}</span>
                  <h3 className="font-bold mt-2">
                    {language === 'id' ? tier.nameId : tier.name}
                  </h3>
                  <p className="text-3xl font-bold text-primary mt-2">
                    -{tier.discountPercent}%
                  </p>
                </div>

                <div className="text-xs text-muted-foreground mb-4 text-center">
                  {tier.minOrdersPerMonth > 0 && (
                    <p>
                      Min. {tier.minOrdersPerMonth} {language === 'id' ? 'order/bulan' : 'orders/month'}
                    </p>
                  )}
                  {tier.minTotalSpent > 0 && (
                    <p>
                      {language === 'id' ? 'Total belanja' : 'Total spent'} {formatPrice(tier.minTotalSpent)}+
                    </p>
                  )}
                  {tier.minOrdersPerMonth === 0 && tier.minTotalSpent === 0 && (
                    <p>{language === 'id' ? 'Level awal' : 'Starting level'}</p>
                  )}
                </div>

                <ul className="space-y-2 text-sm">
                  {(language === 'id' ? tier.benefitsId : tier.benefits).map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wholesale Pricing Example */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">
            {language === 'id' ? 'Simulasi Harga Grosir' : 'Wholesale Price Simulation'}
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            {language === 'id'
              ? 'Contoh produk seharga Rp 150.000 - makin banyak makin murah!'
              : 'Example product priced at Rp 150,000 - buy more, pay less!'}
          </p>

          <div className="bg-muted/30 rounded-xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {WHOLESALE_PRICE_TIERS.slice(0, 4).map((tier) => {
                const discountedPrice = Math.round(exampleBasePrice * (1 - tier.discountPercent / 100))
                const savings = exampleBasePrice - discountedPrice

                return (
                  <div key={tier.minQuantity} className="bg-background rounded-lg p-4 text-center border">
                    <p className="text-sm text-muted-foreground mb-1">
                      {tier.minQuantity}+ pcs
                    </p>
                    <p className="font-medium text-xs mb-2">
                      {language === 'id' ? tier.labelId : tier.label}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(discountedPrice)}
                    </p>
                    {tier.discountPercent > 0 && (
                      <>
                        <p className="text-sm text-muted-foreground line-through">
                          {formatPrice(exampleBasePrice)}
                        </p>
                        <p className="text-xs text-green-600 font-medium">
                          {language === 'id' ? 'Hemat' : 'Save'} {formatPrice(savings)}
                        </p>
                      </>
                    )}
                  </div>
                )
              })}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
              {language === 'id'
                ? '* Diskon grosir + diskon tier reseller bisa digabung!'
                : '* Wholesale discount + reseller tier discount can be combined!'}
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">
            {language === 'id' ? 'Keuntungan Jadi Reseller' : 'Reseller Benefits'}
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            {language === 'id'
              ? 'Lebih dari sekadar diskon - dukungan penuh untuk bisnis Anda'
              : 'More than just discounts - full support for your business'}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="bg-background rounded-xl p-6 border">
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

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
            {language === 'id' ? 'Cara Daftar' : 'How to Register'}
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

      {/* Testimonials */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
            {language === 'id' ? 'Kata Reseller Kami' : 'What Our Resellers Say'}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background rounded-xl p-6 border">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "{language === 'id'
                  ? 'Sejak jadi reseller Gold, margin keuntungan saya naik 15%. Stok selalu ready dan pengiriman cepat.'
                  : 'Since becoming a Gold reseller, my profit margin increased 15%. Stock is always ready and shipping is fast.'}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Ibu Siti Aminah</p>
                  <p className="text-xs text-muted-foreground">Toko Berkah Jaya • Gold Reseller</p>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-xl p-6 border">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "{language === 'id'
                  ? 'Sistem tempo Net 14 sangat membantu cash flow toko saya. Customer service juga responsif via WhatsApp.'
                  : 'The Net 14 credit system really helps my store cash flow. Customer service is also responsive via WhatsApp.'}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Pak Hendra Wijaya</p>
                  <p className="text-xs text-muted-foreground">Grosir Murah Meriah • Platinum Reseller</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
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
            {language === 'id' ? 'Siap Jadi Reseller?' : 'Ready to Become a Reseller?'}
          </h2>
          <p className="text-lg opacity-90 mb-8">
            {language === 'id'
              ? 'Daftar gratis sekarang dan mulai nikmati harga khusus reseller!'
              : 'Register for free now and start enjoying exclusive reseller prices!'}
          </p>

          <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
            <Link href="/reseller/daftar">
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
