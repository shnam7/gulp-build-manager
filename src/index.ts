/**
 *  gbm - Gulp Build Manager
 */

import * as upath from "upath";
import { registerPropertiesFromFiles } from "./utils/utils";
import { GBuildManager } from "./core/buildManager";
import { GBuilder as GBuilderClass, BuildConfig } from "./core/builder";
import { GPlugin as GPluginClass } from "./core/plugin";

let bm = new GBuildManager();

function gbm(config: BuildConfig) {
    if (config) bm.loadBuilders(config);
}

namespace gbm {
    export function loadBuilders(config: BuildConfig) { bm.loadBuilders(config); }

    export let watcher = bm.watcher;
    export let cleaner = bm.cleaner;

    export let parallel = GBuildManager.parallel;
    export let series = GBuildManager.series;

    export let GBuilder = GBuilderClass;
    export let GPlugin = GPluginClass;
    export let utils = require('./utils/utils');
}

registerPropertiesFromFiles(gbm, upath.join(__dirname, './plugins/*.js'));
registerPropertiesFromFiles(gbm, upath.join(__dirname, './builders/*.js'));
// registerPropertiesFromFiles(exports.builders={}, upath.join(__dirname, './plugins/*.js'));
// registerPropertiesFromFiles(exports.plugins={}, upath.join(__dirname, './builders/*.js'));

module.exports = gbm;
