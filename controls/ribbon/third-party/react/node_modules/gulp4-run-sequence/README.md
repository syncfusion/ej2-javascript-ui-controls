# Drop-in replacement for `run-sequence` for `gulp 4`

[![Known Vulnerabilities][snyk-image]][snyk-url]
[![Linux Build Status][linux-image]][linux-url]
[![Mac Build Status][mac-image]][mac-url]
[![Windows Build Status][windows-image]][windows-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![License][license-image]][license-url]

Run a sequence of tasks, in the order you specify, as part of a greater task. 
(This package aims to help tasks, formerly dependent on `run-sequence` for `gulp 
3`, run in `gulp 4`.)

### Use

```javascript
const gulp = require('gulp');
const runSequence = require('gulp4-run-sequence');
const fs = require('fs');

// This will run in this order:
// * 'boil-water'
// * 'steep-tea' and 'boil-egg' concurrently
// * 'peel-egg'
// * Finally, the callback function.
gulp.task('breakfast', function (callback) {
  runSequence(
    'boil-water',
    ['steep-tea', 'boil-egg'],
    'peel-egg',
    callback
//  ^^^^^^^^
//  This informs that the sequence is complete.
  );
});

// Configure boil-water, steep-tea, boil-egg, and peel-egg as you wish,
// but make sure they return a stream or promise, or handle the callback.
// Examples:

gulp.task('boil-water', function () {
  // Return the stream from gulp.
  return gulp.src('water').pipe(...)...
});

gulp.task('boil-egg', function () {
  return new Promise(function (resolve, reject) {
    // Make sure asynchronous tasks are resolved or rejected.
  });
});

gulp.task('peel-egg', function (callback) {
  fs.readFile('egg', function (err, data) {
    // Consume data...
    callback();
//  ^^^^^^^^
//  This informs that the task is complete.
  });
});
```

### Use within `gulp` submodules

If you have a complex `gulp` setup, with your tasks split up across different 
files, `gulp4-run-sequence` might not be able to find every task, and will error 
that such tasks were never defined. In this case, you can configure 
`gulp4-run-sequence` to look at the `gulp` within the submodule, like so:

```javascript
// Explicitly declare gulp particular to your submodule.
const gulp = require('./path/to/gulp');
// Explicitly assign this gulp to gulp4-run-sequence.
const runSequence = require('gulp4-run-sequence').use(gulp);

// ...and then use normally.
gulp.task('supertask', function (callback) {
  runSequence('subtask0', 'subtask1', callback);
});
```

### Options

`errorOnInvalidArgumentType`: Set this to true in order to throw an error if an 
invalid argument type has been passed. The only valid argument types are string, 
array, and function.

Example:

```javascript
runSequence.options.errorOnInvalidArgumentType = true;

gulp.task('task', function (cb) {
  // null is neither string, array, nor function, so this will error:
  runSequence('foo', null, 'bar', cb);
});
```

The options in the `gulp 3` version of `run-sequence` no longer apply. 

`showErrorStackTrace` no longer applies because errors are handled entirely 
within the `gulp 4` stack. A good command of streams, promises, and callback 
functions will deliver the desired amount of error verbosity.

`ignoreUndefinedTasks` no longer applies because falsy arguments will either be 
skipped without warning (default behavior), or cause an error if 
`errorOnInvalidArgumentType` is set to `true`. 

### Why the culinary task names?

Computational tasks might be too abstract for visualizing sequences and 
concurrency. It's much easier to visualize steeping tea and boiling eggs 
concurrently, but only after water has come to a boil.

It might also be irresponsible to suggest running certain tasks concurrently, 
when concurrent operation would not be optimal for those tasks.

First, we need to understand what "__parallel__", "__concurrent__", and 
"__asynchrony__" mean in terms of computing.

"__Parallel__" computing refers to distributing processes across multiple 
processor cores.

"__Concurrent__" computing refers to running multiple processes in such a way, 
that they appear to be running at the same time. This can be accomplished by 
rapidly switching between the processes on one processor core.

"__Asynchrony__" refers to when a process runs outside the main execution flow, 
and the main execution might need a response. If it does, it must not block 
other processes that don't depend on the response, while it waits.

JavaScript, and Node.js in particular, are frequently referred to as being 
"single-threaded". In recent years, this has become wholly untrue. If you are 
working on production-level parallel JavaScript, firstly, kudos! Secondly, we're 
not sure why you're reading this, but thanks for checking out 
`gulp4-run-sequence`!

Now consider a procedure found in nearly every `gulp` implementation: a file 
read. It is not a good idea to read files concurrently on a single machine, even 
if it has many processor cores. We should assume the machine has a single disk 
drive, and that the drive has a single read/write head. Even if those aren't the 
case, we should assume there is only one pathway open at a given time, on which 
the data can travel from drive to memory.

Let's make a culinary analogy: Assume we need 2 liters of warm water evenly 
mixed from a cold tap and a hot tap. However, the taps are 10 meters apart. Any 
rational person would mix the water sequentially, filling a liter of cold water, 
walking the 10 meters, and filling another liter of hot water.

Trying to make this water gathering appear concurrent by filling smaller 
amounts of water at a time, and walking more, is called "thrashing" if applied 
to a disk drive!

### Acknowledgements

This package is inspired entirely by 
[`run-sequence`](https://github.com/OverZealous/run-sequence) for `gulp 3`. 
Credit and gratitude are due for 
[its contributors](https://github.com/OverZealous/run-sequence/graphs/contributors). 

#### Also recommended: [`gulp 3` with long-term support](https://github.com/electric-eloquence/gulp)

[snyk-image]: https://snyk.io/test/github/electric-eloquence/gulp4-run-sequence/master/badge.svg
[snyk-url]: https://snyk.io/test/github/electric-eloquence/gulp4-run-sequence/master

[linux-image]: https://github.com/electric-eloquence/gulp4-run-sequence/workflows/Linux%20build/badge.svg?branch=master
[linux-url]: https://github.com/electric-eloquence/gulp4-run-sequence/actions?query=workflow%3A"Linux+build"

[mac-image]: https://github.com/electric-eloquence/gulp4-run-sequence/workflows/Mac%20build/badge.svg?branch=master
[mac-url]: https://github.com/electric-eloquence/gulp4-run-sequence/actions?query=workflow%3A"Mac+build"

[windows-image]: https://github.com/electric-eloquence/gulp4-run-sequence/workflows/Windows%20build/badge.svg?branch=master
[windows-url]: https://github.com/electric-eloquence/gulp4-run-sequence/actions?query=workflow%3A"Windows+build"

[coveralls-image]: https://img.shields.io/coveralls/electric-eloquence/gulp4-run-sequence/master.svg
[coveralls-url]: https://coveralls.io/r/electric-eloquence/gulp4-run-sequence

[license-image]: https://img.shields.io/github/license/electric-eloquence/gulp4-run-sequence.svg
[license-url]: https://raw.githubusercontent.com/electric-eloquence/gulp4-run-sequence/master/LICENSE
