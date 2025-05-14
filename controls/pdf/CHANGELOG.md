# Changelog

## [Unreleased]

## 29.2.4 (2025-05-14)

### PDF Parser

#### Bug Fixes

- Fixed line annotation captions not showing correctly when creating appearances.
- Fixed rotated rectangle annotations not appearing correctly.
- Fixed rotated polygon annotations not appearing correctly.
- Fixed line measurement annotations not showing properly when flattening was used.
- Fixed text markup annotations not keeping their correct position when creating appearances.
- Fixed an issue where the subject was not retrieved as expected in free text annotations.
- Fixed an issue where the border style was not preserved correctly in circle annotations.

## 29.1.41 (2025-05-06)

### PDF Parser

#### Bug Fixes

- Fixed an issue where accessing the destination of a document link annotation returned undefined.
- Fixed an issue where poly line annotation was not preserved properly with rotation.
- Fixed an issue that caused incorrect retrieval of font size from text box field items.
- Fixed an issue where the pop up icon displayed incorrectly when flattening was enabled.
- Fixed an issue where free text annotations were not preserved correctly when flattening was enabled.
- Fixed an issue where adding form fields increased the file size and corrupted the document structure.

## 29.1.40 (2025-04-29)

### PDF Parser

#### Bug Fixes

- Fixed an issue where the opacity was not preserved in newly added rubber stamp annotation.
- Fixed an issue preserving ink annotation bounds when flattening was enabled.

### PDF Parser

#### Bug Fixes

- Resolved an issue where the font size was not being retrieved properly from form fields in a specific PDF document.
- Resolved an exception that occurs when importing annotations in FDF format in certain PDF documents.
- Resolved an issue where true type font is not retrieved properly from the free text annotation font property.
- Resolved the issue with preserving the line ending style of free text annotations while removing and adding the annotation.
- Fixed an issue with Unicode text in true type fonts not preserving in stamp annotation XFDF import and export.
- Resolved the content security policy error encountered while parsing the free text annotation.
- Resolved a corruption issue that occurred when the incremental update property was set to false.

## 29.1.38 (2025-04-15)

### PDF Parser

#### Bug Fixes

- Resolved an exception that occurs when importing annotations in FDF format.
- Fixed an exception that occurred when exporting annotations in XFDF format in certain PDF documents.
- Fixed an exception that occurred when exporting annotations in XFDF format in a specific PDF document.
- Resolved the null reference issue encountered while parsing the destination of document link annotations.
- Resolved the performance issue while rendering the image in PDF page.

#### Features

- The PDF now supports template creation and drawing on graphics. This enhancement enables PDF resource optimization while drawing text, images, and graphical content.

## 29.1.37 (2025-04-08)

### PDF Parser

#### Bug Fixes

- Resolved an issue where form fields were not retrieved properly from a specific PDF document.
- Resolved an issue where annotations with reviews created in EJ2 PDF appeared as a pop up icon in safari and fire fox browsers on mac.
- Resolved an exception that occurs while saving the imported annotation in FDF format.
- Resolved an issue with preserving the appearance of the beginning and ending line styles in poly line annotations.
- Resolved an issue where stamp annotations were not preserved during export and import with Unicode text in true type fonts.

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
- Resolved a pdf corruption issue when saving a second time after adding a new highlight.

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
