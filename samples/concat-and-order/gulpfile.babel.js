'use strict';

import gbm from 'gulp-build-manager';
import upath from 'upath';

process.chdir(__dirname);

let srcRoot = 'assets';
let destRoot = '_build';

let concat = {
  buildName: 'concat',
  builder: 'GConcatBuilder',
  src: [upath.join(srcRoot, '*.js')],
  order:['file2.js','*.js'],
  dest: destRoot,
  outFile: 'concated.js'
};

// create gbmConfig object
const gbmConfig = {
  builds: [concat],
  systemBuilds: {
    clean:[destRoot],
    default: 'concat',
  }
};

gbm.loadBuilders(gbmConfig);
