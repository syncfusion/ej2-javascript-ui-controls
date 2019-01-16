# Changelog

## [Unreleased]

## 16.4.46 (2019-01-08)

### Document Editor

#### New Features

- Table editing performance optimized.

## 16.4.45 (2019-01-02)

### Document Editor

#### Bug Fixes

- Table border is rendered properly.

## 16.4.44 (2018-12-24)

### Document Editor

#### Bug Fixes

- Tab stop now layout properly in header and footer.
- Empty header and footer now layout properly.
- Table column span values are now updated properly.

## 16.4.40-beta (2018-12-10)

### Document Editor

#### New Features

- Added support for Right-to-left flow direction in control.
- Added support for table auto fit layout.
- Added Document Editor Container component for toolbar and properties pane.

## 16.3.33 (2018-11-20)

### Document Editor

#### Bug Fixes

- Updated Readme and GitHub URL.

## 16.3.29 (2018-10-31)

### Document Editor

#### New Features

- Added support for input method editor.

#### Bug Fixes

- Images are now displayed properly.

## 16.3.24 (2018-10-09)

### Document Editor

#### Bug Fixes

- Resizing table columns are working properly for merged cells.

## 16.3.23 (2018-10-03)

### Document Editor

#### New Features

- Added `created` and `destroyed` events in `DocumentEditor`.

## 16.3.21 (2018-09-22)

### Document Editor

#### Bug Fixes

- Cursor position is now updated properly when placed after image, bookmark.

## 16.3.17 (2018-09-12)

### Document Editor

#### New Features

- Added support for Page break.
- Added `insertSectionBreak` method in `Editor` class to insert a section break at current selection.

## 16.2.48 (2018-08-14)

### Document Editor

#### Bug Fixes

- Selection position is now updated properly on “Enter” key inside vertical merged cell.
- The content of a page no longer overlaps on next page while editing document contents.
- Undo & redo now works properly for list text editing.
- Line height is now updated properly for the paragraph contains bookmark element alone.

## 16.2.46 (2018-07-30)

### Document Editor

#### New Features

- Added support for .NET Framework 4.0 and 4.5 in `Syncfusion.EJ2.DocumentEditor` NuGet package.

## 16.2.41 (2018-06-25)

### Document Editor

The Document Editor component is used to create, edit, view, and print Word documents in web applications. All the user interactions and editing operations that run purely in the client-side provides much faster editing experience to the users.

- Opens the native `Syncfusion Document Text (*.sfdt)` format documents in the client-side.
- Saves the documents in the client-side as `Syncfusion Document Text (*.sfdt)` and `Word document (*.docx)`.
- Supports document elements like text, inline image, table, fields, bookmark, section, header, and footer.
- Supports the commonly used fields like hyperlink, page number, page count, and table of contents.
- Supports formats like text, paragraph, bullets and numbering, table, page settings, etc.
- Provides support to create, edit, and apply paragraph and character styles.
- Provides support to find and replace text within the document.
- Supports all the common editing and formatting operations along with undo and redo.
- Provides support to cut, copy, and paste rich text contents within the component. Also allows pasting simple text to and from other applications.
- Allows user interactions like zoom, scroll, select contents through touch, mouse, and keyboard.
- Provides intuitive UI options like context menu, dialogs, and navigation pane.
- Creates a lightweight Word viewer using module injection to view and prints Word documents.
- Added `Syncfusion.EJ2.DocumentEditor` NuGet package that contains helper library for converting Word documents to `Syncfusion Document Text (*.sfdt)`. It supports .NET Standard 2.0 Framework.