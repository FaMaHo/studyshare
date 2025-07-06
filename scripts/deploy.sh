#!/bin/bash

# StudyShare Deployment Script
# This script helps deploy the application to various platforms

set -e

echo "🚀 Starting StudyShare deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the StudyShare root directory"
    exit 1
fi

# Build frontend
print_status "Building frontend..."
npm run build

# Build backend
print_status "Building backend..."
cd studyshare-backend
npm run build
cd ..

print_status "Build completed successfully!"

echo ""
echo "📦 Deployment Options:"
echo "1. Deploy to Vercel (Frontend)"
echo "2. Deploy to Railway (Backend)"
echo "3. Deploy to Render (Full Stack)"
echo "4. Deploy to Netlify (Frontend)"
echo "5. Manual deployment instructions"
echo ""

read -p "Choose deployment option (1-5): " choice

case $choice in
    1)
        print_status "Deploying to Vercel..."
        echo "To deploy to Vercel:"
        echo "1. Install Vercel CLI: npm i -g vercel"
        echo "2. Run: vercel"
        echo "3. Follow the prompts"
        ;;
    2)
        print_status "Deploying to Railway..."
        echo "To deploy to Railway:"
        echo "1. Install Railway CLI: npm i -g @railway/cli"
        echo "2. Run: railway login"
        echo "3. Run: railway up"
        ;;
    3)
        print_status "Deploying to Render..."
        echo "To deploy to Render:"
        echo "1. Connect your GitHub repository to Render"
        echo "2. Create a new Web Service"
        echo "3. Set build command: npm run build"
        echo "4. Set start command: npm start"
        ;;
    4)
        print_status "Deploying to Netlify..."
        echo "To deploy to Netlify:"
        echo "1. Install Netlify CLI: npm i -g netlify-cli"
        echo "2. Run: netlify deploy"
        echo "3. Follow the prompts"
        ;;
    5)
        print_status "Manual deployment instructions..."
        echo ""
        echo "📋 Manual Deployment Steps:"
        echo ""
        echo "Frontend (React App):"
        echo "1. Build: npm run build"
        echo "2. Upload dist/ folder to your hosting provider"
        echo ""
        echo "Backend (Node.js API):"
        echo "1. Build: cd studyshare-backend && npm run build"
        echo "2. Upload the entire backend folder"
        echo "3. Set environment variables:"
        echo "   - DATABASE_URL"
        echo "   - PORT"
        echo "   - NODE_ENV"
        echo ""
        echo "Database:"
        echo "1. Set up your database (PostgreSQL recommended for production)"
        echo "2. Update DATABASE_URL in environment variables"
        echo "3. Run migrations: npx prisma migrate deploy"
        echo "4. Seed database: npx prisma db seed"
        ;;
    *)
        print_error "Invalid option"
        exit 1
        ;;
esac

print_status "Deployment script completed!"
echo ""
echo "🔗 Useful Links:"
echo "- Frontend: http://localhost:5173"
echo "- Backend API: http://localhost:4000"
echo "- Database UI: http://localhost:5555"
echo ""
echo "📚 Documentation: README.md" 