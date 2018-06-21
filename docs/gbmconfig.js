/**
 *  Documentation for Gulp Build Manager
 *
 */

const gbm = require('../lib');
const upath = require('upath');

const projectName = upath.basename(__dirname);   // set template name to parent directory name
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = basePath;
const destRoot = upath.join(basePath, '_site');
const prefix = projectName + ':';
const sourceMap = false;

const docs = {
  scss: {
    buildName: prefix + 'scss',
    builder: 'GCSSBuilder',
    src: [upath.join(srcRoot, 'assets/scss/**/*.scss')],
    dest: upath.join(srcRoot, 'css'),
    buildOptions: {
      minifyOnly: true,
      sourceMap: sourceMap
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
    clean: [upath.join(srcRoot, 'css')]
  },

  scripts: {
    buildName: prefix + 'scripts',
    builder: 'GTypeScriptBuilder',
    src: [upath.join(srcRoot, 'assets/scripts/**/*.ts')],
    dest: upath.join(srcRoot, 'js'),
    buildOptions: {
      minifyOnly: true,
      sourceMap: sourceMap,
      // tsConfig: './assets/scripts/tsconfig.json',
      // printConfig: true
    },
    // flushStream: true,
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
    clean: [upath.join(srcRoot, 'js')]
  },

  jekyll: {
    buildName: prefix + 'jekyll',
    builder: 'GJekyllBuilder',
    src: upath.join(srcRoot, ''),
    dest: destRoot,
    flushStream: true,
    moduleOptions: {
      jekyll: {
        command: 'build',
        args: [
          '--safe',       // github runs in safe mode foe security reason. Custom plugins are not supported.
          '--baseurl http://localhost:3000',  // root folder relative to local server,
          '--incremental'
        ]
      }
    },
    watch: {
      watched: [
        upath.join(srcRoot, '**/*'),
        // TODO glob exclude not working: gulp issue #2192
        '!' + upath.join(srcRoot, '{assets,assets/**/*}'),
        '!' + upath.join(srcRoot, '{_site,_site/**/*}'),
        '!' + upath.join(srcRoot, '{.jekyll-metadata,gbmconfig.js,gulpfile.js}'),
      ]
    },
    clean: [destRoot, upath.join(srcRoot, '.jekyll-metadata')],
  },

  get build() {
    return gbm.parallel(this.scss, this.scripts, this.jekyll)
  },
};

module.exports = docs;
