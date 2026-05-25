import { useState, useCallback, useEffect, useRef } from "react";
import { Alert, Linking } from "react-native";
import * as Location from "expo-location";
import { useMutation, ApolloClient } from "@apollo/client";
import type { NormalizedCacheObject } from "@apollo/client";
import { GET_HOME, ENABLE_LOCATION, DISABLE_LOCATION } from "graphql/queries";
import { UserType } from "graphql/generated/graphql";

// Module-level session guard for proactive permission prompt
let hasPromptedThisSession = false;

/**
 * Standalone location reconciliation logic - runs in _layout before home mounts
 * Returns shouldSync flag for post-mount background sync
 */
export const reconcileLocation = async (
  user: UserType,
  client: ApolloClient<NormalizedCacheObject>,
): Promise<{ shouldSync: boolean }> => {
  try {
    // Step 1: Read OS permission status (do not request)
    const { status } = await Location.getForegroundPermissionsAsync();
    const backendEnabled = user.profile?.allowLocationSharing ?? false;

    console.log("Reconciliation:", { status, backendEnabled });

    // Path A: undetermined + backend true (reinstall, previously opted in)
    if (status === "undetermined" && backendEnabled) {
      if (hasPromptedThisSession) {
        console.log("Already prompted this session");
        return { shouldSync: false };
      }

      hasPromptedThisSession = true;
      console.log("Path A: Proactive permission prompt");

      // Show OS permission dialog
      const { status: newStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (newStatus === "granted") {
        console.log("Permission granted, will sync");
        return { shouldSync: true };
      } else {
        // Denied → disable backend
        console.log("Permission denied, disabling backend");
        await client.mutate({
          mutation: DISABLE_LOCATION,
          refetchQueries: [{ query: GET_HOME }],
        });
        return { shouldSync: false };
      }
    }

    // Path B: denied + backend true (user actively revoked)
    if (status === "denied" && backendEnabled) {
      console.log("Path B: Permission revoked, disabling backend");
      await client.mutate({
        mutation: DISABLE_LOCATION,
        refetchQueries: [{ query: GET_HOME }],
      });
      return { shouldSync: false };
    }

    // Path C: granted + backend true (normal case)
    if (status === "granted" && backendEnabled) {
      console.log("Path C: Normal case, will sync");
      return { shouldSync: true };
    }

    // Path D/E: anything + backend false (never enabled or disabled)
    console.log("Path D/E: No action needed");
    return { shouldSync: false };
  } catch (error) {
    console.error("Reconciliation failed:", error);
    return { shouldSync: false };
  }
};

// Shared GPS sync logic used by both manual tap and automatic launch sync
const syncLocationToBackend = async (
  enableLocationMutation: any,
  options: { useLastKnown?: boolean } = {},
) => {
  let currentLocation: Location.LocationObject | null = null;

  // Try last known position first if requested (faster, works indoors)
  if (options.useLastKnown) {
    try {
      currentLocation = await Location.getLastKnownPositionAsync({
        maxAge: 60000,
        requiredAccuracy: 1000,
      });
    } catch (e) {
      console.log("No last known position, fetching fresh");
    }
  }

  // Fallback to fresh GPS
  if (!currentLocation) {
    currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
  }

  const [geocode] = await Location.reverseGeocodeAsync({
    latitude: currentLocation.coords.latitude,
    longitude: currentLocation.coords.longitude,
  });

  if (geocode) {
    const name = [geocode.city, geocode.region || geocode.country]
      .filter(Boolean)
      .join(", ");

    if (name) {
      await enableLocationMutation({
        variables: {
          locationName: name,
          location: [
            currentLocation.coords.latitude,
            currentLocation.coords.longitude,
          ],
        },
        refetchQueries: [{ query: GET_HOME }],
      });
    }
  }

  return { currentLocation, locationName: geocode?.city || null };
};

export const useLocationPermission = () => {
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [locationName, setLocationName] = useState<string | null>(null);
  const [enableLocationMutation] = useMutation(ENABLE_LOCATION);

  const toggleLocationPermission = useCallback(
    async (enabled: boolean) => {
      setLocationPermissionGranted(enabled);

      if (!enabled) {
        setLocation(null);
        setLocationName(null);
        return;
      }

      setIsLocationLoading(true);
      try {
        // Check existing permission status first
        const { status: existingStatus } =
          await Location.getForegroundPermissionsAsync();

        let granted = existingStatus === "granted";

        if (!granted) {
          // Try requesting — this only shows the popup if not yet determined
          const { status, canAskAgain } =
            await Location.requestForegroundPermissionsAsync();
          granted = status === "granted";

          // If denied and OS won't show the popup again, guide user to Settings
          if (!granted && !canAskAgain) {
            setLocationPermissionGranted(false);
            Alert.alert(
              "Location Permission Required",
              "You previously denied location access. Please enable it in your device settings to use this feature.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Open Settings",
                  onPress: () => Linking.openSettings(),
                },
              ],
            );
            return;
          }

          if (!granted) {
            setLocationPermissionGranted(false);
            return;
          }
        }

        // Use shared sync logic
        const result = await syncLocationToBackend(enableLocationMutation, {
          useLastKnown: false, // Manual tap uses fresh GPS
        });
        setLocation(result.currentLocation);
        setLocationName(result.locationName);
      } catch (error) {
        console.error("Failed to get location:", error);
        setLocationPermissionGranted(false);
        throw error;
      } finally {
        setIsLocationLoading(false);
      }
    },
    [enableLocationMutation],
  );

  return {
    locationPermissionGranted,
    isLocationLoading,
    location,
    locationName,
    toggleLocationPermission,
  };
};

export const useLocationSync = (user: UserType | null, shouldSync: boolean) => {
  const [isSynced, setIsSynced] = useState(false);
  const hasRun = useRef(false);
  const [enableLocationMutation] = useMutation(ENABLE_LOCATION);

  useEffect(() => {
    if (hasRun.current) return;

    // Wait for reconciliation to determine if we should sync
    if (!shouldSync) {
      setIsSynced(true);
      return;
    }

    // Skip if no user or user hasn't opted into location sharing
    if (!user || !user.profile?.allowLocationSharing) {
      setIsSynced(true);
      return;
    }

    hasRun.current = true;

    const syncLocation = async () => {
      try {
        // Use shared sync logic with last known position fallback
        await syncLocationToBackend(enableLocationMutation, {
          useLastKnown: true, // Auto sync tries cached position first
        });
      } catch (error) {
        // Silent fallback to stored location — log only
        console.error("Location sync failed, using stored location:", error);
      } finally {
        setIsSynced(true);
      }
    };

    syncLocation();
  }, [user, shouldSync, enableLocationMutation]);

  return { isSynced };
};
