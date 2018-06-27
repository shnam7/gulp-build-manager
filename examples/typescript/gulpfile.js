// Sample

const gbm = require('../../lib');
const upath = require('upath');

// set base directory to project root
process.chdir('../../');
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');

// build configuration
const typeScript = {
  buildName: 'typeScript',
  builder: 'GTypeScriptBuilder',
  src: [upath.join(srcRoot, 'scripts/ts/**/!(*.d).ts')],

  // use order property to set outFile orders
  order: ['*ts-2.ts'],
  // dest: (file) => file.base,
  dest: upath.join(destRoot, 'js'),
  outFile: 'sample-ts.js',
  // outFile: 'sample-ts.js',
  flushStream: true,
  buildOptions: {
    // lint: true,
    // printConfig: true,
    sourceMap: true,
    minify: true,
    // outFileOnly: false, --> this option is not supported in TypeScriptPlugin and TypeScriptBuilder

    // You can specify tsconfig.json file here. To create a default one, run 'tsc -init'
    tsConfig: upath.join(basePath, 'tsconfig.json')
  },
  moduleOptions: {
    // this will override the tsConfig settings in buildOptions
    typescript: {
      // target: "es6",
      // "outFile": "sample-ts.js",
      // "outDir": upath.resolve(destRoot, 'js'),
      // "declarationDir": upath.resolve(destRoot, '@types')

      // "target": "es5",
      // "module": "none",
      // "noImplicitAny": true,
      // "noEmitOnError": true
    }
  },
};


// build manager
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
