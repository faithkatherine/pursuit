#!/bin/bash

# Script to install the development build on iOS Simulator
# Run this after the build completes

echo "Looking for the development build..."

# Find the .app file in the current directory
APP_FILE=$(find . -name "*.app" -type d | head -1)

if [ -z "$APP_FILE" ]; then
    echo "No .app file found. Make sure the build completed successfully."
    exit 1
fi

echo "Found app: $APP_FILE"

# Get the iOS Simulator device ID (latest iOS version)
DEVICE_ID=$(xcrun simctl list devices | grep "iPhone" | grep "Booted" | head -1 | sed 's/.*(\([^)]*\)).*/\1/')

if [ -z "$DEVICE_ID" ]; then
    echo "No booted iOS Simulator found. Please start the iOS Simulator first."
    echo "You can start it with: open -a Simulator"
    exit 1
fi

echo "Installing on device: $DEVICE_ID"

# Install the app
xcrun simctl install "$DEVICE_ID" "$APP_FILE"

echo "Development build installed successfully!"
echo "Now you can run 'yarn dev' to start the development server."
