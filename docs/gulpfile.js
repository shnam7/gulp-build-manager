/**
 *  Documentation for Gulp Build Manager
 *
 */

const gbm = require('../lib');
const upath = require('upath');

process.chdir(__dirname);

const jkDest = '../_gh_pages';
const srcRoot = 'assets';
const destRoot = '.';

const scss = {
  buildName: 'assets:scss',
  builder: 'GCSSBuilder',

  src: [upath.join(srcRoot, 'scss/**/*.scss')],
  dest: upath.join(destRoot, 'css'),
  buildOptions: {
    minifyOnly: true,
    postcss: true,
    sourceMap: true
  },
  moduleOptions: {
    postcss: {
      plugins:[
        require('postcss-cssnext')({features:{rem: false}}),
        // require('postcss-utilities')(),
        // require('lost')(),
        // require('postcss-assets')({
        //   loadPaths:[upath.join(srcRoot, 'images')],
        // }),
        // require('postcss-inline-svg')({path:upath.join(srcRoot, 'images')}),
      ]
    },
  },
  clean:[upath.join(destRoot, 'css')],
};

const scripts = {
  buildName: 'assets:scripts',
  builder: 'GTypeScriptBuilder',

  src: [upath.join(srcRoot, 'scripts/**/*.ts')],
  dest: upath.join(destRoot, 'js'),
  buildOptions: {
    minifyOnly: true,
    sourceMap: true,
    // tsConfig: './assets/scripts/tsconfig.json',
    printConfig: true
  },
  clean:[upath.join(destRoot, 'js')],
  flushStream: true,

  moduleOptions: {
    // this will override the tsConfig settings in buildOptions
    typescript: {
      // "outFile": "sample-ts.js",
      // "outDir": upath.resolve(destRoot, 'js'),
      // "declarationDir": upath.resolve(destRoot, '@types')

      "target": "es5",
      // "module": "none",
      "noImplicitAny": false,
      "noEmitOnError": true,
      "lib": ['DOM','ES6','DOM.Iterable','ScriptHost']
    }
  },
};

const images = {
  buildName: 'assets:images',
  builder: 'GImagesBuilder',
  src: [upath.join(srcRoot, 'images/**/*.*')],
  dest: upath.join(destRoot, 'images'),
  flushStream: true,

  clean:[upath.join(destRoot, 'images')],
};

const assets = {
  buildName: 'assets',
  dependencies: gbm.parallel(scss, scripts, images),
};

const jekyll = {
  buildName: 'jekyll',
  builder: 'GJekyllBuilder',
  src: '.',
  dest: jkDest,
  // flushStream: true,
  moduleOptions: {
    jekyll: {
      command: 'build',
      options: [
        '--safe',       // github runs in safe mode foe security reason. Custom plugins are not supported.
        // '--baseurl http://localhost:63342/gulp-build-manager/_gh_pages',  // root folder relative to local server,
        '--baseurl http://localhost:3100',  // root folder relative to local server,
        '--incremental'
      ]
    }
  },
  watch: {
    watched: ['**/*', '!.jekyll-metadata', '!assets/**/*', '!gulpfile.*']
  },
  clean: [jkDest, '.jekyll-metadata'],
};


gbm({
  systemBuilds: {
    build: [assets, jekyll],
    clean: [],
    default: ['@clean', '@build'],
    watch: {
      // livereload:{start:true},
      browserSync: {
        server: '../_gh_pages',
        port: 3100,
        // reloadDelay: 0
      }
    }
  },
  moduleOptions: {del: {force:true}}  // enable files outside of this project to be deleted
});
