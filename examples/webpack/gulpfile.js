// Sample


const gbm = require('../../lib');
const upath = require('upath');   // use path instead of upath to workaround windows/linux path notation issue

// set base directory to project root
process.chdir('../../');
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');
const prefix = 'weppack:';

const app= {
  pages: {
    buildName: prefix + 'twig',
    builder: 'GTwigBuilder',
    src: [upath.join(srcRoot, 'pages/**/*.html')],
    dest: upath.join(destRoot, ''),
    buildOptions: {prettify: true},
  },

  webpack: {
    buildName: prefix + 'webpack',
    builder: 'GWebpackBuilder',
    // src: [upath.join(srcRoot, 'scripts/ts/app.ts')],
    dest: upath.join(destRoot, 'js'),
    // outFile: 'app.min.js',
    buildOptions: {
      webpackConfig: upath.join(basePath, 'webpack.config.js')
    },
    moduleOptions: {
      webpack: {
        // entry: upath.resolve(srcRoot, 'scripts/ts/app.ts'),
        //   mode: 'production',
        //   // devtool: 'source-map',
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
        //     path: upath.resolve(destRoot, 'js-1')
        //   },
      },
    },
  },

  get build() {
    return gbm.parallel(this.pages, this.webpack)
  }
};


// build manager
gbm({
  systemBuilds: {
    build: app.build,
    clean: [
      destRoot,
    //   path.join(srcRoot, 'scripts/ts/**/*.{js,map,d.ts}'),
    //   path.join(srcRoot, 'node_modules')    // clean up temporary files in node_modules
    ],
    default: ['@clean', '@build'],
    watch: {browserSync:{server:destRoot}}
  }
});
