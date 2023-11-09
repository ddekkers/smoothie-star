/**
 * Customized metro according to react-native-ui-lib's expo demo:
 * https://github.com/wix/react-native-ui-lib/blob/master/expoDemo/metro.config.js
 */

// Learn more https://docs.expo.io/guides/customizing-metro
const {getDefaultConfig} = require('@expo/metro-config');

/** @type {import('@expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

config.resolver.assetExts.push("png")
config.resolver.assetExts.push("ttf")
config.resolver.assetExts.push("db")

module.exports = config;
