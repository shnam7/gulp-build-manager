/**
 * config for javascript builds
 *
 */

import gbmConfig from '../gbmconfig';
import path from 'path';

const srcRoot = gbmConfig.srcRoot;
const destRoot = gbmConfig.destRoot;

export default module.exports = [
  {
    buildName: 'javascript:core',
    builder: 'GJavaScriptBuilder',
    src: [
      path.join(srcRoot, 'scripts/{coffee,ts}/{*,js/*}.js'),
      '!' + path.join(srcRoot, 'scripts/js/*.js'),
    ],
    dest: path.join(destRoot, 'js'),
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
    src: [path.join(srcRoot, 'scripts/js/**/*.js')],
    dest: path.join(destRoot, 'js'),
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
