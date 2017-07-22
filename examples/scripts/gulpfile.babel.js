// Sample

import gbm from '../../src';
import upath from 'upath';

process.chdir(__dirname);

const parallel = gbm.parallel;
const srcRoot = 'assets';
const destRoot = '_build';


/**
 * Define build items
 */

const __coffeeScript = {
  buildName: '__coffeeScript',
  builder: 'GCoffeeScriptBuilder',
  src: [upath.join(srcRoot, 'coffee/**/*.coffee')],
  dest: (file) => file.base,
  buildOptions: {
    lint: true,
    // sourceMap: true,
    // minify: true
  }
};

const __babel = {
  buildName: '__babel',
  builder: 'GJavaScriptBuilder',
  src: [upath.join(srcRoot, 'es6/**/*.es6')],
  dest: (file) => file.base,
  buildOptions: {
    babel: true,
    lint: true,
    sourceMap: true,
  },
  moduleOptions: {
    eslint: {
      parserOptions: {
        ecmaVersion: 6
      },
      rules: {
        strict: 1
      }
    }
  }
};

const javaScript = {
  buildName: 'javaScript',
  builder: 'GJavaScriptBuilder',
  src: [upath.join(srcRoot, '{coffee,es6,js}/**/*.js')],
  order:['sample1.js'],
  dest: upath.join(destRoot, 'js'),
  outFile: 'sample.js',
  dependencies: parallel('__coffeeScript', '__babel'),
  buildOptions: {
    minify: true,
    sourceMap: true
  },
  watch: {livereload: true}
};

const typeScript = [
  // {
  //   buildName: '__webPack',
  //   builder: 'GWebPackBuilder',
  //   moduleOptions: {webpack: './webpack.config.js'},
  //   watch: {livereload: true}
  // },
  {
    buildName: 'typeScript',
    builder: 'GTypeScriptBuilder',
    src: [upath.join(srcRoot, 'ts/**/*.ts')],
    // dest: (file) => file.base,
    dest: upath.resolve(destRoot, 'js'),
    outFile: 'sample-ts.js',
    buildOptions: {
      minify:true,
      sourceMap: true,
      // You can specify tsconfig.json file here. To create a default one, run 'tsc -init'
      // tsConfig: upath.join(srcRoot, 'ts/tsconfig.json')
    },
    moduleOptions: {
      // this will override the tsConfig settings in buildOptions
      typescript: {
        "target": "es5",
        // "module": "none",
        "noImplicitAny": true,
        "noEmitOnError": true,
        "declaration": true,
      }
    },
    // triggers: '__webPack'
  }
];


/**
 * Create gbmConfig object
 */
gbm({
  builds: [
    __coffeeScript,
    __babel,
    javaScript,
    typeScript
  ],

  systemBuilds: {
    build: parallel('javaScript', 'typeScript'),
    clean: [
      destRoot,
      upath.join(srcRoot, '{coffee,es6,ts}/**/*.{js,map}')
    ],
    default: ['@clean', '@build'],

    // if 'watch' property exists, watch task is created.
    // To enable livereload, uncomment below livereload option
    watch: {
      // livereload: {start:true}
    },
  }
});
