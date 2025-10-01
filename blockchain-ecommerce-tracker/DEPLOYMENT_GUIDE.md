# SETI.Impact MAP - Deployment Guide

This guide will help you deploy SETI.Impact MAP to GitHub and Vercel with Stripe payment processing.

## 🚀 Quick Start

### 1. GitHub Repository Setup

1. **Create a new repository on GitHub:**
   - Repository name: `seti-impact-map`
   - Description: `SETI.Impact MAP - Blockchain E-commerce Initiative Tracker`
   - Make it public or private as needed

2. **Push your code to GitHub:**
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: SETI.Impact MAP platform"

# Add remote origin (replace with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/seti-impact-map.git

# Push to GitHub
git push -u origin main
```

### 2. Vercel Deployment

#### Frontend Deployment

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your `seti-impact-map` repository

2. **Configure Frontend:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

3. **Environment Variables:**
   Add these in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
   NEXT_PUBLIC_WS_URL=wss://your-backend-url.vercel.app
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
   NEXTAUTH_URL=https://your-frontend-url.vercel.app
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

#### Backend Deployment

1. **Deploy Backend to Vercel:**
   - Create another Vercel project
   - **Root Directory:** `backend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

2. **Backend Environment Variables:**
   ```
   DATABASE_URL=your_postgresql_url
   REDIS_URL=your_redis_url
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=sk_live_your_stripe_secret
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   OPENAI_API_KEY=your_openai_key
   SENDGRID_API_KEY=your_sendgrid_key
   CHAIN_PROVIDER_URL=your_blockchain_rpc_url
   PRIVATE_KEY=your_wallet_private_key
   ```

### 3. Database Setup

#### Option A: Vercel Postgres (Recommended)

1. **Add Vercel Postgres:**
   - In your Vercel dashboard
   - Go to Storage tab
   - Add Postgres database
   - Copy the connection string

2. **Run Migrations:**
```bash
# Set DATABASE_URL in your environment
export DATABASE_URL="your_vercel_postgres_url"

# Run migrations
cd backend
npm run migrate

# Seed database
npm run seed
```

#### Option B: External Database

- **Supabase:** Free PostgreSQL hosting
- **Railway:** Easy database deployment
- **AWS RDS:** Production-ready option

### 4. Redis Setup

#### Option A: Upstash Redis (Recommended)

1. **Create Upstash account**
2. **Create Redis database**
3. **Copy connection string**
4. **Add to Vercel environment variables**

#### Option B: Other Providers

- **Redis Cloud:** Managed Redis
- **AWS ElastiCache:** Production option

### 5. Stripe Configuration

1. **Create Stripe Account:**
   - Go to [stripe.com](https://stripe.com)
   - Create account and get API keys

2. **Configure Webhooks:**
   - Go to Stripe Dashboard > Webhooks
   - Add endpoint: `https://your-backend-url.vercel.app/api/payments/webhook`
   - Select events:
     - `payment_intent.succeeded`
     - `checkout.session.completed`
     - `payment_intent.payment_failed`

3. **Environment Variables:**
   ```
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### 6. Blockchain Setup

1. **Deploy Smart Contract:**
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network polygon
```

2. **Update Environment Variables:**
   ```
   CONTRACT_ADDRESS=0x_your_deployed_contract
   CHAIN_PROVIDER_URL=your_alchemy_or_infura_url
   PRIVATE_KEY=your_wallet_private_key
   ```

### 7. Additional Services

#### Mapbox Setup
1. **Create Mapbox account**
2. **Get access token**
3. **Add to environment variables**

#### SendGrid Setup
1. **Create SendGrid account**
2. **Get API key**
3. **Add to environment variables**

#### OpenAI Setup
1. **Create OpenAI account**
2. **Get API key**
3. **Add to environment variables**

## 🔧 Development Workflow

### Local Development

1. **Clone repository:**
```bash
git clone https://github.com/YOUR_USERNAME/seti-impact-map.git
cd seti-impact-map
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment:**
```bash
cp env.example .env
# Edit .env with your local configuration
```

4. **Start development:**
```bash
# Start all services
docker-compose up -d

# Run migrations
npm run migrate

# Seed database
npm run seed

# Start development servers
npm run dev
```

### Making Changes

1. **Create feature branch:**
```bash
git checkout -b feature/your-feature-name
```

2. **Make changes and test locally**

3. **Commit and push:**
```bash
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

4. **Create Pull Request on GitHub**

5. **Merge to main triggers automatic deployment**

## 📊 Monitoring & Analytics

### Vercel Analytics
- Built-in performance monitoring
- Real-time analytics
- Error tracking

### Custom Monitoring
- Health check endpoints
- Database monitoring
- Blockchain transaction tracking

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use Vercel environment variables
- Rotate keys regularly

### API Security
- Rate limiting enabled
- CORS configured
- Input validation
- SQL injection protection

### Blockchain Security
- Private key management
- Smart contract auditing
- Gas optimization

## 🚀 Production Checklist

### Before Going Live

- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] Smart contracts deployed
- [ ] Stripe webhooks configured
- [ ] Domain configured (optional)
- [ ] SSL certificates active
- [ ] Monitoring set up
- [ ] Backup strategy in place

### Post-Deployment

- [ ] Test all payment flows
- [ ] Verify blockchain integration
- [ ] Check real-time features
- [ ] Test mobile responsiveness
- [ ] Monitor performance
- [ ] Set up alerts

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check Node.js version
   - Verify all dependencies
   - Check environment variables

2. **Database Connection:**
   - Verify DATABASE_URL
   - Check network connectivity
   - Ensure database is running

3. **Payment Issues:**
   - Verify Stripe keys
   - Check webhook configuration
   - Test with Stripe test mode

4. **Blockchain Issues:**
   - Check RPC URL
   - Verify private key
   - Check gas limits

### Getting Help

1. **Check logs in Vercel dashboard**
2. **Review GitHub Actions logs**
3. **Test locally first**
4. **Check service status pages**

## 📈 Scaling Considerations

### Performance
- Use CDN for static assets
- Implement caching strategies
- Optimize database queries
- Use connection pooling

### Cost Optimization
- Monitor usage patterns
- Use appropriate instance sizes
- Implement caching
- Optimize API calls

## 🔄 Updates & Maintenance

### Regular Tasks
- Update dependencies
- Monitor security advisories
- Backup database
- Review logs

### Version Updates
- Test in staging first
- Use feature flags
- Gradual rollout
- Monitor metrics

## 📞 Support

For deployment issues:
1. Check this guide first
2. Review Vercel documentation
3. Check GitHub Actions logs
4. Test locally to isolate issues

Your SETI.Impact MAP platform is now ready for production deployment! 🚀
