# ent <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

Encode and decode HTML entities

# example

``` js
var ent = require('ent');
console.log(ent.encode('<span>©moo</span>'))
console.log(ent.decode('&pi; &amp; &rho;'));
```

```
&#60;span&#62;&#169;moo&#60;/span&#62;
π & ρ
```

![ent](https://web.archive.org/web/20170823120015if_/http://substack.net/images/ent.png)

# methods

``` js
var ent = require('ent');
var encode = require('ent/encode');
var decode = require('ent/decode');
```

## encode(str, opts={})

Escape unsafe characters in `str` with html entities.

By default, entities are encoded with numeric decimal codes.

If `opts.numeric` is false or `opts.named` is true, encoding will used named
codes like `&pi;`.

If `opts.special` is set to an Object, the key names will be forced
to be encoded (defaults to forcing: `<>'"&`). For example:

``` js
console.log(encode('hello', { special: { l: true } }));
```

```
he&#108;&#108;o
```

## decode(str)

Convert html entities in `str` back to raw text.

# credits

HTML entity tables are from the official
[`entities.json`](https://html.spec.whatwg.org/entities.json) file for
the [whatwg HTML
specification](https://html.spec.whatwg.org/multipage/syntax.html#named-character-references).

# install

With [npm](https://npmjs.org) do:

```
npm install ent
```

# license

MIT

[package-url]: https://npmjs.org/package/ent
[npm-version-svg]: https://versionbadg.es/ljharb/ent.svg
[deps-svg]: https://david-dm.org/ljharb/ent.svg
[deps-url]: https://david-dm.org/ljharb/ent
[dev-deps-svg]: https://david-dm.org/ljharb/ent/dev-status.svg
[dev-deps-url]: https://david-dm.org/ljharb/ent#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/ent.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/ent.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/ent.svg
[downloads-url]: https://npm-stat.com/charts.html?package=ent
[codecov-image]: https://codecov.io/gh/ljharb/ent/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/ljharb/ent/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/ljharb/ent
[actions-url]: https://github.com/ljharb/ent/actions
