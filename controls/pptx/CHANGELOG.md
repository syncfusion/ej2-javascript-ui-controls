# Changelog

## [Unreleased]

## 35.2.13 (2026-11-24)

### PowerPoint

#### Bug Fixes

- Enhanced Table, Notes, and Chart APIs for add, edit and remove functions.

#### Features

- Added Sections support in the JavaScript PowerPoint library, enabling developers to create, retrieve, rename, reorder, and remove presentation sections, as well as assign slides to sections.
- Added support to Find and FindAll operations, enabling precise text segment identification and providing the foundation for advanced text editing features such as Replace and Highlight.
- Provided support for Highlight color font property.

## 35.2.12 (2026-11-18)

### PowerPoint

#### Bug Fixes

- Resolved chart series data formula corruption issue that occurred while adding a series in existing chart element.
- Added synchronous support for chart feature integration, enabling chart processing without asynchronous workflow.
- Introduced collection APIs for Table, Image, and Chart elements, allowing users to retrieve and process these presentation objects from loaded PowerPoint documents.
- Improved chart handling by enabling chart creation from Excel-based data sources, ensuring accurate chart generation from workbook content.

#### Features

- Added licensing watermark support, ensuring appropriate licensing validation and watermark rendering in applicable scenarios.

## 35.1.46 (2026-11-11)

### PowerPoint

#### Bug Fixes

- Resolved chart series data formula corruption issue that occurred while adding a series in existing chart element.

#### Features

- Provided Hyperlink support such as Webpage link, File link, Email or another Slide as target in JavaScript PowerPoint library.
- Added PowerPoint section support: create, rename, reorder, and remove sections, assign slides, and round-trip `p14:sectionLst`.
- Added List support including Numbered, Bulleted, Picture, and Multilevel List types.

## 35.1.43

### PowerPoint

#### Bug Fixes

- Resolved addTable and addChart API functions for adding table and chart elements in EJ2 PowerPoint Library

#### Features

- Add slides, set slide size, and place shapes on layouts and masters while keeping existing shape IDs stable.
- Create tables and insert or remove rows, columns, and cells with editable cell text.
- Create new PowerPoint presentations with 11 pre-defined Layout slides.
- Modify fonts, alignment, underline, strike, caps and add or remove paragraphs and text parts.
- Add and format shapes, images, tables, charts, and hyperlinks to generate professional-quality PPTX documents.
- Added support for built-in document properties, including details such as Title, Author, Subject, and Keywords, which help identify the document's topic and content.
- Added support for custom document properties, enabling users to define and manage custom metadata for documents.
- Added support for creating charts in PowerPoint presentations.
- Added support for modifying chart elements such as Chart Area, Plot Area, Data Points, Axes, Legend, Title, and Data Labels in PowerPoint presentations.
- Implemented PowerPoint Notes support in the EJ2 PowerPoint Library.
- Added Built-in Table Styles support for tables in the EJ2 PowerPoint Library.

### Gradient fills

- Add gradient parsing, symbolic theme inheritance, authoring and package preservation APIs for supported backgrounds, shapes, text, groups and tables.
- Transport canonical table-cell text/style and active text-color context through worker snapshots without resolving source colors back into XML.
- Keep chart/diagram platform limitations and Strict SDK/profile qualification explicit; no full optional-module publication claim.

## 35.1.37

### PowerPoint

#### Features

Introducing the new JavaScript PowerPoint Library, a lightweight solution for creating, editing, and saving PowerPoint presentations entirely within client-side browser environments. Here are its key features.

- Create PowerPoint presentations programmatically using an intuitive object model for better control and maintainability.
- Load existing PowerPoint files, update content, and save changes without Microsoft PowerPoint installed.
- Add and customize text boxes and images, with comprehensive support for text styling and font formatting.