#!/bin/bash

# Frontend startup script for Storager
set -e

echo "🚀 Starting Storager Frontend..."

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    echo "❌ Error: frontend directory not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Change to frontend directory
cd frontend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found in frontend directory!"
    echo "Please make sure the frontend is properly set up."
    exit 1
fi

# Check if node_modules exists, if not run npm install
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start the development server
echo "✅ Starting frontend development server on http://localhost:5173"
echo "Press Ctrl+C to stop the server"
npm run dev