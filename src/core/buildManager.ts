import * as upath from 'upath';
import * as __utils from '../utils/utils';
import { BuildSet, BuildSetSeries, BuildSetParallel, series, parallel, BuildConfig } from './builder';
import { GProject, BuildGroup, ProjectOptions, BuildNameSelector } from './project';
import { registerPropertiesFromFiles } from '../utils/utils';
import { GBuilder as GBuilderClass } from './builder';
import { Options } from './common';
import { RTB, RTBExtension } from './rtb';
import { setNpmOptions } from '../utils/npm';

//-- custom builders
function __builders() {}
namespace __builders { export const GBuilder = GBuilderClass; }
registerPropertiesFromFiles(__builders, upath.join(__dirname, '../builders/*.js'))


//--- GBuildManager
export class GBuildManager {
    protected _projects: GProject[] = []

    constructor() {
        process.argv.forEach(arg => {
            if (arg.startsWith('--npm-auto')) {
                const [cmd, installOptions] = arg.split('=');
                let autoInstall = cmd === '--npm-auto' || cmd === '--npm--auto-install';
                if (autoInstall) {
                    setNpmOptions(installOptions ? {autoInstall, installOptions} : {autoInstall});
                    return false;
                }
            }}
        );
    }

    createProject(buildGroup: BuildConfig | BuildGroup = {}, opts?: ProjectOptions): GProject {
        return new GProject(buildGroup, opts);
    }

    addProject(project: BuildGroup | GProject | string): this {
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


    //--- utilities
    series(...args: BuildSet[]): BuildSetSeries { return series(args); }
    parallel(...args: BuildSet[]): BuildSetParallel { return parallel(args); }
    registerExtension(name: string, ext: RTBExtension): void { RTB.registerExtension(name, ext) }

    //--- properties
    get rtbs() { return GBuildManager.rtbs; }
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
