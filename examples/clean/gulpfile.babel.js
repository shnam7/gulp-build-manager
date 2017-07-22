// Sample

import gbm from '../../src';
import upath from 'upath';

process.chdir(__dirname);

let srcRoot = 'assets';
let destRoot = '_build';

let copy = {
  buildName: 'copy',
  builder: 'GBuilder',
  src: [upath.join(destRoot, 'do-not-delete/sample.txt')],
  dest: destRoot
};

let task1 = {
  buildName: 'task1',
  builder: (conf, mopts, done)=>{
    console.log(`task1 executed: src=${conf.src}, clean=${conf.clean}`);
    done(); // signal end of task
  },

  // add clean targets for task1
  clean: [upath.join(srcRoot, 'task1/**/*.txt')]
};

let task2 = {
  buildName: 'task2',
  builder: (conf, mopts, done)=>{
    console.log(`task1 executed: src=${conf.src}, clean=${conf.clean}`);
    done(); // signal end of task
  },

  // add clean targets for task2
  clean: [
    upath.join(srcRoot, 'task2/**/dummy.txt'),

    // override systemBuilds settings and keep 'do-not-delete' directory
    "!" + destRoot,
    upath.join(destRoot, '**/*'),
    "!" + upath.join(destRoot, '{do-not-delete,do-not-delete/**/*}'),
  ]
};

// create gbmConfig object
gbm({
  builds: [copy, task1, task2],

  systemBuilds: {
    build: ['copy', 'task1', 'task2'],

    // clean target for systemBuilds
    clean: [destRoot],
    default: ['@clean', '@build']
  }
});
