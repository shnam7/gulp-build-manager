/**
 *  Jekyll Builder
 */

import {GBuilder} from "../core/builder";
import {ExecOptions} from "child_process";
import {GPlugin} from "../core/plugin";

export class GExternalBuilder extends GBuilder {
  constructor(public command: string, public args: string[] = [], public options: ExecOptions = {}) {
    super();
  }

  build() : Promise<void> {
    return GPlugin.exec(this, this.command, this.args, this.options)
      .then(()=>Promise.resolve());
  }
}

export default GExternalBuilder;
