import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for orders (in production, use database)
const orders = new Map<string, Order>()
const carts = new Map<string, CartItem[]>()

interface CartItem {
  variantId: string
  productId: string
  productName: string
  size: string
  color: string
  price: number
  quantity: number
}

interface Order {
  id: string
  sessionId: string
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered'
  customer: {
    name: string
    email?: string
    phone: string
    address: string
    city: string
    postalCode?: string
  }
  paymentMethod: string
  notes?: string
  createdAt: string
  updatedAt: string
}

function getSessionId(request: NextRequest): string {
  const headerSessionId = request.headers.get('X-Session-ID')
  if (headerSessionId) return headerSessionId
  return ''
}

// GET - Get order(s)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('id')
  const sessionId = getSessionId(request)

  if (orderId) {
    // Get specific order
    const order = orders.get(orderId)
    if (!order) {
      return NextResponse.json(
        { success: false, error: { code: 'ORDER_NOT_FOUND', message: `Order "${orderId}" not found` } },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order,
    })
  }

  // Get all orders for session
  if (!sessionId) {
    return NextResponse.json(
      { success: false, error: { code: 'MISSING_SESSION', message: 'Session ID required. Pass X-Session-ID header.' } },
      { status: 400 }
    )
  }

  const sessionOrders = Array.from(orders.values())
    .filter(o => o.sessionId === sessionId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json({
    success: true,
    data: {
      orders: sessionOrders,
      count: sessionOrders.length,
    },
  })
}

// POST - Create order (checkout)
export async function POST(request: NextRequest) {
  try {
    const sessionId = getSessionId(request)
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_SESSION', message: 'Session ID required. Pass X-Session-ID header.' } },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { customer, paymentMethod = 'cod', notes } = body

    // Validate customer info
    if (!customer?.name) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_NAME', message: 'Customer name is required' } },
        { status: 400 }
      )
    }
    if (!customer?.phone) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_PHONE', message: 'Customer phone is required' } },
        { status: 400 }
      )
    }
    if (!customer?.address) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_ADDRESS', message: 'Customer address is required' } },
        { status: 400 }
      )
    }
    if (!customer?.city) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_CITY', message: 'Customer city is required' } },
        { status: 400 }
      )
    }

    // Get cart
    const cart = carts.get(sessionId) || []
    if (cart.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'EMPTY_CART', message: 'Cart is empty. Add items before checkout.' } },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= 500000 ? 0 : 25000 // Free shipping over 500k
    const total = subtotal + shipping

    // Create order
    const orderId = `UC-${Date.now().toString(36).toUpperCase()}`
    const order: Order = {
      id: orderId,
      sessionId,
      items: [...cart],
      subtotal,
      shipping,
      total,
      status: 'pending',
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        postalCode: customer.postalCode,
      },
      paymentMethod,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    orders.set(orderId, order)

    // Clear cart after successful order
    carts.delete(sessionId)

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      data: {
        order,
        formattedTotal: formatPrice(total),
        nextSteps: paymentMethod === 'cod'
          ? 'Your order will be shipped within 1-2 business days. Pay upon delivery.'
          : 'Please complete payment within 24 hours.',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_REQUEST', message: 'Invalid request body' } },
      { status: 400 }
    )
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Re-export carts for cart API to use
export { carts }
