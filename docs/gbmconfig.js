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
const sourceMap = true;

const docs = {
  scss: {
    buildName: prefix + 'scss',
    builder: 'GCSSBuilder',
    src: [upath.join(srcRoot, 'assets/scss/**/*.scss')],
    dest: upath.join(srcRoot, 'css'),
    buildOptions: {
      lint: true,
      minifyOnly: true,
      outFileOnly: false,
      sourceMap: sourceMap
    },
    flushStream: true,
    moduleOptions: {
      autoprefixer: {
        // default browserlist is: '> 0.5%, last 2 versions, Firefox ESR, not dead'
        browsers: ['last 4 version']
      },
      postcss: {
        plugins:[
          require('postcss-cssnext')({features:{rem: false}}),
          require('postcss-utilities')(),
          // require('lost')(),
          // require('postcss-assets')({
          //   loadPaths:[upath.join(srcRoot, 'images')],
          // }),
          require('postcss-inline-svg')({path:upath.join(srcRoot, 'images')}),
        ]
      },
    },
    postBuild: (builder)=> {
      // return promise to be sure copy operation is done before the task finishes
      return gbm.GPlugin.exec(builder, 'echo', ['>>', upath.join(srcRoot, '.scss-triggered')]);
    },
    clean: [upath.join(srcRoot, 'css'), upath.join(srcRoot, '.scss-triggered')]
  },

  scripts: {
    buildName: prefix + 'scripts',
    builder: 'GTypeScriptBuilder',
    src: [upath.join(srcRoot, 'assets/scripts/**/*.ts')],
    dest: upath.join(srcRoot, 'js'),
    flushStream: true,
    buildOptions: {
      minifyOnly: true,
      sourceMap: sourceMap,
      tsConfig: upath.join(basePath, "tsconfig.json"),
      // printConfig: true
    },
    flushStream: true,
    postBuild: (builder)=> {
      // return promise to be sure copy operation is done before the task finishes
      return gbm.GPlugin.exec(builder, 'echo', ['>>', upath.join(srcRoot, '.js-triggered')]);
    },
    clean: [upath.join(srcRoot, 'js'), upath.join(srcRoot, '.js-triggered')]
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
        upath.join(srcRoot, '**/*.{yml,html,md}'),
        upath.join(srcRoot, '.*-triggered'),
        '!' + upath.join(srcRoot, '{js,css}'),
        '!' + upath.join(srcRoot, '{.jekyll-metadata,gbmconfig.js,gulpfile.js}'),

        // TODO glob exclude not working correctly for watcher: gulp issue #2192
        // '!' + upath.join(srcRoot, '{assets,assets/**/*}'),
        // '!' + upath.join(srcRoot, '{_site,_site/**/*}'),
        // '!' + upath.join(srcRoot, '{.jekyll-metadata,gbmconfig.js,gulpfile.js}'),
        // upath.join(srcRoot, '**/*'),
      ]
    },
    clean: [destRoot, upath.join(srcRoot, '.jekyll-metadata')],
  },

  get build() {
    return [gbm.parallel(this.scss, this.scripts), this.jekyll]
  },
};

module.exports = docs;
