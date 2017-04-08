import {assert} from 'chai';
import is from '../src/utils/is';

module.exports = function () {
  describe('utils', function() {
    describe('is', function() {
      it('Array([]) should return true', function () {
        assert(true, is.Array([]));
      });

      it('Function(()=>{}) should return true', function () {
        assert(true, is.Function(()=>{}));
      });

      it('Object(()=>{}) should return true', function () {
        assert(true, is.Object(()=>{}));
      });

      it('Object({}) should return true', function () {
        assert(true, is.Object({}));
      });

      it('String(\'\') should return true', function () {
        assert(true, is.String(''));
      });
    })
  })
};
