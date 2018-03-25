const path = require('path');

let srcRoot = 'assets';
let destRoot = '_build';

module.exports = {
  entry: path.resolve(srcRoot, 'scripts/ts/greet.ts'),
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(destRoot, 'js')
  },
};