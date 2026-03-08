'use client'

import { useState } from 'react'
import { Settings, Percent, Bell, Shield, Globe, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/stores/language'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const { language } = useTranslation()
  const [isSaving, setIsSaving] = useState(false)

  // Mock settings state
  const [settings, setSettings] = useState({
    defaultCommission: 15,
    minOrderAmount: 50000,
    maxOrderAmount: 10000000,
    enableNotifications: true,
    enableAutoApproval: false,
    payoutSchedule: 'weekly',
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success(language === 'id' ? 'Pengaturan disimpan!' : 'Settings saved!')
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          {language === 'id' ? 'Pengaturan' : 'Settings'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'id'
            ? 'Konfigurasi sistem UC'
            : 'Configure UC system settings'}
        </p>
      </div>

      {/* Commission Settings */}
      <div className="bg-background rounded-xl p-6 border">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <Percent className="h-4 w-4" />
          {language === 'id' ? 'Pengaturan Komisi' : 'Commission Settings'}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">
              {language === 'id' ? 'Komisi Default (%)' : 'Default Commission (%)'}
            </label>
            <input
              type="number"
              value={settings.defaultCommission}
              onChange={(e) => setSettings({ ...settings, defaultCommission: Number(e.target.value) })}
              min={0}
              max={50}
              className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'id'
                ? 'Komisi default untuk partner baru'
                : 'Default commission for new partners'}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              {language === 'id' ? 'Jadwal Payout' : 'Payout Schedule'}
            </label>
            <select
              value={settings.payoutSchedule}
              onChange={(e) => setSettings({ ...settings, payoutSchedule: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="weekly">{language === 'id' ? 'Mingguan' : 'Weekly'}</option>
              <option value="biweekly">{language === 'id' ? '2 Minggu' : 'Bi-weekly'}</option>
              <option value="monthly">{language === 'id' ? 'Bulanan' : 'Monthly'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Order Settings */}
      <div className="bg-background rounded-xl p-6 border">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4" />
          {language === 'id' ? 'Pengaturan Order' : 'Order Settings'}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-2">
              {language === 'id' ? 'Minimum Order (Rp)' : 'Min Order (Rp)'}
            </label>
            <input
              type="number"
              value={settings.minOrderAmount}
              onChange={(e) => setSettings({ ...settings, minOrderAmount: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">
              {language === 'id' ? 'Maximum Order (Rp)' : 'Max Order (Rp)'}
            </label>
            <input
              type="number"
              value={settings.maxOrderAmount}
              onChange={(e) => setSettings({ ...settings, maxOrderAmount: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-background rounded-xl p-6 border">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4" />
          {language === 'id' ? 'Notifikasi' : 'Notifications'}
        </h3>

        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">
                {language === 'id' ? 'Aktifkan Notifikasi' : 'Enable Notifications'}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === 'id'
                  ? 'Kirim notifikasi untuk order dan payout'
                  : 'Send notifications for orders and payouts'}
              </p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, enableNotifications: !settings.enableNotifications })}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.enableNotifications ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.enableNotifications ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">
                {language === 'id' ? 'Auto-Approval Partner' : 'Auto-Approve Partners'}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === 'id'
                  ? 'Otomatis setujui partner baru'
                  : 'Automatically approve new partners'}
              </p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, enableAutoApproval: !settings.enableAutoApproval })}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.enableAutoApproval ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.enableAutoApproval ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <Button onClick={handleSave} disabled={isSaving} className="w-full" size="lg">
        {isSaving ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        {language === 'id' ? 'Simpan Pengaturan' : 'Save Settings'}
      </Button>
    </div>
  )
}
