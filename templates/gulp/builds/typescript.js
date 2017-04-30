/**
 * config for typescript builds
 *
 */

import gbmConfig from '../gbmConfig';
import upath from 'upath';

const srcRoot = gbmConfig.srcRoot;

export default module.exports = [
  {
    buildName: 'typescript',
    builder: 'GTypeScriptBuilder',
    src: [upath.join(srcRoot, 'scripts/ts/**/*.ts')],
    dest: (file)=>file.base,
    buildOptions: {
      enableLint: false
    },
    moduleOptions: {},
    watch: {livereload:true}
  },
];
