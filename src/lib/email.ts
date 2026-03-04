// Email notification utilities
// In production, integrate with a transactional email service (e.g., Resend, SendGrid)

interface OrderEmailParams {
  to: string
  orderNumber: string
  total: number
  customerName: string
}

export async function sendOrderConfirmationEmail({
  to,
  orderNumber,
  total,
  customerName,
}: OrderEmailParams): Promise<void> {
  // Log for now - replace with actual email service in production
  console.log('Sending order confirmation email:', {
    to,
    orderNumber,
    total,
    customerName,
  })

  // Example integration with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: 'UC Store <noreply@ultracomfortable.com>',
  //   to,
  //   subject: `Pembayaran Berhasil - Order ${orderNumber}`,
  //   html: `
  //     <h1>Terima kasih, ${customerName}!</h1>
  //     <p>Pembayaran untuk order <strong>${orderNumber}</strong> sebesar
  //     <strong>Rp ${total.toLocaleString('id-ID')}</strong> telah berhasil.</p>
  //     <p>Pesanan Anda sedang kami proses.</p>
  //   `,
  // })
}

export async function sendOrderCancelledEmail({
  to,
  orderNumber,
  customerName,
}: Omit<OrderEmailParams, 'total'>): Promise<void> {
  console.log('Sending order cancelled email:', {
    to,
    orderNumber,
    customerName,
  })
}
