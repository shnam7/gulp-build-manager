'use strict';

// import gulp-build-manager
import gbm from 'gulp-build-manager';
import GBuilder from 'gulp-build-manager/lib/builders/GBuilder';

process.chdir(__dirname);

class MyBuilder extends GBuilder {
  constructor() { super()}
  build(defaultModuleOptions, conf, done) {
    console.log('MyBuilder loaded. default operation will be bypassed. Bye!');
    done();
  }
}


let customFunction = {
  buildName: 'customFunction',
  builder: (defaultModuleOptions, conf, done) => {
    console.log('Custom builder using function(): Hello!!!', conf.buildName);
    done();
  }
};

let customBuilder = {
  buildName: 'customBuilder',
  builder: 'GCustomBuilder'
};

let myBuilder = {
  buildName: 'myBuilder',
  builder: new MyBuilder(),
};


// create gbmConfig object
const gbmConfig = {
  customBuilderDir: './custom-builders',
  builds: [
    customFunction,
    customBuilder,
    myBuilder
  ],

  systemBuilds: {
    default: ['customFunction', 'customBuilder', 'myBuilder']
  }
};

gbm.loadBuilders(gbmConfig);
