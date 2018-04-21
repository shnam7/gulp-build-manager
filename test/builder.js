// const expect = require('chai').expect;
let assert = require('assert');
const gbm = require('../lib');
const pick = require('../lib/utils/utils').pick;

module.exports = function () {
  describe('GBuilder', function () {
    describe('new GBuilder', function() {
      it('should be ok to create an instance', function() {
        assert(true, new gbm.GBuilder());
      })
    });
    describe('pick()', function () {
      it('should be ok', function () {
        let obj= { a:1, b:2, c:3, d:4, e:5};
        assert.deepEqual(pick(obj, 'a','c'), {a:1, c:3});
      });
    });
  });
};