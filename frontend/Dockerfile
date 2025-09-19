# syntax=docker/dockerfile:1

# Frontend build stage
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files for better layer caching
COPY package*.json ./

# Development stage
FROM base AS dev
RUN npm ci && npm cache clean --force
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Build stage
FROM base AS build
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]