import { createClient } from './client'

const supabase = createClient()

export interface PartnerDB {
  id: string
  user_id: string
  owner_name: string
  shop_name: string
  phone: string
  whatsapp: string
  email: string | null
  shop_address: string
  block: string
  floor: string | null
  shop_number: string | null
  bank_name: string | null
  bank_account_number: string | null
  bank_account_name: string | null
  commission_rate: number
  status: 'pending' | 'approved' | 'active' | 'suspended' | 'rejected'
  status_note: string | null
  specialties: string[]
  weekly_capacity: number
  fulfillment_rate: number
  applied_at: string
  approved_at: string | null
  created_at: string
  updated_at: string
}

export async function fetchCurrentPartner(): Promise<PartnerDB | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function fetchPartnerById(partnerId: string): Promise<PartnerDB | null> {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('id', partnerId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function updatePartner(partnerId: string, updates: Partial<PartnerDB>) {
  const { data, error } = await supabase
    .from('partners')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', partnerId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function registerPartner(partnerData: {
  owner_name: string
  shop_name: string
  phone: string
  whatsapp: string
  shop_address: string
  block: string
  specialties: string[]
}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('partners')
    .insert({ ...partnerData, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function fetchPartnerStats(partnerId: string) {
  const { data: responses, error } = await supabase
    .from('partner_responses')
    .select('*')
    .eq('partner_id', partnerId)

  if (error) throw error

  const total = responses?.length ?? 0
  const committed = responses?.filter(r => r.response === 'bisa').length ?? 0
  const fulfilled = responses?.filter(r => r.fulfilled).length ?? 0

  return {
    totalResponses: total,
    totalCommitted: committed,
    totalFulfilled: fulfilled,
    fulfillmentRate: committed > 0 ? (fulfilled / committed) * 100 : 0,
    todayCommitted: responses?.filter(r => {
      const today = new Date().toISOString().split('T')[0]
      return r.response === 'bisa' && r.responded_at?.startsWith(today)
    }).length ?? 0,
  }
}
