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
    buildName: 'javascript',
    builder: 'GJavaScriptBuilder',
    src: [upath.join(srcRoot, 'scripts/{coffee,js}/**/*.js')],
    dest: upath.join(destRoot, 'js'),
    order:['coffee/**.*','js/**/*.js'],
    outFile: 'sample-script.js',
    buildOptions: {
      // enableLint: true,
      // enableBabel: true,
    },
    moduleOptions: {},
    watch: {livereload:true}
  },
];
