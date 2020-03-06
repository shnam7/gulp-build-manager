/**
 *  GCleaner - Gulp task clean list manager
 */

import { msg, arrayify } from "../utils/utils";
import gulp = require("gulp");
import del = require("del");
import { BuildConfig } from "./builder";

export interface CleanerOptions extends del.Options {
    clean?: string | string[];
};

export class GCleaner {
    // protected _buildName: string = "";
    protected cleanList: string[] = [];
    protected options: CleanerOptions = {};

    add(cleanTarget: string | string[]) {
        cleanTarget = arrayify(cleanTarget);
        if (cleanTarget.length > 0) this.cleanList = this.cleanList.concat(cleanTarget);
    }

    clean(callback?: (value: string[]) => void) {
        msg('GCleaner::cleanList:', this.cleanList);
        del(this.cleanList, this.options).then(callback);
    }

    reset() { this.cleanList = []; }

    createTask(buildName = '@clean', opts?: CleanerOptions): BuildConfig {
        // this._buildName = buildName;
        Object.assign(this.options, opts);
        if (this.options.clean) this.add(this.options.clean);

        return {
            buildName: buildName,
            builder: () => this.clean()
        }
        // gulp.task(buildName, (done) => this.clean(() => done()));
    }

    // get buildName() { return this._buildName; }
}
