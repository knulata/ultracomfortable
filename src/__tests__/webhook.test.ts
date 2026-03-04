import { describe, it, expect, vi } from 'vitest'

// Test the verifySignature function directly
describe('Midtrans Webhook Signature', () => {
  it('verifies valid signature', async () => {
    const crypto = await import('crypto')
    const orderId = 'UC-TEST123'
    const statusCode = '200'
    const grossAmount = '500000.00'
    const serverKey = 'SB-Mid-server-test'

    const expectedHash = crypto
      .createHash('sha512')
      .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
      .digest('hex')

    // Import and test
    const { verifySignature } = await import('@/lib/midtrans/client')
    const result = verifySignature(orderId, statusCode, grossAmount, serverKey, expectedHash)
    expect(result).toBe(true)
  })

  it('rejects invalid signature', async () => {
    const { verifySignature } = await import('@/lib/midtrans/client')
    const result = verifySignature('order-1', '200', '500000.00', 'key', 'invalid-hash')
    expect(result).toBe(false)
  })
})

describe('Order Status Mapping', () => {
  const mapStatus = (transactionStatus: string, fraudStatus?: string) => {
    if (transactionStatus === 'capture') {
      return fraudStatus === 'accept' ? 'paid' : 'pending'
    } else if (transactionStatus === 'settlement') {
      return 'paid'
    } else if (transactionStatus === 'pending') {
      return 'pending'
    } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
      return 'cancelled'
    } else if (transactionStatus === 'refund') {
      return 'refunded'
    }
    return 'pending'
  }

  it('maps capture with accept to paid', () => {
    expect(mapStatus('capture', 'accept')).toBe('paid')
  })

  it('maps capture with challenge to pending', () => {
    expect(mapStatus('capture', 'challenge')).toBe('pending')
  })

  it('maps settlement to paid', () => {
    expect(mapStatus('settlement')).toBe('paid')
  })

  it('maps pending to pending', () => {
    expect(mapStatus('pending')).toBe('pending')
  })

  it('maps cancel to cancelled', () => {
    expect(mapStatus('cancel')).toBe('cancelled')
  })

  it('maps deny to cancelled', () => {
    expect(mapStatus('deny')).toBe('cancelled')
  })

  it('maps expire to cancelled', () => {
    expect(mapStatus('expire')).toBe('cancelled')
  })

  it('maps refund to refunded', () => {
    expect(mapStatus('refund')).toBe('refunded')
  })

  it('maps unknown to pending', () => {
    expect(mapStatus('unknown')).toBe('pending')
  })
})
