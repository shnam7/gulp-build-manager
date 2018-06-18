/**
 *  External Builder
 */

import {GBuilder} from "../core/builder";
import {GPlugin} from "../core/plugin";
import {SpawnOptions} from "../utils/process";

export class GExternalBuilder extends GBuilder {
  constructor(public command: string, public args: string[] = [], public options: SpawnOptions = {}) {
    super();
  }

  build() : Promise<void> {
    return GPlugin.exec(this, this.command, this.args, this.options)
      .then(()=>Promise.resolve());
  }
}

export default GExternalBuilder;
