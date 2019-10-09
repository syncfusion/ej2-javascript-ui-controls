var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function(file) {  
  if (TEST_REGEXP.test(file)) {    
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
    allTestFiles.push(normalizedTestModule);
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  packages: [
    {
        name: '@syncfusion/ej2-base',
        location: 'node_modules/@syncfusion/ej2-base/dist',
        main: 'ej2-base.umd.min.js'
    },
    {
        name: '@syncfusion/ej2-data',
        location: 'node_modules/@syncfusion/ej2-data/dist',
        main: 'ej2-data.umd.min.js'
    },
    {
        name: '@syncfusion/ej2-popups',
        location: 'node_modules/@syncfusion/ej2-popups/dist',
        main: 'ej2-popups.umd.min.js'
    },
    {
        name: '@syncfusion/ej2-buttons',
        location: 'node_modules/@syncfusion/ej2-buttons/dist',
        main: 'ej2-buttons.umd.min.js'
    },
    {
        name: '@syncfusion/ej2-inputs',
        location: 'node_modules/@syncfusion/ej2-inputs/dist',
        main: 'ej2-inputs.umd.min.js'
    },
    {
        name: '@syncfusion/ej2-dropdowns',
        location: 'node_modules/@syncfusion/ej2-dropdowns/dist',
        main: 'ej2-dropdowns.umd.min.js'
    },
    {
        name: '@syncfusion/ej2-calendars',
        location: 'node_modules/@syncfusion/ej2-calendars/dist',
        main: 'ej2-calendars.umd.min.js'
    },
    {
        name: '@syncfusion/ej2-navigations',
        location: 'node_modules/@syncfusion/ej2-navigations/dist',
        main: 'ej2-navigations.umd.min.js'
    },
    {
        name: '@syncfusion/ej2-lists',
        location: 'node_modules/@syncfusion/ej2-lists/dist',
        main: 'ej2-lists.umd.min.js'
    },
    {
        name: '@syncfusion/ej2-splitbuttons',
        location: 'node_modules/@syncfusion/ej2-splitbuttons/dist',
        main: 'ej2-splitbuttons.umd.min.js'
    },
    {
        name: '@syncfusion/ej2-grids',
        location: 'node_modules/@syncfusion/ej2-grids/dist',
        main: 'ej2-grids.umd.min.js'
    },
    {
        name: '@syncfusion/ej2-excel-export',
        location: 'node_modules/@syncfusion/ej2-excel-export/dist',
        main: 'ej2-excel-export.umd.min.js'
    },
    {
        name: '@syncfusion/ej2-pdf-export',
        location: 'node_modules/@syncfusion/ej2-pdf-export/dist',
        main: 'ej2-pdf-export.umd.min.js'
    },
    {
        name: '@syncfusion/ej2-compression',
        location: 'node_modules/@syncfusion/ej2-compression/dist',
        main: 'ej2-compression.umd.min.js'
    },
    {
        name: '@syncfusion/ej2-file-utils',
        location: 'node_modules/@syncfusion/ej2-file-utils/dist',
        main: 'ej2-file-utils.umd.min.js'
    },
    {
        name: '@syncfusion/ej2-layouts',
        location: 'node_modules/@syncfusion/ej2-layouts/dist',
        main: 'ej2-layouts.umd.min.js'
    },
    // Include dependent packages
  ],

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start,

  // number of seconds to wait before giving up on loading a script
  waitSeconds: 30,  
});
