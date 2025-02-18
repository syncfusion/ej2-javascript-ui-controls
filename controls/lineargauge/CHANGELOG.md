<!-- markdownlint-disable MD010 -->

<!-- markdownlint-disable MD030 -->

<!-- markdownlint-disable MD004 -->

# Changelog

## [Unreleased]

## 18.3.47 (2020-11-05)

### LinearGauge

#### New Features

- `#285386` - `edgeLabelPlacement` property is exposed to handle the collision of first and last label with other axis labels.

## 18.3.35 (2020-10-01)

### LinearGauge

#### New Features

- `#289346` - A property `allowMargin` is exposed to render the gauge with space around the axis.

#### Bug Fixes

- Tooltip will now work properly in the Firefox browser.

## 18.2.44 (2020-07-07)

### LinearGauge

#### New Features

- The gradient color support for the ranges and the pointers is now available in the linear gauge.

#### Bug Fixes

- `#F154895` - The position of the tooltip will now be rendered properly when placed inside a HTML element.

## 17.2.28-beta (2019-06-27)

### LinearGauge

#### New Features

- In the `setAnnotationValue` method, an option has been provided for setting annotation based on `axisValue`.

## 17.1.48 (2019-05-21)

### LinearGauge

#### Bug Fixes

- `#I235628` - The issue with "Resizing web browser broken in Linear Gauge rendering" has been resolved.

## 17.1.38 (2019-03-29)

### LinearGauge

#### New Features

- In 'setAnnotationValue' method, an option has been provided to set the position of annotation based on axis value.

#### Bug Fixes

- The dynamically updating support has been provided to the 'Axes' API of linear gauge.

## 16.4.46 (2019-01-08)

### LinearGauge

#### Bug Fixes

- When hovering over pointer, the console error will not be thrown.

## 16.3.32 (2018-11-13)

### LinearGauge

#### Bug Fixes

- Linear gauge is rendering properly now, even if the id is not specified for the div element.

## 16.3.17 (2018-09-12)

### LinearGauge

#### Breaking Changes

- The linear gauge tooltip has been replaced with `EJ2 SVG Tooltip`, so now it is mandatory to include `ej2-svg-base.umd.min.js` in system.js configuration if you are using system.js module loader. Update the system.js configuration while using this version and above.

## 16.1.24 (2018-02-22)

### Common

#### Breaking Changes

- Changed the Angular component directive prefix as `ejs-[ComponentName]`.

#### New Features

- High contrast theme support.

## 15.4.23-preview (2017-12-27)

### Common

#### New Features

•	Added typing file for ES5 global scripts (dist/global/index.d.ts)

#### Breaking Changes

•	Modified the module bundle file name for ES6 bundling

## 15.4.17-preview (2017-11-13)

### LinearGauge

Linear Gauge component is used to visualize the numerical values of an axis in linear manner. All linear gauge elements are rendered by using Scalable Vector Graphics (SVG).

- **Pointers** - Supports to add multiple pointers to the gauge (Marker and Bar).
- **Ranges** - Supports to highlight desired range values in the gauge axis.
- **Annotation** - Supports to add custom elements in the desired location of the gauge.
- **User Interaction** - Supports interactive features like tooltip and pointer drag and drop.
- **Animation** - Supports animation for the pointer.
