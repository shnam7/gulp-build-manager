/**
 * config for coffeescript builds
 *
 */

import gbmConfig from '../gbmConfig';
import upath from 'upath';

const srcRoot = gbmConfig.srcRoot;

export default module.exports = [
  {
    buildName: 'coffeescript',
    builder: 'GCoffeeScriptBuilder',
    src: [upath.join(srcRoot, 'scripts/coffee/**/*.coffee')],
    dest: (file) => file.base,

    // To enable lint, uncomment below block
    // buildOptions: {
    //   enableLint: true
    // }

    // watcher is enabled by default. To disable it, set watched property to empty or null
    watch: {
      //   watched: [],  // this will disable watch
      livereload: true
    }
  }
];
