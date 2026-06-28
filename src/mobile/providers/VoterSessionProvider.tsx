import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { VOTER_SESSION_KEY } from '@shared/hooks/useVoterSessionLogic';

interface VoterSessionContextType {
  sessionToken: string | null;
  setSessionToken: (token: string | null) => Promise<void>;
  clearSession: () => Promise<void>;
  isLoading: boolean;
}

const VoterSessionContext = createContext<VoterSessionContextType | undefined>(undefined);

export function VoterSessionProvider({ children }: { children: ReactNode }) {
  const [sessionToken, setSessionTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session token on mount
  useEffect(() => {
    loadSessionToken();
  }, []);

  const loadSessionToken = async () => {
    try {
      const token = await SecureStore.getItemAsync(VOTER_SESSION_KEY);
      setSessionTokenState(token);
    } catch (error) {
      console.error('Failed to load voter session token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setSessionToken = async (token: string | null) => {
    try {
      if (token) {
        await SecureStore.setItemAsync(VOTER_SESSION_KEY, token);
      } else {
        await SecureStore.deleteItemAsync(VOTER_SESSION_KEY);
      }
      setSessionTokenState(token);
    } catch (error) {
      console.error('Failed to save voter session token:', error);
      throw error;
    }
  };

  const clearSession = async () => {
    await setSessionToken(null);
  };

  return (
    <VoterSessionContext.Provider
      value={{
        sessionToken,
        setSessionToken,
        clearSession,
        isLoading,
      }}
    >
      {children}
    </VoterSessionContext.Provider>
  );
}

export function useVoterSession() {
  const context = useContext(VoterSessionContext);
  if (context === undefined) {
    throw new Error('useVoterSession must be used within a VoterSessionProvider');
  }
  return context;
}
