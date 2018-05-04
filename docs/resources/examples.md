---
layout: docs
---

# Examples

Gulp Build Manager source contains various working examples and you can find them here:
### [examples]({{site.repo}}/examples){:target='_blank'}

#### Running examples inside gulp-build-manager source code
If you download gulp-build-manager source codes then you can run examples as it is. If you see error messages such as <i>'Cannot find module ...'</i>, then install the required modules using npm or yarn command.

#### Running examples as a separate project
If you copy an example as a separate project, you need to fix the code a little. For the convenience of testing in development process, all the examples are referring to gulp-build-manager from the source, not from the npm repository.

```javascript
const gbm = require('../../lib');

//...
```

To run this as an independent project, you need to fix it:
```javascript
const gbm = require('gulp-build-manager');

//...
```

#### Using babel with gulp
To use babel, follow the instructions [here]({{site.baseurl}}/getting-started).
