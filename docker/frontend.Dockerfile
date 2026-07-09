# ============================================
# Stage 1 - Build React Application
# ============================================

FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY frontend/ .

# Build production files
RUN npm run build

# ============================================
# Stage 2 - Serve with Nginx
# ============================================

FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]