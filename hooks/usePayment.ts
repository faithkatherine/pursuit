import { useState, useEffect, useRef, useCallback } from "react";

import { getTokens, storeTokens } from "utils/secureStorage";

interface TierSelection {
  tier_id: number;
  quantity: number;
}

type PaymentStatus =
  | "idle"
  | "initiating"
  | "waiting"
  | "paid"
  | "failed"
  | "expired";

interface PaymentState {
  status: PaymentStatus;
  checkoutRequestId: string | null;
  orderId: string | null;
  receipt: string | null;
  error: string | null;
  resuming: boolean;
}

interface UsePaymentReturn extends PaymentState {
  initiate: (
    eventId: number,
    phoneNumber: string,
    tiers: TierSelection[],
    userDetails: { name: string; email: string }
  ) => Promise<void>;
  cancel: () => void;
  reset: () => void;
}

interface InitiatePaymentResponse {
  id: string;
  checkout_request_id: string;
  resuming?: boolean;
}

interface PaymentStatusResponse {
  status: "pending" | "paid" | "failed" | "expired";
  order_id: string;
  mpesa_receipt: string | null;
}

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 90000;
const getRestApiBaseUrl = (): string => {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!configuredUrl) return "http://localhost:8000";
  return configuredUrl.replace(/\/graphql\/?$/, "");
};

const API_BASE_URL = getRestApiBaseUrl();

const refreshAccessToken = async (): Promise<string | null> => {
  const tokens = await getTokens();
  if (!tokens.refreshToken) return null;

  const graphqlUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/graphql/";

  try {
    const response = await fetch(graphqlUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      const { accessToken, refreshToken: newRefreshToken } = result.data.refreshAccessToken;
      await storeTokens({
        accessToken,
        refreshToken: newRefreshToken,
        sessionToken: tokens.sessionToken,
      });
      return accessToken;
    }
  } catch (error) {
    console.error("[usePayment] Token refresh failed:", error);
  }

  return null;
};

const initialState: PaymentState = {
  status: "idle",
  checkoutRequestId: null,
  orderId: null,
  receipt: null,
  error: null,
  resuming: false,
};

const getErrorMessage = async (response: Response): Promise<string> => {
  const body = await response.json().catch(() => null);
  if (typeof body?.error === "string") return body.error;
  if (typeof body?.detail === "string") return body.detail;
  return "Payment could not be started. Please try again.";
};

export const usePayment = (): UsePaymentReturn => {
  const [state, setState] = useState<PaymentState>(initialState);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (checkoutRequestId: string) => {
      clearPolling();

      const poll = async () => {
        try {
          const tokens = await getTokens();
          if (!tokens.accessToken) {
            throw new Error("Missing auth token");
          }

          const response = await fetch(
            `${API_BASE_URL}/api/payments/status/${checkoutRequestId}/`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
              },
            },
          );

          if (!response.ok) return;

          const result = (await response.json()) as PaymentStatusResponse;

          if (result.status === "paid") {
            clearPolling();
            setState((prev) => ({
              ...prev,
              status: "paid",
              orderId: result.order_id,
              receipt: result.mpesa_receipt,
              error: null,
            }));
            return;
          }

          if (result.status === "failed") {
            clearPolling();
            setState((prev) => ({
              ...prev,
              status: "failed",
              orderId: result.order_id,
              receipt: result.mpesa_receipt,
              error: "Payment unsuccessful. Please try again.",
            }));
            return;
          }

          if (result.status === "expired") {
            clearPolling();
            setState((prev) => ({
              ...prev,
              status: "expired",
              orderId: result.order_id,
              error: "Payment timed out. Please try again.",
            }));
          }
        } catch {
          // Keep polling through transient network failures.
        }
      };

      void poll();
      pollIntervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
      pollTimeoutRef.current = setTimeout(() => {
        clearPolling();
        setState((prev) => ({
          ...prev,
          status: "failed",
          error: "Payment timed out. Please try again.",
        }));
      }, POLL_TIMEOUT_MS);
    },
    [clearPolling],
  );

  const initiate = useCallback(
    async (eventId: number, phoneNumber: string, tiers: TierSelection[], userDetails: { name: string; email: string }) => {
      clearPolling();
      setState({
        status: "initiating",
        checkoutRequestId: null,
        orderId: null,
        receipt: null,
        error: null,
        resuming: false,
      });

      try {
        const tokens = await getTokens();
        if (!tokens.accessToken) {
          throw new Error("Sign in again to continue.");
        }

        console.log("[usePayment] initiate called", { eventId, phoneNumber, tiers, userDetails });
        const response = await fetch(`${API_BASE_URL}/api/payments/initiate/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_id: eventId,
            phone_number: phoneNumber,
            tiers,
            name: userDetails.name,
            email: userDetails.email,
          }),
        });

        console.log("[usePayment] response status", response.status);

        if (!response.ok) {
          const errorMessage = await getErrorMessage(response);
          console.log("[usePayment] error response", errorMessage);

          if (response.status === 403 && errorMessage.includes("Token has expired")) {
            console.log("[usePayment] Token expired, attempting refresh and retry");
            const newToken = await refreshAccessToken();

            if (newToken) {
              const retryResponse = await fetch(`${API_BASE_URL}/api/payments/initiate/`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${newToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  event_id: eventId,
                  phone_number: phoneNumber,
                  tiers,
                  name: userDetails.name,
                  email: userDetails.email,
                }),
              });

              console.log("[usePayment] retry response status", retryResponse.status);

              if (retryResponse.ok) {
                const result = (await retryResponse.json()) as InitiatePaymentResponse;
                setState((prev) => ({
                  ...prev,
                  status: "waiting",
                  checkoutRequestId: result.checkout_request_id,
                  orderId: result.id,
                  error: null,
                  resuming: result.resuming ?? false,
                }));
                startPolling(result.checkout_request_id);
                return;
              } else {
                const retryError = await getErrorMessage(retryResponse);
                console.log("[usePayment] retry failed", retryError);
                setState((prev) => ({
                  ...prev,
                  status: "idle",
                  error: retryError,
                }));
                return;
              }
            } else {
              setState((prev) => ({
                ...prev,
                status: "idle",
                error: "Session expired. Please sign in again.",
              }));
              return;
            }
          }

          if (response.status === 429) {
            setState((prev) => ({
              ...prev,
              status: "idle",
              error: "A payment is already in progress",
            }));
            return;
          }

          if (response.status === 400 && errorMessage.includes("already_purchased")) {
            setState((prev) => ({
              ...prev,
              status: "idle",
              error: "already_purchased",
            }));
            return;
          }

          setState((prev) => ({
            ...prev,
            status: "idle",
            error: errorMessage,
          }));
          return;
        }

        const result = (await response.json()) as InitiatePaymentResponse;
        setState((prev) => ({
          ...prev,
          status: "waiting",
          checkoutRequestId: result.checkout_request_id,
          orderId: result.id,
          error: null,
          resuming: result.resuming ?? false,
        }));
        startPolling(result.checkout_request_id);
      } catch (error) {
        const message =
          error instanceof Error && error.message === "Sign in again to continue."
            ? error.message
            : "Check your connection and try again";
        setState((prev) => ({
          ...prev,
          status: "idle",
          error: message,
        }));
      }
    },
    [clearPolling, startPolling],
  );

  const cancel = useCallback(() => {
    clearPolling();
    setState((prev) => ({ ...prev, status: "idle", error: null }));
  }, [clearPolling]);

  const reset = useCallback(() => {
    clearPolling();
    setState(initialState);
  }, [clearPolling]);

  useEffect(() => {
    return () => clearPolling();
  }, [clearPolling]);

  return { ...state, initiate, cancel, reset };
};
