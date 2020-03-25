/**
 *  GCleaner - Gulp task clean list manager
 */

import { msg, arrayify } from "../utils/utils";
import del = require("del");
import { BuildConfig } from "./builder";

export interface CleanerOptions extends del.Options {
    clean?: string | string[];
    sync?: boolean;
}

export class GCleaner {
    // protected _buildName: string = "";
    protected cleanList: string[] = [];
    protected options: CleanerOptions = {};

    add(cleanTarget: string | string[]) {
        cleanTarget = arrayify(cleanTarget);
        if (cleanTarget.length > 0) this.cleanList = this.cleanList.concat(cleanTarget);
    }

    reset() { this.cleanList = []; }

    createTask(buildName = '@clean', opts?: CleanerOptions): BuildConfig {
        // this._buildName = buildName;
        Object.assign(this.options, opts);
        if (this.options.clean) this.add(this.options.clean);

        return {
            buildName: buildName,
            builder: rtb => {
                msg('GCleaner::cleanList:', this.cleanList);
                rtb.promise(del(this.cleanList, this.options), this.options.sync);
            },
        }
    }
}
