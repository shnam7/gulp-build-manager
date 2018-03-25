// Sample

const gbm = require('../../lib');
const path = require('path');

process.chdir(__dirname);

const srcRoot = 'assets';
const destRoot = '_build';


// build configuration
const webpack = {
  buildName: 'webpack',
  builder: 'GWebpackBuilder',
  // src: [path.join(srcRoot, 'scripts/ts/app.ts')],
  // dest: path.join(destRoot, 'jss'),
  // outFile: 'sample-ts.js',
  buildOptions: {
    webpackConfig: 'webpack.config.js'
  },
  moduleOptions: {
    webpack: {
      // entry: path.resolve(srcRoot, 'scripts/ts/app.ts'),
    //   mode: 'production',
    //   devtool: 'source-map',
    //   module: {
    //     rules: [
    //       {
    //         test: /\.tsx?$/,
    //         use: 'ts-loader',
    //         exclude: /node_modules/
    //       }
    //     ],
    //   },
    //   resolve: {
    //     extensions: ['.tsx', '.ts', '.js']
    //   },
    //   output: {
    //     filename: 'bundle-1.js',
    //     path: path.resolve(destRoot, 'js-1')
    //   },
    },
  }
};

// build manager
gbm({
  systemBuilds: {
    build: [webpack],
    clean: [
      destRoot,
      path.join(srcRoot, 'scripts/ts/**/*.{js,map,d.ts}'),
      'node_modules'    // clean up temporary files in node_modules
    ],
    default: ['@clean', '@build'],
  }
});
