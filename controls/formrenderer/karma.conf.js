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
      "styles/button/material.css",
      "styles/check-box/material.css",
      "styles/radio-button/material.css",
      "styles/switch/material.css",
      "styles/floating-action-button/material.css",
      "styles/speed-dial/material.css",
      { pattern: "src/**/*.js", included: false },     
      { pattern: "spec/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-base/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-buttons/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-calendars/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-compression/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-data/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-dropdowns/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-excel-export/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-file-utils/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-filemanager/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-grids/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-icons/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-image-editor/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-inputs/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-interactive-chat/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-layouts/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-lists/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-markdown-converter/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-navigations/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-notifications/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-pdf-export/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-popups/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-richtexteditor/dist/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-splitbuttons/dist/*.js", included: false }
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
    browsers: ['ChromeHeadless', 'Chrome', 'Firefox'],


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
