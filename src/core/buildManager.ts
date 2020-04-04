import * as upath from 'upath';
import { BuildSet, BuildConfig, BuildSetSeries, BuildSetParallel, BuildName } from './builder';
import { GBuildProject, BuildGroup, ProjectOptions } from './buildProject';
import { CleanerOptions } from './cleaner';
import { registerPropertiesFromFiles, is } from '../utils/utils';
import { GBuilder as GBuilderClass } from './builder';
import * as __utils from '../utils/utils';
import { WatcherOptions } from './watcher';
import { Options } from './common';
import { RTB } from './rtb';
import { setNpmOptions } from '../utils/npm';


//-- custom builders
function __builders() {}
namespace __builders { export const GBuilder = GBuilderClass; }
registerPropertiesFromFiles(__builders, upath.join(__dirname, '../builders/*.js'))


//--- GBuildManager
export class GBuildManager {
    protected _projects: GBuildProject[] = [];
    protected _managerProject: GBuildProject = new GBuildProject();

    constructor() {
        process.argv.forEach(arg => {
            if (arg.startsWith('--npmAutoInstall')) {
                let autoInstall = true;
                let installOptions: string | undefined = arg.replace(/['"]+/g, '');
                let idx = installOptions.indexOf('=');
                installOptions = (idx > 0) ? installOptions.substr(idx+1).trim() : undefined;

                let opts = installOptions ? {autoInstall, installOptions} : {autoInstall};
                setNpmOptions(opts);
                return false;
            }}
        );
    }

    createProject(buildGroup: BuildGroup = {}, opts?: ProjectOptions): GBuildProject {
        return new GBuildProject(buildGroup, opts);
    }

    addProject(project: GBuildProject | string): this {
        if (is.String(project)) project = require(upath.resolve(project));
        if (project instanceof GBuildProject)
            this._projects.push(project as GBuildProject);
        else
            throw Error('GBuildManager:addProject: Invalid project argument');
        return this;
    }

    addBuildItem(conf: BuildConfig): this {
        this._managerProject.addBuildItem(conf);
        return this;
    }

    addTrigger(buildName: string, selector: string | string[] | RegExp | RegExp[], series: boolean = false): this {
        let buildNames = this.filter(selector);
        let triggers = (buildNames.length === 1)
            ? buildNames[0]
            : series ? buildNames : GBuildProject.parallel(...buildNames);

        this.addBuildItem({ buildName, triggers });
        return this;
    }

    addWatcher(buildName: string, opts:WatcherOptions) {
        // create reloaders in manager project
        let watcher = this._managerProject.watcher;
        let reloaders = watcher.reloaders.createReloaders(opts);
        this._projects.forEach(proj => proj.watcher.reloaders.addReloaders(reloaders));

        reloaders.reloadOnChange(opts.reloadOnChange);

        // create watch build item
        return this.addBuildItem({
            buildName: buildName,
            builder: () => {
                // start watch for all the project, but depress reloader activation
                this._projects.forEach(proj => proj.watcher.watch(false))

                // activate reloaders in manager project
                reloaders.activate();
            }
        });
    }

    addCleaner(buildName: string, opts?: CleanerOptions, selector: string | string[] | RegExp | RegExp[] = /@clean$/): this {
        let cleanBuilds = this.filter(selector)
        this._managerProject.addBuildItem({
            buildName: buildName,
            triggers: GBuildProject.parallel(...cleanBuilds),
        });
        return this;
    }

    filter(selector: string | string[] | RegExp | RegExp[]): string[] {
        let buildNames: string[] = [];
        this._projects.forEach(proj => {
            buildNames = buildNames.concat(proj.filter(selector));
        });
        return buildNames.concat(this._managerProject.filter(selector));;
    }

    resolve(): void {
        this._projects.forEach(proj => proj.resolve());
        this._managerProject.resolve();
    }

    series(...args: BuildSet[]): BuildSetSeries { return GBuildProject.series(args); }

    parallel(...args: BuildSet[]): BuildSetParallel { return GBuildProject.parallel(args); }


    //--- properties
    get size(): number {
        let size = 0;
        this._projects.forEach(proj => { size += proj.size })
        return size + this._managerProject.size;
    }

    get buildNames(): BuildName[] {
        let buildNames: string[] = [];
        this._projects.forEach(proj => { buildNames = buildNames.concat(proj.buildNames) })

        return buildNames.concat(this._managerProject.buildNames);
    }

    get RTB() { return RTB; }
    get builders() { return __builders; }
    get utils() { return __utils; }
    get rtbMap() { return GBuildManager.rtbMap; }
    get defaultModuleOptions() { return GBuildManager.defaultModuleOptions; }


    //--- statics
    static defaultModuleOptions: Options = {
        sass: {
            outputStyle: 'compact',
            // outputStyle: 'compressed',
            includePaths: []
        },

        compass: {
            config_file: './config.rb',
            css: 'css',
            sass: 'assets/scss'
        },

        // autoprefixer: {
        // browsers: ['last 2 versions', '> 5%']
        // browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
        // },

        cssnano: { discardUnused: false },

        // babel: {presets:["env"]},

        imagemin: {
            progressive: true,
            optimizationLevel: 5
        },
        htmlBeautify: {
            indent_char: ' ',
            indent_size: 4
        },

        eslint: { "extends": "eslint:recommended", "rules": { "strict": 1 } },
    }

    // active RTB list
    static rtbMap: Map<string, RTB> = new Map();
}
