# Changelog

## [Unreleased]

## 35.2.13 (2026-11-24)

### Excel

#### Bug Fixes

- Resolve an issue where eval('require') Node fallbacks trigger Vite/Rollup build warnings

## 35.2.12 (2026-11-18)

### Excel

#### Features

- Added trial watermarking to unlicensed workbook saves, including an Evaluation Warning sheet and worksheet marks, while leaving licensed saves unchanged.
- Added Image.placeInCell to place images within cells and persist them across save/load cycles.

#### Bug Fixes

- Fixed duplicate worksheet relationship IDs when saving and reopening sheets containing an external hyperlink and a chart or image.
- Fixed shape import to preserve dimensions, theme-resolved styling, rotation, alt text, and rich text.

## 35.1.46 (2026-11-11)

### Excel

#### Features

- Added support for custom document properties API design and specification for XLSX workbooks.
- Added chart types: Filled Map, Histogram, High-Low-Close, Open-High-Low-Close, Volume-High-Low-Close, Volume-Open-High-Low-Close, Wireframe 3-D Surface, Contour, Wireframe Contour, Radar, Radar with Markers, Filled Radar, Clustered Column - Line and Clustered Column - Line on Secondary Axis, with per-series `serieType`/`usePrimaryAxis` and secondary axis APIs.

#### Bug Fixes

- Resolved an issue where two-cell pictures and charts were loaded with incorrect dimensions when custom row heights or column widths were used.
- Resolved an issue where Excel repaired worksheets and removed print area settings when saving workbooks containing page setup and header/footer configurations.
- Resolved an issue where setting Cell.numberFormat removed existing font, fill, and border formatting from styled cells.
- Fixed module resolution issues when consuming EJ2 XLSX in Node.js ESM environments.

## 35.1.43 (2026-11-03)

### Excel

#### Features
- Added support for password-based XLSX encryption and decryption, including opening, saving, preserving, and removing workbook file-level passwords.
- Improved XLSX file handling by using the Syncfusion compression library for workbook open and save operations.


#### Bug Fixes

- Resolved a corruption issue caused by orphaned drawing relationships in worksheets.
- Resolved a workbook corruption issue caused by duplicate relationship IDs.
- Resolved an issue where opening threaded comments were not preserved in the worksheet comments part.
- Resolved an issue where unpaired x14 icon set conditional formats were not loaded into the conditionalFormats collection.
- Fixed an issue where hidden rows and formatted columns were excluded from the worksheet used range.
- Resolved an issue where row-level styles were not applied to cells without an explicit cell style.
- Resolved an issue where column-level styles were not applied to cells without an explicit cell style.
- Fixed incorrect RGB color resolution for Excel theme-based fonts, fills, and borders.


## 35.1.42 (2026-10-27)

### Excel

#### Features

- Added `usedRange`, `lastRow`, and `lastColumn` properties on `Worksheet`.
- Added `selectedRange` API on `Worksheet` (returns A1 address strings).
- Added `textIndent` CSS-compatible pixel property on `Alignment` and automatic number format locale stripping.
- Added `isLocked`, `rowSpan`, and `colSpan` convenience properties on `Cell`.
- Added custom conditions and date groups support on auto filter columns.
- Added `Worksheet.getRowStyle()` method to retrieve row fill colors and styling information.
- Added support for column and row hide, stored unhide size, column lock, and explicit row height APIs.
- Added hash preservation to sheet protection to maintain password-protected sheets during load-modify-save cycles.

#### Bug Fixes

- Resolved an issue where column and row number formats were not applied to cells without explicit style records.


## 35.1.41 (2026-10-21)

### Excel

#### Features

- Added workbook encryption and decryption: `Workbook.passwordToOpen` encrypts the saved file (AES-256, SHA-512 Agile encryption), and `Workbook.open(data, password)` opens password-protected files (Agile and Standard encryption).
- Added a standard row height API (`Worksheet` sheet format default row height).
- Added `left` and `top` placement APIs for charts.
- Added `topLeftCell` and `paneTopLeftCell` APIs for worksheet views.
- Added support for sorting within auto filters.
- Added support for the extended conditional formatting icon sets (`3Stars`, `3Triangles`, `5Boxes`).
- Added resolved RGB color (`rgbColor`) for font and fill colors on `Cell.style`.
- Exposed chart host APIs for internal consumption.

#### Bug Fixes

- Resolved an issue where classic notes were not distinguished from threaded-comment placeholders in `Worksheet` comments.
- Resolved an issue where built-in number formats were not resolved correctly.
- Resolved an issue where image anchor offsets (`colOffEmu` and `rowOffEmu`) were not returned for image placement.
- Resolved issues in the public API exports and documentation checks in the package index.

## 35.1.39 (2026-10-07)

### Excel

#### Features

Introducing the new JavaScript Excel Library, a lightweight solution for creating, editing, and saving Excel documents entirely within client-side browser environments. Here are its key features.

* Create Excel workbooks programmatically using an intuitive object model for better control and maintainability.
* Load existing XLSX workbooks, update content, and save changes without requiring Microsoft Excel to be installed.
* Create and manage worksheets, named ranges, document properties, and frozen panes.
* Work with cell values including strings, numbers, dates, formulas, and Boolean values. Merge and unmerge cells, add hyperlinks, apply rich text formatting, and manage comments.
* Customize cell styles and conditional formatting. Create and edit text boxes, AutoShapes, and images.
* Create tables and charts, and use sorting and filtering to organize and analyze data effectively.
* Apply data validation rules and protect worksheets and workbooks to maintain data integrity and security.
* Create and manage form controls to build interactive and user-friendly spreadsheet solutions.


