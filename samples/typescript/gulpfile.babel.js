// import gulp-build-manager
import gbm from 'gulp-build-manager';
import upath from 'upath';

process.chdir(__dirname);

let srcRoot = 'assets';
let destRoot = '_build';


/**
 * Define build items
 */

let typeScript = {
  buildName: 'typeScript',
  builder: 'GTypeScriptBuilder',
  src: [upath.join(srcRoot, 'scripts/ts/**/*.ts')],

  // use order property to set outFile orders
  order: ['*ts-2.ts'],
  dest: (file) => file.base,
  outFile: upath.join(destRoot, 'js/sample-ts.js'),
  buildOptions: {
    // You can specify tsconfig.json file here. To create a default one, run 'tsc -init'
    tsConfig: upath.join(srcRoot, 'scripts/tsconfig.json')
  },
  moduleOptions: {
    // this will override the tsConfig settings in buildOptions
    typescript: {
      // "target": "es5",
      // "module": "none",
      // "noImplicitAny": true,
      // "noEmitOnError": true
    }
  },
};


/**
 * Create gbmConfig object
 */
const gbmConfig = {
  builds: [typeScript],
  systemBuilds: {
    // 'copy' and 'images' will be executed in paralle, and then zip will be executed in series
    build: 'typeScript',
    clean: [
      destRoot,
      upath.join(srcRoot, 'scripts/ts/**/*.{js,map}')
    ],
    default: ['@clean', '@build'],
  }
};

gbm.loadBuilders(gbmConfig);
