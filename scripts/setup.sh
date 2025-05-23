#!/bin/bash

# TaskMind Setup Script
# This script sets up the development environment for TaskMind

echo "🚀 Setting up TaskMind development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Create environment files if they don't exist
echo "🔧 Setting up environment files..."

# Client .env
if [ ! -f "client/.env" ]; then
    echo "Creating client/.env..."
    cat > client/.env << EOL
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=TaskMind
EOL
    echo "✅ Created client/.env"
else
    echo "⚠️  client/.env already exists"
fi

# Server .env
if [ ! -f "server/.env" ]; then
    echo "Creating server/.env..."
    cat > server/.env << EOL
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
CLIENT_URL=http://localhost:3000
EOL
    echo "✅ Created server/.env"
    echo "⚠️  Please update server/.env with your actual MongoDB URI, JWT secret, and OpenAI API key"
else
    echo "⚠️  server/.env already exists"
fi

# Create Tailwind CSS config for client
if [ ! -f "client/tailwind.config.js" ]; then
    echo "Creating Tailwind CSS configuration..."
    cat > client/tailwind.config.js << EOL
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
EOL
    echo "✅ Created Tailwind CSS configuration"
fi

# Create PostCSS config for client
if [ ! -f "client/postcss.config.js" ]; then
    echo "Creating PostCSS configuration..."
    cat > client/postcss.config.js << EOL
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOL
    echo "✅ Created PostCSS configuration"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update server/.env with your MongoDB URI and API keys"
echo "2. Run 'npm run dev' to start both client and server"
echo "3. Visit http://localhost:3000 to see the application"
echo ""
echo "📚 Useful commands:"
echo "  npm run dev          - Start both client and server"
echo "  npm run client:dev   - Start only client"
echo "  npm run server:dev   - Start only server"
echo "  npm test             - Run tests"
echo "  npm run lint         - Check code style"
echo ""
echo "Happy coding! 🚀" 