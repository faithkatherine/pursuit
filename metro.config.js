const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

// Set the app root for Expo Router
process.env.EXPO_ROUTER_APP_ROOT = path.join(__dirname, "app");

const config = getDefaultConfig(__dirname);

// Configure SVG transformer
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...config.resolver.sourceExts, "svg"],
};

// Configure module resolution for custom paths
config.resolver.alias = {
  components: path.resolve(__dirname, "./components"),
  screens: path.resolve(__dirname, "./screens"),
  assets: path.resolve(__dirname, "./assets"),
  themes: path.resolve(__dirname, "./themes"),
  graphql: path.resolve(__dirname, "./graphql"),
  contexts: path.resolve(__dirname, "./contexts"),
  hooks: path.resolve(__dirname, "./hooks"),
  utils: path.resolve(__dirname, "./utils"),
  types: path.resolve(__dirname, "./types"),
  constants: path.resolve(__dirname, "./constants"),
};

module.exports = config;
