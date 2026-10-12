const gulp = require('gulp');
const { execSync } = require('child_process');
const del = require('del');
var runSequence = global.runSequence = global.runSequence || require('gulp4-run-sequence');
require('@syncfusion/ej2-build-test');

/** 
 * ci-test gulp tasks
 */
gulp.task('local-test', function (done) {
    // shelljs.exec('gulp css-validation');
    // build task is added for compiling accessibility samples to generate accessibility report in ci.
    runSequence('code-leaks-analysis', 'memoryLeak-detect', 'local-pre-push', done);
});

gulp.task('local-pre-push', function (done) {
    runSequence('update-themes', 'copy-themes', 'add-config', 'styles-all', 'scripts', 'accessibility', 'spell-check-ci', 'api-diff', done);
});


// function compileSourceAndDemos(done) {
//     try {
//         execSync('npx tsc -p tsconfig.json --pretty false', { stdio: 'inherit' });
//         done();
//     } catch (error) {
//         done(error);
//     }
// }

// function cleanGeneratedFiles() {
//     return del([
//         'src/**/*.js',
//         'src/**/*.d.ts',
//         'src/**/*.js.map',
//         'demos/form-builder/**/*.js',
//         'demos/form-builder/**/*.d.ts',
//         'demos/form-builder/**/*.js.map',
//         'spec/**/*.js',
//         'spec/**/*.d.ts',
//         'spec/**/*.js.map',
//     ]);
// }

// gulp.task('clean', cleanGeneratedFiles);
// gulp.task('compile-src-and-demos', compileSourceAndDemos);
// gulp.task('build-demo', gulp.series('clean', 'compile-src-and-demos'));