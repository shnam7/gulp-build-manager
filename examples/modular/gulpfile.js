// Sample

const gbm = require('../../lib');
const upath = require('upath');

// set base directory to project root
process.chdir('../../');
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');

const mylib = {
  scss: {
    buildName: 'mylib:scss',
    builder: 'GCSSBuilder',
    src: [upath.join(srcRoot, 'scss/**/*.scss')],
    dest: upath.join(destRoot, 'css'),
    buildOptions: {
      postcss: true
    }
  },

  scripts: {
    buildName: 'mylib:scripts',
    builder: 'GTypeScriptBuilder',
    src: [upath.join(srcRoot, 'scripts/ts/**/*.ts')],
    dest: upath.join(destRoot, 'js')
  },

  // uset get function here to have access to this mylib object
  get main() {
    return {
      buildName: 'mylib',
      dependencies: gbm.parallel(this.scss, this.scripts)
    }
  }
};

const docs = {
  scss: {
    buildName: 'docs:scss',
    builder: 'GCSSBuilder',
    src: [upath.join(srcRoot, 'docs/scss/**/*.scss')],
    dest: upath.join(destRoot, 'docs/css'),
    buildOptions: {
      postcss: true
    }
  },

  scripts: {
    buildName: 'docs:scripts',
    builder: 'GTypeScriptBuilder',
    src: [upath.join(srcRoot, 'docs/scripts/ts/**/*.ts')],
    dest: upath.join(destRoot, 'docs/js'),
  },

  // uset get function here to have access to this mylib object
  get main() {
    return {
      buildName: 'docs',
      dependencies: gbm.parallel(this.scss, this.scripts),
      clean: [upath.join(destRoot, 'docs'),]   // sample to show adding clean items
    }
  }
};

const demo = require('./demo/gbm.config');

// create gbmConfig object
gbm({
  systemBuilds: {
    build: [mylib.main, docs.main, demo.main],
    clean: [destRoot],
    default: ['@clean', '@build']
  }
});