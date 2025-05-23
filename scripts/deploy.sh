#!/bin/bash

# TaskMind Deployment Script
# This script deploys the TaskMind application to production

echo "🚀 Starting TaskMind deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the root directory of the TaskMind project"
    exit 1
fi

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Git working directory is not clean. Please commit or stash your changes."
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Ensure we're on main branch for production deployment
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  You're not on the main branch. Switch to main for production deployment? (y/n)"
    read -r response
    if [ "$response" = "y" ]; then
        git checkout main
        git pull origin main
    else
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

# Run tests before deployment
echo "🧪 Running tests..."
npm test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Deployment cancelled."
    exit 1
fi

# Build client
echo "🏗️  Building client..."
cd client
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Client build failed. Deployment cancelled."
    exit 1
fi
cd ..

# Deploy client to Vercel
echo "🌐 Deploying client to Vercel..."
cd client
if command -v vercel &> /dev/null; then
    vercel --prod
    if [ $? -eq 0 ]; then
        echo "✅ Client deployed successfully to Vercel"
    else
        echo "❌ Client deployment to Vercel failed"
        exit 1
    fi
else
    echo "⚠️  Vercel CLI not found. Please install it with: npm i -g vercel"
    echo "📋 Manual deployment steps:"
    echo "1. cd client"
    echo "2. vercel --prod"
fi
cd ..

# Deploy server to Railway
echo "🚂 Deploying server to Railway..."
cd server
if command -v railway &> /dev/null; then
    railway up
    if [ $? -eq 0 ]; then
        echo "✅ Server deployed successfully to Railway"
    else
        echo "❌ Server deployment to Railway failed"
        exit 1
    fi
else
    echo "⚠️  Railway CLI not found. Please install it with: npm i -g @railway/cli"
    echo "📋 Manual deployment steps:"
    echo "1. cd server"
    echo "2. railway login"
    echo "3. railway up"
fi
cd ..

# Tag the release
echo "🏷️  Creating release tag..."
VERSION=$(node -p "require('./package.json').version")
git tag -a "v$VERSION" -m "Release version $VERSION"
git push origin "v$VERSION"

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Deployment summary:"
echo "  Version: v$VERSION"
echo "  Client: Deployed to Vercel"
echo "  Server: Deployed to Railway"
echo "  Git tag: v$VERSION created and pushed"
echo ""
echo "🔗 Next steps:"
echo "1. Verify the deployment at your production URLs"
echo "2. Run smoke tests on production"
echo "3. Update any DNS records if needed"
echo "4. Monitor logs for any issues"
echo ""
echo "Happy deploying! 🚀" 