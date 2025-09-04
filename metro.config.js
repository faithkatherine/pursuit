const path = require("path");
process.env.EXPO_ROUTER_APP_ROOT = path.join(__dirname, "app");
const { getDefaultConfig } = require("expo/metro-config");

// Add the additional `cjs` extension to the resolver
config.resolver.sourceExts.push("cjs");

// Configure SVG transformer
const { transformer, resolver } = config;
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"],
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
