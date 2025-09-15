#!/bin/bash

# Backend startup script for Storager
set -e

echo "🚀 Starting Storager Backend..."

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Change to backend directory
cd backend

# Check if Gemfile exists
if [ ! -f "Gemfile" ]; then
    echo "❌ Error: Gemfile not found in backend directory!"
    echo "Please make sure the backend is properly set up."
    exit 1
fi

# Check if bundle is installed
if ! command -v bundle &> /dev/null; then
    echo "❌ Error: bundler is not installed!"
    echo "Please install bundler: gem install bundler"
    exit 1
fi

# Install gems if needed
if [ ! -f "Gemfile.lock" ] || [ "Gemfile" -nt "Gemfile.lock" ]; then
    echo "💎 Installing backend dependencies..."
    bundle install
fi

# Check if database exists and create/migrate if needed
echo "🗄️  Setting up database..."
if ! bundle exec rails db:version &> /dev/null; then
    echo "Creating and setting up database..."
    bundle exec rails db:create db:migrate
else
    # Run pending migrations
    bundle exec rails db:migrate
fi

# Start the Rails server
echo "✅ Starting backend server on http://localhost:3000"
echo "Press Ctrl+C to stop the server"
bundle exec rails server