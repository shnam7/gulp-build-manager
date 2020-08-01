let assert = require('assert');
const gbm = require('../lib');

module.exports = function () {
    describe('GBuilder', function () {
        describe('new GBuilder', function () {
            it('should be ok to create an instance', function () {
                assert(true, new gbm.builders.GBuilder());
            })
        });
    });
};
