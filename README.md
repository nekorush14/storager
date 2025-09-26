# storager

A simple home storage manager app.

## Description

This app can manage your room's stuff.
Each item will be stored in virtual storage boxes.

## Tech Stack

- **Frontend**
  - React 19.1.1 with TypeScript
  - Vite for build tooling
  - Vitest for testing
  - ESLint for code quality
- **Backend**
  - Ruby on Rails 8.0.2 (API mode)
  - RSpec with FactoryBot for testing
  - RuboCop Rails Omakase for code styling
  - Brakeman for security analysis
- **Database**
  - PostgreSQL 17
- **Infrastructure**
  - Docker & Docker Compose for development
  - Kamal for deployment
  - Nginx for frontend serving

This app is designed to be deployed in a self-hosted environment.

## Development Setup

### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/nekorush14/storager.git
cd storager

# Copy environment variables
cp .env.example .env

# Start all services
docker-compose up -d

# The app will be available at:
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
```

### Manual Setup

#### Backend Setup

```bash
cd backend
bundle install
rails db:setup
rails server
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
bundle exec rspec

# Run specific test file
bundle exec rspec spec/models/stuff_spec.rb

# Run with coverage
bundle exec rspec --format documentation
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run
```

## Code Quality

### Backend

```bash
cd backend

# Run RuboCop
bundle exec rubocop

# Auto-fix issues
bundle exec rubocop -a

# Security analysis
bundle exec brakeman
```

### Frontend

```bash
cd frontend

# Run ESLint
npm run lint

# Type checking
npm run build
```

## Production Deployment

```bash
# Build and start production containers
docker-compose --profile production up -d
```

## License

This software is licensed under the MIT License - see the LICENSE file.
