#!/bin/bash

# Firebase MCP Server Docker Build Script
set -e

# Configuration
IMAGE_NAME="firebase-mcp-server"
VERSION="1.0.0"
REGISTRY="docker.io"
DOCKERFILE="Dockerfile"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --version|-v)
            VERSION="$2"
            shift 2
            ;;
        --registry|-r)
            REGISTRY="$2"
            shift 2
            ;;
        --dev)
            DOCKERFILE="Dockerfile.dev"
            IMAGE_NAME="${IMAGE_NAME}:dev"
            shift
            ;;
        --no-cache)
            NO_CACHE="--no-cache"
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --version, -v    Set version tag (default: 1.0.0)"
            echo "  --registry, -r   Set registry (default: docker.io)"
            echo "  --dev            Build development image"
            echo "  --no-cache       Build without cache"
            echo "  --help, -h       Show this help message"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Build configuration
if [[ "$DOCKERFILE" == "Dockerfile.dev" ]]; then
    FULL_IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}"
else
    FULL_IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}:${VERSION}"
fi

log_info "Starting Docker build process..."
log_info "Image: ${FULL_IMAGE_NAME}"
log_info "Dockerfile: ${DOCKERFILE}"

# Pre-build checks
log_info "Running pre-build checks..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    log_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if package.json exists
if [[ ! -f "package.json" ]]; then
    log_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Dockerfile exists
if [[ ! -f "$DOCKERFILE" ]]; then
    log_error "Dockerfile '$DOCKERFILE' not found."
    exit 1
fi

# Ensure dist directory exists for production builds
if [[ "$DOCKERFILE" == "Dockerfile" ]]; then
    if [[ ! -d "dist" ]]; then
        log_warning "dist directory not found. Building project first..."
        npm run build
        if [[ $? -ne 0 ]]; then
            log_error "Build failed. Cannot create Docker image."
            exit 1
        fi
    fi
fi

log_success "Pre-build checks passed"

# Build Docker image
log_info "Building Docker image..."
BUILD_START=$(date +%s)

docker build \
    -t "${FULL_IMAGE_NAME}" \
    -f "${DOCKERFILE}" \
    ${NO_CACHE} \
    --label "version=${VERSION}" \
    --label "build-date=$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
    --label "git-commit=$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')" \
    .

if [[ $? -eq 0 ]]; then
    BUILD_END=$(date +%s)
    BUILD_TIME=$((BUILD_END - BUILD_START))
    log_success "Docker image built successfully in ${BUILD_TIME} seconds"
    log_success "Image: ${FULL_IMAGE_NAME}"
else
    log_error "Docker build failed"
    exit 1
fi

# Tag additional versions for production builds
if [[ "$DOCKERFILE" == "Dockerfile" ]]; then
    log_info "Creating additional tags..."
    
    # Tag as latest
    docker tag "${FULL_IMAGE_NAME}" "${REGISTRY}/${IMAGE_NAME}:latest"
    log_success "Tagged as ${REGISTRY}/${IMAGE_NAME}:latest"
    
    # Tag with major version
    MAJOR_VERSION=$(echo $VERSION | cut -d. -f1)
    docker tag "${FULL_IMAGE_NAME}" "${REGISTRY}/${IMAGE_NAME}:v${MAJOR_VERSION}"
    log_success "Tagged as ${REGISTRY}/${IMAGE_NAME}:v${MAJOR_VERSION}"
fi

# Show image information
log_info "Image information:"
docker images "${REGISTRY}/${IMAGE_NAME}" --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"

# Security scan (if available)
if command -v docker scan &> /dev/null; then
    log_info "Running security scan..."
    docker scan "${FULL_IMAGE_NAME}" || log_warning "Security scan completed with warnings"
fi

# Test the image
log_info "Testing the built image..."
CONTAINER_ID=$(docker run -d --rm "${FULL_IMAGE_NAME}")

# Wait a moment for container to start
sleep 2

# Check if container is running
if docker ps -q --filter "id=${CONTAINER_ID}" | grep -q "${CONTAINER_ID}"; then
    log_success "Container started successfully"
    docker stop "${CONTAINER_ID}" > /dev/null
    log_success "Container test completed"
else
    log_error "Container failed to start"
    docker logs "${CONTAINER_ID}" 2>/dev/null || true
    exit 1
fi

log_success "Docker build process completed successfully!"
echo ""
echo "To run the container:"
echo "  docker run -d --name firebase-mcp-server ${FULL_IMAGE_NAME}"
echo ""
echo "To run with docker-compose:"
echo "  docker-compose up -d"