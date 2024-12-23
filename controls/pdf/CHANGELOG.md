# Changelog

## [Unreleased]

## 28.1.36 (2024-12-24)

### PDF Parser

#### Bug Fixes

- Resolved an issue with preserving radio button fields during flattening.

## 28.1.35 (2024-12-18)

### PDF Parser

#### Bug Fixes

- Resolved an issue with preserving images while splitting pages in a PDF document.
- Resolved an issue with retaining existing button fields when the flatten option is set to true.
- Resolved an issue with parsing comments from free-text annotations when importing multiple times using the XFDF format.
- Resolved an exception encountered while adding a newly created ink annotation to a PDF page.
- Resolved an issue with modifying the destination property of a document link annotation.
- Resolved an issue with the bounds property of an ink annotation when enable control points is set to false.
- Resolved an issue with preserving the border style of line annotations when setting appearance.

## 28.1.33 (2024-12-12)

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