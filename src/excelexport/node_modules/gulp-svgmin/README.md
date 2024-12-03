# gulp-svgmin

[![Build Status](https://travis-ci.org/ben-eb/gulp-svgmin.svg?branch=master)][travis-status]
[![NPM version](https://badge.fury.io/js/gulp-svgmin.svg)][npm-status]
[![Dependency Status](https://david-dm.org/ben-eb/gulp-svgmin.svg)][deps-status]

> A [Gulp][gulp-url] plugin to minify SVG files with [svgo-url].

*If you have any difficulties with the output of this plugin, please use the [SVGO tracker][svgo-bugs].*


## Install

With [npm][npm-url] do:

```
npm install gulp-svgmin
```

## Example

```js
import { src, dest } from 'gulp';
import svgmin from 'gulp-svgmin';

const defaultTask = () =>
  src('logo.svg')
    .pipe(svgmin())
    .pipe(dest('./out'));

export default defaultTask;
```

## Configuration file

By default, `gulp-svgmin` loads options from a `svgo.config.js` file in your project. See the [svgo’s configuration docs][svgo-config] for more info on how to write one.

You can control which directory `svgo` searches for `svgo.config.js` with the `cwd` option. Or you can use a different file name with the `configFile` option.

```js
import { src, dest } from 'gulp';
import svgmin from 'gulp-svgmin';

const defaultTask = () =>
  src('logo.svg')
    .pipe(svgmin({
      // Specify an absolute directory path to
      // search for the config file.
      cwd: '/users/admin/project/assets',
      // This path is relative to process.cwd()
      // or the 'cwd' option.
      configFile: 'images/svg/config.js',
    }))
    .pipe(dest('./out'));

export default defaultTask;
```

## Options

Instead of using a config file, you can pass an object of svgo’s options to the `gulp-svgmin` plugin. You will need to provide the config in comma separated objects, like the example below.

```js
const defaultTask = () =>
  src('logo.svg')
    .pipe(svgmin({
      // Ensures the best optimization.
      multipass: true,
      js2svg: {
        // Beutifies the SVG output instead of
        // stripping all white space.
        pretty: true,
        indent: 2,
      },
      // Alter the default list of plugins.
      plugins: [
        // You can enable a plugin with just its name.
        'sortAttrs',
        {
          name: 'removeViewBox',
          // Disable a plugin by setting active to false.
          active: false,
        },
        {
          name: 'cleanupIDs',
          // Add plugin options.
          params: {
            minify: true,
          }
        },
      ],
    }))
    .pipe(dest('./out'));
```

You can view the [full list of plugins here][svgo-plugins].

By default, the plugins list given to the gulp plugin will alter the default list of svgo plugins. Optionally, you can specify your plugins and set the `full` flag to `true` to indicate that your plugins list should not be merged with the default list of plugins.

```js
const defaultTask = () =>
  src('logo.svg')
    .pipe(svgmin({
      multipass: true,
      // The plugins list is the full list of plugins
      // to use. The default list is ignored.
      full: true,
      plugins: [
        'removeDoctype',
        'removeComments',
        'sortAttrs',
        // ...
      ],
    }))
    .pipe(dest('./out'));
```

## Per-file options

To have per-file options, pass a function, that receives `file` object and
returns `svgo` options. For example, if you need to prefix ids with filenames
to make them unique before combining svgs with [gulp-svgstore][gulp-svgostore]:

```js
const defaultTask = () =>
  src('src/*.svg')
    .pipe(svgmin(function getOptions(file) {
      const prefix = path.basename(
        file.relative,
        path.extname(file.relative)
      );
      return {
        plugins: [
          {
            name: 'cleanupIDs',
            parmas: {
              prefix: prefix + '-',
              minify: true,
            },
          },
        ],
      };
    }))
    .pipe(svgstore())
    .pipe(dest('./dest'));
```

## Contributing

Pull requests are welcome. If you add functionality, then please add unit tests to cover it.

## License

MIT © [Ben Briggs](https://beneb.info)


[travis-status]:    https://travis-ci.org/ben-eb/gulp-svgmin
[deps-status]:      https://david-dm.org/ben-eb/gulp-svgmin
[npm-status]:       https://badge.fury.io/js/gulp-svgmin
[npm-url]:          https://npmjs.org/package/gulp-svgmin
[gulp-url]:         https://github.com/gulpjs/gulp
[gulp-svgostore]:   https://github.com/w0rm/gulp-svgstore
[svgo-url]:         https://github.com/svg/svgo
[svgo-bugs]:        https://github.com/svg/svgo/issues
[svgo-config]:      https://github.com/svg/svgo#configuration
[svgo-plugins]:     https://github.com/svg/svgo#built-in-plugins
