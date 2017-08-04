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
    postcss: true
  },
  moduleOptions: {
    postcss: {
      plugins:[
        require('postcss-cssnext')({features:{rem: false}}),
        require('postcss-utilities')(),
        require('lost')(),
        // require('postcss-assets')({
        //   loadPaths:[upath.join(srcRoot, 'images')],
        // }),
        require('postcss-inline-svg')({path:upath.join(srcRoot, 'images')}),
      ]
    },
  },
  clean:[upath.join(destRoot, 'css')],
  watch: {livereload:true}
};

const scripts = {
  buildName: 'assets:scripts',
  builder: 'GTypeScriptBuilder',

  src: [upath.join(srcRoot, 'scripts/**/*.ts')],
  dest: upath.join(destRoot, 'js'),
  buildOptions: {
    minifyOnly: true,
    // tsConfig: './assets/scripts/tsconfig.json'
  },
  clean:[upath.join(destRoot, 'js')],
  watch: {livereload:true},
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
  watch: {livereload:true}
};

const incFiles = {
  buildName: 'incFiles',
  builder: 'GMarkdownBuilder',
  src: [upath.join(srcRoot, '_includes/sidebar.md')],
  dest: upath.join(destRoot, '_includes'),
  flushStream: true,
  buildOptions: {
    minify: true,
    prettify: true
  },
  moduleOptions: {
    htmlPrettify: {indent_char: ' ', indent_size: 2},
  },
  clean: [upath.join(destRoot, '_includes/sidebar.html')]
};

const assets = {
  buildName: 'assets',
  dependencies: gbm.parallel(scss, scripts, images, incFiles),
};

const jekyll = {
  buildName: 'jekyll',
  builder: 'GJekyllBuilder',
  src: '.',
  dest: jkDest,
  moduleOptions: {
    jekyll: {
      command: 'build',
      options: [
        '--safe',       // github runs in safe mode foe security reason. Custom plugins are not supported.
        '--baseurl .',  // root folder relative to local server,
        '--incremental'
      ]
    }
  },
  watch: { watched: ['**/*', '!.jekyll-metadata', '!assets/**/*', '!gulpfile.*'], livereload:true },
  clean: [jkDest, '.jekyll-metadata'],
};


gbm({
  systemBuilds: {
    build: [assets, jekyll],
    clean: [],
    default: ['@clean', '@build'],
    watch: {livereload:{start:true}}
  },
  moduleOptions: {del: {force:true}}  // enable files outside of this project to be deleted
});
