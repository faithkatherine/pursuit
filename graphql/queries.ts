import { gql } from "@apollo/client";
import {
  BUCKET_CATEGORY_FRAGMENT,
  INSIGHTS_FRAGMENT,
  ACTIVITY_FRAGMENT,
  WEATHER_FRAGMENT,
  EVENT_RECOMMENDATION_FRAGMENT,
  UPCOMING_DESTINATION_FRAGMENT,
  BUCKET_LIST_PROGRESS_FRAGMENT,
} from "./fragments";

export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      ...CategoryInfo
    }
  }
  ${BUCKET_CATEGORY_FRAGMENT}
`;

export const GET_INSIGHTS_DATA = gql`
  query GetInsightsData {
    getInsightsData {
      ...InsightsInfo
    }
  }
  ${INSIGHTS_FRAGMENT}
`;

export const GET_RECOMMENDATIONS = gql`
  query GetEvents {
    getRecommendations {
      ...RecommendationInfo
    }
  }
  ${EVENT_RECOMMENDATION_FRAGMENT}
`;

export const GET_HOME = gql`
  query GetHome($offset: Int = 0, $limit: Int = 10) {
    getHome {
      id
      greeting
      timeOfDay
      weather {
        ...WeatherInfo
      }
      insights {
        ...InsightsInfo
      }
      bucketCategories(offset: $offset, limit: $limit) {
        ...CategoryInfo
      }
      recommendations(offset: $offset, limit: $limit) {
        ...RecommendationInfo
      }
      upcoming(offset: $offset, limit: $limit) {
        ...ActivityInfo
      }
    }
  }
  ${WEATHER_FRAGMENT}
  ${UPCOMING_DESTINATION_FRAGMENT}
  ${BUCKET_LIST_PROGRESS_FRAGMENT}
  ${INSIGHTS_FRAGMENT}
  ${BUCKET_CATEGORY_FRAGMENT}
  ${EVENT_RECOMMENDATION_FRAGMENT}
  ${ACTIVITY_FRAGMENT}
`;

export const GET_EMOJI_LIBRARY = gql`
  query GetEmojiLibrary {
    getEmojiLibrary {
      symbol
      description
    }
  }
`;

export const ADD_BUCKET_CATEGORY = gql`
  mutation AddBucketCategory($name: String!, $emoji: String!) {
    addBucketCategory(name: $name, emoji: $emoji) {
      id
      name
      emoji
    }
  }
`;

export const ADD_BUCKET_ITEM = gql`
  mutation AddBucketItem(
    $title: String!
    $description: String
    $categoryId: String
    $newCategoryName: String
    $newCategoryEmoji: String
  ) {
    addBucketItem(
      title: $title
      description: $description
      categoryId: $categoryId
      newCategoryName: $newCategoryName
      newCategoryEmoji: $newCategoryEmoji
    ) {
      id
      title
      description
      completed
      categoryId
      category {
        id
        name
        emoji
      }
    }
  }
`;

export const GET_BUCKET_CATEGORIES = gql`
  query GetBucketCategories {
    getBucketCategories {
      id
      name
      emoji
    }
  }
`;
