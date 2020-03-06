import * as upath from 'upath';
import { BuildSet, BuildConfig } from './builder';
import { GBuildProject, BuildGroup, ProjectOptions } from './buildProject';
import { CleanerOptions } from './cleaner';
import { registerPropertiesFromFiles, is } from '../utils/utils';
import { GBuilder as GBuilderClass } from './builder';
import { GPlugin as GPluginClass } from './plugin';
import * as __utils from '../utils/utils';


//-- custom builders and plugins
function __builders() {}
function __plugins() {}
namespace __builders { export const GBuilder = GBuilderClass; }
namespace __plugins { export const GPlugin = GPluginClass; }
registerPropertiesFromFiles(__builders, upath.join(__dirname, '../builders/*.js'))
registerPropertiesFromFiles(__plugins, upath.join(__dirname, '../plugins/*.js'));


//--- GBuildManager
export class GBuildManager {
    protected projects: GBuildProject[] = [];
    protected managerProject: GBuildProject = new GBuildProject();

    constructor() {}

    get size() {
        let size = 0;
        this.projects.forEach(proj => { size += proj.size })
        return size;
    }

    get buildNames() {
        let buildNames: string[] = [];
        this.projects.forEach(proj => { buildNames = buildNames.concat(proj.buildNames) })
        return buildNames;
    }

    createProject(buildGroup: BuildGroup, opts?: ProjectOptions) : GBuildProject {
        let project = new GBuildProject(buildGroup, opts);
        this.projects.push(project);
        return project;
    }

    resolve(): void {
        this.projects.forEach(proj => proj.resolve());
        this.managerProject.resolve();
    }

    addBuildItem(conf: BuildConfig) {
        this.managerProject.addBuildItem(conf);
        return this;
    }

    addTrigger(buildName: string, selector: string | string[] | RegExp | RegExp[]) {
        let triggers = this.filter(selector)

        if (triggers.length > 0) this.managerProject.addBuildItem({
            buildName: buildName,
            triggers: triggers
        });
        return this;
    }

    filter(selector: string | string[] | RegExp | RegExp[]): string[] {
        let buildNames: string[] = [];
        this.projects.forEach(proj => {
            buildNames = buildNames.concat(proj.filter(selector));
        });
        return buildNames.concat(this.managerProject.filter(selector));;
    }

    addCleaner(buildName: string, opts?: CleanerOptions, selector: string | string[] | RegExp | RegExp[] = /@clean$/): this {
        // return this.addTrigger(buildName, '/@clean$/')
        // let cleanBuilds = this.projectList.map(proj => proj.cleaner.buildName)
        let cleanBuilds = this.filter(selector)
        this.managerProject.addBuildItem({
            buildName: buildName,
            triggers: GBuildProject.parallel(...cleanBuilds),
        });
        return this;
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
}
