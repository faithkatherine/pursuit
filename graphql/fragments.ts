import { gql } from "@apollo/client";
import e from "express";

// export const WEATHER_FRAGMENT = gql`
//   fragment WeatherInfo on Weather {
//     city
//     condition
//     temperature
//   }
// `;

// export const UPCOMING_DESTINATION_FRAGMENT = gql`
//   fragment DestinationInfo on Destination {
//     location
//     daysAway
//   }
// `;

// export const BUCKET_LIST_PROGRESS_FRAGMENT = gql`
//   fragment ProgressInfo on Progress {
//     completed
//     yearlyGoal
//     percentage
//   }
// `;

// export const BUCKET_CATEGORY_FRAGMENT = gql`
//   fragment CategoryInfo on Category {
//     id
//     name
//     emoji
//   }
// `;

// export const RECOMMENDATION_FRAGMENT = gql`
//   fragment RecommendationInfo on Recommendation {
//     id
//     image
//     title
//     date
//     location
//   }
// `;

// export const BUCKET_ITEM_FRAGMENT = gql`
//   fragment BucketItemInfo on BucketItem {
//     id
//     title
//     description
//     image
//     completed
//     categoryId
//     category {
//       ...CategoryInfo
//     }
//   }
//   ${BUCKET_CATEGORY_FRAGMENT}
// `;

// export const INSIGHTS_FRAGMENT = gql`
//   fragment InsightsInfo on InsightsData {
//     id
//     weather {
//       ...WeatherInfo
//     }
//     nextDestination {
//       ...DestinationInfo
//     }
//     progress {
//       ...ProgressInfo
//     }
//     recentAchievement
//   }
//   ${WEATHER_FRAGMENT}
//   ${UPCOMING_DESTINATION_FRAGMENT}
//   ${BUCKET_LIST_PROGRESS_FRAGMENT}
// `;

export const USER_BASIC_FRAGMENT = gql`
  fragment UserBasic on UserType {
    id
    email
    firstName
    lastName
    fullName
    profilePicture
  }
`;

export const AUTH_USER_FRAGMENT = gql`
  fragment AuthUser on UserType {
    ...UserBasic
    isEmailVerified
    authProvider
    profile {
      isOnboardingCompleted
      hasSkippedOnboarding
      isPremium
    }
  }
  ${USER_BASIC_FRAGMENT}
`;

export const AUTH_PAYLOAD_FRAGMENT = gql`
  fragment AuthPayloadFields on AuthPayloadType {
    accessToken
    sessionToken
    refreshToken
    expiresIn
    user {
      ...AuthUser
    }
  }
  ${AUTH_USER_FRAGMENT}
`;

export const FULL_PROFILE_FRAGMENT = gql`
  fragment FullProfile on UserProfileType {
    bio
    location
    coordinates
    hasLocation
    searchRadiusKm
    timezone
    birthDate
    phoneNumber
    interests {
      id
      name
      icon
    }
    isOnboardingCompleted
    hasSkippedOnboarding
    isProfilePublic
    allowEmailNotifications
    allowPushNotifications
    calendarIntegrated
    calendarProvider
    paymentPlan
    isPremium
    subscriptionExpiresAt
    theme
    lastActiveAt
    loginCount
  }
`;
