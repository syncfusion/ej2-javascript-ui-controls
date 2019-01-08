# Changelog

## [Unreleased]

## 16.4.46 (2019-01-02)

### RichTextEditor

#### Bug Fixes

- Changing the font color of underlined text doesn’t change the color of the line, that issue has been fixed.

- RichTextEditor injectable module is missed from import setting file in [CRG](https://crg.syncfusion.com/), that issue has been fixed.

- The change event is triggered on clicking into HTML source code view in Edge browser, that issue has been fixed.

- Blur event is not triggered when we change focus directly from one RTE to another RTE, that issue has been fixed.

## 16.4.44 (2018-12-24)

### RichTextEditor

#### Bug Fixes

- Pasted URL is not converted to links automatically, that issue has been fixed.

- Image paste as twice in Firefox browser, that issue has been fixed.

## 16.4.40-beta (2018-12-10)

### RichTextEditor

#### New Features

- Insert table support has provided for MarkDown Editor.

#### Bug Fixes

- Dynamic enabling and disabling support for toolbar items has been provided.
- Image dialog's Browse button width is not adjusted based on the text issue has been resolved.

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
