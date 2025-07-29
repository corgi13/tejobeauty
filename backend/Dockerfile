# Multi-stage Dockerfile for NestJS backend
# Stage 1: Dependencies
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production --legacy-peer-deps
RUN npx prisma generate

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Install build dependencies
RUN npm install -g @nestjs/cli

# Copy package files and install ALL dependencies (including dev)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build
RUN npx prisma generate

# Stage 3: Development
FROM node:18-alpine AS development
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --legacy-peer-deps
RUN npx prisma generate

# Copy source code
COPY . .

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3002/api/system-health || exit 1

# Start development server with hot reload
CMD ["npm", "run", "start:dev"]

# Stage 4: Production
FROM node:18-alpine AS production
WORKDIR /app

ENV NODE_ENV production

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application and dependencies
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

USER nestjs

EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3002/api/system-health || exit 1

# Run database migrations and start the application
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]