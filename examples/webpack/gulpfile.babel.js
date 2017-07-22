// Sample

import gbm from '../../src';
import upath from 'upath';

process.chdir(__dirname);

const srcRoot = 'assets';
const destRoot = '_build';


/**
 * Define build items
 */

const webpack = {
  buildName: 'webpack',
  builder: 'GWebPackBuilder',
  src: [upath.join(srcRoot, 'scripts/ts/main.ts')],
  // src: [upath.join(srcRoot, 'scripts/ts/**/!(*.d).ts')],
  //
  // // use order property to set outFile orders
  // order: ['*ts-2.ts'],
  dest: upath.join(destRoot, 'scripts/js'),
  // outFile: upath.join(destRoot, 'js/sample-ts.js'),
  buildOptions: {
    sourceMap: true,
    minify: true,
    // You can specify tsconfig.json file here. To create a default one, run 'tsc -init'
    tsConfig: upath.join(srcRoot, 'scripts/tsconfig.json')
  },
  moduleOptions: {
    webpack: {
      // resolve: {
      //   extensions: ["", ".webpack.js", ".web.js", ".ts", ".js"]
      // },
      module: {
        preLoaders: [
          { test: /\.ts$/, loader: 'tslint-loader' }
        ],
        loaders: [
          { test: /\.ts$/, loader: 'ts-loader' }
        ]
      },
      tslint: {
        failOnHint: true,
        // configuration: require('./tslint.json')
        configuration: {
          "extends": "tslint:recommended",
          rules: {
            "new-parens": true,
          }
        }
      },
    }

  //   // this will override the tsConfig settings in buildOptions
  //   typescript: {
  //     // "outFile": "sample-ts.js",
  //     // "outDir": upath.resolve(destRoot, 'js'),
  //     // "declarationDir": upath.resolve(destRoot, '@types')
  //
  //     // "target": "es5",
  //     // "module": "none",
  //     // "noImplicitAny": true,
  //     // "noEmitOnError": true
  //   }

  },
};


/**
 * Create gbmConfig object
 */
gbm({
  builds: [webpack],
  systemBuilds: {
    // 'copy' and 'images' will be executed in paralle, and then zip will be executed in series
    build: 'webpack',
    clean: [
      destRoot,
      upath.join(srcRoot, 'scripts/ts/**/*.{js,map,d.ts}')
    ],
    default: ['@clean', '@build'],
  }
});
