import { NextRequest, NextResponse } from 'next/server'

// Product catalog for API access
const products = [
  {
    id: 'prod-1',
    slug: 'relaxed-fit-cotton-tee',
    name: 'Relaxed Fit Cotton Tee',
    description: 'Comfortable cotton t-shirt with relaxed fit, perfect for everyday wear',
    price: 179000,
    originalPrice: 229000,
    category: 'tops',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Navy', 'Grey'],
    rating: 4.6,
    reviewCount: 189,
    soldCount: 892,
    inStock: true,
  },
  {
    id: 'prod-2',
    slug: 'vintage-wash-tshirt',
    name: 'Vintage Wash T-Shirt',
    description: 'Soft vintage-washed cotton tee with a lived-in look',
    price: 199000,
    originalPrice: null,
    category: 'tops',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Dusty Blue', 'Sage', 'Cream'],
    rating: 4.8,
    reviewCount: 234,
    soldCount: 1250,
    inStock: true,
  },
  {
    id: 'prod-3',
    slug: 'high-waist-straight-jeans',
    name: 'High Waist Straight Jeans',
    description: 'Classic high-waisted jeans with straight leg silhouette',
    price: 399000,
    originalPrice: 499000,
    category: 'bottoms',
    sizes: ['26', '27', '28', '29', '30', '31', '32'],
    colors: ['Light Blue', 'Dark Blue', 'Black'],
    rating: 4.7,
    reviewCount: 312,
    soldCount: 2100,
    inStock: true,
  },
  {
    id: 'prod-4',
    slug: 'wide-leg-palazzo-pants',
    name: 'Wide Leg Palazzo Pants',
    description: 'Flowy palazzo pants with wide leg and elastic waist',
    price: 349000,
    originalPrice: null,
    category: 'bottoms',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Cream', 'Olive'],
    rating: 4.4,
    reviewCount: 98,
    soldCount: 430,
    inStock: true,
  },
  {
    id: 'prod-5',
    slug: 'pleated-midi-skirt',
    name: 'Pleated Midi Skirt',
    description: 'Elegant pleated skirt in midi length, perfect for office or casual',
    price: 279000,
    originalPrice: null,
    category: 'bottoms',
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Navy', 'Dusty Pink'],
    rating: 4.6,
    reviewCount: 167,
    soldCount: 789,
    inStock: true,
  },
  {
    id: 'prod-6',
    slug: 'floral-wrap-dress',
    name: 'Floral Wrap Dress',
    description: 'Beautiful wrap dress with floral print, flattering for all body types',
    price: 449000,
    originalPrice: 549000,
    category: 'dresses',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue Floral', 'Pink Floral', 'Green Floral'],
    rating: 4.9,
    reviewCount: 203,
    soldCount: 567,
    inStock: true,
  },
  {
    id: 'prod-7',
    slug: 'linen-midi-dress',
    name: 'Linen Midi Dress',
    description: 'Breathable linen dress perfect for warm weather',
    price: 399000,
    originalPrice: null,
    category: 'dresses',
    sizes: ['S', 'M', 'L'],
    colors: ['White', 'Beige', 'Light Blue'],
    rating: 4.7,
    reviewCount: 145,
    soldCount: 456,
    inStock: true,
  },
  {
    id: 'prod-8',
    slug: 'chunky-knit-cardigan',
    name: 'Chunky Knit Cardigan',
    description: 'Cozy oversized cardigan in chunky knit, perfect for layering',
    price: 449000,
    originalPrice: 549000,
    category: 'outerwear',
    sizes: ['S/M', 'L/XL'],
    colors: ['Cream', 'Grey', 'Brown'],
    rating: 4.8,
    reviewCount: 189,
    soldCount: 890,
    inStock: true,
  },
  {
    id: 'prod-9',
    slug: 'cropped-denim-jacket',
    name: 'Cropped Denim Jacket',
    description: 'Classic denim jacket with cropped length, versatile wardrobe staple',
    price: 499000,
    originalPrice: null,
    category: 'outerwear',
    sizes: ['S', 'M', 'L'],
    colors: ['Light Wash', 'Medium Wash', 'Black'],
    rating: 4.6,
    reviewCount: 123,
    soldCount: 345,
    inStock: true,
  },
  {
    id: 'prod-10',
    slug: 'minimal-canvas-tote',
    name: 'Minimal Canvas Tote',
    description: 'Simple and durable canvas tote bag for everyday use',
    price: 199000,
    originalPrice: null,
    category: 'accessories',
    sizes: ['One Size'],
    colors: ['Natural', 'Black', 'Navy'],
    rating: 4.5,
    reviewCount: 87,
    soldCount: 234,
    inStock: true,
  },
  {
    id: 'prod-11',
    slug: 'gold-hoop-earrings',
    name: 'Gold Hoop Earrings',
    description: 'Classic gold-plated hoop earrings, timeless accessory',
    price: 149000,
    originalPrice: null,
    category: 'accessories',
    sizes: ['Small', 'Medium', 'Large'],
    colors: ['Gold'],
    rating: 4.7,
    reviewCount: 156,
    soldCount: 567,
    inStock: true,
  },
  {
    id: 'prod-12',
    slug: 'silk-scarf',
    name: 'Printed Silk Scarf',
    description: 'Luxurious silk scarf with artistic print, versatile styling options',
    price: 299000,
    originalPrice: 399000,
    category: 'accessories',
    sizes: ['One Size'],
    colors: ['Blue Pattern', 'Red Pattern', 'Green Pattern'],
    rating: 4.8,
    reviewCount: 92,
    soldCount: 178,
    inStock: true,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Filter parameters
  const category = searchParams.get('category')
  const search = searchParams.get('search')?.toLowerCase()
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const sort = searchParams.get('sort') // price_asc, price_desc, rating, popular
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  let filtered = [...products]

  // Apply filters
  if (category) {
    filtered = filtered.filter(p => p.category === category)
  }

  if (search) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search)
    )
  }

  if (minPrice) {
    filtered = filtered.filter(p => p.price >= parseInt(minPrice))
  }

  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= parseInt(maxPrice))
  }

  // Apply sorting
  if (sort === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price)
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price)
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating)
  } else if (sort === 'popular') {
    filtered.sort((a, b) => b.soldCount - a.soldCount)
  }

  // Pagination
  const total = filtered.length
  const paginated = filtered.slice(offset, offset + limit)

  return NextResponse.json({
    success: true,
    data: {
      products: paginated,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    },
    meta: {
      categories: ['tops', 'bottoms', 'dresses', 'outerwear', 'accessories'],
      currency: 'IDR',
    },
  })
}
