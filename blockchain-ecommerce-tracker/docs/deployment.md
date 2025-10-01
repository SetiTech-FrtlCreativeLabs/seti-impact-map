# Deployment Guide

This guide covers deploying the Blockchain E-commerce Initiative Tracker to various platforms.

## Prerequisites

- Docker and Docker Compose
- Node.js 18+
- PostgreSQL database
- Redis instance
- Blockchain network access (Polygon Mumbai for testing)

## Environment Variables

Copy `env.example` to `.env` and configure:

```bash
cp env.example .env
```

### Required Variables

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `NEXTAUTH_SECRET` - NextAuth secret
- `SHOPIFY_API_KEY` - Shopify API key
- `SHOPIFY_WEBHOOK_SECRET` - Shopify webhook secret
- `CHAIN_PROVIDER_URL` - Blockchain RPC URL
- `PRIVATE_KEY` - Wallet private key
- `OPENAI_API_KEY` - OpenAI API key (optional)
- `SENDGRID_API_KEY` - SendGrid API key
- `MAPBOX_ACCESS_TOKEN` - Mapbox access token

## Local Development

### Using Docker Compose

1. **Start all services:**
```bash
docker-compose up -d
```

2. **Run database migrations:**
```bash
npm run migrate
```

3. **Seed the database:**
```bash
npm run seed
```

4. **Deploy smart contracts:**
```bash
npm run deploy:contracts
```

### Manual Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Start PostgreSQL and Redis:**
```bash
# Using Docker
docker run -d --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

3. **Start backend:**
```bash
cd backend
npm install
npm run dev
```

4. **Start frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Production Deployment

### Vercel (Frontend)

1. **Connect repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main**

### Railway (Backend)

1. **Connect repository to Railway**
2. **Add PostgreSQL and Redis services**
3. **Set environment variables**
4. **Deploy automatically**

### AWS (Full Stack)

#### Using AWS ECS

1. **Build and push Docker images:**
```bash
# Build backend image
docker build -f infra/Dockerfile.backend -t initiative-tracker-backend .

# Build frontend image
docker build -f infra/Dockerfile.frontend -t initiative-tracker-frontend .

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker tag initiative-tracker-backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/initiative-tracker-backend:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/initiative-tracker-backend:latest
```

2. **Create ECS task definition**
3. **Create ECS service**
4. **Configure load balancer**

#### Using AWS App Runner

1. **Create App Runner service**
2. **Configure build and run commands**
3. **Set environment variables**
4. **Deploy**

### Kubernetes

1. **Create namespace:**
```bash
kubectl create namespace initiative-tracker
```

2. **Apply configurations:**
```bash
kubectl apply -f infra/k8s/
```

3. **Check deployment:**
```bash
kubectl get pods -n initiative-tracker
```

## Smart Contract Deployment

### Testnet (Mumbai)

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network mumbai
```

### Mainnet (Polygon)

```bash
npx hardhat run scripts/deploy.js --network polygon
```

### Verify Contract

```bash
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
```

## Database Setup

### Production Database

1. **Create PostgreSQL instance**
2. **Run migrations:**
```bash
npm run migrate:deploy
```

3. **Seed initial data:**
```bash
npm run seed
```

### Backup Strategy

```bash
# Create backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql $DATABASE_URL < backup_file.sql
```

## Monitoring

### Health Checks

- Backend: `GET /api/health`
- Frontend: `GET /api/health`

### Logging

- Structured logging with Winston
- Log aggregation with ELK stack or similar
- Error tracking with Sentry

### Metrics

- Application metrics with Prometheus
- Database metrics
- Blockchain transaction monitoring

## Security

### SSL/TLS

- Use HTTPS in production
- Configure SSL certificates
- Enable HSTS headers

### Environment Security

- Use secrets management (AWS Secrets Manager, etc.)
- Rotate API keys regularly
- Enable MFA for admin accounts

### Database Security

- Use connection pooling
- Enable SSL connections
- Regular security updates

## Scaling

### Horizontal Scaling

- Use load balancers
- Multiple backend instances
- Database read replicas

### Caching

- Redis for session storage
- CDN for static assets
- Database query caching

### Performance

- Database indexing
- API response caching
- Image optimization

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Check DATABASE_URL
   - Verify network connectivity
   - Check database permissions

2. **Blockchain transaction failures**
   - Verify PRIVATE_KEY
   - Check gas limits
   - Monitor network status

3. **AI service errors**
   - Check API key validity
   - Monitor rate limits
   - Verify service availability

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Check service status
docker-compose ps
docker-compose logs -f
```

## Maintenance

### Regular Tasks

- Database backups
- Security updates
- Performance monitoring
- Log rotation

### Updates

1. **Backup database**
2. **Deploy new version**
3. **Run migrations**
4. **Verify functionality**
5. **Update documentation**
