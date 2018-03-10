// Sample

const gbm = require('../../lib');
const upath = require('upath');

process.chdir(__dirname);

const srcRoot = 'assets';
const destRoot = '_build';

const html = {
  buildName: 'html',
  builder: 'GBuilder',
  src: [upath.join(srcRoot, 'html/**/*.html')],
  dest: destRoot
};

const scss = {
  buildName: 'scss',
  builder: 'GCSSBuilder',
  src: [upath.join(srcRoot, 'scss/**/*.scss')],
  dest: upath.join(destRoot, 'css'),
  buildOptions: {
    postcss: true
  }
};

// create gbmConfig object
gbm({
  systemBuilds: {
    build: [html, scss],
    clean: [destRoot],
    watch: {
      livereload: { start: true },
      browserSync: { server: './_build' }
    },
    default: ['@clean', '@build']
  }
});
