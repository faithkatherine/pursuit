import { client } from "./client";
import { gql } from "@apollo/client";

// Cache duration constants (in milliseconds)
export const CACHE_DURATIONS = {
  WEATHER: 2 * 60 * 1000, // 2 minutes
  HOME_DATA: 5 * 60 * 1000, // 5 minutes
  EVENTS: 10 * 60 * 1000, // 10 minutes
  RECOMMENDATIONS: 15 * 60 * 1000, // 15 minutes
  CATEGORIES: 30 * 60 * 1000, // 30 minutes
  EMOJI_LIBRARY: 60 * 60 * 1000, // 1 hour
};

// Cache management utilities
export const cacheUtils = {
  // Clear all cache
  clearAll: () => {
    return client.clearStore();
  },

  // Clear specific queries
  clearQuery: (queryName: string, variables?: any) => {
    return client.cache.evict({
      fieldName: queryName,
      args: variables,
    });
  },

  // Invalidate weather data (force refresh)
  invalidateWeather: () => {
    client.cache.evict({ fieldName: "getInsightsData" });
    client.cache.evict({ fieldName: "getHome" });
    client.cache.gc();
  },

  // Invalidate bucket data (when items are added/updated)
  invalidateBucketData: () => {
    client.cache.evict({ fieldName: "getBucketItems" });
    client.cache.evict({ fieldName: "getBucketCategories" });
    client.cache.evict({ fieldName: "getHome" });
    client.cache.gc();
  },

  // Invalidate recommendations
  invalidateRecommendations: () => {
    client.cache.evict({ fieldName: "getRecommendations" });
    client.cache.evict({ fieldName: "getHome" });
    client.cache.gc();
  },

  // Update bucket item in cache
  updateBucketItem: (itemId: string, updates: any) => {
    const normalizedId = client.cache.identify({
      __typename: "BucketItem",
      id: itemId,
    });

    if (normalizedId) {
      client.cache.modify({
        id: normalizedId,
        fields: {
          ...updates,
        },
      });
    }
  },

  // Add new bucket item to cache
  addBucketItemToCache: (newItem: any, categoryId?: string) => {
    client.cache.modify({
      fields: {
        getBucketItems(existingItems = [], { args }: any) {
          // Only add to matching category filter
          if (categoryId && args?.categoryId !== categoryId) {
            return existingItems;
          }

          const newItemRef = client.cache.writeFragment({
            data: newItem,
            fragment: gql`
              fragment NewBucketItem on BucketItem {
                id
                title
                description
                amount
                image
                completed
                categoryId
                category {
                  id
                  name
                  emoji
                }
              }
            `,
          });

          return [...existingItems, newItemRef];
        },
      },
    });
  },

  // Get cache statistics
  getCacheStats: () => {
    const cache = client.cache as any;
    return {
      size: cache.data?.size || 0,
      queries: Object.keys(cache.data?.data || {}).filter((key) =>
        key.startsWith("ROOT_QUERY")
      ).length,
    };
  },
};

// Cache policy helpers for components
export const getCachePolicy = (
  queryType: "static" | "dynamic" | "realtime"
) => {
  switch (queryType) {
    case "static":
      return {
        fetchPolicy: "cache-first" as const,
        nextFetchPolicy: "cache-first" as const,
        notifyOnNetworkStatusChange: false,
      };
    case "dynamic":
      return {
        fetchPolicy: "cache-first" as const,
        nextFetchPolicy: "cache-and-network" as const,
        notifyOnNetworkStatusChange: true,
      };
    case "realtime":
      return {
        fetchPolicy: "cache-and-network" as const,
        nextFetchPolicy: "cache-and-network" as const,
        notifyOnNetworkStatusChange: true,
        pollInterval: 30000, // 30 seconds
      };
    default:
      return {};
  }
};
