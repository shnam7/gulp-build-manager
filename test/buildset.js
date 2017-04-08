import chai from 'chai';
import {expect} from 'chai';
import buildSet from '../src/buildset';

let should = chai.should();

module.exports = function () {
  describe('buildSet', function () {
    it('calling with non-zero string argument should be ok', function () {
      should.not.throw(()=>buildSet('test'), Error);
    });

    it('calling with null string argument should faile', function () {
      should.throw(()=>buildSet(''), Error, /Null string is not allowed/);
    });

    it('calling with BuildSet should be ok', function () {
      should.not.throw(()=>buildSet(buildSet('test')), Error, /Invalid Object/);
    });

    it('calling with non BuildSet object without property \'buildName\' should fail', function () {
      should.throw(()=>buildSet(()=>{}), Error, /Invalid Object/);
      should.throw(()=>buildSet({}), Error, /Invalid Object/);
    });

    it('calling with Object with property \'buildName\' should be ok', function () {
      should.not.throw(()=>buildSet({buildName:'test'}));
    });

    it('should be ok with array arguments', function () {
      let bs = [{buildName:'test1'}, {buildName:'test2'}];
      should.not.throw(()=>{ return buildSet(...bs); });
    });

    it('calling with multiple mixed type argument should be ok', function () {
      should.not.throw(()=>{
        const bs = buildSet(buildSet(
          'test1',
          'test2',
          {buildName:'test3'},
          [{buildName:'test4'},{buildName:'test5'}],
          buildSet('test6', 'test7')
        ));
      })
    });
  })
};
