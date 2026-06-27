import { gql } from "@apollo/client";

export const WEATHER_FRAGMENT = gql`
  fragment WeatherInfo on WeatherType {
    city
    condition
    temperature
    icon
  }
`;

export const CATEGORY_FRAGMENT = gql`
  fragment CategoryInfo on CategoryType {
    id
    name
    slug
    icon
    color
    description
    isActive
    sortOrder
  }
`;

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

export const EVENT_FRAGMENT = gql`
  fragment EventInfo on EventType {
    id
    name
    description
    image
    date
    endDate
    locationName
    moreDetailsUrl
    price
    ticketingEnabled
    availableTickets
    goingCount
    hasGallery
    galleryImages
    galleryDescription
    seriesName
    isFree
    isExternal
    isInternal
    isSaved
    isGoing
    hasConfirmedTicket
    isEditorsPick
    reason
    source
    curatorNote
    curatorName
    coordinates
    createdAt
    isActive
    status
    updatedAt
    userStatus
    category {
      ...CategoryInfo
    }
  }
  ${CATEGORY_FRAGMENT}
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
    locationName
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
