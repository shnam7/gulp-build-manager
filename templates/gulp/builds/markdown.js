/**
 * config for markdown builds
 *
 */

import gbmConfig from '../gbmConfig';
import upath from 'upath';

const srcRoot = gbmConfig.srcRoot;
const destRoot = gbmConfig.destRoot;

export default module.exports = [
  {
    buildName: 'markdown',
    builder: 'GMarkdownBuilder',
    src: [upath.join(srcRoot, 'docs/panini/pages/**/*.md')],
    dest: upath.join(destRoot, 'markdown-test'),
    buildOptions: {},
    moduleOptions: {},
    watch: {livereload:true}
  },
];
