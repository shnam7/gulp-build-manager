import child_process = require('child_process');
import { Mutex } from "./mutex";
import { arrayify, notice, info, warn, is } from "./utils";

//--- init: workaround for git-sh-setup not found error
if (process.platform == 'win32')
    process.env.PATH += ';C:\\Program Files\\Git\\mingw64\\libexec\\git-core';

export type PackageManagerOptions = {
    name?: string;                  // package manager name (npm)
    installCommand?: string;        // package manager command for install (npm i)
    installOptions?: string;        // install options (--save-dev)
    autoInstall?: boolean;
};


//--- node package manager
export class NPM {
    protected _options: PackageManagerOptions = { name: "npm", installCommand:"npm i", installOptions: "--save-dev" };
    protected _packageFile: any = undefined;

    constructor() {}

    public lock(): Promise<unknown> {
        return (this._options.autoInstall ? NPM._mutex.lock() : Promise.resolve());
    }

    public unlock() {
        if (this._options.autoInstall) NPM._mutex.unlock();
    }

    public setPackageManager(packageManager: string | PackageManagerOptions) {
        if (is.String(packageManager)) packageManager = { name: packageManager };

        if (packageManager.name) {
            this._options.name = packageManager.name;
            switch (packageManager.name) {
                case "npm":
                    this._options.installCommand = packageManager.installOptions ?? "npm i";
                    this._options.installOptions = packageManager.installOptions ?? "--save-dev";
                    break;
                case "pnpm":
                    this._options.installCommand = packageManager.installCommand ?? "pnpm add";
                    this._options.installOptions = packageManager.installOptions ?? "--save-dev";
                    break;
                case "yarn":
                    this._options.installCommand = packageManager.installCommand ?? "yarn add";
                    this._options.installOptions = packageManager.installOptions ?? "--dev";
                    break;
                default: {
                    this._options.installCommand = packageManager.installCommand ?? "";
                    this._options.installOptions = packageManager.installOptions ?? "";
                    break;
                }
            }
            if (packageManager.autoInstall !== undefined) this._options.autoInstall = packageManager.autoInstall;
        }
        else {
            if (packageManager.installCommand !== undefined) this._options.installCommand = packageManager.installCommand;
            if (packageManager.installOptions != undefined) this._options.installOptions = packageManager.installOptions;
            if (packageManager.autoInstall != undefined) this._options.autoInstall = packageManager.autoInstall;
        }

        if (this._options.autoInstall && !this._packageFile) this._reloadPackegeFile();
    }

    public install(ids: string | string[]) {
        if (!this._options.autoInstall) return;

        // get uninstalled list only
        ids = arrayify(ids).filter(id => !this.isInstalled(id));
        if (ids.length > 0) {
            let installList = ids.join(' ');
            let cmd = this._options.installCommand as string;
            if (this._options.installOptions) cmd += " " + this._options.installOptions;
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
            this._reloadPackegeFile();
        }
    }

    // public isEnabled() { return this._enable; }
    public isInstalled(id: string): boolean {
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
            const upath = require('upath');
            id = upath.basename(id);
        }
        else if (id.startsWith('@')) {  // scope handling
            // strip version tag. should not strip leading scope mark '@'
            let idx = id.lastIndexOf('@');
            if (idx > 0) id = id.substring(0, idx);     // ex) sax@0.0.1, @types/gulp@latest
        }
        else {  // normal name or github repo
            const upath = require('upath');
            if (id.indexOf(upath.sep) > 0) {
                id = upath.basename(id); // ex) shnam7/gulp-build-manager
                let idx = id.lastIndexOf('#');
                if (idx > 0) id = id.substring(0, idx);
            }
        }
        id = id.trim();
        if (id.length <= 0) return false;
        return this._packageFile?.dependencies[id] || this._packageFile?.devDependencies[id];
    }

    protected _reloadPackegeFile() {
        const fs = require("fs");
        this._packageFile = JSON.parse(fs.readFileSync(process.cwd() + '/package.json', 'utf-8'));
    }

    protected static _mutex = new Mutex(1000);
};

export const npm = new NPM();



//--- deprecated
export type NpmOptions = {
    autoInstall?: boolean,
    installOptions?: string;
};

export function setNpmOptions(opts: NpmOptions): void {
    warn("[GBM:npm] setNpmOption() is deprecarted. Use gbm.npm.setpackageManager() instead.");
    warn("[GBM:npm] Use gbm.npm.enable() to activate npm auto install.");
    if (opts.installOptions) npm.setPackageManager(opts);
}

// deprecated
export function npmInstall(ids: string | string[], options: NpmOptions = {}) {
    notice("[GBM:npm] npmInstall() is deprecarted. Use gbm.npm.install() instead.");
    notice("[GBM:npm] Use gbm.npm.enable() to activate npm auto install.");
    setNpmOptions(options);
    npm.install(ids);
}

export function requireSafe(id: string): any {
    npm.install(id);
    return require(id);
}
