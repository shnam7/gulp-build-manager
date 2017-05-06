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
      enableLint: false,

      // You can specify tsconfig.json file here. To create a default one, run 'tsc -init'
      tsConfig: upath.join(srcRoot, 'scripts/ts/tsconfig.json')
    },
    moduleOptions: {
      // this will override the tsConfig settings in buildOptions
      typescript: {
        "target": "es5",
        "module": "none",
        "noImplicitAny": true,
        "noEmitOnError": true
      }
    },
    watch: {livereload:true}
  },
];
