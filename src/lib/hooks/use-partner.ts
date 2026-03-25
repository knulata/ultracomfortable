'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchCurrentPartner, fetchPartnerStats } from '@/lib/supabase/partners-db'

export function usePartner() {
  return useQuery({
    queryKey: ['current-partner'],
    queryFn: fetchCurrentPartner,
    staleTime: 300_000,
  })
}

export function usePartnerStats(partnerId: string | null) {
  return useQuery({
    queryKey: ['partner-stats', partnerId],
    queryFn: () => fetchPartnerStats(partnerId!),
    enabled: !!partnerId,
    staleTime: 60_000,
    refetchInterval: 120_000,
  })
}
