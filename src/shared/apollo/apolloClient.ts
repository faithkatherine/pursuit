import { ApolloClient, from, createHttpLink, type ApolloLink } from "@apollo/client";
import { createApolloCache } from "./fieldPolicies";

interface CreateApolloClientOptions {
  uri: string;
  authLink: ApolloLink;
  errorLink: ApolloLink;
}

export const createApolloClient = ({
  uri,
  authLink,
  errorLink,
}: CreateApolloClientOptions) => {
  const httpLink = createHttpLink({ uri });
  const link = from([errorLink, authLink, httpLink]);
  const fetchPolicy = "cache-and-network" as const;

  return new ApolloClient({
    link,
    cache: createApolloCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: "all",
        fetchPolicy,
        notifyOnNetworkStatusChange: true,
      },
      query: {
        errorPolicy: "all",
      },
    },
  });
};
