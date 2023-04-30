const webpack = require('webpack')

module.exports = function (ctx) {
  return {
    configureWebpack: {
      plugins: [
        new webpack.ProvidePlugin({
          LibraryName: 'hive-auth-wrapper',
        }),
      ],
    },
  }
}
