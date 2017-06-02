/**
 * config for custom builds
 *
 */

import GBuilder from 'gulp-build-manager/lib/builders/GBuilder';

class MyBuilder extends GBuilder {
  constructor() { super()}
  build(defaultModuleOptions, conf, done) {
    console.log('MyBuilder loaded. default operation will be bypassed. Bye!');
    done();
  }
}


export default module.exports = [
  {
    buildName: 'custom:function',
    builder: (defaultModuleOptions, conf, done) => {
      console.log('Custom builder using function(): Hello!!!', conf.buildName);
      done();
    }
  },
  {
    buildName: 'custom:GCustomBuilder',
    builder: 'GCustomBuilder'
  },
  {
    buildName: 'custom:MyBuilder',
    builder: new MyBuilder(),
  },
  {
    buildName: 'custom',
    dependencies: ['custom:function', 'custom:GCustomBuilder', 'custom:MyBuilder']
  },
];
