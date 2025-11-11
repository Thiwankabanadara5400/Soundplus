# Backend Dockerfile for SoundPlus++
FROM node:18

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies (production + dev dependencies for nodemon)
RUN npm ci --only=production && npm install

# Copy application files
COPY . .

# Create uploads directory with proper permissions
RUN mkdir -p uploads && chmod 755 uploads

# Expose port
EXPOSE 5000

# Health check - simplified and more reliable
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["node", "index.js"]
