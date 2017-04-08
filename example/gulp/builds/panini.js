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
    buildName: 'panini',
    builder: 'GPaniniBuilder',

    src: [path.join(srcRoot, 'docs/panini/pages/**/*')],
    dest: path.join(destRoot, 'docs/panini'),
    buildOptions: {},
    moduleOptions: {
      panini: {
        root: path.join(srcRoot, 'docs/panini/pages/'),
        layouts: path.join(srcRoot, 'docs/panini/layouts/'),
        partials: path.join(srcRoot, 'docs/panini/partials/'),
        data: path.join(srcRoot, 'docs/panini/data/'),
        helpers: path.join(srcRoot, 'docs/panini/helpers/')
      }
    }
  },
];
