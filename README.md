# AgriPulse - Agricultural Data Marketplace

A comprehensive agricultural intelligence platform that connects farmer cooperatives with data buyers, providing anonymized, aggregated insights for better decision-making in Nigerian agriculture.

## Features Implemented

### 🔐 Backend API Integration
- **Express.js REST API** with comprehensive endpoints
- **MongoDB** database with advanced schemas
- **JWT Authentication** with secure user management
- **Data Processing Pipeline** with anonymization
- **Real-time API Rate Limiting** and security

### 💳 Payment & Subscription System
- **Stripe Integration** for secure payments
- **Tiered Subscription Plans** (Basic, Premium, Enterprise)
- **Subscription Management** with webhooks
- **Usage Tracking** and limit enforcement
- **Automatic Billing** and renewal handling

### 📊 Interactive Data Visualization
- **Dynamic Dashboard** with real-time data
- **Market Intelligence** with price trends and volatility
- **Risk Monitoring** with hotspot analysis
- **Crop Analytics** with seasonal patterns
- **Interactive Charts** using Chart.js

### 🔍 Data Quality & Validation
- **Automated Data Validation** with quality scoring
- **Completeness Metrics** tracking
- **Accuracy Assessment** algorithms
- **Data Freshness** indicators
- **Quality Alerts** for low-quality data

## Project Structure

```
farmer-data-marketplace/
├── backend/                    # Node.js API server
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API endpoints
│   ├── server.js              # Main server file
│   └── package.json
├── src/
│   ├── components/           # React components
│   │   ├── Dashboard.tsx     # Main dashboard
│   │   ├── DashboardOverview.tsx
│   │   ├── MarketIntelligence.tsx
│   │   ├── RiskMonitoring.tsx
│   │   └── ...
│   ├── pages/                # Page components
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Payment.tsx
│   │   └── ...
│   ├── services/             # API services
│   │   ├── api.ts
│   │   └── sampleData.ts
│   └── App.tsx
└── package.json
```

## Quick Setup

### Prerequisites
- Node.js 16+
- MongoDB 4.4+
- Git

### 1. Clone and Install Dependencies

```bash
# Backend setup
cd backend
npm install
cp .env.example .env

# Frontend setup
cd ..
npm install
```

### 2. Configure Environment Variables

Edit `backend/.env`:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/agripulse

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Stripe (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email (optional, for contact forms)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Start MongoDB

```bash
# Start MongoDB service
sudo systemctl start mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 4. Start the Applications

```bash
# Start backend server (Terminal 1)
cd backend
npm run dev

# Start frontend (Terminal 2)
cd ..
npm start
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:5000/api/health

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Data Access
- `GET /api/data/crops/regions` - Regional crop data
- `GET /api/data/market/prices` - Market price trends
- `GET /api/data/risk/analysis` - Risk analysis data
- `GET /api/data/quality/metrics` - Data quality metrics

### Dashboard
- `GET /api/dashboard/overview` - Dashboard overview
- `GET /api/dashboard/market/intelligence` - Market intelligence
- `GET /api/dashboard/risk/monitoring` - Risk monitoring

### Payment
- `GET /api/payment/plans` - Available plans
- `POST /api/payment/create-checkout-session` - Create payment
- `GET /api/payment/status` - Subscription status
- `POST /api/payment/cancel` - Cancel subscription

## Database Schemas

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  organization: String,
  role: String,
  useCase: String,
  subscription: Object,
  apiUsage: Object,
  isVerified: Boolean
}
```

### Agricultural Data Model
```javascript
{
  sourceId: String,
  region: String,
  state: String,
  lga: String,
  cropType: String,
  plantingDate: Date,
  expectedHarvestDate: Date,
  yieldRange: Object,
  inputs: Object,
  riskFactors: Array,
  marketPrice: Object,
  quality: Object,
  isAnonymized: Boolean
}
```

## Subscription Plans

### Basic (Free)
- 1,000 API requests/month
- 10 data exports/month
- Basic dashboard access
- Email support

### Premium ($99/month)
- 10,000 API requests/month
- 100 data exports/month
- Advanced dashboard access
- Custom reports
- Priority support

### Enterprise ($499/month)
- Unlimited API requests
- Unlimited data exports
- Full dashboard access
- Custom analytics
- Dedicated support

## Data Features

### Crop Analytics
- **Regional Distribution**: Farms and yields by region
- **Planting Trends**: Seasonal patterns over time
- **Yield Analysis**: Anonymized yield ranges
- **Harvest Predictions**: Expected harvest timelines

### Market Intelligence
- **Price Trends**: Historical price movements
- **Volatility Analysis**: Market risk assessment
- **Supply/Demand**: Market balance indicators
- **Regional Comparison**: Cross-regional analysis

### Risk Monitoring
- **Risk Hotspots**: Geographic risk mapping
- **Risk Types**: Drought, flood, pests, disease
- **Severity Levels**: Risk severity classification
- **Trend Analysis**: Risk evolution over time

## Security Features

### Data Privacy
- **Anonymization**: All farmer data is anonymized
- **Aggregation**: Only aggregated data is shared
- **No PII**: No personal identifiable information
- **Location Blur**: Exact locations are generalized

### API Security
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevent API abuse
- **CORS Protection**: Cross-origin security
- **Input Validation**: Comprehensive validation

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd ..
npm test
```

### Building for Production
```bash
# Build frontend
npm run build

# Start production server
cd backend
npm start
```

## Deployment

### Backend Deployment
```bash
# Build and deploy to your server
cd backend
npm install --production
npm start
```

### Frontend Deployment
```bash
# Build and deploy static files
npm run build
# Deploy build/ folder to your web server
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, contact:
- Email: agripulse720@gmail.com
- Phone: +234 9115434458
- Office: Abuja, Nigeria

---

**Note**: This is a pilot implementation for demonstration purposes. Production deployment requires additional security hardening, monitoring, and scalability considerations.