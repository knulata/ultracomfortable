import type { Metadata } from 'next'

export const metadata: Metadata = {
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'UC - Ultra Comfortable',
  },
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
