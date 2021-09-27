const path = require('path');

module.exports = {
  plugins: [{ plugin: require('@semantic-ui-react/craco-less') }],
  webpack: {
    alias: {
      '@app': path.resolve(__dirname, 'src/@app/'),
      '@admin': path.resolve(__dirname, 'src/admin'),
      '@unit': path.resolve(__dirname, 'src/unit'),
      '@category': path.resolve(__dirname, 'src/category'),
    },
  },
};
