'use strict';

import gbm from 'gulp-build-manager';
import upath from 'upath';
import buildSet from 'gulp-build-manager/lib/buildSet';


process.chdir(__dirname);

let srcRoot = 'assets';
let destRoot = '_build';

let sassTest = [
  {
    buildName: '--copyHtml',
    builder: 'GBuilder',
    src: upath.join(srcRoot, '*.html'),
    dest: destRoot
  },
  {
    buildName: 'sass',
    builder: 'GSassBuilder',
    src: [
      upath.join(srcRoot, 'scss/**/*.scss'),
      upath.join(srcRoot, 'sass/**/*.sass')
    ],
    dest: upath.join(destRoot, 'css'),
    buildOptions: {
      // enableLint: false,
      enablePostCSS: true,
      postcss: {
        plugins: [
          require('postcss-cssnext'),
          require('postcss-utilities'),
          require('lost'),
        ]
      }
    },
    moduleOptions: {
      sass: {
        includePaths: [
          'bower_components',
          'd:/web/lib/wcl/assets/scss',
          'assets/scss'
        ]
      },
    },
    triggers: '--copyHtml',
    watch: {livereload: true}
  }
];

let postCSS = {
  buildName: 'postcss',
  builder: 'GPostCSSBuilder',
  src: [upath.join(srcRoot, 'postcss/**/*.pcss')],
  dest: upath.join(destRoot, 'css'),
  buildOptions: {
    enableLint: false,
    postcss:{
      plugins: [
        require('postcss-cssnext'),
        require('postcss-utilities'),
      ]
    }
  },
  moduleOptions: {},
  watch: {livereload:true}
};

// create gbmConfig object
const gbmConfig = {
  builds: [
    sassTest,
    postCSS
  ],

  systemBuilds: {
    build: buildSet('sass', 'postcss'),
    clean: [destRoot],
    default: ['@clean', '@build'],
    watch: {livereload:{start:true}}
  }
};

gbm.loadBuilders(gbmConfig);
