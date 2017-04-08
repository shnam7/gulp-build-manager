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
    buildName: 'twig',
    builder: 'GTwigBuilder',

    src: [path.join(srcRoot, 'docs/twig/*.twig')],
    dest: path.join(destRoot, 'docs/twig-test'),
    buildOptions: {},
    moduleOptions: {
      twig: {
        base: path.join(srcRoot, 'docs/twig'),
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
    }
  },
];
