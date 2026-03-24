# Alyanoor Shop CLI & API

A command-line interface and REST API for AI agents to browse and purchase clothing from Alyanoor.

## Quick Start

### Using the CLI

```bash
# Make sure jq is installed (for JSON parsing)
brew install jq  # macOS
apt install jq   # Ubuntu

# Set environment (optional - defaults to localhost:3000)
export ALYA_API_URL="http://localhost:3000/api"
export ALYA_SESSION_ID="my-agent-session-123"

# Browse products
./cli/alya-shop products

# Search for dresses
./cli/alya-shop search dress

# View product details
./cli/alya-shop product floral-wrap-dress

# Add to cart
./cli/alya-shop add floral-wrap-dress --size M --color "Blue Floral"

# View cart
./cli/alya-shop cart

# Checkout
./cli/alya-shop checkout \
  --name "John Doe" \
  --phone "08123456789" \
  --address "Jl. Contoh No. 123" \
  --city "Jakarta"
```

### Using the REST API

```bash
# List products
curl http://localhost:3000/api/products

# Search products
curl "http://localhost:3000/api/products?search=dress&category=dresses"

# Get product details
curl http://localhost:3000/api/products/floral-wrap-dress

# Add to cart (use session ID for persistence)
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "X-Session-ID: my-session-123" \
  -d '{"productId": "floral-wrap-dress", "size": "M", "color": "Blue Floral", "quantity": 1}'

# View cart
curl http://localhost:3000/api/cart \
  -H "X-Session-ID: my-session-123"

# Checkout
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "X-Session-ID: my-session-123" \
  -d '{
    "customer": {
      "name": "John Doe",
      "phone": "08123456789",
      "address": "Jl. Contoh No. 123",
      "city": "Jakarta"
    },
    "paymentMethod": "cod"
  }'
```

## API Reference

### Products

#### List Products
```
GET /api/products
```

Query parameters:
- `search` - Search by name/description
- `category` - Filter by category (tops, bottoms, dresses, outerwear, accessories)
- `minPrice` - Minimum price (IDR)
- `maxPrice` - Maximum price (IDR)
- `sort` - Sort by: `price_asc`, `price_desc`, `rating`, `popular`
- `limit` - Number of results (default: 20)
- `offset` - Pagination offset

Response:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod-1",
        "slug": "relaxed-fit-cotton-tee",
        "name": "Relaxed Fit Cotton Tee",
        "description": "...",
        "price": 179000,
        "originalPrice": 229000,
        "category": "tops",
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["White", "Black", "Navy"],
        "rating": 4.6,
        "reviewCount": 189,
        "soldCount": 892,
        "inStock": true
      }
    ],
    "pagination": {
      "total": 12,
      "limit": 20,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

#### Get Product Details
```
GET /api/products/{slug}
```

Response includes full product details plus available variants.

### Cart

**Important:** Pass `X-Session-ID` header to maintain cart across requests.

#### View Cart
```
GET /api/cart
Headers: X-Session-ID: your-session-id
```

#### Add to Cart
```
POST /api/cart
Headers:
  Content-Type: application/json
  X-Session-ID: your-session-id

Body:
{
  "productId": "floral-wrap-dress",  // slug or id
  "size": "M",                        // optional, defaults to first
  "color": "Blue Floral",             // optional, defaults to first
  "quantity": 1                       // optional, default 1
}
```

#### Update Quantity
```
PATCH /api/cart
Headers: X-Session-ID: your-session-id

Body:
{
  "variantId": "prod-6-m-blue-floral",
  "quantity": 2
}
```

#### Remove Item
```
DELETE /api/cart?variantId=prod-6-m-blue-floral
Headers: X-Session-ID: your-session-id
```

#### Clear Cart
```
DELETE /api/cart
Headers: X-Session-ID: your-session-id
```

### Orders

#### Create Order (Checkout)
```
POST /api/orders
Headers:
  Content-Type: application/json
  X-Session-ID: your-session-id

Body:
{
  "customer": {
    "name": "John Doe",           // required
    "phone": "08123456789",       // required
    "address": "Jl. Contoh 123",  // required
    "city": "Jakarta",            // required
    "email": "john@example.com",  // optional
    "postalCode": "12345"         // optional
  },
  "paymentMethod": "cod",         // cod or transfer
  "notes": "Leave at door"        // optional
}
```

#### Get Orders
```
GET /api/orders
Headers: X-Session-ID: your-session-id
```

#### Get Order Details
```
GET /api/orders?id=AN-ABC123
```

## Product Categories

| Category | Description |
|----------|-------------|
| `hijab` | Hijab, pashmina, instant hijab, bergo |
| `gamis` | Gamis, abaya, kaftan |
| `khimar` | Khimar, niqab |
| `mukena` | Prayer wear, mukena |
| `tops` | T-shirts, blouses, shirts |
| `bottoms` | Jeans, pants, skirts |
| `dresses` | Dresses of all styles |
| `outerwear` | Jackets, cardigans |
| `accessories` | Bags, jewelry, scarves |

## Pricing

All prices are in Indonesian Rupiah (IDR).

- Free shipping on orders over Rp 500,000
- Standard shipping: Rp 25,000

## Example Agent Workflow

```python
import requests

BASE_URL = "http://localhost:3000/api"
SESSION_ID = "agent-session-001"
headers = {"X-Session-ID": SESSION_ID}

# 1. Browse products
products = requests.get(f"{BASE_URL}/products?category=dresses").json()
print(f"Found {len(products['data']['products'])} dresses")

# 2. View a product
product = requests.get(f"{BASE_URL}/products/floral-wrap-dress").json()
print(f"Price: Rp {product['data']['price']}")
print(f"Sizes: {product['data']['sizes']}")

# 3. Add to cart
requests.post(f"{BASE_URL}/cart", headers=headers, json={
    "productId": "floral-wrap-dress",
    "size": "M",
    "color": "Blue Floral"
})

# 4. View cart
cart = requests.get(f"{BASE_URL}/cart", headers=headers).json()
print(f"Cart total: {cart['data']['formattedSubtotal']}")

# 5. Checkout
order = requests.post(f"{BASE_URL}/orders", headers=headers, json={
    "customer": {
        "name": "AI Agent",
        "phone": "08123456789",
        "address": "Jl. AI Street 123",
        "city": "Jakarta"
    }
}).json()

print(f"Order placed: {order['data']['order']['id']}")
```

## Error Handling

All errors return:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

Common error codes:
- `PRODUCT_NOT_FOUND` - Product doesn't exist
- `INVALID_SIZE` - Size not available
- `INVALID_COLOR` - Color not available
- `EMPTY_CART` - Cart is empty at checkout
- `MISSING_SESSION` - Session ID required
- `MISSING_NAME` / `MISSING_PHONE` / etc. - Required checkout fields
