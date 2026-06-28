import { useQuery } from "@apollo/client";
import { GET_HOME } from "@shared/graphql/queries";
import { GetHomeQuery } from "@shared/graphql/generated/graphql";

export const useHomeData = (timeFilter?: string | null) => {
  // cache-and-network: last known results render instantly while the network
  // refreshes in the background, keeping home stable after a save mutation.
  const fetchPolicy = "cache-and-network" as const;

  return useQuery<GetHomeQuery>(GET_HOME, {
    variables: {
      offset: 0,
      limit: 5,
      timeFilter: timeFilter || undefined,
    },
    fetchPolicy,
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    // No skip condition - reconciliation completes in _layout before home mounts
  });
};
