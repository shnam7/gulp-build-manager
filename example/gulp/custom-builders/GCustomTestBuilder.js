/**
 *  CustomTestBuilder
 *
 */

'use strict';

import GBuilder from '../../../lib/builders/GBuilder';

class GCustomTestBuilder extends GBuilder {
  constructor() { super();
    console.log('aaa1');
  }

  OnBuild(stream, mopts, conf) {
    console.log('Hello, CustomBuilder!');
  }
}

export default GCustomTestBuilder;
module.exports = GCustomTestBuilder;
