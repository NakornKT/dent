const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    zlib: require.resolve('browserify-zlib'),
    querystring: require.resolve('querystring-es3'),
    path: require.resolve('path-browserify'),
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    http: require.resolve('stream-http'),
    net: false, // ไม่จำเป็นใน frontend
    fs: false, // ไม่จำเป็นใน frontend
    url: require.resolve('url/'),
    buffer: require.resolve('buffer/'),
    util: require.resolve('util/'),
  };
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ]);
  return config;
};