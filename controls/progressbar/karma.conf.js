// Karma configuration
// Generated on Tue Apr 26 2016 09:56:05 GMT+0530 (India Standard Time)

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine-ajax', 'jasmine', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
      "test-main.js",
      { pattern: "src/**/*.js", included: false },     
      { pattern: "spec/**/*.spec.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-base/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-data/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-svg-base/**/*.js", included: false },
      // Add dependent package's script files here              
    ],


    // list of files to exclude
    exclude: [     
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots', 'html'],

    // the default html configuration 
    htmlReporter: {
      outputFile: "test-report/units.html",
      pageTitle: "Unit Tests",
      subPageTitle: "Asampleprojectdescription"
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless', 'Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,


    coverageReporter: {
      type: "html",
      check: {
        each: {
          statements: 90,
          branches: 90,
          functions: 100,
          lines: 90
        }
      }
    }
  })
}
