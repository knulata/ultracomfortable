'use client'

import { useState } from 'react'
import { Calculator, Calendar, User, Store, Percent, Minus, Plus, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePayoutStore, formatPeriodLabel } from '@/stores/payout'
import { usePartnerStore } from '@/stores/partner'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

// Mock sales data for demo - in production this would come from fulfillment store
const mockSalesData = [
  {
    partnerId: 'partner-1',
    sales: [
      { orderId: 'ord-1', orderNumber: 'UC240306001', productName: 'Gamis Syari Premium', quantity: 2, sellingPrice: 329000, costPrice: 185000, date: '2024-03-06' },
      { orderId: 'ord-2', orderNumber: 'UC240306005', productName: 'Tunik Batik Modern', quantity: 1, sellingPrice: 215000, costPrice: 125000, date: '2024-03-06' },
    ],
    returns: [
      { orderId: 'ord-99', description: 'Retur - Hijab cacat', amount: 89000, date: '2024-03-05' },
    ],
  },
  {
    partnerId: 'partner-2',
    sales: [
      { orderId: 'ord-3', orderNumber: 'UC240305012', productName: 'Hijab Voal Premium', quantity: 5, sellingPrice: 89000, costPrice: 45000, date: '2024-03-05' },
    ],
    returns: [],
  },
]

export function PayoutCalculator() {
  const { language } = useTranslation()
  const { partners } = usePartnerStore()
  const { createPayout } = usePayoutStore()

  const [selectedPartner, setSelectedPartner] = useState('')
  const [periodStart, setPeriodStart] = useState('')
  const [periodEnd, setPeriodEnd] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)
  const [calculatedData, setCalculatedData] = useState<{
    sales: typeof mockSalesData[0]['sales']
    returns: typeof mockSalesData[0]['returns']
    totalSales: number
    commission: number
    deductions: number
    netPayout: number
  } | null>(null)

  const activePartners = partners.filter((p) => p.status === 'active')
  const partner = activePartners.find((p) => p.id === selectedPartner)

  const handleCalculate = () => {
    if (!selectedPartner || !periodStart || !periodEnd) {
      toast.error(language === 'id' ? 'Lengkapi semua field!' : 'Fill all fields!')
      return
    }

    setIsCalculating(true)

    // Simulate calculation
    setTimeout(() => {
      const partnerData = mockSalesData.find((d) => d.partnerId === selectedPartner)

      if (partnerData && partner) {
        const totalSales = partnerData.sales.reduce((sum, s) => sum + (s.sellingPrice * s.quantity), 0)
        const commission = totalSales * (partner.commissionRate / 100)
        const deductions = partnerData.returns.reduce((sum, r) => sum + r.amount, 0)
        const netPayout = totalSales - commission - deductions

        setCalculatedData({
          sales: partnerData.sales,
          returns: partnerData.returns,
          totalSales,
          commission,
          deductions,
          netPayout,
        })
      } else {
        setCalculatedData({
          sales: [],
          returns: [],
          totalSales: 0,
          commission: 0,
          deductions: 0,
          netPayout: 0,
        })
      }

      setIsCalculating(false)
    }, 1000)
  }

  const handleCreatePayout = () => {
    if (!calculatedData || !partner) return

    const lineItems = calculatedData.sales.map((s, i) => ({
      id: `line-${Date.now()}-${i}`,
      orderId: s.orderId,
      orderNumber: s.orderNumber,
      productName: s.productName,
      quantity: s.quantity,
      sellingPrice: s.sellingPrice,
      costPrice: s.costPrice,
      lineTotal: s.sellingPrice * s.quantity,
      partnerEarning: (s.sellingPrice * s.quantity) * (1 - partner.commissionRate / 100),
      date: s.date,
    }))

    const deductions = calculatedData.returns.map((r, i) => ({
      id: `ded-${Date.now()}-${i}`,
      type: 'return' as const,
      description: r.description,
      amount: r.amount,
      orderId: r.orderId,
      date: r.date,
    }))

    createPayout({
      partnerId: partner.id,
      partnerName: partner.ownerName,
      shopName: partner.shopName,
      periodStart,
      periodEnd,
      periodLabel: formatPeriodLabel(periodStart, periodEnd),
      lineItems,
      totalSales: calculatedData.totalSales,
      totalItems: lineItems.length,
      totalQuantity: lineItems.reduce((sum, l) => sum + l.quantity, 0),
      commissionRate: partner.commissionRate,
      commissionAmount: calculatedData.commission,
      deductions,
      totalDeductions: calculatedData.deductions,
      netPayout: calculatedData.netPayout,
      bankName: partner.bankName,
      bankAccountNumber: partner.bankAccountNumber,
      bankAccountName: partner.bankAccountName,
    })

    toast.success(language === 'id' ? 'Payout berhasil dibuat!' : 'Payout created!')

    // Reset form
    setSelectedPartner('')
    setPeriodStart('')
    setPeriodEnd('')
    setCalculatedData(null)
  }

  return (
    <div className="space-y-6">
      {/* Partner Selection */}
      <div>
        <label className="text-sm font-medium block mb-2">
          <User className="h-4 w-4 inline mr-2" />
          {language === 'id' ? 'Pilih Partner' : 'Select Partner'}
        </label>
        <select
          value={selectedPartner}
          onChange={(e) => {
            setSelectedPartner(e.target.value)
            setCalculatedData(null)
          }}
          className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">{language === 'id' ? 'Pilih Partner...' : 'Select Partner...'}</option>
          {activePartners.map((p) => (
            <option key={p.id} value={p.id}>
              {p.shopName} - {p.ownerName} ({p.commissionRate}%)
            </option>
          ))}
        </select>
      </div>

      {/* Period Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-2">
            <Calendar className="h-4 w-4 inline mr-2" />
            {language === 'id' ? 'Mulai' : 'Start Date'}
          </label>
          <input
            type="date"
            value={periodStart}
            onChange={(e) => {
              setPeriodStart(e.target.value)
              setCalculatedData(null)
            }}
            className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">
            <Calendar className="h-4 w-4 inline mr-2" />
            {language === 'id' ? 'Sampai' : 'End Date'}
          </label>
          <input
            type="date"
            value={periodEnd}
            onChange={(e) => {
              setPeriodEnd(e.target.value)
              setCalculatedData(null)
            }}
            className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Partner Info */}
      {partner && (
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Store className="h-5 w-5 text-primary" />
            <span className="font-semibold">{partner.shopName}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">{language === 'id' ? 'Bank' : 'Bank'}</span>
              <p className="font-medium">{partner.bankName} - {partner.bankAccountNumber}</p>
              <p className="text-xs text-muted-foreground">a.n. {partner.bankAccountName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">{language === 'id' ? 'Komisi' : 'Commission'}</span>
              <p className="font-medium text-primary">{partner.commissionRate}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Calculate Button */}
      <Button
        onClick={handleCalculate}
        disabled={!selectedPartner || !periodStart || !periodEnd || isCalculating}
        className="w-full"
      >
        {isCalculating ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {language === 'id' ? 'Menghitung...' : 'Calculating...'}
          </span>
        ) : (
          <>
            <Calculator className="h-4 w-4 mr-2" />
            {language === 'id' ? 'Hitung Payout' : 'Calculate Payout'}
          </>
        )}
      </Button>

      {/* Calculation Results */}
      {calculatedData && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold">
            {language === 'id' ? 'Hasil Perhitungan' : 'Calculation Results'}
          </h3>

          {/* Sales Summary */}
          <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-700 dark:text-green-400">
                <Plus className="h-4 w-4 inline mr-1" />
                {language === 'id' ? 'Total Penjualan' : 'Total Sales'}
              </span>
              <span className="font-bold text-green-700 dark:text-green-400">
                {formatPrice(calculatedData.totalSales)}
              </span>
            </div>
            <p className="text-xs text-green-600 dark:text-green-500">
              {calculatedData.sales.length} {language === 'id' ? 'transaksi' : 'transactions'}
            </p>
          </div>

          {/* Commission */}
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-amber-700 dark:text-amber-400">
                <Percent className="h-4 w-4 inline mr-1" />
                {language === 'id' ? 'Komisi UC' : 'Alyanoor Commission'} ({partner?.commissionRate}%)
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                -{formatPrice(calculatedData.commission)}
              </span>
            </div>
          </div>

          {/* Deductions */}
          {calculatedData.deductions > 0 && (
            <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-red-700 dark:text-red-400">
                  <Minus className="h-4 w-4 inline mr-1" />
                  {language === 'id' ? 'Potongan (Retur/Defect)' : 'Deductions'}
                </span>
                <span className="font-bold text-red-700 dark:text-red-400">
                  -{formatPrice(calculatedData.deductions)}
                </span>
              </div>
              <ul className="text-xs text-red-600 dark:text-red-500">
                {calculatedData.returns.map((r, i) => (
                  <li key={i}>{r.description}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Net Payout */}
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">
                {language === 'id' ? 'Total Payout' : 'Net Payout'}
              </span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(calculatedData.netPayout)}
              </span>
            </div>
          </div>

          {/* Create Payout Button */}
          <Button onClick={handleCreatePayout} className="w-full" size="lg">
            <CheckCircle className="h-4 w-4 mr-2" />
            {language === 'id' ? 'Buat Payout' : 'Create Payout'}
          </Button>
        </div>
      )}
    </div>
  )
}
