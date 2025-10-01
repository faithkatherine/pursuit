#!/bin/bash

# Development Build Installation Script for Pursuit App
# This script installs development builds for both iOS simulator and Android emulator

set -e

echo "🚀 Installing Development Builds for Pursuit App"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -f "eas.json" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

# Function to check if EAS CLI is installed
check_eas_cli() {
    if ! command -v eas &> /dev/null; then
        print_error "EAS CLI is not installed. Installing..."
        npm install -g @expo/cli@latest
        print_success "EAS CLI installed successfully"
    else
        print_success "EAS CLI is already installed"
    fi
}

# Function to build and install iOS development build
install_ios_build() {
    print_status "Building and installing iOS development build..."
    
    if command -v xcrun &> /dev/null && xcrun simctl list devices | grep -q "Booted"; then
        print_status "iOS Simulator detected. Building for simulator..."
        eas build --profile development --platform ios --non-interactive
    else
        print_warning "No iOS Simulator found. Skipping iOS build."
        print_warning "To install iOS build later, run: eas build --profile development --platform ios"
    fi
}

# Function to build and install Android development build
install_android_build() {
    print_status "Building and installing Android development build..."
    
    if command -v adb &> /dev/null && adb devices | grep -q "device"; then
        print_status "Android device/emulator detected. Building for Android..."
        eas build --profile development --platform android --non-interactive
    else
        print_warning "No Android device/emulator found. Skipping Android build."
        print_warning "To install Android build later, run: eas build --profile development --platform android"
    fi
}

# Main installation process
main() {
    print_status "Starting development build installation process..."
    
    # Check prerequisites
    check_eas_cli
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing project dependencies..."
        yarn install
        print_success "Dependencies installed"
    fi
    
    # Ask user which platforms to build for
    echo ""
    echo "Which platforms would you like to build for?"
    echo "1) iOS only"
    echo "2) Android only" 
    echo "3) Both iOS and Android"
    echo "4) Exit"
    echo ""
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            install_ios_build
            ;;
        2)
            install_android_build
            ;;
        3)
            install_ios_build
            install_android_build
            ;;
        4)
            print_status "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
    
    print_success "Development build installation completed!"
    echo ""
    print_status "Next steps:"
    echo "1. Start the development server: yarn dev"
    echo "2. Open the installed development build on your device/simulator"
    echo "3. Scan the QR code or enter the URL shown by the dev server"
    echo ""
    print_status "Happy coding! 🎉"
}

# Run main function
main "$@"
