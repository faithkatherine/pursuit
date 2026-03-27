import { useState, useCallback } from "react";
import { Alert, Linking } from "react-native";
import * as Location from "expo-location";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_BUCKET_CATEGORIES,
  GET_BUCKET_ITEMS,
  GET_HOME,
  GET_EVENTS,
  GET_SAVED_EVENTS,
  SAVE_EVENT,
  UNSAVE_EVENT,
  ENABLE_LOCATION,
} from "./queries";
import {
  GetBucketCategoriesQuery,
  GetBucketItemsQuery,
  GetHomeQuery,
  GetEventsQuery,
  GetSavedEventsQuery,
  SaveEventMutation,
  UnsaveEventMutation,
} from "graphql/generated/graphql";

export const useBucketCategories = () => {
  const result = useQuery<GetBucketCategoriesQuery>(GET_BUCKET_CATEGORIES, {
    notifyOnNetworkStatusChange: true,
  });

  return {
    ...result,
    categories: result.data?.getBucketCategories || [],
  };
};

export const useBucketItems = (selectedCategory?: string | null) => {
  const result = useQuery<GetBucketItemsQuery>(GET_BUCKET_ITEMS, {
    variables: { categoryId: selectedCategory || undefined },
    notifyOnNetworkStatusChange: true,
  });

  return {
    ...result,
    bucketItems: result.data?.getBucketItems || [],
  };
};

export const useHomeData = () => {
  return useQuery<GetHomeQuery>(GET_HOME, {
    variables: { offset: 0, limit: 4 },
  });
};

export const useEvents = (filters?: {
  search?: string;
  category?: string[];
  offset?: number;
  limit?: number;
}) => {
  const result = useQuery<GetEventsQuery>(GET_EVENTS, {
    variables: {
      search: filters?.search || undefined,
      category: filters?.category?.length ? filters.category : undefined,
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

export const useLocationPermission = () => {
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
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

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);

        const [geocode] = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        if (geocode) {
          const name = [geocode.city, geocode.region || geocode.country]
            .filter(Boolean)
            .join(", ");
          setLocationName(name || null);

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
      } catch (error) {
        console.error("Failed to get location:", error);
        setLocationPermissionGranted(false);
        Alert.alert(
          "Location Error",
          "Unable to get your location. Please try again later.",
        );
      }
    },
    [enableLocationMutation],
  );

  return {
    locationPermissionGranted,
    location,
    locationName,
    toggleLocationPermission,
  };
};
