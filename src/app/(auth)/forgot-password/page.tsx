'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitted(true)
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
        <p className="text-muted-foreground mb-6">
          We&apos;ve sent a password reset link to<br />
          <span className="font-medium text-foreground">{email}</span>
        </p>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or
          </p>
          <Button variant="outline" onClick={() => setIsSubmitted(false)}>
            Try another email
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div>
      <Link href="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">Forgot Password?</h1>
        <p className="text-muted-foreground mt-2">
          No worries! Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </form>
    </div>
  )
}
