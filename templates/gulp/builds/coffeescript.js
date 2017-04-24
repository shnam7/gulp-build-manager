/**
 * config for coffeescript builds
 *
 */

import gbmConfig from '../gbmconfig';
import upath from 'upath';

const srcRoot = gbmConfig.srcRoot;

export default module.exports = [
  {
    buildName: 'coffeescript',
    builder: 'GCoffeeScriptBuilder',
    // builder: 'GCustomTestBuilder',
    src: [upath.join(srcRoot, 'scripts/coffee/**/*.coffee')],
    dest: (file) => file.base,
    buildOptions: {enableLint: false},
    moduleOptions: {},

    // watcher is enabled by default. To disable it, set watched property to empty or null
    watch: {
      //   watched: [],  // this will disable watch
      livereload: true
    }
  }
];
