import * as upath from 'upath';
import * as __utils from '../utils/utils';
import { BuildSet, BuildSetSeries, BuildSetParallel, series, parallel, BuildItems, BuildNameSelector, BuildItem } from './builder';
import { GProject, ProjectOptions } from './project';
import { Options, registerPropertiesFromFiles } from '../utils/utils';
import { GBuilder as GBuilderClass } from './builder';
import { RTB, RTBExtension } from './rtb';
import { npm, requireSafe, PackageManagerOptions } from '../utils/npm';


//--- GBuildManager
export class GBuildManager {
    protected _projects: GProject[] = [];
    protected _config: Options = {}

    constructor() {
        process.argv.forEach(arg => {
            if (arg.startsWith('--npm-auto')) {
                let [optName, optValue] = arg.split('=');
                if (optName === '--npm-auto' || optName === '--npm--auto-install') {
                    // strip outer quotes
                    optValue = optValue.trim().replace(/^["'](.*)["']$/, '$1');
                    let pos = optValue.indexOf('-');
                    let installCommand = optValue.substring(0, pos).trim() || undefined;
                    let installOptions = optValue.substring(pos).trim() || undefined;
                    npm.setPackageManager({installCommand, installOptions, autoInstall: true});
                    return false;
                }
            }}
        );
    }

    createProject(buildItems: BuildItem | BuildItems = {}, opts?: ProjectOptions): GProject {
        let proj = new GProject(buildItems, opts);
        this._projects.push(proj);
        return proj;
    }

    addProject(project: BuildItem | BuildItems | GProject | string): this {
        if (__utils.is.String(project)) project = require(upath.resolve(project));
        if (project instanceof GProject)
            this._projects.push(project);
        else if (__utils.is.Object(project))
            this._projects.push(new GProject(project));
        else
            throw Error('GBuildManager:addProject: Invalid project argument');
        return this;
    }

    addProjects(items: GProject | GProject[]): this {
        __utils.arrayify(items).forEach(proj => this.addProject(proj));
        return this;
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

    public setPackageManager(packageManager: string | PackageManagerOptions) {
        return this.npm.setPackageManager(packageManager);
    }


    //--- utilities
    series(...args: BuildSet[]): BuildSetSeries { return series(args); }
    parallel(...args: BuildSet[]): BuildSetParallel { return parallel(args); }
    registerExtension(name: string, ext: RTBExtension): void { RTB.registerExtension(name, ext) }
    require(id: string) { return requireSafe(id); }

    //--- properties
    get conf() { return this._config; }
    get rtbs() { return GBuildManager.rtbs; }
    get npm() { return npm; }
    get builders() { return __builders; }
    get utils() { return __utils; }
    get defaultModuleOptions() { return GBuildManager.defaultModuleOptions; }

    //--- statics
    static rtbs: RTB[] = [];
    static defaultModuleOptions: Options = {
        sass: {
            outputStyle: 'compact', // 'compressed',
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
    }
}


//-- custom builders
function __builders() {}
namespace __builders { export const GBuilder = GBuilderClass; }
registerPropertiesFromFiles(__builders, upath.join(__dirname, '../builders/*.js'))
