"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSafe = exports.npmInstall = exports.setNpmOptions = exports.npm = exports.NPM = void 0;
const child_process = require("child_process");
const mutex_1 = require("./mutex");
const utils_1 = require("./utils");
//--- init: workaround for git-sh-setup not found error
if (process.platform == 'win32')
    process.env.PATH += ';C:\\Program Files\\Git\\mingw64\\libexec\\git-core';
//--- node package manager
class NPM {
    constructor() {
        this._packageManager = { installCommand: "npm i", installOptions: "--save-dev" };
        this._enable = false;
    }
    enable() { this._enable = true; }
    disable() { this._enable = false; }
    lock() {
        return (this._enable ? NPM._mutex.lock() : Promise.resolve());
    }
    unlock() {
        if (this._enable)
            NPM._mutex.unlock();
    }
    setPackageManager(packageManager) {
        if (!packageManager)
            return;
        // strip outer quotes and white spaces
        packageManager = packageManager.trim().replace(/^["'](.*)["']$/, '$1').trim();
        if (packageManager.startsWith('-')) {
            this._packageManager.installOptions = packageManager;
            return;
        }
        switch (packageManager) {
            case "npm":
                this._packageManager.installCommand = "npm i";
                this._packageManager.installOptions = "--save-dev";
                break;
            case "pnpm":
                this._packageManager.installCommand = "pnpm add";
                this._packageManager.installOptions = "--save-dev";
                break;
            case "yarn":
                this._packageManager.installCommand = "yarn add";
                this._packageManager.installOptions = "--dev";
                break;
            default: {
                this._packageManager.installCommand = packageManager;
                this._packageManager.installOptions = "";
                break;
            }
        }
    }
    install(ids) {
        if (!this._enable)
            return;
        // get uninstalled list only
        ids = utils_1.arrayify(ids).filter(id => !this.isInstalled(id));
        if (ids.length > 0) {
            let installList = ids.join(' ');
            let cmd = this._packageManager.installCommand;
            if (this._packageManager.installOptions)
                cmd += " " + this.packageManager.installOptions;
            cmd += " " + installList;
            utils_1.notice(`GBM:NPM:install: ${cmd}`);
            this.lock();
            try {
                child_process.execSync(cmd, { cwd: process.cwd() });
            }
            catch (e) {
                utils_1.warn(`GBM:npmInstall:'${installList}' install failed.`);
                throw e;
            }
            this.unlock();
            utils_1.info(`GBM:npmInstall:'${installList}' install finished.`);
        }
    }
    isEnabled() { return this._enable; }
    isInstalled(id) {
        const fs = require("fs");
        const upath = require('upath');
        id = id.trim();
        if (id.startsWith('git:') || id.startsWith('git+')) { // handle git/protocol
            // strip branch name
            let idx = id.lastIndexOf('#');
            if (idx > 0)
                id = id.substring(0, idx); // ex) sax@0.0.1, sax@latest
            // strip training .git
            if (id.endsWith('.git'))
                id = id.substring(0, id.length - 4);
            // strip leading protocol name
            idx = id.indexOf(':');
            if (idx > 0)
                id = id.substring(idx + 1);
        }
        else if (id.startsWith('/') || id.startsWith('./') || id.startsWith('../')) { // local folder
            id = upath.basename(id);
        }
        else if (id.startsWith('@')) { // scope handling
            // strip version tag. should not strip leading scope mark '@'
            let idx = id.lastIndexOf('@');
            if (idx > 0)
                id = id.substring(0, idx); // ex) sax@0.0.1, @types/gulp@latest
        }
        else { // normal name or github repo
            if (id.indexOf(upath.sep) > 0) {
                id = upath.basename(id); // ex) shnam7/gulp-build-manager
                let idx = id.lastIndexOf('#');
                if (idx > 0)
                    id = id.substring(0, idx);
            }
        }
        id = id.trim();
        if (id.length <= 0)
            return false;
        // workaround to support using npm/pnpm link command
        const cpath = upath.join(upath.normalize(process.cwd()).toLowerCase(), "node_modules");
        const paths = module.paths.find(el => upath.normalize(el).toLowerCase() == cpath) ? module.paths : [cpath];
        // look for node_modules directories
        let isModuleAvailable = false;
        // const mpath = upath.normalize(module.path);
        // this.lock();
        paths.forEach((nodeModulesPath) => {
            // replace module path with cwd to have correct path when using npm/pnpm link command
            const moduleFilePath = upath.join(nodeModulesPath, id);
            if (fs.existsSync(moduleFilePath)) {
                isModuleAvailable = true;
                return false;
            }
        });
        // this.unlock();
        return isModuleAvailable;
    }
    get packageManager() { return this._packageManager; }
}
exports.NPM = NPM;
NPM._mutex = new mutex_1.Mutex(1000);
;
exports.npm = new NPM();
//--- deprecated
function setNpmOptions(opts) {
    utils_1.notice("[GBM]setNpmOption() is deprecarted. Use gbm.npm.setpackageManager() instead.");
    utils_1.notice("[GBM]Use gbm.npm.enable() to activate npm auto install.");
    if (opts.autoInstall)
        exports.npm.enable();
    if (opts.installOptions)
        exports.npm.setPackageManager(opts.installOptions);
}
exports.setNpmOptions = setNpmOptions;
// deprecated
function npmInstall(ids, options = {}) {
    utils_1.notice("[GBM]npmInstall() is deprecarted. Use gbm.npm.install() instead.");
    utils_1.notice("[GBM]Use gbm.npm.enable() to activate npm auto install.");
    setNpmOptions(options);
    exports.npm.install(ids);
}
exports.npmInstall = npmInstall;
function requireSafe(id) {
    exports.npm.install(id);
    return require(id);
}
exports.requireSafe = requireSafe;
