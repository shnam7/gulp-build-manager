/**
 * config for custom builds
 *
 */

export default module.exports = [
  {
    buildName: 'custom:function',
    builder: (defaultModuleOptions, conf, done)=>{
      console.log('Custom builder using function(): Hello!!!', conf.buildName);
      done();
    },
  },
  {
    buildName: 'custom:GCustomTestBuilder',
    builder: 'GCustomTestBuilder'
  },
  {
    buildName: 'custom',
    dependencies: ['custom:function', 'custom:GCustomTestBuilder']
  },
];
