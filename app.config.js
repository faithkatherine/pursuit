module.exports = {
  expo: {
    name: "pursuit",
    slug: "pursuit",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.pursuit.app",
      config: {
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "Pursuit needs your location to suggest nearby bucket list experiences and show local recommendations.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "Pursuit needs your location to suggest nearby bucket list experiences and notify you about opportunities near you.",
        NSLocationAlwaysUsageDescription:
          "Pursuit needs your location to notify you about bucket list opportunities near you, even when the app is in the background.",
      },
    },
    android: {
      edgeToEdgeEnabled: true,
      package: "com.pursuit.app",
      permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme:
                "com.googleusercontent.apps.924582733350-7decpkks5mecejcju75131fm7qnva9dd",
              path: "/oauth2redirect/google",
            },
          ],
          category: ["DEFAULT", "BROWSABLE"],
        },
      ],
    },
    plugins: [
      "expo-router",
      "expo-dev-client",
      "expo-secure-store",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Pursuit needs your location to suggest nearby bucket list experiences and notify you about opportunities near you.",
          locationAlwaysPermission:
            "Pursuit needs your location to notify you about bucket list opportunities near you, even when the app is in the background.",
          locationWhenInUsePermission:
            "Pursuit needs your location to suggest nearby bucket list experiences and show local recommendations.",
        },
      ],
      [
        "expo-notifications",
        {
          color: "#ffffff",
        },
      ],
    ],
    scheme: "pursuit",
    extra: {
      eas: {
        projectId: "75250b6f-ff9b-48ce-b717-a4843ae8fe2d",
      },
      router: {
        origin: false,
      },
    },
  },
};
