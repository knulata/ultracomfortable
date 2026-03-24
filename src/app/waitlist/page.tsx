'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Sparkles, Gift, Users, ChevronRight, Check, Copy, Instagram, MessageCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'

// Launch date - set this to your actual launch date
const LAUNCH_DATE = new Date('2026-03-15T00:00:00+07:00')

function WaitlistContent() {
  const searchParams = useSearchParams()
  const refCode = searchParams.get('ref')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isJoined, setIsJoined] = useState(false)
  const [referralCode, setReferralCode] = useState('')
  const [waitlistCount, setWaitlistCount] = useState(2847) // Start with social proof
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const diff = LAUNCH_DATE.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Simulate waitlist growth
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setWaitlistCount(prev => prev + 1)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Check if already joined
  useEffect(() => {
    const stored = localStorage.getItem('uc-waitlist')
    if (stored) {
      const data = JSON.parse(stored)
      setIsJoined(true)
      setReferralCode(data.referralCode)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)

    try {
      // Call API
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          referredBy: refCode || undefined
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to join')
      }

      // Store in localStorage
      localStorage.setItem('uc-waitlist', JSON.stringify({
        email,
        referralCode: data.referralCode,
        joinedAt: new Date().toISOString(),
      }))

      setReferralCode(data.referralCode)
      setIsJoined(true)
      if (data.position) {
        setWaitlistCount(data.position)
      } else {
        setWaitlistCount(prev => prev + 1)
      }

      // Celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c9a87c', '#ffd700', '#ff6b6b'],
      })

      toast.success('Welcome to the UC family!')

    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyReferralLink = () => {
    const link = `https://alyanoor.com/waitlist?ref=${referralCode}`
    navigator.clipboard.writeText(link)
    toast.success('Link copied!')
  }

  const shareToWhatsApp = () => {
    const text = `Join Alyanoor waitlist and get Rp50K off! Use my code: ${referralCode}\nhttps://alyanoor.com/waitlist?ref=${referralCode}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const shareToInstagram = () => {
    // Instagram doesn't support direct sharing, so we copy and open
    copyReferralLink()
    toast.success('Link copied! Share it on Instagram')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-4 py-12 max-w-4xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold tracking-tight">
              <span className="text-primary">U</span>C
            </span>
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Coming Soon
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Fashion yang
            <br />
            <span className="text-primary">Alyanoor</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Temukan style-mu dengan bantuan AI personal stylist.
            Affordable fashion untuk semua orang.
          </p>
        </div>

        {/* Countdown */}
        <div className="flex justify-center gap-4 mb-12">
          {[
            { value: timeLeft.days, label: 'Hari' },
            { value: timeLeft.hours, label: 'Jam' },
            { value: timeLeft.minutes, label: 'Menit' },
            { value: timeLeft.seconds, label: 'Detik' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-background rounded-2xl shadow-lg border flex items-center justify-center mb-2">
                <span className="text-2xl sm:text-3xl font-bold">{String(item.value).padStart(2, '0')}</span>
              </div>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div className="bg-background rounded-3xl shadow-xl border p-6 sm:p-8 mb-8">
          {!isJoined ? (
            <>
              {/* Benefits */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-4 text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">Rp50.000 Off</h3>
                  <p className="text-sm text-muted-foreground">Diskon pesanan pertama</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-2xl p-4 text-center">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🎁</span>
                  </div>
                  <h3 className="font-semibold mb-1">500 Alya Points</h3>
                  <p className="text-sm text-muted-foreground">Bonus poin gratis</p>
                </div>
                <div className="bg-gradient-to-br from-pink-500/10 to-pink-500/5 rounded-2xl p-4 text-center">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="h-6 w-6 text-pink-500" />
                  </div>
                  <h3 className="font-semibold mb-1">AI Stylist</h3>
                  <p className="text-sm text-muted-foreground">Akses eksklusif ke Kira</p>
                </div>
              </div>

              {/* Referral Bonus Banner */}
              {refCode && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 max-w-md mx-auto">
                  <p className="text-sm text-green-800 font-medium text-center">
                    🎉 Kamu diundang! Join sekarang dan dapat bonus tambahan Rp25.000
                  </p>
                </div>
              )}

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email kamu"
                    required
                    className="flex-1 px-4 py-3 rounded-xl border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all"
                  />
                  <Button type="submit" size="lg" disabled={isSubmitting} className="px-6">
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      </span>
                    ) : (
                      <>
                        Join
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Gratis, tanpa spam. Unsubscribe kapan saja.
                </p>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold mb-2">Kamu sudah terdaftar!</h2>
              <p className="text-muted-foreground mb-6">
                Kami akan kirim email saat Alyanoor launching
              </p>

              {/* Referral Section */}
              <div className="bg-gradient-to-r from-primary/10 to-amber-500/10 rounded-2xl p-6 max-w-md mx-auto mb-6">
                <h3 className="font-semibold mb-2">Ajak teman, dapat bonus!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Setiap teman yang join pakai link kamu, kalian berdua dapat tambahan Rp25.000
                </p>

                <div className="flex gap-2 mb-4">
                  <div className="flex-1 bg-background rounded-lg px-3 py-2 font-mono text-sm truncate border">
                    alyanoor.com/waitlist?ref={referralCode}
                  </div>
                  <Button variant="outline" size="icon" onClick={copyReferralLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={shareToWhatsApp} className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareToInstagram} className="flex-1">
                    <Instagram className="h-4 w-4 mr-2" />
                    Instagram
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Kode referral kamu: <span className="font-mono font-semibold">{referralCode}</span>
              </p>
            </div>
          )}
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="flex -space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/60 border-2 border-background flex items-center justify-center text-xs font-medium text-primary-foreground"
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{waitlistCount.toLocaleString()}</span>
            <span className="text-muted-foreground">orang sudah join</span>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Kenapa UC?</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Kira Preview */}
            <div className="bg-background rounded-2xl border p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Kira - AI Stylist</h3>
                    <p className="text-sm text-muted-foreground">Personal shopper 24/7</p>
                  </div>
                </div>
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-sm italic text-muted-foreground">
                    "Hai! Aku Kira. Ceritakan style favoritmu, dan aku akan carikan outfit yang perfect untukmu!"
                  </p>
                </div>
              </div>
            </div>

            {/* Gamification Preview */}
            <div className="bg-background rounded-2xl border p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎡</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Daily Rewards</h3>
                    <p className="text-sm text-muted-foreground">Spin & win setiap hari</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {['10% Off', 'Free Shipping', '50 Points', 'Mystery Gift'].map((prize, i) => (
                    <div key={i} className="flex-1 bg-muted rounded-lg py-2 text-center">
                      <span className="text-xs font-medium">{prize}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Affordable Fashion */}
            <div className="bg-background rounded-2xl border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h3 className="font-semibold">Harga Terjangkau</h3>
                  <p className="text-sm text-muted-foreground">Mulai dari Rp99.000</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Fashion trendy tanpa harus mahal. Kualitas premium dengan harga yang bersahabat.
              </p>
            </div>

            {/* Indonesian Focus */}
            <div className="bg-background rounded-2xl border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🇮🇩</span>
                </div>
                <div>
                  <h3 className="font-semibold">Untuk Indonesia</h3>
                  <p className="text-sm text-muted-foreground">Lokal payment & shipping</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                GoPay, OVO, Dana, QRIS, transfer bank. Pengiriman cepat ke seluruh Indonesia.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">
            Follow us untuk update terbaru
          </p>
          <div className="flex justify-center gap-4">
            <a href="#" className="hover:text-primary transition-colors">Instagram</a>
            <a href="#" className="hover:text-primary transition-colors">TikTok</a>
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
          </div>
          <p className="mt-6">
            © 2026 Alyanoor. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

function WaitlistLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-primary/5 to-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export default function WaitlistPage() {
  return (
    <Suspense fallback={<WaitlistLoading />}>
      <WaitlistContent />
    </Suspense>
  )
}
