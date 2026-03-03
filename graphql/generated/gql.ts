/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment WeatherInfo on WeatherType {\n    city\n    condition\n    temperature\n  }\n": typeof types.WeatherInfoFragmentDoc,
    "\n  fragment DestinationInfo on DestinationType {\n    location\n    daysAway\n  }\n": typeof types.DestinationInfoFragmentDoc,
    "\n  fragment ProgressInfo on ProgressType {\n    completed\n    yearlyGoal\n    percentage\n  }\n": typeof types.ProgressInfoFragmentDoc,
    "\n  fragment CategoryInfo on CategoryType {\n    id\n    name\n    icon\n    color\n  }\n": typeof types.CategoryInfoFragmentDoc,
    "\n  fragment RecommendationInfo on RecommendationType {\n    id\n    image\n    title\n    date\n    locationName\n  }\n": typeof types.RecommendationInfoFragmentDoc,
    "\n  fragment BucketItemInfo on BucketItemType {\n    id\n    title\n    description\n    image\n    completed\n    categoryId\n    category {\n      ...CategoryInfo\n    }\n  }\n  \n": typeof types.BucketItemInfoFragmentDoc,
    "\n  fragment InsightsInfo on InsightsDataType {\n    id\n    weather {\n      ...WeatherInfo\n    }\n    nextDestination {\n      ...DestinationInfo\n    }\n    progress {\n      ...ProgressInfo\n    }\n    recentAchievement\n  }\n  \n  \n  \n": typeof types.InsightsInfoFragmentDoc,
    "\n  fragment UserBasic on UserType {\n    id\n    email\n    firstName\n    lastName\n    fullName\n    profilePicture\n  }\n": typeof types.UserBasicFragmentDoc,
    "\n  fragment AuthUser on UserType {\n    ...UserBasic\n    isEmailVerified\n    authProvider\n    profile {\n      isOnboardingCompleted\n      hasSkippedOnboarding\n      isPremium\n    }\n  }\n  \n": typeof types.AuthUserFragmentDoc,
    "\n  fragment AuthPayloadFields on AuthPayloadType {\n    accessToken\n    sessionToken\n    refreshToken\n    expiresIn\n    user {\n      ...AuthUser\n    }\n  }\n  \n": typeof types.AuthPayloadFieldsFragmentDoc,
    "\n  fragment FullProfile on UserProfileType {\n    bio\n    locationName\n    coordinates\n    hasLocation\n    searchRadiusKm\n    timezone\n    birthDate\n    phoneNumber\n    interests {\n      id\n      name\n      icon\n    }\n    isOnboardingCompleted\n    hasSkippedOnboarding\n    isProfilePublic\n    allowEmailNotifications\n    allowPushNotifications\n    calendarIntegrated\n    calendarProvider\n    paymentPlan\n    isPremium\n    subscriptionExpiresAt\n    theme\n    lastActiveAt\n    loginCount\n  }\n": typeof types.FullProfileFragmentDoc,
    "\n  mutation CompleteOnboarding(\n    $allowLocationSharing: Boolean\n    $locationName: String\n    $location: [Float]\n    $allowPushNotifications: Boolean\n    $allowEmailNotifications: Boolean\n    $interests: [String]\n  ) {\n    completeOnboarding(\n      allowLocationSharing: $allowLocationSharing\n      locationName: $locationName\n      location: $location\n      allowPushNotifications: $allowPushNotifications\n      allowEmailNotifications: $allowEmailNotifications\n      interests: $interests\n    ) {\n      ok\n      user {\n        id\n        email\n        firstName\n        lastName\n        fullName\n        isEmailVerified\n        authProvider\n        profile {\n          isOnboardingCompleted\n        }\n      }\n    }\n  }\n": typeof types.CompleteOnboardingDocument,
    "\n  query GetInsightsData {\n    getInsightsData {\n      ...InsightsInfo\n    }\n  }\n  \n": typeof types.GetInsightsDataDocument,
    "\n  query GetRecommendations($offset: Int = 0, $limit: Int = 10) {\n    getRecommendations(offset: $offset, limit: $limit) {\n      ...RecommendationInfo\n    }\n  }\n  \n": typeof types.GetRecommendationsDocument,
    "\n  query GetHome($offset: Int = 0, $limit: Int = 10) {\n    getHome(offset: $offset, limit: $limit) {\n      id\n      greeting\n      timeOfDay\n      weather {\n        ...WeatherInfo\n      }\n      insights {\n        ...InsightsInfo\n      }\n      bucketCategories {\n        ...CategoryInfo\n      }\n      recommendations {\n        ...RecommendationInfo\n      }\n      upcoming {\n        ...BucketItemInfo\n      }\n    }\n  }\n  \n  \n  \n  \n  \n": typeof types.GetHomeDocument,
    "\n  mutation AddBucketCategory($name: String!, $emoji: String) {\n    addBucketCategory(name: $name, emoji: $emoji) {\n      category {\n        id\n        name\n        icon\n        color\n      }\n    }\n  }\n": typeof types.AddBucketCategoryDocument,
    "\n  mutation AddBucketItem(\n    $title: String!\n    $description: String\n    $estimatedCost: Float\n    $location: String\n    $categoryId: String\n  ) {\n    addBucketItem(\n      title: $title\n      description: $description\n      estimatedCost: $estimatedCost\n      location: $location\n      categoryId: $categoryId\n    ) {\n      bucketItem {\n        id\n        title\n        description\n        amount\n        image\n        completed\n        categoryId\n        category {\n          id\n          name\n          icon\n          color\n        }\n      }\n    }\n  }\n": typeof types.AddBucketItemDocument,
    "\n  query GetBucketCategories {\n    getBucketCategories {\n      ...CategoryInfo\n    }\n  }\n  \n": typeof types.GetBucketCategoriesDocument,
    "\n  query GetBucketItems($categoryId: String) {\n    getBucketItems(categoryId: $categoryId) {\n      ...BucketItemInfo\n    }\n  }\n  \n": typeof types.GetBucketItemsDocument,
    "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n": typeof types.SignInDocument,
    "\n  mutation SignUp(\n    $firstName: String!\n    $lastName: String\n    $email: String!\n    $password: String!\n  ) {\n    signUp(\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      password: $password\n    ) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n": typeof types.SignUpDocument,
    "\n  mutation GoogleSignIn($idToken: String!) {\n    googleSignIn(idToken: $idToken) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n": typeof types.GoogleSignInDocument,
    "\n  mutation SignOut($refreshToken: String!) {\n    signOut(refreshToken: $refreshToken) {\n      ok\n    }\n  }\n": typeof types.SignOutDocument,
    "\n  mutation RefreshAccessToken($refreshToken: String!) {\n    refreshAccessToken(refreshToken: $refreshToken) {\n      ok\n      accessToken\n      refreshToken\n      expiresIn\n    }\n  }\n": typeof types.RefreshAccessTokenDocument,
    "\n  query GetUser {\n    user {\n      id\n      email\n      firstName\n      lastName\n      profilePicture\n      isEmailVerified\n      authProvider\n      profile {\n        isOnboardingCompleted\n        hasSkippedOnboarding\n        bio\n        locationName\n      }\n    }\n  }\n": typeof types.GetUserDocument,
    "\n  query GetUserProfile {\n    userProfile {\n      isOnboardingCompleted\n      bio\n      locationName\n    }\n  }\n": typeof types.GetUserProfileDocument,
    "\n  mutation SkipOnboarding {\n    skipOnboarding {\n      ok\n      user {\n        ...AuthUser\n      }\n    }\n  }\n  \n": typeof types.SkipOnboardingDocument,
};
const documents: Documents = {
    "\n  fragment WeatherInfo on WeatherType {\n    city\n    condition\n    temperature\n  }\n": types.WeatherInfoFragmentDoc,
    "\n  fragment DestinationInfo on DestinationType {\n    location\n    daysAway\n  }\n": types.DestinationInfoFragmentDoc,
    "\n  fragment ProgressInfo on ProgressType {\n    completed\n    yearlyGoal\n    percentage\n  }\n": types.ProgressInfoFragmentDoc,
    "\n  fragment CategoryInfo on CategoryType {\n    id\n    name\n    icon\n    color\n  }\n": types.CategoryInfoFragmentDoc,
    "\n  fragment RecommendationInfo on RecommendationType {\n    id\n    image\n    title\n    date\n    locationName\n  }\n": types.RecommendationInfoFragmentDoc,
    "\n  fragment BucketItemInfo on BucketItemType {\n    id\n    title\n    description\n    image\n    completed\n    categoryId\n    category {\n      ...CategoryInfo\n    }\n  }\n  \n": types.BucketItemInfoFragmentDoc,
    "\n  fragment InsightsInfo on InsightsDataType {\n    id\n    weather {\n      ...WeatherInfo\n    }\n    nextDestination {\n      ...DestinationInfo\n    }\n    progress {\n      ...ProgressInfo\n    }\n    recentAchievement\n  }\n  \n  \n  \n": types.InsightsInfoFragmentDoc,
    "\n  fragment UserBasic on UserType {\n    id\n    email\n    firstName\n    lastName\n    fullName\n    profilePicture\n  }\n": types.UserBasicFragmentDoc,
    "\n  fragment AuthUser on UserType {\n    ...UserBasic\n    isEmailVerified\n    authProvider\n    profile {\n      isOnboardingCompleted\n      hasSkippedOnboarding\n      isPremium\n    }\n  }\n  \n": types.AuthUserFragmentDoc,
    "\n  fragment AuthPayloadFields on AuthPayloadType {\n    accessToken\n    sessionToken\n    refreshToken\n    expiresIn\n    user {\n      ...AuthUser\n    }\n  }\n  \n": types.AuthPayloadFieldsFragmentDoc,
    "\n  fragment FullProfile on UserProfileType {\n    bio\n    locationName\n    coordinates\n    hasLocation\n    searchRadiusKm\n    timezone\n    birthDate\n    phoneNumber\n    interests {\n      id\n      name\n      icon\n    }\n    isOnboardingCompleted\n    hasSkippedOnboarding\n    isProfilePublic\n    allowEmailNotifications\n    allowPushNotifications\n    calendarIntegrated\n    calendarProvider\n    paymentPlan\n    isPremium\n    subscriptionExpiresAt\n    theme\n    lastActiveAt\n    loginCount\n  }\n": types.FullProfileFragmentDoc,
    "\n  mutation CompleteOnboarding(\n    $allowLocationSharing: Boolean\n    $locationName: String\n    $location: [Float]\n    $allowPushNotifications: Boolean\n    $allowEmailNotifications: Boolean\n    $interests: [String]\n  ) {\n    completeOnboarding(\n      allowLocationSharing: $allowLocationSharing\n      locationName: $locationName\n      location: $location\n      allowPushNotifications: $allowPushNotifications\n      allowEmailNotifications: $allowEmailNotifications\n      interests: $interests\n    ) {\n      ok\n      user {\n        id\n        email\n        firstName\n        lastName\n        fullName\n        isEmailVerified\n        authProvider\n        profile {\n          isOnboardingCompleted\n        }\n      }\n    }\n  }\n": types.CompleteOnboardingDocument,
    "\n  query GetInsightsData {\n    getInsightsData {\n      ...InsightsInfo\n    }\n  }\n  \n": types.GetInsightsDataDocument,
    "\n  query GetRecommendations($offset: Int = 0, $limit: Int = 10) {\n    getRecommendations(offset: $offset, limit: $limit) {\n      ...RecommendationInfo\n    }\n  }\n  \n": types.GetRecommendationsDocument,
    "\n  query GetHome($offset: Int = 0, $limit: Int = 10) {\n    getHome(offset: $offset, limit: $limit) {\n      id\n      greeting\n      timeOfDay\n      weather {\n        ...WeatherInfo\n      }\n      insights {\n        ...InsightsInfo\n      }\n      bucketCategories {\n        ...CategoryInfo\n      }\n      recommendations {\n        ...RecommendationInfo\n      }\n      upcoming {\n        ...BucketItemInfo\n      }\n    }\n  }\n  \n  \n  \n  \n  \n": types.GetHomeDocument,
    "\n  mutation AddBucketCategory($name: String!, $emoji: String) {\n    addBucketCategory(name: $name, emoji: $emoji) {\n      category {\n        id\n        name\n        icon\n        color\n      }\n    }\n  }\n": types.AddBucketCategoryDocument,
    "\n  mutation AddBucketItem(\n    $title: String!\n    $description: String\n    $estimatedCost: Float\n    $location: String\n    $categoryId: String\n  ) {\n    addBucketItem(\n      title: $title\n      description: $description\n      estimatedCost: $estimatedCost\n      location: $location\n      categoryId: $categoryId\n    ) {\n      bucketItem {\n        id\n        title\n        description\n        amount\n        image\n        completed\n        categoryId\n        category {\n          id\n          name\n          icon\n          color\n        }\n      }\n    }\n  }\n": types.AddBucketItemDocument,
    "\n  query GetBucketCategories {\n    getBucketCategories {\n      ...CategoryInfo\n    }\n  }\n  \n": types.GetBucketCategoriesDocument,
    "\n  query GetBucketItems($categoryId: String) {\n    getBucketItems(categoryId: $categoryId) {\n      ...BucketItemInfo\n    }\n  }\n  \n": types.GetBucketItemsDocument,
    "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n": types.SignInDocument,
    "\n  mutation SignUp(\n    $firstName: String!\n    $lastName: String\n    $email: String!\n    $password: String!\n  ) {\n    signUp(\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      password: $password\n    ) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n": types.SignUpDocument,
    "\n  mutation GoogleSignIn($idToken: String!) {\n    googleSignIn(idToken: $idToken) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n": types.GoogleSignInDocument,
    "\n  mutation SignOut($refreshToken: String!) {\n    signOut(refreshToken: $refreshToken) {\n      ok\n    }\n  }\n": types.SignOutDocument,
    "\n  mutation RefreshAccessToken($refreshToken: String!) {\n    refreshAccessToken(refreshToken: $refreshToken) {\n      ok\n      accessToken\n      refreshToken\n      expiresIn\n    }\n  }\n": types.RefreshAccessTokenDocument,
    "\n  query GetUser {\n    user {\n      id\n      email\n      firstName\n      lastName\n      profilePicture\n      isEmailVerified\n      authProvider\n      profile {\n        isOnboardingCompleted\n        hasSkippedOnboarding\n        bio\n        locationName\n      }\n    }\n  }\n": types.GetUserDocument,
    "\n  query GetUserProfile {\n    userProfile {\n      isOnboardingCompleted\n      bio\n      locationName\n    }\n  }\n": types.GetUserProfileDocument,
    "\n  mutation SkipOnboarding {\n    skipOnboarding {\n      ok\n      user {\n        ...AuthUser\n      }\n    }\n  }\n  \n": types.SkipOnboardingDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment WeatherInfo on WeatherType {\n    city\n    condition\n    temperature\n  }\n"): (typeof documents)["\n  fragment WeatherInfo on WeatherType {\n    city\n    condition\n    temperature\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment DestinationInfo on DestinationType {\n    location\n    daysAway\n  }\n"): (typeof documents)["\n  fragment DestinationInfo on DestinationType {\n    location\n    daysAway\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProgressInfo on ProgressType {\n    completed\n    yearlyGoal\n    percentage\n  }\n"): (typeof documents)["\n  fragment ProgressInfo on ProgressType {\n    completed\n    yearlyGoal\n    percentage\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CategoryInfo on CategoryType {\n    id\n    name\n    icon\n    color\n  }\n"): (typeof documents)["\n  fragment CategoryInfo on CategoryType {\n    id\n    name\n    icon\n    color\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment RecommendationInfo on RecommendationType {\n    id\n    image\n    title\n    date\n    locationName\n  }\n"): (typeof documents)["\n  fragment RecommendationInfo on RecommendationType {\n    id\n    image\n    title\n    date\n    locationName\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment BucketItemInfo on BucketItemType {\n    id\n    title\n    description\n    image\n    completed\n    categoryId\n    category {\n      ...CategoryInfo\n    }\n  }\n  \n"): (typeof documents)["\n  fragment BucketItemInfo on BucketItemType {\n    id\n    title\n    description\n    image\n    completed\n    categoryId\n    category {\n      ...CategoryInfo\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment InsightsInfo on InsightsDataType {\n    id\n    weather {\n      ...WeatherInfo\n    }\n    nextDestination {\n      ...DestinationInfo\n    }\n    progress {\n      ...ProgressInfo\n    }\n    recentAchievement\n  }\n  \n  \n  \n"): (typeof documents)["\n  fragment InsightsInfo on InsightsDataType {\n    id\n    weather {\n      ...WeatherInfo\n    }\n    nextDestination {\n      ...DestinationInfo\n    }\n    progress {\n      ...ProgressInfo\n    }\n    recentAchievement\n  }\n  \n  \n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment UserBasic on UserType {\n    id\n    email\n    firstName\n    lastName\n    fullName\n    profilePicture\n  }\n"): (typeof documents)["\n  fragment UserBasic on UserType {\n    id\n    email\n    firstName\n    lastName\n    fullName\n    profilePicture\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AuthUser on UserType {\n    ...UserBasic\n    isEmailVerified\n    authProvider\n    profile {\n      isOnboardingCompleted\n      hasSkippedOnboarding\n      isPremium\n    }\n  }\n  \n"): (typeof documents)["\n  fragment AuthUser on UserType {\n    ...UserBasic\n    isEmailVerified\n    authProvider\n    profile {\n      isOnboardingCompleted\n      hasSkippedOnboarding\n      isPremium\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AuthPayloadFields on AuthPayloadType {\n    accessToken\n    sessionToken\n    refreshToken\n    expiresIn\n    user {\n      ...AuthUser\n    }\n  }\n  \n"): (typeof documents)["\n  fragment AuthPayloadFields on AuthPayloadType {\n    accessToken\n    sessionToken\n    refreshToken\n    expiresIn\n    user {\n      ...AuthUser\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment FullProfile on UserProfileType {\n    bio\n    locationName\n    coordinates\n    hasLocation\n    searchRadiusKm\n    timezone\n    birthDate\n    phoneNumber\n    interests {\n      id\n      name\n      icon\n    }\n    isOnboardingCompleted\n    hasSkippedOnboarding\n    isProfilePublic\n    allowEmailNotifications\n    allowPushNotifications\n    calendarIntegrated\n    calendarProvider\n    paymentPlan\n    isPremium\n    subscriptionExpiresAt\n    theme\n    lastActiveAt\n    loginCount\n  }\n"): (typeof documents)["\n  fragment FullProfile on UserProfileType {\n    bio\n    locationName\n    coordinates\n    hasLocation\n    searchRadiusKm\n    timezone\n    birthDate\n    phoneNumber\n    interests {\n      id\n      name\n      icon\n    }\n    isOnboardingCompleted\n    hasSkippedOnboarding\n    isProfilePublic\n    allowEmailNotifications\n    allowPushNotifications\n    calendarIntegrated\n    calendarProvider\n    paymentPlan\n    isPremium\n    subscriptionExpiresAt\n    theme\n    lastActiveAt\n    loginCount\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CompleteOnboarding(\n    $allowLocationSharing: Boolean\n    $locationName: String\n    $location: [Float]\n    $allowPushNotifications: Boolean\n    $allowEmailNotifications: Boolean\n    $interests: [String]\n  ) {\n    completeOnboarding(\n      allowLocationSharing: $allowLocationSharing\n      locationName: $locationName\n      location: $location\n      allowPushNotifications: $allowPushNotifications\n      allowEmailNotifications: $allowEmailNotifications\n      interests: $interests\n    ) {\n      ok\n      user {\n        id\n        email\n        firstName\n        lastName\n        fullName\n        isEmailVerified\n        authProvider\n        profile {\n          isOnboardingCompleted\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CompleteOnboarding(\n    $allowLocationSharing: Boolean\n    $locationName: String\n    $location: [Float]\n    $allowPushNotifications: Boolean\n    $allowEmailNotifications: Boolean\n    $interests: [String]\n  ) {\n    completeOnboarding(\n      allowLocationSharing: $allowLocationSharing\n      locationName: $locationName\n      location: $location\n      allowPushNotifications: $allowPushNotifications\n      allowEmailNotifications: $allowEmailNotifications\n      interests: $interests\n    ) {\n      ok\n      user {\n        id\n        email\n        firstName\n        lastName\n        fullName\n        isEmailVerified\n        authProvider\n        profile {\n          isOnboardingCompleted\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetInsightsData {\n    getInsightsData {\n      ...InsightsInfo\n    }\n  }\n  \n"): (typeof documents)["\n  query GetInsightsData {\n    getInsightsData {\n      ...InsightsInfo\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetRecommendations($offset: Int = 0, $limit: Int = 10) {\n    getRecommendations(offset: $offset, limit: $limit) {\n      ...RecommendationInfo\n    }\n  }\n  \n"): (typeof documents)["\n  query GetRecommendations($offset: Int = 0, $limit: Int = 10) {\n    getRecommendations(offset: $offset, limit: $limit) {\n      ...RecommendationInfo\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetHome($offset: Int = 0, $limit: Int = 10) {\n    getHome(offset: $offset, limit: $limit) {\n      id\n      greeting\n      timeOfDay\n      weather {\n        ...WeatherInfo\n      }\n      insights {\n        ...InsightsInfo\n      }\n      bucketCategories {\n        ...CategoryInfo\n      }\n      recommendations {\n        ...RecommendationInfo\n      }\n      upcoming {\n        ...BucketItemInfo\n      }\n    }\n  }\n  \n  \n  \n  \n  \n"): (typeof documents)["\n  query GetHome($offset: Int = 0, $limit: Int = 10) {\n    getHome(offset: $offset, limit: $limit) {\n      id\n      greeting\n      timeOfDay\n      weather {\n        ...WeatherInfo\n      }\n      insights {\n        ...InsightsInfo\n      }\n      bucketCategories {\n        ...CategoryInfo\n      }\n      recommendations {\n        ...RecommendationInfo\n      }\n      upcoming {\n        ...BucketItemInfo\n      }\n    }\n  }\n  \n  \n  \n  \n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddBucketCategory($name: String!, $emoji: String) {\n    addBucketCategory(name: $name, emoji: $emoji) {\n      category {\n        id\n        name\n        icon\n        color\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation AddBucketCategory($name: String!, $emoji: String) {\n    addBucketCategory(name: $name, emoji: $emoji) {\n      category {\n        id\n        name\n        icon\n        color\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddBucketItem(\n    $title: String!\n    $description: String\n    $estimatedCost: Float\n    $location: String\n    $categoryId: String\n  ) {\n    addBucketItem(\n      title: $title\n      description: $description\n      estimatedCost: $estimatedCost\n      location: $location\n      categoryId: $categoryId\n    ) {\n      bucketItem {\n        id\n        title\n        description\n        amount\n        image\n        completed\n        categoryId\n        category {\n          id\n          name\n          icon\n          color\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation AddBucketItem(\n    $title: String!\n    $description: String\n    $estimatedCost: Float\n    $location: String\n    $categoryId: String\n  ) {\n    addBucketItem(\n      title: $title\n      description: $description\n      estimatedCost: $estimatedCost\n      location: $location\n      categoryId: $categoryId\n    ) {\n      bucketItem {\n        id\n        title\n        description\n        amount\n        image\n        completed\n        categoryId\n        category {\n          id\n          name\n          icon\n          color\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetBucketCategories {\n    getBucketCategories {\n      ...CategoryInfo\n    }\n  }\n  \n"): (typeof documents)["\n  query GetBucketCategories {\n    getBucketCategories {\n      ...CategoryInfo\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetBucketItems($categoryId: String) {\n    getBucketItems(categoryId: $categoryId) {\n      ...BucketItemInfo\n    }\n  }\n  \n"): (typeof documents)["\n  query GetBucketItems($categoryId: String) {\n    getBucketItems(categoryId: $categoryId) {\n      ...BucketItemInfo\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignUp(\n    $firstName: String!\n    $lastName: String\n    $email: String!\n    $password: String!\n  ) {\n    signUp(\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      password: $password\n    ) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SignUp(\n    $firstName: String!\n    $lastName: String\n    $email: String!\n    $password: String!\n  ) {\n    signUp(\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      password: $password\n    ) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation GoogleSignIn($idToken: String!) {\n    googleSignIn(idToken: $idToken) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation GoogleSignIn($idToken: String!) {\n    googleSignIn(idToken: $idToken) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignOut($refreshToken: String!) {\n    signOut(refreshToken: $refreshToken) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation SignOut($refreshToken: String!) {\n    signOut(refreshToken: $refreshToken) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RefreshAccessToken($refreshToken: String!) {\n    refreshAccessToken(refreshToken: $refreshToken) {\n      ok\n      accessToken\n      refreshToken\n      expiresIn\n    }\n  }\n"): (typeof documents)["\n  mutation RefreshAccessToken($refreshToken: String!) {\n    refreshAccessToken(refreshToken: $refreshToken) {\n      ok\n      accessToken\n      refreshToken\n      expiresIn\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUser {\n    user {\n      id\n      email\n      firstName\n      lastName\n      profilePicture\n      isEmailVerified\n      authProvider\n      profile {\n        isOnboardingCompleted\n        hasSkippedOnboarding\n        bio\n        locationName\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUser {\n    user {\n      id\n      email\n      firstName\n      lastName\n      profilePicture\n      isEmailVerified\n      authProvider\n      profile {\n        isOnboardingCompleted\n        hasSkippedOnboarding\n        bio\n        locationName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUserProfile {\n    userProfile {\n      isOnboardingCompleted\n      bio\n      locationName\n    }\n  }\n"): (typeof documents)["\n  query GetUserProfile {\n    userProfile {\n      isOnboardingCompleted\n      bio\n      locationName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SkipOnboarding {\n    skipOnboarding {\n      ok\n      user {\n        ...AuthUser\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  mutation SkipOnboarding {\n    skipOnboarding {\n      ok\n      user {\n        ...AuthUser\n      }\n    }\n  }\n  \n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;