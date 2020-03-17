---
layout: docs
---

# GExternalBuilder
Creates child process running external commands. It uses Node.js Child Process spawn() function.
GExternalBuilder can be created using 'new' operator, or ExternalBuilder interface, which is exactly the same as child_process.spawn() interface:
```
{
  command:string,   // command to execute
  args: string[];   // list of arguments to command
  options: object;  // options from child_process.spawn()
}
```
To learn more about Node Child Process, check [Node Docs](https://nodejs.org/dist/latest-v9.x/docs/api/child_process.html){:target='_blank'}.

#### Builder specific Options
  - No options are available.

#### Notes
  - *conf.flushStream* (<i>type:boolean, default:false</i>)
    If this is set to true, build task will not finish until the spawned commands finish.

#### Example
```javascript
const cmd1 = {
  buildName: 'external-command1',
  builder: new gbm.GExternalBuilder('dir', ['.'], {shell:true, env:process.env}),
  flushStream: true
};

const cmd2 = {
  buildName: 'external-command2',
  builder: {
    command: 'node',
    args: ['-v'],
    options: {shell:true}
  },
  flushStream: true
};

gbm({
  systemBuilds: {
    build: [cmd1, cmd2],
    default: ['@build']
  }
});
```

#### Resources
  - Main gulpfile of this project is using GExternalBuilder features. See [docs build configuration]({{site.repo}}/gulpfile.js){:target="_blank"} for more details.
  - You can also refer to an example at [examples/external]({{site.repo}}/examples/external/gulpfile.js))

