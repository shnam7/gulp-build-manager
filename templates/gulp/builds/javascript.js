/**
 * config for javascript builds
 *
 */

import gbmConfig from '../gbmConfig';
import upath from 'upath';

const srcRoot = gbmConfig.srcRoot;
const destRoot = gbmConfig.destRoot;

export default module.exports = [
  {
    buildName: 'javascript',
    builder: 'GJavaScriptBuilder',
    src: [upath.join(srcRoot, 'scripts/{coffee,js,ts}/**/*.js')],
    dest: upath.join(destRoot, 'js'),
    order:['js/**/*.js', 'ts/**.*'],
    outfile: 'sample-script1.js',
    buildOptions: {
      enableLint: false,
      enableBabel: true
    },
    moduleOptions: {},
    watch: {livereload:true}
  }
];
