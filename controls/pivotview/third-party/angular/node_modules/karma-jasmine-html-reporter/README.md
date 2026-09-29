# karma-jasmine-html-reporter

[![npm version](https://img.shields.io/npm/v/karma-jasmine-html-reporter.svg)](https://www.npmjs.com/package/karma-jasmine-html-reporter) [![npm downloads](https://img.shields.io/npm/dm/karma-jasmine-html-reporter.svg)](https://www.npmjs.com/package/karma-jasmine-html-reporter)

Reporter that dynamically shows tests results at debug.html page.

![alt tag](/screenshots/reporter_1.png)

You can also run a describe block, or a single test.

![alt tag](/screenshots/reporter_2.png)

## Installation

You can simply install `karma-jasmine-html-reporter` as a devDependency by:
```bash
npm install karma-jasmine-html-reporter --save-dev
```

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    plugins: [
        require('karma-jasmine'),
        require('karma-jasmine-html-reporter')
    ],
    client: {
        jasmine: {
            // you can add configuration options for Jasmine here
            // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
            // for example, you can disable the random execution with `random: false`
            // or set a specific seed with `seed: 4321`
        }
    },
    reporters: ['kjhtml']
  });
};
```
#### With options
In combination with multiple reporters you may want to disable terminal messages because it's already handled by another reporter.

*Example using the 'karma-mocha-reporter' plugin*:
```js
// karma.conf.js
module.exports = function(config) {
  config.set({

    // Combine multiple reporters
    reporters: ['kjhtml', 'mocha'],

    jasmineHtmlReporter: {
      suppressAll: true, // Suppress all messages (overrides other suppress settings)
      suppressFailed: true // Suppress failed messages
    }

  });
};
```

You can pass a list of reporters as a CLI argument too:
```bash
karma start --reporters kjhtml
```

## Version compatibility

jasmine Version | karma-jasmine-html-reporter version
-|-
2.x | 0.2.2
3.x | 1.x
4.x - 7.x | 2.x

Jasmine 7 support replaces karma-jasmine's incompatible browser boot files
while continuing to use its Karma adapter. Karma and karma-jasmine are both
deprecated, so new projects should prefer a maintained browser test runner.
The retained adapter reports Jasmine 7's `notApplicable` status as a success;
use a maintained runner if you need full Jasmine 7 result semantics.
