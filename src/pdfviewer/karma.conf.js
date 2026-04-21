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
      "node_modules/@syncfusion/ej2-base/styles/material.css",
      "node_modules/@syncfusion/ej2-inputs/styles/material.css",
      "node_modules/@syncfusion/ej2-buttons/styles/material.css",
      "node_modules/@syncfusion/ej2-dropdowns/styles/material.css",
      "node_modules/@syncfusion/ej2-popups/styles/material.css",
      "node_modules/@syncfusion/ej2-lists/styles/material.css",
      "node_modules/@syncfusion/ej2-splitbuttons/styles/material.css",
      "node_modules/@syncfusion/ej2-navigations/styles/material.css",
      "node_modules/@syncfusion/ej2-notifications/styles/material.css",
      "demos/material.css",
      { pattern: "src/**/*.js", included: false },
      { pattern: "src/**/**/**/*.js", included: false },
      { pattern: "src/pdfviewer/ej2-pdfviewer-lib/**/*", included: false, served: true, watched: false },
      { pattern: "spec/pdfviewer/Data/**/*", included: false, served: true, watched: false },
      { pattern: "spec/**/*.spec.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-base/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-data/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-inputs/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-buttons/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-popups/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-lists/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-dropdowns/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-navigations/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-splitbuttons/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-notifications/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-drawings/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-inplace-editor/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-calendars/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-richtexteditor/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-interactive-chat/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-markdown-converter/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-filemanager/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-layouts/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-grids/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-excel-export/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-pdf-export/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-compression/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-file-utils/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-pdf/**/*.js", included: false },
      { pattern: "node_modules/@syncfusion/ej2-pdf-data-extract/**/*.js", included: false }


      // Add dependent package's script files here              
    ],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/pdfviewer/{accessibility-tags,annotation,base,bookmark-view,drawing,form-designer,form-fields,magnification,navigation,organize-pdf,pdf-base,print,text-search,text-selection,thumbnail-view,toolbar}/**/*.js': ['coverage'],
      'src/pdfviewer/*.js': ['coverage'],
      'src/pdfviewer/pdfium/index.js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'html', 'coverage'],

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
    autoWatch: false,

    browserNoActivityTimeout: 180000,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],
    customLaunchers: {
      ChromeNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 5,

    // COVERAGE REPORTER
    coverageReporter: {
      dir: 'coverage', // output folder
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' }, // useful for CI
        { type: 'text-summary' } // nice summary in console
      ],
      check: {
        each: {
          statements: 23.86,
          branches: 11.89,
          functions: 28.49,
          lines: 23.94,
          overrides: {
            // // optional: relax thresholds for specific files/patterns if needed
            // 'src/pdfviewer/drawing/action.js': { branches: 0 }
            "src/pdfviewer/pdfviewer.js": {
              "branches": 3.2,
              "functions": 19.1,
              "statements": 39,
              "lines": 39.53
            },
            "src/pdfviewer/accessibility-tags/accessibility-tags.js": {
              "branches": 0,
              "functions": 23.08,
              "statements": 12.5,
              "lines": 12.5
            },
            "src/pdfviewer/annotation/annotation.js": {
              "branches": 0,
              "functions": 0.98,
              "statements": 2,
              "lines": 2
            },
            "src/pdfviewer/toolbar/redaction-toolbar.js": {
              "branches": 0.42,
              "functions": 2.08,
              "statements": 6.57,
              "lines": 6.62
            },
            "src/pdfviewer/annotation/redaction-overlay-text.js": {
              "branches": 0,
              "functions": 18.18,
              "statements": 6.86,
              "lines": 6.86
            },
            "src/pdfviewer/annotation/redaction-annotation.js": {
              "branches": 0,
              "functions": 3.85,
              "statements": 4.93,
              "lines": 4.97
            },
            "src/pdfviewer/annotation/shape-annotation.js": {
              "branches": 0,
              "functions": 7.41,
              "statements": 1,
              "lines": 1
            },
            "src/pdfviewer/annotation/measure-annotation.js": {
              "branches": 0,
              "functions": 1,
              "statements": 2,
              "lines": 2
            },
            "src/pdfviewer/annotation/link-annotation.js": {
              "branches": 0,
              "functions": 4.88,
              "statements": 8.07,
              "lines": 9.75
            },
            "src/pdfviewer/annotation/ink-annotation.js": {
              "branches": 0,
              "functions": 7.14,
              "statements": 7.04,
              "lines": 7.04
            },
            "src/pdfviewer/print/print.js": {
              "branches": 0,
              "functions": 3,
              "statements": 3,
              "lines": 3
            },
            "src/pdfviewer/print/default-print.js": {
              "branches": 0,
              "functions": 20,
              "statements": 12.35,
              "lines": 12.35
            },
            "src/pdfviewer/base/navigation-pane.js": {
              "branches": 0,
              "functions": 3.7,
              "statements": 9.96,
              "lines": 9.97
            },
            "src/pdfviewer/base/annotation-helper.js": {
              "branches": 0,
              "functions": 50,
              "statements": 40.48,
              "lines": 40.48
            },
            "src/pdfviewer/base/ajax-handler.js": {
              "branches": 0,
              "functions": 10.53,
              "statements": 13.85,
              "lines": 13.85
            },
            "src/pdfviewer/annotation/text-markup-annotation.js": {
              "branches": 0,
              "functions": 1,
              "statements": 2,
              "lines": 2
            },
            "src/pdfviewer/annotation/stamp-annotation.js": {
              "branches": 0,
              "functions": 3.77,
              "statements": 4.06,
              "lines": 4.06
            },
            "src/pdfviewer/annotation/sticky-notes-annotation.js": {
              "branches": 0,
              "functions": 1,
              "statements": 3.9,
              "lines": 3.9
            },
            "src/pdfviewer/annotation/free-text-annotation.js": {
              "branches": 0,
              "functions": 2,
              "statements": 3,
              "lines": 3
            },
            "src/pdfviewer/annotation/input-element.js": {
              "branches": 0,
              "functions": 2,
              "statements": 3,
              "lines": 3
            },
            "src/pdfviewer/base/pdfviewer-base.js": {
              "branches": 1.09,
              "functions": 4.2,
              "statements": 9.48,
              "lines": 9.58
            },
            "src/pdfviewer/base/pdfviewer-utlis.js": {
              "branches": 0,
              "functions": 6.25,
              "statements": 13.21,
              "lines": 18.58
            },
            "src/pdfviewer/bookmark-view/bookmark-view.js": {
              "branches": 0,
              "functions": 7.14,
              "statements": 8.06,
              "lines": 8.14
            },
            "src/pdfviewer/magnification/magnification.js": {
              "branches": 0,
              "functions": 2.9,
              "statements": 5,
              "lines": 5
            },
            "src/pdfviewer/toolbar/annotation-toolbar.js": {
              "branches": 0,
              "functions": 0.72,
              "statements": 5.4,
              "lines": 5
            },
            "src/pdfviewer/navigation/page-navigation.js": {
              "branches": 0,
              "functions": 20,
              "statements": 34.21,
              "lines": 34.21
            },
            "src/pdfviewer/thumbnail-view/thumbnail-view.js": {
              "branches": 0,
              "functions": 3.51,
              "statements": 7.8,
              "lines": 7.8
            },
            "src/pdfviewer/toolbar/toolbar.js": {
              "branches": 0,
              "functions": 1.17,
              "statements": 6.93,
              "lines": 6.96
            },
            "src/pdfviewer/toolbar/formdesigner-toolbar.js": {
              "branches": 0,
              "functions": 1.17,
              "statements": 9,
              "lines": 9
            },
            "src/pdfviewer/base/text-layer.js": {
              "branches": 0,
              "functions": 5,
              "statements": 5,
              "lines": 5
            },
            "src/pdfviewer/base/context-menu.js": {
              "branches": 0,
              "functions": 10.53,
              "statements": 7.94,
              "lines": 7.94
            },
            "src/pdfviewer/base/blazor-context-menu.js": {
              "branches": 0,
              "functions": 22.22,
              "statements": 40.74,
              "lines": 40.74
            },
            "src/pdfviewer/base/blazor-ui-adaptor.js": {
              "branches": 0,
              "functions": 6.67,
              "statements": 5.33,
              "lines": 5.33
            },
            "src/pdfviewer/base/signature.js": {
              "branches": 0,
              "functions": 3.57,
              "statements": 7.64,
              "lines": 7.64
            },
            "src/pdfviewer/base/spinner.js": {
              "branches": 0,
              "functions": 2.04,
              "statements": 19.4,
              "lines": 19.4
            },
            "src/pdfviewer/text-search/text-search.js": {
              "branches": 0,
              "functions": 1.59,
              "statements": 4.05,
              "lines": 4.06
            },
            "src/pdfviewer/text-selection/text-selection.js": {
              "branches": 0,
              "functions": 1.53,
              "statements": 2,
              "lines": 2
            },
            "src/pdfviewer/form-fields/form-fields.js": {
              "branches": 0,
              "functions": 2,
              "statements": 2,
              "lines": 2
            },
            "src/pdfviewer/drawing/pdf-annotation.js": {
              "branches": 0,
              "functions": 2.63,
              "statements": 5.95,
              "lines": 5.96
            },
            "src/pdfviewer/drawing/selector.js": {
              "branches": 0,
              "functions": 2.63,
              "statements": 5.95,
              "lines": 5.96
            },
            "src/pdfviewer/drawing/dom-util.js": {
              "branches": 0,
              "functions": 2.63,
              "statements": 5.95,
              "lines": 5.96
            },
            "src/pdfviewer/drawing/drawing-util.js": {
              "branches": 0,
              "functions": 2.63,
              "statements": 5.95,
              "lines": 5.96
            },
            "src/pdfviewer/drawing/action.js": {
              "branches": 0,
              "functions": 2.63,
              "statements": 5.95,
              "lines": 5.96
            },
            "src/pdfviewer/drawing/tools.js": {
              "branches": 0,
              "functions": 2.63,
              "statements": 5.95,
              "lines": 5.96
            },
            "src/pdfviewer/drawing/connector-util.js": {
              "branches": 0,
              "functions": 2.63,
              "statements": 5.95,
              "lines": 5.96
            },
            "src/pdfviewer/drawing/drawing.js": {
              "branches": 0,
              "functions": 2.63,
              "statements": 3,
              "lines": 3
            },
            "src/pdfviewer/form-designer/form-designer.js": {
              "branches": 0,
              "functions": 0.5,
              "statements": 1.5,
              "lines": 1.5
            },
            "src/pdfviewer/drawing/html-element.js": {
              "branches": 0,
              "functions": 2.63,
              "statements": 5.95,
              "lines": 5.96
            },
            "src/pdfviewer/pdfium/pdfium-runner.js": {
              "branches": 0,
              "functions": 1,
              "statements": 1,
              "lines": 1
            },
            "src/pdfviewer/pdf-base/page-renderer.js": {
              "branches": 0,
              "functions": 9.09,
              "statements": 5.8,
              "lines": 5.83
            },
            "src/pdfviewer/pdf-base/pdf-renderer.js": {
              "branches": 0,
              "functions": 6.36,
              "statements": 9.79,
              "lines": 9.88
            },
            "src/pdfviewer/pdf-base/form-fields-base.js": {
              "branches": 0,
              "functions": 5.17,
              "statements": 3.74,
              "lines": 3.74
            },
            "src/pdfviewer/pdf-base/signature-base.js": {
              "branches": 0,
              "functions": 22.22,
              "statements": 4.51,
              "lines": 4.51
            },
            "src/pdfviewer/pdf-base/bookmark-base.js": {
              "branches": 100,
              "functions": 57.14,
              "statements": 93.33,
              "lines": 93.33
            },
            "src/pdfviewer/pdf-base/image-structure.js": {
              "branches": 0,
              "functions": 18.18,
              "statements": 17.81,
              "lines": 17.81
            },
            "src/pdfviewer/pdf-base/annotation-renderer.js": {
              "branches": 0,
              "functions": 14.5,
              "statements": 4.62,
              "lines": 4.62
            },
            "src/pdfviewer/pdf-base/fontData.js": {
              "branches": 0,
              "functions": 1,
              "statements": 1,
              "lines": 1
            },
            "src/pdfviewer/organize-pdf/organize-pdf.js": {
              "branches": 0.26,
              "functions": 1.62,
              "statements": 5.48,
              "lines": 5.55
            },
            "src/pdfviewer/organize-pdf/organize-core/organize-initialization.js": {
              "branches": 0,
              "functions": 2.94,
              "statements": 10.2,
              "lines": 10.26
            },
            "src/pdfviewer/organize-pdf/organize-core/tile-interaction.js": {
              "branches": 0,
              "functions": 4.55,
              "statements": 14.95,
              "lines": 15.09
            },
            "src/pdfviewer/organize-pdf/organize-core/organize-toolbar.js": {
              "branches": 0,
              "functions": 3.33,
              "statements": 11.64,
              "lines": 11.89
            },
            "src/pdfviewer/organize-pdf/organize-core/organize-contextmenu.js": {
              "branches": 0,
              "functions": 9.09,
              "statements": 20.9,
              "lines": 20.9
            },
            "src/pdfviewer/organize-pdf/organize-core/slider-zoomaction.js": {
              "branches": 0,
              "functions": 4,
              "statements": 18.78,
              "lines": 18.78
            },
            "src/pdfviewer/organize-pdf/organize-core/organize-undoredo.js": {
              "branches": 0,
              "functions": 5.56,
              "statements": 11.01,
              "lines": 11.16
            },
            "src/pdfviewer/organize-pdf/organize-core/organizepages-editor.js": {
              "branches": 1.8,
              "functions": 2.7,
              "statements": 9.26,
              "lines": 9.47
            },
            "src/pdfviewer/organize-pdf/organize-core/organize-math-utils.js": {
              "branches": 0,
              "functions": 5,
              "statements": 16.55,
              "lines": 16.9
            },
            "src/pdfviewer/organize-pdf/organize-core/organize-saveaction.js": {
              "branches": 0,
              "functions": 12.5,
              "statements": 10.91,
              "lines": 10.91
            },
            "src/pdfviewer/organize-pdf/organize-core/organize-preview.js": {
              "branches": 0,
              "functions": 9.09,
              "statements": 9.3,
              "lines": 9.38
            },
            "src/pdfviewer/organize-pdf/organize-core/organize-utils.js": {
              "branches": 0,
              "functions": 3.33,
              "statements": 6.32,
              "lines": 6.36
            },
            "src/pdfviewer/organize-pdf/organize-core/organize-event-handler.js": {
              "branches": 0,
              "functions": 5.58,
              "statements": 15.43,
              "lines": 15.43
            },
            "src/pdfviewer/organize-pdf/organize-core/organize-thumbnail.js": {
              "branches": 0,
              "functions": 5.56,
              "statements": 3.86,
              "lines": 3.94
            },
            "src/pdfviewer/organize-pdf/organize-core/organize-undoredoutils.js": {
              "branches": 0,
              "functions": 7.14,
              "statements": 12.99,
              "lines": 13.33
            },
            "src/pdfviewer/organize-pdf/organize-core/organize-importaction.js": {
              "branches": 0,
              "functions": 6.67,
              "statements": 5.88,
              "lines": 5.88
            },
            "src/pdfviewer/organize-pdf/organize-core/organize-extract.js": {
              "branches": 0,
              "functions": 2.7,
              "statements": 5.88,
              "lines": 5.88
            }
          }
        }
      }
    }
  })
}