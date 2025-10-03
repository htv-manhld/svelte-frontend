#!/bin/bash
#
# Generate TypeScript API Client from OpenAPI Spec
# This script generates separate client code for each microservice
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_ROOT="$(cd "$FRONTEND_ROOT/../scala-play-backend" && pwd)"
MICROSERVICES_DIR="$BACKEND_ROOT/microservices"
OUTPUT_DIR="$FRONTEND_ROOT/src/lib/api/generated"

echo "🔄 Generating API clients from OpenAPI specs..."
echo ""

# Clean up old generated code
echo "🧹 Cleaning up old generated code..."
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Service name mapping: microservice folder -> client folder
declare -A SERVICE_MAP=(
  ["user-service"]="users"
  ["order-service"]="orders"
  ["notification-service"]="notifications"
  ["analytics-service"]="analytics"
)

GENERATED_COUNT=0

# Generate client for each service
for SERVICE_DIR in "$MICROSERVICES_DIR"/*; do
  if [ ! -d "$SERVICE_DIR" ]; then
    continue
  fi

  SERVICE_NAME=$(basename "$SERVICE_DIR")

  # Skip api-gateway (it's aggregated, not a real service)
  if [ "$SERVICE_NAME" = "api-gateway" ]; then
    continue
  fi

  OPENAPI_FILE="$SERVICE_DIR/openapi/openapi.yaml"

  # Skip if no OpenAPI spec
  if [ ! -f "$OPENAPI_FILE" ]; then
    continue
  fi

  # Get client folder name from mapping
  CLIENT_NAME="${SERVICE_MAP[$SERVICE_NAME]:-$SERVICE_NAME}"

  echo "📦 Generating client for $SERVICE_NAME → $CLIENT_NAME..."

  # Bundle the service spec first
  TEMP_BUNDLE="/tmp/${SERVICE_NAME}-bundled.yaml"

  if command -v swagger-cli &> /dev/null; then
    swagger-cli bundle "$OPENAPI_FILE" -o "$TEMP_BUNDLE" -t yaml 2>/dev/null

    # Generate TypeScript client to temp directory
    TEMP_OUTPUT="/tmp/${SERVICE_NAME}-generated"
    rm -rf "$TEMP_OUTPUT"

    npx openapi2aspida@0.24.0 \
      -i "$TEMP_BUNDLE" \
      -o "$TEMP_OUTPUT" 2>/dev/null

    # Extract only types file
    mkdir -p "$OUTPUT_DIR/$CLIENT_NAME"
    if [ -f "$TEMP_OUTPUT/@types/index.ts" ]; then
      cp "$TEMP_OUTPUT/@types/index.ts" "$OUTPUT_DIR/$CLIENT_NAME/types.ts"
      echo "   ✅ $CLIENT_NAME/types.ts generated"
      GENERATED_COUNT=$((GENERATED_COUNT + 1))
    else
      echo "   ⚠️  Types file not found for $SERVICE_NAME"
    fi

    # Cleanup
    rm "$TEMP_BUNDLE"
    rm -rf "$TEMP_OUTPUT"
  else
    echo "   ⚠️  swagger-cli not found, skipping"
  fi

  echo ""
done

if [ $GENERATED_COUNT -eq 0 ]; then
  echo "❌ No API clients generated!"
  echo "   Make sure:"
  echo "   1. swagger-cli is installed: npm install -g @apidevtools/swagger-cli"
  echo "   2. Services have OpenAPI specs at: microservices/*/openapi/openapi.yaml"
  exit 1
fi

echo "✅ Generated $GENERATED_COUNT API client(s) successfully!"
echo ""

# Format generated files with Prettier
echo "🎨 Formatting generated files with Prettier..."
if command -v npx &> /dev/null; then
  npx prettier --write "$OUTPUT_DIR/**/*.ts" 2>/dev/null
  echo "✅ Files formatted"
else
  echo "⚠️  npx not found, skipping formatting"
fi

echo ""
echo "📝 Usage example:"
echo "  import type { User, CreateUserRequest } from '\$lib/api/generated/users/types'"
echo ""
echo "  const response = await fetch('http://localhost:9000/api/users')"
echo "  const data: User[] = await response.json()"
