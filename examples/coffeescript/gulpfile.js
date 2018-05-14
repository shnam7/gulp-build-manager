// Sample

const gbm = require('../../lib');
const upath = require('upath');

// set base directory to project root
process.chdir('../../');
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');

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
    minify: true,
    // minifyOnly:true,
    sourceMap: true,
    // outFileOnly: false
  },
  moduleOptions: {
    // to enable uglify, coffee output need to be transpiled to es5 using babel by passing the options below
    // TODO May 6, 2018
    // If transpile option is given, gulp-coffee fails when sourcemaps are enabled.
    // No solution found, so this option is blocked until the solution is found.
    // coffee: {transpile: {"presets": ["env"]}}
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
