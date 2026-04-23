# Use official Node.js Debian-based image for better Prisma compatibility
FROM node:22.14.0-bookworm-slim

# Set working directory
WORKDIR /app

# Install OpenSSL (required by Prisma engine)
RUN apt-get update -y && apt-get install -y openssl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the source code
COPY . .

# Generate Prisma client and create temporary schema for build-time pre-rendering
RUN npx prisma generate
RUN npx prisma db push --accept-data-loss
RUN npm run build

# Ensure start script is executable
RUN chmod +x ./start.sh

# Expose the application port
EXPOSE 3000

# Start the application via the startup script
CMD ["./start.sh"]