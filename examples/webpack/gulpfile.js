// Sample

const gbm = require('../../lib');
const path = require('path');   // use path instead of upath to workaround windows/linux path notation issue

// set base directory to project root
process.chdir('../../');
const basePath = path.relative(process.cwd(), __dirname);
const srcRoot = path.join(basePath, 'assets');
const destRoot = path.join(basePath, '_build');

// build configuration
const webpack = {
  buildName: 'webpack',
  builder: 'GWebpackBuilder',
  // src: [path.join(srcRoot, 'scripts/ts/app.ts')],
  // dest: path.join(destRoot, 'jss'),
  outFile: 'sample-ts.js',
  buildOptions: {
    webpackConfig: path.join(basePath, 'webpack.config.js')
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
      path.join(srcRoot, 'node_modules')    // clean up temporary files in node_modules
    ],
    default: ['@clean', '@build'],
  }
});
