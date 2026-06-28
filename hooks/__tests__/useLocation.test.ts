/**
 * Location architecture tests for frontend location reconciliation and sync.
 *
 * Tests cover:
 * - reconcileLocation() standalone function (Paths A, B, C, D, E)
 * - useLocationSync hook behavior
 * - Location permission flows
 * - Integration with Apollo Client
 */

import { renderHook, act, waitFor } from "@testing-library/react-native";
import * as Location from "expo-location";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  reconcileLocation,
  useLocationSync,
  useLocationPermission,
} from "../useLocation";
import { Alert, Linking } from "react-native";
import { UserType } from "@shared/graphql/generated/graphql";

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

// Mock Apollo Client mutations
const mockMutate = jest.fn();
const mockClient = {
  mutate: mockMutate,
} as unknown as ApolloClient<NormalizedCacheObject>;

// Mock user types
const createMockUser = (
  allowLocationSharing: boolean = false
): UserType => ({
  __typename: "UserType",
  id: "user-123",
  email: "test@example.com",
  firstName: "Test",
  lastName: "User",
  username: "testuser",
  profilePicture: null,
  profile: {
    __typename: "UserProfileType",
    allowLocationSharing,
    locationName: allowLocationSharing ? "Nairobi, Kenya" : null,
    location: allowLocationSharing ? [-1.2921, 36.8219] : null,
    isOnboardingCompleted: true,
    hasSkippedOnboarding: false,
  },
});

describe("reconcileLocation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Path A: undetermined + backend true (reinstall, previously opted in)", () => {
    it("should show OS permission dialog and sync on grant", async () => {
      const user = createMockUser(true);

      // Mock OS permission state: undetermined
      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "undetermined",
      });

      // Mock user grants permission
      (
        Location.requestForegroundPermissionsAsync as jest.Mock
      ).mockResolvedValue({
        status: "granted",
      });

      const result = await reconcileLocation(user, mockClient);

      expect(Location.getForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(result.shouldSync).toBe(true);
      expect(mockMutate).not.toHaveBeenCalled(); // No backend mutation needed
    });

    it("should disable backend if user denies permission", async () => {
      const user = createMockUser(true);

      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "undetermined",
      });

      // Mock user denies permission
      (
        Location.requestForegroundPermissionsAsync as jest.Mock
      ).mockResolvedValue({
        status: "denied",
      });

      mockMutate.mockResolvedValue({ data: {} });

      const result = await reconcileLocation(user, mockClient);

      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(result.shouldSync).toBe(false);
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          mutation: expect.anything(),
        })
      );
    });

    it("should only prompt once per session", async () => {
      const user = createMockUser(true);

      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "undetermined",
      });

      (
        Location.requestForegroundPermissionsAsync as jest.Mock
      ).mockResolvedValue({
        status: "granted",
      });

      // First call
      await reconcileLocation(user, mockClient);
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalledTimes(
        1
      );

      // Second call in same session
      await reconcileLocation(user, mockClient);
      // Should not prompt again
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe("Path B: denied + backend true (user actively revoked)", () => {
    it("should disable backend when permission is denied", async () => {
      const user = createMockUser(true);

      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "denied",
      });

      mockMutate.mockResolvedValue({ data: {} });

      const result = await reconcileLocation(user, mockClient);

      expect(result.shouldSync).toBe(false);
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          mutation: expect.anything(),
        })
      );
    });
  });

  describe("Path C: granted + backend true (normal case)", () => {
    it("should return shouldSync=true for normal sync", async () => {
      const user = createMockUser(true);

      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "granted",
      });

      const result = await reconcileLocation(user, mockClient);

      expect(result.shouldSync).toBe(true);
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe("Path D/E: anything + backend false (never enabled or disabled)", () => {
    it("should return shouldSync=false when backend is disabled", async () => {
      const user = createMockUser(false);

      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "granted",
      });

      const result = await reconcileLocation(user, mockClient);

      expect(result.shouldSync).toBe(false);
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it("should handle undetermined + backend false gracefully", async () => {
      const user = createMockUser(false);

      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "undetermined",
      });

      const result = await reconcileLocation(user, mockClient);

      expect(result.shouldSync).toBe(false);
      expect(Location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
    });
  });

  describe("Error handling", () => {
    it("should handle permission check errors gracefully", async () => {
      const user = createMockUser(true);
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      (Location.getForegroundPermissionsAsync as jest.Mock).mockRejectedValue(
        new Error("Permission check failed")
      );

      const result = await reconcileLocation(user, mockClient);

      expect(result.shouldSync).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Reconciliation failed:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it("should handle mutation errors gracefully", async () => {
      const user = createMockUser(true);
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: "denied",
      });

      mockMutate.mockRejectedValue(new Error("Mutation failed"));

      const result = await reconcileLocation(user, mockClient);

      expect(result.shouldSync).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Reconciliation failed:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});

describe("useLocationSync", () => {
  const mockEnableLocationMutation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should sync location when shouldSync is true", async () => {
    const user = createMockUser(true);

    // Mock location data
    const mockLocation = {
      coords: {
        latitude: -1.2921,
        longitude: 36.8219,
        altitude: null,
        accuracy: 10,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    const mockGeocode = {
      city: "Nairobi",
      region: "Nairobi County",
      country: "Kenya",
    };

    (Location.getLastKnownPositionAsync as jest.Mock).mockResolvedValue(
      mockLocation
    );
    (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([
      mockGeocode,
    ]);

    mockEnableLocationMutation.mockResolvedValue({ data: {} });

    const { result } = renderHook(() =>
      useLocationSync(user, true)
    );

    await waitFor(() => {
      expect(result.current.isSynced).toBe(true);
    });

    expect(Location.getLastKnownPositionAsync).toHaveBeenCalled();
    expect(Location.reverseGeocodeAsync).toHaveBeenCalledWith({
      latitude: -1.2921,
      longitude: 36.8219,
    });
  });

  it("should not sync when shouldSync is false", async () => {
    const user = createMockUser(true);

    const { result } = renderHook(() =>
      useLocationSync(user, false)
    );

    await waitFor(() => {
      expect(result.current.isSynced).toBe(true);
    });

    expect(Location.getLastKnownPositionAsync).not.toHaveBeenCalled();
  });

  it("should not sync when user has disabled location sharing", async () => {
    const user = createMockUser(false);

    const { result } = renderHook(() =>
      useLocationSync(user, true)
    );

    await waitFor(() => {
      expect(result.current.isSynced).toBe(true);
    });

    expect(Location.getLastKnownPositionAsync).not.toHaveBeenCalled();
  });

  it("should handle no user gracefully", async () => {
    const { result } = renderHook(() =>
      useLocationSync(null, true)
    );

    await waitFor(() => {
      expect(result.current.isSynced).toBe(true);
    });

    expect(Location.getLastKnownPositionAsync).not.toHaveBeenCalled();
  });

  it("should fall back to fresh GPS if last known position unavailable", async () => {
    const user = createMockUser(true);

    const mockFreshLocation = {
      coords: {
        latitude: -1.2921,
        longitude: 36.8219,
        altitude: null,
        accuracy: 10,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    const mockGeocode = {
      city: "Nairobi",
      region: "Nairobi County",
    };

    // Last known position fails
    (Location.getLastKnownPositionAsync as jest.Mock).mockResolvedValue(null);
    // Fresh GPS succeeds
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue(
      mockFreshLocation
    );
    (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([
      mockGeocode,
    ]);

    mockEnableLocationMutation.mockResolvedValue({ data: {} });

    const { result } = renderHook(() =>
      useLocationSync(user, true)
    );

    await waitFor(() => {
      expect(result.current.isSynced).toBe(true);
    });

    expect(Location.getLastKnownPositionAsync).toHaveBeenCalled();
    expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
  });

  it("should handle sync errors silently and set isSynced to true", async () => {
    const user = createMockUser(true);
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    (Location.getLastKnownPositionAsync as jest.Mock).mockRejectedValue(
      new Error("GPS error")
    );
    (Location.getCurrentPositionAsync as jest.Mock).mockRejectedValue(
      new Error("GPS error")
    );

    const { result } = renderHook(() =>
      useLocationSync(user, true)
    );

    await waitFor(() => {
      expect(result.current.isSynced).toBe(true);
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Location sync failed, using stored location:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("should only run sync once per mount", async () => {
    const user = createMockUser(true);

    const mockLocation = {
      coords: {
        latitude: -1.2921,
        longitude: 36.8219,
        altitude: null,
        accuracy: 10,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    (Location.getLastKnownPositionAsync as jest.Mock).mockResolvedValue(
      mockLocation
    );
    (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([
      { city: "Nairobi" },
    ]);

    mockEnableLocationMutation.mockResolvedValue({ data: {} });

    const { rerender } = renderHook(
      ({ user, shouldSync }) => useLocationSync(user, shouldSync),
      {
        initialProps: { user, shouldSync: true },
      }
    );

    await waitFor(() => {
      expect(Location.getLastKnownPositionAsync).toHaveBeenCalledTimes(1);
    });

    // Rerender with same props
    rerender({ user, shouldSync: true });

    // Should not call location again
    expect(Location.getLastKnownPositionAsync).toHaveBeenCalledTimes(1);
  });
});

describe("useLocationPermission", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should request and grant location permission successfully", async () => {
    const mockLocation = {
      coords: {
        latitude: -1.2921,
        longitude: 36.8219,
        altitude: null,
        accuracy: 10,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    const mockGeocode = {
      city: "Nairobi",
      region: "Nairobi County",
    };

    (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "undetermined",
    });
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      {
        status: "granted",
        canAskAgain: true,
      }
    );
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue(
      mockLocation
    );
    (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([
      mockGeocode,
    ]);

    const { result } = renderHook(() => useLocationPermission());

    await act(async () => {
      await result.current.toggleLocationPermission(true);
    });

    await waitFor(() => {
      expect(result.current.locationPermissionGranted).toBe(true);
      expect(result.current.location).toEqual(mockLocation);
      expect(result.current.locationName).toBe("Nairobi");
      expect(result.current.isLocationLoading).toBe(false);
    });
  });

  it("should show settings alert when permission denied and cannot ask again", async () => {
    (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "denied",
    });
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      {
        status: "denied",
        canAskAgain: false,
      }
    );

    const { result } = renderHook(() => useLocationPermission());

    await act(async () => {
      await result.current.toggleLocationPermission(true);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Location Permission Required",
        expect.stringContaining("Please enable it in your device settings"),
        expect.arrayContaining([
          expect.objectContaining({ text: "Cancel" }),
          expect.objectContaining({ text: "Open Settings" }),
        ])
      );
      expect(result.current.locationPermissionGranted).toBe(false);
    });
  });

  it("should open settings when user taps 'Open Settings'", async () => {
    (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "denied",
    });
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      {
        status: "denied",
        canAskAgain: false,
      }
    );

    // Mock Alert to call onPress for "Open Settings"
    (Alert.alert as jest.Mock).mockImplementation((title, message, buttons) => {
      const openSettingsButton = buttons?.find(
        (btn: any) => btn.text === "Open Settings"
      );
      if (openSettingsButton?.onPress) {
        openSettingsButton.onPress();
      }
    });

    const { result } = renderHook(() => useLocationPermission());

    await act(async () => {
      await result.current.toggleLocationPermission(true);
    });

    await waitFor(() => {
      expect(Linking.openSettings).toHaveBeenCalled();
    });
  });

  it("should clear location data when toggling off", async () => {
    const { result } = renderHook(() => useLocationPermission());

    await act(async () => {
      await result.current.toggleLocationPermission(false);
    });

    expect(result.current.locationPermissionGranted).toBe(false);
    expect(result.current.location).toBeNull();
    expect(result.current.locationName).toBeNull();
  });

  it("should use existing permission if already granted", async () => {
    const mockLocation = {
      coords: {
        latitude: -1.2921,
        longitude: 36.8219,
        altitude: null,
        accuracy: 10,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    // Permission already granted
    (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue(
      mockLocation
    );
    (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([
      { city: "Nairobi" },
    ]);

    const { result } = renderHook(() => useLocationPermission());

    await act(async () => {
      await result.current.toggleLocationPermission(true);
    });

    await waitFor(() => {
      expect(result.current.locationPermissionGranted).toBe(true);
    });

    // Should not request permission again
    expect(Location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
  });

  it("should handle location fetch errors", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (Location.getCurrentPositionAsync as jest.Mock).mockRejectedValue(
      new Error("GPS unavailable")
    );

    const { result } = renderHook(() => useLocationPermission());

    await act(async () => {
      try {
        await result.current.toggleLocationPermission(true);
      } catch (error) {
        // Expected to throw
      }
    });

    await waitFor(() => {
      expect(result.current.locationPermissionGranted).toBe(false);
      expect(result.current.isLocationLoading).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to get location:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
