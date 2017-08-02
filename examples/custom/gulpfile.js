// Sample

const gbm = require('../../lib');

process.chdir(__dirname);

class MyBuilder extends gbm.GBuilder {
  constructor() { super()}
  build(defaultModuleOptions, conf, done) {
    console.log('MyBuilder loaded. default operation will be bypassed. Bye!');
    done();
  }
}

const customFunction = {
  buildName: 'customFunction',
  builder: (defaultModuleOptions, conf, done) => {
    console.log('Custom builder using function(): Hello!!!', conf.buildName);
    done();
  }
};

const customBuilder = {
  buildName: 'customBuilder',
  builder: 'GCustomBuilder'
};

const myBuilder = {
  buildName: 'myBuilder',
  builder: new MyBuilder(),
};


// create gbmConfig object
gbm({
  customBuilderDir: './custom-builders',
  systemBuilds: {
    build: [customFunction, customBuilder, myBuilder],
    default: ['customFunction', 'customBuilder', 'myBuilder']
  }
});
