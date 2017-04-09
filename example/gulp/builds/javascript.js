/**
 * config for javascript builds
 *
 */

import gbmConfig from '../gbmconfig';
import upath from 'upath';

const srcRoot = gbmConfig.srcRoot;
const destRoot = gbmConfig.destRoot;

export default module.exports = [
  {
    buildName: 'javascript:core',
    builder: 'GJavaScriptBuilder',
    src: [
      upath.join(srcRoot, 'scripts/{coffee,ts}/{*,js/*}.js'),
      '!' + upath.join(srcRoot, 'scripts/js/*.js'),
    ],
    dest: upath.join(destRoot, 'js'),
    outfile: 'sample-script1.js',
    buildOptions: {
      enableLint: false,
      enableBabel: true
    },
    moduleOptions: {},
  },

  {
    buildName: 'javascript:customizer',
    builder: 'GJavaScriptBuilder',
    src: [upath.join(srcRoot, 'scripts/js/**/*.js')],
    dest: upath.join(destRoot, 'js'),
    outfile: 'sample-script2.js',
    buildOptions: {
      enableLint: false,
      enableBabel: true
    },
    moduleOptions: {},
  },

  {
    buildName: 'javascript',
    dependencies: ['javascript:core', 'javascript:customizer']
  }
];
