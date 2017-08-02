---
layout: docs
title: GWebPackBuilder (Experimental)
---

# {{page.title}}
WebPack project builder.<br>

#### Builder specific Options
Not available yet. (Experimental)

#### Example
```javascript
const webpack = {
  buildName: 'webpack',
  builder: 'GWebPackBuilder',
  src: [upath.join(srcRoot, 'scripts/ts/main.ts')],
  // src: [upath.join(srcRoot, 'scripts/ts/**/!(*.d).ts')],
  //
  // // use order property to set outFile orders
  // order: ['*ts-2.ts'],
  dest: upath.join(destRoot, 'scripts/js'),
  outFile: upath.join(destRoot, 'js/sample-ts.js'),
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
  },
};
```