import { ApolloLink, Observable } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { Platform } from "react-native";
import { createApolloClient } from "@shared/apollo";
import { getTokens, storeTokens, clearAllData } from "@mobile/utils/secureStorage";

const getApiUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:8000/graphql/";
  }

  if (Platform.OS === "ios") {
    return "http://localhost:8000/graphql/";
  }

  return "http://localhost:8000/graphql/";
};

const apiUrl = getApiUrl();

console.log(
  `[Apollo Client] Platform: ${Platform.OS}, Using API URL: ${apiUrl}`,
);

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

const authLink = setContext(async (_, { headers }) => {
  const tokens = await getTokens();
  const token = tokens.accessToken;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (
          err.extensions?.code === "TOKEN_EXPIRED" ||
          err.extensions?.code === "NOT_AUTHENTICATED" ||
          err.message?.includes("Token has expired") ||
          err.message?.includes("Not authenticated")
        ) {
          console.log("[Apollo] Token expired, attempting refresh...");

          if (!isRefreshing) {
            isRefreshing = true;

            return new Observable((observer) => {
              getTokens()
                .then(async (tokens) => {
                  if (!tokens.refreshToken) {
                    throw new Error("No refresh token available");
                  }

                  const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      query: `
                        mutation RefreshAccessToken($refreshToken: String!) {
                          refreshAccessToken(refreshToken: $refreshToken) {
                            ok
                            accessToken
                            refreshToken
                            expiresIn
                          }
                        }
                      `,
                      variables: { refreshToken: tokens.refreshToken },
                    }),
                  });

                  const result = await response.json();

                  if (result.data?.refreshAccessToken?.ok) {
                    const { accessToken, refreshToken } =
                      result.data.refreshAccessToken;

                    await storeTokens({
                      accessToken,
                      refreshToken,
                      sessionToken: tokens.sessionToken ?? undefined,
                    });

                    pendingRequests.forEach((callback) => callback());
                    pendingRequests = [];
                  } else {
                    throw new Error("Token refresh failed");
                  }
                })
                .catch(async (error) => {
                  await clearAllData();
                  pendingRequests = [];
                  observer.error(error);
                })
                .finally(() => {
                  isRefreshing = false;
                })
                .then(() => {
                  forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                  });
                });
            });
          }

          return new Observable((observer) => {
            pendingRequests.push(() => {
              forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              });
            });
          });
        }
      }
    }

    if (networkError) {
      console.error("[Apollo] Network error:", networkError);
    }
  },
);

export const client = createApolloClient({
  uri: apiUrl,
  authLink: authLink as ApolloLink,
  errorLink,
});
