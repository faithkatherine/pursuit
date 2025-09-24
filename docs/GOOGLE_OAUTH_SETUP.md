# Google OAuth Setup Guide

## Overview

This guide explains how to complete the Google OAuth integration for the Pursuit app using `expo-auth-session`.

## Backend Setup

✅ **Already Complete** - The Django backend already has Google OAuth implemented:

- `GoogleSignInView` in `apps/accounts/views.py`
- Google ID token verification using `google.auth.transport.requests`
- JWT token generation for authenticated users
- GraphQL `GoogleSignIn` mutation added to schema

### Backend Environment Variables

Update the Django backend `.env` file with your Google OAuth credentials:

```bash
# Google OAuth Configuration
GOOGLE_OAUTH2_CLIENT_ID=your_google_web_client_id.apps.googleusercontent.com
GOOGLE_OAUTH2_CLIENT_SECRET=your_google_client_secret
```

**Note:** Use the same web client ID for both frontend and backend.

## Frontend Setup

### 1. Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API** and **Google Sign-In API**
4. Create OAuth 2.0 credentials:
   - **Web Client ID**: For your web application (used by both frontend and backend)

### 2. Environment Variables

Update `.env` file with your Google OAuth credentials:

```bash
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
```

**Note:** With `expo-auth-session`, you only need one web client ID that works across all platforms.

### 3. Redirect URI Configuration

In Google Cloud Console, add the following redirect URIs to your OAuth 2.0 client:

**IMPORTANT**: Add this redirect URI to your Google Cloud Console OAuth 2.0 client:

```
https://auth.expo.io/@faithkatherine/pursuit
```

This is the correct redirect URI that your app is now configured to use. Make sure to:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth 2.0 client credentials
3. In "Authorized redirect URIs", add: `https://auth.expo.io/@faithkatherine/pursuit`
4. Save the configuration

When you run the app, the console will also show you the redirect URI being used for verification.

### 4. App Scheme Configuration

✅ **Already configured** - The app scheme `pursuit` is set in `app.config.js`

## Implementation Details

### Authentication Flow

1. User taps "Continue with Google" button
2. `expo-auth-session` handles the OAuth flow using the device's browser
3. Google redirects back to the app with an ID token
4. App sends ID token to GraphQL `GoogleSignIn` mutation
5. Backend verifies token with Google and returns JWT tokens
6. App stores JWT tokens and user data locally

### Key Components Updated

- **AuthContext**: Updated to use `expo-auth-session` instead of `@react-native-google-signin/google-signin`
- **SignIn Screen**: Google signin button with proper error handling
- **SignUp Screen**: Google signup button (same flow as signin)
- **GraphQL Mutations**: `GOOGLE_SIGN_IN` mutation

### GraphQL Mutation

```graphql
mutation GoogleSignIn($token: String!) {
  googleSignIn(token: $token) {
    success
    user {
      id
      name
      email
      avatar
    }
    accessToken
    refreshToken
  }
}
```

## Testing

1. Make sure your Google OAuth credentials are properly configured
2. Update the environment variables with your actual web client ID
3. Add the correct redirect URIs in Google Cloud Console
4. Test on both iOS and Android devices/simulators
5. Verify that users can sign in and their data is properly stored

## Security Notes

- ID tokens are verified server-side using Google's verification libraries
- JWT tokens are used for subsequent API calls
- Tokens are stored securely in AsyncStorage
- Uses secure OAuth 2.0 flow with PKCE (handled by expo-auth-session)
- Proper error handling for various authentication states

## Troubleshooting

- **"OAuth request not ready"**: Make sure the discovery endpoint loaded successfully
- **"DEVELOPER_ERROR"**: Check your Google Cloud Console configuration and redirect URIs
- **"Network Error"**: Verify internet connection and Google services availability
- **Token verification fails**: Ensure your web client ID matches between frontend and backend configuration
