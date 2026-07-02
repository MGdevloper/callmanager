const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, 'bin', 'mil'],
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName.startsWith('whisper.rn/realtime-transcription')) {
        const subpath = moduleName.replace(
          'whisper.rn/realtime-transcription',
          '',
        );
        return {
          type: 'sourceFile',
          filePath: path.join(
            __dirname,
            'node_modules',
            'whisper.rn',
            'lib',
            'module',
            'realtime-transcription',
            subpath,
          ),
        };
      }

      return context.resolveRequest(context, moduleName, platform);
    },
    unstable_enablePackageExports: false,
  },
};

module.exports = mergeConfig(defaultConfig, config);
