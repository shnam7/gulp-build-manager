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
    src: [upath.join(srcRoot, 'scripts/{coffee,ts,js}/**/*.js')],
    dest: upath.join(destRoot, 'js'),
    order:['js/**/*.js', 'ts/**.*'],
    outFile: 'sample-script.js',
    buildOptions: {
      enableLint: false,
      enableBabel: true,
    },
    moduleOptions: {},
    watch: {livereload:true}
  },
];
