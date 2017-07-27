// Sample

import gbm from '../../src';
import upath from 'upath';

process.chdir(__dirname);

const srcRoot = 'assets';
const destRoot = '_build';


const javaScript = {
  buildName: 'javaScript',
  builder: 'GJavaScriptBuilder',
  src: [upath.join(srcRoot, 'scripts/js/**/*.js')],

  // use order property to set outFile orders
  order: ['*main.js'],
  dest: upath.join(destRoot, 'js'),
  outFile: 'sample.js',
  buildOptions: {
    // lint: true,
    babel: true,
    minify: true,
    sourceMap: true
  },
  // moduleOptions: {
  //   eslint: {
  //     // "extends": "eslint:recommended",
  //     // "rules": {
  //     //   "strict": 1,
  //     // },
  //     "parserOptions": {
  //       "ecmaVersion": 6,
  //     }
  //   }
  // },
};

gbm({
  systemBuilds: {
    build: [javaScript],
    clean: [destRoot],
    default: ['@clean', '@build'],
  }
});
