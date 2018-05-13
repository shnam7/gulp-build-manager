const path = require('path');

// set base directory to project root
const basePath = path.relative(process.cwd(), __dirname);
const srcRoot = path.join(basePath, 'assets');
const destRoot = path.join(basePath, '_build');

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