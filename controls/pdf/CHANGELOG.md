# Changelog

## [Unreleased]

## 29.1.35 (2025-04-01)

### PDF Parser

#### Bug Fixes

- Resolved an issue where the author text was not preserved in the custom measure dictionary when exporting annotations in JSON format.
- Resolved an exception that occurred when parsing bookmark properties after destroying one document instance and loading another.
- Resolved an issue with retrieving the true type font from a loaded text box field in a specific PDF document.
- Resolved an issue with retrieving the true type font from a loaded text box field when it does not have an appearance stream.
- Fixed an issue where the border effect of shape annotations was not retrieved correctly when parsing a PDF document.
- Fixed an exception that occurred when exporting annotations in XFDF format in certain PDF documents.
- Fixed an exception that occurred when importing annotations in JSON format in a specific PDF document.
- Fixed an exception that occurred when parsing the destination of a document link annotation in a specific PDF document.
- Resolved an exception that occurs when importing annotations in FDF format.
- Resolved a corruption issue while drawing PNG images in a specific PDF document.

## 29.1.33 (2025-03-25)

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