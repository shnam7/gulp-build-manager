/**
 * config for javascript builds
 *
 */

import gbmConfig from '../gbmconfig';
import path from 'path';

const destRoot = gbmConfig.destRoot;

export default module.exports = [
  {
    buildName: 'javascript:core',
    builder: 'GJavaScriptBuilder',
    src: [
      'assets/scripts/coffee/{*,js/*}.js',
      'assets/scripts/ts/{*,js/*}.js',
      '!assets/scripts/js/*.js'
    ],
    dest: path.join(destRoot, 'js'),
    outfile: 'sample-script1.js',
    buildOptions: {
      enableLint: false,
      enableBabel: true
    },
    moduleOptions: {},

    addWatch: [],
    disableWatch: false
  },

  {
    buildName: 'javascript:customizer',
    builder: 'GJavaScriptBuilder',
    src: ['assets/scripts/js/**/*.js'],
    dest: path.join(destRoot, 'js'),
    outfile: 'sample-script2.js',
    buildOptions: {
      enableLint: false,
      enableBabel: true
    },
    moduleOptions: {},

    taskDeps: null, // ['javascript:core']
  },

  {
    buildName: 'javascript',
    dependencies: ['javascript:core', 'javascript:customizer']
  }
];
