/**
 *  Documentation for Gulp Build Manager
 *
 */

import gbm from '../src';
import upath from 'upath';

process.chdir(__dirname);

const srcRoot = 'assets';
const destRoot = '.';
const jkDest = '../_gh_pages';

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

const typescript = {
  buildName: 'assets:typescript',
  builder: 'GTypeScriptBuilder',

  src: [upath.join(srcRoot, 'scripts/ts/**/*.ts')],
  dest: upath.join(destRoot, 'js'),
  buildOptions: {
    minifyOnly: true,
    tsConfig: './assets/scripts/tsconfig.json'
  },
  clean:[upath.join(destRoot, 'js')],
  watch: {livereload:true},
};

const images = {
  buildName: 'assets:images',
  builder: 'GImagesBuilder',
  src: [upath.join(srcRoot, 'images/**/*.*')],
  dest: upath.join(destRoot, 'images'),
  clean:[upath.join(destRoot, 'images')],
  watch: {livereload:true}
};

const assets = {
  buildName: 'assets',
  dependencies: gbm.parallel(scss, typescript, images),
};

const jekyll = {
  buildName: 'jekyll',
  builder: 'GJekyllBuilder',
  src: '.',
  dest: jkDest,
  moduleOptions: {
    jekyll: {
      command: 'build',
      options: ['--incremental']
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
