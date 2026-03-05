import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse our complete collection of trendy, affordable fashion. Women\'s, men\'s, kids\' clothing, and accessories.',
  openGraph: {
    title: 'Shop All Products | UC',
    description: 'Browse our complete collection of trendy, affordable fashion.',
  },
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
