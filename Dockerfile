# Multi-stage build for Paintress application

# Stage 1: Build React application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for both frontend and backend
COPY paintress-web-app/package*.json ./paintress-web-app/
COPY paintress-server/pyproject.toml ./paintress-server/

# Install Node.js dependencies
WORKDIR /app/paintress-web-app
RUN npm ci --only=production

# Copy frontend source code
COPY paintress-web-app/ .

# Build the React application
RUN npm run build

# Stage 2: Python backend with built frontend
FROM python:3.13-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies
COPY paintress-server/pyproject.toml .

# Install Python dependencies
RUN pip install --no-cache-dir uv && \
    uv pip install --system .

# Copy backend source code
COPY paintress-server/ .

# Copy built frontend from builder stage
COPY --from=builder /app/paintress-web-app/dist ./static

# Create upload directory
RUN mkdir -p uploads

# Expose port
EXPOSE 8000

# Start the application
CMD ["python", "main.py"] 