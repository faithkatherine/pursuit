export const VOTER_SESSION_KEY = "voter_session_token";

export const getVoterSessionStorageKey = (shareToken?: string | null) =>
  shareToken ? `${VOTER_SESSION_KEY}:${shareToken}` : VOTER_SESSION_KEY;

export const resolveSessionToken = (
  tokenByShareToken: Record<string, string | null>,
  shareToken?: string | null,
) => {
  if (!shareToken) {
    return null;
  }

  return tokenByShareToken[shareToken] ?? null;
};

export const hasCompletedStack = (
  votedEventIds: readonly string[],
  skippedEventIds: readonly string[],
  totalBucketEvents: number,
) => votedEventIds.length + skippedEventIds.length >= totalBucketEvents;
