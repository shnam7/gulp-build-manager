// Sample

import gbm from '../../src';
import upath from 'upath';

process.chdir(__dirname);

const srcRoot = 'assets';
const destRoot = '_build';


/**
 * Define build items
 */

const javaScript = {
  buildName: 'javaScript',
  builder: 'GJavaScriptBuilder',
  src: [upath.join(srcRoot, 'scripts/js/**/*.js')],

  // use order property to set outFile orders
  order: ['*main.js'],
  dest: upath.join(destRoot, 'js'),
  outFile: 'sample.js',
  buildOptions: {
    lint: true,
    babel: true,
    minify: true,
    sourceMap: true
  },
  moduleOptions: {
    eslint: {
      // "extends": "eslint:recommended",
      // "rules": {
      //   "strict": 1,
      // },
      "parserOptions": {
        "ecmaVersion": 6,
      }
    }
  },
};

/**
 * Create gbmConfig object
 */
gbm({
  builds: [javaScript],
  systemBuilds: {
    // 'copy' and 'images' will be executed in paralle, and then zip will be executed in series
    build: 'javaScript',
    clean: [destRoot],
    default: ['@clean', '@build'],
  }
});
