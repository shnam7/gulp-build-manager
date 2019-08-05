/**
 *  gbm - Gulp Build Manager
 */

import * as upath from "upath";
import { registerPropertiesFromFiles } from "./utils/utils";
import { GBuildManager } from "./core/buildManager";
import { GBuildSet, BuildConfig, BuildSet } from "./core/buildSet";
import { GBuilder as GBuilderClass } from "./core/builder";
import { GPlugin as GPluginClass } from "./core/plugin";

let bm = new GBuildManager();

function gbm(config: BuildConfig) {
    if (config) bm.loadBuilders(config);
}

namespace gbm {
    export function loadBuilders(config: BuildConfig) { bm.loadBuilders(config); }
    export function parallel(...args: BuildSet[]) { return new GBuildSet(...args); }
    export function series(...args: BuildSet[]) { return [...args]; }

    export let watcher = bm.watcher;
    export let cleaner = bm.cleaner;

    export let GBuilder = GBuilderClass;
    export let GPlugin = GPluginClass;
    export let utils = require('./utils/utils');
}

registerPropertiesFromFiles(gbm, upath.join(__dirname, './plugins/*.js'));
registerPropertiesFromFiles(gbm, upath.join(__dirname, './builders/*.js'));
// registerPropertiesFromFiles(exports.builders={}, upath.join(__dirname, './plugins/*.js'));
// registerPropertiesFromFiles(exports.plugins={}, upath.join(__dirname, './builders/*.js'));

module.exports = gbm;
