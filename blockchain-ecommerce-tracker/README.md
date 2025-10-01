# SETI.Impact MAP

A production-ready full-stack platform that integrates with e-commerce systems to generate unique blockchain-linked codes for purchased products, connects them to specific initiative projects, and presents a real-time, interactive user experience via a geographic map interface with AI integration.

## 🏗️ Architecture

- **Frontend**: Next.js + TypeScript + TailwindCSS + Mapbox GL
- **Backend**: Node.js + TypeScript + NestJS + GraphQL + REST
- **Blockchain**: Solidity smart contracts + Hardhat
- **Database**: PostgreSQL + Prisma ORM
- **AI Integration**: Modular AI service with OpenAI/Anthropic support
- **Real-time**: Socket.IO + GraphQL subscriptions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git
- Stripe account (for payments)
- Mapbox account (for maps)

### Development Setup

1. **Clone and install dependencies**:
```bash
git clone https://github.com/YOUR_USERNAME/seti-impact-map.git
cd seti-impact-map
npm install
```

2. **Environment setup**:
```bash
cp env.example .env
# Edit .env with your API keys and configuration
```

3. **Start development environment**:
```bash
docker-compose up -d
npm run migrate
npm run seed
npm run dev
```

4. **Access the application**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- GraphQL Playground: http://localhost:4000/graphql
- Admin Dashboard: http://localhost:3000/admin

### 🚀 One-Click Setup (Windows)
```bash
setup-github.bat
```

### 🚀 One-Click Setup (Mac/Linux)
```bash
chmod +x setup-github.sh
./setup-github.sh
```

### Database Setup

```bash
# Run migrations
npm run migrate

# Seed database
npm run seed
```

### Smart Contract Deployment

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network mumbai
```

## 📁 Project Structure

```
├── frontend/                 # Next.js frontend application
├── backend/                  # NestJS backend API
├── contracts/               # Solidity smart contracts
├── infra/                   # Docker & deployment configs
├── scripts/                 # Database seeds & utilities
├── docs/                    # Documentation
└── demo/                    # Demo scripts & examples
```

## 🔧 Available Scripts

- `npm run dev` - Start all services in development
- `npm run build` - Build all applications
- `npm run test` - Run all tests
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data
- `npm run deploy:contracts` - Deploy smart contracts
- `npm run demo` - Run demo scenarios

## 🧪 Testing

```bash
# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e

# Smart contract tests
npm run test:contracts
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to GitHub:**
   - Fork this repository
   - Go to [vercel.com](https://vercel.com)
   - Import your forked repository

2. **Configure Environment Variables:**
   - Add all required environment variables in Vercel dashboard
   - See `DEPLOYMENT_GUIDE.md` for complete list

3. **Deploy:**
   - Vercel will automatically deploy on every push to main
   - Frontend and backend will be deployed separately

### Manual Deployment

See `/docs/deployment.md` for detailed deployment instructions for various platforms (Vercel, AWS, Render).

### 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Database setup and migrations run
- [ ] Stripe webhooks configured
- [ ] Smart contracts deployed
- [ ] Domain configured (optional)
- [ ] SSL certificates active

## 📚 Documentation

- [API Documentation](/docs/api.md)
- [Smart Contract Documentation](/docs/contracts.md)
- [AI Integration Guide](/docs/ai-integration.md)
- [Deployment Guide](/docs/deployment.md)

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
