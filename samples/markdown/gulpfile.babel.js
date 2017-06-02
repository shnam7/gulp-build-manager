'use strict';

import gbm from 'gulp-build-manager';
import upath from 'upath';

process.chdir(__dirname);

let srcRoot = 'assets';
let destRoot = '_build';

let markdown = {
  buildName: 'markdown',
  builder: 'GMarkdownBuilder',
  src: [upath.join(srcRoot, '**/*.md')],
  dest: upath.join(destRoot, ''),
  buildOptions: {},
  moduleOptions: {},
  watch: {livereload:true}
};



// create gbmConfig object
const gbmConfig = {
  builds: [
    markdown
  ],

  systemBuilds: {
    clean: [destRoot],
    default: 'markdown',
    watch: {livereload:{start:true}}
  }
};

gbm.loadBuilders(gbmConfig);
