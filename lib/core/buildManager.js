"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GBuildManager = void 0;
const upath = require("upath");
const __utils = require("../utils/utils");
const builder_1 = require("./builder");
const project_1 = require("./project");
const utils_1 = require("../utils/utils");
const builder_2 = require("./builder");
const rtb_1 = require("./rtb");
const npm_1 = require("../utils/npm");
//--- GBuildManager
class GBuildManager {
    constructor() {
        this._projects = [];
        process.argv.forEach(arg => {
            if (arg.startsWith('--npm-auto')) {
                let [optName, optValue] = arg.split('=');
                if (optName === '--npm-auto' || optName === '--npm--auto-install') {
                    // strip outer quotes
                    optValue = optValue.trim().replace(/^["'](.*)["']$/, '$1');
                    let pos = optValue.indexOf('-');
                    if (pos < 0)
                        pos = optValue.length;
                    let s1 = optValue.substring(0, pos).split(' ') || undefined;
                    let name = (s1.length > 0) ? s1[0] : undefined;
                    let installCommand = s1.length >= 2 ? s1.join(' ') : undefined;
                    let installOptions = optValue.substring(pos).trim() || undefined;
                    npm_1.npm.setPackageManager({ name, installCommand, installOptions, autoInstall: true });
                    return false;
                }
            }
        });
    }
    createProject(buildItems = {}, options) {
        let proj = new project_1.GProject(buildItems, options);
        this._projects.push(proj);
        return proj;
    }
    getBuildNames(selector) {
        let buildNames = [];
        this._projects.forEach(proj => {
            buildNames = buildNames.concat(proj.getBuildNames(selector));
        });
        return buildNames;
    }
    findProject(projectName) {
        for (let proj of this._projects)
            if (proj.projectName === projectName)
                return proj;
        return undefined;
    }
    setPackageManager(packageManager) {
        return npm_1.npm.setPackageManager(packageManager);
    }
    //--- utilities
    series(...args) { return builder_1.series(args); }
    parallel(...args) { return builder_1.parallel(args); }
    registerExtension(name, ext) { rtb_1.RTB.registerExtension(name, ext); }
    loadExtension(globModules) { rtb_1.RTB.loadExtension(globModules); }
    require(id) { return npm_1.requireSafe(id); }
    //--- properties
    get rtbs() { return GBuildManager.rtbs; }
    get builders() { return __builders; }
    get utils() { return __utils; }
}
exports.GBuildManager = GBuildManager;
//--- statics
GBuildManager.rtbs = [];
//-- custom builders
function __builders() { }
(function (__builders) {
    __builders.GBuilder = builder_2.GBuilder;
})(__builders || (__builders = {}));
utils_1.registerPropertiesFromFiles(__builders, upath.join(__dirname, '../builders/*.js'));
