import { useQuery, useMutation } from "@apollo/client";
import {
  GET_EVENTS,
  GET_SAVED_EVENTS,
  SAVE_EVENT,
  UNSAVE_EVENT,
} from "graphql/queries";
import {
  GetEventsQuery,
  GetSavedEventsQuery,
  SaveEventMutation,
  UnsaveEventMutation,
} from "graphql/generated/graphql";

export const useEvents = (filters?: {
  search?: string;
  category?: string[];
  offset?: number;
  limit?: number;
}) => {
  const result = useQuery<GetEventsQuery>(GET_EVENTS, {
    variables: {
      search: filters?.search || undefined,
      category: filters?.category?.length ? filters.category : undefined,
      offset: filters?.offset || 0,
      limit: filters?.limit || 20,
    },
    notifyOnNetworkStatusChange: true,
  });

  return {
    ...result,
    events: result.data?.events?.events || [],
  };
};

export const useSaveEvent = () => {
  return useMutation<SaveEventMutation>(SAVE_EVENT);
};

export const useUnsaveEvent = () => {
  return useMutation<UnsaveEventMutation>(UNSAVE_EVENT);
};

export const useSavedEvents = (offset = 0, limit = 20) => {
  const result = useQuery<GetSavedEventsQuery>(GET_SAVED_EVENTS, {
    variables: { offset, limit },
    notifyOnNetworkStatusChange: true,
  });

  return {
    ...result,
    savedEvents: result.data?.savedEvents?.events || [],
  };
};
