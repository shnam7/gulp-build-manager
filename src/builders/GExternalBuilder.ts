/**
 *  External Builder
 */

import { GBuilder, ExternalBuilder } from "../core/builder";
import { SpawnOptions } from "../utils/process";
import { is } from "../utils/utils";

export class GExternalBuilder extends GBuilder {
    constructor(public command: string | ExternalBuilder,
        public args: string[] = [], public options: SpawnOptions = {}) {

        super((is.String(command)
            ? { command, args, options }
            : command) as ExternalBuilder
        );

        console.warn('[GExternalBuilder:constructor] GExternalBuilder is deprecated. Use GBuilder(builder:ExternalBuilder)');
    }
}

export default GExternalBuilder;
