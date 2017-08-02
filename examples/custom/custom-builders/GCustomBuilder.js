/**
 *  CustomTestBuilder
 *
 */

'use strict';
const gbm = require('../../../lib');

class GCustomBuilder extends gbm.GBuilder {
  constructor() { super(); }

  build(defaultModuleOptions, conf, done) {
    console.log('GCustomBuilder::build() called. continuing the build process...');
    return super.build(defaultModuleOptions, conf, done);
  }

  OnInitModuleOptions(mopts, defaultModuleOptions, conf) {
    console.log('GCustomBuilder::OnInitModuleOptions() called. continuing the build process...');
    return super.OnInitModuleOptions(mopts, defaultModuleOptions, conf);
  }

  OnPreparePlugins(mopts, conf) {
    console.log('GCustomBuilder::OnPreparePlugins() called. continuing the build process...');
    this.addPlugins(stream=>require('debug')());
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

module.exports = GCustomBuilder;
