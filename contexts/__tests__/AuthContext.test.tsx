import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, useAuth } from '../AuthContext';
import { Alert } from 'react-native';

// Mock Alert
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Alert: {
    alert: jest.fn(),
  },
}));

// Test component to access the auth context
const TestComponent = ({ onAuthReady }: { onAuthReady?: (auth: any) => void }) => {
  const auth = useAuth();
  
  React.useEffect(() => {
    if (onAuthReady) {
      onAuthReady(auth);
    }
  }, [auth, onAuthReady]);

  return null;
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should provide initial authentication state', async () => {
    let authContext: any;

    render(
      <AuthProvider>
        <TestComponent onAuthReady={(auth) => { authContext = auth; }} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(authContext).toBeDefined();
      expect(authContext.user).toBeNull();
      expect(authContext.isAuthenticated).toBe(false);
      expect(authContext.isLoading).toBe(false);
    });
  });

  it('should load stored user on initialization', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      avatar: 'test-avatar-url',
    };

    AsyncStorage.setItem('pursuit_auth_user', JSON.stringify(mockUser));

    let authContext: any;

    render(
      <AuthProvider>
        <TestComponent onAuthReady={(auth) => { authContext = auth; }} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(authContext.user).toEqual(mockUser);
      expect(authContext.isAuthenticated).toBe(true);
      expect(authContext.isLoading).toBe(false);
    });
  });

  it('should sign in successfully with valid credentials', async () => {
    let authContext: any;

    render(
      <AuthProvider>
        <TestComponent onAuthReady={(auth) => { authContext = auth; }} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(authContext).toBeDefined();
    });

    const result = await act(async () => {
      return authContext.signIn('test@example.com', 'password123');
    });

    expect(result).toBe(true);
    expect(authContext.user).toMatchObject({
      name: 'test',
      email: 'test@example.com',
    });
    expect(authContext.isAuthenticated).toBe(true);
  });

  it('should fail sign in with invalid credentials', async () => {
    let authContext: any;

    render(
      <AuthProvider>
        <TestComponent onAuthReady={(auth) => { authContext = auth; }} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(authContext).toBeDefined();
    });

    const result = await act(async () => {
      return authContext.signIn('test@example.com', '123');
    });

    expect(result).toBe(false);
    expect(authContext.user).toBeNull();
    expect(authContext.isAuthenticated).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith('Sign In Failed', 'Please check your email and password.');
  });

  it('should sign up successfully with valid data', async () => {
    let authContext: any;

    render(
      <AuthProvider>
        <TestComponent onAuthReady={(auth) => { authContext = auth; }} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(authContext).toBeDefined();
    });

    const result = await act(async () => {
      return authContext.signUp('Test User', 'test@example.com', 'password123');
    });

    expect(result).toBe(true);
    expect(authContext.user).toMatchObject({
      name: 'Test User',
      email: 'test@example.com',
    });
    expect(authContext.isAuthenticated).toBe(true);
  });

  it('should fail sign up with invalid data', async () => {
    let authContext: any;

    render(
      <AuthProvider>
        <TestComponent onAuthReady={(auth) => { authContext = auth; }} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(authContext).toBeDefined();
    });

    const result = await act(async () => {
      return authContext.signUp('', 'invalid-email', '123');
    });

    expect(result).toBe(false);
    expect(authContext.user).toBeNull();
    expect(authContext.isAuthenticated).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith('Sign Up Failed', 'Please fill in all fields and ensure password is at least 6 characters.');
  });

  it('should sign out successfully', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    };

    AsyncStorage.setItem('pursuit_auth_user', JSON.stringify(mockUser));

    let authContext: any;

    render(
      <AuthProvider>
        <TestComponent onAuthReady={(auth) => { authContext = auth; }} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(authContext.user).toEqual(mockUser);
      expect(authContext.isAuthenticated).toBe(true);
    });

    await act(async () => {
      await authContext.signOut();
    });

    expect(authContext.user).toBeNull();
    expect(authContext.isAuthenticated).toBe(false);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('pursuit_auth_user');
  });

  it('should handle AsyncStorage errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('AsyncStorage error'));

    let authContext: any;

    render(
      <AuthProvider>
        <TestComponent onAuthReady={(auth) => { authContext = auth; }} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(authContext.isLoading).toBe(false);
      expect(authContext.user).toBeNull();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Error loading stored user:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should throw error when useAuth is used outside AuthProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });
});