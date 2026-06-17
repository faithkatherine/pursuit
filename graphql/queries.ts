import { gql } from "@apollo/client";

import {
  BUCKET_CATEGORY_FRAGMENT,
  BUCKET_ITEM_FRAGMENT,
  WEATHER_FRAGMENT,
  AUTH_USER_FRAGMENT,
  EVENT_FRAGMENT,
} from "./fragments";

export const COMPLETE_ONBOARDING = gql`
  mutation CompleteOnboarding(
    $allowLocationSharing: Boolean
    $locationName: String
    $location: [Float]
    $allowPushNotifications: Boolean
    $allowEmailNotifications: Boolean
    $interests: [String]
  ) {
    completeOnboarding(
      allowLocationSharing: $allowLocationSharing
      locationName: $locationName
      location: $location
      allowPushNotifications: $allowPushNotifications
      allowEmailNotifications: $allowEmailNotifications
      interests: $interests
    ) {
      ok
      user {
        id
        email
        firstName
        lastName
        fullName
        isEmailVerified
        authProvider
        profile {
          isOnboardingCompleted
        }
      }
    }
  }
`;

export const GET_HOME = gql`
  query GetHome($offset: Int = 0, $limit: Int = 10, $timeFilter: String) {
    getHome(offset: $offset, limit: $limit, timeFilter: $timeFilter) {
      id
      greeting
      greetingPrompt
      timeOfDay
      dayOfWeek
      cityName
      profilePicture
      userLocation
      allowLocationSharing
      weather {
        ...WeatherInfo
      }
      categories {
        ...CategoryInfo
      }
      editorsPick {
        ...EventInfo
      }
      recommendations {
        ...EventInfo
      }
      trending {
        ...EventInfo
      }
      upcomingEvents {
        ...EventInfo
      }
      nextSavedEvent {
        ...EventInfo
      }
      activeTrip {
        id
        name
        destination
        startDate
        endDate
        coverImage
        eventCount
        events {
          id
        }
      }
    }
  }
  ${WEATHER_FRAGMENT}
  ${BUCKET_CATEGORY_FRAGMENT}
  ${EVENT_FRAGMENT}
`;

export const ADD_BUCKET_CATEGORY = gql`
  mutation AddBucketCategory($name: String!, $emoji: String) {
    addBucketCategory(name: $name, emoji: $emoji) {
      category {
        id
        name
        icon
        color
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
          icon
          color
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
            hasSkippedOnboarding
            bio
            locationName
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
            hasSkippedOnboarding
            bio
            locationName
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
            hasSkippedOnboarding
            bio
            locationName
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
        locationName
        allowLocationSharing
      }
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    userProfile {
      isOnboardingCompleted
      bio
      locationName
    }
  }
`;

// Events
export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      ok
      event {
        ...EventInfo
      }
    }
  }
  ${EVENT_FRAGMENT}
`;

export const GET_EVENTS = gql`
  query GetEvents(
    $search: String
    $category: [ID]
    $latitude: Float
    $longitude: Float
    $radiusKm: Float
    $offset: Int
    $limit: Int
  ) {
    events(
      search: $search
      category: $category
      latitude: $latitude
      longitude: $longitude
      radiusKm: $radiusKm
      offset: $offset
      limit: $limit
    ) {
      ok
      events {
        ...EventInfo
      }
    }
  }
  ${EVENT_FRAGMENT}
`;

export const GET_SAVED_EVENTS = gql`
  query GetSavedEvents($offset: Int, $limit: Int) {
    savedEvents(offset: $offset, limit: $limit) {
      ok
      events {
        ...EventInfo
      }
    }
  }
  ${EVENT_FRAGMENT}
`;

export const SAVE_EVENT = gql`
  mutation SaveEvent($id: ID!) {
    saveEvent(id: $id) {
      ok
      event {
        ...EventInfo
      }
      errors
    }
  }
  ${EVENT_FRAGMENT}
`;

export const UNSAVE_EVENT = gql`
  mutation UnsaveEvent($id: ID!) {
    unsaveEvent(id: $id) {
      ok
      event {
        ...EventInfo
      }
      errors
    }
  }
  ${EVENT_FRAGMENT}
`;

export const ENABLE_LOCATION = gql`
  mutation EnableLocation($locationName: String!, $location: [Float]!) {
    enableLocation(locationName: $locationName, location: $location) {
      ok
      user {
        id
        profile {
          locationName
          allowLocationSharing
          coordinates
          hasLocation
        }
      }
    }
  }
`;

export const DISABLE_LOCATION = gql`
  mutation DisableLocation {
    disableLocation {
      ok
      user {
        id
        profile {
          locationName
          allowLocationSharing
          coordinates
          hasLocation
        }
      }
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

// Plans queries
export const GET_UPCOMING_PLANS = gql`
  query GetUpcomingPlans($offset: Int, $limit: Int) {
    upcomingPlans(offset: $offset, limit: $limit) {
      ok
      events {
        ...EventInfo
      }
    }
  }
  ${EVENT_FRAGMENT}
`;

export const GET_PAST_PLANS = gql`
  query GetPastPlans($offset: Int, $limit: Int) {
    pastPlans(offset: $offset, limit: $limit) {
      ok
      events {
        ...EventInfo
      }
    }
  }
  ${EVENT_FRAGMENT}
`;

// Going mutations
export const MARK_GOING = gql`
  mutation MarkGoing($id: ID!) {
    markGoing(id: $id) {
      ok
      event {
        ...EventInfo
      }
      errors
    }
  }
  ${EVENT_FRAGMENT}
`;

export const UNMARK_GOING = gql`
  mutation UnmarkGoing($id: ID!) {
    unmarkGoing(id: $id) {
      ok
      event {
        ...EventInfo
      }
      errors
    }
  }
  ${EVENT_FRAGMENT}
`;
