'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Package, Wallet, Settings, LogOut, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PartnerDashboard, PartnerProducts, PartnerEarnings } from '@/components/partner-portal'
import { usePartnerStore, Partner } from '@/stores/partner'
import { useTranslation } from '@/stores/language'

type TabType = 'dashboard' | 'products' | 'earnings' | 'settings'

const tabs: { id: TabType; labelEn: string; labelId: string; icon: React.ElementType }[] = [
  { id: 'dashboard', labelEn: 'Dashboard', labelId: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', labelEn: 'Products', labelId: 'Produk', icon: Package },
  { id: 'earnings', labelEn: 'Earnings', labelId: 'Pendapatan', icon: Wallet },
  { id: 'settings', labelEn: 'Settings', labelId: 'Pengaturan', icon: Settings },
]

export default function PartnerDashboardPage() {
  const { language } = useTranslation()
  const { partners, getProductsByPartner, getPayoutsByPartner } = usePartnerStore()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // For demo, use the first active partner
  // In production, this would come from auth session
  const partner = partners.find((p) => p.status === 'active') || partners[0]
  const products = partner ? getProductsByPartner(partner.id) : []
  const payouts = partner ? getPayoutsByPartner(partner.id) : []

  if (!mounted) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="max-w-6xl mx-auto p-4">
          <div className="h-16 bg-muted rounded-xl animate-pulse mb-6" />
          <div className="h-96 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">
            {language === 'id' ? 'Belum Terdaftar' : 'Not Registered'}
          </h1>
          <p className="text-muted-foreground mb-4">
            {language === 'id'
              ? 'Anda belum terdaftar sebagai partner UC.'
              : "You're not registered as a UC partner yet."
            }
          </p>
          <Button asChild>
            <Link href="/partner/register">
              {language === 'id' ? 'Daftar Sekarang' : 'Register Now'}
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  if (partner.status === 'pending') {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⏳</span>
          </div>
          <h1 className="text-xl font-bold mb-2">
            {language === 'id' ? 'Menunggu Verifikasi' : 'Pending Verification'}
          </h1>
          <p className="text-muted-foreground mb-4">
            {language === 'id'
              ? 'Pendaftaran Anda sedang dalam proses verifikasi. Tim kami akan menghubungi Anda dalam 1-2 hari kerja.'
              : 'Your registration is being verified. Our team will contact you within 1-2 business days.'
            }
          </p>
          <div className="bg-background border rounded-lg p-4 text-left">
            <p className="font-medium">{partner.shopName}</p>
            <p className="text-sm text-muted-foreground">{partner.shopAddress}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {language === 'id' ? 'Mendaftar:' : 'Registered:'}{' '}
              {new Date(partner.appliedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -ml-2"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <p className="font-bold text-lg leading-tight">{partner.shopName}</p>
              <p className="text-xs text-muted-foreground">{language === 'id' ? 'Partner UC' : 'UC Partner'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{language === 'id' ? 'Keluar' : 'Logout'}</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-background z-30 border-t">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setMobileMenuOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {language === 'id' ? tab.labelId : tab.labelEn}
              </button>
            ))}
          </nav>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-4">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <nav className="sticky top-20 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {language === 'id' ? tab.labelId : tab.labelEn}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {activeTab === 'dashboard' && (
              <PartnerDashboard partner={partner} />
            )}

            {activeTab === 'products' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {language === 'id' ? 'Produk Saya' : 'My Products'}
                </h2>
                <PartnerProducts products={products} />
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  {language === 'id' ? 'Pendapatan' : 'Earnings'}
                </h2>
                <PartnerEarnings partner={partner} payouts={payouts} />
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {language === 'id' ? 'Pengaturan' : 'Settings'}
                </h2>
                <div className="bg-background border rounded-xl p-6">
                  <h3 className="font-semibold mb-4">
                    {language === 'id' ? 'Informasi Toko' : 'Shop Information'}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">{language === 'id' ? 'Nama Toko' : 'Shop Name'}</span>
                      <span className="font-medium">{partner.shopName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">{language === 'id' ? 'Pemilik' : 'Owner'}</span>
                      <span className="font-medium">{partner.ownerName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">{language === 'id' ? 'Lokasi' : 'Location'}</span>
                      <span className="font-medium">{partner.shopAddress}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">{language === 'id' ? 'Telepon' : 'Phone'}</span>
                      <span className="font-medium">{partner.phone}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">WhatsApp</span>
                      <span className="font-medium">{partner.whatsapp}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">{language === 'id' ? 'Komisi' : 'Commission'}</span>
                      <span className="font-medium text-primary">{partner.commissionRate}%</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">{language === 'id' ? 'Bergabung' : 'Joined'}</span>
                      <span className="font-medium">
                        {new Date(partner.approvedAt || partner.appliedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-6">
                    {language === 'id' ? 'Hubungi Admin' : 'Contact Admin'}
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
