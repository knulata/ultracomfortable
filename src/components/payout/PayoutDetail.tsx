'use client'

import { useState } from 'react'
import { ArrowLeft, Download, Printer, CheckCircle, Clock, Store, Calendar, CreditCard, Package, Percent, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Payout, PayoutStatus, usePayoutStore } from '@/stores/payout'
import { formatPrice } from '@/stores/cart'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

const statusConfig: Record<PayoutStatus, { label: { en: string; id: string }; color: string }> = {
  draft: { label: { en: 'Draft', id: 'Draft' }, color: 'bg-gray-100 text-gray-700' },
  pending: { label: { en: 'Pending Approval', id: 'Menunggu Persetujuan' }, color: 'bg-amber-100 text-amber-700' },
  processing: { label: { en: 'Processing Transfer', id: 'Proses Transfer' }, color: 'bg-blue-100 text-blue-700' },
  paid: { label: { en: 'Paid', id: 'Dibayar' }, color: 'bg-green-100 text-green-700' },
  failed: { label: { en: 'Failed', id: 'Gagal' }, color: 'bg-red-100 text-red-700' },
}

interface PayoutDetailProps {
  payout: Payout
  onBack: () => void
}

export function PayoutDetail({ payout, onBack }: PayoutDetailProps) {
  const { language } = useTranslation()
  const { approvePayout, updatePayoutStatus } = usePayoutStore()
  const status = statusConfig[payout.status]

  const handleApprove = () => {
    approvePayout(payout.id, 'Admin')
    toast.success(language === 'id' ? 'Payout disetujui!' : 'Payout approved!')
  }

  const handleSubmitForApproval = () => {
    updatePayoutStatus(payout.id, 'pending')
    toast.success(language === 'id' ? 'Payout diajukan untuk approval!' : 'Payout submitted for approval!')
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payout Report - ${payout.shopName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: system-ui, -apple-system, sans-serif; padding: 20mm; font-size: 12px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #000; }
            .logo { font-size: 24px; font-weight: bold; }
            .title { font-size: 18px; font-weight: bold; margin-bottom: 4px; }
            .subtitle { color: #666; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #ddd; }
            .row { display: flex; justify-content: space-between; padding: 4px 0; }
            .label { color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background: #f5f5f5; font-weight: bold; }
            .text-right { text-align: right; }
            .total-row { font-weight: bold; background: #f0f0f0; }
            .summary-box { background: #f9f9f9; padding: 16px; border-radius: 8px; margin-top: 16px; }
            .net-payout { font-size: 18px; font-weight: bold; color: #2563eb; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 10px; color: #666; }
            @media print { body { padding: 10mm; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">UC</div>
              <div class="subtitle">Fulfillment Center</div>
            </div>
            <div style="text-align: right;">
              <div class="title">Laporan Payout</div>
              <div class="subtitle">${payout.periodLabel}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Informasi Partner</div>
            <div class="row"><span class="label">Nama Toko:</span><span>${payout.shopName}</span></div>
            <div class="row"><span class="label">Pemilik:</span><span>${payout.partnerName}</span></div>
            <div class="row"><span class="label">Bank:</span><span>${payout.bankName} - ${payout.bankAccountNumber}</span></div>
            <div class="row"><span class="label">Atas Nama:</span><span>${payout.bankAccountName}</span></div>
          </div>

          <div class="section">
            <div class="section-title">Detail Penjualan</div>
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Produk</th>
                  <th class="text-right">Qty</th>
                  <th class="text-right">Harga</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${payout.lineItems.map(item => `
                  <tr>
                    <td>${item.orderNumber}</td>
                    <td>${item.productName}</td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">Rp ${item.sellingPrice.toLocaleString('id-ID')}</td>
                    <td class="text-right">Rp ${item.lineTotal.toLocaleString('id-ID')}</td>
                  </tr>
                `).join('')}
                <tr class="total-row">
                  <td colspan="4">Total Penjualan</td>
                  <td class="text-right">Rp ${payout.totalSales.toLocaleString('id-ID')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          ${payout.deductions.length > 0 ? `
            <div class="section">
              <div class="section-title">Potongan</div>
              <table>
                <thead>
                  <tr>
                    <th>Deskripsi</th>
                    <th>Tanggal</th>
                    <th class="text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  ${payout.deductions.map(ded => `
                    <tr>
                      <td>${ded.description}</td>
                      <td>${new Date(ded.date).toLocaleDateString('id-ID')}</td>
                      <td class="text-right">-Rp ${ded.amount.toLocaleString('id-ID')}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}

          <div class="summary-box">
            <div class="row"><span>Total Penjualan</span><span>Rp ${payout.totalSales.toLocaleString('id-ID')}</span></div>
            <div class="row"><span>Komisi UC (${payout.commissionRate}%)</span><span>-Rp ${payout.commissionAmount.toLocaleString('id-ID')}</span></div>
            ${payout.totalDeductions > 0 ? `<div class="row"><span>Potongan</span><span>-Rp ${payout.totalDeductions.toLocaleString('id-ID')}</span></div>` : ''}
            <hr style="margin: 8px 0;">
            <div class="row"><span style="font-weight: bold;">Total Payout</span><span class="net-payout">Rp ${payout.netPayout.toLocaleString('id-ID')}</span></div>
          </div>

          <div class="footer">
            <p>Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
            <p>ID: ${payout.id}</p>
          </div>

          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          {language === 'id' ? 'Kembali' : 'Back'}
        </button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            {language === 'id' ? 'Cetak' : 'Print'}
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`p-4 rounded-xl ${status.color}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {payout.status === 'paid' ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
            <span className="font-semibold">
              {language === 'id' ? status.label.id : status.label.en}
            </span>
          </div>
          {payout.paidAt && (
            <span className="text-sm">
              {new Date(payout.paidAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      {/* Partner Info */}
      <div className="bg-muted/50 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <Store className="h-5 w-5 text-primary" />
          <div>
            <p className="font-semibold">{payout.shopName}</p>
            <p className="text-sm text-muted-foreground">{payout.partnerName}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {language === 'id' ? 'Periode' : 'Period'}
            </p>
            <p className="font-medium">{payout.periodLabel}</p>
          </div>
          <div>
            <p className="text-muted-foreground flex items-center gap-1">
              <CreditCard className="h-3 w-3" /> {language === 'id' ? 'Bank' : 'Bank'}
            </p>
            <p className="font-medium">{payout.bankName}</p>
            <p className="text-xs text-muted-foreground">{payout.bankAccountNumber} a.n. {payout.bankAccountName}</p>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-background border rounded-xl overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <Package className="h-4 w-4" />
            {language === 'id' ? 'Detail Penjualan' : 'Sales Details'}
            <span className="text-sm font-normal text-muted-foreground">
              ({payout.totalItems} {language === 'id' ? 'transaksi' : 'transactions'}, {payout.totalQuantity} pcs)
            </span>
          </h3>
        </div>
        <div className="divide-y max-h-64 overflow-y-auto">
          {payout.lineItems.map((item) => (
            <div key={item.id} className="p-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{item.productName}</p>
                <p className="text-xs text-muted-foreground">
                  {item.orderNumber} • {item.quantity}x @ {formatPrice(item.sellingPrice)}
                </p>
              </div>
              <p className="font-semibold">{formatPrice(item.lineTotal)}</p>
            </div>
          ))}
        </div>
        <div className="p-4 bg-muted/50 flex justify-between font-semibold">
          <span>{language === 'id' ? 'Total Penjualan' : 'Total Sales'}</span>
          <span>{formatPrice(payout.totalSales)}</span>
        </div>
      </div>

      {/* Deductions */}
      {payout.deductions.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-red-200 dark:border-red-800">
            <h3 className="font-semibold flex items-center gap-2 text-red-700 dark:text-red-400">
              <Minus className="h-4 w-4" />
              {language === 'id' ? 'Potongan' : 'Deductions'}
            </h3>
          </div>
          <div className="divide-y divide-red-200 dark:divide-red-800">
            {payout.deductions.map((ded) => (
              <div key={ded.id} className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{ded.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(ded.date).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <p className="font-semibold text-red-600">-{formatPrice(ded.amount)}</p>
              </div>
            ))}
          </div>
          <div className="p-4 bg-red-100 dark:bg-red-900/30 flex justify-between font-semibold text-red-700 dark:text-red-400">
            <span>{language === 'id' ? 'Total Potongan' : 'Total Deductions'}</span>
            <span>-{formatPrice(payout.totalDeductions)}</span>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>{language === 'id' ? 'Total Penjualan' : 'Total Sales'}</span>
          <span>{formatPrice(payout.totalSales)}</span>
        </div>
        <div className="flex justify-between text-sm text-amber-600">
          <span className="flex items-center gap-1">
            <Percent className="h-3 w-3" />
            {language === 'id' ? 'Komisi UC' : 'AlyaNoor Commission'} ({payout.commissionRate}%)
          </span>
          <span>-{formatPrice(payout.commissionAmount)}</span>
        </div>
        {payout.totalDeductions > 0 && (
          <div className="flex justify-between text-sm text-red-600">
            <span>{language === 'id' ? 'Potongan' : 'Deductions'}</span>
            <span>-{formatPrice(payout.totalDeductions)}</span>
          </div>
        )}
        <div className="h-px bg-primary/30" />
        <div className="flex justify-between items-center">
          <span className="font-semibold">{language === 'id' ? 'Total Payout' : 'Net Payout'}</span>
          <span className="text-2xl font-bold text-primary">{formatPrice(payout.netPayout)}</span>
        </div>
      </div>

      {/* Actions */}
      {payout.status === 'draft' && (
        <Button onClick={handleSubmitForApproval} className="w-full">
          {language === 'id' ? 'Ajukan untuk Approval' : 'Submit for Approval'}
        </Button>
      )}

      {payout.status === 'pending' && (
        <Button onClick={handleApprove} className="w-full">
          <CheckCircle className="h-4 w-4 mr-2" />
          {language === 'id' ? 'Setujui Payout' : 'Approve Payout'}
        </Button>
      )}

      {/* Transfer Info */}
      {payout.status === 'paid' && payout.transferReference && (
        <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4">
          <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">
            {language === 'id' ? 'Informasi Transfer' : 'Transfer Information'}
          </h3>
          <div className="text-sm space-y-1">
            <p><span className="text-muted-foreground">Ref:</span> {payout.transferReference}</p>
            <p><span className="text-muted-foreground">{language === 'id' ? 'Tanggal' : 'Date'}:</span> {new Date(payout.transferDate!).toLocaleString('id-ID')}</p>
            <p><span className="text-muted-foreground">{language === 'id' ? 'Oleh' : 'By'}:</span> {payout.paidBy}</p>
          </div>
        </div>
      )}
    </div>
  )
}
