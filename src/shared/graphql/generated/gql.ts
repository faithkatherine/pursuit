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
    "\n  fragment WeatherInfo on WeatherType {\n    city\n    condition\n    temperature\n    icon\n  }\n": typeof types.WeatherInfoFragmentDoc,
    "\n  fragment CategoryInfo on CategoryType {\n    id\n    name\n    slug\n    icon\n    color\n    description\n    isActive\n    sortOrder\n  }\n": typeof types.CategoryInfoFragmentDoc,
    "\n  fragment UserBasic on UserType {\n    id\n    email\n    firstName\n    lastName\n    fullName\n    profilePicture\n  }\n": typeof types.UserBasicFragmentDoc,
    "\n  fragment AuthUser on UserType {\n    ...UserBasic\n    isEmailVerified\n    authProvider\n    profile {\n      isOnboardingCompleted\n      hasSkippedOnboarding\n      isPremium\n    }\n  }\n  \n": typeof types.AuthUserFragmentDoc,
    "\n  fragment EventInfo on EventType {\n    id\n    name\n    description\n    image\n    date\n    endDate\n    locationName\n    moreDetailsUrl\n    price\n    ticketingEnabled\n    availableTickets\n    goingCount\n    hasGallery\n    galleryImages\n    galleryDescription\n    seriesName\n    isFree\n    isExternal\n    isInternal\n    isSaved\n    isGoing\n    hasConfirmedTicket\n    isEditorsPick\n    reason\n    source\n    curatorNote\n    curatorName\n    coordinates\n    createdAt\n    isActive\n    status\n    updatedAt\n    userStatus\n    category {\n      ...CategoryInfo\n    }\n  }\n  \n": typeof types.EventInfoFragmentDoc,
    "\n  fragment AuthPayloadFields on AuthPayloadType {\n    accessToken\n    sessionToken\n    refreshToken\n    expiresIn\n    user {\n      ...AuthUser\n    }\n  }\n  \n": typeof types.AuthPayloadFieldsFragmentDoc,
    "\n  fragment FullProfile on UserProfileType {\n    bio\n    locationName\n    coordinates\n    hasLocation\n    searchRadiusKm\n    timezone\n    birthDate\n    phoneNumber\n    interests {\n      id\n      name\n      icon\n    }\n    isOnboardingCompleted\n    hasSkippedOnboarding\n    isProfilePublic\n    allowEmailNotifications\n    allowPushNotifications\n    calendarIntegrated\n    calendarProvider\n    paymentPlan\n    isPremium\n    subscriptionExpiresAt\n    theme\n    lastActiveAt\n    loginCount\n  }\n": typeof types.FullProfileFragmentDoc,
    "\n  fragment VoterInfo on VoterInfoType {\n    displayInitial\n    displayColor\n    voterName\n    profilePicture\n  }\n": typeof types.VoterInfoFragmentDoc,
    "\n  fragment GroupPlanEventInfo on GroupPlanEventType {\n    id\n    event {\n      ...EventInfo\n    }\n    addedBy {\n      ...UserBasic\n    }\n    ordering\n    interestedCount\n    voters {\n      ...VoterInfo\n    }\n    addedAt\n  }\n  \n  \n  \n": typeof types.GroupPlanEventInfoFragmentDoc,
    "\n  fragment VoteInvitationInfo on VoteInvitationType {\n    id\n    shareToken\n    isActive\n    createdAt\n  }\n": typeof types.VoteInvitationInfoFragmentDoc,
    "\n  fragment VoterSessionInfo on IndividualVoterSessionType {\n    id\n    sessionToken\n    displayInitial\n    displayColor\n    voterName\n    hasCompletedStack\n    myVotes\n  }\n": typeof types.VoterSessionInfoFragmentDoc,
    "\n  fragment GroupPlanInfo on GroupPlanType {\n    id\n    creator {\n      ...UserBasic\n    }\n    name\n    displayName\n    status\n    bucketEvents {\n      ...GroupPlanEventInfo\n    }\n    invitations {\n      ...VoteInvitationInfo\n    }\n    myVoterSession {\n      ...VoterSessionInfo\n    }\n    createdAt\n    updatedAt\n  }\n  \n  \n  \n  \n": typeof types.GroupPlanInfoFragmentDoc,
    "\n  mutation CompleteOnboarding(\n    $allowLocationSharing: Boolean\n    $locationName: String\n    $location: [Float]\n    $allowPushNotifications: Boolean\n    $allowEmailNotifications: Boolean\n    $interests: [String]\n  ) {\n    completeOnboarding(\n      allowLocationSharing: $allowLocationSharing\n      locationName: $locationName\n      location: $location\n      allowPushNotifications: $allowPushNotifications\n      allowEmailNotifications: $allowEmailNotifications\n      interests: $interests\n    ) {\n      ok\n      user {\n        id\n        email\n        firstName\n        lastName\n        fullName\n        isEmailVerified\n        authProvider\n        profile {\n          isOnboardingCompleted\n        }\n      }\n    }\n  }\n": typeof types.CompleteOnboardingDocument,
    "\n  query GetHome($offset: Int = 0, $limit: Int = 10, $timeFilter: String) {\n    getHome(offset: $offset, limit: $limit, timeFilter: $timeFilter) {\n      id\n      greeting\n      greetingPrompt\n      timeOfDay\n      dayOfWeek\n      cityName\n      profilePicture\n      userLocation\n      allowLocationSharing\n      weather {\n        ...WeatherInfo\n      }\n      categories {\n        ...CategoryInfo\n      }\n      editorsPick {\n        ...EventInfo\n      }\n      recommendations {\n        ...EventInfo\n      }\n      trending {\n        ...EventInfo\n      }\n      upcomingEvents {\n        ...EventInfo\n      }\n      nextSavedEvent {\n        ...EventInfo\n      }\n      activeTrip {\n        id\n        name\n        destination\n        startDate\n        endDate\n        coverImage\n        eventCount\n        events {\n          id\n        }\n      }\n    }\n  }\n  \n  \n  \n": typeof types.GetHomeDocument,
    "\n  query GetCategories {\n    getCategories {\n      ok\n      categories {\n        ...CategoryInfo\n      }\n    }\n  }\n  \n": typeof types.GetCategoriesDocument,
    "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            hasSkippedOnboarding\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n": typeof types.SignInDocument,
    "\n  mutation SignUp(\n    $firstName: String!\n    $lastName: String\n    $email: String!\n    $password: String!\n  ) {\n    signUp(\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      password: $password\n    ) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            hasSkippedOnboarding\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n": typeof types.SignUpDocument,
    "\n  mutation GoogleSignIn($idToken: String!) {\n    googleSignIn(idToken: $idToken) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            hasSkippedOnboarding\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n": typeof types.GoogleSignInDocument,
    "\n  mutation SignOut($refreshToken: String!) {\n    signOut(refreshToken: $refreshToken) {\n      ok\n    }\n  }\n": typeof types.SignOutDocument,
    "\n  mutation RefreshAccessToken($refreshToken: String!) {\n    refreshAccessToken(refreshToken: $refreshToken) {\n      ok\n      accessToken\n      refreshToken\n      expiresIn\n    }\n  }\n": typeof types.RefreshAccessTokenDocument,
    "\n  query GetUser {\n    user {\n      id\n      email\n      firstName\n      lastName\n      profilePicture\n      isEmailVerified\n      authProvider\n      profile {\n        isOnboardingCompleted\n        hasSkippedOnboarding\n        bio\n        locationName\n        allowLocationSharing\n      }\n    }\n  }\n": typeof types.GetUserDocument,
    "\n  query GetUserProfile {\n    userProfile {\n      isOnboardingCompleted\n      bio\n      locationName\n    }\n  }\n": typeof types.GetUserProfileDocument,
    "\n  query GetEvent($id: ID!) {\n    event(id: $id) {\n      ok\n      event {\n        ...EventInfo\n      }\n    }\n  }\n  \n": typeof types.GetEventDocument,
    "\n  query GetEvents(\n    $search: String\n    $category: [ID]\n    $latitude: Float\n    $longitude: Float\n    $radiusKm: Float\n    $offset: Int\n    $limit: Int\n  ) {\n    events(\n      search: $search\n      category: $category\n      latitude: $latitude\n      longitude: $longitude\n      radiusKm: $radiusKm\n      offset: $offset\n      limit: $limit\n    ) {\n      ok\n      events {\n        ...EventInfo\n      }\n    }\n  }\n  \n": typeof types.GetEventsDocument,
    "\n  query GetSavedEvents($offset: Int, $limit: Int) {\n    savedEvents(offset: $offset, limit: $limit) {\n      ok\n      totalCount\n      events {\n        ...EventInfo\n      }\n    }\n  }\n  \n": typeof types.GetSavedEventsDocument,
    "\n  mutation SaveEvent($id: ID!) {\n    saveEvent(id: $id) {\n      ok\n      event {\n        ...EventInfo\n      }\n      errors\n    }\n  }\n  \n": typeof types.SaveEventDocument,
    "\n  mutation UnsaveEvent($id: ID!) {\n    unsaveEvent(id: $id) {\n      ok\n      event {\n        ...EventInfo\n      }\n      errors\n    }\n  }\n  \n": typeof types.UnsaveEventDocument,
    "\n  mutation EnableLocation($locationName: String!, $location: [Float]!) {\n    enableLocation(locationName: $locationName, location: $location) {\n      ok\n      user {\n        id\n        profile {\n          locationName\n          allowLocationSharing\n          coordinates\n          hasLocation\n        }\n      }\n    }\n  }\n": typeof types.EnableLocationDocument,
    "\n  mutation DisableLocation {\n    disableLocation {\n      ok\n      user {\n        id\n        profile {\n          locationName\n          allowLocationSharing\n          coordinates\n          hasLocation\n        }\n      }\n    }\n  }\n": typeof types.DisableLocationDocument,
    "\n  mutation SkipOnboarding {\n    skipOnboarding {\n      ok\n      user {\n        ...AuthUser\n      }\n    }\n  }\n  \n": typeof types.SkipOnboardingDocument,
    "\n  query GetUpcomingPlans($offset: Int, $limit: Int) {\n    upcomingPlans(offset: $offset, limit: $limit) {\n      ok\n      totalCount\n      events {\n        ...EventInfo\n      }\n    }\n  }\n  \n": typeof types.GetUpcomingPlansDocument,
    "\n  query GetPastPlans($offset: Int, $limit: Int) {\n    pastPlans(offset: $offset, limit: $limit) {\n      ok\n      totalCount\n      events {\n        ...EventInfo\n      }\n    }\n  }\n  \n": typeof types.GetPastPlansDocument,
    "\n  mutation MarkGoing($id: ID!) {\n    markGoing(id: $id) {\n      ok\n      event {\n        ...EventInfo\n      }\n      errors\n    }\n  }\n  \n": typeof types.MarkGoingDocument,
    "\n  mutation UnmarkGoing($id: ID!) {\n    unmarkGoing(id: $id) {\n      ok\n      event {\n        ...EventInfo\n      }\n      errors\n    }\n  }\n  \n": typeof types.UnmarkGoingDocument,
    "\n  query GetMyGroupPlans {\n    myGroupPlans {\n      id\n      creator {\n        ...UserBasic\n      }\n      name\n      displayName\n      status\n      bucketEvents {\n        id\n        event {\n          id\n          name\n          image\n          date\n        }\n        interestedCount\n      }\n      invitations {\n        id\n        shareToken\n        isActive\n      }\n      createdAt\n      updatedAt\n    }\n  }\n  \n": typeof types.GetMyGroupPlansDocument,
    "\n  query GetGroupPlan($id: ID!) {\n    groupPlan(id: $id) {\n      ...GroupPlanInfo\n    }\n  }\n  \n": typeof types.GetGroupPlanDocument,
    "\n  query GetGroupPlanByShareToken($shareToken: String!) {\n    groupPlanByShareToken(shareToken: $shareToken) {\n      ...GroupPlanInfo\n    }\n  }\n  \n": typeof types.GetGroupPlanByShareTokenDocument,
    "\n  query GetEventSuggestionsForGroupPlan($groupPlanId: ID!, $date: Date) {\n    eventSuggestionsForGroupPlan(groupPlanId: $groupPlanId, date: $date) {\n      ...EventInfo\n    }\n  }\n  \n": typeof types.GetEventSuggestionsForGroupPlanDocument,
    "\n  mutation CreateGroupPlan($name: String) {\n    createGroupPlan(name: $name) {\n      groupPlan {\n        ...GroupPlanInfo\n      }\n    }\n  }\n  \n": typeof types.CreateGroupPlanDocument,
    "\n  mutation AddEventToBucket($groupPlanId: ID!, $eventId: ID!) {\n    addEventToBucket(groupPlanId: $groupPlanId, eventId: $eventId) {\n      groupPlanEvent {\n        ...GroupPlanEventInfo\n      }\n    }\n  }\n  \n": typeof types.AddEventToBucketDocument,
    "\n  mutation RemoveEventFromBucket($groupPlanEventId: ID!) {\n    removeEventFromBucket(groupPlanEventId: $groupPlanEventId) {\n      success\n    }\n  }\n": typeof types.RemoveEventFromBucketDocument,
    "\n  mutation ReorderBucketEvents($groupPlanId: ID!, $orderedIds: [ID!]!) {\n    reorderBucketEvents(groupPlanId: $groupPlanId, orderedIds: $orderedIds) {\n      bucketEvents {\n        ...GroupPlanEventInfo\n      }\n    }\n  }\n  \n": typeof types.ReorderBucketEventsDocument,
    "\n  mutation UpdateGroupPlanName($groupPlanId: ID!, $name: String!) {\n    updateGroupPlanName(groupPlanId: $groupPlanId, name: $name) {\n      groupPlan {\n        id\n        name\n        displayName\n      }\n    }\n  }\n": typeof types.UpdateGroupPlanNameDocument,
    "\n  mutation OpenGroupPlanForVoting($groupPlanId: ID!) {\n    openGroupPlanForVoting(groupPlanId: $groupPlanId) {\n      groupPlan {\n        id\n        status\n      }\n    }\n  }\n": typeof types.OpenGroupPlanForVotingDocument,
    "\n  mutation CloseGroupPlan($groupPlanId: ID!) {\n    closeGroupPlan(groupPlanId: $groupPlanId) {\n      groupPlan {\n        id\n        status\n      }\n    }\n  }\n": typeof types.CloseGroupPlanDocument,
    "\n  mutation CreateVoterSession($shareToken: String!, $voterName: String) {\n    createVoterSession(shareToken: $shareToken, voterName: $voterName) {\n      voterSession {\n        ...VoterSessionInfo\n      }\n    }\n  }\n  \n": typeof types.CreateVoterSessionDocument,
    "\n  mutation CastVote(\n    $groupPlanEventId: ID!\n    $sessionToken: String!\n    $direction: VoteDirectionEnum!\n  ) {\n    castVote(\n      groupPlanEventId: $groupPlanEventId\n      sessionToken: $sessionToken\n      direction: $direction\n    ) {\n      vote {\n        id\n        direction\n        castAt\n      }\n    }\n  }\n": typeof types.CastVoteDocument,
};
const documents: Documents = {
    "\n  fragment WeatherInfo on WeatherType {\n    city\n    condition\n    temperature\n    icon\n  }\n": types.WeatherInfoFragmentDoc,
    "\n  fragment CategoryInfo on CategoryType {\n    id\n    name\n    slug\n    icon\n    color\n    description\n    isActive\n    sortOrder\n  }\n": types.CategoryInfoFragmentDoc,
    "\n  fragment UserBasic on UserType {\n    id\n    email\n    firstName\n    lastName\n    fullName\n    profilePicture\n  }\n": types.UserBasicFragmentDoc,
    "\n  fragment AuthUser on UserType {\n    ...UserBasic\n    isEmailVerified\n    authProvider\n    profile {\n      isOnboardingCompleted\n      hasSkippedOnboarding\n      isPremium\n    }\n  }\n  \n": types.AuthUserFragmentDoc,
    "\n  fragment EventInfo on EventType {\n    id\n    name\n    description\n    image\n    date\n    endDate\n    locationName\n    moreDetailsUrl\n    price\n    ticketingEnabled\n    availableTickets\n    goingCount\n    hasGallery\n    galleryImages\n    galleryDescription\n    seriesName\n    isFree\n    isExternal\n    isInternal\n    isSaved\n    isGoing\n    hasConfirmedTicket\n    isEditorsPick\n    reason\n    source\n    curatorNote\n    curatorName\n    coordinates\n    createdAt\n    isActive\n    status\n    updatedAt\n    userStatus\n    category {\n      ...CategoryInfo\n    }\n  }\n  \n": types.EventInfoFragmentDoc,
    "\n  fragment AuthPayloadFields on AuthPayloadType {\n    accessToken\n    sessionToken\n    refreshToken\n    expiresIn\n    user {\n      ...AuthUser\n    }\n  }\n  \n": types.AuthPayloadFieldsFragmentDoc,
    "\n  fragment FullProfile on UserProfileType {\n    bio\n    locationName\n    coordinates\n    hasLocation\n    searchRadiusKm\n    timezone\n    birthDate\n    phoneNumber\n    interests {\n      id\n      name\n      icon\n    }\n    isOnboardingCompleted\n    hasSkippedOnboarding\n    isProfilePublic\n    allowEmailNotifications\n    allowPushNotifications\n    calendarIntegrated\n    calendarProvider\n    paymentPlan\n    isPremium\n    subscriptionExpiresAt\n    theme\n    lastActiveAt\n    loginCount\n  }\n": types.FullProfileFragmentDoc,
    "\n  fragment VoterInfo on VoterInfoType {\n    displayInitial\n    displayColor\n    voterName\n    profilePicture\n  }\n": types.VoterInfoFragmentDoc,
    "\n  fragment GroupPlanEventInfo on GroupPlanEventType {\n    id\n    event {\n      ...EventInfo\n    }\n    addedBy {\n      ...UserBasic\n    }\n    ordering\n    interestedCount\n    voters {\n      ...VoterInfo\n    }\n    addedAt\n  }\n  \n  \n  \n": types.GroupPlanEventInfoFragmentDoc,
    "\n  fragment VoteInvitationInfo on VoteInvitationType {\n    id\n    shareToken\n    isActive\n    createdAt\n  }\n": types.VoteInvitationInfoFragmentDoc,
    "\n  fragment VoterSessionInfo on IndividualVoterSessionType {\n    id\n    sessionToken\n    displayInitial\n    displayColor\n    voterName\n    hasCompletedStack\n    myVotes\n  }\n": types.VoterSessionInfoFragmentDoc,
    "\n  fragment GroupPlanInfo on GroupPlanType {\n    id\n    creator {\n      ...UserBasic\n    }\n    name\n    displayName\n    status\n    bucketEvents {\n      ...GroupPlanEventInfo\n    }\n    invitations {\n      ...VoteInvitationInfo\n    }\n    myVoterSession {\n      ...VoterSessionInfo\n    }\n    createdAt\n    updatedAt\n  }\n  \n  \n  \n  \n": types.GroupPlanInfoFragmentDoc,
    "\n  mutation CompleteOnboarding(\n    $allowLocationSharing: Boolean\n    $locationName: String\n    $location: [Float]\n    $allowPushNotifications: Boolean\n    $allowEmailNotifications: Boolean\n    $interests: [String]\n  ) {\n    completeOnboarding(\n      allowLocationSharing: $allowLocationSharing\n      locationName: $locationName\n      location: $location\n      allowPushNotifications: $allowPushNotifications\n      allowEmailNotifications: $allowEmailNotifications\n      interests: $interests\n    ) {\n      ok\n      user {\n        id\n        email\n        firstName\n        lastName\n        fullName\n        isEmailVerified\n        authProvider\n        profile {\n          isOnboardingCompleted\n        }\n      }\n    }\n  }\n": types.CompleteOnboardingDocument,
    "\n  query GetHome($offset: Int = 0, $limit: Int = 10, $timeFilter: String) {\n    getHome(offset: $offset, limit: $limit, timeFilter: $timeFilter) {\n      id\n      greeting\n      greetingPrompt\n      timeOfDay\n      dayOfWeek\n      cityName\n      profilePicture\n      userLocation\n      allowLocationSharing\n      weather {\n        ...WeatherInfo\n      }\n      categories {\n        ...CategoryInfo\n      }\n      editorsPick {\n        ...EventInfo\n      }\n      recommendations {\n        ...EventInfo\n      }\n      trending {\n        ...EventInfo\n      }\n      upcomingEvents {\n        ...EventInfo\n      }\n      nextSavedEvent {\n        ...EventInfo\n      }\n      activeTrip {\n        id\n        name\n        destination\n        startDate\n        endDate\n        coverImage\n        eventCount\n        events {\n          id\n        }\n      }\n    }\n  }\n  \n  \n  \n": types.GetHomeDocument,
    "\n  query GetCategories {\n    getCategories {\n      ok\n      categories {\n        ...CategoryInfo\n      }\n    }\n  }\n  \n": types.GetCategoriesDocument,
    "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            hasSkippedOnboarding\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n": types.SignInDocument,
    "\n  mutation SignUp(\n    $firstName: String!\n    $lastName: String\n    $email: String!\n    $password: String!\n  ) {\n    signUp(\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      password: $password\n    ) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            hasSkippedOnboarding\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n": types.SignUpDocument,
    "\n  mutation GoogleSignIn($idToken: String!) {\n    googleSignIn(idToken: $idToken) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            hasSkippedOnboarding\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n": types.GoogleSignInDocument,
    "\n  mutation SignOut($refreshToken: String!) {\n    signOut(refreshToken: $refreshToken) {\n      ok\n    }\n  }\n": types.SignOutDocument,
    "\n  mutation RefreshAccessToken($refreshToken: String!) {\n    refreshAccessToken(refreshToken: $refreshToken) {\n      ok\n      accessToken\n      refreshToken\n      expiresIn\n    }\n  }\n": types.RefreshAccessTokenDocument,
    "\n  query GetUser {\n    user {\n      id\n      email\n      firstName\n      lastName\n      profilePicture\n      isEmailVerified\n      authProvider\n      profile {\n        isOnboardingCompleted\n        hasSkippedOnboarding\n        bio\n        locationName\n        allowLocationSharing\n      }\n    }\n  }\n": types.GetUserDocument,
    "\n  query GetUserProfile {\n    userProfile {\n      isOnboardingCompleted\n      bio\n      locationName\n    }\n  }\n": types.GetUserProfileDocument,
    "\n  query GetEvent($id: ID!) {\n    event(id: $id) {\n      ok\n      event {\n        ...EventInfo\n      }\n    }\n  }\n  \n": types.GetEventDocument,
    "\n  query GetEvents(\n    $search: String\n    $category: [ID]\n    $latitude: Float\n    $longitude: Float\n    $radiusKm: Float\n    $offset: Int\n    $limit: Int\n  ) {\n    events(\n      search: $search\n      category: $category\n      latitude: $latitude\n      longitude: $longitude\n      radiusKm: $radiusKm\n      offset: $offset\n      limit: $limit\n    ) {\n      ok\n      events {\n        ...EventInfo\n      }\n    }\n  }\n  \n": types.GetEventsDocument,
    "\n  query GetSavedEvents($offset: Int, $limit: Int) {\n    savedEvents(offset: $offset, limit: $limit) {\n      ok\n      totalCount\n      events {\n        ...EventInfo\n      }\n    }\n  }\n  \n": types.GetSavedEventsDocument,
    "\n  mutation SaveEvent($id: ID!) {\n    saveEvent(id: $id) {\n      ok\n      event {\n        ...EventInfo\n      }\n      errors\n    }\n  }\n  \n": types.SaveEventDocument,
    "\n  mutation UnsaveEvent($id: ID!) {\n    unsaveEvent(id: $id) {\n      ok\n      event {\n        ...EventInfo\n      }\n      errors\n    }\n  }\n  \n": types.UnsaveEventDocument,
    "\n  mutation EnableLocation($locationName: String!, $location: [Float]!) {\n    enableLocation(locationName: $locationName, location: $location) {\n      ok\n      user {\n        id\n        profile {\n          locationName\n          allowLocationSharing\n          coordinates\n          hasLocation\n        }\n      }\n    }\n  }\n": types.EnableLocationDocument,
    "\n  mutation DisableLocation {\n    disableLocation {\n      ok\n      user {\n        id\n        profile {\n          locationName\n          allowLocationSharing\n          coordinates\n          hasLocation\n        }\n      }\n    }\n  }\n": types.DisableLocationDocument,
    "\n  mutation SkipOnboarding {\n    skipOnboarding {\n      ok\n      user {\n        ...AuthUser\n      }\n    }\n  }\n  \n": types.SkipOnboardingDocument,
    "\n  query GetUpcomingPlans($offset: Int, $limit: Int) {\n    upcomingPlans(offset: $offset, limit: $limit) {\n      ok\n      totalCount\n      events {\n        ...EventInfo\n      }\n    }\n  }\n  \n": types.GetUpcomingPlansDocument,
    "\n  query GetPastPlans($offset: Int, $limit: Int) {\n    pastPlans(offset: $offset, limit: $limit) {\n      ok\n      totalCount\n      events {\n        ...EventInfo\n      }\n    }\n  }\n  \n": types.GetPastPlansDocument,
    "\n  mutation MarkGoing($id: ID!) {\n    markGoing(id: $id) {\n      ok\n      event {\n        ...EventInfo\n      }\n      errors\n    }\n  }\n  \n": types.MarkGoingDocument,
    "\n  mutation UnmarkGoing($id: ID!) {\n    unmarkGoing(id: $id) {\n      ok\n      event {\n        ...EventInfo\n      }\n      errors\n    }\n  }\n  \n": types.UnmarkGoingDocument,
    "\n  query GetMyGroupPlans {\n    myGroupPlans {\n      id\n      creator {\n        ...UserBasic\n      }\n      name\n      displayName\n      status\n      bucketEvents {\n        id\n        event {\n          id\n          name\n          image\n          date\n        }\n        interestedCount\n      }\n      invitations {\n        id\n        shareToken\n        isActive\n      }\n      createdAt\n      updatedAt\n    }\n  }\n  \n": types.GetMyGroupPlansDocument,
    "\n  query GetGroupPlan($id: ID!) {\n    groupPlan(id: $id) {\n      ...GroupPlanInfo\n    }\n  }\n  \n": types.GetGroupPlanDocument,
    "\n  query GetGroupPlanByShareToken($shareToken: String!) {\n    groupPlanByShareToken(shareToken: $shareToken) {\n      ...GroupPlanInfo\n    }\n  }\n  \n": types.GetGroupPlanByShareTokenDocument,
    "\n  query GetEventSuggestionsForGroupPlan($groupPlanId: ID!, $date: Date) {\n    eventSuggestionsForGroupPlan(groupPlanId: $groupPlanId, date: $date) {\n      ...EventInfo\n    }\n  }\n  \n": types.GetEventSuggestionsForGroupPlanDocument,
    "\n  mutation CreateGroupPlan($name: String) {\n    createGroupPlan(name: $name) {\n      groupPlan {\n        ...GroupPlanInfo\n      }\n    }\n  }\n  \n": types.CreateGroupPlanDocument,
    "\n  mutation AddEventToBucket($groupPlanId: ID!, $eventId: ID!) {\n    addEventToBucket(groupPlanId: $groupPlanId, eventId: $eventId) {\n      groupPlanEvent {\n        ...GroupPlanEventInfo\n      }\n    }\n  }\n  \n": types.AddEventToBucketDocument,
    "\n  mutation RemoveEventFromBucket($groupPlanEventId: ID!) {\n    removeEventFromBucket(groupPlanEventId: $groupPlanEventId) {\n      success\n    }\n  }\n": types.RemoveEventFromBucketDocument,
    "\n  mutation ReorderBucketEvents($groupPlanId: ID!, $orderedIds: [ID!]!) {\n    reorderBucketEvents(groupPlanId: $groupPlanId, orderedIds: $orderedIds) {\n      bucketEvents {\n        ...GroupPlanEventInfo\n      }\n    }\n  }\n  \n": types.ReorderBucketEventsDocument,
    "\n  mutation UpdateGroupPlanName($groupPlanId: ID!, $name: String!) {\n    updateGroupPlanName(groupPlanId: $groupPlanId, name: $name) {\n      groupPlan {\n        id\n        name\n        displayName\n      }\n    }\n  }\n": types.UpdateGroupPlanNameDocument,
    "\n  mutation OpenGroupPlanForVoting($groupPlanId: ID!) {\n    openGroupPlanForVoting(groupPlanId: $groupPlanId) {\n      groupPlan {\n        id\n        status\n      }\n    }\n  }\n": types.OpenGroupPlanForVotingDocument,
    "\n  mutation CloseGroupPlan($groupPlanId: ID!) {\n    closeGroupPlan(groupPlanId: $groupPlanId) {\n      groupPlan {\n        id\n        status\n      }\n    }\n  }\n": types.CloseGroupPlanDocument,
    "\n  mutation CreateVoterSession($shareToken: String!, $voterName: String) {\n    createVoterSession(shareToken: $shareToken, voterName: $voterName) {\n      voterSession {\n        ...VoterSessionInfo\n      }\n    }\n  }\n  \n": types.CreateVoterSessionDocument,
    "\n  mutation CastVote(\n    $groupPlanEventId: ID!\n    $sessionToken: String!\n    $direction: VoteDirectionEnum!\n  ) {\n    castVote(\n      groupPlanEventId: $groupPlanEventId\n      sessionToken: $sessionToken\n      direction: $direction\n    ) {\n      vote {\n        id\n        direction\n        castAt\n      }\n    }\n  }\n": types.CastVoteDocument,
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
export function graphql(source: "\n  fragment WeatherInfo on WeatherType {\n    city\n    condition\n    temperature\n    icon\n  }\n"): (typeof documents)["\n  fragment WeatherInfo on WeatherType {\n    city\n    condition\n    temperature\n    icon\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CategoryInfo on CategoryType {\n    id\n    name\n    slug\n    icon\n    color\n    description\n    isActive\n    sortOrder\n  }\n"): (typeof documents)["\n  fragment CategoryInfo on CategoryType {\n    id\n    name\n    slug\n    icon\n    color\n    description\n    isActive\n    sortOrder\n  }\n"];
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
export function graphql(source: "\n  fragment EventInfo on EventType {\n    id\n    name\n    description\n    image\n    date\n    endDate\n    locationName\n    moreDetailsUrl\n    price\n    ticketingEnabled\n    availableTickets\n    goingCount\n    hasGallery\n    galleryImages\n    galleryDescription\n    seriesName\n    isFree\n    isExternal\n    isInternal\n    isSaved\n    isGoing\n    hasConfirmedTicket\n    isEditorsPick\n    reason\n    source\n    curatorNote\n    curatorName\n    coordinates\n    createdAt\n    isActive\n    status\n    updatedAt\n    userStatus\n    category {\n      ...CategoryInfo\n    }\n  }\n  \n"): (typeof documents)["\n  fragment EventInfo on EventType {\n    id\n    name\n    description\n    image\n    date\n    endDate\n    locationName\n    moreDetailsUrl\n    price\n    ticketingEnabled\n    availableTickets\n    goingCount\n    hasGallery\n    galleryImages\n    galleryDescription\n    seriesName\n    isFree\n    isExternal\n    isInternal\n    isSaved\n    isGoing\n    hasConfirmedTicket\n    isEditorsPick\n    reason\n    source\n    curatorNote\n    curatorName\n    coordinates\n    createdAt\n    isActive\n    status\n    updatedAt\n    userStatus\n    category {\n      ...CategoryInfo\n    }\n  }\n  \n"];
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
export function graphql(source: "\n  fragment VoterInfo on VoterInfoType {\n    displayInitial\n    displayColor\n    voterName\n    profilePicture\n  }\n"): (typeof documents)["\n  fragment VoterInfo on VoterInfoType {\n    displayInitial\n    displayColor\n    voterName\n    profilePicture\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment GroupPlanEventInfo on GroupPlanEventType {\n    id\n    event {\n      ...EventInfo\n    }\n    addedBy {\n      ...UserBasic\n    }\n    ordering\n    interestedCount\n    voters {\n      ...VoterInfo\n    }\n    addedAt\n  }\n  \n  \n  \n"): (typeof documents)["\n  fragment GroupPlanEventInfo on GroupPlanEventType {\n    id\n    event {\n      ...EventInfo\n    }\n    addedBy {\n      ...UserBasic\n    }\n    ordering\n    interestedCount\n    voters {\n      ...VoterInfo\n    }\n    addedAt\n  }\n  \n  \n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment VoteInvitationInfo on VoteInvitationType {\n    id\n    shareToken\n    isActive\n    createdAt\n  }\n"): (typeof documents)["\n  fragment VoteInvitationInfo on VoteInvitationType {\n    id\n    shareToken\n    isActive\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment VoterSessionInfo on IndividualVoterSessionType {\n    id\n    sessionToken\n    displayInitial\n    displayColor\n    voterName\n    hasCompletedStack\n    myVotes\n  }\n"): (typeof documents)["\n  fragment VoterSessionInfo on IndividualVoterSessionType {\n    id\n    sessionToken\n    displayInitial\n    displayColor\n    voterName\n    hasCompletedStack\n    myVotes\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment GroupPlanInfo on GroupPlanType {\n    id\n    creator {\n      ...UserBasic\n    }\n    name\n    displayName\n    status\n    bucketEvents {\n      ...GroupPlanEventInfo\n    }\n    invitations {\n      ...VoteInvitationInfo\n    }\n    myVoterSession {\n      ...VoterSessionInfo\n    }\n    createdAt\n    updatedAt\n  }\n  \n  \n  \n  \n"): (typeof documents)["\n  fragment GroupPlanInfo on GroupPlanType {\n    id\n    creator {\n      ...UserBasic\n    }\n    name\n    displayName\n    status\n    bucketEvents {\n      ...GroupPlanEventInfo\n    }\n    invitations {\n      ...VoteInvitationInfo\n    }\n    myVoterSession {\n      ...VoterSessionInfo\n    }\n    createdAt\n    updatedAt\n  }\n  \n  \n  \n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CompleteOnboarding(\n    $allowLocationSharing: Boolean\n    $locationName: String\n    $location: [Float]\n    $allowPushNotifications: Boolean\n    $allowEmailNotifications: Boolean\n    $interests: [String]\n  ) {\n    completeOnboarding(\n      allowLocationSharing: $allowLocationSharing\n      locationName: $locationName\n      location: $location\n      allowPushNotifications: $allowPushNotifications\n      allowEmailNotifications: $allowEmailNotifications\n      interests: $interests\n    ) {\n      ok\n      user {\n        id\n        email\n        firstName\n        lastName\n        fullName\n        isEmailVerified\n        authProvider\n        profile {\n          isOnboardingCompleted\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CompleteOnboarding(\n    $allowLocationSharing: Boolean\n    $locationName: String\n    $location: [Float]\n    $allowPushNotifications: Boolean\n    $allowEmailNotifications: Boolean\n    $interests: [String]\n  ) {\n    completeOnboarding(\n      allowLocationSharing: $allowLocationSharing\n      locationName: $locationName\n      location: $location\n      allowPushNotifications: $allowPushNotifications\n      allowEmailNotifications: $allowEmailNotifications\n      interests: $interests\n    ) {\n      ok\n      user {\n        id\n        email\n        firstName\n        lastName\n        fullName\n        isEmailVerified\n        authProvider\n        profile {\n          isOnboardingCompleted\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetHome($offset: Int = 0, $limit: Int = 10, $timeFilter: String) {\n    getHome(offset: $offset, limit: $limit, timeFilter: $timeFilter) {\n      id\n      greeting\n      greetingPrompt\n      timeOfDay\n      dayOfWeek\n      cityName\n      profilePicture\n      userLocation\n      allowLocationSharing\n      weather {\n        ...WeatherInfo\n      }\n      categories {\n        ...CategoryInfo\n      }\n      editorsPick {\n        ...EventInfo\n      }\n      recommendations {\n        ...EventInfo\n      }\n      trending {\n        ...EventInfo\n      }\n      upcomingEvents {\n        ...EventInfo\n      }\n      nextSavedEvent {\n        ...EventInfo\n      }\n      activeTrip {\n        id\n        name\n        destination\n        startDate\n        endDate\n        coverImage\n        eventCount\n        events {\n          id\n        }\n      }\n    }\n  }\n  \n  \n  \n"): (typeof documents)["\n  query GetHome($offset: Int = 0, $limit: Int = 10, $timeFilter: String) {\n    getHome(offset: $offset, limit: $limit, timeFilter: $timeFilter) {\n      id\n      greeting\n      greetingPrompt\n      timeOfDay\n      dayOfWeek\n      cityName\n      profilePicture\n      userLocation\n      allowLocationSharing\n      weather {\n        ...WeatherInfo\n      }\n      categories {\n        ...CategoryInfo\n      }\n      editorsPick {\n        ...EventInfo\n      }\n      recommendations {\n        ...EventInfo\n      }\n      trending {\n        ...EventInfo\n      }\n      upcomingEvents {\n        ...EventInfo\n      }\n      nextSavedEvent {\n        ...EventInfo\n      }\n      activeTrip {\n        id\n        name\n        destination\n        startDate\n        endDate\n        coverImage\n        eventCount\n        events {\n          id\n        }\n      }\n    }\n  }\n  \n  \n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCategories {\n    getCategories {\n      ok\n      categories {\n        ...CategoryInfo\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  query GetCategories {\n    getCategories {\n      ok\n      categories {\n        ...CategoryInfo\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            hasSkippedOnboarding\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            hasSkippedOnboarding\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignUp(\n    $firstName: String!\n    $lastName: String\n    $email: String!\n    $password: String!\n  ) {\n    signUp(\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      password: $password\n    ) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            hasSkippedOnboarding\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SignUp(\n    $firstName: String!\n    $lastName: String\n    $email: String!\n    $password: String!\n  ) {\n    signUp(\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      password: $password\n    ) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            hasSkippedOnboarding\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation GoogleSignIn($idToken: String!) {\n    googleSignIn(idToken: $idToken) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            hasSkippedOnboarding\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation GoogleSignIn($idToken: String!) {\n    googleSignIn(idToken: $idToken) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            hasSkippedOnboarding\n            bio\n            locationName\n          }\n        }\n      }\n    }\n  }\n"];
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
export function graphql(source: "\n  query GetUser {\n    user {\n      id\n      email\n      firstName\n      lastName\n      profilePicture\n      isEmailVerified\n      authProvider\n      profile {\n        isOnboardingCompleted\n        hasSkippedOnboarding\n        bio\n        locationName\n        allowLocationSharing\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUser {\n    user {\n      id\n      email\n      firstName\n      lastName\n      profilePicture\n      isEmailVerified\n      authProvider\n      profile {\n        isOnboardingCompleted\n        hasSkippedOnboarding\n        bio\n        locationName\n        allowLocationSharing\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUserProfile {\n    userProfile {\n      isOnboardingCompleted\n      bio\n      locationName\n    }\n  }\n"): (typeof documents)["\n  query GetUserProfile {\n    userProfile {\n      isOnboardingCompleted\n      bio\n      locationName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEvent($id: ID!) {\n    event(id: $id) {\n      ok\n      event {\n        ...EventInfo\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  query GetEvent($id: ID!) {\n    event(id: $id) {\n      ok\n      event {\n        ...EventInfo\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEvents(\n    $search: String\n    $category: [ID]\n    $latitude: Float\n    $longitude: Float\n    $radiusKm: Float\n    $offset: Int\n    $limit: Int\n  ) {\n    events(\n      search: $search\n      category: $category\n      latitude: $latitude\n      longitude: $longitude\n      radiusKm: $radiusKm\n      offset: $offset\n      limit: $limit\n    ) {\n      ok\n      events {\n        ...EventInfo\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  query GetEvents(\n    $search: String\n    $category: [ID]\n    $latitude: Float\n    $longitude: Float\n    $radiusKm: Float\n    $offset: Int\n    $limit: Int\n  ) {\n    events(\n      search: $search\n      category: $category\n      latitude: $latitude\n      longitude: $longitude\n      radiusKm: $radiusKm\n      offset: $offset\n      limit: $limit\n    ) {\n      ok\n      events {\n        ...EventInfo\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetSavedEvents($offset: Int, $limit: Int) {\n    savedEvents(offset: $offset, limit: $limit) {\n      ok\n      totalCount\n      events {\n        ...EventInfo\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  query GetSavedEvents($offset: Int, $limit: Int) {\n    savedEvents(offset: $offset, limit: $limit) {\n      ok\n      totalCount\n      events {\n        ...EventInfo\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveEvent($id: ID!) {\n    saveEvent(id: $id) {\n      ok\n      event {\n        ...EventInfo\n      }\n      errors\n    }\n  }\n  \n"): (typeof documents)["\n  mutation SaveEvent($id: ID!) {\n    saveEvent(id: $id) {\n      ok\n      event {\n        ...EventInfo\n      }\n      errors\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UnsaveEvent($id: ID!) {\n    unsaveEvent(id: $id) {\n      ok\n      event {\n        ...EventInfo\n      }\n      errors\n    }\n  }\n  \n"): (typeof documents)["\n  mutation UnsaveEvent($id: ID!) {\n    unsaveEvent(id: $id) {\n      ok\n      event {\n        ...EventInfo\n      }\n      errors\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EnableLocation($locationName: String!, $location: [Float]!) {\n    enableLocation(locationName: $locationName, location: $location) {\n      ok\n      user {\n        id\n        profile {\n          locationName\n          allowLocationSharing\n          coordinates\n          hasLocation\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation EnableLocation($locationName: String!, $location: [Float]!) {\n    enableLocation(locationName: $locationName, location: $location) {\n      ok\n      user {\n        id\n        profile {\n          locationName\n          allowLocationSharing\n          coordinates\n          hasLocation\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DisableLocation {\n    disableLocation {\n      ok\n      user {\n        id\n        profile {\n          locationName\n          allowLocationSharing\n          coordinates\n          hasLocation\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DisableLocation {\n    disableLocation {\n      ok\n      user {\n        id\n        profile {\n          locationName\n          allowLocationSharing\n          coordinates\n          hasLocation\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SkipOnboarding {\n    skipOnboarding {\n      ok\n      user {\n        ...AuthUser\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  mutation SkipOnboarding {\n    skipOnboarding {\n      ok\n      user {\n        ...AuthUser\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUpcomingPlans($offset: Int, $limit: Int) {\n    upcomingPlans(offset: $offset, limit: $limit) {\n      ok\n      totalCount\n      events {\n        ...EventInfo\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  query GetUpcomingPlans($offset: Int, $limit: Int) {\n    upcomingPlans(offset: $offset, limit: $limit) {\n      ok\n      totalCount\n      events {\n        ...EventInfo\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPastPlans($offset: Int, $limit: Int) {\n    pastPlans(offset: $offset, limit: $limit) {\n      ok\n      totalCount\n      events {\n        ...EventInfo\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  query GetPastPlans($offset: Int, $limit: Int) {\n    pastPlans(offset: $offset, limit: $limit) {\n      ok\n      totalCount\n      events {\n        ...EventInfo\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation MarkGoing($id: ID!) {\n    markGoing(id: $id) {\n      ok\n      event {\n        ...EventInfo\n      }\n      errors\n    }\n  }\n  \n"): (typeof documents)["\n  mutation MarkGoing($id: ID!) {\n    markGoing(id: $id) {\n      ok\n      event {\n        ...EventInfo\n      }\n      errors\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UnmarkGoing($id: ID!) {\n    unmarkGoing(id: $id) {\n      ok\n      event {\n        ...EventInfo\n      }\n      errors\n    }\n  }\n  \n"): (typeof documents)["\n  mutation UnmarkGoing($id: ID!) {\n    unmarkGoing(id: $id) {\n      ok\n      event {\n        ...EventInfo\n      }\n      errors\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMyGroupPlans {\n    myGroupPlans {\n      id\n      creator {\n        ...UserBasic\n      }\n      name\n      displayName\n      status\n      bucketEvents {\n        id\n        event {\n          id\n          name\n          image\n          date\n        }\n        interestedCount\n      }\n      invitations {\n        id\n        shareToken\n        isActive\n      }\n      createdAt\n      updatedAt\n    }\n  }\n  \n"): (typeof documents)["\n  query GetMyGroupPlans {\n    myGroupPlans {\n      id\n      creator {\n        ...UserBasic\n      }\n      name\n      displayName\n      status\n      bucketEvents {\n        id\n        event {\n          id\n          name\n          image\n          date\n        }\n        interestedCount\n      }\n      invitations {\n        id\n        shareToken\n        isActive\n      }\n      createdAt\n      updatedAt\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetGroupPlan($id: ID!) {\n    groupPlan(id: $id) {\n      ...GroupPlanInfo\n    }\n  }\n  \n"): (typeof documents)["\n  query GetGroupPlan($id: ID!) {\n    groupPlan(id: $id) {\n      ...GroupPlanInfo\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetGroupPlanByShareToken($shareToken: String!) {\n    groupPlanByShareToken(shareToken: $shareToken) {\n      ...GroupPlanInfo\n    }\n  }\n  \n"): (typeof documents)["\n  query GetGroupPlanByShareToken($shareToken: String!) {\n    groupPlanByShareToken(shareToken: $shareToken) {\n      ...GroupPlanInfo\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEventSuggestionsForGroupPlan($groupPlanId: ID!, $date: Date) {\n    eventSuggestionsForGroupPlan(groupPlanId: $groupPlanId, date: $date) {\n      ...EventInfo\n    }\n  }\n  \n"): (typeof documents)["\n  query GetEventSuggestionsForGroupPlan($groupPlanId: ID!, $date: Date) {\n    eventSuggestionsForGroupPlan(groupPlanId: $groupPlanId, date: $date) {\n      ...EventInfo\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateGroupPlan($name: String) {\n    createGroupPlan(name: $name) {\n      groupPlan {\n        ...GroupPlanInfo\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  mutation CreateGroupPlan($name: String) {\n    createGroupPlan(name: $name) {\n      groupPlan {\n        ...GroupPlanInfo\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddEventToBucket($groupPlanId: ID!, $eventId: ID!) {\n    addEventToBucket(groupPlanId: $groupPlanId, eventId: $eventId) {\n      groupPlanEvent {\n        ...GroupPlanEventInfo\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  mutation AddEventToBucket($groupPlanId: ID!, $eventId: ID!) {\n    addEventToBucket(groupPlanId: $groupPlanId, eventId: $eventId) {\n      groupPlanEvent {\n        ...GroupPlanEventInfo\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveEventFromBucket($groupPlanEventId: ID!) {\n    removeEventFromBucket(groupPlanEventId: $groupPlanEventId) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveEventFromBucket($groupPlanEventId: ID!) {\n    removeEventFromBucket(groupPlanEventId: $groupPlanEventId) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ReorderBucketEvents($groupPlanId: ID!, $orderedIds: [ID!]!) {\n    reorderBucketEvents(groupPlanId: $groupPlanId, orderedIds: $orderedIds) {\n      bucketEvents {\n        ...GroupPlanEventInfo\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  mutation ReorderBucketEvents($groupPlanId: ID!, $orderedIds: [ID!]!) {\n    reorderBucketEvents(groupPlanId: $groupPlanId, orderedIds: $orderedIds) {\n      bucketEvents {\n        ...GroupPlanEventInfo\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateGroupPlanName($groupPlanId: ID!, $name: String!) {\n    updateGroupPlanName(groupPlanId: $groupPlanId, name: $name) {\n      groupPlan {\n        id\n        name\n        displayName\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateGroupPlanName($groupPlanId: ID!, $name: String!) {\n    updateGroupPlanName(groupPlanId: $groupPlanId, name: $name) {\n      groupPlan {\n        id\n        name\n        displayName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation OpenGroupPlanForVoting($groupPlanId: ID!) {\n    openGroupPlanForVoting(groupPlanId: $groupPlanId) {\n      groupPlan {\n        id\n        status\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation OpenGroupPlanForVoting($groupPlanId: ID!) {\n    openGroupPlanForVoting(groupPlanId: $groupPlanId) {\n      groupPlan {\n        id\n        status\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CloseGroupPlan($groupPlanId: ID!) {\n    closeGroupPlan(groupPlanId: $groupPlanId) {\n      groupPlan {\n        id\n        status\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CloseGroupPlan($groupPlanId: ID!) {\n    closeGroupPlan(groupPlanId: $groupPlanId) {\n      groupPlan {\n        id\n        status\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateVoterSession($shareToken: String!, $voterName: String) {\n    createVoterSession(shareToken: $shareToken, voterName: $voterName) {\n      voterSession {\n        ...VoterSessionInfo\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  mutation CreateVoterSession($shareToken: String!, $voterName: String) {\n    createVoterSession(shareToken: $shareToken, voterName: $voterName) {\n      voterSession {\n        ...VoterSessionInfo\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CastVote(\n    $groupPlanEventId: ID!\n    $sessionToken: String!\n    $direction: VoteDirectionEnum!\n  ) {\n    castVote(\n      groupPlanEventId: $groupPlanEventId\n      sessionToken: $sessionToken\n      direction: $direction\n    ) {\n      vote {\n        id\n        direction\n        castAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CastVote(\n    $groupPlanEventId: ID!\n    $sessionToken: String!\n    $direction: VoteDirectionEnum!\n  ) {\n    castVote(\n      groupPlanEventId: $groupPlanEventId\n      sessionToken: $sessionToken\n      direction: $direction\n    ) {\n      vote {\n        id\n        direction\n        castAt\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;