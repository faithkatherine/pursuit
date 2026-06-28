import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import { VoterSessionProvider, useVoterSession } from '../VoterSessionProvider';

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('VoterSessionProvider', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <VoterSessionProvider>{children}</VoterSessionProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide initial null session token', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useVoterSession(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.sessionToken).toBeNull();
  });

  it('should load existing session token on mount', async () => {
    const mockToken = 'existing-session-token';
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);

    const { result } = renderHook(() => useVoterSession(), { wrapper });

    await waitFor(() => {
      expect(result.current.sessionToken).toBe(mockToken);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should save session token', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useVoterSession(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const newToken = 'new-session-token';

    await act(async () => {
      await result.current.setSessionToken(newToken);
    });

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      'voter_session_token',
      newToken
    );
    expect(result.current.sessionToken).toBe(newToken);
  });

  it('should clear session token', async () => {
    const mockToken = 'existing-session-token';
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockToken);
    (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useVoterSession(), { wrapper });

    await waitFor(() => {
      expect(result.current.sessionToken).toBe(mockToken);
    });

    await act(async () => {
      await result.current.clearSession();
    });

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('voter_session_token');
    expect(result.current.sessionToken).toBeNull();
  });

  it('should handle errors when loading token', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(
      new Error('Failed to load')
    );

    const { result } = renderHook(() => useVoterSession(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result.current.sessionToken).toBeNull();

    consoleErrorSpy.mockRestore();
  });

  it('should throw error when used outside provider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useVoterSession());
    }).toThrow('useVoterSession must be used within a VoterSessionProvider');

    consoleErrorSpy.mockRestore();
  });
});
