import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// In-memory cart storage (in production, use Redis or database)
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

// Product catalog for validation
const products = [
  { id: 'prod-1', slug: 'relaxed-fit-cotton-tee', name: 'Relaxed Fit Cotton Tee', price: 179000, sizes: ['S', 'M', 'L', 'XL'], colors: ['White', 'Black', 'Navy', 'Grey'] },
  { id: 'prod-2', slug: 'vintage-wash-tshirt', name: 'Vintage Wash T-Shirt', price: 199000, sizes: ['S', 'M', 'L', 'XL'], colors: ['Dusty Blue', 'Sage', 'Cream'] },
  { id: 'prod-3', slug: 'high-waist-straight-jeans', name: 'High Waist Straight Jeans', price: 399000, sizes: ['26', '27', '28', '29', '30', '31', '32'], colors: ['Light Blue', 'Dark Blue', 'Black'] },
  { id: 'prod-4', slug: 'wide-leg-palazzo-pants', name: 'Wide Leg Palazzo Pants', price: 349000, sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Cream', 'Olive'] },
  { id: 'prod-5', slug: 'pleated-midi-skirt', name: 'Pleated Midi Skirt', price: 279000, sizes: ['S', 'M', 'L'], colors: ['Black', 'Navy', 'Dusty Pink'] },
  { id: 'prod-6', slug: 'floral-wrap-dress', name: 'Floral Wrap Dress', price: 449000, sizes: ['S', 'M', 'L', 'XL'], colors: ['Blue Floral', 'Pink Floral', 'Green Floral'] },
  { id: 'prod-7', slug: 'linen-midi-dress', name: 'Linen Midi Dress', price: 399000, sizes: ['S', 'M', 'L'], colors: ['White', 'Beige', 'Light Blue'] },
  { id: 'prod-8', slug: 'chunky-knit-cardigan', name: 'Chunky Knit Cardigan', price: 449000, sizes: ['S/M', 'L/XL'], colors: ['Cream', 'Grey', 'Brown'] },
  { id: 'prod-9', slug: 'cropped-denim-jacket', name: 'Cropped Denim Jacket', price: 499000, sizes: ['S', 'M', 'L'], colors: ['Light Wash', 'Medium Wash', 'Black'] },
  { id: 'prod-10', slug: 'minimal-canvas-tote', name: 'Minimal Canvas Tote', price: 199000, sizes: ['One Size'], colors: ['Natural', 'Black', 'Navy'] },
  { id: 'prod-11', slug: 'gold-hoop-earrings', name: 'Gold Hoop Earrings', price: 149000, sizes: ['Small', 'Medium', 'Large'], colors: ['Gold'] },
  { id: 'prod-12', slug: 'silk-scarf', name: 'Printed Silk Scarf', price: 299000, sizes: ['One Size'], colors: ['Blue Pattern', 'Red Pattern', 'Green Pattern'] },
]

async function getSessionId(request: NextRequest): Promise<string> {
  // Check for session ID in header (for CLI/agent use)
  const headerSessionId = request.headers.get('X-Session-ID')
  if (headerSessionId) {
    return headerSessionId
  }

  // Fallback to cookie
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('alyanoor-session')?.value

  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(7)}`
  }

  return sessionId
}

// GET - Get cart contents
export async function GET(request: NextRequest) {
  const sessionId = await getSessionId(request)
  const cart = carts.get(sessionId) || []

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return NextResponse.json({
    success: true,
    data: {
      sessionId,
      items: cart,
      itemCount,
      subtotal,
      formattedSubtotal: formatPrice(subtotal),
    },
    meta: {
      currency: 'IDR',
    },
  })
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const sessionId = await getSessionId(request)
    const body = await request.json()

    const { productId, size, color, quantity = 1 } = body

    if (!productId) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_PRODUCT_ID', message: 'Product ID is required' } },
        { status: 400 }
      )
    }

    // Find product
    const product = products.find(p => p.id === productId || p.slug === productId)
    if (!product) {
      return NextResponse.json(
        { success: false, error: { code: 'PRODUCT_NOT_FOUND', message: `Product "${productId}" not found` } },
        { status: 404 }
      )
    }

    // Validate size
    const selectedSize = size || product.sizes[0]
    if (!product.sizes.includes(selectedSize)) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_SIZE', message: `Size "${size}" not available. Available: ${product.sizes.join(', ')}` } },
        { status: 400 }
      )
    }

    // Validate color
    const selectedColor = color || product.colors[0]
    if (!product.colors.includes(selectedColor)) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_COLOR', message: `Color "${color}" not available. Available: ${product.colors.join(', ')}` } },
        { status: 400 }
      )
    }

    // Get or create cart
    let cart = carts.get(sessionId) || []

    // Generate variant ID
    const variantId = `${product.id}-${selectedSize}-${selectedColor}`.toLowerCase().replace(/\s+/g, '-')

    // Check if item already in cart
    const existingIndex = cart.findIndex(item => item.variantId === variantId)

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity
    } else {
      cart.push({
        variantId,
        productId: product.id,
        productName: product.name,
        size: selectedSize,
        color: selectedColor,
        price: product.price,
        quantity,
      })
    }

    carts.set(sessionId, cart)

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    const response = NextResponse.json({
      success: true,
      message: `Added ${quantity}x ${product.name} (${selectedSize}, ${selectedColor}) to cart`,
      data: {
        sessionId,
        addedItem: {
          variantId,
          productName: product.name,
          size: selectedSize,
          color: selectedColor,
          price: product.price,
          quantity,
        },
        cart: {
          items: cart,
          itemCount,
          subtotal,
          formattedSubtotal: formatPrice(subtotal),
        },
      },
    })

    // Set session cookie
    response.cookies.set('alyanoor-session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_REQUEST', message: 'Invalid request body' } },
      { status: 400 }
    )
  }
}

// DELETE - Remove item or clear cart
export async function DELETE(request: NextRequest) {
  const sessionId = await getSessionId(request)
  const { searchParams } = new URL(request.url)
  const variantId = searchParams.get('variantId')

  let cart = carts.get(sessionId) || []

  if (variantId) {
    // Remove specific item
    const itemIndex = cart.findIndex(item => item.variantId === variantId)
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: { code: 'ITEM_NOT_FOUND', message: `Item "${variantId}" not in cart` } },
        { status: 404 }
      )
    }

    const removedItem = cart[itemIndex]
    cart = cart.filter(item => item.variantId !== variantId)
    carts.set(sessionId, cart)

    return NextResponse.json({
      success: true,
      message: `Removed ${removedItem.productName} from cart`,
      data: {
        removedItem,
        cart: {
          items: cart,
          itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        },
      },
    })
  } else {
    // Clear entire cart
    carts.delete(sessionId)

    return NextResponse.json({
      success: true,
      message: 'Cart cleared',
      data: {
        cart: {
          items: [],
          itemCount: 0,
          subtotal: 0,
        },
      },
    })
  }
}

// PATCH - Update item quantity
export async function PATCH(request: NextRequest) {
  try {
    const sessionId = await getSessionId(request)
    const body = await request.json()
    const { variantId, quantity } = body

    if (!variantId) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_VARIANT_ID', message: 'Variant ID is required' } },
        { status: 400 }
      )
    }

    let cart = carts.get(sessionId) || []
    const itemIndex = cart.findIndex(item => item.variantId === variantId)

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: { code: 'ITEM_NOT_FOUND', message: `Item "${variantId}" not in cart` } },
        { status: 404 }
      )
    }

    if (quantity <= 0) {
      // Remove item
      const removedItem = cart[itemIndex]
      cart = cart.filter(item => item.variantId !== variantId)
      carts.set(sessionId, cart)

      return NextResponse.json({
        success: true,
        message: `Removed ${removedItem.productName} from cart`,
        data: {
          cart: {
            items: cart,
            itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
          },
        },
      })
    }

    cart[itemIndex].quantity = quantity
    carts.set(sessionId, cart)

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return NextResponse.json({
      success: true,
      message: `Updated quantity to ${quantity}`,
      data: {
        updatedItem: cart[itemIndex],
        cart: {
          items: cart,
          itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
          subtotal,
          formattedSubtotal: formatPrice(subtotal),
        },
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
