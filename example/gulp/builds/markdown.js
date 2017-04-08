/**
 * config for markdown builds
 *
 */

import gbmConfig from '../gbmconfig';
import path from 'path';

const srcRoot = gbmConfig.srcRoot;
const destRoot = gbmConfig.destRoot;

export default module.exports = [
  {
    buildName: 'markdown',
    builder: 'GMarkdownBuilder',
    src: [path.join(srcRoot, 'docs/panini/pages/**/*.md')],
    dest: path.join(destRoot, 'markdown-test'),
    buildOptions: {},
    moduleOptions: {}
  },
];
