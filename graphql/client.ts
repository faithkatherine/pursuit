import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  Observable,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { Platform } from "react-native";
import { getTokens, storeTokens, clearAllData } from "../utils/secureStorage";

// Platform-specific API URL configuration
const getApiUrl = () => {
  // If environment variable is set, use it (allows override for physical devices)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Platform-specific defaults
  if (Platform.OS === "android") {
    // Android Emulator uses 10.0.2.2 to refer to host machine
    return "http://10.0.2.2:8000/graphql/";
  } else if (Platform.OS === "ios") {
    // iOS Simulator can use localhost
    return "http://localhost:8000/graphql/";
  }

  // Fallback for web or other platforms
  return "http://localhost:8000/graphql/";
};

const apiUrl = getApiUrl();
console.log(`[Apollo Client] Platform: ${Platform.OS}, Using API URL: ${apiUrl}`);

const httpLink = createHttpLink({
  uri: apiUrl,
});

// Track if we're currently refreshing to avoid multiple simultaneous refresh attempts
let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

const authLink = setContext(async (_, { headers }) => {
  // Get the authentication token from secure storage
  const tokens = await getTokens();
  const token = tokens.accessToken;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Error handling link for token refresh
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        // Check if error is due to expired token
        if (
          err.extensions?.code === "TOKEN_EXPIRED" ||
          err.extensions?.code === "NOT_AUTHENTICATED" ||
          err.message?.includes("Token has expired") ||
          err.message?.includes("Not authenticated")
        ) {
          console.log("[Apollo] Token expired, attempting refresh...");

          if (!isRefreshing) {
            isRefreshing = true;

            return new Observable((observer) => {
              getTokens()
                .then(async (tokens) => {
                  if (!tokens.refreshToken) {
                    throw new Error("No refresh token available");
                  }

                  // Call refresh token mutation
                  const response = await fetch(
                    process.env.EXPO_PUBLIC_API_URL ||
                      "http://localhost:8000/graphql/",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        query: `
                        mutation RefreshAccessToken($refreshToken: String!) {
                          refreshAccessToken(refreshToken: $refreshToken) {
                            ok
                            accessToken
                            refreshToken
                            expiresIn
                          }
                        }
                      `,
                        variables: { refreshToken: tokens.refreshToken },
                      }),
                    }
                  );

                  const result = await response.json();

                  if (result.data?.refreshAccessToken?.ok) {
                    const { accessToken, refreshToken } =
                      result.data.refreshAccessToken;

                    // Store new tokens
                    await storeTokens({
                      accessToken,
                      refreshToken,
                      sessionToken: tokens.sessionToken ?? undefined,
                    });

                    // Retry all pending requests
                    pendingRequests.forEach((callback) => callback());
                    pendingRequests = [];
                  } else {
                    throw new Error("Token refresh failed");
                  }
                })
                .catch(async (error) => {
                  // Clear all data and force re-login
                  await clearAllData();
                  pendingRequests = [];
                  observer.error(error);
                  return;
                })
                .finally(() => {
                  isRefreshing = false;
                })
                .then(() => {
                  // Retry the operation after refresh
                  forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                  });
                });
            });
          } else {
            // Already refreshing, queue this request
            return new Observable((observer) => {
              pendingRequests.push(() => {
                forward(operation).subscribe({
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                });
              });
            });
          }
        }
      }
    }

    if (networkError) {
      console.error("[Apollo] Network error:", networkError);
    }
  }
);

const link = from([errorLink, authLink, httpLink]);

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Home data - merge for dynamic updates
        getHome: {
          merge(existing, incoming) {
            return { ...existing, ...incoming };
          },
        },
        // Insights data - merge for dynamic updates
        getInsightsData: {
          merge(existing, incoming) {
            return { ...existing, ...incoming };
          },
        },
        // Events - merge for dynamic updates
        getEvents: {
          keyArgs: false,
          merge(existing = [], incoming, { args }) {
            const { offset = 0 } = args || {};
            const merged = existing ? existing.slice() : [];

            for (let i = 0; i < incoming.length; ++i) {
              merged[offset + i] = incoming[i];
            }

            return merged;
          },
        },
        // Categories - merge for dynamic updates
        getBucketCategories: {
          merge(existing = [], incoming) {
            // For categories, we want to merge and avoid duplicates
            const existingIds = new Set(existing.map((item: any) => item.id));
            const newItems = incoming.filter(
              (item: any) => !existingIds.has(item.id)
            );
            return [...existing, ...newItems];
          },
        },
        getCategories: {
          merge(existing = [], incoming) {
            const existingIds = new Set(existing.map((item: any) => item.id));
            const newItems = incoming.filter(
              (item: any) => !existingIds.has(item.id)
            );
            return [...existing, ...newItems];
          },
        },
        // Bucket items with pagination support
        getBucketItems: {
          keyArgs: ["categoryId"],
          merge(existing = [], incoming, { args }) {
            const { offset = 0 } = args || {};
            const merged = existing ? existing.slice() : [];

            // Handle pagination by replacing items at correct offset
            for (let i = 0; i < incoming.length; ++i) {
              merged[offset + i] = incoming[i];
            }

            return merged;
          },
        },
        // Recommendations - merge for dynamic updates
        getRecommendations: {
          keyArgs: false,
          merge(existing = [], incoming, { args }) {
            const { offset = 0 } = args || {};
            const merged = existing ? existing.slice() : [];

            for (let i = 0; i < incoming.length; ++i) {
              merged[offset + i] = incoming[i];
            }

            return merged;
          },
        },
        // Emoji library - can replace since it's static
        getEmojiLibrary: {
          merge(existing = [], incoming) {
            return incoming; // Replace with fresh data
          },
        },
      },
    },
    // Type policies for individual entities
    Category: {
      fields: {
        // Categories can be dynamic
        name: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        emoji: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
    BucketItem: {
      fields: {
        // Bucket items will be very dynamic
        completed: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        amount: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        title: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        description: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
    Recommendation: {
      fields: {
        // Recommendations will be dynamic once backend is connected
        title: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        date: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        location: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
    InsightsData: {
      fields: {
        // Weather and insights will be very dynamic
        weather: {
          merge(existing, incoming) {
            return { ...existing, ...incoming };
          },
        },
        progress: {
          merge(existing, incoming) {
            return { ...existing, ...incoming };
          },
        },
        nextDestination: {
          merge(existing, incoming) {
            return { ...existing, ...incoming };
          },
        },
        recentAchievement: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
    HomeData: {
      fields: {
        // All nested fields in home data should merge for dynamic updates
        greeting: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        timeOfDay: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        weather: {
          merge(existing, incoming) {
            return { ...existing, ...incoming };
          },
        },
        insights: {
          merge(existing, incoming) {
            return { ...existing, ...incoming };
          },
        },
        bucketCategories: {
          keyArgs: false,
          merge(existing = [], incoming, { args }) {
            const { offset = 0 } = args || {};
            const merged = existing ? existing.slice() : [];

            for (let i = 0; i < incoming.length; ++i) {
              merged[offset + i] = incoming[i];
            }

            return merged;
          },
        },
        recommendations: {
          keyArgs: false,
          merge(existing = [], incoming, { args }) {
            const { offset = 0 } = args || {};
            const merged = existing ? existing.slice() : [];

            for (let i = 0; i < incoming.length; ++i) {
              merged[offset + i] = incoming[i];
            }

            return merged;
          },
        },
        upcoming: {
          keyArgs: false,
          merge(existing = [], incoming, { args }) {
            const { offset = 0 } = args || {};
            const merged = existing ? existing.slice() : [];

            for (let i = 0; i < incoming.length; ++i) {
              merged[offset + i] = incoming[i];
            }

            return merged;
          },
        },
      },
    },
  },
});

export const client = new ApolloClient({
  link: link,
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all", // Changed from "ignore" to show errors
      fetchPolicy: "cache-and-network", // Use cache first, then network
      nextFetchPolicy: "cache-and-network",
    },
    query: {
      errorPolicy: "all",
      fetchPolicy: "cache-first",
    },
  },
});
