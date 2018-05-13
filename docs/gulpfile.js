/**
 *  Documentation for Gulp Build Manager
 *
 */

const gbm = require('../lib');
const upath = require('upath');

// set base directory to project root
process.chdir('../');
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '.');
const jkSrc = basePath;
const jkDest = '_gh_pages';

const docs = {
  scss: {
    buildName: 'assets:scss',
    builder: 'GCSSBuilder',

    src: [upath.join(srcRoot, 'scss/**/*.scss')],
    dest: upath.join(destRoot, 'css'),
    buildOptions: {
      minifyOnly: true,
      postcss: true,
      // sourceMap: true
    },
    moduleOptions: {
      postcss: {
        plugins:[
          require('postcss-cssnext')({features:{rem: false}}),
          require('postcss-utilities')(),
          // require('lost')(),
          // require('postcss-assets')({
          //   loadPaths:[upath.join(srcRoot, 'images')],
          // }),
          // require('postcss-inline-svg')({path:upath.join(srcRoot, 'images')}),
        ]
      },
    },
    clean:[upath.join(destRoot, 'css')],
  },

  scripts: {
    buildName: 'assets:scripts',
    builder: 'GTypeScriptBuilder',

    src: [upath.join(srcRoot, 'scripts/**/*.ts')],
    dest: upath.join(destRoot, 'js'),
    buildOptions: {
      minifyOnly: true,
      // sourceMap: true,
      // tsConfig: './assets/scripts/tsconfig.json',
      printConfig: true
    },
    clean: [upath.join(destRoot, 'js')],
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
        "lib": ['DOM', 'ES6', 'DOM.Iterable', 'ScriptHost']
      }
    },
  },

  images: {
    buildName: 'assets:images',
    builder: 'GImagesBuilder',
    src: [upath.join(srcRoot, 'images/**/*.*')],
    dest: upath.join(destRoot, 'images'),
    flushStream: true,
    clean: [upath.join(destRoot, 'images')],
  },

  jekyll: {
    buildName: 'jekyll',
    builder: 'GJekyllBuilder',
    src: jkSrc,
    dest: jkDest,
    // flushStream: true,
    moduleOptions: {
      jekyll: {
        command: 'build',
        args: [
          '--safe',       // github runs in safe mode foe security reason. Custom plugins are not supported.
          // '--baseurl http://localhost:63342/gulp-build-manager/_gh_pages',  // root folder relative to local server,
          '--baseurl http://localhost:3100',  // root folder relative to local server,
          '--incremental'
        ]
      }
    },
    watch: {
      watched: [
        upath.join(jkSrc, '**/*'),
        '!' + upath.join(jkSrc, '.jekyll-metadata'),
        '!' + upath.join(jkSrc, 'assets/**/*'),
        '!' + upath.join(jkSrc, '!gulpfile.*')
      ]
    },
    clean: [jkDest, upath.join(jkSrc, '.jekyll-metadata')],
  }
};

gbm({
  systemBuilds: {
    build: [gbm.parallel(docs.scss, docs.scripts, docs.images), docs.jekyll],
    clean: [],
    default: ['@clean', '@build'],
    watch: {
      // livereload:{start:true},
      browserSync: {
        server: '_gh_pages',
        port: 3100,
        // reloadDelay: 500
      }
    }
  },
  moduleOptions: {del: {force:true}}  // enable files outside of this project to be deleted
});
