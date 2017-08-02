/**
 *  gbm - Gulp Build Manager
 */

import GBuildManager from './core/GBuildManager';
import GBuildSet from './core/GBuildSet';
import glob from 'glob';
import upath from 'upath';

export default function gbm(config) {
  if (config) GBuildManager.loadBuilders(config);
}
exports = module.exports = gbm;

gbm.loadBuilders = function(config) { GBuildManager.loadBuilders(config); }
gbm.parallel = function(...args) { return new GBuildSet(...args); };
gbm.series = function(...args) { return [...args]; };

function registerModules(exports, path) {
  let files = [];
  glob.sync(upath.join(__dirname, path, '*.js')).forEach(file=>{
    files.push(upath.basename(file, '.js'));
  });

  files.forEach(function(name) {
    Object.defineProperty(exports, name, {
      configurable: false,
      enumerable: true,
      get: function() {
        return require(path + "/" + name);
      }
    });
  });
}

registerModules(exports, "./builders");
registerModules(exports, "./plugins");
// registerModules(exports.builders={}, "./builders");
// registerModules(exports.plugins={}, "./plugins");
