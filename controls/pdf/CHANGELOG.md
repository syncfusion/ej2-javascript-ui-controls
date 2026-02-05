# Changelog

## [Unreleased]

## 32.2.3 (2026-02-05)

### PDF

#### Bug Fixes

- Resolved an issue where incorrect padding was applied to stamp icons in rubber stamp annotations.

## 32.1.24 (2026-01-20)

### PDF

#### Bug Fixes

- Fixed missing word spacing when adding a stamp icon to rubber stamp annotations.
- Fixed incorrect case conversion of allowed interactions when exporting annotations to XFDF.

## 32.1.23 (2026-01-13)

### PDF

#### Bug Fixes

- Fixed an issue where line measurement annotations with leader lines were not being preserved correctly.
- Fixed an issue where ink annotations were not preserved when importing a page range into a new PDF document.
- Resolved an issue with rendering RTL text when using embedded fonts.
- Fixed an issue where the combo box field was incorrectly highlighted during form filling and flattening.

## 32.1.21 (2025-12-30)

### PDF

#### Bug Fixes

- Fixed an issue where radio button field were not visible in adobe acrobat.

## 32.1.20 (2025-12-23)

### PDF

#### Bug Fixes

- Fixed an exception that occurred when splitting a specific PDF.
- Fixed an issue where stamp annotations were lost after saving the document multiple times.
- Fixed a bad font error that appeared when incremental updates were disabled for a particular PDF.
- Fixed a script error that occurred while importing a page range into a new PDF.
- Fixed an issue where free text annotation appearance was not preserved during flattening.
- Fixed an issue where redaction annotations with overlay text were not preserved correctly on rotated pages.
- Fixed an issue where form fields were not visible in adobe acrobat while importing a page range into a new PDF.

## 32.1.19 (2025-12-16)

### PDF

#### Key Features

- Added support to add, parse and update the document properties in the PDF document.
- PDF library now supports digital signatures. This feature enables users to securely sign PDF documents, ensuring authenticity and integrity. Digital signatures provide a trusted way to verify the signer's identity and protect against unauthorized changes. Users can create and apply signatures directly within the library, delivering a streamlined and reliable workflow for handling signed documents.

#### Breaking Changes

Improved API architecture to ensure type safety and maintainability.

Replaced inline object literals and primitive arrays with strongly typed classes:

| Types        | Description                                                                                           |
|--------------|-------------------------------------------------------------------------------------------------------|
| Rectangle    | Represents a bounding box with `x`, `y`, `width`, and `height` values for position and size.          |
| PdfColor     | Encapsulates color data with properties `r`, `g`, `b`, and an optional `isTransparent` flag.          |
| Point        | Represents a coordinate with `x` and `y` values, providing a clear abstraction for location data.     |
| Size         | Represents dimensions with `width` and `height` values, offering improved clarity and expressiveness. |

#### Bug Fixes

- Fixed an issue where font properties were not correctly retrieved from free text annotations.
- Fixed an issue where multiline overlay text in redaction annotation was not preserved correctly.
- Fixed an issue where bookmark destination was not preserved properly.

## 31.2.15 (2025-11-25)

### PDF

#### Bug Fixes

- Resolved a script error that occurred during PDF document parsing when a null value was provided as the password.

## 31.2.5 (2025-11-04)

### PDF

#### Bug Fixes

- Fixed an issue where the unit of the line measurement annotation was not correctly preserved when updating its text content.
- Resolved an issue where custom stamp annotations were not properly preserved when updating their rotation angle.

## 31.2.4 (2025-10-28)

### PDF

#### Bug Fixes

- Addressed an issue related to parsing the visibility property of layers in a specific PDF document.
- Fixed a script error encountered during the import of a PDF document when the group form fields option was enabled.
- Corrected the functionality where the stamp icon was not preserved during the second save operation.
- Handled a script error that occurred while parsing font information from a text box field in a particular PDF document.

## 31.2.2 (2025-10-15)

### PDF

#### Bug Fixes

- Fixed the issue where the signature appearance was not preserved after flattening a specific PDF document.
- Resolved an issue where a script error was thrown while updating the layer's visible property.
- Fixed an issue where the custom template of a stamp annotation was not preserved when it was created multiple times.

## 31.1.23 (2025-10-07)

### PDF

#### Bug Fixes

- Resolved an issue where redaction annotation with bounds collection were not preserved correctly.

## 31.1.22 (2025-10-01)

### PDF

#### Bug Fixes

- Fixed an issue where unsupported characters caused a font parsing error in a PDF form field.

## 31.1.20 (2025-09-10)

### PDF

#### Bug Fixes

- Fixed the performance lag while retrieving font from form fields in a specific PDF document.

## 31.1.19 (2025-09-11)

### PDF

#### Bug Fixes

- Fixed incorrect template sizing while exporting the stamp annotation appearance from a specific PDF document.

## 31.1.18 (2025-09-10)

### PDF

#### Bug Fixes

- Resolved bookmark destination page index parsing issue in specific PDF documents.
- Fixed incorrect retrieval of form field font from a specific PDF document.
- Resolved issue causing loss of signature appearance after flattening certain PDF documents.
- Fixed a script error that occurred while retrieving the destination from a specific PDF document.

## 31.1.17 (2025-09-05)

### PDF

#### Bug Fixes

- Fixed incorrect template sizing while exporting the stamp annotation appearance from a specific PDF document.

## 30.2.7 (2025-08-26)

### PDF

#### Bug Fixes

- Fixed performance lag while parsing pages from a specific PDF document.
- Resolved an issue with parsing radio button list item value from a specific PDF document.

## 30.2.5 (2025-08-13)

### PDF

#### Bug Fixes

- Fixed performance lag during PNG image rendering.

## 30.1.42 (2025-07-29)

### PDF

#### Bug Fixes

- Fixed an issue where form fields are not parsed from particular PDF document.
- Fixed an issue where the appearance template size was incorrect when a stamp annotation was rotated.

## 30.1.40 (2025-07-15)

### PDF

#### Bug Fixes

- Fixed an issue where a pop up annotation was not removed from the annotation collection.
- Fixed an issue with preserving annotations during import from a JSON file.

## 30.1.39 (2025-07-08)

### PDF

#### Bug Fixes

- Fixed an issue where the rotation angle was not retrieved correctly from the loaded textbox field.
- Fixed an issue where a script error was thrown while parsing the form from a specific PDF document.

## 30.1.38 (2025-07-02)

### PDF

#### Bug Fixes

- Fixed an issue where new page was not added to an encrypted PDF document.
- Fixed an issue where annotation was not added to an encrypted PDF document.
- Fixed an issue where form fields are not parsed from particular PDF document.
- Fixed an issue memory out of range occurred while drawing a JPEG image on the PDF page graphics.
- Fixed an issue where the text was not preserved in page graphics with an OTF font.

## 29.2.11 (2025-06-17)

### PDF

#### Bug Fixes

- Fixed an issue where rotation angle was not retrieved properly from text box field.
- Resolved an issue with the annotation count while parsing from a PDF page.

## 29.2.10 (2025-06-10)

### PDF

#### Bug Fixes

- Fixed an issue where the selected index of a combo box field was not visible in Chrome PDF viewer.
- Fixed an issue where annotation comments and review history were not cleared after deleting the annotation.
- Fixed incorrect parsing of radio button item values.
- Fixed an issue with saving dashed borders on button fields in their appearance.
- Fixed the appearance preservation issue with button field rotation.
- Fixed the issue where the page was undefined while parsing a form field.

## 29.2.8 (2025-06-03)

### PDF

#### Bug Fixes

- Fixed an issue where existing stamp is not properly preserved when flatten was enabled.
- Fixed an issue where font is not parsed properly from an existing combo box field of particular document.
- Resolved an issue with preserving page content while flattening the signature field.
- Resolved an issue with the annotation count while parsing from a PDF page.
- Resolved an issue with preserving the text box field when the multiline property is set to true.

## 29.2.7 (2025-05-27)

### PDF

#### Bug Fixes

- Fixed an issue where Font is not parsed from default appearance from an existing list box field.

## 29.2.5 (2025-05-21)

### PDF

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

### PDF

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

### PDF

#### Bug Fixes

- Fixed an issue where accessing the destination of a document link annotation returned undefined.
- Fixed an issue where poly line annotation was not preserved properly with rotation.
- Fixed an issue that caused incorrect retrieval of font size from text box field items.
- Fixed an issue where the pop up icon displayed incorrectly when flattening was enabled.
- Fixed an issue where free text annotations were not preserved correctly when flattening was enabled.
- Fixed an issue where adding form fields increased the file size and corrupted the document structure.

## 29.1.40 (2025-04-29)

### PDF

#### Bug Fixes

- Fixed an issue where the opacity was not preserved in newly added rubber stamp annotation.
- Fixed an issue preserving ink annotation bounds when flattening was enabled.
- Resolved an issue where the font size was not being retrieved properly from form fields in a specific PDF document.
- Resolved an exception that occurs when importing annotations in FDF format in certain PDF documents.
- Resolved an issue where true type font is not retrieved properly from the free text annotation font property.
- Resolved the issue with preserving the line ending style of free text annotations while removing and adding the annotation.
- Fixed an issue with Unicode text in true type fonts not preserving in stamp annotation XFDF import and export.
- Resolved the content security policy error encountered while parsing the free text annotation.
- Resolved a corruption issue that occurred when the incremental update property was set to false.

## 29.1.38 (2025-04-15)

### PDF

#### Bug Fixes

- Resolved an exception that occurs when importing annotations in FDF format.
- Fixed an exception that occurred when exporting annotations in XFDF format in certain PDF documents.
- Fixed an exception that occurred when exporting annotations in XFDF format in a specific PDF document.
- Resolved the null reference issue encountered while parsing the destination of document link annotations.
- Resolved the performance issue while rendering the image in PDF page.

#### Features

- The PDF now supports template creation and drawing on graphics. This enhancement enables PDF resource optimization while drawing text, images, and graphical content.

## 29.1.37 (2025-04-08)

### PDF

#### Bug Fixes

- Resolved an issue where form fields were not retrieved properly from a specific PDF document.
- Resolved an issue where annotations with reviews created in EJ2 PDF appeared as a pop up icon in safari and fire fox browsers on mac.
- Resolved an exception that occurs while saving the imported annotation in FDF format.
- Resolved an issue with preserving the appearance of the beginning and ending line styles in poly line annotations.
- Resolved an issue where stamp annotations were not preserved during export and import with Unicode text in true type fonts.

## 29.1.35 (2025-04-01)

### PDF

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

## 28.2.11 (2025-03-11)

### PDF

#### Bug Fixes

- Resolved an exception encountered while parsing the destination from the document link annotations.
- Resolved an issue with preserving the line annotation caption text in appearance when updating the measure dictionary as a custom entry.

## 28.2.9 (2025-03-04)

### PDF

#### Bug Fixes

- Resolved an issue where the appearance of an existing signature field was not preserved when the flatten option was set to true.
- Resolved an issue where the appearance of an ink annotation was not preserved when using a custom ink points collection.
- Resolved an issue where the file size increased when loading and saving the document multiple times without an incremental update.

## 28.2.6 (2025-02-18)

### PDF

#### Bug Fixes

- Resolved an issue with preserving the line measurement annotation in browsers when updating the measure dictionary as a custom entry.
- Resolved an issue where multiple text box fields were not preserving flattening when applying a globally initialized font.

## 28.2.5 (2025-02-11)

### PDF

#### Bug Fixes

- Resolved an issue with preserving the position of the existing signature field when the flatten option is set to true.
- Resolved an issue with preserving a stamp annotation when flattened with a rotation of 270 degrees.

## 28.2.4 (2025-02-04)

### PDF

#### Bug Fixes

- Resolved an exception encountered while adding a textbox field when the insert spaces property is enabled.
- Resolved an issue with form field value position changed after saving the document.

## 28.2.3 (2025-01-29)

### PDF

#### Bug Fixes

- Resolved an issue with preserving the custom stamp while exporting the stamp annotation template from a PDF document.
- Resolved an issue with font details not being parsed from loaded PDF combo box fields.

## 28.1.39 (2024-01-14)

### PDF

#### Bug Fixes

- Resolved an issue where the file size increases when exporting a rubber stamp annotation with an image and appearance using the XFDF format.

## 28.1.38 (2025-01-07)

### PDF

#### Bug Fixes

- Resolved an issue that caused the application to crash when loading large data during the encoding process.
- Resolved an exception encountered while adding a line annotation with appearance and Unicode text when the caption is set to false.
- Resolved an issue where the file size increases when exporting a rubber stamp annotation with an image and appearance using the JSON format.

## 28.1.37 (2024-12-31)

### PDF

#### Bug Fixes

- Resolved an issue with parsing annotations with appearance while export and import multiple times using the FDF format.
- Resolved an issue with preserving the popup annotation appearance during flattening.
- Resolved an issue where the text markup content entry was missing while exporting annotations using JSON and XFDF formats.

## 28.1.36 (2024-12-24)

### PDF

#### Bug Fixes

- Resolved an issue with preserving radio button fields during flattening.
- Resolved the PDF document corruption issue while adding a new line annotation with appearance and rotation.

## 28.1.35 (2024-12-18)

### PDF

#### Bug Fixes

- Resolved an issue with preserving images while splitting pages in a PDF document.
- Resolved an issue with retaining existing button fields when the flatten option is set to true.
- Resolved an issue with parsing comments from free-text annotations when importing multiple times using the XFDF format.
- Resolved an exception encountered while adding a newly created ink annotation to a PDF page.
- Resolved an issue with modifying the destination property of a document link annotation.
- Resolved an issue with the bounds property of an ink annotation when enable control points is set to false.
- Resolved an issue with preserving the border style of line annotations when setting appearance.

## 28.1.33 (2024-12-12)

### PDF

#### Bug Fixes

- Resolved an issue with preserving new line annotations without appearance.

## 27.2.5 (2024-12-03)

### PDF

#### Bug Fixes

- Resolved an issue with preserving existing rubber stamp annotation when flatten is set to true.
- Resolved an issue with preserving the contents of free text annotations during export and import annotations in JSON format.
- Resolved an issue with preserving the appearance of polygon annotations during export and import annotations in JSON format.
- Resolved an issue with preserving the appearance of a textbox field during flattening when a maximum length is specified.
- Resolved an issue with preserving line annotation creation with appearance during flatten.
- Resolved the issue with the improper tab order functionality when arranging form fields in the tab order of a widget PDF document.
- Resolved an issue with preserving existing highlight annotations when the flatten option is set to true.
- Resolved an issue with preserving bold and italic font styles in free text annotations using true type fonts.
- Resolved an issue with parsing comments from free text annotations when importing multiple times in JSON format.

## 27.2.3 (2024-11-21)

### PDF

#### Bug Fixes

- Resolved an issue with the bounds property during the creation and JSON export of text markup annotations.
- Resolved the issue with preserving the PNG image while drawing in page graphics.
- Resolved the issue of page rotation being incorrectly preserved when importing pages multiple times.
- Resolved an issue with preserving redaction annotation appearance when using justified text alignment.

## 27.2.2 (2024-11-15)

### PDF

#### Bug Fixes

- Resolved the issue with preserving the justified text alignment of free text annotations.

## 27.1.58 (2024-11-05)

### PDF

#### Bug Fixes

- Resolved the issue with preserving font size for the selected item in the combo box field.
- Resolved the issue of preserving the appearance of the text markup annotation.
- Resolved the issue with preserving combo box and list box fields with various field rotations.
- Resolved the issue of preserving the transparent inner colour of line annotations.
- Resolved the issue of preserving text alignment and word wrapping in the text box field.
- Resolved the issue of preserving the appearance of line and line measurement annotations during rotation.

## 27.1.57 (2024-10-29)

### PDF

#### Bug Fixes

- Resolved the preservation issue while filling a check box form field in a PDF document.
- Resolved the issue with font name preservation when drawing text using a true type font.
- Resolved the issue with an undefined value while parsing the destination from the document link annotation.
- Resolved an exception encountered while parsing the destination from the document link annotation.
- Resolved an issue with text parsing from a text box field in a PDF document.

## 27.1.56 (2024-10-23)

### PDF

#### Bug Fixes

- Resolved the preservation issue in existing rubber stamp annotation when updating the rotation flatten.
- Resolved an exception encountered while drawing a text with true type font without using string format.

## 27.1.55 (2024-10-22)

### PDF

#### Bug Fixes

- Resolved the issue with retrieving annotation comments from a PDF document.

## 27.1.53 (2024-10-15)

### PDF

#### Bug Fixes

- Resolved the preservation issue in line measurement annotation when dashed border style applied.
- Resolved an undefined exception encountered while adding a line annotation to a PDF document.

## 27.1.52 (2024-10-08)

### PDF

#### Bug Fixes

- Resolved the issue of a blank page appearing when adding a stamp annotation to a PDF document.

## 27.1.51 (2024-09-30)

### PDF

#### Bug Fixes

- Resolved the image preservation issue in the custom appearance of the rubber stamp annotation when rotated to 270 degrees.

## 27.1.50 (2024-09-24)

### PDF

#### Bug Fixes

- Resolved an exception encountered while importing pages from a PDF document.
- Resolved the preservation issue in free text annotation when rotation applied.
- Resolved the preservation issue in line annotation when different border styles applied.
- Resolved the undefined issue while parsing the destination from the document link annotation.

## 26.2.14 (2024-09-10)

### PDF

#### Bug Fixes

- Resolved the font style parsing issue from PDF free text annotation.
- Resolved the appearance preservation issues when adding a text box field with the insert spaces option.

## 26.2.13 (2024-09-05)

### PDF

#### Bug Fixes

- Resolved the page size parsing issue in the PDF with the crop box.

## 26.2.12 (2024-09-03)

### PDF

#### Bug Fixes

- Resolved an issue with parsing destinations from PDF bookmarks.
- Resolved the font style parsing issue from PDF free text annotation.

## 26.2.10 (2024-08-20)

### PDF

#### Bug Fixes

- Resolved an exception encountered while export and import PDF form as JSON data.

## 26.2.8 (2024-08-06)

### PDF

#### Bug Fixes

- Resolved the undefined issue while parsing the destination from the document link annotation.
- Resolved the image preservation issues when importing PDF pages from an encrypted PDF document.

## 26.2.4 (2024-07-24)

### PDF

#### Bug Fixes

- Resolved an issue with the appearance preservation of free text annotations with a negative value.

## 26.1.42 (2024-07-16)

### PDF

#### Bug Fixes

- Resolved the text rendering mode preservation issue while drawing text with pen and brush.
- Resolved issue with calculating path points for ink and free text annotations in PDFs that have a negative value in the crop box.

## 26.1.41 (2024-07-09)

### PDF

#### Bug Fixes

- Resolved the issue with newly added annotations preservation in PDFs that have a negative value in the crop box.

## 26.1.40 (2024-07-02)

### PDF

#### Bug Fixes

- Resolved the ink annotation preservation issue when saving the PDF document multiple times.
- Resolved the text box field preservation issue when adding Unicode text with a true type font.
- Resolved the form field preservation issue when filling data and saving with a cross reference stream type.

## 26.1.39 (2024-06-25)

### PDF

#### Bug Fixes

- The destination entry preservation issue in link annotations has been resolved with the support for duplicate pages.
- Resolved an exception encountered while export annotations as JSON data.
- Resolved the preservation issue while exporting the rubber stamp annotation appearance template.
- Resolved the appearance preservation issue when adding custom text to the form fields.
- Resolved the subject preservation issue when adding new rubber stamp annotations.
- Resolved the tab order preservation issue when adding a tab index to newly created form fields.

## 26.1.38 (2024-06-19)

### PDF

#### Bug Fixes

- Resolved an exception encountered while duplicating PDF pages with form fields.

## 25.2.6 (2024-05-28)

### PDF

#### Bug Fixes

- Resolved an issue with the preservation of transparent border in PDF form fields.

## 25.1.42 (2024-04-30)

### PDF

#### Bug Fixes

- Resolved the Unicode text preservation issues in a text box form field.

## 25.1.41 (2024-04-23)

### PDF

#### Bug Fixes

- Resolved the PNG image preservation issue while export rubber stamp annotation appearance template.

## 25.1.40 (2024-04-16)

### PDF

#### Bug Fixes

- Resolved the form field preservation issues in a large PDF documents.

## 25.1.39 (2024-04-09)

### PDF

#### Bug Fixes

- Resolved an exception encountered while parsing the removed page destination from the document link annotation.
- Resolved an exception encountered while filling the text box field.
- Resolved an exception encountered while exporting the rubber stamp annotation appearance template.
- The options parsing issue in the list box field have been resolved.

## 25.1.38 (2024-04-02)

### PDF

#### Bug Fixes

- Resolved an exception encountered while removing all pages from PDF document.
- The issues related to the preservation of square measurement annotation have been resolved.
- Resolved the document corruption issues in the encrypted PDF document.
- Resolved the PNG image preservation issue while export rubber stamp annotation appearance template.

## 25.1.35 (2024-03-15)

### PDF

#### Bug Fixes

- Resolved an exception encountered while importing annotations from JSON file with custom data.

## 24.2.8 (2024-02-27)

### PDF

#### Bug Fixes

- The script error thrown while parsing the PDF document has been resolved.

## 24.2.7 (2024-02-20)

### PDF

#### Bug Fixes

- Resolved an exception encountered while importing annotations from JSON file with custom data.

## 24.2.5 (2024-02-13)

### PDF

#### Bug Fixes

- Resolved an exception during form field reordering.
- Resolved an exception encountered while parsing destination from document link annotation.

## 24.1.47 (2024-01-23)

### PDF

#### Bug Fixes

- The issues related to the preservation of transparent background colour in form fields and free text annotation have been resolved.

## 24.1.44 (2024-01-03)

### PDF

#### Bug Fixes

- Appearance preservation issues in custom stamp annotation import and export have been resolved.
- Resolved the exception encountered during the negative number value set to leader extension property of line annotations.

## 23.2.6 (2023-11-28)

### PDF

#### Bug Fixes

- Resolved the undefined exception encountered during the continuous reloading of PDF documents with ink annotation.

## 23.2.4 (2023-11-20)

### PDF

#### Bug Fixes

- Resolved the null reference exception encountered during the parsing of PDF documents.

## 23.1.44 (2023-11-07)

### PDF

#### Bug Fixes

- Preservation issues in PDF annotation import and export have been resolved.

## 23.1.39 (2023-10-04)

### PDF

#### Bug Fixes

- Resolved an issue with invalid cross reference stream exception thrown while parsing particular encrypted PDF document.

## 23.1.38 (2023-09-26)

### PDF

#### Bug Fixes

- Preservation issues in PDF annotation has been resolved.
- Preservation issues in JPEG image drawing has been resolved.
- Preservation issues in PDF Form fields appearance has been resolved.
- Preservation issues in PDF annotation comments has been resolved.

## 23.1.36 (2023-09-15)

### PDF

#### Key Features

The Essential JavaScript PDF library is a feature-rich, high-performance, non-UI PDF library written natively in JavaScript. Here are its key features.

- The ability to load and save existing PDF documents.
- Easily load and manipulate secured PDF documents.
- Enhance existing PDF files by adding graphical elements such as text, images, shapes, and more.
- The addition and manipulation of interactive elements, such as annotations and form fields.
- Flatten form fields and annotations.
- Import and export form fields and annotations.
- The ability to parse existing bookmarks.