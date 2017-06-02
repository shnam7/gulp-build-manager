'use strict';

import gbm from 'gulp-build-manager';
import buildSet from 'gulp-build-manager/lib/buildSet';

process.chdir(__dirname);

// Create build definition Item #1
let buildItem1 = {
  buildName: 'task1',
  builder: (conf, mopts, done)=>{
    console.log('test1 executed - this will take 3 seconds to finish.');
    return new Promise(resolve=>{
      setTimeout(()=>{ resolve(); done(); }, 3000);
    });
  }
};

// Create build definition Item #2
let buildItem2 = {
  buildName: 'task2',
  builder: (conf, mopts, done)=>{
    console.log('test2 executed. This should have been executed after finishing task1');
    done();
  }
};

// Create build definition Item #3 which has dependency to series(task1, task2)
let buildItem3 = {
  buildName: 'taskMain',
  builder: (conf, mopts, done)=>{
    console.log('TaskMain executed.');
    done();
  },
  dependencies: ['task1', 'task2'],
  triggers: buildSet('task1', 'task2')
};



// create gbmConfig object
const gbmConfig = {
  builds: [
    buildItem1,
    buildItem2,
    buildItem3,
  ],

  systemBuilds: {
    default: 'taskMain'
  }
};

gbm.loadBuilders(gbmConfig);
