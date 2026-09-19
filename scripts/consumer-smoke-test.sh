#!/bin/bash
set -euo pipefail

echo "Running consumer smoke test..."

# Ensure we're in the repository root
cd "$(dirname "$0")/.."

# Pack the package
npm run build
PACK_FILE=$(npm pack | tail -n 1)

echo "Packed file: $PACK_FILE"

# Create a temporary consumer directory
TEMP_DIR=$(mktemp -d)
echo "Using temporary directory: $TEMP_DIR"
cd "$TEMP_DIR"

# Initialize a package.json for the consumer
npm init -y > /dev/null

# Install the packed tarball
npm install "$OLDPWD/$PACK_FILE"

# Create a CommonJS test file
cat << 'CJS_TEST' > test-cjs.js
const { GetStringPropOrDefault } = require('@arran4/tsobjectutils');
const result = GetStringPropOrDefault({ a: 'hello' }, 'a', 'default');
if (result !== 'hello') {
  console.error('CJS test failed. Expected "hello", got "' + result + '"');
  process.exit(1);
}
console.log('CJS test passed.');
CJS_TEST

# Create an ESM test file
cat << 'ESM_TEST' > test-esm.mjs
import { GetStringPropOrDefault } from '@arran4/tsobjectutils';
const result = GetStringPropOrDefault({ a: 'hello' }, 'a', 'default');
if (result !== 'hello') {
  console.error('ESM test failed. Expected "hello", got "' + result + '"');
  process.exit(1);
}
console.log('ESM test passed.');
ESM_TEST

# Run the tests
echo "Running CJS test..."
node test-cjs.js

echo "Running ESM test..."
node test-esm.mjs

echo "All smoke tests passed."

# Cleanup
cd "$OLDPWD"
rm -rf "$TEMP_DIR"
rm "$PACK_FILE"
