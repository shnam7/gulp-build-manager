/**
 * config for zip builds
 *
 */

export default module.exports = [
  {
    buildName: 'zip',
    builder: 'GZipBuilder',
    src: ['_build/**/*', 'assets/src/**/*'],
    dest: '_dist',
    outfile: 'sample.zip',

    buildOptions: {},
    moduleOptions: {}
  }
];
