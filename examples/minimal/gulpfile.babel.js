'use strict';

import gbm from '../../src';

process.chdir(__dirname);

const simpleTask = {
  buildName: 'simpleTask',
  // builder: (conf, mopts, done)=>{
  //   console.log('simpleTask executed');
  //   done(); // signal end of task
  // },
  triggers: gbm.parallel((done)=>{
    console.log('trigger successful.'); done();
  })
};

gbm({
  builds: [
    simpleTask
  ],

  systemBuilds: {
    default: 'simpleTask',
  }
});
