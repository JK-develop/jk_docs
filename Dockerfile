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

# Generate Prisma client and push schema to database
RUN npx prisma generate
RUN npx prisma db push

# Build the Next.js application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]