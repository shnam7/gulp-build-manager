"use strict";
/**
 *  Panini Builder
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPaniniBuilder = void 0;
const builder_1 = require("../core/builder");
const npm_1 = require("../utils/npm");
class GPaniniBuilder extends builder_1.GBuilder {
    constructor() { super(); }
    build() {
        this.src()
            .chain(() => {
            const panini = npm_1.requireSafe('panini');
            panini.refresh();
            this.pipe(panini(this.moduleOptions.panini));
        })
            .rename({ extname: '.html' })
            .dest();
    }
}
exports.GPaniniBuilder = GPaniniBuilder;
exports.default = GPaniniBuilder;
