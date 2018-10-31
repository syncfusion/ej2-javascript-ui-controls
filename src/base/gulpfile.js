'use strict';

var gulp = require('gulp');

/**
 * Build ts and scss files
 */
gulp.task('build', ['scripts', 'styles']);

/**
 * Compile ts files
 */
gulp.task('scripts', function(done) {
    var ts = require('gulp-typescript');
    var tsProject = ts.createProject('tsconfig.json', { typescript: require('typescript') });

    var tsResult = gulp.src(['./**/*.ts','./**/*.tsx', '!./node_modules/**/*.ts','!./node_modules/**/*.tsx'], { base: '.' })
        .pipe(tsProject());
    tsResult.js.pipe(gulp.dest('./'))
        .on('end', function() {
            done();
        });
});

/**
 * Compile styles
 */
gulp.task('styles', function() {
    var sass = require('gulp-sass');
    return gulp.src(['./**/*.scss', '!./node_modules/**/*.scss'], { base: './' })
        .pipe(sass({
            outputStyle: 'expanded',
            includePaths: './node_modules/@syncfusion/'
        }))
        .pipe(gulp.dest('.'));
});

/* jshint strict: false */
/* jshint undef: false */

var service, proxyPort;

/**
 * Run test scripts
 */
gulp.task('test', function(done) {
    var path = require('path');
    var packageJson = require('./package.json');
    if (packageJson.dependencies['@syncfusion/ej2-data'] || packageJson.name === '@syncfusion/ej2-data') {
        console.log('Service Started');
        var spawn = require('child_process').spawn;
        service = spawn('node', [path.join(__dirname, '/spec/services/V4service.js')]);

        service.stdout.on('data', (data) => {
            proxyPort = data.toString().trim();
            console.log('Proxy port: ' + proxyPort);
            startKarma(done);
        });
    } else {
        startKarma(done);
    }
});

function startKarma(done) {
    var karma = require('karma');
    return new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true,
        browsers: ['ChromeHeadless']
    }, function(e) {
        if (service) {
            service.kill();
        }
        if (e === 1) {
            console.log('Karma has exited with ' + e);
            process.exit(e);
        } else {
            done();
        }
    }).start();
}