'use strict';

import gbm from '../../src';
import upath from 'upath';

process.chdir(__dirname);

const srcRoot = 'assets';
const destRoot = '_build';

const markdown = {
  buildName: 'markdown',
  builder: 'GMarkdownBuilder',
  src: [upath.join(srcRoot, '**/*.md')],
  dest: upath.join(destRoot, ''),
  buildOptions: {},
  moduleOptions: {},
  watch: {livereload:true}
};

// create gbmConfig object
gbm({
  systemBuilds: {
    build: [markdown],
    clean: [destRoot],
    default: 'markdown',
    watch: {livereload:{start:true}}
  }
});
