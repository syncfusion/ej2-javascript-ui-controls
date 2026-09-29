// Karma configuration
// Generated on Tue Apr 26 2016 09:56:05 GMT+0530 (India Standard Time)

var path = require('path');
var __dirname = __dirname || path.resolve('./');

module.exports = function (config) {

    // Enable coverage automatically in CI and when the workflow explicitly passes coverage args.
    var isCoverage = process.argv.some(function (arg) {
        return arg.toLowerCase().indexOf('coverage') !== -1;
    }) || (process.env && (
        process.env.CI === 'true' ||
        process.env.CI === '1' ||
        process.env.COVERAGE === 'true' ||
        process.env.COVERAGE === '1' ||
        !!process.env.CI
    ));

    var webpackRules = [
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }
    ];

    // Add coverage instrumentation only for coverage run
    if (isCoverage) {
        webpackRules.push({
            test: /\.js$/,
            use: {
                loader: 'istanbul-instrumenter-loader'
            },
            enforce: 'post',
            include: path.resolve(__dirname, 'src'),
            exclude: /node_modules|spec/
        });
    }


    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            "node_modules/@syncfusion/ej2-base/styles/material.css",
            { pattern: "spec/**/**.spec.js", watched: true }
        ],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        preprocessors: {
            'spec/**/*.js': ['webpack']
        },

        webpack: {
            mode: 'development',
            resolve: {
                extensions: ['.js', '.ts', '.cjs'],
                symlinks: true,
                alias: {
                    '@syncfusion/ej2-base':
                        __dirname +
                        '/node_modules/@syncfusion/ej2-base/dist/ej2-base.umd.min.js'
                }
            },
            module: {
                rules: webpackRules
            },
            devtool: isCoverage ? false : 'inline-source-map',
            performance: {
                hints: false
            }
        },

        webpackMiddleware: {
            stats: 'minimal',
            noInfo: true
        },

        // Coverage reporter only when needed
        reporters: isCoverage
            ? ['dots', 'html', 'coverage']
            : ['dots', 'html'],

        htmlReporter: {
            outputFile: "test-report/units.html",
            pageTitle: "Unit Tests",
            subPageTitle: "Asampleprojectdescription"
        },

        coverageReporter: {
            dir: 'coverage/',
            reporters: [
                { type: 'html', subdir: 'html' },
                { type: 'text-summary' },
                { type: 'lcovonly', subdir: '.', file: 'lcov.info' }
            ],
            check: {
                each: {
                    statements: 90,
                    branches: 90,
                    functions: 100,
                    lines: 90
                }
            }
        },

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: !isCoverage,

        browsers: isCoverage ? ['ChromeHeadless'] : ['ChromeHeadless', 'Chrome'],

        singleRun: isCoverage,

        concurrency: isCoverage ? 1 : Infinity,

        failOnEmptyTestSuite: false
    });
};