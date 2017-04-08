import GBuilder from '../../../src/builders/GBuilder';

class GCustomTestBuilder extends GBuilder {
  constructor(gbm, config) { super(gbm, config); }

  build(conf, done) {
    console.log("Hello, GCustomTestBuilder!!");
    done();
  }
}

export default GCustomTestBuilder;
module.exports = GCustomTestBuilder;
