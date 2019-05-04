// Sample

const gbm = require('../../lib');
const upath = require('upath');

// set base directory to project root
process.chdir('../../');
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');

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
        require('postcss-preset-env'),
        require('postcss-utilities'),
        require('lost'),
      ]
    },
    stylelint: {
      "extends": [
        "stylelint-config-recommended",
        "./.stylelintrc"
        ],
      rules: {
        "function-calc-no-unspaced-operator": null,
        "no-descending-specificity": null
      },
      // "fix": true,
    }
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
    autoprefixer: false,
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
        require('postcss-preset-env'),
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
        require('postcss-preset-env'),
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
    watch: {browserSync:{server: upath.resolve(destRoot)}}
  }
});
