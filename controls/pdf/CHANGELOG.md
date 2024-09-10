# Changelog

## [Unreleased]

## 26.2.14 (2024-09-10)

### PDF Parser

#### Bug Fixes

- Resolved the font style parsing issue from PDF free text annotation.
- Resolved the appearance preservation issues when adding a text box field with the insert spaces option.

## 26.2.13 (2024-09-05)

### PDF Parser

#### Bug Fixes

- Resolved the page size parsing issue in the PDF with the crop box.

## 26.2.12 (2024-09-03)

### PDF Parser

#### Bug Fixes

- Resolved an issue with parsing destinations from PDF bookmarks.
- Resolved the font style parsing issue from PDF free text annotation.

## 26.2.10 (2024-08-20)

### PDF Parser

#### Bug Fixes

- Resolved an exception encountered while export and import PDF form as JSON data.

## 26.2.8 (2024-08-06)

### PDF Parser

#### Bug Fixes

- Resolved the undefined issue while parsing the destination from the document link annotation.
- Resolved the image preservation issues when importing PDF pages from an encrypted PDF document.

## 26.2.4 (2024-07-24)

### PDF Parser

#### Bug Fixes

- Resolved an issue with the appearance preservation of free text annotations with a negative value.

## 26.1.42 (2024-07-16)

### PDF Parser

#### Bug Fixes

- Resolved the text rendering mode preservation issue while drawing text with pen and brush.
- Resolved issue with calculating path points for ink and free text annotations in PDFs that have a negative value in the crop box.

## 26.1.41 (2024-07-09)

### PDF Parser

#### Bug Fixes

- Resolved the issue with newly added annotations preservation in PDFs that have a negative value in the crop box.

## 26.1.40 (2024-07-02)

### PDF Parser

#### Bug Fixes

- Resolved the ink annotation preservation issue when saving the PDF document multiple times.
- Resolved the text box field preservation issue when adding Unicode text with a true type font.
- Resolved the form field preservation issue when filling data and saving with a cross reference stream type.

## 26.1.39 (2024-06-25)

### PDF Parser

#### Bug Fixes

- The destination entry preservation issue in link annotations has been resolved with the support for duplicate pages.
- Resolved an exception encountered while export annotations as JSON data.
- Resolved the preservation issue while exporting the rubber stamp annotation appearance template.
- Resolved the appearance preservation issue when adding custom text to the form fields.
- Resolved the subject preservation issue when adding new rubber stamp annotations.
- Resolved the tab order preservation issue when adding a tab index to newly created form fields.

## 26.1.38 (2024-06-19)

### PDF Parser

#### Bug Fixes

- Resolved an exception encountered while duplicating PDF pages with form fields.

## 26.1.35 (2024-06-11)

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
