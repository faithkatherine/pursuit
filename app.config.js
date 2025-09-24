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
      bundleIdentifier: "com.faithkatherine.pursuit",
      config: {
        usesNonExemptEncryption: false,
      },
    },
    android: {
      edgeToEdgeEnabled: true,
      package: "com.faithkatherine.pursuit",
    },
    plugins: ["expo-router", "expo-dev-client"],
    scheme: "pursuit",
    extra: {
      eas: {
        projectId: "75250b6f-ff9b-48ce-b717-a4843ae8fe2d"
      }
    },
  },
};
