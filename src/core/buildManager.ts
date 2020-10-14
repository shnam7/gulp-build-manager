import * as upath from 'upath';
import * as __utils from '../utils/utils';
import { BuildSet, BuildSetSeries, BuildSetParallel, series, parallel, BuildItems, BuildNameSelector, BuildItem } from './builder';
import { GProject, ProjectOptions } from './project';
import { registerPropertiesFromFiles } from '../utils/utils';
import { GBuilder as GBuilderClass } from './builder';
import { RTB, RTBExtension } from './rtb';
import { npm, PackageManagerOptions } from '../utils/npm';


//--- GBuildManager
export class GBuildManager {
    protected _projects: GProject[] = [];

    constructor() {
        process.argv.forEach(arg => {
            if (arg.startsWith('--npm-auto')) {
                let [optName, optValue] = arg.split('=');
                if (optName === '--npm-auto' || optName === '--npm--auto-install') {
                    // strip outer quotes
                    optValue = optValue.trim().replace(/^["'](.*)["']$/, '$1');
                    let pos = optValue.indexOf('-');
                    if (pos < 0) pos = optValue.length;
                    let s1 = optValue.substring(0, pos).split(' ') || undefined;
                    let name = (s1.length>0) ? s1[0] : undefined;
                    let installCommand = s1.length >= 2 ? s1.join(' ') : undefined;
                    let installOptions = optValue.substring(pos).trim() || undefined;
                    npm.setPackageManager({name, installCommand, installOptions, autoInstall: true});
                    return false;
                }
            }}
        );
    }

    createProject(buildItems: BuildItem | BuildItems = {}, options?: ProjectOptions): GProject {
        let proj = new GProject(buildItems, options);
        this._projects.push(proj);
        return proj;
    }

    getBuildNames(selector: BuildNameSelector): string[] {
        let buildNames: string[] = [];
        this._projects.forEach(proj => {
            buildNames = buildNames.concat(proj.getBuildNames(selector));
        });
        return buildNames;
    }

    findProject(projectName: string): GProject | undefined {
        for (let proj of this._projects)
            if (proj.projectName === projectName) return proj;
        return undefined;
    }

    setPackageManager(packageManager: string | PackageManagerOptions) {
        return npm.setPackageManager(packageManager);
    }


    //--- utilities
    series(...args: BuildSet[]): BuildSetSeries { return series(args); }
    parallel(...args: BuildSet[]): BuildSetParallel { return parallel(args); }
    registerExtension(name: string, ext: RTBExtension): void { RTB.registerExtension(name, ext) }
    loadExtension(globModules: string | string[]) { RTB.loadExtension(globModules) }
    require(id: string) { return npm.requireSafe(id); }
    install(ids: string | string[]) { return npm.install(ids); }    // TODO: add to docs

    //--- properties
    get rtbs() { return GBuildManager.rtbs; }
    get builders() { return __builders; }
    get utils() { return __utils; }

    //--- statics
    static rtbs: RTB[] = [];
}


//-- custom builders
function __builders() {}
namespace __builders { export const GBuilder = GBuilderClass; }
registerPropertiesFromFiles(__builders, upath.join(__dirname, '../builders/*.js'))
