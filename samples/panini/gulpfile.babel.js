'use strict';

import gbm from 'gulp-build-manager';
import upath from 'upath';

process.chdir(__dirname);

// Create build definition Item #1
const srcRoot = 'assets';
const destRoot = '_build';

let panini = {
  buildName: 'panini',
  builder: 'GPaniniBuilder',

  // panini does not handle backslashes correctly, so replace them to slash
  src: [upath.join(srcRoot, 'panini/pages/**/*')],
  dest: upath.join(destRoot, ''),
  moduleOptions: {
    panini: {
      root: upath.join(srcRoot, 'panini/pages/'),
      layouts: upath.join(srcRoot, 'panini/layouts/'),
      partials: upath.join(srcRoot, 'panini/partials/'),
      data: upath.join(srcRoot, 'panini/data/'),
      helpers: upath.join(srcRoot, 'panini/helpers/')
    }
  },
  watch: {
    // include sub directories to detect changes of the file which are not in src list.
    watched: [upath.join(srcRoot, 'panini/**/*')],
    livereload: true
  }
};

// create gbmConfig object
const gbmConfig = {
  builds: [
    panini,
  ],

  systemBuilds: {
    clean: [destRoot],
    default: 'panini',
    watch: {livereload:{start:true}}
  }
};

gbm.loadBuilders(gbmConfig);
