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

/** Standard auth response */
export type AuthPayloadType = {
  __typename?: 'AuthPayloadType';
  accessToken: Scalars['String']['output'];
  expiresIn?: Maybe<Scalars['Int']['output']>;
  refreshToken: Scalars['String']['output'];
  sessionToken: Scalars['String']['output'];
  user: UserType;
};

/** Complete onboarding mutation */
export type CompleteOnboarding = {
  __typename?: 'CompleteOnboarding';
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Google sign in mutation - handles both sign up and sign in */
export type GoogleSignIn = {
  __typename?: 'GoogleSignIn';
  authPayload?: Maybe<AuthPayloadType>;
  ok?: Maybe<Scalars['Boolean']['output']>;
};

/** Interest GraphQL type */
export type InterestType = {
  __typename?: 'InterestType';
  description: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
};

/** Root Mutation combining all app mutations */
export type Mutation = {
  __typename?: 'Mutation';
  /** Complete onboarding mutation */
  completeOnboarding?: Maybe<CompleteOnboarding>;
  /** Google sign in mutation - handles both sign up and sign in */
  googleSignIn?: Maybe<GoogleSignIn>;
  /** Get new access token using refresh token */
  refreshAccessToken?: Maybe<RefreshAccessToken>;
  /** Sign in mutation */
  signIn?: Maybe<SignIn>;
  /** Sign out mutation - revokes only the current session/device */
  signOut?: Maybe<SignOut>;
  /** Sign out from ALL devices - useful for security (password change, account compromise) */
  signOutAll?: Maybe<SignOutAll>;
  /** Sign up mutation */
  signUp?: Maybe<SignUp>;
};


/** Root Mutation combining all app mutations */
export type MutationCompleteOnboardingArgs = {
  bio?: InputMaybe<Scalars['String']['input']>;
  interests?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  location?: InputMaybe<Scalars['String']['input']>;
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

/** Root Query combining all app queries */
export type Query = {
  __typename?: 'Query';
  /** API health check */
  health?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserType>;
  userProfile?: Maybe<UserProfileType>;
};

/** Get new access token using refresh token */
export type RefreshAccessToken = {
  __typename?: 'RefreshAccessToken';
  accessToken?: Maybe<Scalars['String']['output']>;
  expiresIn?: Maybe<Scalars['Int']['output']>;
  ok?: Maybe<Scalars['Boolean']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
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
  /** Latitude coordinate */
  homeLatitude?: Maybe<Scalars['Decimal']['output']>;
  /** Longitude coordinate */
  homeLongitude?: Maybe<Scalars['Decimal']['output']>;
  interests?: Maybe<Array<Maybe<InterestType>>>;
  isOnboardingCompleted: Scalars['Boolean']['output'];
  isPremium?: Maybe<Scalars['Boolean']['output']>;
  isProfilePublic: Scalars['Boolean']['output'];
  lastActiveAt?: Maybe<Scalars['DateTime']['output']>;
  lastBillingDate?: Maybe<Scalars['DateTime']['output']>;
  /** City, State/Country display name */
  location: Scalars['String']['output'];
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

export type SignInMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn?: { __typename?: 'SignIn', ok?: boolean | null, authPayload?: { __typename?: 'AuthPayloadType', accessToken: string, sessionToken: string, refreshToken: string, expiresIn?: number | null, user: { __typename?: 'UserType', id: string, email: string, firstName: string, lastName?: string | null, profilePicture?: string | null, isEmailVerified: boolean, authProvider: UsersUserAuthProviderChoices, profile?: { __typename?: 'UserProfileType', isOnboardingCompleted: boolean, bio: string, location: string } | null } } | null } | null };

export type SignUpMutationVariables = Exact<{
  firstName: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp?: { __typename?: 'SignUp', ok?: boolean | null, authPayload?: { __typename?: 'AuthPayloadType', accessToken: string, sessionToken: string, refreshToken: string, expiresIn?: number | null, user: { __typename?: 'UserType', id: string, email: string, firstName: string, lastName?: string | null, profilePicture?: string | null, isEmailVerified: boolean, authProvider: UsersUserAuthProviderChoices, profile?: { __typename?: 'UserProfileType', isOnboardingCompleted: boolean, bio: string, location: string } | null } } | null } | null };

export type GoogleSignInMutationVariables = Exact<{
  idToken: Scalars['String']['input'];
}>;


export type GoogleSignInMutation = { __typename?: 'Mutation', googleSignIn?: { __typename?: 'GoogleSignIn', ok?: boolean | null, authPayload?: { __typename?: 'AuthPayloadType', accessToken: string, sessionToken: string, refreshToken: string, expiresIn?: number | null, user: { __typename?: 'UserType', id: string, email: string, firstName: string, lastName?: string | null, profilePicture?: string | null, isEmailVerified: boolean, authProvider: UsersUserAuthProviderChoices, profile?: { __typename?: 'UserProfileType', isOnboardingCompleted: boolean, bio: string, location: string } | null } } | null } | null };

export type SignOutMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type SignOutMutation = { __typename?: 'Mutation', signOut?: { __typename?: 'SignOut', ok?: boolean | null } | null };

export type RefreshAccessTokenMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshAccessTokenMutation = { __typename?: 'Mutation', refreshAccessToken?: { __typename?: 'RefreshAccessToken', ok?: boolean | null, accessToken?: string | null, refreshToken?: string | null, expiresIn?: number | null } | null };

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'UserType', id: string, email: string, firstName: string, lastName?: string | null, profilePicture?: string | null, isEmailVerified: boolean, authProvider: UsersUserAuthProviderChoices, profile?: { __typename?: 'UserProfileType', isOnboardingCompleted: boolean, bio: string, location: string } | null } | null };

export type GetUserProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserProfileQuery = { __typename?: 'Query', userProfile?: { __typename?: 'UserProfileType', isOnboardingCompleted: boolean, bio: string, location: string } | null };


export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"authPayload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"sessionToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}},{"kind":"Field","name":{"kind":"Name","value":"isEmailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"authProvider"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isOnboardingCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"authPayload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"sessionToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}},{"kind":"Field","name":{"kind":"Name","value":"isEmailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"authProvider"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isOnboardingCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const GoogleSignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GoogleSignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"googleSignIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"authPayload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"sessionToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}},{"kind":"Field","name":{"kind":"Name","value":"isEmailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"authProvider"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isOnboardingCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GoogleSignInMutation, GoogleSignInMutationVariables>;
export const SignOutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignOut"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signOut"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<SignOutMutation, SignOutMutationVariables>;
export const RefreshAccessTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshAccessToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshAccessToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}}]}}]}}]} as unknown as DocumentNode<RefreshAccessTokenMutation, RefreshAccessTokenMutationVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"}},{"kind":"Field","name":{"kind":"Name","value":"isEmailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"authProvider"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isOnboardingCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const GetUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isOnboardingCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]} as unknown as DocumentNode<GetUserProfileQuery, GetUserProfileQueryVariables>;