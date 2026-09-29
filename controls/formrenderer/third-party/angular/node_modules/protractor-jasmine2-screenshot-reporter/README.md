## Protractor screenshot reporter for Jasmine2
[![npm version](https://badge.fury.io/js/protractor-jasmine2-screenshot-reporter.svg)](http://badge.fury.io/js/protractor-jasmine2-screenshot-reporter)

Reporter for Protractor that will capture a screenshot after each executed test case and store the results in a HTML report.
(supports jasmine2)

## Usage
The <code>protractor-jasmine2-screenshot-reporter</code> is available via npm:

<code>$ npm install protractor-jasmine2-screenshot-reporter --save-dev</code>

In your Protractor configuration file, register protractor-jasmine2-screenshot-reporter in jasmine:

<pre><code>var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

var reporter = new HtmlScreenshotReporter({
  dest: 'target/screenshots',
  filename: 'my-report.html'
});

exports.config = {
  // ...

  // Setup the report before any tests start
  beforeLaunch: function() {
    return new Promise(function(resolve){
      reporter.beforeLaunch(resolve);
    });
  },

  // Assign the test reporter to each running instance
  onPrepare: function() {
    jasmine.getEnv().addReporter(reporter);
  },

  // Close the report after all tests finish
  afterLaunch: function(exitCode) {
    return new Promise(function(resolve){
      reporter.afterLaunch(resolve.bind(this, exitCode));
    });
  }
}</code></pre>

## Options
### Destination directory

Output directory for created files. All screenshots and reports will be stored here.

If the directory doesn't exist, it will be created automatically or otherwise cleaned before running the test suite.

<pre><code>var reporter = new HtmlScreenshotReporter({
  dest: '/project/test/screenshots'
});</code></pre>

### Clean destination directory (optional)

This option is __enabled by default__. Toggle whether or not to remove and rebuild destination when jasmine starts.

This is useful when you are running protractor tests in parallel, and wish all of the processes to report to the same directory.

When cleanDestination is set to true, it is recommended that you disabled showSummary and showConfiguration, and set reportTitle to null. If you do not, the report will be pretty cluttered.

<pre><code>var reporter = new HtmlScreenshotReporter({
  cleanDestination: false,
  showSummary: false,
  showConfiguration: false,
  reportTitle: null
});</code></pre>


### Filename (optional)

Filename for html report.

<pre><code>var reporter = new HtmlScreenshotReporter({
  filename: 'my-report.html'
});</code></pre>

Default is <code>report.html</code>

### Use External CSS (optional)

Array of filenames that specifies extra css files to include in the html report. You can find the classnames and element IDs used either from browsers dev tools or in [example stylesheet](https://github.com/mlison/protractor-jasmine2-screenshot-reporter/blob/master/docs/example-custom.css).

<pre><code>var reporter = new HtmlScreenshotReporter({
  userCss: 'my-report-styles.css'
});</code></pre>

### Use External JS (optional)

A string or an array of javascript filenames that should be loaded in the html test report.

<pre><code>var reporter = new HtmlScreenshotReporter({
  userJs: [ 'script.js', 'other-script.js' ]
  // Or
  userJs: 'script.js
});</code></pre>


### Ignore pending specs (optional)

When this option is enabled, reporter will not create screenshots for pending / disabled specs. Only executed specs will be captured.

<pre><code>var reporter = new HtmlScreenshotReporter({
  ignoreSkippedSpecs: true
});</code></pre>

Default is <code>false</code>

### Capture only failed specs (optional)

When this option is enabled, reporter will create screenshots only for specs that have failed their expectations.

<pre><code>var reporter = new HtmlScreenshotReporter({
  captureOnlyFailedSpecs: true
});</code></pre>

Default is <code>false</code>

### Report only failed specs (optional)

This option is __enabled by default__ - in combination with <code>captureOnlyFailedSpecs</code>, it will capture and report screenshots only for failed specs. Turning this option off will cause the report to contain all specs, but screenshots will be captured only for failed specs.

<pre><code>var reporter = new HtmlScreenshotReporter({
  reportOnlyFailedSpecs: false,
  captureOnlyFailedSpecs: true
});</code></pre>

### Display summary in report (optional)

This option is __enabled by default__ - it will display the total number of specs and the number of failed specs in a short summary at the beginnning of the report.

<pre><code>var reporter = new HtmlScreenshotReporter({
  showSummary: true
});</code></pre>

Default is <code>true</code>

### Display links to failed specs in report summary (optional)

If this option is enabled with the report summary, it will display a link to each failed spec as a part of the short summary at the beginnning of the report.

<pre><code>var reporter = new HtmlScreenshotReporter({
  showSummary: true,
  showQuickLinks: true
});</code></pre>

Default is <code>false</code>

### Display configuration summary in report (optional)

This option is __enabled by default__ - it will display a summary of the test configuration details at the end of the report.

<pre><code>var reporter = new HtmlScreenshotReporter({
  showConfiguration: true
});</code></pre>

Default is <code>true</code>

### Report title (optional)

This option will add a title to the report.

<pre><code>var reporter = new HtmlScreenshotReporter({
  reportTitle: "Report Title"
});</code></pre>

Default is <code>'Report'</code>

### Report failedAt url (optional)

When a spec fails, include the current url in the report.

<pre><code>var reporter = new HtmlScreenshotReporter({
  reportFailedUrl: true
});</code></pre>

Default is <code>false</code>

### Extra configuration summary items (optional)

The user may specify a set of key/value pairs that are appended to the configuration report.

<pre><code>var reporter = new HtmlScreenshotReporter({
  configurationStrings: {
    "My 1st Param": firstParam,
    "My 2nd Param": secondParam
  }
});</code></pre>

### Path Builder (optional)

Function used to build custom paths for screenshots. For example:

<pre><code>var reporter = new HtmlScreenshotReporter({
  pathBuilder: function(currentSpec, suites, browserCapabilities) {
    // will return chrome/your-spec-name.png
    return browserCapabilities.get('browserName') + '/' + currentSpec.fullName;
  }
});</code></pre>

By default, the path builder will generate a random ID for each spec.

### Metadata Builder (optional)

Function used to build custom metadata objects for each spec. Files (json) will use the same filename and path as created by Path Builder.
For example:

<pre><code>var reporter = new ScreenShotReporter({
  metadataBuilder: function(currentSpec, suites, browserCapabilities) {
    return { id: currentSpec.id, os: browserCapabilities.get('browserName') };
  }
});</code></pre>

By default, the runner builder will not save any metadata except the actual html report.

### Preserve Directory (optional)

This option is __disabled by default__. When this option is enabled, than for each report will be
 created separate directory with unique name. Directory unique name will be generated randomly.

<pre><code>var reporter = new HtmlScreenshotReporter({
  preserveDirectory: true
});</code></pre>

### Inline Images (optional)

Produce images inline in the report instead of links.

<pre><code>var reporter = new HtmlScreenshotReporter({
  inlineImages: true
});</code></pre>

Default is <code>false</code>

## Forked browser instances

The reporter can take screenshots also from instances forked off the main browser.
All you need to do is just register the instance in the begining of your suite / spec, e.g. like so:

<pre><code>beforeAll(function () {
  browser.forkedInstances['secondBrowser'] = browser.forkNewDriverInstance();
});</code></pre>

Remember to unregister the instance once you're done with it:

<pre><code>afterAll(function () {
  browser.forkedInstances['secondBrowser'] = null;
});</code></pre>

## Tests

Automated unit tests for Protractor screenshot reporter for Jasmine2 are run by Mocha (Yes, we know that it is funny).
In order to run it, you can use either `npm test` or by gulp by using `gulp test`.

### Coverage report

Coverage is being generated by `Istanbul`. You can generate the HTML report by using either npm run coverage or by `gulp test`.


### Coding style

Coding style tests are being done by jshint. You can find the code guide in .jshintrc file. Run jshint by `gulp lint` or `npm lint`.

## Tips & tricks

By default, no report is generated if an exception is thrown from within the test run. You can however catch these errors and make jasmine report current spec explicitly by adding following to your protractor.conf / beforeLaunch method:
```js
process.on('uncaughtException', function () {
    reporter.jasmineDone();
    reporter.afterLaunch();
});
```

