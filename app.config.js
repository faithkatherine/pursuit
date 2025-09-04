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
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      edgeToEdgeEnabled: true
    },
    plugins: [
      "expo-router"
    ],
    scheme: "pursuit"
  }
};