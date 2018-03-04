// Sample

const gbm = require('../../lib');
const upath = require('upath');

process.chdir(__dirname);

const srcRoot = 'assets';
const destRoot = '_build';

/**
 * Define build items
 */

const coffeeScript = {
  buildName: 'coffeeScript',
  builder: 'GCoffeeScriptBuilder',
  src: [upath.join(srcRoot, 'scripts/coffee/**/*.coffee')],

  // use order property to set outFile orders
  order: ['*main.coffee'],
  dest: upath.join(destRoot, 'js'),
  outFile: 'sample.js',
  buildOptions: {
    lint: true,
    // minify: true,
    minifyOnly:true,
    sourceMap: true
  },
  moduleOptions: {
    // to enable uglify, coffee output need to be transpiled to es5 using babel by passing the options below
    coffee: {
      transpile: {
        "presets": ["env"]
      },
    }
  }
};

/**
 * Create gbmConfig object
 */
gbm({
  systemBuilds: {
    build: [coffeeScript],
    clean: [destRoot],
    default: ['@clean', '@build'],
  }
});
