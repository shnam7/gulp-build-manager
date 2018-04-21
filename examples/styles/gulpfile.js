// Sample

const gbm = require('../../lib');
const upath = require('upath');

process.chdir(__dirname);

const srcRoot = 'assets';
const destRoot = '_build';

const copyHtml = {
  buildName: 'copyHtml',
  builder: 'GBuilder',
  src: upath.join(srcRoot, '*.html'),
  dest: destRoot
};

const sass = {
  buildName: 'sass',
  builder: 'GCSSBuilder',
  src: [upath.join(srcRoot, 'scss/**/*.scss')],
  dest: upath.join(destRoot, 'css'),
  buildOptions: {
    sourceType: 'scss',
    sourceMap: true,
    lint: true,
    minify: true,
    postcss: true
  },
  moduleOptions: {
    sass: {
      includePaths: [
        'assets/scss'
      ]
    },
    postcss: {
      plugins: [
        require('postcss-cssnext'),
        require('postcss-utilities'),
        require('lost'),
      ]
    }
    // stylelint: {
    //   configFile: upath.join(srcRoot, '.stylelintrc')
    // }
  },
  watch: {livereload: true}
};

const less = {
  buildName: 'less',
  builder: 'GCSSBuilder',
  src: [upath.join(srcRoot, 'less/**/*.less')],
  dest: upath.join(destRoot, 'css'),
  buildOptions: {
    sourceType: 'less',
    sourceMap: true,
    lint: true,
    minify: true,
    autoPrefixer: false,
    // postcss: true
  },
  moduleOptions: {
    // sass: {
    //   includePaths: [
    //     'assets/scss'
    //   ]
    // },
    postcss: {
      plugins: [
        require('postcss-cssnext'),
        require('postcss-utilities'),
        require('lost'),
      ]
    }
  },
  watch: {livereload: true}
};

const postcss = {
  buildName: 'postcss',
  builder: 'GCSSBuilder',
  src: [upath.join(srcRoot, 'postcss/**/*.pcss')],
  dest: upath.join(destRoot, 'css'),
  buildOptions: {
    lint: true,
    sourceMap: true,
    minify: true,
    postcss: true
  },
  moduleOptions: {
    postcss:{
      plugins: [
        require('postcss-cssnext'),
        require('postcss-utilities'),
      ]
    },
  },
  watch: {livereload:true}
};


gbm({
  systemBuilds: {
    build: gbm.parallel(sass, less, postcss, copyHtml),
    clean: [destRoot],
    default: ['@clean', '@build'],
    // watch: {livereload:{start:true}}
    watch: {browserSync:{server: '_build'}}
  }
});
