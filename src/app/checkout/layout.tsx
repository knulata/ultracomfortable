import Script from 'next/script'

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const snapUrl = process.env.NODE_ENV === 'production'
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js'

  return (
    <>
      <Script
        src={snapUrl}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
      {children}
    </>
  )
}
