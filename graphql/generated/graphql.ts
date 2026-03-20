/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /**
   * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Date: { input: string; output: string; }
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: { input: string; output: string; }
  /** The `Decimal` scalar type represents a python Decimal. */
  Decimal: { input: number; output: number; }
  /**
   * Leverages the internal Python implementation of UUID (uuid.UUID) to provide native UUID objects
   * in fields, resolvers and input.
   */
  UUID: { input: string; output: string; }
};

/** Add bucket category mutation */
export type AddBucketCategory = {
  __typename?: 'AddBucketCategory';
  category?: Maybe<CategoryType>;
};

/** Add bucket item mutation */
export type AddBucketItem = {
  __typename?: 'AddBucketItem';
  bucketItem?: Maybe<BucketItemType>;
};

/** Standard auth response */
export type AuthPayloadType = {
  __typename?: 'AuthPayloadType';
  accessToken: Scalars['String']['output'];
  expiresIn?: Maybe<Scalars['Int']['output']>;
  refreshToken: Scalars['String']['output'];
  sessionToken: Scalars['String']['output'];
  user: UserType;
};

/** GraphQL BucketItem type */
export type BucketItemType = {
  __typename?: 'BucketItemType';
  amount?: Maybe<Scalars['Float']['output']>;
  category?: Maybe<CategoryType>;
  categoryId?: Maybe<Scalars['String']['output']>;
  completed?: Maybe<Scalars['Boolean']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  difficulty: BucketsBucketItemDifficultyChoices;
  estimatedCost?: Maybe<Scalars['Decimal']['output']>;
  id: Scalars['UUID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isCompleted: Scalars['Boolean']['output'];
  locationName: Scalars['String']['output'];
  priority: BucketsBucketItemPriorityChoices;
  progressPercentage: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** An enumeration. */
export enum BucketsBucketItemDifficultyChoices {
  /** Challenging */
  Challenging = 'CHALLENGING',
  /** Easy */
  Easy = 'EASY',
  /** Extreme */
  Extreme = 'EXTREME',
  /** Moderate */
  Moderate = 'MODERATE'
}

/** An enumeration. */
export enum BucketsBucketItemPriorityChoices {
  /** High */
  High = 'HIGH',
  /** Low */
  Low = 'LOW',
  /** Medium */
  Medium = 'MEDIUM',
  /** Urgent */
  Urgent = 'URGENT'
}

export type CategoryType = {
  __typename?: 'CategoryType';
  bucketItems: Array<BucketItemType>;
  color: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  events: Array<EventType>;
  icon: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  interests: Array<InterestType>;
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  recommendations: Array<RecommendationType>;
  sortOrder: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Complete onboarding mutation */
export type CompleteOnboarding = {
  __typename?: 'CompleteOnboarding';
  ok?: Maybe<Scalars['Boolean']['output']>;
  user?: Maybe<UserType>;
};

/** GraphQL Destination type */
export type DestinationType = {
  __typename?: 'DestinationType';
  daysAway?: Maybe<Scalars['Int']['output']>;
  location?: Maybe<Scalars['String']['output']>;
};

/** Response payload for single event queries. */
export type EventPayload = {
  __typename?: 'EventPayload';
  event?: Maybe<EventType>;
  ok: Scalars['Boolean']['output'];
};

/** Event GraphQL type */
export type EventType = {
  __typename?: 'EventType';
  category: Array<CategoryType>;
  coordinates?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isFree: Scalars['Boolean']['output'];
  isSaved?: Maybe<Scalars['Boolean']['output']>;
  locationName?: Maybe<Scalars['String']['output']>;
  moreDetailsUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  timezone?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

/** Response payload for paginated event list queries. */
export type EventsListPayload = {
  __typename?: 'EventsListPayload';
  events: Array<EventType>;
  ok: Scalars['Boolean']['output'];
};

/** Google sign in mutation - handles both sign up and sign in */
export type GoogleSignIn = {
  __typename?: 'GoogleSignIn';
  authPayload?: Maybe<AuthPayloadType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** GraphQL HomeData type */
export type HomeDataType = {
  __typename?: 'HomeDataType';
  categories?: Maybe<Array<Maybe<CategoryType>>>;
  greeting?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  insights?: Maybe<InsightsDataType>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  recommendations?: Maybe<Array<Maybe<RecommendationType>>>;
  timeOfDay?: Maybe<Scalars['String']['output']>;
  upcoming?: Maybe<Array<Maybe<BucketItemType>>>;
  userLocation?: Maybe<Scalars['String']['output']>;
  weather?: Maybe<WeatherType>;
};

/** GraphQL InsightsData type */
export type InsightsDataType = {
  __typename?: 'InsightsDataType';
  id?: Maybe<Scalars['String']['output']>;
  nextDestination?: Maybe<DestinationType>;
  progress?: Maybe<ProgressType>;
  recentAchievement?: Maybe<Scalars['String']['output']>;
  weather?: Maybe<WeatherType>;
};

/** Interest GraphQL type */
export type InterestType = {
  __typename?: 'InterestType';
  category?: Maybe<CategoryType>;
  description: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
};

/** Root Mutation combining all app mutations */
export type Mutation = {
  __typename?: 'Mutation';
  /** Add bucket category mutation */
  addBucketCategory?: Maybe<AddBucketCategory>;
  /** Add bucket item mutation */
  addBucketItem?: Maybe<AddBucketItem>;
  /** Complete onboarding mutation */
  completeOnboarding?: Maybe<CompleteOnboarding>;
  /** Google sign in mutation - handles both sign up and sign in */
  googleSignIn?: Maybe<GoogleSignIn>;
  /** Get new access token using refresh token */
  refreshAccessToken?: Maybe<RefreshAccessToken>;
  /** Allow a user to save an event to their profile for later reference. */
  saveEvent?: Maybe<SaveEventPayload>;
  /** Sign in mutation */
  signIn?: Maybe<SignIn>;
  /** Sign out mutation - revokes only the current session/device */
  signOut?: Maybe<SignOut>;
  /** Sign out from ALL devices - useful for security (password change, account compromise) */
  signOutAll?: Maybe<SignOutAll>;
  /** Sign up mutation */
  signUp?: Maybe<SignUp>;
  /** Skip onboarding mutation */
  skipOnboarding?: Maybe<SkipOnboarding>;
  /** Remove an event from the user's saved list. */
  unsaveEvent?: Maybe<SaveEventPayload>;
};


/** Root Mutation combining all app mutations */
export type MutationAddBucketCategoryArgs = {
  emoji?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};


/** Root Mutation combining all app mutations */
export type MutationAddBucketItemArgs = {
  categoryId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  estimatedCost?: InputMaybe<Scalars['Float']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};


/** Root Mutation combining all app mutations */
export type MutationCompleteOnboardingArgs = {
  allowEmailNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  allowLocationSharing?: InputMaybe<Scalars['Boolean']['input']>;
  allowPushNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  interests?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  location?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  locationName?: InputMaybe<Scalars['String']['input']>;
};


/** Root Mutation combining all app mutations */
export type MutationGoogleSignInArgs = {
  idToken: Scalars['String']['input'];
};


/** Root Mutation combining all app mutations */
export type MutationRefreshAccessTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


/** Root Mutation combining all app mutations */
export type MutationSaveEventArgs = {
  id: Scalars['ID']['input'];
};


/** Root Mutation combining all app mutations */
export type MutationSignInArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


/** Root Mutation combining all app mutations */
export type MutationSignOutArgs = {
  refreshToken: Scalars['String']['input'];
};


/** Root Mutation combining all app mutations */
export type MutationSignOutAllArgs = {
  refreshToken: Scalars['String']['input'];
};


/** Root Mutation combining all app mutations */
export type MutationSignUpArgs = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};


/** Root Mutation combining all app mutations */
export type MutationUnsaveEventArgs = {
  id: Scalars['ID']['input'];
};

/** GraphQL Progress type */
export type ProgressType = {
  __typename?: 'ProgressType';
  completed?: Maybe<Scalars['Int']['output']>;
  percentage?: Maybe<Scalars['Int']['output']>;
  remaining?: Maybe<Scalars['Int']['output']>;
  yearlyGoal?: Maybe<Scalars['Int']['output']>;
};

/** Root Query combining all app queries */
export type Query = {
  __typename?: 'Query';
  event?: Maybe<EventPayload>;
  events?: Maybe<EventsListPayload>;
  getBucketCategories?: Maybe<Array<Maybe<CategoryType>>>;
  getBucketItems?: Maybe<Array<Maybe<BucketItemType>>>;
  getHome?: Maybe<HomeDataType>;
  getRecommendations?: Maybe<Array<Maybe<RecommendationType>>>;
  /** API health check */
  health?: Maybe<Scalars['String']['output']>;
  savedEvents?: Maybe<EventsListPayload>;
  user?: Maybe<UserType>;
  userProfile?: Maybe<UserProfileType>;
};


/** Root Query combining all app queries */
export type QueryEventArgs = {
  id: Scalars['ID']['input'];
};


/** Root Query combining all app queries */
export type QueryEventsArgs = {
  category?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  isFree?: InputMaybe<Scalars['Boolean']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  radiusKm?: InputMaybe<Scalars['Float']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


/** Root Query combining all app queries */
export type QueryGetBucketItemsArgs = {
  categoryId?: InputMaybe<Scalars['String']['input']>;
};


/** Root Query combining all app queries */
export type QueryGetHomeArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Root Query combining all app queries */
export type QueryGetRecommendationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Root Query combining all app queries */
export type QuerySavedEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** GraphQL Recommendation type */
export type RecommendationType = {
  __typename?: 'RecommendationType';
  amount?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  date?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  estimatedCost?: Maybe<Scalars['Decimal']['output']>;
  id: Scalars['UUID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  locationName: Scalars['String']['output'];
  rating?: Maybe<Scalars['Float']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  recommendationType: RecommendationsRecommendationRecommendationTypeChoices;
  source?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

/** An enumeration. */
export enum RecommendationsRecommendationRecommendationTypeChoices {
  /** Activity */
  Activity = 'ACTIVITY',
  /** Destination */
  Destination = 'DESTINATION',
  /** Event */
  Event = 'EVENT',
  /** Experience */
  Experience = 'EXPERIENCE'
}

/** Get new access token using refresh token */
export type RefreshAccessToken = {
  __typename?: 'RefreshAccessToken';
  accessToken?: Maybe<Scalars['String']['output']>;
  expiresIn?: Maybe<Scalars['Int']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
};

/** Response payload for save/unsave event mutations. */
export type SaveEventPayload = {
  __typename?: 'SaveEventPayload';
  errors?: Maybe<Array<Scalars['String']['output']>>;
  event?: Maybe<EventType>;
  ok: Scalars['Boolean']['output'];
};

/** Sign in mutation */
export type SignIn = {
  __typename?: 'SignIn';
  authPayload?: Maybe<AuthPayloadType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Sign out mutation - revokes only the current session/device */
export type SignOut = {
  __typename?: 'SignOut';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Sign out from ALL devices - useful for security (password change, account compromise) */
export type SignOutAll = {
  __typename?: 'SignOutAll';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Sign up mutation */
export type SignUp = {
  __typename?: 'SignUp';
  authPayload?: Maybe<AuthPayloadType>;
  errors?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  ok?: Maybe<Scalars['Boolean']['output']>;
  requiresVerification?: Maybe<Scalars['Boolean']['output']>;
  userExists?: Maybe<Scalars['Boolean']['output']>;
};

/** Skip onboarding mutation */
export type SkipOnboarding = {
  __typename?: 'SkipOnboarding';
  ok?: Maybe<Scalars['Boolean']['output']>;
  user?: Maybe<UserType>;
};

/** User profile GraphQL type */
export type UserProfileType = {
  __typename?: 'UserProfileType';
  allowEmailNotifications: Scalars['Boolean']['output'];
  allowPushNotifications: Scalars['Boolean']['output'];
  bio: Scalars['String']['output'];
  birthDate?: Maybe<Scalars['Date']['output']>;
  calendarIntegrated: Scalars['Boolean']['output'];
  calendarLastSyncedAt?: Maybe<Scalars['DateTime']['output']>;
  calendarProvider: UsersUserProfileCalendarProviderChoices;
  coordinates?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  createdAt: Scalars['DateTime']['output'];
  hasLocation?: Maybe<Scalars['Boolean']['output']>;
  hasSkippedOnboarding: Scalars['Boolean']['output'];
  interests?: Maybe<Array<Maybe<InterestType>>>;
  isOnboardingCompleted: Scalars['Boolean']['output'];
  isPremium?: Maybe<Scalars['Boolean']['output']>;
  isProfilePublic: Scalars['Boolean']['output'];
  lastActiveAt?: Maybe<Scalars['DateTime']['output']>;
  lastBillingDate?: Maybe<Scalars['DateTime']['output']>;
  /** City, State/Country display name */
  locationName: Scalars['String']['output'];
  loginCount: Scalars['Int']['output'];
  paymentPlan: UsersUserProfilePaymentPlanChoices;
  phoneNumber: Scalars['String']['output'];
  /** Default search radius for nearby events in kilometers */
  searchRadiusKm: Scalars['Int']['output'];
  subscriptionExpiresAt?: Maybe<Scalars['DateTime']['output']>;
  theme: UsersUserProfileThemeChoices;
  timezone: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** User session GraphQL type */
export type UserSessionType = {
  __typename?: 'UserSessionType';
  createdAt: Scalars['DateTime']['output'];
  deviceInfo: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  ipAddress: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  lastActiveAt: Scalars['DateTime']['output'];
  sessionToken: Scalars['String']['output'];
};

/** User GraphQL type */
export type UserType = {
  __typename?: 'UserType';
  activeSessions?: Maybe<Array<Maybe<UserSessionType>>>;
  authProvider: UsersUserAuthProviderChoices;
  dateJoined: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  fullName?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  isActive: Scalars['Boolean']['output'];
  isEmailVerified: Scalars['Boolean']['output'];
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  profile?: Maybe<UserProfileType>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  sessionCount?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']['output'];
};

/** An enumeration. */
export enum UsersUserAuthProviderChoices {
  /** Email */
  Email = 'EMAIL',
  /** Google SSO */
  Google = 'GOOGLE'
}

/** An enumeration. */
export enum UsersUserProfileCalendarProviderChoices {
  /** Apple Calendar */
  AppleCalendar = 'APPLE_CALENDAR',
  /** Google Calendar */
  GoogleCalendar = 'GOOGLE_CALENDAR',
  /** None */
  None = 'NONE',
  /** Microsoft Outlook */
  Outlook = 'OUTLOOK'
}

/** An enumeration. */
export enum UsersUserProfilePaymentPlanChoices {
  /** Basic */
  Basic = 'BASIC',
  /** Free */
  Free = 'FREE',
  /** Premium */
  Premium = 'PREMIUM'
}

/** An enumeration. */
export enum UsersUserProfileThemeChoices {
  /** Auto */
  Auto = 'AUTO',
  /** Dark */
  Dark = 'DARK',
  /** Light */
  Light = 'LIGHT'
}

/** GraphQL Weather type */
export type WeatherType = {
  __typename?: 'WeatherType';
  city?: Maybe<Scalars['String']['output']>;
  condition?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
};

export type WeatherInfoFragment = { __typename?: 'WeatherType', city?: string | null, condition?: string | null, temperature?: number | null, icon?: string | null };

export type DestinationInfoFragment = { __typename?: 'DestinationType', location?: string | null, daysAway?: number | null };

export type ProgressInfoFragment = { __typename?: 'ProgressType', completed?: number | null, yearlyGoal?: number | null, percentage?: number | null };

export type CategoryInfoFragment = { __typename?: 'CategoryType', id: string, name: string, icon: string, color: string };

export type RecommendationInfoFragment = { __typename?: 'RecommendationType', id: string, image?: string | null, title: string, date?: string | null, locationName: string, reason?: string | null, source?: string | null };

export type BucketItemInfoFragment = { __typename?: 'BucketItemType', id: string, title: string, description: string, image?: string | null, completed?: boolean | null, categoryId?: string | null, category?: { __typename?: 'CategoryType', id: string, name: string, icon: string, color: string } | null };

export type InsightsInfoFragment = { __typename?: 'InsightsDataType', id?: string | null, recentAchievement?: string | null, weather?: { __typename?: 'WeatherType', city?: string | null, condition?: string | null, temperature?: number | null, icon?: string | null } | null, nextDestination?: { __typename?: 'DestinationType', location?: string | null, daysAway?: number | null } | null, progress?: { __typename?: 'ProgressType', completed?: number | null, yearlyGoal?: number | null, percentage?: number | null } | null };

export type UserBasicFragment = { __typename?: 'UserType', id: string, email: string, firstName: string, lastName?: string | null, fullName?: string | null, profilePicture?: string | null };

export type AuthUserFragment = { __typename?: 'UserType', isEmailVerified: boolean, authProvider: UsersUserAuthProviderChoices, id: string, email: string, firstName: string, lastName?: string | null, fullName?: string | null, profilePicture?: string | null, profile?: { __typename?: 'UserProfileType', isOnboardingCompleted: boolean, hasSkippedOnboarding: boolean, isPremium?: boolean | null } | null };

export type EventInfoFragment = { __typename?: 'EventType', id: string, name: string, description?: string | null, image?: string | null, date: string, endDate?: string | null, locationName?: string | null, isFree: boolean, isSaved?: boolean | null, category: Array<{ __typename?: 'CategoryType', id: string, name: string, icon: string, color: string }> };

export type AuthPayloadFieldsFragment = { __typename?: 'AuthPayloadType', accessToken: string, sessionToken: string, refreshToken: string, expiresIn?: number | null, user: { __typename?: 'UserType', isEmailVerified: boolean, authProvider: UsersUserAuthProviderChoices, id: string, email: string, firstName: string, lastName?: string | null, fullName?: string | null, profilePicture?: string | null, profile?: { __typename?: 'UserProfileType', isOnboardingCompleted: boolean, hasSkippedOnboarding: boolean, isPremium?: boolean | null } | null } };

export type FullProfileFragment = { __typename?: 'UserProfileType', bio: string, locationName: string, coordinates?: Array<number | null> | null, hasLocation?: boolean | null, searchRadiusKm: number, timezone: string, birthDate?: string | null, phoneNumber: string, isOnboardingCompleted: boolean, hasSkippedOnboarding: boolean, isProfilePublic: boolean, allowEmailNotifications: boolean, allowPushNotifications: boolean, calendarIntegrated: boolean, calendarProvider: UsersUserProfileCalendarProviderChoices, paymentPlan: UsersUserProfilePaymentPlanChoices, isPremium?: boolean | null, subscriptionExpiresAt?: string | null, theme: UsersUserProfileThemeChoices, lastActiveAt?: string | null, loginCount: number, interests?: Array<{ __typename?: 'InterestType', id: string, name: string, icon?: string | null } | null> | null };

export type CompleteOnboardingMutationVariables = Exact<{
  allowLocationSharing?: InputMaybe<Scalars['Boolean']['input']>;
  locationName?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>> | InputMaybe<Scalars['Float']['input']>>;
  allowPushNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  allowEmailNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  interests?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
}>;


export type CompleteOnboardingMutation = { __typename?: 'Mutation', completeOnboarding?: { __typename?: 'CompleteOnboarding', ok?: boolean | null, user?: { __typename?: 'UserType', id: string, email: string, firstName: string, lastName?: string | null, fullName?: string | null, isEmailVerified: boolean, authProvider: UsersUserAuthProviderChoices, profile?: { __typename?: 'UserProfileType', isOnboardingCompleted: boolean } | null } | null } | null };

export type GetHomeQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetHomeQuery = { __typename?: 'Query', getHome?: { __typename?: 'HomeDataType', id?: string | null, greeting?: string | null, timeOfDay?: string | null, profilePicture?: string | null, userLocation?: string | null, weather?: { __typename?: 'WeatherType', city?: string | null, condition?: string | null, temperature?: number | null, icon?: string | null } | null, insights?: { __typename?: 'InsightsDataType', id?: string | null, recentAchievement?: string | null, weather?: { __typename?: 'WeatherType', city?: string | null, condition?: string | null, temperature?: number | null, icon?: string | null } | null, nextDestination?: { __typename?: 'DestinationType', location?: string | null, daysAway?: number | null } | null, progress?: { __typename?: 'ProgressType', completed?: number | null, yearlyGoal?: number | null, percentage?: number | null } | null } | null, categories?: Array<{ __typename?: 'CategoryType', id: string, name: string, icon: string, color: string } | null> | null, recommendations?: Array<{ __typename?: 'RecommendationType', id: string, image?: string | null, title: string, date?: string | null, locationName: string, reason?: string | null, source?: string | null } | null> | null, upcoming?: Array<{ __typename?: 'BucketItemType', id: string, title: string, description: string, image?: string | null, completed?: boolean | null, categoryId?: string | null, category?: { __typename?: 'CategoryType', id: string, name: string, icon: string, color: string } | null } | null> | null } | null };

export type AddBucketCategoryMutationVariables = Exact<{
  name: Scalars['String']['input'];
  emoji?: InputMaybe<Scalars['String']['input']>;
}>;


export type AddBucketCategoryMutation = { __typename?: 'Mutation', addBucketCategory?: { __typename?: 'AddBucketCategory', category?: { __typename?: 'CategoryType', id: string, name: string, icon: string, color: string } | null } | null };

export type AddBucketItemMutationVariables = Exact<{
  title: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  estimatedCost?: InputMaybe<Scalars['Float']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
}>;


export type AddBucketItemMutation = { __typename?: 'Mutation', addBucketItem?: { __typename?: 'AddBucketItem', bucketItem?: { __typename?: 'BucketItemType', id: string, title: string, description: string, amount?: number | null, image?: string | null, completed?: boolean | null, categoryId?: string | null, category?: { __typename?: 'CategoryType', id: string, name: string, icon: string, color: string } | null } | null } | null };

export type GetBucketCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBucketCategoriesQuery = { __typename?: 'Query', getBucketCategories?: Array<{ __typename?: 'CategoryType', id: string, name: string, icon: string, color: string } | null> | null };

export type GetBucketItemsQueryVariables = Exact<{
  categoryId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetBucketItemsQuery = { __typename?: 'Query', getBucketItems?: Array<{ __typename?: 'BucketItemType', id: string, title: string, description: string, image?: string | null, completed?: boolean | null, categoryId?: string | null, category?: { __typename?: 'CategoryType', id: string, name: string, icon: string, color: string } | null } | null> | null };

export type SignInMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn?: { __typename?: 'SignIn', ok?: boolean | null, authPayload?: { __typename?: 'AuthPayloadType', accessToken: string, sessionToken: string, refreshToken: string, expiresIn?: number | null, user: { __typename?: 'UserType', id: string, email: string, firstName: string, lastName?: string | null, profilePicture?: string | null, isEmailVerified: boolean, authProvider: UsersUserAuthProviderChoices, profile?: { __typename?: 'UserProfileType', isOnboardingCompleted: boolean, bio: string, locationName: string } | null } } | null } | null };

export type SignUpMutationVariables = Exact<{
  firstName: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp?: { __typename?: 'SignUp', ok?: boolean | null, authPayload?: { __typename?: 'AuthPayloadType', accessToken: string, sessionToken: string, refreshToken: string, expiresIn?: number | null, user: { __typename?: 'UserType', id: string, email: string, firstName: string, lastName?: string | null, profilePicture?: string | null, isEmailVerified: boolean, authProvider: UsersUserAuthProviderChoices, profile?: { __typename?: 'UserProfileType', isOnboardingCompleted: boolean, bio: string, locationName: string } | null } } | null } | null };

export type GoogleSignInMutationVariables = Exact<{
  idToken: Scalars['String']['input'];
}>;


export type GoogleSignInMutation = { __typename?: 'Mutation', googleSignIn?: { __typename?: 'GoogleSignIn', ok?: boolean | null, authPayload?: { __typename?: 'AuthPayloadType', accessToken: string, sessionToken: string, refreshToken: string, expiresIn?: number | null, user: { __typename?: 'UserType', id: string, email: string, firstName: string, lastName?: string | null, profilePicture?: string | null, isEmailVerified: boolean, authProvider: UsersUserAuthProviderChoices, profile?: { __typename?: 'UserProfileType', isOnboardingCompleted: boolean, bio: string, locationName: string } | null } } | null } | null };

export type SignOutMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type SignOutMutation = { __typename?: 'Mutation', signOut?: { __typename?: 'SignOut', ok?: boolean | null } | null };

export type RefreshAccessTokenMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshAccessTokenMutation = { __typename?: 'Mutation', refreshAccessToken?: { __typename?: 'RefreshAccessToken', ok?: boolean | null, accessToken?: string | null, refreshToken?: string | null, expiresIn?: number | null } | null };

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'UserType', id: string, email: string, firstName: string, lastName?: string | null, profilePicture?: string | null, isEmailVerified: boolean, authProvider: UsersUserAuthProviderChoices, profile?: { __typename?: 'UserProfileType', isOnboardingCompleted: boolean, hasSkippedOnboarding: boolean, bio: string, locationName: string } | null } | null };

export type GetUserProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserProfileQuery = { __typename?: 'Query', userProfile?: { __typename?: 'UserProfileType', isOnboardingCompleted: boolean, bio: string, locationName: string } | null };

export type GetEventsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>> | InputMaybe<Scalars['ID']['input']>>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetEventsQuery = { __typename?: 'Query', events?: { __typename?: 'EventsListPayload', ok: boolean, events: Array<{ __typename?: 'EventType', id: string, name: string, description?: string | null, image?: string | null, date: string, endDate?: string | null, locationName?: string | null, isFree: boolean, isSaved?: boolean | null, category: Array<{ __typename?: 'CategoryType', id: string, name: string, icon: string, color: string }> }> } | null };

export type GetSavedEventsQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetSavedEventsQuery = { __typename?: 'Query', savedEvents?: { __typename?: 'EventsListPayload', ok: boolean, events: Array<{ __typename?: 'EventType', id: string, name: string, description?: string | null, image?: string | null, date: string, endDate?: string | null, locationName?: string | null, isFree: boolean, isSaved?: boolean | null, category: Array<{ __typename?: 'CategoryType', id: string, name: string, icon: string, color: string }> }> } | null };

export type SaveEventMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SaveEventMutation = { __typename?: 'Mutation', saveEvent?: { __typename?: 'SaveEventPayload', ok: boolean, errors?: Array<string> | null, event?: { __typename?: 'EventType', id: string, name: string, description?: string | null, image?: string | null, date: string, endDate?: string | null, locationName?: string | null, isFree: boolean, isSaved?: boolean | null, category: Array<{ __typename?: 'CategoryType', id: string, name: string, icon: string, color: string }> } | null } | null };

export type UnsaveEventMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UnsaveEventMutation = { __typename?: 'Mutation', unsaveEvent?: { __typename?: 'SaveEventPayload', ok: boolean, errors?: Array<string> | null, event?: { __typename?: 'EventType', id: string, name: string, description?: string | null, image?: string | null, date: string, endDate?: string | null, locationName?: string | null, isFree: boolean, isSaved?: boolean | null, category: Array<{ __typename?: 'CategoryType', id: string, name: string, icon: string, color: string }> } | null } | null };

export type SkipOnboardingMutationVariables = Exact<{ [key: string]: never; }>;


export type SkipOnboardingMutation = { __typename?: 'Mutation', skipOnboarding?: { __typename?: 'SkipOnboarding', ok?: boolean | null, user?: { __typename?: 'UserType', isEmailVerified: boolean, authProvider: UsersUserAuthProviderChoices, id: string, email: string, firstName: string, lastName?: string | null, fullName?: string | null, profilePicture?: string | null, profile?: { __typename?: 'UserProfileType', isOnboardingCompleted: boolean, hasSkippedOnboarding: boolean, isPremium?: boolean | null } | null } | null } | null };

export const RecommendationInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecommendationInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecommendationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]} as unknown as DocumentNode<RecommendationInfoFragment, unknown>;
export const CategoryInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]} as unknown as DocumentNode<CategoryInfoFragment, unknown>;
export const BucketItemInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BucketItemInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BucketItemType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryInfo"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]} as unknown as DocumentNode<BucketItemInfoFragment, unknown>;
export const WeatherInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WeatherInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WeatherType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]} as unknown as DocumentNode<WeatherInfoFragment, unknown>;
export const DestinationInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DestinationInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DestinationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"daysAway"}}]}}]} as unknown as DocumentNode<DestinationInfoFragment, unknown>;
export const ProgressInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgressInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProgressType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"yearlyGoal"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}}]}}]} as unknown as DocumentNode<ProgressInfoFragment, unknown>;
export const InsightsInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InsightsInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InsightsDataType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"weather"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WeatherInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextDestination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DestinationInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"progress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgressInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recentAchievement"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WeatherInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WeatherType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DestinationInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DestinationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"daysAway"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgressInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProgressType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"yearlyGoal"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}}]}}]} as unknown as DocumentNode<InsightsInfoFragment, unknown>;
export const EventInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}},{"kind":"Field","name":{"kind":"Name","value":"isFree"}},{"kind":"Field","name":{"kind":"Name","value":"isSaved"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryInfo"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]} as unknown as DocumentNode<EventInfoFragment, unknown>;
export const UserBasicFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]} as unknown as DocumentNode<UserBasicFragment, unknown>;
export const AuthUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserBasic"}},{"kind":"Field","name":{"kind":"Name","value":"isEmailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"authProvider"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isOnboardingCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"hasSkippedOnboarding"}},{"kind":"Field","name":{"kind":"Name","value":"isPremium"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}}]} as unknown as DocumentNode<AuthUserFragment, unknown>;
export const AuthPayloadFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthPayloadFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthPayloadType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"sessionToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserBasic"}},{"kind":"Field","name":{"kind":"Name","value":"isEmailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"authProvider"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isOnboardingCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"hasSkippedOnboarding"}},{"kind":"Field","name":{"kind":"Name","value":"isPremium"}}]}}]}}]} as unknown as DocumentNode<AuthPayloadFieldsFragment, unknown>;
export const FullProfileFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FullProfile"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserProfileType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}},{"kind":"Field","name":{"kind":"Name","value":"coordinates"}},{"kind":"Field","name":{"kind":"Name","value":"hasLocation"}},{"kind":"Field","name":{"kind":"Name","value":"searchRadiusKm"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"interests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isOnboardingCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"hasSkippedOnboarding"}},{"kind":"Field","name":{"kind":"Name","value":"isProfilePublic"}},{"kind":"Field","name":{"kind":"Name","value":"allowEmailNotifications"}},{"kind":"Field","name":{"kind":"Name","value":"allowPushNotifications"}},{"kind":"Field","name":{"kind":"Name","value":"calendarIntegrated"}},{"kind":"Field","name":{"kind":"Name","value":"calendarProvider"}},{"kind":"Field","name":{"kind":"Name","value":"paymentPlan"}},{"kind":"Field","name":{"kind":"Name","value":"isPremium"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionExpiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"lastActiveAt"}},{"kind":"Field","name":{"kind":"Name","value":"loginCount"}}]}}]} as unknown as DocumentNode<FullProfileFragment, unknown>;
export const CompleteOnboardingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CompleteOnboarding"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"allowLocationSharing"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locationName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"allowPushNotifications"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"allowEmailNotifications"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"interests"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completeOnboarding"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"allowLocationSharing"},"value":{"kind":"Variable","name":{"kind":"Name","value":"allowLocationSharing"}}},{"kind":"Argument","name":{"kind":"Name","value":"locationName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locationName"}}},{"kind":"Argument","name":{"kind":"Name","value":"location"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}},{"kind":"Argument","name":{"kind":"Name","value":"allowPushNotifications"},"value":{"kind":"Variable","name":{"kind":"Name","value":"allowPushNotifications"}}},{"kind":"Argument","name":{"kind":"Name","value":"allowEmailNotifications"},"value":{"kind":"Variable","name":{"kind":"Name","value":"allowEmailNotifications"}}},{"kind":"Argument","name":{"kind":"Name","value":"interests"},"value":{"kind":"Variable","name":{"kind":"Name","value":"interests"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"isEmailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"authProvider"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isOnboardingCompleted"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CompleteOnboardingMutation, CompleteOnboardingMutationVariables>;
export const GetHomeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetHome"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getHome"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"greeting"}},{"kind":"Field","name":{"kind":"Name","value":"timeOfDay"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}},{"kind":"Field","name":{"kind":"Name","value":"userLocation"}},{"kind":"Field","name":{"kind":"Name","value":"weather"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WeatherInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"insights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"InsightsInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recommendations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecommendationInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"upcoming"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BucketItemInfo"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WeatherInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WeatherType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"condition"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DestinationInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DestinationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"daysAway"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgressInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProgressType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"yearlyGoal"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InsightsInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InsightsDataType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"weather"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WeatherInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextDestination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DestinationInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"progress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgressInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recentAchievement"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecommendationInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecommendationType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BucketItemInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BucketItemType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryInfo"}}]}}]}}]} as unknown as DocumentNode<GetHomeQuery, GetHomeQueryVariables>;
export const AddBucketCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddBucketCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emoji"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addBucketCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"emoji"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emoji"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]} as unknown as DocumentNode<AddBucketCategoryMutation, AddBucketCategoryMutationVariables>;
export const AddBucketItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddBucketItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"estimatedCost"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addBucketItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"estimatedCost"},"value":{"kind":"Variable","name":{"kind":"Name","value":"estimatedCost"}}},{"kind":"Argument","name":{"kind":"Name","value":"location"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}},{"kind":"Argument","name":{"kind":"Name","value":"categoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bucketItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AddBucketItemMutation, AddBucketItemMutationVariables>;
export const GetBucketCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBucketCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBucketCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryInfo"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]} as unknown as DocumentNode<GetBucketCategoriesQuery, GetBucketCategoriesQueryVariables>;
export const GetBucketItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBucketItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBucketItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"categoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BucketItemInfo"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BucketItemInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BucketItemType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryInfo"}}]}}]}}]} as unknown as DocumentNode<GetBucketItemsQuery, GetBucketItemsQueryVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"authPayload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"sessionToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}},{"kind":"Field","name":{"kind":"Name","value":"isEmailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"authProvider"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isOnboardingCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"authPayload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"sessionToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}},{"kind":"Field","name":{"kind":"Name","value":"isEmailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"authProvider"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isOnboardingCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const GoogleSignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GoogleSignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"googleSignIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"authPayload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"sessionToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}},{"kind":"Field","name":{"kind":"Name","value":"isEmailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"authProvider"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isOnboardingCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GoogleSignInMutation, GoogleSignInMutationVariables>;
export const SignOutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignOut"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signOut"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<SignOutMutation, SignOutMutationVariables>;
export const RefreshAccessTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshAccessToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshAccessToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}}]}}]}}]} as unknown as DocumentNode<RefreshAccessTokenMutation, RefreshAccessTokenMutationVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}},{"kind":"Field","name":{"kind":"Name","value":"isEmailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"authProvider"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isOnboardingCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"hasSkippedOnboarding"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const GetUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isOnboardingCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}}]}}]}}]} as unknown as DocumentNode<GetUserProfileQuery, GetUserProfileQueryVariables>;
export const GetEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventInfo"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}},{"kind":"Field","name":{"kind":"Name","value":"isFree"}},{"kind":"Field","name":{"kind":"Name","value":"isSaved"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryInfo"}}]}}]}}]} as unknown as DocumentNode<GetEventsQuery, GetEventsQueryVariables>;
export const GetSavedEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSavedEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"savedEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventInfo"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}},{"kind":"Field","name":{"kind":"Name","value":"isFree"}},{"kind":"Field","name":{"kind":"Name","value":"isSaved"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryInfo"}}]}}]}}]} as unknown as DocumentNode<GetSavedEventsQuery, GetSavedEventsQueryVariables>;
export const SaveEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}},{"kind":"Field","name":{"kind":"Name","value":"isFree"}},{"kind":"Field","name":{"kind":"Name","value":"isSaved"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryInfo"}}]}}]}}]} as unknown as DocumentNode<SaveEventMutation, SaveEventMutationVariables>;
export const UnsaveEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnsaveEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unsaveEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventInfo"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"locationName"}},{"kind":"Field","name":{"kind":"Name","value":"isFree"}},{"kind":"Field","name":{"kind":"Name","value":"isSaved"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryInfo"}}]}}]}}]} as unknown as DocumentNode<UnsaveEventMutation, UnsaveEventMutationVariables>;
export const SkipOnboardingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SkipOnboarding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"skipOnboarding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthUser"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserType"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserBasic"}},{"kind":"Field","name":{"kind":"Name","value":"isEmailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"authProvider"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isOnboardingCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"hasSkippedOnboarding"}},{"kind":"Field","name":{"kind":"Name","value":"isPremium"}}]}}]}}]} as unknown as DocumentNode<SkipOnboardingMutation, SkipOnboardingMutationVariables>;