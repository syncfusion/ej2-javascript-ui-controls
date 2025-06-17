# Changelog

## [Unreleased]

## 29.2.11 (2025-06-17)

### PDF Parser

#### Bug Fixes

- Fixed an issue where rotation angle was not retrieved properly from text box field.
- Resolved an issue with the annotation count while parsing from a PDF page.

## 29.2.10 (2025-06-10)

### PDF Parser

#### Bug Fixes

- Fixed an issue where the selected index of a combo box field was not visible in Chrome PDF viewer.
- Fixed an issue where annotation comments and review history were not cleared after deleting the annotation.
- Fixed incorrect parsing of radio button item values.
- Fixed an issue with saving dashed borders on button fields in their appearance.
- Fixed the appearance preservation issue with button field rotation.
- Fixed the issue where the page was undefined while parsing a form field.

## 29.2.8 (2025-06-03)

### PDF Parser

#### Bug Fixes

- Fixed an issue where existing stamp is not properly preserved when flatten was enabled.
- Fixed an issue where font is not parsed properly from an existing combo box field of particular document.
- Resolved an issue with preserving page content while flattening the signature field.
- Resolved an issue with the annotation count while parsing from a PDF page.
- Resolved an issue with preserving the text box field when the multiline property is set to true.

## 29.2.7 (2025-05-27)

### PDF Parser

#### Bug Fixes

- Fixed an issue where Font is not parsed from default appearance from an existing list box field.

## 29.2.5 (2025-05-21)

### PDF Parser

#### Bug Fixes

- Fixed an issue where line annotation border style is not preserved properly.
- Fixed an issue where undefined exception thrown while accessing destination page of child bookmarks.
- Fixed an issue where image is not preserved in appearance of the rubber stamp annotation while export and import annotation as FDF format.
- Fixed an issue where documents get corrupted while export and import annotations in FDF format.
- Fixed an issue where annotation leader lines were not preserved in free text annotations.
- Resolved the performance issue while rendering the string using true type font.
- Fixed an issue where the caret annotation was not preserved while importing in XFDF format.
- Fixed an issue where the bounds were not preserved correctly in the line annotation.
- Fixed an issue where the rotation was not preserved correctly in the rubber stamp annotation template.
- Fixed annotation visibility issue during JSON export and import with appearance.
- Fixed incorrect line ending style for free text call out annotations.

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
- Fixed an issue where the border style was not preserved correctly in ellipse annotations.

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
