import { NextRequest, NextResponse } from 'next/server'

// Product catalog for API access
const products = [
  // HIJAB PRODUCTS
  {
    id: 'hijab-1',
    slug: 'premium-voal-square-hijab',
    name: 'Premium Voal Square Hijab',
    description: 'Soft and breathable voal square hijab, easy to style for any occasion',
    price: 89000,
    originalPrice: 129000,
    category: 'hijab',
    sizes: ['115x115cm'],
    colors: ['Black', 'Navy', 'Dusty Pink', 'Sage', 'Cream', 'Mocca'],
    rating: 4.9,
    reviewCount: 1245,
    soldCount: 8920,
    inStock: true,
  },
  {
    id: 'hijab-2',
    slug: 'jersey-instant-hijab',
    name: 'Jersey Instant Hijab',
    description: 'Comfortable instant hijab made from premium jersey, perfect for daily wear',
    price: 75000,
    originalPrice: null,
    category: 'hijab',
    sizes: ['All Size'],
    colors: ['Black', 'Grey', 'Navy', 'Maroon', 'Army'],
    rating: 4.7,
    reviewCount: 892,
    soldCount: 5670,
    inStock: true,
  },
  {
    id: 'hijab-3',
    slug: 'pashmina-diamond-italiano',
    name: 'Pashmina Diamond Italiano',
    description: 'Elegant pashmina with diamond texture, luxurious feel for special occasions',
    price: 125000,
    originalPrice: 175000,
    category: 'hijab',
    sizes: ['175x75cm'],
    colors: ['Black', 'White', 'Dusty Purple', 'Burgundy', 'Emerald'],
    rating: 4.8,
    reviewCount: 567,
    soldCount: 3450,
    inStock: true,
  },
  {
    id: 'hijab-4',
    slug: 'bergo-daily-sport',
    name: 'Bergo Daily Sport',
    description: 'Sporty bergo hijab with quick-dry fabric, perfect for active lifestyle',
    price: 65000,
    originalPrice: null,
    category: 'hijab',
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Navy', 'Grey', 'White'],
    rating: 4.6,
    reviewCount: 432,
    soldCount: 2890,
    inStock: true,
  },

  // GAMIS PRODUCTS
  {
    id: 'gamis-1',
    slug: 'basic-daily-gamis',
    name: 'Basic Daily Gamis',
    description: 'Comfortable everyday gamis with loose fit, perfect for daily activities',
    price: 189000,
    originalPrice: 249000,
    category: 'gamis',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Grey', 'Cream', 'Dusty Pink'],
    rating: 4.8,
    reviewCount: 2156,
    soldCount: 12500,
    inStock: true,
  },
  {
    id: 'gamis-2',
    slug: 'abaya-arabian-premium',
    name: 'Abaya Arabian Premium',
    description: 'Elegant arabian style abaya with embroidery details',
    price: 450000,
    originalPrice: 599000,
    category: 'gamis',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Emerald', 'Maroon'],
    rating: 4.9,
    reviewCount: 789,
    soldCount: 4560,
    inStock: true,
  },
  {
    id: 'gamis-3',
    slug: 'gamis-set-khimar',
    name: 'Gamis Set Khimar',
    description: 'Complete set of gamis with matching khimar, ready for any occasion',
    price: 350000,
    originalPrice: 450000,
    category: 'gamis',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Dusty Pink', 'Sage', 'Mocca'],
    rating: 4.7,
    reviewCount: 1234,
    soldCount: 6780,
    inStock: true,
  },
  {
    id: 'gamis-4',
    slug: 'kaftan-mewah-brukat',
    name: 'Kaftan Mewah Brukat',
    description: 'Luxurious kaftan with lace details, perfect for special occasions',
    price: 550000,
    originalPrice: 750000,
    category: 'gamis',
    sizes: ['All Size'],
    colors: ['Gold', 'Silver', 'Navy', 'Maroon'],
    rating: 4.9,
    reviewCount: 456,
    soldCount: 2340,
    inStock: true,
  },

  // KHIMAR PRODUCTS
  {
    id: 'khimar-1',
    slug: 'khimar-pet-ceruti',
    name: 'Khimar Pet Ceruti',
    description: 'Elegant khimar with pet (brim) made from premium ceruti fabric',
    price: 145000,
    originalPrice: 189000,
    category: 'khimar',
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Navy', 'Grey', 'Dusty Pink', 'Cream'],
    rating: 4.8,
    reviewCount: 678,
    soldCount: 4560,
    inStock: true,
  },
  {
    id: 'khimar-2',
    slug: 'khimar-syari-jumbo',
    name: 'Khimar Syari Jumbo',
    description: 'Extra long khimar for full coverage, syari style',
    price: 175000,
    originalPrice: null,
    category: 'khimar',
    sizes: ['L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Brown', 'Grey'],
    rating: 4.9,
    reviewCount: 892,
    soldCount: 5670,
    inStock: true,
  },
  {
    id: 'khimar-3',
    slug: 'niqab-bandana-style',
    name: 'Niqab Bandana Style',
    description: 'Comfortable niqab with bandana style, easy to wear',
    price: 55000,
    originalPrice: 75000,
    category: 'khimar',
    sizes: ['All Size'],
    colors: ['Black', 'Navy', 'Brown'],
    rating: 4.7,
    reviewCount: 345,
    soldCount: 2340,
    inStock: true,
  },

  // MUKENA PRODUCTS
  {
    id: 'mukena-1',
    slug: 'mukena-travel-parasut',
    name: 'Mukena Travel Parasut',
    description: 'Lightweight travel mukena with carrying pouch, quick dry fabric',
    price: 165000,
    originalPrice: 215000,
    category: 'mukena',
    sizes: ['All Size'],
    colors: ['White', 'Soft Pink', 'Mint', 'Lavender'],
    rating: 4.8,
    reviewCount: 1567,
    soldCount: 8920,
    inStock: true,
  },
  {
    id: 'mukena-2',
    slug: 'mukena-katun-jepang-premium',
    name: 'Mukena Katun Jepang Premium',
    description: 'Premium Japanese cotton mukena, soft and comfortable for long prayers',
    price: 285000,
    originalPrice: 350000,
    category: 'mukena',
    sizes: ['All Size'],
    colors: ['White', 'Broken White', 'Soft Grey'],
    rating: 4.9,
    reviewCount: 2345,
    soldCount: 12340,
    inStock: true,
  },
  {
    id: 'mukena-3',
    slug: 'mukena-anak-karakter',
    name: 'Mukena Anak Karakter',
    description: 'Cute character mukena for kids, comfortable and easy to wear',
    price: 125000,
    originalPrice: null,
    category: 'mukena',
    sizes: ['3-5 Years', '6-8 Years', '9-12 Years'],
    colors: ['Pink', 'Purple', 'Blue', 'Green'],
    rating: 4.7,
    reviewCount: 567,
    soldCount: 3450,
    inStock: true,
  },

  // ORIGINAL PRODUCTS (TOPS, BOTTOMS, ETC.)
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
      categories: ['hijab', 'gamis', 'khimar', 'mukena', 'tops', 'bottoms', 'dresses', 'outerwear', 'accessories'],
      currency: 'IDR',
    },
  })
}
