import * as upath from 'upath';
import { BuildSet, BuildConfig } from './builder';
import { GBuildProject, BuildGroup, ProjectOptions } from './buildProject';
import { CleanerOptions } from './cleaner';
import { registerPropertiesFromFiles, is } from '../utils/utils';
import { GBuilder as GBuilderClass } from './builder';
import { GPlugin as GPluginClass } from './plugin';
import * as __utils from '../utils/utils';
import { WatcherOptions } from './watcher';
import { Options } from './common';
import { RTB } from './rtb';


//-- custom builders and plugins
function __builders() {}
function __plugins() {}
namespace __builders { export const GBuilder = GBuilderClass; }
namespace __plugins { export const GPlugin = GPluginClass; }
registerPropertiesFromFiles(__builders, upath.join(__dirname, '../builders/*.js'))
registerPropertiesFromFiles(__plugins, upath.join(__dirname, '../plugins/*.js'));


//--- GBuildManager
export class GBuildManager {
    protected _projects: GBuildProject[] = [];
    protected _managerProject: GBuildProject = new GBuildProject();

    constructor() {}

    get size() {
        let size = 0;
        this._projects.forEach(proj => { size += proj.size })
        return size;
    }

    get buildNames() {
        let buildNames: string[] = [];
        this._projects.forEach(proj => { buildNames = buildNames.concat(proj.buildNames) })
        return buildNames;
    }

    createProject(buildGroup: BuildGroup, opts?: ProjectOptions) : GBuildProject {
        let project = new GBuildProject(buildGroup, opts);
        this._projects.push(project);
        return project;
    }

    resolve(): void {
        this._projects.forEach(proj => proj.resolve());
        this._managerProject.resolve();
    }

    addBuildItem(conf: BuildConfig) {
        this._managerProject.addBuildItem(conf);
        return this;
    }

    addTrigger(buildName: string, selector: string | string[] | RegExp | RegExp[]) {
        let triggers = this.filter(selector)

        if (triggers.length > 0) this._managerProject.addBuildItem({
            buildName: buildName,
            triggers: triggers
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

    addCleaner(buildName: string, opts?: CleanerOptions, selector: string | string[] | RegExp | RegExp[] = /@clean$/): this {
        let cleanBuilds = this.filter(selector)
        this._managerProject.addBuildItem({
            buildName: buildName,
            triggers: GBuildProject.parallel(...cleanBuilds),
        });
        return this;
    }

    addWatcher(buildName: string, opts:WatcherOptions) {
        // create reloaders in manager project
        let watcher = this._managerProject.watcher;
        let reloaders = watcher.reloaders.createReloaders(opts);
        this._projects.forEach(proj => proj.watcher.reloaders.addReloaders(reloaders));

        watcher.reloadOnChange(opts.reloadOnChange);

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

    //--- built-in collections
    get builders() { return __builders; }
    get plugins() { return __plugins; }


    //--- utilities
    get utils() { return __utils; }

    series(...args: BuildSet[]) { return GBuildProject.series(args); }
    parallel(...args: BuildSet[]) { return GBuildProject.series(args); }

    buildNamesOf(buildList: BuildGroup | BuildConfig[], prefix = ""): string[] {
        if (is.Array(buildList)) return buildList.map(conf => prefix + conf.buildName);
        return Object.values(buildList).map(conf => prefix + conf.buildName);
    }


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
        htmlPrettify: {
            indent_char: ' ',
            indent_size: 4
        },

        eslint: { "extends": "eslint:recommended", "rules": { "strict": 1 } },
    }

    // active RTB list
    static rtbMap: Map<string, RTB> = new Map();
}
