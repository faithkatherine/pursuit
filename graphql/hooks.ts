import { useQuery } from "@apollo/client";
import {
  GET_BUCKET_CATEGORIES,
  GET_BUCKET_ITEMS,
  GET_RECOMMENDATIONS,
  GET_HOME,
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
    variables: { category: selectedCategory || undefined },
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
