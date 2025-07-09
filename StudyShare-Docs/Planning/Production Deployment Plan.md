# Production Deployment Plan

#project/studyshare #type/planning #priority/high

## 🎯 Overview

This document outlines the complete production deployment strategy for StudyShare, including domain setup, database migration, and infrastructure configuration.

## 🚀 Deployment Architecture

### Production Infrastructure
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Vercel)      │◄──►│   (Render)      │◄──►│   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   File Storage  │    │   Monitoring    │
│   (Cloudflare)  │    │   (AWS S3)      │    │   (Sentry)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Deployment Phases

### Phase 1: Domain & SSL Setup (Week 1)

#### Domain Registration
- [x] Register domain (e.g., studyshare.app)
- [x] Configure DNS settings
- [ ] Set up domain email (optional)
- [ ] Configure domain privacy protection

#### SSL Certificate
- [x] Obtain SSL certificate (Let's Encrypt or paid)
- [x] Configure SSL for all subdomains
- [x] Set up SSL redirects (HTTP → HTTPS)
- [x] Test SSL configuration

#### DNS Configuration
```bash
# DNS Records
A     @           → Vercel IP
CNAME www         → studyshare-pi.vercel.app
CNAME api         → studyshare-cebt.onrender.com
CNAME db          → cjgsmayxqbpnnzfrornk.supabase.co
```

### Phase 2: Database Migration (Week 1-2)

#### PostgreSQL Setup
- [x] Set up PostgreSQL database (Supabase)
- [x] Configure database connection
- [x] Set up database backups
- [x] Configure database monitoring

#### Migration Strategy
```sql
-- Migration from SQLite to PostgreSQL
-- 1. Export current data
-- 2. Transform data format
-- 3. Import to PostgreSQL (Supabase)
-- 4. Update connection strings
-- 5. Test all functionality

-- Update Prisma schema
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### Environment Variables
```bash
# Production environment variables
DATABASE_URL=your_supabase_postgres_url
NODE_ENV=production
FRONTEND_URL=https://studyshare.app
API_URL=https://studyshare-api.onrender.com
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=studyshare-files
```

### Phase 3: Backend Deployment (Week 2)

#### Render Deployment
- [x] Set up Render account and project
- [x] Configure environment variables
- [x] Deploy backend application
- [x] Set up custom domain (studyshare-cebt.onrender.com)
- [x] Configure CORS for production domain

#### Backend Configuration
```javascript
// Production configuration
const config = {
  port: process.env.PORT || 4000,
  cors: {
    origin: ['https://studyshare.app', 'https://www.studyshare.app'],
    credentials: true
  },
  database: {
    url: process.env.DATABASE_URL,
    ssl: true
  },
  fileStorage: {
    provider: 'aws-s3',
    bucket: process.env.AWS_S3_BUCKET,
    region: process.env.AWS_REGION
  }
};
```

#### API Endpoints
```bash
# Production API endpoints
https://studyshare-cebt.onrender.com/api/universities
https://studyshare-cebt.onrender.com/api/faculties
https://studyshare-cebt.onrender.com/api/subjects
https://studyshare-cebt.onrender.com/api/notes
```

### Phase 4: Frontend Deployment (Week 2)

#### Vercel Deployment
- [x] Set up Vercel account and project
- [x] Connect GitHub repository
- [x] Configure build settings
- [x] Set up custom domain (studyshare-pi.vercel.app)
- [x] Configure environment variables

#### Frontend Configuration
```javascript
// Production API configuration
const API_BASE_URL = 'https://studyshare-api.onrender.com/api';

// Environment variables
VITE_API_URL=https://studyshare-api.onrender.com
VITE_APP_NAME=StudyShare
VITE_APP_VERSION=1.0.0
```

#### Build Optimization
```bash
# Build optimization
npm run build
# - Minify JavaScript and CSS
# - Optimize images
# - Enable gzip compression
# - Set up caching headers
```

### Phase 5: File Storage & CDN (Week 2)

#### AWS S3 Setup
- [ ] Create S3 bucket for file storage
- [ ] Configure bucket permissions
- [ ] Set up CORS for web access
- [ ] Configure lifecycle policies

#### Cloudflare CDN
- [ ] Set up Cloudflare account
- [ ] Add domain to Cloudflare
- [ ] Configure CDN settings
- [ ] Set up caching rules

#### File Storage Configuration
```javascript
// S3 configuration
const s3Config = {
  bucket: 'studyshare-files',
  region: 'us-east-1',
  cors: {
    allowedOrigins: ['https://studyshare.app'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['*']
  },
  lifecycle: {
    transitionDays: 30,
    expirationDays: 365
  }
};
```

### Phase 6: Monitoring & Analytics (Week 3)

#### Application Monitoring
- [ ] Set up Sentry for error tracking
- [ ] Configure performance monitoring
- [ ] Set up uptime monitoring
- [ ] Create alerting rules

#### Analytics Setup
- [ ] Configure Google Analytics
- [ ] Set up Vercel Analytics
- [ ] Create custom event tracking
- [ ] Set up conversion tracking

#### Logging Configuration
```javascript
// Production logging
const logger = {
  level: 'info',
  format: 'json',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
};
```

## 🔐 Security Configuration

### SSL/TLS Security
- [ ] Enable HSTS headers
- [ ] Configure CSP (Content Security Policy)
- [ ] Set up secure cookies
- [ ] Enable security headers

### API Security
```javascript
// Security middleware
app.use(helmet()); // Security headers
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // Rate limiting
app.use(cors({ origin: process.env.FRONTEND_URL })); // CORS
```

### Database Security
- [ ] Enable SSL connections
- [ ] Set up connection pooling
- [ ] Configure backup encryption
- [ ] Implement access controls

## 📊 Performance Optimization

### Frontend Optimization
- [ ] Enable code splitting
- [ ] Implement lazy loading
- [ ] Optimize bundle size
- [ ] Set up service worker (PWA)

### Backend Optimization
- [ ] Enable compression
- [ ] Implement caching
- [ ] Optimize database queries
- [ ] Set up load balancing

### CDN Configuration
```javascript
// CDN caching rules
const cacheRules = {
  static: {
    maxAge: '1 year',
    headers: ['Cache-Control: public, max-age=31536000']
  },
  api: {
    maxAge: '5 minutes',
    headers: ['Cache-Control: public, max-age=300']
  },
  files: {
    maxAge: '1 month',
    headers: ['Cache-Control: public, max-age=2592000']
  }
};
```

## 🚀 Deployment Commands

### Backend Deployment
```bash
# Deploy to Render
# (Assuming you have set up your Render service and connected your repo)
git push render main
# Or use the Render dashboard to trigger a deploy

# Set environment variables in the Render dashboard
# DATABASE_URL, NODE_ENV, etc.
```

### Frontend Deployment
```bash
# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add VITE_API_URL
vercel env add VITE_APP_NAME
```

### Database Migration
```bash
# Run database migrations
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```

## 📈 Monitoring & Maintenance

### Health Checks
```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

### Backup Strategy
- [ ] Daily database backups
- [ ] Weekly full system backup
- [ ] Monthly disaster recovery test
- [ ] Automated backup verification

### Update Strategy
- [ ] Automated dependency updates
- [ ] Staged deployment process
- [ ] Rollback procedures
- [ ] Zero-downtime deployments

## 🔗 Related Documents

- [[Roadmap]] - Overall project timeline
- [[Telegram Integration Plan]] - Bot deployment
- [[API Documentation]] - Production API reference
- [[Database Schema]] - Production database structure

## 📝 Notes

- Test all configurations in staging environment first
- Document all environment variables and secrets
- Set up monitoring before going live
- Plan for scalability from the start
- Regular security audits and updates 