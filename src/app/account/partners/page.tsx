'use client'

import { useState, useEffect } from 'react'
import { Users, Plus, Download, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PartnerApprovalList, PartnerStats } from '@/components/partner'
import { useTranslation } from '@/stores/language'

export default function PartnersPage() {
  const { language } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-muted rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            {language === 'id' ? 'Kelola Partner' : 'Manage Partners'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {language === 'id'
              ? 'Kelola partner Tanah Abang yang titip barang'
              : 'Manage Tanah Abang partners who consign products'
            }
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {language === 'id' ? 'Export' : 'Export'}
          </Button>
          <Button size="sm" asChild>
            <a href="/partner/register" target="_blank">
              <Plus className="h-4 w-4 mr-2" />
              {language === 'id' ? 'Tambah Partner' : 'Add Partner'}
            </a>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <PartnerStats />

      {/* Partner List */}
      <div className="bg-background border rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">
            {language === 'id' ? 'Daftar Partner' : 'Partner List'}
          </h2>
          <Button variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <PartnerApprovalList />
      </div>
    </div>
  )
}
