# Build stage
FROM node:25-alpine3.22 AS builder

# Install pnpm
RUN npm install -g pnpm@10.27.0

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Generate Prisma Client
RUN pnpm exec prisma generate

# Build the application
RUN pnpm run build

# Production stage
FROM node:25-alpine3.22 AS runner

# Install pnpm
RUN npm install -g pnpm@10.27.0

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Set environment to production
ENV NODE_ENV=production

# Expose SMTP port
EXPOSE 2525

# Run the application
CMD ["node", "dist/index.js"]
