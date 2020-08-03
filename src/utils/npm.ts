import child_process = require('child_process');
import { Mutex } from "./mutex";
import { arrayify, notice, info, warn, is } from "./utils";

//--- init: workaround for git-sh-setup not found error
if (process.platform == 'win32')
    process.env.PATH += ';C:\\Program Files\\Git\\mingw64\\libexec\\git-core';

//--- types: deprecated in v4.1
export type NpmOptions = {
    autoInstall?: boolean,
    installOptions?: string;
};

type NodePackageManager = {
    installCommand?: string;
    installOptions?: string;
};


//--- node package manager
export class NPM {
    protected _packageManager: NodePackageManager = { installCommand: "npm i", installOptions: "--save-dev" };
    protected _enable = false;

    constructor() {}

    public enable() { this._enable = true; }
    public disable() { this._enable = false; }

    public lock(): Promise<unknown> {
        return (this._enable ? NPM._mutex.lock() : Promise.resolve());
    }

    public unlock() {
        if (this._enable) NPM._mutex.unlock();
    }

    public setPackageManager(packageManager: string) {
        if (!packageManager) return;

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

    public install(ids: string | string[]) {
        if (!this._enable) return;

        // get uninstalled list only
        ids = arrayify(ids).filter(id => !this.isInstalled(id));
        if (ids.length > 0) {
            let installList = ids.join(' ');
            let cmd = this._packageManager.installCommand as string;
            if (this._packageManager.installOptions) cmd += " " + this.packageManager.installOptions;
            cmd += " " + installList;

            notice(`GBM:NPM:install: ${cmd}`);
            this.lock();
            try {
                child_process.execSync(cmd, { cwd: process.cwd() })
            }
            catch (e) {
                warn(`GBM:npmInstall:'${installList}' install failed.`);
                throw e;
            }
            this.unlock();
            info(`GBM:npmInstall:'${installList}' install finished.`);
        }
    }

    public isEnabled() { return this._enable; }
    public isInstalled(id: string): boolean {
        const fs = require("fs");
        const upath = require('upath');

        id = id.trim();
        if (id.startsWith('git:') || id.startsWith('git+')) { // handle git/protocol
            // strip branch name
            let idx = id.lastIndexOf('#');
            if (idx > 0) id = id.substring(0, idx);     // ex) sax@0.0.1, sax@latest

            // strip training .git
            if (id.endsWith('.git')) id = id.substring(0, id.length-4);

            // strip leading protocol name
            idx = id.indexOf(':');
            if (idx > 0) id = id.substring(idx+1);
        }
        else if (id.startsWith('/') || id.startsWith('./') || id.startsWith('../')) {   // local folder
            id = upath.basename(id);
        }
        else if (id.startsWith('@')) {  // scope handling
            // strip version tag. should not strip leading scope mark '@'
            let idx = id.lastIndexOf('@');
            if (idx > 0) id = id.substring(0, idx);     // ex) sax@0.0.1, @types/gulp@latest
        }
        else {  // normal name or github repo
            if (id.indexOf(upath.sep) > 0) {
                id = upath.basename(id); // ex) shnam7/gulp-build-manager
                let idx = id.lastIndexOf('#');
                if (idx > 0) id = id.substring(0, idx);
            }
        }
        id = id.trim();
        if (id.length <= 0) return false;

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

    protected static _mutex = new Mutex(1000);
};

export const npm = new NPM();

//--- deprecated
export function setNpmOptions(opts: NpmOptions): void {
    notice("[GBM]setNpmOption() is deprecarted. Use gbm.npm.setpackageManager() instead.");
    notice("[GBM]Use gbm.npm.enable() to activate npm auto install.");
    if (opts.autoInstall) npm.enable();
    if (opts.installOptions) npm.setPackageManager(opts.installOptions);
}

// deprecated
export function npmInstall(ids: string | string[], options: NpmOptions = {}) {
    notice("[GBM]npmInstall() is deprecarted. Use gbm.npm.install() instead.");
    notice("[GBM]Use gbm.npm.enable() to activate npm auto install.");
    setNpmOptions(options);
    npm.install(ids);
}

export function requireSafe(id: string): any {
    npm.install(id);
    return require(id);
}
