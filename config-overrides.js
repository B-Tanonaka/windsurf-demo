const { override, addWebpackPlugin } = require('customize-cra');
const { DefinePlugin } = require('webpack');

module.exports = override(
  (config) => {
    // Set public path for GitHub Pages
    config.output.publicPath = '/Windsurf-Demo/';
    
    // Ensure the DefinePlugin exists
    const definePlugin = config.plugins.find(p => p.constructor.name === 'DefinePlugin');
    if (definePlugin) {
      // Update PUBLIC_URL for the client-side code
      definePlugin.definitions = {
        ...definePlugin.definitions,
        'process.env.PUBLIC_URL': JSON.stringify('/Windsurf-Demo/')
      };
    }
    
    return config;
  }
);
