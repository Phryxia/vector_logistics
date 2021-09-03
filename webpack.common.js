const path = require('path')

module.exports = {
  entry: './src/init.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
