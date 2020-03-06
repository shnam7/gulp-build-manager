/**
 * CustomTestBuilder
 */

const gbm = require('../../../lib');

class GCustomBuilder extends gbm.builders.GBuilder {
    constructor() { super(); }

    build() {
        console.log('GCustomBuilder::build() called. continuing the build process...');
        return super.build();
    }
}

module.exports = GCustomBuilder;
