const upath = require('upath');

// set base directory to project root
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');

module.exports = {
  entry: upath.resolve(srcRoot, 'scripts/ts/app.ts'),
  output: {
    filename: 'app.min.js',    // this name will be overriden by buildConfig.outFile
    path: upath.join(destRoot, 'js')
  },
  mode: 'production',   // this option will minify the output automatically
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,

        // TODO How to make dts file to be generated in the same directory
        // as outFile when process.cwd() is differenc from project root? See build result for the output.
        options: {
          logLevel: 'info',
          // context: upath.resolve(upath.join(__dirname, '/..'))
          // configFile: upath.join(basePath, "tsconfig.json"),
        }
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};

