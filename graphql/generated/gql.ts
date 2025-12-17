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
    "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            location\n          }\n        }\n      }\n    }\n  }\n": typeof types.SignInDocument,
    "\n  mutation SignUp(\n    $firstName: String!\n    $lastName: String\n    $email: String!\n    $password: String!\n  ) {\n    signUp(\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      password: $password\n    ) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            location\n          }\n        }\n      }\n    }\n  }\n": typeof types.SignUpDocument,
    "\n  mutation GoogleSignIn($idToken: String!) {\n    googleSignIn(idToken: $idToken) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            location\n          }\n        }\n      }\n    }\n  }\n": typeof types.GoogleSignInDocument,
    "\n  mutation SignOut($refreshToken: String!) {\n    signOut(refreshToken: $refreshToken) {\n      ok\n    }\n  }\n": typeof types.SignOutDocument,
    "\n  mutation RefreshAccessToken($refreshToken: String!) {\n    refreshAccessToken(refreshToken: $refreshToken) {\n      ok\n      accessToken\n      refreshToken\n      expiresIn\n    }\n  }\n": typeof types.RefreshAccessTokenDocument,
    "\n  query GetUser {\n    user {\n      id\n      email\n      firstName\n      lastName\n      profilePicture\n      isEmailVerified\n      authProvider\n      profile {\n        isOnboardingCompleted\n        bio\n        location\n      }\n    }\n  }\n": typeof types.GetUserDocument,
    "\n  query GetUserProfile {\n    userProfile {\n      isOnboardingCompleted\n      bio\n      location\n    }\n  }\n": typeof types.GetUserProfileDocument,
};
const documents: Documents = {
    "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            location\n          }\n        }\n      }\n    }\n  }\n": types.SignInDocument,
    "\n  mutation SignUp(\n    $firstName: String!\n    $lastName: String\n    $email: String!\n    $password: String!\n  ) {\n    signUp(\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      password: $password\n    ) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            location\n          }\n        }\n      }\n    }\n  }\n": types.SignUpDocument,
    "\n  mutation GoogleSignIn($idToken: String!) {\n    googleSignIn(idToken: $idToken) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            location\n          }\n        }\n      }\n    }\n  }\n": types.GoogleSignInDocument,
    "\n  mutation SignOut($refreshToken: String!) {\n    signOut(refreshToken: $refreshToken) {\n      ok\n    }\n  }\n": types.SignOutDocument,
    "\n  mutation RefreshAccessToken($refreshToken: String!) {\n    refreshAccessToken(refreshToken: $refreshToken) {\n      ok\n      accessToken\n      refreshToken\n      expiresIn\n    }\n  }\n": types.RefreshAccessTokenDocument,
    "\n  query GetUser {\n    user {\n      id\n      email\n      firstName\n      lastName\n      profilePicture\n      isEmailVerified\n      authProvider\n      profile {\n        isOnboardingCompleted\n        bio\n        location\n      }\n    }\n  }\n": types.GetUserDocument,
    "\n  query GetUserProfile {\n    userProfile {\n      isOnboardingCompleted\n      bio\n      location\n    }\n  }\n": types.GetUserProfileDocument,
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
export function graphql(source: "\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            location\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SignIn($email: String!, $password: String!) {\n    signIn(email: $email, password: $password) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            location\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignUp(\n    $firstName: String!\n    $lastName: String\n    $email: String!\n    $password: String!\n  ) {\n    signUp(\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      password: $password\n    ) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            location\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SignUp(\n    $firstName: String!\n    $lastName: String\n    $email: String!\n    $password: String!\n  ) {\n    signUp(\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      password: $password\n    ) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            location\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation GoogleSignIn($idToken: String!) {\n    googleSignIn(idToken: $idToken) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            location\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation GoogleSignIn($idToken: String!) {\n    googleSignIn(idToken: $idToken) {\n      ok\n      authPayload {\n        accessToken\n        sessionToken\n        refreshToken\n        expiresIn\n        user {\n          id\n          email\n          firstName\n          lastName\n          profilePicture\n          isEmailVerified\n          authProvider\n          profile {\n            isOnboardingCompleted\n            bio\n            location\n          }\n        }\n      }\n    }\n  }\n"];
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
export function graphql(source: "\n  query GetUser {\n    user {\n      id\n      email\n      firstName\n      lastName\n      profilePicture\n      isEmailVerified\n      authProvider\n      profile {\n        isOnboardingCompleted\n        bio\n        location\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUser {\n    user {\n      id\n      email\n      firstName\n      lastName\n      profilePicture\n      isEmailVerified\n      authProvider\n      profile {\n        isOnboardingCompleted\n        bio\n        location\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUserProfile {\n    userProfile {\n      isOnboardingCompleted\n      bio\n      location\n    }\n  }\n"): (typeof documents)["\n  query GetUserProfile {\n    userProfile {\n      isOnboardingCompleted\n      bio\n      location\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;