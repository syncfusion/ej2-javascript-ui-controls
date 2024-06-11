# rollup-plugin-uglify-es [![Travis Build Status][travis-img]][travis]

[travis-img]: https://travis-ci.org/ezekielchentnik/rollup-plugin-uglify-es.svg
[travis]: https://travis-ci.org/ezekielchentnik/rollup-plugin-uglify-es

[Rollup](https://github.com/rollup/rollup) plugin to minify generated bundle.

## Install

```sh
npm i rollup-plugin-uglify-es -D
```

## Usage

```js
import { rollup } from 'rollup';
import uglify from 'rollup-plugin-uglify-es';

rollup({
	entry: 'main.js',
	plugins: [
		uglify()
	]
});
```

## Options

```js
uglify(options)
```

`options` – default: `{}`, type: `object`. [UglifyJS API options](https://github.com/mishoo/UglifyJS2)

## Thanks
Thanks to TrySound for [rollup-plugin-uglify](https://github.com/TrySound/rollup-plugin-uglify)

# License

MIT © [Ezekiel Chentnik](mailto:me@ezekielchentnik.com)
