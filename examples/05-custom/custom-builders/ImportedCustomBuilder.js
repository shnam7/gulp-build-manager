/**
 * CustomTestBuilder
 */

const gbm = require('../../../lib');

class ImportedCustomBuilder extends gbm.builders.GBuilder {
    constructor() { super(); }

    build() {
        console.log('GCustomBuilder::build() called. continuing the build process...');
        return super.build();
    }
}

module.exports = ImportedCustomBuilder;
