import { gql } from "@apollo/client";

import {
  BUCKET_CATEGORY_FRAGMENT,
  INSIGHTS_FRAGMENT,
  BUCKET_ITEM_FRAGMENT,
  WEATHER_FRAGMENT,
  RECOMMENDATION_FRAGMENT,
  AUTH_USER_FRAGMENT,
} from "./fragments";

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
    getHome(offset: $offset, limit: $limit) {
      id
      greeting
      timeOfDay
      weather {
        ...WeatherInfo
      }
      insights {
        ...InsightsInfo
      }
      bucketCategories {
        ...CategoryInfo
      }
      recommendations {
        ...RecommendationInfo
      }
      upcoming {
        ...BucketItemInfo
      }
    }
  }
  ${WEATHER_FRAGMENT}
  ${INSIGHTS_FRAGMENT}
  ${BUCKET_CATEGORY_FRAGMENT}
  ${RECOMMENDATION_FRAGMENT}
  ${BUCKET_ITEM_FRAGMENT}
`;

export const ADD_BUCKET_CATEGORY = gql`
  mutation AddBucketCategory($name: String!, $emoji: String!) {
    addBucketCategory(name: $name, emoji: $emoji) {
      category {
        id
        name
        emoji
      }
    }
  }
`;

export const ADD_BUCKET_ITEM = gql`
  mutation AddBucketItem(
    $title: String!
    $description: String
    $estimatedCost: Float
    $location: String
    $categoryId: String
  ) {
    addBucketItem(
      title: $title
      description: $description
      estimatedCost: $estimatedCost
      location: $location
      categoryId: $categoryId
    ) {
      bucketItem {
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
  }
`;

export const GET_BUCKET_CATEGORIES = gql`
  query GetBucketCategories {
    getBucketCategories {
      ...CategoryInfo
    }
  }
  ${BUCKET_CATEGORY_FRAGMENT}
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
          profilePicture
          isEmailVerified
          authProvider
          profile {
            isOnboardingCompleted
            bio
            location
          }
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
          profilePicture
          isEmailVerified
          authProvider
          profile {
            isOnboardingCompleted
            bio
            location
          }
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
          profilePicture
          isEmailVerified
          authProvider
          profile {
            isOnboardingCompleted
            bio
            location
          }
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

export const GET_USER = gql`
  query GetUser {
    user {
      id
      email
      firstName
      lastName
      profilePicture
      isEmailVerified
      authProvider
      profile {
        isOnboardingCompleted
        hasSkippedOnboarding
        bio
        location
      }
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    userProfile {
      isOnboardingCompleted
      bio
      location
    }
  }
`;

export const SKIP_ONBOARDING = gql`
  mutation SkipOnboarding {
    skipOnboarding {
      ok
      user {
        ...AuthUser
      }
    }
  }
  ${AUTH_USER_FRAGMENT}
`;
