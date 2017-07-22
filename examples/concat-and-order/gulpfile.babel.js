// Sample

import gbm from '../../src';
import upath from 'upath';

process.chdir(__dirname);

const srcRoot = 'assets';
const destRoot = '_build';

const concat = {
  buildName: 'concat',
  builder: 'GConcatBuilder',
  src: [upath.join(srcRoot, '*.js')],
  order:['file2.js','*.js'],
  dest: destRoot,
  outFile: 'concated.js'
};

// create gbmConfig object
gbm({
  builds: [concat],
  systemBuilds: {
    clean:[destRoot],
    default: 'concat',
  }
});
