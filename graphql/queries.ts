import { gql } from "@apollo/client";
import {
  BUCKET_CATEGORY_FRAGMENT,
  INSIGHTS_FRAGMENT,
  BUCKET_ITEM_FRAGMENT,
  WEATHER_FRAGMENT,
  RECOMMENDATION_FRAGMENT,
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
  query GetRecommendations($offset: Int = 0, $limit: Int = 10) {
    getRecommendations(offset: $offset, limit: $limit) {
      ...RecommendationInfo
    }
  }
  ${RECOMMENDATION_FRAGMENT}
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
        ...BucketItemInfo
      }
    }
  }
  ${WEATHER_FRAGMENT}
  ${UPCOMING_DESTINATION_FRAGMENT}
  ${BUCKET_LIST_PROGRESS_FRAGMENT}
  ${INSIGHTS_FRAGMENT}
  ${BUCKET_CATEGORY_FRAGMENT}
  ${RECOMMENDATION_FRAGMENT}
  ${BUCKET_ITEM_FRAGMENT}
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
    $amount: Float
    $image: String
    $categoryId: String
    $newCategoryName: String
    $newCategoryEmoji: String
  ) {
    addBucketItem(
      title: $title
      description: $description
      amount: $amount
      image: $image
      categoryId: $categoryId
      newCategoryName: $newCategoryName
      newCategoryEmoji: $newCategoryEmoji
    ) {
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

export const GET_BUCKET_ITEMS = gql`
  query GetBucketItems($categoryId: String) {
    getBucketItems(categoryId: $categoryId) {
      ...BucketItemInfo
    }
  }
  ${BUCKET_ITEM_FRAGMENT}
`;

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      ok
      authPayload {
        accessToken
        sessionToken
        refreshToken
        expiresIn
        user {
          id
          email
          firstName
          lastName
        }
      }
    }
  }
`;

export const SIGN_UP = gql`
  mutation SignUp(
    $firstName: String!
    $lastName: String
    $email: String!
    $password: String!
  ) {
    signUp(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      ok
      authPayload {
        accessToken
        sessionToken
        refreshToken
        expiresIn
        user {
          id
          email
          firstName
          lastName
        }
      }
    }
  }
`;

export const GOOGLE_SIGN_IN = gql`
  mutation GoogleSignIn($idToken: String!) {
    googleSignIn(idToken: $idToken) {
      ok
      authPayload {
        accessToken
        sessionToken
        refreshToken
        expiresIn
        user {
          id
          email
          firstName
          lastName
        }
      }
    }
  }
`;

export const SIGN_OUT = gql`
  mutation SignOut($refreshToken: String!) {
    signOut(refreshToken: $refreshToken) {
      ok
    }
  }
`;

export const REFRESH_ACCESS_TOKEN = gql`
  mutation RefreshAccessToken($refreshToken: String!) {
    refreshAccessToken(refreshToken: $refreshToken) {
      ok
      accessToken
      refreshToken
      expiresIn
    }
  }
`;
