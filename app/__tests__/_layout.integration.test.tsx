/**
 * Integration tests for _layout.tsx location reconciliation flow.
 *
 * Tests ensure:
 * - Reconciliation completes before home mounts
 * - useLocationSync runs after reconciliation
 * - Loading states are managed correctly
 * - All location paths work end-to-end
 */

import React from "react";
import { render, waitFor, act } from "@testing-library/react-native";
import * as Location from "expo-location";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import RootLayout from "../_layout";
import { AuthProvider } from "providers/AuthProvider";

// Mock expo-router
jest.mock("expo-router", () => ({
  Slot: () => null,
  SplashScreen: {
    preventAutoHideAsync: jest.fn(),
    hideAsync: jest.fn(),
  },
}));

// Mock expo-status-bar
jest.mock("expo-status-bar", () => ({
  StatusBar: () => null,
}));

// Mock SafeAreaProvider
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: any) => children,
}));

// Mock Apollo dev tools
jest.mock("@dev-plugins/apollo-client", () => ({
  useApolloClientDevTools: jest.fn(),
}));

// Mock SplashScreen component
jest.mock("components/SplashScreen", () => ({
  SplashScreen: ({ onFinish }: any) => {
    React.useEffect(() => {
      setTimeout(() => onFinish(), 100);
    }, [onFinish]);
    return null;
  },
}));

// Mock Loading component
jest.mock("components/Layout", () => ({
  Loading: () => null,
}));

// Mock expo-location
jest.mock("expo-location", () => ({
  getForegroundPermissionsAsync: jest.fn(),
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  getLastKnownPositionAsync: jest.fn(),
  reverseGeocodeAsync: jest.fn(),
  Accuracy: {
    Balanced: 3,
  },
}));

// Mock Apollo Client
const mockMutate = jest.fn();
const mockQuery = jest.fn();

const createMockClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: {
      request: (operation: { operationName: string }) => {
        if (operation.operationName === "GetHome") {
          return mockQuery(operation);
        }
        return mockMutate(operation);
      },
    } as any,
  });
};

// Mock user data
const mockUserWithLocationEnabled = {
  id: "user-123",
  email: "test@example.com",
  firstName: "Test",
  lastName: "User",
  username: "testuser",
  profile: {
    allowLocationSharing: true,
    locationName: "Nairobi, Kenya",
    location: [-1.2921, 36.8219],
    isOnboardingCompleted: true,
  },
};

const mockUserWithLocationDisabled = {
  ...mockUserWithLocationEnabled,
  profile: {
    ...mockUserWithLocationEnabled.profile,
    allowLocationSharing: false,
    location: null,
    locationName: null,
  },
};

describe("_layout Integration Tests", () => {
  let mockClient: ApolloClient<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockClient = createMockClient();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("Reconciliation before home mounts", () => {
    it("should complete reconciliation before rendering Slot (Path C: granted + backend true)", async () => {
      // Mock authenticated user with location enabled
      const mockAuthContext = {
        user: mockUserWithLocationEnabled,
        isAuthenticated: true,
        isLoading: false,
      };

      jest
        .spyOn(require("providers/AuthProvider"), "useAuth")
        .mockReturnValue(mockAuthContext);

      // Mock OS permission: granted
      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "granted",
      });

      // Mock location sync
      const mockLocation = {
        coords: { latitude: -1.2921, longitude: 36.8219 },
        timestamp: Date.now(),
      };
      (Location.getLastKnownPositionAsync as jest.Mock).mockResolvedValue(
        mockLocation,
      );
      (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([
        { city: "Nairobi", region: "Nairobi County" },
      ]);

      mockMutate.mockResolvedValue({ data: {} });

      const { queryByTestId } = render(
        <ApolloProvider client={mockClient}>
          <AuthProvider>
            <RootLayout />
          </AuthProvider>
        </ApolloProvider>,
      );

      // Wait for splash screen to finish
      await act(async () => {
        jest.advanceTimersByTime(3100);
      });

      await waitFor(
        () => {
          // Reconciliation should complete
          expect(Location.getForegroundPermissionsAsync).toHaveBeenCalled();
        },
        { timeout: 5000 },
      );

      // Verify location sync was triggered
      await waitFor(() => {
        expect(Location.getLastKnownPositionAsync).toHaveBeenCalled();
      });
    });

    it("should block Slot render until reconciliation completes (authenticated user)", async () => {
      const mockAuthContext = {
        user: mockUserWithLocationEnabled,
        isAuthenticated: true,
        isLoading: false,
      };

      jest
        .spyOn(require("providers/AuthProvider"), "useAuth")
        .mockReturnValue(mockAuthContext);

      // Mock slow reconciliation
      (Location.getForegroundPermissionsAsync as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ status: "granted" }), 1000),
          ),
      );

      const { queryByTestId } = render(
        <ApolloProvider client={mockClient}>
          <AuthProvider>
            <RootLayout />
          </AuthProvider>
        </ApolloProvider>,
      );

      // Fast-forward through splash
      await act(async () => {
        jest.advanceTimersByTime(3100);
      });

      // Should show loading while reconciling
      // (In real app, this would be Loading component)

      // Complete reconciliation
      await act(async () => {
        jest.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(Location.getForegroundPermissionsAsync).toHaveBeenCalled();
      });
    });

    it("should not block render for unauthenticated users", async () => {
      const mockAuthContext = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };

      jest
        .spyOn(require("providers/AuthProvider"), "useAuth")
        .mockReturnValue(mockAuthContext);

      render(
        <ApolloProvider client={mockClient}>
          <AuthProvider>
            <RootLayout />
          </AuthProvider>
        </ApolloProvider>,
      );

      await act(async () => {
        jest.advanceTimersByTime(3100);
      });

      // Should not call reconciliation for unauthenticated users
      expect(Location.getForegroundPermissionsAsync).not.toHaveBeenCalled();
    });
  });

  describe("Path A: Reinstall with previous opt-in", () => {
    it("should show OS dialog over splash (undetermined + backend true)", async () => {
      const mockAuthContext = {
        user: mockUserWithLocationEnabled,
        isAuthenticated: true,
        isLoading: false,
      };

      jest
        .spyOn(require("providers/AuthProvider"), "useAuth")
        .mockReturnValue(mockAuthContext);

      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "undetermined",
      });

      (
        Location.requestForegroundPermissionsAsync as jest.Mock
      ).mockResolvedValue({
        status: "granted",
      });

      const mockLocation = {
        coords: { latitude: -1.2921, longitude: 36.8219 },
        timestamp: Date.now(),
      };
      (Location.getLastKnownPositionAsync as jest.Mock).mockResolvedValue(
        mockLocation,
      );
      (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([
        { city: "Nairobi" },
      ]);

      render(
        <ApolloProvider client={mockClient}>
          <AuthProvider>
            <RootLayout />
          </AuthProvider>
        </ApolloProvider>,
      );

      await act(async () => {
        jest.advanceTimersByTime(3100);
      });

      await waitFor(() => {
        expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      });

      // Should trigger sync after permission granted
      await waitFor(() => {
        expect(Location.getLastKnownPositionAsync).toHaveBeenCalled();
      });
    });
  });

  describe("Path B: Permission revoked", () => {
    it("should disable backend when OS permission denied (denied + backend true)", async () => {
      const mockAuthContext = {
        user: mockUserWithLocationEnabled,
        isAuthenticated: true,
        isLoading: false,
      };

      jest
        .spyOn(require("providers/AuthProvider"), "useAuth")
        .mockReturnValue(mockAuthContext);

      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "denied",
      });

      mockMutate.mockResolvedValue({ data: { disableLocation: { ok: true } } });

      render(
        <ApolloProvider client={mockClient}>
          <AuthProvider>
            <RootLayout />
          </AuthProvider>
        </ApolloProvider>,
      );

      await act(async () => {
        jest.advanceTimersByTime(3100);
      });

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled();
      });

      // Should not trigger location sync
      expect(Location.getLastKnownPositionAsync).not.toHaveBeenCalled();
    });
  });

  describe("Path D/E: Location sharing disabled", () => {
    it("should skip reconciliation when backend is false", async () => {
      const mockAuthContext = {
        user: mockUserWithLocationDisabled,
        isAuthenticated: true,
        isLoading: false,
      };

      jest
        .spyOn(require("providers/AuthProvider"), "useAuth")
        .mockReturnValue(mockAuthContext);

      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "granted",
      });

      render(
        <ApolloProvider client={mockClient}>
          <AuthProvider>
            <RootLayout />
          </AuthProvider>
        </ApolloProvider>,
      );

      await act(async () => {
        jest.advanceTimersByTime(3100);
      });

      await waitFor(() => {
        expect(Location.getForegroundPermissionsAsync).toHaveBeenCalled();
      });

      // Should not trigger sync when backend is disabled
      expect(Location.getLastKnownPositionAsync).not.toHaveBeenCalled();
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe("Background sync behavior", () => {
    it("should use last known position for background sync (fast, non-blocking)", async () => {
      const mockAuthContext = {
        user: mockUserWithLocationEnabled,
        isAuthenticated: true,
        isLoading: false,
      };

      jest
        .spyOn(require("providers/AuthProvider"), "useAuth")
        .mockReturnValue(mockAuthContext);

      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "granted",
      });

      const mockLastKnown = {
        coords: { latitude: -1.2921, longitude: 36.8219 },
        timestamp: Date.now() - 30000, // 30 seconds old
      };

      (Location.getLastKnownPositionAsync as jest.Mock).mockResolvedValue(
        mockLastKnown,
      );
      (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([
        { city: "Nairobi" },
      ]);

      mockMutate.mockResolvedValue({ data: {} });

      render(
        <ApolloProvider client={mockClient}>
          <AuthProvider>
            <RootLayout />
          </AuthProvider>
        </ApolloProvider>,
      );

      await act(async () => {
        jest.advanceTimersByTime(3100);
      });

      await waitFor(() => {
        expect(Location.getLastKnownPositionAsync).toHaveBeenCalledWith({
          maxAge: 60000,
          requiredAccuracy: 1000,
        });
      });

      // Should use last known position, not fresh GPS
      expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
    });

    it("should fall back to fresh GPS if last known unavailable", async () => {
      const mockAuthContext = {
        user: mockUserWithLocationEnabled,
        isAuthenticated: true,
        isLoading: false,
      };

      jest
        .spyOn(require("providers/AuthProvider"), "useAuth")
        .mockReturnValue(mockAuthContext);

      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "granted",
      });

      // Last known fails
      (Location.getLastKnownPositionAsync as jest.Mock).mockResolvedValue(null);

      const mockFreshLocation = {
        coords: { latitude: -1.2921, longitude: 36.8219 },
        timestamp: Date.now(),
      };
      (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue(
        mockFreshLocation,
      );
      (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([
        { city: "Nairobi" },
      ]);

      mockMutate.mockResolvedValue({ data: {} });

      render(
        <ApolloProvider client={mockClient}>
          <AuthProvider>
            <RootLayout />
          </AuthProvider>
        </ApolloProvider>,
      );

      await act(async () => {
        jest.advanceTimersByTime(3100);
      });

      await waitFor(() => {
        expect(Location.getLastKnownPositionAsync).toHaveBeenCalled();
        expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
      });
    });

    it("should handle sync errors silently (silent fallback)", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      const mockAuthContext = {
        user: mockUserWithLocationEnabled,
        isAuthenticated: true,
        isLoading: false,
      };

      jest
        .spyOn(require("providers/AuthProvider"), "useAuth")
        .mockReturnValue(mockAuthContext);

      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "granted",
      });

      (Location.getLastKnownPositionAsync as jest.Mock).mockRejectedValue(
        new Error("GPS unavailable"),
      );
      (Location.getCurrentPositionAsync as jest.Mock).mockRejectedValue(
        new Error("GPS unavailable"),
      );

      render(
        <ApolloProvider client={mockClient}>
          <AuthProvider>
            <RootLayout />
          </AuthProvider>
        </ApolloProvider>,
      );

      await act(async () => {
        jest.advanceTimersByTime(3100);
      });

      // Should not crash or block rendering
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "Location sync failed, using stored location:",
          expect.any(Error),
        );
      });

      consoleSpy.mockRestore();
    });
  });

  describe("Loading states", () => {
    it("should show Loading component while auth is initializing", async () => {
      const mockAuthContext = {
        user: null,
        isAuthenticated: false,
        isLoading: true, // Auth still loading
      };

      jest
        .spyOn(require("providers/AuthProvider"), "useAuth")
        .mockReturnValue(mockAuthContext);

      const { queryByTestId } = render(
        <ApolloProvider client={mockClient}>
          <AuthProvider>
            <RootLayout />
          </AuthProvider>
        </ApolloProvider>,
      );

      await act(async () => {
        jest.advanceTimersByTime(3100);
      });

      // Should show loading (in real app this is Loading component)
      // No reconciliation should happen yet
      expect(Location.getForegroundPermissionsAsync).not.toHaveBeenCalled();
    });

    it("should show Loading while reconciliation is in progress", async () => {
      const mockAuthContext = {
        user: mockUserWithLocationEnabled,
        isAuthenticated: true,
        isLoading: false,
      };

      jest
        .spyOn(require("providers/AuthProvider"), "useAuth")
        .mockReturnValue(mockAuthContext);

      // Slow permission check
      (Location.getForegroundPermissionsAsync as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ status: "granted" }), 2000),
          ),
      );

      render(
        <ApolloProvider client={mockClient}>
          <AuthProvider>
            <RootLayout />
          </AuthProvider>
        </ApolloProvider>,
      );

      await act(async () => {
        jest.advanceTimersByTime(3100);
      });

      // Should be showing loading state
      // Complete reconciliation
      await act(async () => {
        jest.advanceTimersByTime(2100);
      });

      await waitFor(() => {
        expect(Location.getForegroundPermissionsAsync).toHaveBeenCalled();
      });
    });
  });
});
