#!/bin/bash
# Build script ottimizzato per Render

echo "Starting optimized build for Render..."

# Install dependencies
npm install

# Build frontend
cd client
npx vite build --outDir ../dist/public --emptyOutDir
cd ..

# Build backend
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build completed successfully!"