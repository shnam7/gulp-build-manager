"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSafe = exports.npm = exports.NPM = void 0;
const child_process = require("child_process");
const mutex_1 = require("./mutex");
const utils_1 = require("./utils");
//--- init: workaround for git-sh-setup not found error
if (process.platform == 'win32')
    process.env.PATH += ';C:\\Program Files\\Git\\mingw64\\libexec\\git-core';
//--- node package manager
class NPM {
    constructor() {
        this._options = { name: "npm", installCommand: "npm i", installOptions: "--save-dev", autoInstall: true };
        this._packageFile = {};
    }
    lock() {
        return (this._options.autoInstall ? NPM._mutex.lock() : Promise.resolve());
    }
    unlock() {
        if (this._options.autoInstall)
            NPM._mutex.unlock();
    }
    setPackageManager(packageManager) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (utils_1.is.String(packageManager))
            packageManager = { name: packageManager };
        if (packageManager.name) {
            this._options.name = packageManager.name;
            switch (packageManager.name) {
                case "npm":
                    this._options.installCommand = (_a = packageManager.installOptions) !== null && _a !== void 0 ? _a : "npm i";
                    this._options.installOptions = (_b = packageManager.installOptions) !== null && _b !== void 0 ? _b : "--save-dev";
                    break;
                case "pnpm":
                    this._options.installCommand = (_c = packageManager.installCommand) !== null && _c !== void 0 ? _c : "pnpm add";
                    this._options.installOptions = (_d = packageManager.installOptions) !== null && _d !== void 0 ? _d : "--save-dev";
                    break;
                case "yarn":
                    this._options.installCommand = (_e = packageManager.installCommand) !== null && _e !== void 0 ? _e : "yarn add";
                    this._options.installOptions = (_f = packageManager.installOptions) !== null && _f !== void 0 ? _f : "--dev";
                    break;
                default: {
                    this._options.installCommand = (_g = packageManager.installCommand) !== null && _g !== void 0 ? _g : "";
                    this._options.installOptions = (_h = packageManager.installOptions) !== null && _h !== void 0 ? _h : "";
                    break;
                }
            }
            if (packageManager.autoInstall !== undefined)
                this._options.autoInstall = packageManager.autoInstall;
        }
        else {
            if (packageManager.installCommand !== undefined)
                this._options.installCommand = packageManager.installCommand;
            if (packageManager.installOptions != undefined)
                this._options.installOptions = packageManager.installOptions;
            if (packageManager.autoInstall != undefined)
                this._options.autoInstall = packageManager.autoInstall;
        }
        if (this._options.autoInstall)
            this._reloadPackegeFile();
    }
    install(ids) {
        // get uninstalled list only
        ids = utils_1.arrayify(ids).filter(id => !this.isInstalled(id));
        if (ids.length > 0) {
            let installList = ids.join(' ');
            let cmd = this._options.installCommand;
            if (this._options.installOptions)
                cmd += " " + this._options.installOptions;
            cmd += " " + installList;
            utils_1.notice(`NPM:install: ${cmd}`);
            this.lock();
            try {
                child_process.execSync(cmd, { cwd: process.cwd() });
            }
            catch (e) {
                utils_1.warn(`NPM:npmInstall: '${installList}' install failed.`);
                throw e;
            }
            this.unlock();
            utils_1.info(`NPM:npmInstall: '${installList}' install finished.`);
            this._reloadPackegeFile();
        }
    }
    requireSafe(id) {
        if (!this._options.autoInstall)
            return;
        this.install(id);
        return require(id);
    }
    // public isEnabled() { return this._enable; }
    isInstalled(id) {
        var _a, _b, _c, _d;
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
            const upath = require('upath');
            id = upath.basename(id);
        }
        else if (id.startsWith('@')) { // scope handling
            // strip version tag. should not strip leading scope mark '@'
            let idx = id.lastIndexOf('@');
            if (idx > 0)
                id = id.substring(0, idx); // ex) sax@0.0.1, @types/gulp@latest
        }
        else { // normal name or github repo
            const upath = require('upath');
            if (id.indexOf(upath.sep) > 0) {
                id = upath.basename(id); // ex) shnam7/lake
                let idx = id.lastIndexOf('#');
                if (idx > 0)
                    id = id.substring(0, idx);
            }
        }
        id = id.trim();
        if (id.length <= 0)
            return false;
        return ((_b = (_a = this._packageFile) === null || _a === void 0 ? void 0 : _a.dependencies) === null || _b === void 0 ? void 0 : _b[id]) || ((_d = (_c = this._packageFile) === null || _c === void 0 ? void 0 : _c.devDependencies) === null || _d === void 0 ? void 0 : _d[id]);
    }
    _reloadPackegeFile() {
        const fs = require("fs");
        this._packageFile = JSON.parse(fs.readFileSync(process.cwd() + '/package.json', 'utf-8'));
    }
}
exports.NPM = NPM;
NPM._mutex = new mutex_1.Mutex(1000);
;
exports.npm = new NPM();
function requireSafe(id) { return exports.npm.requireSafe(id); }
exports.requireSafe = requireSafe;
