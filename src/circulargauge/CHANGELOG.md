<!-- markdownlint-disable MD004 -->

# Changelog

## [Unreleased]

## 16.3.17 (2018-09-12)

### CircularGauge

#### Breaking Changes

- The circular gauge tooltip has been replaced with `EJ2 SVG Tooltip`, so now it is mandatory to include `ej2-svg-base.umd.min.js` in system.js configuration if you are using system.js module loader. Update the system.js configuration while using this version and above.

## 16.2.41 (2018-06-25)

### CircularGauge

#### Bug Fixes

- Provided one way binding support for Axes properties in Angular platform.

## 16.1.24

### Common

#### Breaking Changes

- Changed the Angular component directive prefix as `ejs-[ComponentName]`.

#### New Features

- High contrast theme support.

## 15.4.27-preview (2018-01-30)

### CircularGauge

#### Bug Fixes

 • Provided ranges startWidth and endWidth percentage support.

## 15.4.23-preview (2017-12-27)

### Common

#### New Features

• Added typing file for ES5 global scripts (dist/global/index.d.ts)

#### Breaking Changes

• Modified the module bundle file name for ES6 bundling

## 15.4.17-preview (2017-11-13)

### CircularGauge

Circular Gauge component is ideal to visualize numeric values over a circular scale. The elements
of the gauge  that are pointer, pointer cap, axis, ticks, labels, and annotation can be easily
customized.

* **Ranges** - Supports for highlighting the range values in the gauge scale.
* **Axis** - Supports to render multiple axis in the gauge.
* **Pointers** - Supports to add multiple pointers to the gauge (RangeBar, Needle, Marker, and Image).
* **Annotation** - Supports to add custom elements to the gauge by using annotation.
* **Animation** - Supports animation for the pointer.
* **Custom Label** - Supports the addition of custom label text in the required location of the gauge.
* **User Interaction** - Supports interactive features like tooltip and pointer drag and drop.
