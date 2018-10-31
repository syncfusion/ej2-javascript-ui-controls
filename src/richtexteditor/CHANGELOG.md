# Changelog

## [Unreleased]

## 16.3.27 (2018-10-23)

### RichTextEditor

#### Bug Fixes

- Model Binding is not working with `value` property, that issue has been fixed.

## 16.3.22 (2018-09-25)

### RichTextEditor

#### Bug Fixes

- The fontColor, backgroundColor properties default value is not an active state in ColorPicker which has been fixed.

- ITextAreaElement interface issue in TypeScript 3.0.0 has been fixed.

## 16.3.17 (2018-09-12)

### RichTextEditor

#### New Features

1. Image resize support has been provided.
2. Insert table support has provided for HTML Editor which includes below sub features,
    1. Create and modify the table, table rows and columns.
    2. Row and column resize.
    3. Quick toolbar interaction.
    4. Table header and custom styles.

#### Breaking Changes

- `setContent` method has removed, use `value` property to set the content instead.

## 16.2.51 (2018-09-04)

### RichTextEditor

#### Bug Fixes

- RichTextEditor modal `popup` style override issue has been resolved.
- RichTextEditor removes spacing between words when content is pasted from a word document, that
issue has been fixed.

## 16.2.50 (2018-08-28)

### RichTextEditor

#### Bug Fixes

- Unable to paste image copied from windows in RichTextEditor issue has been resolved.

## 16.2.49 (2018-08-21)

### RichTextEditor

#### Bug Fixes

- `IFrame` mode external font family removed in RichTextEditor.
- Unable to delete the selected content of RichTextEditor in inline toolbar issue has been resolved.

## 16.2.48 (2018-08-14)

### RichTextEditor

#### Bug Fixes

- Removed external font family in RichTextEditor source.

## 16.2.47 (2018-08-07)

### RichTextEditor

#### Bug Fixes

- `FontColor` and `BackgroundColor` toolbar item not rendered in inline mode issue has been resolved.
- RichTextEditor toolbar disabled mode content select console error issue has been resolved.
- Provided view encapsulation support.

## 16.2.45 (2018-07-17)

### RichTextEditor

#### Bug Fixes

- Provided `getText` public method from RichTextEditor.

## 16.2.44 (2018-07-10)

### RichTextEditor

#### Bug Fixes

- RichTextEditor `actionBegin` event missing arguments included.

## 16.2.41 (2018-06-25)

### RichTextEditor

The rich text editor component is WYSIWYG ("what you see is what you get") editor used to create and edit the content and return valid HTML markup or markdown (MD) of the content. The editor provides a standard toolbar to format content using its commands. Modular library features to load the necessary functionality on demand. The toolbar contains commands to align the text, insert link, insert image, insert list, undo/redo operation, HTML view, and more.

- Provides IFRAME and DIV mode.
- Handles markdown editing.
- Contains a modular library to load the necessary functionality on demand.
- Provides a fully customizable toolbar.
- HTML view to edit the source directly for developers.
- Supports to integrate third-party library.
- Preview the modified content before saving it.
- Handles images, hyperlinks, video,hyperlinks, uploads, and more.
- Contains undo/redo manager.
- Creates bulleted and numbered lists.
