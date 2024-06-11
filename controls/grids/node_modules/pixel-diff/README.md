Pixel-Diff
==========

A lightweight image comparison tool

[![dependencies Status](https://david-dm.org/koola/pixel-diff.svg)](https://david-dm.org/koola/pixel-diff)
[![Build Status](https://travis-ci.org/koola/pixel-diff.svg)](https://travis-ci.org/koola/pixel-diff)
[![npm version](https://badge.fury.io/js/pixel-diff.svg)](https://www.npmjs.com/package/pixel-diff)

## What can it do?

*Pixel-Diff* was initially created to compare screenshots and continue the work of [BlinkDiff](https://github.com/yahoo/blink-diff).

There are three types of image comparisons:

- Pixel-by-pixel - Used to compare low-frequency images like screenshots from web-sites, making sure that small styling differences trigger.
- Perceptual - Used to compare image creation applications, for example rendering engines and photo manipulation applications that are taking the human perception into account, ignoring differences a human probably would not see.
- Context - Used to see if parts of images are missing or are severely distorted, but accepts smaller and/or perceptual differences.


## Installation

Install this module locally with the following command:
```shell
npm install pixel-diff
```

Save to dependencies or dev-dependencies:
```shell
npm install --save pixel-diff
npm install --save-dev pixel-diff
```

## Usage

```javascript
let diff = new PixelDiff({
    imageAPath: 'path/to/first/image',
    imageBPath: 'path/to/second/image',

    thresholdType: BlinkDiff.THRESHOLD_PERCENT,
    threshold: 0.01, // 1% threshold

    imageOutputPath: 'path/to/output/image'
});

diff.run((error, result) => {
   if (error) {
      throw error;
   } else {
      console.log(diff.hasPassed(result.code) ? 'Passed' : 'Failed');
      console.log('Found ' + result.differences + ' differences.');
   }
});
```

Refer to [docs](./docs/) for more  [examples](./docs/examples.md).

## Tests

Run the tests with the following commands:

`npm test` or `npm test -- unit`

The code-coverage will be written to the coverage folder in the module root.

## Contributing

See the [contributing guide](./docs/contributing.md) for more information.
In lieu of a formal style guide, take care to maintain the existing coding style.
Add tests for any new or changed functionality. Lint and test your code using
`npm test`

## License

Licensed under the MIT license.

Copyright (c) 2016 Koola.
