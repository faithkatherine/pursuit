import { useQuery } from "@apollo/client";
import {
  GET_BUCKET_CATEGORIES,
  GET_BUCKET_ITEMS,
  GET_RECOMMENDATIONS,
  GET_HOME,
  GET_EVENTS,
  GET_SAVED_EVENTS,
} from "./queries";
import { getCachePolicy } from "./cache";
import {
  Category,
  BucketItem,
  Recommendation,
  HomeData,
  GetBucketCategoriesQuery,
  GetBucketItemsQuery,
  GetRecommendationsQuery,
  GetHomeQuery,
  GetEventsQuery,
  GetSavedEventsQuery,
} from "./types";

// Shared hooks for consistent data fetching patterns
export const useBucketCategories = () => {
  const result = useQuery<GetBucketCategoriesQuery>(GET_BUCKET_CATEGORIES, {
    ...getCachePolicy("static"), // Categories rarely change
    notifyOnNetworkStatusChange: true,
  });

  return {
    ...result,
    categories: result.data?.getBucketCategories || [],
  };
};

export const useBucketItems = (selectedCategory?: string | null) => {
  const result = useQuery<GetBucketItemsQuery>(GET_BUCKET_ITEMS, {
    variables: { categoryId: selectedCategory || undefined },
    ...getCachePolicy("dynamic"), // Items change frequently
    notifyOnNetworkStatusChange: true,
  });

  return {
    ...result,
    bucketItems: result.data?.getBucketItems || [],
  };
};

export const useRecommendations = () => {
  const result = useQuery<GetRecommendationsQuery>(GET_RECOMMENDATIONS, {
    ...getCachePolicy("static"), // Recommendations can be cached longer
  });

  return {
    ...result,
    recommendations: result.data?.getRecommendations || [],
  };
};

// Shared hook for home data
export const useHomeData = () => {
  return useQuery<GetHomeQuery>(GET_HOME, {
    variables: { offset: 0, limit: 10 },
    ...getCachePolicy("dynamic"), // Home data changes moderately
  });
};

// Events hooks
export const useEvents = (filters?: {
  search?: string;
  category?: string[];
  offset?: number;
  limit?: number;
}) => {
  const result = useQuery<GetEventsQuery>(GET_EVENTS, {
    variables: {
      search: filters?.search || undefined,
      category: filters?.category?.length ? filters.category : undefined,
      offset: filters?.offset || 0,
      limit: filters?.limit || 20,
    },
    ...getCachePolicy("dynamic"),
    notifyOnNetworkStatusChange: true,
  });

  return {
    ...result,
    events: result.data?.events?.events || [],
  };
};

export const useSavedEvents = (offset = 0, limit = 20) => {
  const result = useQuery<GetSavedEventsQuery>(GET_SAVED_EVENTS, {
    variables: { offset, limit },
    ...getCachePolicy("dynamic"),
    notifyOnNetworkStatusChange: true,
  });

  return {
    ...result,
    savedEvents: result.data?.savedEvents?.events || [],
  };
};

// Shared data transformation utilities
export const transformBucketItemsWithCategories = (
  bucketItems: BucketItem[],
  categories: Category[]
): BucketItem[] => {
  return bucketItems.map((item) => ({
    ...item,
    category: categories.find((cat) => cat.id === item.categoryId),
  }));
};

// Shared search filter utility
export const filterItemsBySearch = (
  items: BucketItem[],
  searchQuery: string
): BucketItem[] => {
  if (!searchQuery) return items;

  const query = searchQuery.toLowerCase();
  return items.filter(
    (item) =>
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
  );
};

// Shared sorting and categorization utilities
export const categorizeItems = (items: BucketItem[]) => {
  const upcomingItems = items.filter((item) => !item.completed);
  const completedItems = items.filter((item) => item.completed);

  return {
    sortedUpcoming: upcomingItems.sort(
      (a, b) => (b.amount || 0) - (a.amount || 0)
    ),
    recentlyCompleted: completedItems.slice(0, 3),
  };
};
