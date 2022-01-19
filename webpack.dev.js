const ESLintPlugin = require('eslint-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');


module.exports = merge(common, {
  mode: 'development',
  devtool:  'inline-source-map',

  module: {
    rules: [
      {
        test: /\.(css|scss)$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  
  plugins: [
    new ESLintPlugin({ extensions: ['js'] })
  ],

  devServer: {
    open: true,
    compress: true,
    inline: true,
    port: 8080,
  },
});
