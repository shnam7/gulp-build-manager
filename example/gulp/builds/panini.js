/**
 * config for markdown builds
 *
 */

import gbmConfig from '../gbmconfig';
import upath from 'upath';

const srcRoot = gbmConfig.srcRoot;
const destRoot = gbmConfig.destRoot;

export default module.exports = [
  {
    buildName: 'panini',
    builder: 'GPaniniBuilder',

    // panini does not handle backslashes correctly, so replace them to slash
    src: [upath.join(srcRoot, 'docs/panini/pages/**/*').replace(/\\/g, '/')],
    dest: upath.join(destRoot, 'docs/panini'),
    buildOptions: {},
    moduleOptions: {
      panini: {
        root: upath.join(srcRoot, 'docs/panini/pages/'),
        layouts: upath.join(srcRoot, 'docs/panini/layouts/'),
        partials: upath.join(srcRoot, 'docs/panini/partials/'),
        data: upath.join(srcRoot, 'docs/panini/data/'),
        helpers: upath.join(srcRoot, 'docs/panini/helpers/')
      }
    }
  },
];
