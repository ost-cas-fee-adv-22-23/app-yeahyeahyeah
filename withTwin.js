// withTwin.js
const path = require('path');

// The folders containing files importing twin.macro
// We have to add the mumble npm package also, because we also import twin.macro inside the package
const includedDirs = [
  path.resolve(__dirname, './src'),
  path.resolve(__dirname, './node_modules/@smartive-education/design-system-component-library-yeahyeahyeah/dist'),
];

module.exports = function withTwin(nextConfig) {
  return {
    ...nextConfig,
    webpack(config, options) {
      const { dev, isServer } = options;
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      config.module.rules.push({
        // mumble npm package components are pure js files, therefor js has also to be included
        test: /\.(tsx|ts|jsx)$/,
        include: includedDirs,
        use: [
          options.defaultLoaders.babel,
          {
            loader: 'babel-loader',
            options: {
              sourceMaps: dev,
              plugins: [
                require.resolve('babel-plugin-twin'),
                require.resolve('babel-plugin-macros'),
                [require.resolve('babel-plugin-styled-components'), { ssr: true, displayName: true }],
                [require.resolve('@babel/plugin-syntax-typescript'), { isTSX: true }],
              ],
            },
          },
        ],
      });

      if (!isServer) {
        config.resolve.fallback = {
          ...(config.resolve.fallback || {}),
          fs: false,
          module: false,
          path: false,
          os: false,
          crypto: false,
        };
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      } else {
        return config;
      }
    },
  };
};
