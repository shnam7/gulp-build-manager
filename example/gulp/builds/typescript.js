/**
 * config for typescript builds
 *
 */

import gbmConfig from '../gbmconfig';
import upath from 'upath';

const srcRoot = gbmConfig.srcRoot;

export default module.exports = [
  {
    buildName: 'typescript',
    builder: 'GTypeScriptBuilder',
    src: [upath.join(srcRoot, 'scripts/ts/**/*.ts')],
    dest: (file)=>file.base,
    buildOptions: {
      enableLint: false,

      // You can specify tsconfig.json file here. To create a default one, run 'tsc -init'
      // tsConfig: upath.join(srcRoot, 'scripts/ts/tsconfig.json')
    },
    moduleOptions: {
      // this will override the tsConfig settings in buildOptions
      typescript: {
        "noImplicitAny": true,
        "target": "es5",
      }
    },
    watch: {livereload:true}
  },
];
