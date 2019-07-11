# Changelog

## [Unreleased]

## 17.2.34 (2019-07-11)

### Document Editor

#### Breaking Changes

- The `pasteLocal` method in `Editor` module is changed to `paste`, which accepts the sfdt string as argument. If sfdt string does not present, paste the local clipboard data.

#### Bug Fixes

- `#240558` - Page numbers are now updated properly.
- `#228049` - Table left border and shadings are now rendered properly.
- `#228049` - Paragraph left indent will never add extra space in table cell.
- `#239144` - Font Type and size value gets highlight when focused on corresponding dropdown list.

## 17.2.28-beta (2019-06-27)

### Document Editor

#### Breaking Changes

- The `serviceUrl` property in `DocumentEditorContainer` component no longer expect the full path of the Web API action. Henceforth, it only expects the path up to controller name alone. And the Web API action name can be configured in `serverActionSettings` property for different actions.

#### New Features

- `#229069` - Added contextual spacing support.
- `#158324`, `#226019`, `#226018`, `#227644`, `#238417` - Added support for chart preservation.
- `#94889` ,`#87537`, `#223333` ,`#222513`, `#224521` ,`#227620` ,`#227052` ,`#227362`, `#236997` - Added spell check support.
- `#226631` ,`#227594`, `#231373`, `#233073` - Added clipboard paste with formatted content.
- `#140903` ,`#227192`, `#227641` ,`#227640` - Added restrict editing support.
- `#237725` - Added API to customize gap between each page.

#### Bug Fixes

- `#237415`, `#238902` - Document exported properly when document contains hyphen character.
- `#228049` - Tab character width is now calculated properly.
- `#228049` - Table with repeat header is now layout properly.
- `#234073` - Table is now pasted properly.
- `#236808` - Document exported properly when document contains text form field.
- `#144848` - Table shading is now exported properly.

## 17.1.50 (2019-06-04)

### Document Editor

#### Bug Fixes

- `#236930` - Table exported properly when document contains continuous table.
- `#236502` - Table last column resizing is now working properly.

## 17.1.49 (2019-05-29)

### Document Editor

#### Bug Fixes

- `#226399` - Header and Footer is now layout properly if document contains section break

## 17.1.48 (2019-05-21)

### Document Editor

#### Bug Fixes

- `#234799` - Bold button is now aligned properly in modify style dialog.
- `#236061`, `#236039` - Document editor container component is now destroyed properly.
- `#234146` - Section formats are now applied properly.
- `#233556`, `#234406` - Table of Contents are now inserted properly.
- `#234249` - Multilevel lists are now exported properly.
- `#234084` - Selection is now updated properly after clear formatting.
- `#234073` - Copy is now working properly for nested table.
- `#234799` - Renaming the existing style in modify style dialog is now updated properly.
- `#234799` - Text alignment is now updating properly while modify style using style dialog.

## 17.1.47 (2019-05-14)

### Document Editor

#### New Features

- `#142821` - Added API to insert bookmark and fetch all bookmarks in document.
- `#142820` - Added API to insert hyperlink.

#### Bug Fixes

- `#230628` - Updated dialog animation.

## 17.1.44 (2019-05-07)

### Document Editor

#### Bug Fixes

- `#233280` - Improvised performance while updating page field.

## 17.1.43 (2019-04-30)

### Document Editor

#### Bug Fixes

- `#233908` - Height for merged cell is now updated properly.

## 17.1.42 (2019-04-23)

### Document Editor

#### Bug Fixes

- `#231353` - Text search results are now navigated properly.

## 17.1.41 (2019-04-16)

### Document Editor

#### Bug Fixes

- `#232616` - Document contents are now exported properly.
- `#232616` - Page hang on editing the document is fixed.
- `#232327` - Tables are now removed properly.

## 17.1.40 (2019-04-09)

### Document Editor

#### Bug Fixes

- Tab stop width is now calculated properly.
- First page header and footer is now layout properly.
- Scrollbar now updated properly in Internet Explorer.
- Page reload issue on button click is fixed.

## 17.1.38 (2019-03-29)

### Document Editor

#### New Features

- Added API to customize the default character format and paragraph format of document editor.
- Added support to customize context menu.
- Optimized text rendering.

#### Bug Fixes

- Section break is now serialized properly.

## 17.1.32-beta (2019-03-13)

### Document Editor

#### New Features

- Added API to customize the default character format and paragraph format of document editor.
- Added support to customize context menu.
- Optimized text rendering.

#### Bug Fixes

- Section break is now serialized properly.

## 16.4.54 (2019-02-19)

### Document Editor

#### Bug Fixes

- Default tab width is parsed and serialized properly.

## 16.4.53 (2019-02-13)

### Document Editor

#### Bug Fixes

- Table inside header is now layout properly.
- Table re-layout while editing now layout properly.
- Page break inside table is handled.

## 16.4.48 (2019-01-22)

### Document Editor

#### Bug Fixes

- Broken image rendering is handled.

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
