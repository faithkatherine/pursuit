import * as SecureStore from "expo-secure-store";

/**
 * Secure storage utility for storing sensitive data like tokens
 * Uses expo-secure-store which encrypts data on device
 */

const KEYS = {
  ACCESS_TOKEN: "access_token",
  SESSION_TOKEN: "session_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  HAS_SEEN_GETSTARTED: "has_seen_getstarted",
  HAS_ATTEMPTED_AUTH: "has_attempted_auth",
} as const;

/**
 * Store a value securely
 */
export const setSecureItem = async (
  key: string,
  value: string
): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`Error storing ${key}:`, error);
    throw error;
  }
};

/**
 * Retrieve a value securely
 */
export const getSecureItem = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Error retrieving ${key}:`, error);
    return null;
  }
};

/**
 * Remove a value from secure storage
 */
export const deleteSecureItem = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`Error deleting ${key}:`, error);
    throw error;
  }
};

/**
 * Store authentication tokens securely
 */
export const storeTokens = async (tokens: {
  accessToken: string;
  sessionToken?: string;
  refreshToken: string;
}): Promise<void> => {
  try {
    await Promise.all([
      setSecureItem(KEYS.ACCESS_TOKEN, tokens.accessToken),
      tokens.sessionToken
        ? setSecureItem(KEYS.SESSION_TOKEN, tokens.sessionToken)
        : Promise.resolve(),
      setSecureItem(KEYS.REFRESH_TOKEN, tokens.refreshToken),
    ]);
  } catch (error) {
    console.error("Error storing tokens:", error);
    throw error;
  }
};

/**
 * Retrieve authentication tokens
 */
export const getTokens = async (): Promise<{
  accessToken: string | null;
  sessionToken: string | null;
  refreshToken: string | null;
}> => {
  try {
    const [accessToken, sessionToken, refreshToken] = await Promise.all([
      getSecureItem(KEYS.ACCESS_TOKEN),
      getSecureItem(KEYS.SESSION_TOKEN),
      getSecureItem(KEYS.REFRESH_TOKEN),
    ]);

    return { accessToken, sessionToken, refreshToken };
  } catch (error) {
    console.error("Error retrieving tokens:", error);
    return { accessToken: null, sessionToken: null, refreshToken: null };
  }
};

/**
 * Clear all authentication tokens
 */
export const clearTokens = async (): Promise<void> => {
  try {
    await Promise.all([
      deleteSecureItem(KEYS.ACCESS_TOKEN),
      deleteSecureItem(KEYS.SESSION_TOKEN),
      deleteSecureItem(KEYS.REFRESH_TOKEN),
    ]);
  } catch (error) {
    console.error("Error clearing tokens:", error);
    throw error;
  }
};

/**
 * Store user data securely
 */
export const storeUserData = async (user: object): Promise<void> => {
  try {
    await setSecureItem(KEYS.USER_DATA, JSON.stringify(user));
  } catch (error) {
    console.error("Error storing user data:", error);
    throw error;
  }
};

/**
 * Retrieve user data
 */
export const getUserData = async <T = any>(): Promise<T | null> => {
  try {
    const userData = await getSecureItem(KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return null;
  }
};

/**
 * Clear user data
 */
export const clearUserData = async (): Promise<void> => {
  try {
    await deleteSecureItem(KEYS.USER_DATA);
  } catch (error) {
    console.error("Error clearing user data:", error);
    throw error;
  }
};

/**
 * Clear all stored data (tokens + user data)
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await Promise.all([clearTokens(), clearUserData()]);
  } catch (error) {
    console.error("Error clearing all data:", error);
    throw error;
  }
};

/**
 * Store flag indicating user has seen get started screen
 */
export const setHasSeenGetStarted = async (value: boolean): Promise<void> => {
  try {
    await setSecureItem(KEYS.HAS_SEEN_GETSTARTED, value.toString());
  } catch (error) {
    console.error("Error storing hasSeenGetStarted:", error);
    throw error;
  }
};

/**
 * Get flag indicating user has seen get started screen
 */
export const getHasSeenGetStarted = async (): Promise<boolean> => {
  try {
    const value = await getSecureItem(KEYS.HAS_SEEN_GETSTARTED);
    return value === "true";
  } catch (error) {
    console.error("Error retrieving hasSeenGetStarted:", error);
    return false;
  }
};

/**
 * Store flag indicating user has attempted authentication
 */
export const setHasAttemptedAuth = async (value: boolean): Promise<void> => {
  try {
    await setSecureItem(KEYS.HAS_ATTEMPTED_AUTH, value.toString());
  } catch (error) {
    console.error("Error storing hasAttemptedAuth:", error);
    throw error;
  }
};

/**
 * Get flag indicating user has attempted authentication
 */
export const getHasAttemptedAuth = async (): Promise<boolean> => {
  try {
    const value = await getSecureItem(KEYS.HAS_ATTEMPTED_AUTH);
    return value === "true";
  } catch (error) {
    console.error("Error retrieving hasAttemptedAuth:", error);
    return false;
  }
};

export { KEYS };
