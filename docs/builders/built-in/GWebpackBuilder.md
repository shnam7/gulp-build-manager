---
layout: docs
---

# GWebpackBuilder (Experimental)
Webpack project builder.<br>
GWebpack builder first load webpack configuration file if available. And then, override it with conf.moduleOptions.webpack settings if available. Finally, override the entry points and output settings again with conf.src, conf.dest, conf.outFile.

#### Builder specific Options
  - *conf.src* (<i>type:string, default:undefined</i>)<br>
    If set, this will override 'entry' value of webpack configuration. A string or an array of string is allowed, and it cannot specify multiple entry points. To config multiple entry points, user moduleOptions.webpack option or separate webpack configuration file.
  - *conf.dest* (<i>type:string, default:undefined</i>)<br>
    If set, this will override output.path of webpack configuration.
  - *conf.outFile* (<i>type:string, default:undefined</i>)<br>
    If set, this will override output.filename of webpack configuration.
  - *conf.buildOptions.webpackConfig* (<i>type:string, default:undefined</i>)<br>
    Path to webpack configuration file.

#### Notes
To enable sourceMap, you need to add devtool option to webpack configuration file. For more details, please refer to webpack documentation on [Devtool](https://webpack.js.org/configuration/devtool/){:target="_blank"}.

#### Example
```javascript
const gbm = require('../../lib');
const path = require('path');

process.chdir(__dirname);

const srcRoot = 'assets';
const destRoot = '_build';

// build configuration
const webpack = {
  buildName: 'webpack',
  builder: 'GWebpackBuilder',
  
  // This will finally override the webpack configuration
  // src: [path.join(srcRoot, 'scripts/ts/app.ts')],
  // dest: path.join(destRoot, 'jss'),
  // outFile: 'sample-ts.js',
  buildOptions: {
    webpackConfig: 'webpack.config.js'
  },
  moduleOptions: {
    // webpack configuration comes here. This will override webpack configuration file.
    webpack: {
    //   entry: path.resolve(srcRoot, 'scripts/ts/greet.ts'),
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
    //     filename: 'bundle.js',
    //     path: path.resolve(destRoot, 'js')
    //   },
    },
  }
};

// build manager
gbm({
  systemBuilds: {
    build: [webpack],
    clean: [ destRoot ],
    default: ['@clean', '@build'],
  }
});
```

#### Resources
  - You can also refer to an example at [examples/external]({{site.repo}}/examples/webpack/)