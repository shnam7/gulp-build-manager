// Sample

import gbm from '../../src';
import upath from 'upath';

process.chdir(__dirname);

const srcRoot = 'assets';
const destRoot = '_build';


/**
 * Define build items
 */

const typeScript = {
  buildName: 'typeScript',
  builder: 'GTypeScriptBuilder',
  src: [upath.join(srcRoot, 'scripts/ts/**/!(*.d).ts')],

  // use order property to set outFile orders
  order: ['*ts-2.ts'],
  dest: (file) => file.base,
  outFile: upath.join(destRoot, 'js/sample-ts.js'),
  buildOptions: {
    sourceMap: true,
    minify: true,
    // You can specify tsconfig.json file here. To create a default one, run 'tsc -init'
    tsConfig: upath.join(srcRoot, 'scripts/tsconfig.json')
  },
  // moduleOptions: {
  //   // this will override the tsConfig settings in buildOptions
  //   typescript: {
  //     // "outFile": "sample-ts.js",
  //     // "outDir": upath.resolve(destRoot, 'js'),
  //     // "declarationDir": upath.resolve(destRoot, '@types')
  //
  //     // "target": "es5",
  //     // "module": "none",
  //     // "noImplicitAny": true,
  //     // "noEmitOnError": true
  //   }
  // },
};

gbm({
  systemBuilds: {
    build: typeScript,
    clean: [
      destRoot,
      upath.join(srcRoot, 'scripts/ts/**/*.{js,map,d.ts}')
    ],
    default: ['@clean', '@build'],
  }
});
