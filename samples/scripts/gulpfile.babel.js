'use strict';

// import gulp-build-manager
import gbm from 'gulp-build-manager';
import buildSet from 'gulp-build-manager/lib/buildSet';
import upath from 'upath';

process.chdir(__dirname);

let srcRoot = 'assets';
let destRoot = '_build';


/**
 * Define build items
 */

let javaScript = [
  {
    buildName: '--coffeeScript',
    builder: 'GCoffeeScriptBuilder',
    src: [upath.join(srcRoot, 'coffee/**/*.coffee')],
    dest: (file) => file.base,

    // To enable lint, uncomment below block
    // buildOptions: {
    //   enableLint: true
    // }
  },
  {
    buildName: '--babel',
    builder: 'GJavaScriptBuilder',
    src: [upath.join(srcRoot, 'es6/**/*.es6')],
    dest: (file) => file.base,
    buildOptions: {
      // enableLint:true,
      enableBabel: true
    }
  },
  {
    buildName: 'javaScript',
    builder: 'GJavaScriptBuilder',
    src: [upath.join(srcRoot, '{coffee,es6,js}/**/*.js')],
    dest: destRoot,
    outFile: 'sample.js',
    dependencies: buildSet('--coffeeScript', '--babel'),

    // lint can be optionally enabled
    // buildOptions: {
    //   enableLint: true
    // }
    watch: {livereload: true}
  }
];

let typeScript = [
  {
    buildName: '--webPack',
    builder: 'GWebPackBuilder',
    buildOptions: {webpack: './webpack.config.js'},
    watch: {livereload: true}
  },
  {
    buildName: 'typeScript',
    builder: 'GTypeScriptBuilder',
    src: [upath.join(srcRoot, 'ts/**/*.ts')],
    dest: (file) => file.base,
    outFile: upath.join(srcRoot, 'ts/sample-ts.js'),
    buildOptions: {
      // You can specify tsconfig.json file here. To create a default one, run 'tsc -init'
      // tsConfig: upath.join(srcRoot, 'ts/tsconfig.json')
    },
    moduleOptions: {
      // this will override the tsConfig settings in buildOptions
      typescript: {
        "target": "es5",
        "module": "none",
        "noImplicitAny": true,
        "noEmitOnError": true
      }
    },
    triggers: '--webPack'
  }
];



/**
 * Create gbmConfig object
 */
const gbmConfig = {
  builds: [
    javaScript,
    typeScript
  ],

  systemBuilds: {
    // 'copy' and 'images' will be executed in paralle, and then zip will be executed in series
    build: buildSet('javaScript', 'typeScript'),
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
};

gbm.loadBuilders(gbmConfig);
