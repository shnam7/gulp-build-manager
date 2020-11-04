const chai = require('chai');
const gbm = require('../lib');

let should = chai.should();
let parallel = gbm.parallel;

module.exports = function () {
    describe('buildManager', function () {
        it('calling with non-zero string argument should be ok', function () {
            should.not.throw(() => parallel('test'), Error);
        });

        // it('calling with null string argument should fail', function () {
        //     should.throw(() => parallel(''), Error, 'Null string is not allowed');
        // });

        it('calling with BuildSet should be ok', function () {
            should.not.throw(() => parallel(parallel('test')), Error, /Invalid Object/);
        });

        // it('calling with non BuildSet object without property \'buildName\' should fail', function () {
        //     should.throw(() => parallel({}), Error, /Invalid Object/);
        // });

        it('calling with Object with property \'buildName\' should be ok', function () {
            should.not.throw(() => parallel({
                buildName: 'test'
            }));
        });

        it('should be ok with array arguments', function () {
            let bs = [{
                buildName: 'test1'
            }, {
                buildName: 'test2'
            }];
            should.not.throw(() => {
                return parallel(...bs);
            });
        });

        it('calling with multiple mixed type argument should be ok', function () {
            should.not.throw(() => {
                const bs = parallel(parallel(
                    'test1',
                    'test2', {
                        buildName: 'test3'
                    },
                    [{
                        buildName: 'test4'
                    }, {
                        buildName: 'test5'
                    }],
                    parallel('test6', 'test7')
                ));
            })
        });
    })
};
