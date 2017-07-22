/**
 *  Documentation for Gulp Build Manager
 *
 */

import gbm from '../src';
import upath from 'upath';
import twigMarkdown from 'twig-markdown';

process.chdir(__dirname);

const srcRoot = 'assets';
const destRoot = '_build';

const twig = {
  buildName: 'twig',
  builder: 'GTwigBuilder',

  src: [upath.join(srcRoot, 'twig/*.twig')],
  dest: upath.join(destRoot, ''),
  buildOptions: {
    minify: true,
    prettify: true
  },
  moduleOptions: {
    twig: {
      base: upath.join(srcRoot, 'twig'),
      data: {
        site: {
          title: 'Gulp Build Manager',
          description: 'Easy to use, flexible gulp task manager.',
          baseurl: "/gulp-build-manager",
          url: "https://shnam7.github.io/",   // full path: https://shnam7.github.io/gulp-build-manager
        },
        // version: 1.6
      },
      extend: twigMarkdown,
      functions:[
        {
          name: "nameOfFunction",
          func: function (args) {
            return "the function";
          }
        }
      ],
      filters:[
        {
          name: "nameOfFilter",
          func: function (args) {
            return "the filter";
          }
        }
      ]
    },
    htmlPrettify: {indent_char: ' ', indent_size: 2},
    htmlmin: {
      collapseWhitespace: true,
    }
  },
  watch: {
    watched: [upath.join(srcRoot, 'twig/**/*.{twig,md}')],
    livereload:true
  },
  plugins:[
    // stream=>stream.pipe(require('gulp-debug')())
  ]
};

const scss = {
  buildName: 'scss',
  builder: 'GCSSBuilder',

  src: [upath.join(srcRoot, 'scss/**/*.scss')],
  dest: upath.join(destRoot, 'css'),
  buildOptions: {
    sourceMap: true,
    minifyOnly: true,
    postcss: true
  },
  moduleOptions: {
    postcss: {
      plugins:[
        require('postcss-cssnext')({features:{rem: false}}),
        require('postcss-utilities')(),
        require('lost')(),
        require('postcss-assets')({
          loadPaths:[upath.join(srcRoot, 'images')],
        }),
        require('postcss-inline-svg')(),
      ]
    },
  },
  watch: {livereload:true},
  plugins:[
    stream=>stream.pipe(require('gulp-plumber')()),
    new gbm.FilterPlugin(['**/*.min.css'])
  ]
};

const typescript = {
  buildName: 'typescript',
  builder: 'GTypeScriptBuilder',

  src: [upath.join(srcRoot, 'scripts/ts/**/*.ts')],
  dest: upath.join(destRoot, 'js'),
  buildOptions: {
    sourceMap: true,
    minifyOnly: true,
    tsConfig: './assets/scripts/tsconfig.json'
  },
  moduleOptions: {},
  watch: {livereload:true},
};

const images = {
  buildName: 'images',
  builder: 'GImagesBuilder',
  src: [upath.join(srcRoot, 'images/**/*.*')],
  dest: upath.join(destRoot, 'images'),
  watch: {livereload:true}
};

const build = gbm.parallel('twig','scss', 'typescript', 'images');

// const dist = {
//   buildName: 'dist',
//   builder: 'GBuilder',
//   src: [upath.join(destRoot, '**/*.*')],
//   dest: '../../docs',
//   dependencies: build,
//   watch: {watched:[]}
// };


// create gbmConfig object
const gbmConfig = {
  builds: [twig, scss, typescript, images],
  systemBuilds: {
    clean: [destRoot],
    build: build,
    default: ['@clean', '@build'],
    watch: {livereload:{start:true}}
  }
};

gbm.loadBuilders(gbmConfig);
