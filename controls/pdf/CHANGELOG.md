# Changelog

## [Unreleased]

## 31.2.4 (2025-10-28)

### PDF Parser

#### Bug Fixes

- Addressed an issue related to parsing the visibility property of layers in a specific PDF document.
- Fixed a script error encountered during the import of a PDF document when the group form fields option was enabled.
- Corrected the functionality where the stamp icon was not preserved during the second save operation.
- Handled a script error that occurred while parsing font information from a text box field in a particular PDF document.

## 31.2.2 (2025-10-15)

### PDF Parser

#### Bug Fixes

- Fixed the issue where the signature appearance was not preserved after flattening a specific PDF document.
- Resolved an issue where a script error was thrown while updating the layer's visible property.
- Fixed an issue where the custom template of a stamp annotation was not preserved when it was created multiple times.

## 31.1.23 (2025-10-07)

### PDF Parser

#### Bug Fixes

- Resolved an issue where redaction annotation with bounds collection were not preserved correctly.

## 31.1.22 (2025-10-01)

### PDF Parser

#### Bug Fixes

- Fixed an issue where unsupported characters caused a font parsing error in a PDF form field.

## 31.1.20 (2025-09-10)

### PDF Parser

#### Bug Fixes

- Fixed the performance lag while retrieving font from form fields in a specific PDF document.

## 31.1.19 (2025-09-11)

### PDF Parser

#### Bug Fixes

- Fixed incorrect template sizing while exporting the stamp annotation appearance from a specific PDF document.

## 31.1.18 (2025-09-10)

### PDF Parser

#### Bug Fixes

- Resolved bookmark destination page index parsing issue in specific PDF documents.
- Fixed incorrect retrieval of form field font from a specific PDF document.
- Resolved issue causing loss of signature appearance after flattening certain PDF documents.
- Fixed a script error that occurred while retrieving the destination from a specific PDF document.

## 31.1.17 (2025-09-05)

### PDF Parser

#### Key Features

The Essential JavaScript PDF library is a feature-rich, high-performance, non-UI PDF library written natively in JavaScript. Here are its key features.

- The ability to load and save existing PDF documents.
- Easily load and manipulate secured PDF documents.
- Enhance existing PDF files by adding graphical elements such as text, images, shapes, and more.
- The addition and manipulation of interactive elements, such as annotations and form fields.
- Flatten form fields and annotations.
- Import and export form fields and annotations.
- The ability to parse existing bookmarks.