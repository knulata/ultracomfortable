'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, Loader2, Check, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ password: '', confirmPassword: '' })

  const passwordRequirements = [
    { label: 'At least 8 characters', met: form.password.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(form.password) },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(form.password) },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (!passwordRequirements.every(r => r.met)) {
      toast.error('Please meet all password requirements')
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSuccess(true)
    setIsLoading(false)
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Password Reset!</h1>
        <p className="text-muted-foreground mb-6">
          Your password has been successfully reset.
          You can now sign in with your new password.
        </p>

        <Button asChild className="w-full" size="lg">
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground mt-2">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Password Requirements */}
          <div className="mt-2 space-y-1">
            {passwordRequirements.map((req, i) => (
              <div key={i} className={`flex items-center gap-2 text-xs ${req.met ? 'text-green-600' : 'text-muted-foreground'}`}>
                <Check className={`h-3 w-3 ${req.met ? '' : 'opacity-30'}`} />
                {req.label}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
            />
          </div>
          {form.confirmPassword && form.password !== form.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Resetting...
            </>
          ) : (
            'Reset Password'
          )}
        </Button>
      </form>
    </div>
  )
}
