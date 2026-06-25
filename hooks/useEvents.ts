import { useQuery, useMutation } from "@apollo/client";
import {
  GET_EVENTS,
  GET_SAVED_EVENTS,
  SAVE_EVENT,
  UNSAVE_EVENT,
  MARK_GOING,
  UNMARK_GOING,
} from "graphql/queries";
import {
  GetEventsQuery,
  GetSavedEventsQuery,
  SaveEventMutation,
  UnsaveEventMutation,
  MarkGoingMutation,
  UnmarkGoingMutation,
} from "graphql/generated/graphql";

export const useEvents = (filters?: {
  search?: string;
  category?: string[];
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  offset?: number;
  limit?: number;
}) => {
  const result = useQuery<GetEventsQuery>(GET_EVENTS, {
    variables: {
      search: filters?.search || undefined,
      category: filters?.category?.length ? filters.category : undefined,
      latitude: filters?.latitude,
      longitude: filters?.longitude,
      radiusKm: filters?.radiusKm,
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

export const useMarkGoing = () => {
  return useMutation<MarkGoingMutation>(MARK_GOING);
};

export const useUnmarkGoing = () => {
  return useMutation<UnmarkGoingMutation>(UNMARK_GOING);
};
