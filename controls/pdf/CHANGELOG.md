# Changelog

## [Unreleased]

## 28.2.11 (2025-03-11)

### PDF Parser

#### Bug Fixes

- Resolved an exception encountered while parsing the destination from the document link annotations.
- Resolved an issue with preserving the line annotation caption text in appearance when updating the measure dictionary as a custom entry.

## 28.2.9 (2025-03-04)

### PDF Parser

#### Bug Fixes

- Resolved an issue where the appearance of an existing signature field was not preserved when the flatten option was set to true.
- Resolved an issue where the appearance of an ink annotation was not preserved when using a custom ink points collection.
- Resolved an issue where the file size increased when loading and saving the document multiple times without an incremental update.

## 28.2.6 (2025-02-18)

### PDF Parser

#### Bug Fixes

- Resolved an issue with preserving the line measurement annotation in browsers when updating the measure dictionary as a custom entry.
- Resolved an issue where multiple text box fields were not preserving flattening when applying a globally initialized font.

## 28.2.5 (2025-02-11)

### PDF Parser

#### Bug Fixes

- Resolved an issue with preserving the position of the existing signature field when the flatten option is set to true.
- Resolved an issue with preserving a stamp annotation when flattened with a rotation of 270 degrees.

## 28.2.4 (2025-02-04)

### PDF Parser

#### Bug Fixes

- Resolved an exception encountered while adding a textbox field when the insert spaces property is enabled.
- Resolved an issue with form field value position changed after saving the document.

## 28.2.3 (2025-01-29)

### PDF Parser

#### Bug Fixes

- Resolved an issue with preserving the custom stamp while exporting the stamp annotation template from a PDF document.
- Resolved an issue with font details not being parsed from loaded PDF combo box fields.

## 28.1.39 (2024-01-14)

### PDF Parser

#### Bug Fixes

- Resolved an issue where the file size increases when exporting a rubber stamp annotation with an image and appearance using the XFDF format.

## 28.1.38 (2025-01-07)

### PDF Parser

#### Bug Fixes

- Resolved an issue that caused the application to crash when loading large data during the encoding process.
- Resolved an exception encountered while adding a line annotation with appearance and Unicode text when the caption is set to false.
- Resolved an issue where the file size increases when exporting a rubber stamp annotation with an image and appearance using the JSON format.

## 28.1.37 (2024-12-31)

### PDF Parser

#### Bug Fixes

- Resolved an issue with parsing annotations with appearance while export and import multiple times using the FDF format.
- Resolved an issue with preserving the popup annotation appearance during flattening.
- Resolved an issue where the text markup content entry was missing while exporting annotations using JSON and XFDF formats.

## 28.1.36 (2024-12-24)

### PDF Parser

#### Bug Fixes

- Resolved an issue with preserving radio button fields during flattening.
- Resolved the PDF document corruption issue while adding a new line annotation with appearance and rotation.

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