# Firebase MCP Server Docker Image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/

# Build the project
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S firebase-mcp -u 1001

# Set working directory
WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy configuration directory structure
RUN mkdir -p /app/config /app/logs
COPY config/README.md ./config/

# Create example configuration
RUN echo '{}' > /app/config/mcp-config.example.json

# Change ownership to app user
RUN chown -R firebase-mcp:nodejs /app

# Switch to non-root user
USER firebase-mcp

# Set environment variables
ENV NODE_ENV=production
ENV LOG_LEVEL=info
ENV MCP_SERVER_PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "process.exit(0)" || exit 1

# Expose port (optional for MCP stdio mode)
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]

# Metadata
LABEL maintainer="Firebase MCP Server"
LABEL version="1.0.0"
LABEL description="Firebase MCP Server for AI development tools"
LABEL org.opencontainers.image.source="https://github.com/hohollala/FireBase_MCP"
LABEL org.opencontainers.image.documentation="https://github.com/hohollala/FireBase_MCP/blob/main/README.md"
LABEL org.opencontainers.image.licenses="MIT"