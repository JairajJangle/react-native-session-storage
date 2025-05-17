const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  return {
    ...config,
    projectRoot: __dirname, // Explicitly set the project root to the example folder
    watchFolders: [
      __dirname, // Watch the example folder
      path.resolve(__dirname, '..'), // Watch the root for the main module
    ],
    resolver: {
      ...config.resolver,
      sourceExts: [...config.resolver.sourceExts, 'ts', 'tsx'], // Support TypeScript files
      extraNodeModules: {
        // Map the react-native-session-storage module to the root src/index
        'react-native-session-storage': path.resolve(__dirname, '../src/index'),
      },
    },
  };
})();