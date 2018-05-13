'use strict';

const gbm = require('../../lib');

// set base directory to project root
process.chdir('../../');


// Create build definition Item #1
let buildItem1 = {
  buildName: 'task1',
  builder: ()=>{
    console.log('test1 executed - this will take 0.3 seconds to finish.');
    return new Promise(resolve=>setTimeout(()=>resolve(), 300));
  }
};

// Create build definition Item #2
let buildItem2 = {
  buildName: 'task2',
  builder: ()=>{
    console.log('test2 executed. This should have been executed after finishing task1');
  }
};

// Create build definition Item #3 which has dependency to series(task1, task2)
let buildItem3 = {
  buildName: 'taskMain',
  builder: ()=>{
    console.log('TaskMain executed.');
  },
  dependencies: ['task1', 'task2'],
  triggers: gbm.parallel('task1', 'task2')
};



// create gbmConfig object
gbm({
  systemBuilds: {
    build: [buildItem1, buildItem2, buildItem3],
    clean: [""],  // dummy to create '@close' task to make main gulpfile not to fail with error
    default: 'taskMain'
  }
});
