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