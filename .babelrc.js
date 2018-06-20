const config = {
  presets: ['next/babel'],
  plugins: [
    'transform-decorators-legacy',
    'transform-class-properties',
    [
      'module-resolver',
      {
        root: ['./src'],
      },
    ],
    [
      'direct-import',
      {
        modules: ['@material-ui/core', '@material-ui/icons'],
      },
    ],
  ],
};

if (process.env.NODE_ENV === 'production') {
  config.plugins = config.plugins.concat([
    ['styled-components', { ssr: true, displayName: false }],
    'transform-node-env-inline',
  ]);
} else {
  config.plugins = config.plugins.concat([['styled-components', { ssr: true, displayName: true }]]);
}

module.exports = config;
