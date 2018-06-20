const withCSS = require('@zeit/next-css');

module.exports = withCSS({
  distDir: '../dist',
  webpack: (config) => {
    const returnConfig = config;

    returnConfig.resolve = {
      alias: {
        'node-fetch': 'whatwg-fetch',
      },
    };

    return returnConfig;
  },
});
