import { BuildConfig, BuildName, GBuilder, BuildSet, TaskDoneFunction, BuildSetParallel } from "./builder";
import { RTB } from "./rtb";
import { GWatcher } from "./watcher";
import { GReloader } from "./reloader";
import { GulpTaskFunction, gulp } from "./common";
import { is, arrayify, info } from "../utils/utils";
import { GCleaner } from "./cleaner";
import { GBuildManager } from "./buildManager";

export type ResolvedType = BuildName | GulpTaskFunction;
export type ProjectOptions = {
    prefix?: string;
    customBuilderDirs?: string | string[];
};

type BuildGroup = { [key: string]: BuildConfig; }

export class GProject {
    protected set: BuildGroup = {};
    protected resolved: ResolvedType[] = [];
    options: ProjectOptions = {};
    customBuilderDirs: string[] = [];
    watcher: GWatcher = new GWatcher();
    reloader: GReloader = new GReloader;

    constructor(set: BuildGroup = {}, options: ProjectOptions = {}) {
        this.set = set;
        this.options = options;
        if (options.customBuilderDirs) this.customBuilderDirs = arrayify(options.customBuilderDirs);
    }

    get buildList() : BuildConfig[] {
        return Object.values(this.set).map(conf => conf);
    }

    get watch() {
        return {
            buildName: this.options.prefix + 'clean',
            builder: () => {


            }
        }
    }

    get clean() {
        return {
            buildName: this.options.prefix + 'clean',
            builder: (rtb: RTB) => {
                let cleanList: string[] = [];
                Object.values(this.set).forEach(conf => {
                    if (conf.clean) cleanList.concat(conf.clean)
                });
                if (cleanList.length > 0) rtb.del(cleanList)
            }
        };
    }

    resolve() {
        Object.values(this.set).forEach((conf: BuildConfig) => {
            let resolved = GBuildManager.resolve(conf);
            if (resolved) this.resolved.push(resolved);
        });
    }
}
