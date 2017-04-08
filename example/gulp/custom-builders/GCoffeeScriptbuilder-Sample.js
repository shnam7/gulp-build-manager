import GBuilder from '../../../src/builders/GBuilder';
import merge from 'lodash.merge';

class GCoffeeScriptBuilder extends GBuilder {
  constructor() { super(); }

  OnInitModuleOptions(mopts) {
    merge(mopts, {changed:{extension: '.js'}})
  }

  OnBuild(stream, mopts, conf) {
    console.log("Hello, This is overloading default GCoffeeScriptBuilder!!");
    console.log('mopt:', mopts, conf);
    return stream;
  }
}

export default GCoffeeScriptBuilder;
module.exports = GCoffeeScriptBuilder;
