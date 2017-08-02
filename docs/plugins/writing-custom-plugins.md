---
layout: docs
title: Writing custom plugins
---
# {{page.title}}

## GPlugin interface
Build process is basically doing something on input stream and generating output sometimes if necessary. This kind of actions can be modularized as plugins. GPlugin is designed based on this concept and provides simple interface to add plugin actions into specific [build stages]({{site.baseurl}}/using-plugins).


#### GPlugin.constructor(options = {}, slots='build')
<i>options</i>: plugin specific options
<i>slots</i>: slot name or an array of slot names
Plugins basically use build configuration settings and module options that are available in builder classes, because it's part of build process. But it may need some plugin specific options. The first parameter is for this.<br>
Defaule stot for the plugins to be plugged in is 'build', but it can be changed using the seconed parameter. If necessary, slots can be an array of slot names. In this case, the plugin will be invoked on each build stages.

#### GPlugin.process(stream, mopts, conf, slot)
<i>stream</i>:input stream to be processed
<i>mopts</i>: module options used in build process
<i>conf</i>: build configuration object
<i>slot</i>: name of current build stage
You may noticed that the parameters are almost the same as GBuilder interfaces except the slot. With slot parameter, you can see in what stage the plugin is called.

Now, let's see an example:
```javascript
class DebugPlugin extends GPlugin {
  constructor(options={}, slots='build') { super(options, slots); }

  process(stream, mopts, conf, slot) {
    let debug = require('gulp-debug');
    let title = this.options ? this.options.title : "";
    title = title ? title+':' : "";
    title = '[DebugPlugin]' + slot + ':' + title;
    let opts = merge({}, this.options, {title: title});
    return stream.pipe(debug(opts));
  }
}
```
This is the snippet from gbm.DebugPlugin source codes.
