/**
 *  gbm - Gulp Build Manager
 */

import * as upath from 'upath';
import {registerPropertiesFromFiles} from "./core/utils";
import {GBuildManager} from "./core/buildManager";
import {GBuildSet} from "./core/buildSet";
import {BuildConfig, BuildSet, Options} from "./core/types";
import {GBuilder as GBuilderClass} from "./core/builder";
import {GPlugin as GPluginClass} from "./core/plugin";

let bm = new GBuildManager();

function gbm(config: BuildConfig) {
  if (config) bm.loadBuilders(config);
}

namespace gbm {
  export function loadBuilders(config:BuildConfig) { bm.loadBuilders(config); }
  export function parallel(...args: BuildSet[]) { return new GBuildSet(...args); };
  export function series(...args:BuildSet[]) { return [...args]; };
  export let GBuilder = GBuilderClass;
  export let GPlugin = GPluginClass;
}

registerPropertiesFromFiles(gbm, upath.join(__dirname, './plugins/*.js'));
registerPropertiesFromFiles(gbm, upath.join(__dirname, './builders/*.js'));
// registerPropertiesFromFiles(exports.builders={}, upath.join(__dirname, './plugins/*.js'));
// registerPropertiesFromFiles(exports.plugins={}, upath.join(__dirname, './builders/*.js'));

module.exports = gbm;