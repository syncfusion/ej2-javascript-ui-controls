# Changelog

## [Unreleased]

## 17.3.34 (2019-12-10)

### Document Editor

#### Bug Fixes

- `#252868`, `#254873` - Resolved script error when resizing table row.
- `#251882` - Line spacing for paragraph is now apply properly when line spacing type is atleast.
- `#143383` - Paper size drop down is now update properly based on page width and page height.
- `#255741` - Fixed the focus issue when key pressed on input element.
- `#250770` - RTL text with special characters are now layout properly.
- `10269` - Line spacing is now exported properly.

## 17.3.28 (2019-11-19)

### Document Editor

#### New Features

- `#246305` - Added API to check whether selection is in field.
- `#246305` - Added API to select the current field if selection is in field.
- `#246305` - Added API to perform delete.

#### Bug Fixes

- `#253511` - Line spacing is now applying properly after set locale to document editor.
- `#254998` , `#251884` - Updated bookmark collection when bookmark gets added.
- `#246264` - Table with vertical merged split cells is now layout properly.
- `#246884` - List is now copied properly.

## 17.3.27 (2019-11-12)

### Document Editor

#### New Features

- `#253104` - Added API to set custom header in XmlHttpRequest.

#### Bug Fixes

- `#251603` - When apply numbering list, continue numbering is now updated properly.
- `#251689` - Resolved script error after cut and undo operation.
- `#250599` - Script error now resolved when deleting page break.
- `#250914` - Updated bookmark collection when bookmark gets removed.
- `#251606` - Scrolling is now proper when mouse move out of document editor.

## 17.3.26 (2019-11-05)

### Document Editor

#### New Features

- `#250061`, `#246305` - Added property to retrieve bookmarks on selection.
- `#251247` - Added API for restrict editing.
- `#251247`, `#238969`, `#252954`,`#253149` - Added API for selection.

#### Bug Fixes

- `251355` - Script error while importing the document is now resolved.
- `251910` - Status bar disappear on mouse hover is now resolved.
- `251219` - Script errors due to Content security policy are now resolved.

## 17.3.21 (2019-10-30)

### Document Editor

#### Bug Fixes

- `#251576` - Enable repeat row header is now enabled properly in table properties dialog.
- `#250638` - Scroll position is now maintained after inserting columns.
- `#253260` - Script error now resolved when double click on header footer.
- `#252506` - Spell checker performance has been improved.

## 17.3.19 (2019-10-22)

### Document Editor

#### New Features

- `#249783` - Added API to set default section format properties.

#### Bug Fixes

- `#249729` - List now updated when copy and paste from outside editor.
- `#249574` - Table now layout properly when resizing table middle column.
- `#249767` - Control elements are now destroyed properly.
- `#250041` - Paragraph formatting is now preserved properly when copy and paste contents.

## 17.3.17 (2019-10-15)

### Document Editor

#### Bug Fixes

- `#246264` - Page now becomes responsive, when document contains table with split cell widget.
- `#249138` - Table of contents dialog now rendered properly.
- `#245757` - Page now becomes responsive when we edit in header footer region.
- `#249049` - List continue numbering issues are resolved now.
- `#248304`, `#250801` - TOC is now updated properly, when paragraph contains page break with heading style.
- `#249736` - Focus is now set to text search result, when search icon is clicked in options pane.
- `#249542` - Draw image error is resolved now, when document contains invalid image source.
- `#249329` - Added localization for missed text in document editor.
- `#248710` - Character format is now applied, when selection start is in field.

## 17.3.16 (2019-10-09)

### Document Editor

#### Bug Fixes

- `#246365`, `#250077` - Table Width for auto type table format is now updated properly.
- `#249283` - Command + A key triggers properly in MAC machine's Safari browser.
- `#248301` - Text clipping issues are fixed when text inside table cell.
- `#246587` - backward selection issues and backspace issues for restrict editing are resolved now.
- `#244786` , `#248882` - Text now rendered properly in RTL paragraph, when copy and paste locally.
- `#248304` - Tab leader is now preserved properly, when updating table of contents.

## 17.3.14 (2019-10-03)

### Document Editor

#### New Features

- `#245203` - Added support to preserve and layout start page number for sections

#### Bug Fixes

- `#243771` - Clipboard data is now pasted as plain text, If XHTML validation fails.
- `#246264`, `#246143`, `#247143` - Styles now updated properly for the selected paragraph.
- `#246003` - Default character and paragraph format is now set on initial control rendering.
- `#245766` - Table of contents is now copied properly.
- `#245891` - Merge field is now copied as a plain text.
- `#245860`, `#246440` - Script error is fixed after paste switch to different formatting.
- `#245461` - Left border width is now updated properly.
- `#246168` - List tab width is now calculated properly when hanging indent is specified.
- `#245890` - Script error is fixed when pasting content copied from word.
- `#247896`, `#147336` - Text is now visible when its container contains flex style property.
- `#246884` - Copy and paste single paragraph containing list is now resolved.
- `#247831` - Script error is fixed while importing document.
- `#246168` - List font style is now rendered properly.
- `#246751` - Script error is now resolved when editing inside nested table.
- `#245453` - Paragraph is now lay-outed properly when it has based on style.
- `#244786`, `#248882` - RTL text exporting issues are fixed.
- `#244786` - Cursor now updated properly after inserting merge field when paragraph is set as RTL.

## 17.3.9-beta (2019-09-20)

### Document Editor

#### Bug Fixes

- `#245457`, `#245459` - Table is now layout properly.
- `#246127`, `#246597`, `#247364` - Page number field is now exported properly in Sfdt export.

## 17.2.49 (2019-09-04)

### Document Editor

#### Bug Fixes

- `#245473` - Line spacing is now exported properly.
- `#245469`, `#245470` - List level paragraph heading is now layout properly on page break.
- `#243495` - width is now calculated properly for the tab element, if it has single tab stop.
- `#244893` - Paste event is now triggered in safari browser.
- `#246003` - Insert field is now updated based on current selection format.
- `#243919` - Script error is fixed while pressing Ctrl + A.

## 17.2.47 (2019-08-27)

### Document Editor

#### Bug Fixes

- `#243874` - Contextual Spacing property on paragraph is now exported properly.
- `#243878` - Copy and paste when the document contains page break character within control is now working.
- `#243495` - Follow character width for list is now updated properly.

## 17.2.41 (2019-08-14)

### Document Editor

#### Bug Fixes

- `#243495` - List level paragraph heading 2 first line indent style is now applied properly.
- `#243495` - Section break paragraph style layout is now applied properly.
- `#243495` - TOC tab header layout is now applied properly for sub headings.
- `#243495` - Script error is fixed when calculating tab width for list in TOC.
- `#243495` - TOC hyperlink text style is now preserved properly.
- `#243878` - Table cell is now exported properly when table contains spanned rows.

## 17.2.40 (2019-08-06)

### Document Editor

#### Bug Fixes

- `#241445` - List level for RTL paragraph is now applied properly when tab is applied.
- `#241445` - Undo and redo is now working properly, after list level modified for RTL paragraph.
- `#241445` - Paragraph is now layout properly, when entering combination of RTL and English text.
- `#243622` - List is now exported properly in sfdt format.

## 17.2.39 (2019-07-30)

### Document Editor

#### New Features

- `#238969` - Added API to set paste formatting options

#### Bug Fixes

- `#146208` - Header footer contents are now rendered properly on print without any blur.
- `#240266` - Fixed Exception thrown while updating page number.

## 17.2.36 (2019-07-24)

### Document Editor

#### Bug Fixes

- `#239985` - List paragraph with style is now layout properly.
- `#236808` - Table is now layout properly if table width type is auto.
- `#228049` - Paragraph with right tab stop is now layout properly.

## 17.2.35 (2019-07-17)

### Document Editor

#### Bug Fixes

- `#144676` - Table is now layout properly if table contains grid after value.
- `#235990` - Table is now layout properly if table width type is not auto.
- `#228049` - Table with row margin is now layout properly.
- `#228049` - Text is now rendered properly without clipping.
- `#237734` - Table borders are now exported properly.

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
