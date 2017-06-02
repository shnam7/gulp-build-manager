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
    buildName: 'twig',
    builder: 'GTwigBuilder',

    src: [upath.join(srcRoot, 'docs/twig/*.twig')],
    dest: upath.join(destRoot, 'docs/twig-test'),
    buildOptions: {},
    moduleOptions: {
      twig: {
        base: upath.join(srcRoot, 'docs/twig'),
        data: {
          site: {
            name: 'Gulp Build Manager Test',
            charset: 'UTF-8',
            url:'.'
          }
        },
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
      }
    },
    watch: {
      // include sub directories to detect changes of the file which are not in src list.
      watched: [upath.join(srcRoot, 'docs/twig/**/*.{twig,md}')],
      livereload:true
    }
  },
];
