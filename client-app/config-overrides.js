
const { override } = require('customize-cra');

module.exports = override(
  (config) => {
    config.output = {
      ...config.output,
      filename: '[name].esm.js',
      chunkFilename: '[name].esm.chunk.js',
      libraryTarget: 'module',
    };

    config.experiments = {
      outputModule: true,
    };

    return config;
  }
);
