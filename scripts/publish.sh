#!/bin/bash

# Firebase MCP Server NPM Publish Script
set -e

# Configuration
PACKAGE_NAME="firebase-mcp-server"
CURRENT_DIR=$(pwd)
PACKAGE_JSON="package.json"

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
DRY_RUN=false
FORCE=false
TAG="latest"

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        --tag)
            TAG="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --dry-run        Run without actually publishing"
            echo "  --force          Skip confirmation prompts"
            echo "  --tag TAG        Publish with specific tag (default: latest)"
            echo "  --help, -h       Show this help message"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

log_info "Starting NPM publish process for ${PACKAGE_NAME}..."

# Pre-publish checks
log_info "Running pre-publish checks..."

# Check if we're in the right directory
if [[ ! -f "$PACKAGE_JSON" ]]; then
    log_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if user is logged in to npm
if ! npm whoami > /dev/null 2>&1; then
    log_error "You are not logged in to npm. Run 'npm login' first."
    exit 1
fi

# Get current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")
log_info "Current version: ${CURRENT_VERSION}"

# Check if version already exists on npm
if npm view "${PACKAGE_NAME}@${CURRENT_VERSION}" version > /dev/null 2>&1; then
    if [[ "$FORCE" != true ]]; then
        log_error "Version ${CURRENT_VERSION} already exists on npm."
        log_info "Consider running 'npm version patch|minor|major' to bump the version."
        exit 1
    else
        log_warning "Version ${CURRENT_VERSION} already exists, but --force flag is set."
    fi
fi

# Check working directory is clean (if it's a git repo)
if [[ -d .git ]]; then
    if [[ -n $(git status --porcelain) ]]; then
        log_warning "Working directory is not clean. Consider committing changes first."
        if [[ "$FORCE" != true ]]; then
            read -p "Continue anyway? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                log_info "Publish cancelled."
                exit 0
            fi
        fi
    fi
fi

# Run tests
log_info "Running tests..."
if ! npm test; then
    log_error "Tests failed. Cannot publish."
    exit 1
fi
log_success "All tests passed"

# Build the project
log_info "Building project..."
if ! npm run build; then
    log_error "Build failed. Cannot publish."
    exit 1
fi
log_success "Build completed successfully"

# Check if dist directory exists and has content
if [[ ! -d "dist" ]] || [[ -z "$(ls -A dist)" ]]; then
    log_error "dist directory is missing or empty. Build may have failed."
    exit 1
fi

# Lint the code
log_info "Running linter..."
if ! npm run lint; then
    log_warning "Linter found issues. Consider fixing them before publishing."
    if [[ "$FORCE" != true ]]; then
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Publish cancelled."
            exit 0
        fi
    fi
fi

# Check package.json for required fields
log_info "Validating package.json..."
REQUIRED_FIELDS=("name" "version" "description" "main" "author" "license")
for field in "${REQUIRED_FIELDS[@]}"; do
    if ! node -p "require('./package.json').$field" > /dev/null 2>&1; then
        log_error "Required field '$field' is missing from package.json"
        exit 1
    fi
done
log_success "package.json validation passed"

# Show package info
log_info "Package information:"
echo "  Name: $(node -p "require('./package.json').name")"
echo "  Version: $(node -p "require('./package.json').version")"
echo "  Description: $(node -p "require('./package.json').description")"
echo "  Author: $(node -p "require('./package.json').author")"
echo "  License: $(node -p "require('./package.json').license")"

# Show what will be published
log_info "Files that will be published:"
npm pack --dry-run 2>/dev/null | grep -E '^\s+[0-9]+\s+\w+' || echo "  (Unable to show file list)"

# Final confirmation
if [[ "$FORCE" != true ]] && [[ "$DRY_RUN" != true ]]; then
    echo ""
    read -p "Proceed with publishing to npm? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Publish cancelled."
        exit 0
    fi
fi

# Publish or dry run
if [[ "$DRY_RUN" == true ]]; then
    log_info "Running dry run..."
    npm publish --dry-run --tag "$TAG"
    log_success "Dry run completed successfully"
else
    log_info "Publishing to npm..."
    npm publish --tag "$TAG"
    
    if [[ $? -eq 0 ]]; then
        log_success "Package published successfully!"
        log_success "View at: https://www.npmjs.com/package/${PACKAGE_NAME}"
        
        # Create git tag if in git repo
        if [[ -d .git ]]; then
            GIT_TAG="v${CURRENT_VERSION}"
            if ! git tag -l | grep -q "^${GIT_TAG}$"; then
                git tag "$GIT_TAG"
                log_success "Created git tag: ${GIT_TAG}"
                
                if [[ "$FORCE" != true ]]; then
                    read -p "Push git tag to origin? (y/N): " -n 1 -r
                    echo
                    if [[ $REPLY =~ ^[Yy]$ ]]; then
                        git push origin "$GIT_TAG"
                        log_success "Git tag pushed to origin"
                    fi
                fi
            fi
        fi
    else
        log_error "Publish failed"
        exit 1
    fi
fi

log_success "NPM publish process completed!"

# Show next steps
echo ""
echo "Next steps:"
echo "  - Install globally: npm install -g ${PACKAGE_NAME}"
echo "  - View package: https://www.npmjs.com/package/${PACKAGE_NAME}"
echo "  - Update documentation if needed"