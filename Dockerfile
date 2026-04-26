# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install ALL dependencies (including dev)
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build frontend (Vite) and server (tsc)
RUN npm run build:all

# Stage 2: Production image
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files and install PRODUCTION dependencies only
COPY package*.json ./
RUN npm install --omit=dev

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server ./dist-server
COPY --from=builder /app/src/data ./src/data

# Expose the port Express listens on
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Start the compiled server
CMD ["node", "dist-server/server.js"]