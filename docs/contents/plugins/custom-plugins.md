---
layout: docs
---
# Writing custom plugins

## GPlugin interface
Build process is basically executing a sequence of actions, and those actions can be modularized as plugins for reuse and simplification. GPlugin is designed based on this concept and has very simple interface.

```javascript
export class GPlugin {
  constructor(public options: Options = {}) {}
  
  process(builder: GBuilder, ...args: any[]): void | Promise<any> {}
}
```

#### GPlugin.constructor(options = {})
*options*: plugin specific options

#### GPlugin.process(builder: GBuilder)
*builder*: Builder object currently running
If returns a Promise, then the promise will be finished before proceeding next build actions.

Now, let's see an example, a snippet from gbm.MarkdownPlugin source codes:
```javascript
export class MarkdownPlugin extends GPlugin {
  constructor(options:Options={}) { super(options); }

  process(builder: GBuilder) {
    builder.pipe(require('gulp-markdown')(builder.moduleOptions.markdown));
    if (builder.buildOptions.minify) builder.pipe(require('gulp-htmlclean')(builder.moduleOptions.htmlmin));
    if (builder.buildOptions.prettify) builder.pipe(require('gulp-html-prettify')(builder.moduleOptions.htmlPrettify));
  }
}
```

## GPlugin function
Any function with following prototype can be used as custom plugin function:<br>
*Prototype*: (builder: GBuilder) =\> void | Promise\<any\>
```javascript
builder
  .chain(GPlugin.concat)
  .chain((builder)=>console.log(builder.conf.buildName))  // custom plugin using builder argument
  .chain(()=>console.log('Hello!!'))  // custom plugin with no argument
```