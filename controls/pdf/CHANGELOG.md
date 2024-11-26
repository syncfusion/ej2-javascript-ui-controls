# Changelog

## [Unreleased]

## 27.2.4 (2024-11-26)

### PDF Parser

#### Bug Fixes

- Resolved an issue with the bounds property during the creation and JSON export of text markup annotations.
- Resolved the issue with preserving the PNG image while drawing in page graphics.
- Resolved the issue of page rotation being incorrectly preserved when importing pages multiple times.
- Resolved an issue with preserving redaction annotation appearance when using justified text alignment.

## 27.2.2 (2024-11-15)

### PDF Parser

#### Bug Fixes

- Resolved the issue with preserving the justified text alignment of free text annotations.

## 27.1.58 (2024-11-05)

### PDF Parser

#### Bug Fixes

- Resolved the issue with preserving font size for the selected item in the combo box field.
- Resolved the issue of preserving the appearance of the text markup annotation.
- Resolved the issue with preserving combo box and list box fields with various field rotations.
- Resolved the issue of preserving the transparent inner colour of line annotations.
- Resolved the issue of preserving text alignment and word wrapping in the text box field.
- Resolved the issue of preserving the appearance of line and line measurement annotations during rotation.

## 27.1.57 (2024-10-29)

### PDF Parser

#### Bug Fixes

- Resolved the preservation issue while filling a check box form field in a PDF document.
- Resolved the issue with font name preservation when drawing text using a true type font.
- Resolved the issue with an undefined value while parsing the destination from the document link annotation.
- Resolved an exception encountered while parsing the destination from the document link annotation.
- Resolved an issue with text parsing from a text box field in a PDF document.

## 27.1.56 (2024-10-23)

### PDF Parser

#### Bug Fixes

- Resolved the preservation issue in existing rubber stamp annotation when updating the rotation flatten.
- Resolved an exception encountered while drawing a text with true type font without using string format.

## 27.1.55 (2024-10-22)

### PDF Parser

#### Bug Fixes

- Resolved the issue with retrieving annotation comments from a PDF document.

## 27.1.53 (2024-10-15)

### PDF Parser

#### Bug Fixes

- Resolved the preservation issue in line measurement annotation when dashed border style applied.
- Resolved an undefined exception encountered while adding a line annotation to a PDF document.

## 27.1.52 (2024-10-08)

### PDF Parser

#### Bug Fixes

- Resolved the issue of a blank page appearing when adding a stamp annotation to a PDF document.

## 27.1.51 (2024-09-30)

### PDF Parser

#### Bug Fixes

- Resolved the image preservation issue in the custom appearance of the rubber stamp annotation when rotated to 270 degrees.

## 27.1.50 (2024-09-24)

### PDF Parser

#### Bug Fixes

- Resolved an exception encountered while importing pages from a PDF document.
- Resolved the preservation issue in free text annotation when rotation applied.
- Resolved the preservation issue in line annotation when different border styles applied.
- Resolved the undefined issue while parsing the destination from the document link annotation.

## 27.1.48 (2024-09-18)

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