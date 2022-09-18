const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { readFileSync } = require('fs')

const json = JSON.parse(readFileSync('./package.json', { encoding: 'utf-8' }))

module.exports = {
  target: 'web',
  entry: './src/script/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '/src/index.html',
      version: json.version,
    }),
    new CopyPlugin({
      patterns: [{ from: 'public', to: '' }],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 4577,
  },
  mode: 'development',
  devtool: 'inline-source-map',
}
