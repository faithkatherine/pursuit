const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Add the additional `cjs` extension to the resolver
config.resolver.sourceExts.push("cjs");

// Configure module resolution for custom paths
config.resolver.alias = {
  "pursuit/components": path.resolve(__dirname, "../../components"),
  "pursuit/themes": path.resolve(__dirname, "../../themes"),
  //'pursuit/assets': path.resolve(__dirname, '../../assets'),
  //'pursuit/hooks': path.resolve(__dirname, '../../hooks'),
  //'pursuit/utils': path.resolve(__dirname, '../../utils'),
  //'pursuit/types': path.resolve(__dirname, '../../types'),
  //'pursuit/constants': path.resolve(__dirname, '../../constants'),
  components: path.resolve(__dirname, "./components"),
  screens: path.resolve(__dirname, "./screens"),
  assets: path.resolve(__dirname, "./assets"),
};

// Watch the monorepo directories
config.watchFolders = [
  path.resolve(__dirname, "../../components"),
  path.resolve(__dirname, "../../themes"),
  //path.resolve(__dirname, "../../assets"),
  //path.resolve(__dirname, "../../hooks"),
  //path.resolve(__dirname, "../../utils"),
  //path.resolve(__dirname, "../../types"),
  //path.resolve(__dirname, "../../constants"),
];

module.exports = config;
