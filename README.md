# UC (Ultra Comfortable)

Indonesian fashion e-commerce platform — Comfort Meets Style.

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Payments:** Midtrans (GoPay, ShopeePay, DANA, OVO, QRIS, VA, Credit Card, BNPL)
- **UI:** Tailwind CSS 4, shadcn/ui, Radix UI
- **State:** Zustand + TanStack React Query

## Features

- Product catalog with categories (Women, Men, Kids, Beauty)
- Full checkout flow with Midtrans payment gateway
- User accounts with addresses, order history, wishlists
- Reseller/grosir management with tiered wholesale pricing
- Product Q&A, reviews, and size feedback
- Flash sales, daily deals, and bundle discounts
- Back-in-stock and price drop alerts
- Loyalty points and referral program
- UC Stylist (AI personal shopper)
- UC Originals (exclusive collection)

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in your Supabase and Midtrans keys

# Run database migrations
# Apply supabase/migrations/*.sql to your Supabase project

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_APP_URL` | Application URL |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | Midtrans client key |
| `MIDTRANS_SERVER_KEY` | Midtrans server key |

## Project Structure

```
src/
├── app/              # Next.js App Router pages & API routes
│   ├── api/          # Payment webhooks, cart API
│   ├── account/      # User account pages
│   ├── products/     # Product catalog
│   └── ...
├── components/       # React components (27 feature directories)
├── lib/              # Supabase client, Midtrans client, utilities
├── stores/           # Zustand state stores
└── types/            # TypeScript type definitions
supabase/
└── migrations/       # Database schema migrations
```

## Database Migrations

- `001_initial_schema.sql` — Core tables (profiles, products, orders, reviews, etc.)
- `002_new_features.sql` — Resellers, Q&A, stock alerts, daily deals, bundles, price history
