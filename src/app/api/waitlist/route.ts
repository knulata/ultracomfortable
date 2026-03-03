import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: NextRequest) {
  try {
    const { email, referredBy } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      )
    }

    // Generate unique referral code
    const referralCode = `UC${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // If Supabase is configured, store in database
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)

      // Check if email already exists
      const { data: existing } = await supabase
        .from('waitlist')
        .select('referral_code')
        .eq('email', email.toLowerCase())
        .single()

      if (existing) {
        return NextResponse.json({
          success: true,
          referralCode: existing.referral_code,
          message: 'Already on waitlist',
        })
      }

      // Insert new waitlist entry
      const { error } = await supabase.from('waitlist').insert({
        email: email.toLowerCase(),
        referral_code: referralCode,
        referred_by: referredBy || null,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error('Supabase error:', error)
        return NextResponse.json(
          { error: 'Failed to join waitlist' },
          { status: 500 }
        )
      }

      // If referred, credit the referrer
      if (referredBy) {
        await supabase
          .from('waitlist')
          .update({ referral_count: supabase.rpc('increment_referral') })
          .eq('referral_code', referredBy)
      }

      // Get current waitlist count
      const { count } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true })

      return NextResponse.json({
        success: true,
        referralCode,
        position: count || 0,
        message: 'Successfully joined waitlist',
      })
    }

    // Fallback response when Supabase is not configured
    return NextResponse.json({
      success: true,
      referralCode,
      position: Math.floor(Math.random() * 500) + 2500,
      message: 'Successfully joined waitlist (demo mode)',
    })

  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get waitlist stats
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { count } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true })

      return NextResponse.json({
        count: count || 0,
      })
    }

    // Demo response
    return NextResponse.json({
      count: 2847 + Math.floor(Math.random() * 100),
    })

  } catch (error) {
    console.error('Waitlist stats error:', error)
    return NextResponse.json({ count: 2847 })
  }
}
