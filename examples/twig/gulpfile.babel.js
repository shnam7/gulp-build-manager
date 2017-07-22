// Sample

import gbm from '../../src';
import upath from 'upath';
import twigMarkdown from 'twig-markdown';

process.chdir(__dirname);

let srcRoot = 'assets';
let destRoot = '_build';

let twig = {
  buildName: 'twig',
  builder: 'GTwigBuilder',

  src: [upath.join(srcRoot, 'twig/*.twig')],
  dest: upath.join(destRoot, ''),
  buildOptions: {
    minify: true,
    prettify: true
  },
  moduleOptions: {
    twig: {
      base: upath.join(srcRoot, 'twig'),
      data: {
        site: {
          name: 'Gulp Build Manager Sample - Twig',
          charset: 'UTF-8',
          url:'.'
        }
      },
      extend: twigMarkdown,
      functions:[
        {
          name: "nameOfFunction",
          func: function (args) {
            return "the function";
          }
        }
      ],
      filters:[
        {
          name: "nameOfFilter",
          func: function (args) {
            return "the filter";
          }
        }
      ]
    },
    htmlPrettify: {indent_char: ' ', indent_size: 2},
    htmlmin: {
      collapseWhitespace: true,
    }
  },
  watch: {
    // include sub directories to detect changes of the file which are not in src list.
    watched: [upath.join(srcRoot, 'twig/**/*.{twig,md}')],
    livereload:true
  }
};


// create gbmConfig object
gbm({
  builds: [
    twig
  ],

  systemBuilds: {
    clean: [destRoot],
    default: 'twig',
    watch: {livereload:{start:true}}
  }
});
