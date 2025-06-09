#!/usr/bin/env node

// Simple build script for Render deployment
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building for Render...');

try {
  // Build frontend with simplified config
  console.log('Building frontend...');
  execSync('npx vite build --config vite.config.prod.ts', { stdio: 'inherit' });
  
  // Build backend
  console.log('Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}