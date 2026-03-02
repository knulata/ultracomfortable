'use client'

import { useState } from 'react'
import { User, Mail, Phone, Lock, Bell, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const mockUser = {
  full_name: 'Sarah Johnson',
  email: 'sarah@example.com',
  phone: '081234567890',
}

export default function SettingsPage() {
  const [profile, setProfile] = useState(mockUser)
  const [showPassword, setShowPassword] = useState(false)
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [notifications, setNotifications] = useState({
    order_updates: true,
    promotions: true,
    price_drops: true,
    newsletter: false,
  })

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Profile updated successfully')
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (passwords.new.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    toast.success('Password changed successfully')
    setPasswords({ current: '', new: '', confirm: '' })
  }

  const handleNotificationsSave = () => {
    toast.success('Notification preferences updated')
  }

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <div className="bg-background rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Settings
        </h2>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <Button variant="outline" size="sm">Change Photo</Button>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG max 2MB</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <Button type="submit">Save Changes</Button>
        </form>
      </div>

      {/* Password */}
      <div className="bg-background rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Change Password
        </h2>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1.5">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Confirm New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button type="submit">Change Password</Button>
        </form>
      </div>

      {/* Notifications */}
      <div className="bg-background rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </h2>

        <div className="space-y-4">
          {[
            { key: 'order_updates', label: 'Order Updates', desc: 'Get notified about order status changes' },
            { key: 'promotions', label: 'Promotions & Sales', desc: 'Receive exclusive offers and discounts' },
            { key: 'price_drops', label: 'Price Drop Alerts', desc: 'Get notified when wishlist items go on sale' },
            { key: 'newsletter', label: 'Newsletter', desc: 'Weekly fashion tips and new arrivals' },
          ].map((item) => (
            <label key={item.key} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={notifications[item.key as keyof typeof notifications]}
                onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                className="w-5 h-5 rounded text-primary focus:ring-primary"
              />
            </label>
          ))}
        </div>

        <Button className="mt-6" onClick={handleNotificationsSave}>Save Preferences</Button>
      </div>

      {/* Danger Zone */}
      <div className="bg-background rounded-xl p-6 border border-red-200">
        <h2 className="text-xl font-bold mb-2 text-red-600">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button variant="outline" className="text-red-500 border-red-300 hover:bg-red-50">
          Delete Account
        </Button>
      </div>
    </div>
  )
}
