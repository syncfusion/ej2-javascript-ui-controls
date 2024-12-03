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
      name: '@syncfusion/ej2-buttons',
      location: 'node_modules/@syncfusion/ej2-buttons/dist',
      main: 'ej2-buttons.umd.min.js'
    },
    { 
      name: '@syncfusion/ej2-popups',
      location: 'node_modules/@syncfusion/ej2-popups/dist',
      main: 'ej2-popups.umd.min.js'
    },
    { 
      name: '@syncfusion/ej2-splitbuttons',
      location: 'node_modules/@syncfusion/ej2-splitbuttons/dist',
      main: 'ej2-splitbuttons.umd.min.js'      
    }
    // Include dependent packages
  ],

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start,

  // number of seconds to wait before giving up on loading a script
  waitSeconds: 30,  
});
