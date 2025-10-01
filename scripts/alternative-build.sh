#!/bin/bash

# Alternative approach: Using expo prebuild + npx expo run:ios
# This creates native iOS project files locally and builds directly

echo "🚀 Alternative Development Build Approach"
echo "========================================"

# Clean any previous builds
echo "🧹 Cleaning previous builds..."
rm -rf ios android
rm -rf .expo/fingerprint

# Generate native iOS project
echo "🔨 Generating native iOS project..."
npx expo prebuild --platform ios --clean

# Build and run on iOS simulator
echo "📱 Building and running on iOS simulator..."
npx expo run:ios --device simulator

echo "✅ Alternative build process complete!"
echo "Your development build should now be running in the simulator."
