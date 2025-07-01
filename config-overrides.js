const { override, addWebpackPlugin } = require('customize-cra');
const { DefinePlugin } = require('webpack');
const path = require('path');

module.exports = override(
  (config) => {
    // Set public path for GitHub Pages
    config.output.publicPath = '/Windsurf-Demo/';
    
    // Add the DefinePlugin if it doesn't exist
    const definePlugin = config.plugins.find(p => p.constructor.name === 'DefinePlugin');
    if (definePlugin) {
      // Update PUBLIC_URL for the client-side code
      definePlugin.definitions = {
        ...definePlugin.definitions,
        'process.env.PUBLIC_URL': JSON.stringify('/Windsurf-Demo/')
      };
    } else {
      config.plugins.push(
        new DefinePlugin({
          'process.env.PUBLIC_URL': JSON.stringify('/Windsurf-Demo/')
        })
      );
    }

    // Ensure the output path is correct
    config.output.path = path.join(__dirname, 'build');
    
    // Fix for webpack 5 and GitHub Pages
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/')
      }
    };
    
    return config;
  }
);
