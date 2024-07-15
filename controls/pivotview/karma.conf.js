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
      "demos/styles/material.css",
      { pattern: "src/**/*.js", included: false },
      // { pattern: "spec/**/*.spec.js", included: false },
      { pattern: "spec/common.spec.js", included: false },
      { pattern: "spec/utils.spec.js", included: false },
      { pattern: "spec/base/datasource.spec.js", included: false },
      { pattern: "spec/base/engine.spec.js", included: false },
      { pattern: "spec/base/grouping.spec.js", included: false },
      { pattern: "spec/base/group.spec.js", included: false },
      { pattern: "spec/base/label-filter.spec.js", included: false },
      // { pattern: "spec/base/olap-engine.spec.js", included: false },
      { pattern: "spec/field-list/pivotfieldlist.spec.js", included: false },
      { pattern: "spec/field-list/mobile.spec.js", included: false },
      { pattern: "spec/field-list/drag-and-drop.spec.js", included: false },
      { pattern: "spec/field-list/defer-update.spec.js", included: false },
      { pattern: "spec/field-list/keyboard.spec.js", included: false },
      { pattern: "spec/field-list/slicer-filter.spec.js", included: false },
      { pattern: "spec/pivotview/pivotview.spec.js", included: false },
      { pattern: "spec/pivotview/calculated-field.spec.js", included: false },
      { pattern: "spec/pivotview/conditional-formatting.spec.js", included: false },
      { pattern: "spec/pivotview/editing.spec.js", included: false },
      { pattern: "spec/pivotview/drill-through.spec.js", included: false },
      { pattern: "spec/pivotview/hyperlink.spec.js", included: false },
      { pattern: "spec/pivotview/selection.spec.js", included: false },
      // { pattern: "spec/pivotview/server-side.spec.js", included: false },
      { pattern: "spec/pivotview/toolbar.spec.js", included: false },
      { pattern: "spec/pivotview/pivot-chart.spec.js", included: false },
      { pattern: "spec/pivotview/cell-template.spec.js", included: false },
      { pattern: "spec/pivotview/exporting.spec.js", included: false },
      { pattern: "spec/pivotview/pivotView-public.spec.js", included: false },
      { pattern: "spec/field-list/pivotfieldlist-public.spec.js", included: false },
      // { pattern: "spec/pivotview/grouping.spec.js", included: false },
      // { pattern: "spec/pivotview/virtual-scrolling.spec.js", included: false },
      // { pattern: "spec/pivotview/context-menu.spec.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-base/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-data/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-lists/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-inputs/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-navigations/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-buttons/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-splitbuttons/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-popups/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-file-utils/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-compression/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-excel-export/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-pdf-export/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-calendars/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-dropdowns/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-grids/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-charts/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-svg-base/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-notifications/**/*.js", included: false },
      { pattern: 'node_modules/es6-promise/dist/es6-promise.js', included: false }
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
