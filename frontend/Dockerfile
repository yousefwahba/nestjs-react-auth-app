# Frontend Dockerfile - Simple version without nginx
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - using 'serve' for static files
FROM node:20-alpine AS production

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S frontend -u 1001

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Change ownership to non-root user
RUN chown -R frontend:nodejs /app

USER frontend

# Expose port 3000 (serve default)
EXPOSE 3000

# Start serve (SPA mode with -s flag for client-side routing)
CMD ["serve", "-s", "dist", "-l", "3000"]
