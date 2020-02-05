# Changelog

## [Unreleased]

## 17.4.47 (2020-02-05)

### RichTextEditor

#### Bug Fixes

- `#150737` - Resolved the issue with inserting an image dialog that was not properly rendered on mobile devices.

- `#F150655` - The issue 'Images not uploaded into the server when pasting only an image from the MS Word in the Rich Text Editor' has been resolved.

## 17.4.46 (2020-01-30)

### RichTextEditor

#### New Features

- `#F149481` - Provided the support to get the selected HTML content using the `getSelectedHtml` public method.

## 17.4.44 (2021-01-21)

### RichTextEditor

#### New Features

- `#256724`, `#F149821` - Provided the support to insert a table using the `executeCommand` public method in the RichTextEditor.

## 17.4.43 (2020-01-14)

### RichTextEditor

#### Bug Fixes

- `#258971` - Resolved the issue with an image element that is appended on insert image dialog drop area when drag and drop an image.

- `#254879` - The issue with copying and pasting MS Word content along with the image of type `v:shape` to the Rich Text Editor has been fixed.

- `#F149899` - The issue with 'image alignment styles are not loaded when displaying the editor content on another page' in the Rich Text Editor has been fixed.

## 17.4.40 (2019-12-24)

### RichTextEditor

#### Bug Fixes

- `#254606` - Web accessibility related issues have been resolved.

## 17.4.39 (2019-12-17)

### RichTextEditor

#### Bug Fixes

- `#256452` - The Rich Text Editor is no longer allow to resize the image when `readonly` is enabled.

- `#253296` - The issue with drag and drop text is not working inside the Rich Text Editor has been fixed.

### RichTextEditor

#### New Features

- **Callback event to custom toolbar**: The feature allows to bind click event handler to the custom toolbar items in the Rich Text Editor.

- **Code format as toolbar button**: Provided an option to add the code format as toolbar button with toggle state in the Rich Text Editor.

- **XHTML validation**: Provided support to validate the content of Rich Text Editor with XHTML standard.

## 17.3.29 (2019-11-26)

### RichTextEditor

#### Bug Fixes

- `#F149001` - The issue with customization of table cell padding and cell spacing in the Rich Text Editor has been resolved.

## 17.3.28 (2019-11-19)

### RichTextEditor

#### Bug Fixes

- `#254865` - Resolved the issue with an image that is not removed when pressing the delete key by enabling the `showOnRightClick` property.

## 17.3.19 (2019-10-22)

### RichTextEditor

#### Bug Fixes

- `#251855` - Resolved the issue with appearance of transparent color tile in Rich Text Editor's color picker.

- `#251699` - The issue with pasting content from Word document displays unnecessary HTML content in the Rich Text Editor has been fixed.

- `#251640` - The issue "placeholder not hidden after inserting a table or an image in the Rich Text Editor" has been fixed.

- `#250650` - The issue with image rename in the imageUploadSuccess event not working when drag and drop an image into RichTextEditor has been fixed.

- `#250587` - The issue with null field shown on form data headers response when drag and drop an image into RichTextEditor has been fixed.

- `#251855` - The issue "console error is thrown, when the image upload dialog is opened in IE browser" has been fixed.

## 17.3.16 (2019-10-09)

### RichTextEditor

#### Bug Fixes

- `#249291` - The issue "extra empty tags are added while toggling bold or Italic style when typing the text randomly" in the Rich Text Editor has been fixed.

## 17.3.14 (2019-10-03)

### RichTextEditor

#### Bug Fixes

- `#249182` - The issue with localizing static texts of paste prompt dialog in the Rich Text Editor has been fixed.

- `#249613` - The issue with pasting content from Microsoft Excel sheet that throws console error in the Rich Text Editor has been fixed.

## 17.3.9-beta (2019-09-20)

### RichTextEditor

#### New Features

- **Drag and drop images from local system**: The feature allows to insert the images to the editor by drag and drop from local path. The images can uploaded to the server before insert into the editor.

- **Resizable Editor**: `#236064` - This feature allows the editor to be resized. Users can enable or disable this feature using the `enableResize` property. If `enableResize` is true, the RichTextEditor component creates grip at the bottom right corner to resize it in diagonal direction.

- **Pasting images from Microsoft Word and Microsoft Outlook**: This feature allows you to paste the images in the editor by copying and pasting from Microsoft Word and Outlook. The images can be uploaded to the server before inserting into the editor.

#### Bug Fixes

- `#F146927` - The issue with copy and pasting image from MS Word to the RichTextEditor has been fixed.

- `#246340` - The issue with pasting the content as plain-text in Rich Text Editor has been fixed.

## 17.2.47 (2019-08-27)

### RichTextEditor

#### Bug Fixes

- `#242999` - Now, Reactive form validates properly on `shift + tab` key action.

- `#244796` - Floating toolbar now renders properly without alignment issue, when render the Rich Text Editor within Tab.

- `#243448` - Performance with page scroll has been improved when multiple Rich Text Editor components are rendered in the page.

- `#241388` - The issue with right-click option while rendering RichTextEditor inside the table has been fixed.

## 17.2.46 (2019-08-22)

### RichTextEditor

#### New Features

- **Image upload events**
    - `#240002`, `#236690`, `#241238`, `#244320` - This feature allows images to be customized on uploading and inserting them into the editor by using the upload events image selected, image uploading, image upload success, and image upload failed. Users can rename the images before inserting them into the editor using these events.

#### Bug Fixes

- `#243475` - Now, you can validate max-length even showCharCount property as false.

- `#243475` - Resolved the issue with max-length validation on pasting the content.

- `#242999` - The key action for `tab` key and `shift + tab` key are similar now.

## 17.2.41 (2019-08-14)

### RichTextEditor

#### New Features

- **Support for saving images in base64**: `#240002`, `#242405` - This feature allows users to save the images in the RichTextEditor in base64 format along with the existing blob format.

- `#242771` - Provided the support to handle both absolute and relative path links.

#### Bug Fixes

- `#243767` - The issue with applying selected format based on content editable has been fixed.

## 17.2.36 (2019-07-24)

### RichTextEditor

#### Bug Fixes

- `#242377` - The issue, "alignment is not working while pasting content from notepad" has been resolved.

- `#F146057` - The issue, "formatting(strong and alignment) is not maintained on pasting web content" has been resolved.

## 17.2.35 (2019-07-17)

### RichTextEditor

#### Bug Fixes

- `#241388` - The issue, "browser context menu is not shown on right click when enabling the showOnRightClick property" has been resolved.

## 17.2.34 (2019-07-11)

### RichTextEditor

#### Bug Fixes

- `#F145376` - The issue, "action complete event is not triggered when deleting the content with text and images" has been resolved.

- `#237729` - The issue "table column width is shown as pixel instead of percentage while resizing" has been fixed.

- `#237729` - Pickers mode throws script error when selecting the color in table's quick toolbar, that issue has been fixed.

- `#237729` - Color picker value doesn't set as RGBA(alpha) value in content editor, that issue has been fixed.

- `#240808` - The issue "opening a link in new window throws an error for auto generated link" has been fixed.

- `#240024` - The issue, "spacing between words is removed when focus out the editor" has been resolved.

- `#234519`, `#234586`, `#F138909` - The issues with table and its functionalities in IE11 has been resolved.

## 17.2.28-beta (2019-06-27)

### RichTextEditor

#### New Features

- **Paste from Microsoft Word**: This feature allows users to paste clean-formatted HTML markup by removing all unnecessary elements, styles, and attributes from text while copying and pasting it from Microsoft Word.

#### Breaking Changes

- Changed the default value of the API property `allowedStyleProps` from `null` to `['background', 'background-color', 'border', 'border-bottom', 'border-left', 'border-radius', 'border-right', 'border-style', 'border-top', 'border-width', 'clear', 'color', 'cursor', 'direction', 'display', 'float', 'font', 'font-family', 'font-size', 'font-weight', 'font-style','height', 'left', 'line-height', 'margin', 'margin-top', 'margin-left', 'margin-right', 'margin-bottom', 'max-height', 'max-width', 'min-height', 'min-width',  'overflow', 'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'position', 'right', 'table-layout', 'text-align', 'text-decoration', 'text-indent', 'top', 'vertical-align', 'visibility', 'white-space', 'width']`.

#### Bug Fixes

- `#238872` - Issue with cursor position when enabled list with empty editor that issue has been resolved.

## 17.1.49 (2019-05-29)

### RichTextEditor

#### Bug Fixes

- `#235461` - Thrown the console error while rendering the RichTextEditor within a table element and pressing the tab key from edit area that issue has been resolved.

## 17.1.48 (2019-05-21)

### RichTextEditor

#### New Features

- `#230976` - Opens a quick toolbar on right-click support has been provided.

#### Bug Fixes

- `#235120` - RichTextEditor's paste as plain text doesn't preserve line break that issue has been resolved.

## 17.1.43 (2019-04-30)

### RichTextEditor

#### Bug Fixes

- `#234280` - RichTextEditor's toolbar is broken when using ES2015 target that issue has been resolved.

## 17.1.42 (2019-04-23)

### RichTextEditor

#### Bug Fixes

- Change event doesn't trigger, when RichTextEditor blurs inside of `In-place Editor` that issue has been fixed.

## 17.1.40 (2019-04-09)

### RichTextEditor

#### Bug Fixes

- Insert image functionality of `RichTextEditor` is not working when render with `File Upload`, that issue has been fixed.

## 17.1.32-beta (2019-03-13)

### RichTextEditor

#### Bug Fixes

- Image and Table quick toolbar open while scrolling the content in the iPhone device, that issue has been fixed.

- Getting console error while rendering inline mode with `FontColor` and `BackgroundColor` in mobile view, that issue has been fixed.

-`Undo` and `Redo` icon visible in preview mode issue has been fixed

#### New Features

- **Paste cleanup**: This feature allows users to clean up HTML content when copying and pasting any other content from external sources.

## 16.4.55 (2019-02-27)

### RichTextEditor

#### Bug Fixes

- Insert image dialog is not rendering properly while setting the `imageUploadMessage` text as long in localization, that issue has been fixed.

- Localization is not applied to static `DropDownButton` items, that issue has been fixed.

## 16.4.54 (2019-02-19)

### RichTextEditor

#### Bug Fixes

- HTML 5 form reset behaviour has been corrected.

- Editor content rendered twice in DOM when using `RichTextEditorFor`, that issue has been fixed.

- EJ2 compatibility styles are not worked while component rendering with `textarea` element, that issue has been fixed.

## 16.4.53 (2019-02-13)

### RichTextEditor

#### Bug Fixes

- Console error is thrown in IE11 browser while using the SVG element style with transform and then render the RichTextEditor in an application, that issue has been fixed.

- HTML 5 standard issues has been fixed.

- Cursor position changed after typed some contents issue has been fixed.

#### Breaking Changes

- Changed the  `fontSize`, `fontFamily`, `format` properties  default value as null.

## 16.4.48 (2019-01-22)

### RichTextEditor

#### Bug Fixes

- Table QuickToolbar open wherever click within a component issue has been fixed.

- FontSize "px"  and fontFamily "veranda"  not updated in toolbar status, that issue has been fixed.

- Clicking on view source code with single character inside textarea removes the character, that issue has been fixed.

## 16.4.47 (2019-01-16)

### RichTextEditor

#### Bug Fixes

- ASP.NET core data annotation issue has been fixed.

- Console error is thrown in IE browser with angular routing, that issue has been fixed.

- Unable to maintain the RichTextEditor color picker pop-up position when scrolling the browser has been fixed.

## 16.4.46 (2019-01-08)

### RichTextEditor

#### Bug Fixes

- Changing the font color of underlined text doesn’t change the color of the line, that issue has been fixed.

- RichTextEditor injectable module is missed from import setting file in [CRG](https://crg.syncfusion.com/), that issue has been fixed.

- The change event is triggered on clicking into HTML source code view in Edge browser, that issue has been fixed.

- Blur event is not triggered when we change focus directly from one RTE to another RTE, that issue has been fixed.

- RichTextEditor full screen not working properly when render inside the overflow element has been fixed.

## 16.4.44 (2018-12-24)

### RichTextEditor

#### Bug Fixes

- Pasted URL is not converted to links automatically, that issue has been fixed.

- Image paste as twice in Firefox browser, that issue has been fixed.

- The value property and getHtml method will be updated within an interval to `saveInterval` property.

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
