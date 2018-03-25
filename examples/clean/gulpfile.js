// Sample

const gbm = require('../../lib');
const upath = require('upath');

process.chdir(__dirname);

const srcRoot = 'assets';
const destRoot = '_build';

const copy = {
  buildName: 'copy',
  builder: 'GBuilder',
  src: [upath.join(destRoot, 'do-not-delete/sample.txt')],
  dest: destRoot
};

const task1 = {
  buildName: 'task1',
  builder: (conf, mopts, done)=>{
    console.log(`task1 executed: src=${conf.src}, clean=${conf.clean}`);
    done(); // signal end of task
  },

  // add clean targets for task1
  clean: [upath.join(srcRoot, 'task1/**/*.txt')]
};

const task2 = {
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
  systemBuilds: {
    build: [copy, task1, task2],
    clean: [destRoot],
    default: ['@clean', '@build']
  }
});