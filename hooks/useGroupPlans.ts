import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_GROUP_PLAN,
  GET_MY_GROUP_PLANS,
  GET_GROUP_PLAN,
  GET_GROUP_PLAN_BY_SHARE_TOKEN,
  ADD_EVENT_TO_BUCKET,
  REMOVE_EVENT_FROM_BUCKET,
  REORDER_BUCKET_EVENTS,
  UPDATE_GROUP_PLAN_NAME,
  OPEN_GROUP_PLAN_FOR_VOTING,
  CLOSE_GROUP_PLAN,
  CREATE_VOTER_SESSION,
  CAST_VOTE,
  GET_EVENT_SUGGESTIONS_FOR_GROUP_PLAN,
} from '@shared/graphql/queries';
import { useVoterSession } from '@mobile/providers/VoterSessionProvider';

export function useCreateGroupPlan() {
  const [createGroupPlan, { loading, error }] = useMutation(CREATE_GROUP_PLAN, {
    refetchQueries: ['GetMyGroupPlans'],
  });

  return {
    createGroupPlan: async (name?: string) => {
      const result = await createGroupPlan({
        variables: { name },
      });
      return result.data?.createGroupPlan?.groupPlan;
    },
    loading,
    error,
  };
}

export function useMyGroupPlans() {
  const { data, loading, error, refetch } = useQuery(GET_MY_GROUP_PLANS);

  return {
    groupPlans: data?.myGroupPlans || [],
    loading,
    error,
    refetch,
  };
}

export function useGroupPlan(id?: string) {
  const { data, loading, error, refetch } = useQuery(GET_GROUP_PLAN, {
    variables: { id },
    skip: !id,
  });

  return {
    groupPlan: data?.groupPlan,
    loading,
    error,
    refetch,
  };
}

export function useGroupPlanByShareToken(shareToken?: string) {
  const { data, loading, error, refetch } = useQuery(GET_GROUP_PLAN_BY_SHARE_TOKEN, {
    variables: { shareToken },
    skip: !shareToken,
    context: {
      headers: {
        // Pass voter session token if available
        'X-Voter-Session-Token': useVoterSession().sessionToken || '',
      },
    },
  });

  return {
    groupPlan: data?.groupPlanByShareToken,
    loading,
    error,
    refetch,
  };
}

export function useAddEventToBucket() {
  const [addEvent, { loading, error }] = useMutation(ADD_EVENT_TO_BUCKET, {
    refetchQueries: ['GetGroupPlan', 'GetEventSuggestionsForGroupPlan'],
  });

  return {
    addEvent: async (groupPlanId: string, eventId: string) => {
      const result = await addEvent({
        variables: { groupPlanId, eventId },
      });
      return result.data?.addEventToBucket?.groupPlanEvent;
    },
    loading,
    error,
  };
}

export function useRemoveEventFromBucket() {
  const [removeEvent, { loading, error }] = useMutation(REMOVE_EVENT_FROM_BUCKET, {
    refetchQueries: ['GetGroupPlan', 'GetEventSuggestionsForGroupPlan'],
  });

  return {
    removeEvent: async (groupPlanEventId: string) => {
      await removeEvent({
        variables: { groupPlanEventId },
      });
    },
    loading,
    error,
  };
}

export function useReorderBucketEvents() {
  const [reorderEvents, { loading, error }] = useMutation(REORDER_BUCKET_EVENTS);

  return {
    reorderEvents: async (groupPlanId: string, orderedIds: string[]) => {
      const result = await reorderEvents({
        variables: { groupPlanId, orderedIds },
      });
      return result.data?.reorderBucketEvents?.bucketEvents;
    },
    loading,
    error,
  };
}

export function useUpdateGroupPlanName() {
  const [updateName, { loading, error }] = useMutation(UPDATE_GROUP_PLAN_NAME, {
    refetchQueries: ['GetGroupPlan', 'GetMyGroupPlans'],
  });

  return {
    updateName: async (groupPlanId: string, name: string) => {
      await updateName({
        variables: { groupPlanId, name },
      });
    },
    loading,
    error,
  };
}

export function useOpenGroupPlanForVoting() {
  const [openForVoting, { loading, error }] = useMutation(OPEN_GROUP_PLAN_FOR_VOTING, {
    refetchQueries: ['GetGroupPlan', 'GetMyGroupPlans'],
  });

  return {
    openForVoting: async (groupPlanId: string) => {
      await openForVoting({
        variables: { groupPlanId },
      });
    },
    loading,
    error,
  };
}

export function useCloseGroupPlan() {
  const [closePlan, { loading, error }] = useMutation(CLOSE_GROUP_PLAN, {
    refetchQueries: ['GetGroupPlan', 'GetMyGroupPlans'],
  });

  return {
    closePlan: async (groupPlanId: string) => {
      await closePlan({
        variables: { groupPlanId },
      });
    },
    loading,
    error,
  };
}

export function useCreateVoterSession() {
  const { setSessionToken } = useVoterSession();
  const [createSession, { loading, error }] = useMutation(CREATE_VOTER_SESSION);

  return {
    createSession: async (shareToken: string, voterName?: string) => {
      const result = await createSession({
        variables: { shareToken, voterName },
      });
      const session = result.data?.createVoterSession?.voterSession;
      if (session?.sessionToken) {
        await setSessionToken(session.sessionToken);
      }
      return session;
    },
    loading,
    error,
  };
}

export function useCastVote() {
  const { sessionToken } = useVoterSession();
  const [castVote, { loading, error }] = useMutation(CAST_VOTE, {
    refetchQueries: ['GetGroupPlanByShareToken'],
  });

  return {
    castVote: async (groupPlanEventId: string, direction: 'INTERESTED' | 'SKIP') => {
      if (!sessionToken) {
        throw new Error('No voter session token found');
      }
      const result = await castVote({
        variables: {
          groupPlanEventId,
          sessionToken,
          direction,
        },
      });
      return result.data?.castVote?.vote;
    },
    loading,
    error,
  };
}

export function useEventSuggestionsForGroupPlan(groupPlanId?: string, date?: string) {
  const { data, loading, error, refetch } = useQuery(GET_EVENT_SUGGESTIONS_FOR_GROUP_PLAN, {
    variables: { groupPlanId, date },
    skip: !groupPlanId,
  });

  return {
    suggestions: data?.eventSuggestionsForGroupPlan || [],
    loading,
    error,
    refetch,
  };
}
