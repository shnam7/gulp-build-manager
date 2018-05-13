// Sample

const gbm = require('../../lib');
const upath = require('upath');

// set base directory to project root
process.chdir('../../');
const basePath = upath.relative(process.cwd(), __dirname);
const srcRoot = upath.join(basePath, 'assets');
const destRoot = upath.join(basePath, '_build');

class MyPlugin extends gbm.GPlugin {
  process(builder) {
    console.log(`This is custom plugin. buildName=${builder.conf.buildName}`)
  }
}

const copy = {
  buildName: 'copy',
  builder: 'GBuilder',
  src: [upath.join(destRoot, 'do-not-delete/sample.txt')],
  dest: destRoot
};

const task1 = {
  buildName: 'task1',
  builder: (builder)=>{
    builder
      .chain(new MyPlugin())
      .chain((builder)=>console.log(`custom plugin#1, buildName=${builder.conf.buildName}`))
      .chain(()=>console.log('custom plugin'));
    console.log(`task1 executed: src=${builder.conf.src}, clean=${builder.conf.clean}`);
  },

  // add clean targets for task1
  clean: [upath.join(srcRoot, 'task1/**/*.txt')]
};

const task2 = {
  buildName: 'task2',
  builder: (builder)=>{
    console.log(`task2 executed: src=${builder.conf.src}, clean=${builder.conf.clean}`);
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