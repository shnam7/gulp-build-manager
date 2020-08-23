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
//-- custom builders
function __builders() { }
(function (__builders) {
    __builders.GBuilder = builder_2.GBuilder;
})(__builders || (__builders = {}));
utils_1.registerPropertiesFromFiles(__builders, upath.join(__dirname, '../builders/*.js'));
//--- GBuildManager
class GBuildManager {
    constructor() {
        this._projects = [];
        this._config = {};
        process.argv.forEach(arg => {
            if (arg.startsWith('--npm-auto')) {
                const [optName, optValue] = arg.split('=');
                if (optName === '--npm-auto' || optName === '--npm--auto-install') {
                    npm_1.npm.enable();
                    npm_1.npm.setPackageManager(optValue);
                    return false;
                }
            }
        });
        this.config({ moduleOptions: this.defaultModuleOptions }).config('gbm.config.js');
    }
    config(data = {}) {
        if (__utils.is.String(data)) {
            const fs = require('fs');
            const pathNname = upath.resolve(process.cwd(), data);
            data = fs.existsSync(pathNname) ? require(pathNname) : {};
        }
        this._config = Object.assign(data.reset === true ? {} : this._config, data);
        return this;
    }
    createProject(buildGroup = {}, opts) {
        return new project_1.GProject(buildGroup, opts);
    }
    addProject(project) {
        if (__utils.is.String(project))
            project = require(upath.resolve(project));
        if (project instanceof project_1.GProject)
            this._projects.push(project);
        else if (__utils.is.Object(project))
            this._projects.push(new project_1.GProject(project));
        else
            throw Error('GBuildManager:addProject: Invalid project argument');
        return this;
    }
    addProjects(items) {
        __utils.arrayify(items).forEach(proj => this.addProject(proj));
        return this;
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
    //--- utilities
    series(...args) { return builder_1.series(args); }
    parallel(...args) { return builder_1.parallel(args); }
    registerExtension(name, ext) { rtb_1.RTB.registerExtension(name, ext); }
    //--- properties
    get conf() { return this._config; }
    get rtbs() { return GBuildManager.rtbs; }
    get npm() { return npm_1.npm; }
    get builders() { return __builders; }
    get utils() { return __utils; }
    get defaultModuleOptions() { return GBuildManager.defaultModuleOptions; }
}
exports.GBuildManager = GBuildManager;
//--- statics
GBuildManager.rtbs = [];
GBuildManager.defaultModuleOptions = {
    sass: {
        outputStyle: 'compact',
        includePaths: []
    },
    // autoprefixer: {
    // browsers: ['last 2 versions', '> 5%']
    // browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
    // },
    cssnano: { discardUnused: false },
    imagemin: { progressive: true, optimizationLevel: 5 },
    cleanCss: {
        level: { 2: { mergeSemantically: true } },
    },
    prettier: { useTabs: false, tabWidth: 4 },
    eslint: { "extends": "eslint:recommended", "rules": { "strict": 1 } },
};
