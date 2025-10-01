# Development Build Setup Guide

## Overview

You're creating your first development build for iOS simulator. This guide will help you complete the process and get your app running.

## Current Status

✅ EAS CLI updated to latest version
✅ Fastlane installed
✅ CocoaPods installed
✅ Build is currently in progress...

## What's happening now:

The build is currently compiling your iOS app. You can see it's:

1. ✅ Installing dependencies
2. ✅ Running prebuild
3. ✅ Installing CocoaPods dependencies
4. 🔄 Currently compiling native iOS code

## Next Steps (after build completes):

### 1. Install the development build on iOS Simulator

Once the build completes, you'll have a `.app` file. To install it:

```bash
# Option 1: Use the install script we created
./scripts/install-dev-build.sh

# Option 2: Manual installation
# 1. Find the .app file
# 2. Open iOS Simulator (if not already open)
open -a Simulator

# 3. Install the app
xcrun simctl install booted path/to/your/app.app
```

### 2. Start the development server

After installing the development build:

```bash
yarn dev
```

### 3. Open the app in simulator

The app should now appear on your iOS Simulator home screen with the name "pursuit". Tap it to open.

## Alternative Approaches

### If the local build fails:

#### Option 1: Cloud build (recommended)

```bash
eas build --profile development --platform ios
```

This builds in the cloud and doesn't require Apple Developer credentials for simulator builds.

#### Option 2: Use Expo prebuild approach

```bash
npx expo prebuild --platform ios
npx expo run:ios
```

## Troubleshooting

### Common issues:

1. **Build fails due to dependencies**: Run `npx expo install --check` to fix version mismatches
2. **Simulator not found**: Make sure iOS Simulator is open before installing
3. **App doesn't connect**: Make sure both the development server and app are running

### Dependencies to fix (as noted by expo doctor):

- Remove `package-lock.json` (you're using yarn)
- Update `expo-auth-session` to `~6.0.3`
- Update `expo-crypto` to `~14.0.2`
- Add `.expo/` to `.gitignore`

You can fix these later with:

```bash
rm package-lock.json
npx expo install --check
echo ".expo/" >> .gitignore
```

## What makes this different from Expo Go?

- ✅ Full access to native modules
- ✅ Custom native code
- ✅ All libraries work (including those not supported by Expo Go)
- ✅ Better performance
- ✅ Production-like environment

## Need help?

If you encounter any issues:

1. Check the build logs for specific errors
2. Try the alternative approaches above
3. Ensure all dependencies are compatible with Expo SDK 52
