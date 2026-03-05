import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      storeName,
      fullName,
      phone,
      whatsapp,
      email,
      address,
      city,
      marketLocation,
      bankName,
      bankAccountNumber,
      bankAccountName,
    } = body

    if (!storeName || !fullName || !phone || !whatsapp || !address) {
      return NextResponse.json(
        { error: 'Nama toko, nama lengkap, telepon, WhatsApp, dan alamat wajib diisi' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Generate slug from store name
    const storeSlug = storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Check if slug already exists
    const { data: existing } = await (supabase.from('sellers') as any)
      .select('id')
      .eq('store_slug', storeSlug)
      .single()

    const finalSlug = existing
      ? `${storeSlug}-${Date.now().toString(36)}`
      : storeSlug

    // Create seller (without user_id for now - will be linked on auth)
    // For pre-registration, we create a placeholder user or store the data
    const { data: seller, error } = await (supabase.from('sellers') as any)
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // Placeholder, linked on login
        store_name: storeName,
        store_slug: finalSlug,
        phone,
        whatsapp,
        email: email || null,
        address,
        city: city || 'Jakarta',
        market_location: marketLocation || null,
        bank_name: bankName || null,
        bank_account_number: bankAccountNumber || null,
        bank_account_name: bankAccountName || null,
        status: 'pending',
      })
      .select('id, store_name, store_slug')
      .single()

    if (error) {
      console.error('Seller registration error:', error)
      return NextResponse.json(
        { error: 'Gagal mendaftar. Coba lagi.' },
        { status: 500 }
      )
    }

    // Create a WA notification for admin
    await (supabase.from('seller_notifications') as any).insert({
      seller_id: seller.id,
      channel: 'whatsapp',
      type: 'seller_registration',
      title: 'Pendaftaran Seller Baru',
      message: `${storeName} (${fullName}) mendaftar sebagai seller. Lokasi: ${marketLocation || city}. WA: ${whatsapp}`,
      metadata: { fullName, phone, whatsapp, city, marketLocation },
    }).catch(() => {}) // Non-critical

    return NextResponse.json({
      sellerId: seller.id,
      storeName: seller.store_name,
      storeSlug: seller.store_slug,
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}
