# Gulp Build Manager Sample: triggers

## Overview
This sample shows how to trigger other tasks finishing current task.
In this example, if you run taskMain, following should happen:
- task1 and task2 are executed in series (dependent tasks)
- taskMain executed
- task1 and task2 are executed in parallel (triggered tasks)

 
## Running
```
npm install

gulp
gulp taskMain
```
