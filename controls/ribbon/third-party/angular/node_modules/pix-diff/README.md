Pix-Diff
==========

A lightweight protractor plugin for image comparison

[![dependencies Status](https://david-dm.org/koola/pix-diff.svg)](https://david-dm.org/koola/pix-diff)
[![Build Status](https://travis-ci.org/koola/pix-diff.svg)](https://travis-ci.org/koola/pix-diff)
[![Sauce Test Status](https://saucelabs.com/buildstatus/pixdiff)](https://saucelabs.com/u/pixdiff)
[![npm version](https://badge.fury.io/js/pix-diff.svg)](https://www.npmjs.com/package/pix-diff)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/pixdiff.svg)](https://saucelabs.com/u/pixdiff)

## What can it do?

*Pix-Diff* is a lightweight Protractor plugin for image comparisons on (mobile/desktop) browsers and hybrid app screens or screen regions.

You can:

- Compare screens / regions against a baseline
- Pass-through any non-default Pixel-diff options
- Seamlessly compare desktop and mobile screens

Comparisons are based on [Pixel-Diff](https://github.com/koola/pixel-diff)

## Installation

Install this module locally with the following command:
```shell
npm install pix-diff
```

Save to dependencies or dev-dependencies:
```shell
npm install --save pix-diff
npm install --save-dev pix-diff
```

## Usage
*Pix-Diff* can be used for:

- Desktop browsers (Chrome / Firefox / Safari / Internet Explorer 11 / Microsoft Edge)
- Mobile browsers (Chrome / Safari on simulators / real devices) via Appium

Refer to [docs](./docs/) for [conventions](./docs/conventions.md) and examples.

## Tests

- `npm test`: Execute jshint, unit and local tests.

#### Local
- `npm test -- local`: Run all tests on a local machine with
Chrome and Firefox.

Be sure to first run `npm run wd-update` to update the webdriver at least once
after install.

#### Sauce Labs
- `npm test -- saucelabs`: This command is used to test the build on [Travis-ci](https://travis-ci.org/koola/pix-diff/). It runs a variety of desktop
 and mobile browser Continuous Integration tests.

## Contributing

See the [contributing guide](./docs/contributing.md) for more information.
In lieu of a formal style guide, take care to maintain the existing coding style.
Add tests for any new or changed functionality. Lint and test your code using
`npm test -- build`

## TODO

- [ ] Enable FF after [#4253](https://github.com/angular/protractor/issues/4253) is fixed

## License

Licensed under the MIT license.

Copyright (c) 2017 Koola.
