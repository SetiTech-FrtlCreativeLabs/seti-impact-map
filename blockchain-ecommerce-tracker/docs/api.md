# API Documentation

## Base URL

- Development: `http://localhost:4000/api`
- Production: `https://your-domain.com/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Authentication

#### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "USER"
  }
}
```

#### POST /auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "role": "USER"
}
```

### Users

#### GET /users/profile
Get current user profile.

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "role": "USER",
  "purchases": [...],
  "notifications": [...]
}
```

#### GET /users/purchases
Get user's purchases.

**Response:**
```json
[
  {
    "id": "purchase_id",
    "product": {
      "title": "Product Title",
      "sku": "PRODUCT_001"
    },
    "initiative": {
      "title": "Initiative Title",
      "slug": "initiative-slug"
    },
    "total": 50.00,
    "blockchainTokenId": "token_123",
    "txHash": "0x...",
    "status": "BLOCKCHAIN_MINTED"
  }
]
```

### Initiatives

#### GET /initiatives
Get all initiatives.

**Query Parameters:**
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Number to skip (default: 0)
- `status` (optional): Filter by status

**Response:**
```json
[
  {
    "id": "initiative_id",
    "slug": "initiative-slug",
    "title": "Initiative Title",
    "description": "Initiative description",
    "lat": 40.7128,
    "lng": -74.0060,
    "region": "New York",
    "status": "IN_PROGRESS",
    "updates": [...],
    "_count": {
      "purchases": 15
    }
  }
]
```

#### GET /initiatives/:id
Get initiative by ID.

**Response:**
```json
{
  "id": "initiative_id",
  "slug": "initiative-slug",
  "title": "Initiative Title",
  "description": "Initiative description",
  "lat": 40.7128,
  "lng": -74.0060,
  "region": "New York",
  "status": "IN_PROGRESS",
  "updates": [
    {
      "id": "update_id",
      "type": "PROGRESS",
      "content": "Update content",
      "summaryAI": "AI generated summary",
      "tags": ["progress", "milestone"],
      "createdAt": "2024-01-01T00:00:00Z",
      "author": {
        "name": "Author Name"
      }
    }
  ],
  "purchases": [...],
  "_count": {
    "purchases": 15
  }
}
```

#### GET /initiatives/search
Search initiatives.

**Query Parameters:**
- `q`: Search query

**Response:**
```json
[
  {
    "id": "initiative_id",
    "title": "Matching Initiative",
    "description": "Description...",
    "_count": {
      "purchases": 5
    }
  }
]
```

#### POST /initiatives
Create new initiative (Admin only).

**Request:**
```json
{
  "title": "New Initiative",
  "description": "Initiative description",
  "lat": 40.7128,
  "lng": -74.0060,
  "region": "New York"
}
```

#### POST /initiatives/:id/updates
Create initiative update.

**Request:**
```json
{
  "type": "PROGRESS",
  "content": "Update content",
  "images": ["image_url_1", "image_url_2"]
}
```

### E-commerce Webhooks

#### POST /webhooks/shopify/orders/paid
Handle Shopify order paid webhook.

**Headers:**
- `x-shopify-hmac-sha256`: HMAC signature

**Request:**
```json
{
  "id": 12345,
  "customer": {
    "email": "customer@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "line_items": [
    {
      "sku": "PRODUCT_001",
      "quantity": 1,
      "price": "50.00"
    }
  ]
}
```

### Notifications

#### GET /notifications
Get user notifications.

**Response:**
```json
[
  {
    "id": "notification_id",
    "type": "PURCHASE_CONFIRMED",
    "payload": {
      "purchaseId": "purchase_id",
      "tokenId": "token_123"
    },
    "read": false,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /notifications/:id/read
Mark notification as read.

#### POST /notifications/read-all
Mark all notifications as read.

**Request:**
```json
{
  "userId": "user_id"
}
```

### Admin

#### GET /admin/dashboard
Get admin dashboard stats.

**Response:**
```json
{
  "totalUsers": 150,
  "totalInitiatives": 25,
  "totalPurchases": 500,
  "totalRevenue": 25000.00,
  "recentPurchases": [...],
  "recentUpdates": [...]
}
```

#### GET /admin/users
Get all users (Admin only).

#### GET /admin/purchases
Get all purchases (Admin only).

#### GET /admin/ai-jobs
Get all AI jobs (Admin only).

### Health

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "services": {
    "database": {
      "status": "healthy",
      "message": "Database connection successful"
    },
    "api": {
      "status": "healthy",
      "message": "API is running"
    }
  }
}
```

## GraphQL

The API also supports GraphQL at `/graphql`.

### Example Queries

```graphql
query GetInitiatives {
  initiatives {
    id
    title
    description
    lat
    lng
    status
    updates {
      id
      content
      summaryAI
      createdAt
    }
  }
}

query GetUserPurchases {
  userPurchases {
    id
    product {
      title
      sku
    }
    initiative {
      title
      slug
    }
    blockchainTokenId
    status
  }
}

mutation CreateInitiativeUpdate($input: CreateInitiativeUpdateInput!) {
  createInitiativeUpdate(input: $input) {
    id
    content
    summaryAI
    tags
  }
}
```

## WebSocket Events

Connect to `/socket.io/` for real-time updates.

### Events

- `initiative:update` - New initiative update
- `purchase:update` - Purchase status update
- `notification:new` - New notification

### Example Usage

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

socket.on('initiative:update', (update) => {
  console.log('New initiative update:', update);
});

socket.emit('join-initiative', { initiativeId: 'initiative_123' });
```

## Error Responses

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

- 100 requests per 15 minutes per IP
- Webhook endpoints have higher limits
- Admin endpoints may have different limits

## Pagination

List endpoints support pagination:

```
GET /initiatives?limit=10&offset=20
```

Response includes metadata:

```json
{
  "data": [...],
  "pagination": {
    "limit": 10,
    "offset": 20,
    "total": 100,
    "hasMore": true
  }
}
```
