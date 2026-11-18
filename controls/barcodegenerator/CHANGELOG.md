# Changelog

## [Unreleased]

## 35.1.40 (2026-10-13)

### Barcode

#### Features

- Added the `PDF417Generator` component for rendering PDF417 barcodes (ISO/IEC 15438), including Compact PDF417.
    - Automatic Text, Numeric and Byte compaction, or a fixed mode through `compactionMode`. Non-ASCII values are encoded as UTF-8 with an ECI designator.
    - Error correction levels 0-8 through `errorCorrectionLevel`, defaulting to the level recommended for the data length.
    - Row height relative to the module width through `rowHeightRatio` (minimum 3, as required by ISO/IEC 15438).
    - Rows (3-90) and columns (1-30) are calculated automatically to give the largest module size that fits the component, or can be set through `rows` and `columns`.
    - SVG and Canvas rendering, `foreColor`, `backgroundColor`, `margin`, `displayText`, image export, localization and `role`/`aria-label` attributes.
    - The `invalid` event reports invalid values, rows, columns, error correction levels, sizes and values that exceed the symbol capacity.

### Barcode

#### Bug Fixes

- `#I877780` - Fixed QR code scanning failures caused by incorrect error correction codeword generation.

## 32.1.19 (2025-12-16)

### Barcode

#### Bug Fixes

- `#I508544` - Now, the DataMatrix barcode is rendered properly with alphanumeric values.

## 19.1.63 (2021-05-13)

### Barcode

#### Bug Fixes

- `#316606` - "Text alignment was not proper with UPCA type barcode" issue has been fixed.

## 19.1.56 (2021-04-13)

### Barcode

#### Bug Fixes

- `#316606` - "Text alignment was not proper with UPCA type barcode" issue has been fixed.

## 18.4.30 (2020-12-17)

### Barcode

#### Bug Fixes

- `#278404` - "Ean-13 barcode not rendering" issue has been fixed.

## 18.3.35 (2020-10-01)

### Barcode

#### Bug Fixes

- `#278404` - "Ean-13 barcode not rendering" issue has been fixed.

## 18.1.43 (2020-04-07)

### Barcode

#### Bug Fixes

- `#278404` - "Ean-13 barcode not rendering" issue has been fixed.

### Barcode

#### Bug Fixes

- `#278404` - "Ean-13 barcode not rendering" issue has been fixed.

### Barcode

#### Bug Fixes

- `#269847` - "Barcode control is not rendering in MVC" issue has been fixed.

## 17.4.51 (2020-02-25)

### Barcode

#### Bug Fixes

- `#264414` - The issue "QR code is not rendered based on center bounds" has been fixed.

## 17.4.49 (2020-02-11)

### Barcode

#### Bug Fixes

- `#262067` - The issue "Unable to decode qrcode for some values" has been fixed.
- `#262067` - The issue "DOM ID for the SVG and div element are same" has been fixed.

## 17.4.46 (2020-01-30)

### Barcode

#### Bug Fixes

- `F150725` - The issue "Barcode Control hasn't rendered in IE11 browser" has been fixed.

## 17.2.28-beta (2019-06-27)

### Barcode

The Syncfusion Essential JS Barcode widget enables rendering of one dimension and two dimension barcodes in the web page. Barcode provides you a simple and inexpensive method of encoding text information that can be easily read by electronic readers

- Supports 2 two-dimensional barcodes such as QR and DataMatrix barcodes.