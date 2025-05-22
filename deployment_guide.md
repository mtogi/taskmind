# TaskMind Deployment Guide 🚀

This guide provides comprehensive instructions for deploying TaskMind to production environments. The application uses a modern deployment strategy with separate hosting for frontend and backend services.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
- [Backend Deployment (Railway)](#backend-deployment-railway)
- [Domain Configuration](#domain-configuration)
- [SSL/TLS Setup](#ssltls-setup)
- [Monitoring & Logging](#monitoring--logging)
- [Backup Strategy](#backup-strategy)
- [Troubleshooting](#troubleshooting)

## 🏗️ Architecture Overview

TaskMind uses a distributed deployment architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Railway       │    │   MongoDB       │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   Atlas         │
│   React App     │    │   Express API   │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                       │
        ▼                        ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   Load Balancer │    │   Backup        │
│   Static Assets │    │   Auto Scaling  │    │   Automated     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Production URLs
- **Frontend**: `https://taskmind-app.vercel.app`
- **Backend API**: `https://taskmind-api.railway.app`
- **Database**: MongoDB Atlas (managed)

## ✅ Prerequisites

### Required Accounts
- [GitHub](https://github.com) - Source code repository
- [Vercel](https://vercel.com) - Frontend hosting
- [Railway](https://railway.app) - Backend hosting
- [MongoDB Atlas](https://cloud.mongodb.com) - Database hosting
- [OpenAI](https://platform.openai.com) - AI API access

### Required Tools
- Node.js 18+ and npm
- Git version control
- Command line access
- Code editor (VS Code recommended)

### Environment Requirements
- **Node.js**: 18.x or higher
- **npm**: 8.x or higher
- **Memory**: Minimum 512MB for backend
- **Storage**: 1GB for application files

## 🔐 Environment Configuration

### Production Environment Variables

Create the following environment configurations:

#### Backend Environment (.env.production)
```env
# Server Configuration
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmind_prod

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_min_32_characters
JWT_EXPIRE=24h

# OpenAI Integration
OPENAI_API_KEY=sk-your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# Frontend URL
CLIENT_URL=https://taskmind-app.vercel.app

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=900000

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

#### Frontend Environment (.env.production)
```env
# API Configuration
REACT_APP_API_URL=https://taskmind-api.railway.app/api
REACT_APP_API_TIMEOUT=10000

# Application
REACT_APP_APP_NAME=TaskMind
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production

# Analytics (Optional)
REACT_APP_GOOGLE_ANALYTICS=GA-XXXXX-X
REACT_APP_SENTRY_DSN=https://xxx@sentry.io/xxx

# Features
REACT_APP_ENABLE_AI_FEATURES=true
REACT_APP_ENABLE_OFFLINE_MODE=false
```

## 🗄️ Database Setup

### MongoDB Atlas Configuration

1. **Create MongoDB Atlas Account**
   ```bash
   # Visit https://cloud.mongodb.com
   # Sign up with email or Google account
   ```

2. **Create New Cluster**
   - Choose cloud provider (AWS recommended)
   - Select region (closest to your users)
   - Choose cluster tier (M0 for free tier, M10+ for production)
   - Name your cluster: `taskmind-production`

3. **Configure Database Access**
   ```bash
   # Create database user
   # Username: taskmind_user
   # Password: Generate secure password
   # Roles: Read and write to any database
   ```

4. **Network Access Setup**
   ```bash
   # Add IP addresses
   # For Railway: Add 0.0.0.0/0 (allow from anywhere)
   # For development: Add your current IP
   ```

5. **Get Connection String**
   ```bash
   # Format: mongodb+srv://username:password@cluster.mongodb.net/database_name
   # Replace username, password, and database_name
   ```

### Database Initialization

Run the following commands to set up your production database:

```bash
# Connect to your production database
cd server
npm run db:setup:production

# Create indexes for performance
npm run db:index:production

# Seed with initial data (optional)
npm run db:seed:production
```

### Database Schema Migration

```bash
# Run migrations for production
npm run migrate:production

# Verify migration success
npm run migrate:status
```

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Deployment

1. **Build Optimization**
   ```bash
   cd client
   
   # Install dependencies
   npm install
   
   # Run production build
   npm run build
   
   # Test production build locally
   npm run serve
   ```

2. **Environment Variables Setup**
   ```bash
   # Create .env.production file
   # Add all REACT_APP_ variables
   ```

### Step 2: Deploy to Vercel

1. **Connect GitHub Repository**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Import your TaskMind repository
   - Select the `client` folder as root directory

2. **Configure Build Settings**
   ```bash
   # Build Command
   npm run build
   
   # Output Directory  
   build
   
   # Install Command
   npm install
   
   # Development Command
   npm start
   ```

3. **Set Environment Variables**
   ```bash
   # In Vercel dashboard > Settings > Environment Variables
   REACT_APP_API_URL=https://taskmind-api.railway.app/api
   REACT_APP_APP_NAME=TaskMind
   REACT_APP_VERSION=1.0.0
   REACT_APP_ENVIRONMENT=production
   ```

4. **Domain Configuration**
   ```bash
   # Custom domain (optional)
   # Add your domain: taskmind.yourdomain.com
   # Configure DNS settings as provided by Vercel
   ```

### Step 3: Verify Deployment

```bash
# Check deployment status
curl -I https://taskmind-app.vercel.app

# Test API connectivity
curl https://taskmind-app.vercel.app/api/health
```

## 🚄 Backend Deployment (Railway)

### Step 1: Prepare Backend for Deployment

1. **Production Configuration**
   ```bash
   cd server
   
   # Install production dependencies
   npm install --production
   
   # Run security audit
   npm audit fix
   
   # Test production build
   NODE_ENV=production npm start
   ```

2. **Create Railway Configuration**
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm start",
       "healthcheckPath": "/api/health"
     }
   }
   ```

### Step 2: Deploy to Railway

1. **Connect GitHub Repository**
   - Visit [railway.app](https://railway.app)
   - Sign in with GitHub
   - Create new project from GitHub repo
   - Select the `server` folder

2. **Configure Environment Variables**
   ```bash
   # In Railway dashboard > Variables
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_key
   CLIENT_URL=https://taskmind-app.vercel.app
   ```

3. **Configure Build Settings**
   ```bash
   # Build Command
   npm install
   
   # Start Command
   npm start
   
   # Health Check
   /api/health
   ```

4. **Custom Domain Setup**
   ```bash
   # Add custom domain: api.taskmind.yourdomain.com
   # Configure DNS CNAME record
   ```

### Step 3: Verify Backend Deployment

```bash
# Test API health
curl https://taskmind-api.railway.app/api/health

# Test authentication endpoint
curl -X POST https://taskmind-api.railway.app/api/auth/test

# Monitor logs
railway logs
```

## 🌍 Domain Configuration

### Custom Domain Setup

1. **Purchase Domain** (optional)
   - Register domain with provider (Namecheap, GoDaddy, etc.)
   - Choose domain: `taskmind.com` or similar

2. **DNS Configuration**
   ```bash
   # Frontend (Vercel)
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   # Backend (Railway)
   Type: CNAME  
   Name: api
   Value: your-app.railway.app
   
   # Root domain
   Type: A
   Name: @
   Value: 76.76.19.61 (Vercel IP)
   ```

3. **SSL Certificate Setup**
   - Vercel: Automatic SSL via Let's Encrypt
   - Railway: Automatic SSL via Let's Encrypt
   - Custom domains: Configure in platform settings

## 🔒 SSL/TLS Setup

### Automatic SSL (Recommended)

Both Vercel and Railway provide automatic SSL certificates:

```bash
# Vercel
- Automatic SSL for all domains
- Let's Encrypt certificates
- Auto-renewal

# Railway  
- Automatic SSL for Railway domains
- Custom domain SSL support
- HTTPS redirect enabled
```

### Custom SSL Configuration

For enterprise or specific SSL requirements:

```bash
# Upload custom certificates in platform dashboards
# Configure SSL settings
# Test SSL configuration: https://www.ssllabs.com/ssltest/
```

## 📊 Monitoring & Logging

### Application Monitoring

1. **Health Checks**
   ```javascript
   // Backend health endpoint
   app.get('/api/health', (req, res) => {
     res.json({
       status: 'healthy',
       timestamp: new Date().toISOString(),
       uptime: process.uptime(),
       version: process.env.APP_VERSION
     });
   });
   ```

2. **Error Tracking** (Optional)
   ```bash
   # Sentry integration
   npm install @sentry/node @sentry/react
   
   # Configure error tracking
   # Add Sentry DSN to environment variables
   ```

3. **Performance Monitoring**
   ```bash
   # Monitor key metrics
   - API response times
   - Database query performance  
   - Frontend bundle size
   - User engagement metrics
   ```

### Logging Setup

```javascript
// Production logging configuration
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
```

## 💾 Backup Strategy

### Database Backup

1. **Automated Backups**
   ```bash
   # MongoDB Atlas automatic backups
   # Continuous backups with point-in-time recovery
   # Backup frequency: Every 6 hours
   # Retention: 7 days (free tier), up to 5 years (paid)
   ```

2. **Manual Backup**
   ```bash
   # Export database
   mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/taskmind_prod"
   
   # Create backup archive
   tar -czf taskmind_backup_$(date +%Y%m%d).tar.gz dump/
   ```

### Code Backup

```bash
# Git repository serves as primary backup
# Ensure all code is committed and pushed
git add .
git commit -m "Production deployment ready"
git push origin main

# Tag releases
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0
```

### Environment Configuration Backup

```bash
# Store environment variables securely
# Use password manager or encrypted storage
# Document all environment variables
# Keep backup of SSL certificates
```

## 🔧 Troubleshooting

### Common Deployment Issues

#### Frontend Issues

1. **Build Failures**
   ```bash
   # Check Node.js version
   node --version  # Should be 18+
   
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   
   # Check for TypeScript errors
   npm run type-check
   ```

2. **API Connection Issues**
   ```bash
   # Verify environment variables
   echo $REACT_APP_API_URL
   
   # Test API endpoint
   curl https://taskmind-api.railway.app/api/health
   
   # Check CORS configuration
   # Ensure backend allows frontend domain
   ```

#### Backend Issues

1. **Database Connection Failures**
   ```bash
   # Test MongoDB connection
   mongosh "mongodb+srv://user:pass@cluster.mongodb.net/taskmind_prod"
   
   # Check connection string format
   # Verify username/password
   # Check IP whitelist settings
   ```

2. **Environment Variable Issues**
   ```bash
   # List all environment variables
   printenv | grep -E "(NODE_ENV|MONGODB_URI|JWT_SECRET)"
   
   # Test JWT secret
   # Ensure minimum 32 characters
   # Check for special characters that need escaping
   ```

3. **Memory/Performance Issues**
   ```bash
   # Monitor memory usage
   free -h
   
   # Check application logs
   railway logs --tail
   
   # Monitor API response times
   curl -w "@curl-format.txt" -s -o /dev/null https://api.taskmind.com/health
   ```

### Debug Commands

```bash
# Frontend debugging
npm run build -- --verbose
npm run analyze  # Bundle size analysis

# Backend debugging  
NODE_ENV=production DEBUG=* npm start
npm run test:production

# Database debugging
npm run db:check:production
npm run db:stats:production
```

### Performance Optimization

1. **Frontend Optimization**
   ```bash
   # Enable gzip compression
   # Optimize images and assets
   # Implement code splitting
   # Use React.memo for expensive components
   ```

2. **Backend Optimization**
   ```bash
   # Enable compression middleware
   # Implement caching strategy
   # Optimize database queries
   # Add database indexes
   ```

3. **Database Optimization**
   ```bash
   # Create compound indexes
   db.tasks.createIndex({ userId: 1, status: 1, dueDate: 1 })
   
   # Monitor slow queries
   db.setProfilingLevel(1, { slowms: 100 })
   ```

## 📈 Scaling Strategy

### Horizontal Scaling

```bash
# Frontend scaling (Vercel)
- Automatic CDN distribution
- Edge caching
- Serverless functions

# Backend scaling (Railway)  
- Auto-scaling based on traffic
- Load balancing
- Multiple regions
```

### Database Scaling

```bash
# MongoDB Atlas scaling
- Cluster tier upgrades
- Read replicas
- Sharding for large datasets
```

## 🚨 Rollback Procedures

### Frontend Rollback

```bash
# Vercel rollback
1. Go to Vercel dashboard
2. Select previous deployment
3. Click "Promote to Production"

# Manual rollback
git checkout previous_stable_tag
git push origin main --force
```

### Backend Rollback

```bash
# Railway rollback  
1. Go to Railway dashboard
2. Select previous deployment
3. Click "Redeploy"

# Database rollback (if needed)
# Use MongoDB Atlas point-in-time recovery
```

---

## 📞 Support

For deployment support:
- **GitHub Issues**: Technical deployment problems
- **Platform Support**: Vercel/Railway specific issues
- **Email**: mtoygarby@gmail.com for urgent deployment issues

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] SSL certificates ready
- [ ] Monitoring tools configured

### Deployment
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway
- [ ] Database connected and accessible
- [ ] DNS configuration complete
- [ ] SSL/HTTPS working

### Post-Deployment
- [ ] Health checks passing
- [ ] All features functional
- [ ] Performance monitoring active
- [ ] Backup strategy implemented
- [ ] Documentation updated

---

*Last updated: May 23, 2025*  
*Deployment version: 1.0.0*