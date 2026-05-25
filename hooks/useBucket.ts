import { useQuery } from "@apollo/client";
import { GET_BUCKET_CATEGORIES, GET_BUCKET_ITEMS } from "graphql/queries";
import {
  GetBucketCategoriesQuery,
  GetBucketItemsQuery,
} from "graphql/generated/graphql";

export const useBucketCategories = () => {
  const result = useQuery<GetBucketCategoriesQuery>(GET_BUCKET_CATEGORIES, {
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
    notifyOnNetworkStatusChange: true,
  });

  return {
    ...result,
    bucketItems: result.data?.getBucketItems || [],
  };
};
