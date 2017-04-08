/**
 * config for custom builds
 *
 */

export default module.exports = [
  {
    buildName: 'custom',
    builder: (conf, defaultModuleOptions, done)=>{
      console.log('CustomBuild Task: Hello!!!', conf.src);
      done();
    },

    src: [],
  },
];
