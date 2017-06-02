/**
 *  CustomTestBuilder
 *
 */

'use strict';

import GBuilder from '../../../lib/builders/GBuilder';

class GCustomBuilder extends GBuilder {
  constructor() { super(); }

  build(defaultModuleOptions, conf, done) {
    console.log('GCustomBuilder::build() called. continuing the build process...');
    return super.build(defaultModuleOptions, conf, done);
  }

  OnInitModuleOptions(mopts, defaultModuleOptions, conf) {
    console.log('GCustomBuilder::OnInitModuleOptions() called. continuing the build process...');
    return super.OnInitModuleOptions(mopts, defaultModuleOptions, conf);
  }

  OnBuilderModuleOptions(mopts, defaultModuleOptions, conf) {
    console.log('GCustomBuilder::OnBuilderModuleOptions() called. continuing the build process...');
    return super.OnBuilderModuleOptions(mopts, defaultModuleOptions, conf);
  }

  OnInitStream(mopts, defaultModuleOptions, conf) {
    console.log('GCustomBuilder::OnInitStream() called. continuing the build process...');
    return super.OnInitStream(mopts, defaultModuleOptions, conf);
  }

  OnBuild(stream, mopts, conf) {
    console.log('GCustomBuilder::OnBuild() called. continuing the build process...');
    return super.OnBuild(stream, mopts, conf);
  }

  OnDest(stream, mopts, conf) {
    console.log('GCustomBuilder::OnDest() called. continuing the build process...');
    return super.OnDest(stream, mopts, conf);
  }
}

export default GCustomBuilder;
module.exports = GCustomBuilder;
