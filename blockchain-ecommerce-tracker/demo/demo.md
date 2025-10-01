# Demo Guide

This guide walks through the complete functionality of the Blockchain E-commerce Initiative Tracker.

## Prerequisites

1. **Start the application:**
```bash
# Start all services
docker-compose up -d

# Run migrations
npm run migrate

# Seed database
npm run seed

# Deploy contracts (optional for demo)
npm run deploy:contracts
```

2. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- GraphQL Playground: http://localhost:4000/graphql

## Demo Scenarios

### 1. User Registration and Login

1. **Visit the homepage** at http://localhost:3000
2. **Click "Get Started"** to register
3. **Fill in registration form:**
   - Email: `demo@example.com`
   - Password: `demo123`
   - Name: `Demo User`
4. **Login** with the created credentials

### 2. Explore Initiatives

1. **Navigate to Initiatives** from the main menu
2. **View the map** showing initiative locations
3. **Click on initiative pins** to see details
4. **Read initiative updates** and progress reports
5. **Use the search** to find specific initiatives

### 3. Simulate a Purchase

1. **Create a test product** in the admin panel:
   - Go to http://localhost:3000/admin
   - Login as admin (admin@example.com / admin123)
   - Add a new product with SKU: `DEMO_PRODUCT_001`

2. **Simulate Shopify webhook:**
```bash
curl -X POST http://localhost:4000/api/webhooks/shopify/orders/paid \
  -H "Content-Type: application/json" \
  -H "x-shopify-hmac-sha256: your_hmac_signature" \
  -d '{
    "id": 12345,
    "customer": {
      "email": "demo@example.com",
      "first_name": "Demo",
      "last_name": "User"
    },
    "line_items": [
      {
        "sku": "DEMO_PRODUCT_001",
        "quantity": 1,
        "price": "25.00"
      }
    ]
  }'
```

3. **Check the results:**
   - User receives email notification
   - Blockchain token is minted
   - Purchase appears in user dashboard
   - Initiative gets linked to purchase

### 4. AI-Powered Features

1. **Create an initiative update:**
   - Go to an initiative page
   - Click "Add Update"
   - Write content about progress
   - Upload images (optional)

2. **Observe AI processing:**
   - AI generates summary
   - Tags are extracted
   - Content is moderated
   - Real-time updates broadcast

3. **View AI recommendations:**
   - Check user dashboard
   - See personalized initiative suggestions
   - Use natural language search

### 5. Real-time Updates

1. **Open multiple browser tabs**
2. **Create an update in one tab**
3. **Watch real-time updates** in other tabs
4. **Test WebSocket connection** in browser console

### 6. Admin Dashboard

1. **Login as admin** (admin@example.com / admin123)
2. **View dashboard statistics:**
   - Total users, initiatives, purchases
   - Revenue metrics
   - Recent activity

3. **Manage content:**
   - Create new initiatives
   - Upload bulk updates
   - Monitor AI jobs
   - View blockchain registry

### 7. Blockchain Integration

1. **View purchase details** with blockchain info:
   - Token ID
   - Transaction hash
   - Verification status

2. **Check smart contract** (if deployed):
   - View on block explorer
   - Verify token metadata
   - Check ownership

## Sample Data

The seed script creates:

- **3 Initiatives:**
  - Amazon Reforestation Project
  - Clean Water for Africa
  - Global Solar Initiative

- **5 Products:**
  - Tree Planting Initiative ($25)
  - Clean Water Initiative ($50)
  - Solar Energy Project ($100)
  - Education Support ($30)
  - Ocean Cleanup ($40)

- **2 Sample Users:**
  - john@example.com (password: password123)
  - jane@example.com (password: password123)

- **Admin User:**
  - admin@example.com (password: admin123)

## API Testing

### Using GraphQL Playground

1. **Visit** http://localhost:4000/graphql
2. **Try these queries:**

```graphql
# Get all initiatives
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
      tags
    }
  }
}

# Get user purchases
query GetPurchases {
  userPurchases {
    id
    product {
      title
      sku
    }
    initiative {
      title
    }
    blockchainTokenId
    txHash
    status
  }
}
```

### Using REST API

```bash
# Get initiatives
curl http://localhost:4000/api/initiatives

# Search initiatives
curl "http://localhost:4000/api/initiatives/search?q=water"

# Get user profile (requires auth)
curl -H "Authorization: Bearer <token>" http://localhost:4000/api/users/profile
```

## Mobile Testing

1. **Open browser dev tools**
2. **Toggle device toolbar**
3. **Test responsive design**
4. **Check touch interactions**

## Performance Testing

1. **Load test with multiple users**
2. **Test real-time updates under load**
3. **Monitor database performance**
4. **Check AI processing times**

## Troubleshooting

### Common Issues

1. **Database connection errors:**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env

2. **Blockchain errors:**
   - Check PRIVATE_KEY is set
   - Verify network connectivity
   - Check gas limits

3. **AI service errors:**
   - Check OPENAI_API_KEY
   - Monitor rate limits
   - Check service status

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Check service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Next Steps

After the demo:

1. **Customize the platform** for your use case
2. **Add more e-commerce integrations**
3. **Implement additional AI features**
4. **Scale to production**
5. **Deploy to your preferred platform**

## Support

For issues or questions:

1. **Check the logs** for error messages
2. **Review the documentation** in `/docs`
3. **Test individual components** in isolation
4. **Verify environment configuration**
