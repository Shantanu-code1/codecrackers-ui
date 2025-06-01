#!/bin/bash
set -e

echo "Installing dependencies..."
pnpm install --frozen-lockfile

echo "Verifying recharts installation..."
if [ ! -d "node_modules/recharts" ]; then
  echo "Recharts not found, installing explicitly..."
  pnpm add recharts@^2.15.3
fi

echo "Running build..."
pnpm run build

echo "Build completed successfully!" 