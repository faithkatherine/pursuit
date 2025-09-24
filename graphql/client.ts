import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "pursuit_auth_token";

const httpLink = createHttpLink({
  uri: "http://localhost:8000/graphql/",
});

const authLink = setContext(async (_, { headers }) => {
  // Get the authentication token from AsyncStorage
  const token = await AsyncStorage.getItem(TOKEN_KEY);

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const link = from([authLink, httpLink]);

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
      errorPolicy: "ignore",
      fetchPolicy: "cache-first", // Use cache first, then network
      nextFetchPolicy: "cache-first",
    },
    query: {
      errorPolicy: "all",
      fetchPolicy: "cache-first",
    },
  },
});
