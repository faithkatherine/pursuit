import { useQuery, useMutation } from "@apollo/client";
import {
  GET_BUCKET_CATEGORIES,
  GET_BUCKET_ITEMS,
  GET_HOME,
  GET_EVENTS,
  GET_SAVED_EVENTS,
  SAVE_EVENT,
  UNSAVE_EVENT,
} from "./queries";
import { getCachePolicy } from "./cache";
import {
  GetBucketCategoriesQuery,
  GetBucketItemsQuery,
  GetHomeQuery,
  GetEventsQuery,
  GetSavedEventsQuery,
  SaveEventMutation,
  UnsaveEventMutation,
} from "graphql/generated/graphql";

export const useBucketCategories = () => {
  const result = useQuery<GetBucketCategoriesQuery>(GET_BUCKET_CATEGORIES, {
    ...getCachePolicy("static"),
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
    ...getCachePolicy("dynamic"),
    notifyOnNetworkStatusChange: true,
  });

  return {
    ...result,
    bucketItems: result.data?.getBucketItems || [],
  };
};

// Shared hook for home data
export const useHomeData = () => {
  return useQuery<GetHomeQuery>(GET_HOME, {
    variables: { offset: 0, limit: 10 },
    ...getCachePolicy("dynamic"),
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

export const useSaveEvent = () => {
  return useMutation<SaveEventMutation>(SAVE_EVENT);
};

export const useUnsaveEvent = () => {
  return useMutation<UnsaveEventMutation>(UNSAVE_EVENT);
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
