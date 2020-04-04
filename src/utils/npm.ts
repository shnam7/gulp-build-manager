import * as fs from "fs";
import child_process = require('child_process');
import { Mutex } from "./mutex";
import { arrayify, notice, info, warn } from "./utils";

//--- init: workaround for git-sh-setup not found error
if (process.platform == 'win32')
    process.env.PATH += ';C:\\Program Files\\Git\\mingw64\\libexec\\git-core';

//--- types
export type NpmOptions = {
    autoInstall?: boolean,
    installOptions?: string;
    noModuleLoading?: boolean;
};

//--- variables
const _mutex = new Mutex(1000);
const _npmInstalled: string[] = [];
const _npmOptions: NpmOptions = {
    autoInstall: false,
    installOptions: '--save-dev'
};


//--- functions
// let waitingCount = 0;
export function npmLock(): Promise<void> {
    // console.log('--- WaitiingCount=', ++waitingCount)
    // return (_npmOptions.autoInstall ? _mutex.lock() : Promise.resolve()).then(() => {
    //     console.log('--- WaitiingCount=', --waitingCount)
    // });
    return (_npmOptions.autoInstall ? _mutex.lock() : Promise.resolve());
}

export function npmUnlock(): void {
    // console.log('---npmUnlock')
    if (_npmOptions.autoInstall) _mutex.unlock();
}

export function setNpmOptions(opts: NpmOptions): NpmOptions {
    return Object.assign(_npmOptions, opts)
}

export function requireSafe(id: string): any {
    npmInstall(id);
    return require(id);
}

export function npmInstall(ids: string | string[], options: NpmOptions = {}) {
    const upath = require('upath');
    const opts = Object.assign({}, _npmOptions, options);

    // get uninstalled list only
    ids = arrayify(ids).filter(id => {
        if (_npmInstalled.indexOf(id) >= 0) return false; // already installed

        const isCustom = id.startsWith('/') || id.startsWith('./');
        if (isCustom) return false;

        // if github module, then take project name without branch name
        const isGit = !id.startsWith('@') && id.indexOf(upath.sep) > 0;
        if (isGit) {
            id = upath.basename(id);
            let pos = id.indexOf('#');
            if (pos > 0) id = id.substring(0, );
        }

        let moduleAvailable = false;
        module.paths.forEach((nodeModulesPath) => {
            const moduleFilePath = upath.join(nodeModulesPath, id);
            if (fs.existsSync(moduleFilePath)) {
                moduleAvailable = true;
                return false;
            }
        });
        return moduleAvailable == false;
    })

    if (opts.autoInstall && ids.length > 0) {
        const installList = ids.join(' ');
        const cmd = `npm i ${installList} ${opts.installOptions}`;
        try {
            notice(`GBM:npmInstall:installing '${installList}' with option='${opts.installOptions}'...`);
            child_process.execSync(cmd, { cwd: process.cwd() })
            ids.forEach(id => _npmInstalled.push(id));
            info(`GBM:npmInstall:'${installList}' install finished.`);
        }
        catch (e) {
            warn(`GBM:npmInstall:'${installList}' install failed.`);
            throw e;
        }
    }
}
