import 'dotenv/config'

export const config = {
  port: parseInt(process.env.PORT ?? '3000'),
  supabase: {
    url: process.env.SUPABASE_URL ?? '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY ?? '',
  },
  apify: {
    token: process.env.APIFY_API_TOKEN ?? '',
  },
  whatsapp: {
    token: process.env.WHATSAPP_TOKEN ?? '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ?? '',
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN ?? 'alyanoor-verify-2026',
  },
  redis: {
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  },
} as const

export function validateConfig() {
  const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
  const missing = required.filter((key) => !process.env[key])
  if (missing.length > 0) {
    console.error(JSON.stringify({ level: 'error', msg: 'Missing env vars', missing }))
    process.exit(1)
  }
}
