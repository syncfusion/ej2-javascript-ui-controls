# Changelog

## [Unreleased]

## 20.1.56 (2022-05-17)

### RichTextEditor

#### Bug Fixes

- `#I377121` - Now, adding the `cssClass` property will also add the CSS class to all the dependent components of the Rich Text Editor.

- `#I376816` - Now, applying list by selecting all content which is pasted in the Rich Text Editor on the `Firefox` browser works properly.

- `#SF-378184` - Now, the script error is not thrown when resizing the Rich Text Editor component with inline mode.

## 20.1.55 (2022-05-12)

### RichTextEditor

#### Bug Fixes

- `#I374234` - Now, the Rich Text Editor table resize works properly when width is configured for the parent element.

## 20.1.52 (2022-05-04)

### RichTextEditor

#### Bug Fixes

- `#I375434` - Now, pressing the enter key multiple times when the content is empty in the Rich Text Editor on the `Firefox` browser works properly.

- `#I349917` - Now, the floating toolbar in the Rich Text Editor is displayed properly when rendered inside the modal dialog.

- `#I376141` - Now, pressing enter key before the image with caption doesn't remove the image.

- `#I373983` - Now, the Rich Text Editor table resize works properly when placed inside the `Grid` component.

## 20.1.51 (2022-04-26)

### RichTextEditor

#### Bug Fixes

- `#I373527` - Now, the font name is updated properly when using the custom font names in the Rich Text Editor.

- `#I373953` - Now, inserting the table after the list element with the image doesn't remove the image from the list.

- `#I372489` - Now, resizing the images with equal height and width works properly.

- `#F173394` - Now, the undo and redo keys work properly when pasting the content in the Rich Text Editor.

- `#SF-367649` - Now, more space between the text and inserting a new link does not remove the space between the words.

## 20.1.50 (2022-04-19)

### RichTextEditor

#### Bug Fixes

- `#I367373` - Now, pressing `ctrl+z` to undo the changes works properly when `enterKey` is configured as `BR`.

## 20.1.48 (2022-04-12)

### RichTextEditor

#### Bug Fixes

- `#F173415` - Now, the input element can be inserted in the Rich Text Editor using the `executeCommand` public method.

- `#I372932` - Now, copying and pasting the content with `contenteditable` set to false doesn't add any unwanted `br` tag.

- `#I370707` - Now, the font size is updated properly when removing the bullet list using the backspace key.

- `#I370210` - Now, the image will be loaded properly when pasting the contents from MS Word.

## 20.1.47 (2022-04-04)

### RichTextEditor

#### Bug Fixes

- `#I369216` - Now, pasting the note pad with link contents is pasted properly without moving the cursor to the previous line.

- `#F171703` - Now, pasting the content in the Rich Text Editor after pressing the `shift + enter` key works properly.

## 19.4.38 (2021-12-17)

### RichTextEditor

#### Bug Fixes

- `#I347512` - The issue with "ColorPicker of Table quick toolbar got reset every time when quick toolbar rendered" has been resolved.

- `#I347324` - The issue with "pressing enter key creates a new line when read only mode is enabled dynamically" has been resolved.

- `#I355194` - The issue with "console error occurs when undo icon in the toolbar is clicked after inserting the content using the `tribute js`" has been resolved.

- `#I348822` - The issue with "selecting some content and applying font and background color alternatively will create some new elements" has been resolved.

- `#I349275` - The issue with "image resizing is not working properly when image height is greater than image width" has been resolved.

## 19.3.53 (2021-11-12)

### RichTextEditor

#### Bug Fixes

- `#I346580` - The issue with "align top in the table vertical align quick toolbar is always disabled" has been resolved.

- `#I346331` - The issue with "font family is not working when changed dynamically when the Rich Text Editor is in inline mode" has been resolved.

- `#I346832` - The issue with "upload icon overlaps with the percentage icon in the insert image dialog when uploading" has been resolved.

## 19.3.47 (2021-10-26)

### RichTextEditor

#### Bug Fixes

- `#I342950` - The issue with "font-Family styles are not applied when changing dynamically" has been resolved.

- `#I345842` - The issue with "Table cells with classes added initially are removed, when focusing on the table cells" has been resolved.

## 19.3.46 (2021-10-19)

### RichTextEditor

#### Bug Fixes

- `#I342605` - The `removeUrl` API configured controller action, now receives the image file data instead of the `src` attribute value, When removing an image from the editor.

- `#I343769` - The issue with the link quick toolbar opened when placing the cursor at the first letter of the hyperlink word in the Rich Text Editor content has been resolved.

## 19.3.45 (2021-10-12)

### RichTextEditor

#### Bug Fixes

- `#I338000` - The issue with `actionComplete` event triggered twice, when replacing the inserted image using QuickToolbar has been resolved.

- `#I343188` - The issue with "Focusing a table cell that was recently inserted in the Rich Text Editor, the page scrolls to the end and the table loses its focus" has been resolved.

- `#F168838` - The issue with "Image is not inserted in the editor, when using the `Turkish` language" has been resolved.

- `#I344588`, `#I344586` - The issue with "page scrolls automatically when the enter key is pressed in the Rich Text Editor" has been resolved.

- `#I344588` - The issue with "content goes outside of the Rich Text Editor when the enter key is pressed twice" has been resolved.

- `#I342895` - The issue with "when copy and paste content in the empty Rich Text Editor focus is lost" has been resolved.

- `#F168901` - The issue with `&#8203;` character code not removed when typing in the Rich Text Editor has been resolved.

- `#I340970` - The issue with "Replacing the `&nbsp;` to empty space's with the `XTHML` validation" has been resolved.

- `#I342383` - The issue with "Numbered List order in the Rich Text Editor goes incorrect, when copy and pasting a list from MS word" has been resolved.

## 19.3.43 (2021-09-30)

### RichTextEditor

#### New Features

- `#I231505`, `#I230743`, `#I239381`, `#I261360`, `#I273955`, `#I300418`, `#I307752`,`#I312982` - Provided support to customize the tags appended when enter or shift + enter key is pressed using the property `enterKey` and `shiftEnterKey` in the Rich Text Editor.

#### Breaking Changes

- `#I334962` - The image size popup, now has an option to set an `auto` value.

#### Bug Fixes

- `#I340683` - The issue with "Text inserted outside of the Rich Text Editor, after performing `Shift + Enter` key action" has been resolved.

- `#I340683` - The issue with "Pasting the text content for the second time, after clearing the value hangs the Rich Text Editor" has been resolved.

- `#I339234` - The issue with "Formats like bold, italic, underline will get unselected, when clicking in editor after selecting them" has been resolved.

## 19.2.62 (2021-09-14)

### RichTextEditor

#### Bug Fixes

- `#I340075` - The issue with "Resizing the table columns, is not updated the table cells properly" has been resolved.

- `#I332614` - The issue with "Table row and column are not resizable, when its position in the editor exceeds the height of the Rich Text Editor" has been resolved.

## 19.2.60 (2021-09-07)

### RichTextEditor

#### Bug Fixes

- `#I332614` - Resolved the issue with table row and column are not resizable, when its position exceeds the height of the Rich Text Editor.

- `#I338000` - The issue with `actionComplete` event triggered twice, when replacing the inserted image using QuickToolbar has been resolved.

- `#I340075` - The issue with "Resizing the table columns not updated the table cells properly" has been resolved.

## 19.2.59 (2021-08-31)

### RichTextEditor

#### Bug Fixes

- `#F167103` - The Image is not displayed, when adding next to the `hr` tag has been resolved.

- `#FB24806` - The issue with "Rich Text Editor height jumps, on input in Iframe mode with custom toolbar configured" has been resolved.

- `#I340017` - The issue with content area is not entirely visible, when expanding the toolbar if the `readOnly` property is enabled has been resolved.

- `#FB27857` - The issue with "Cannot cancel `fullscreen` action in the `actionBegin` event" has been resolved.

- `#I339831` - The issue with "Lists with multiple spans elements would produce new lists, while applying the `background-colour`" has been resolved.

- `#F168085` - The issue with "Text color is removed for the range nodes, when removing the formats" has been resolved.

## 19.2.57 (2021-08-24)

### RichTextEditor

#### Bug Fixes

- `#I336931`- The issue with "Rich Text Editor character count increased when bold, italic, underline format applied in empty content and accessing using `getCharCount()` public method has been resolved.

- `#I338261` - The issue with "Rich Text Editor hangs when pasting the word content, after clearing the value" has been resolved.

- `#I339192` - The "Rich Text Editor height is not adjusted to parent element height" issue has been fixed.

## 19.2.56 (2021-08-17)

### RichTextEditor

#### Bug Fixes

- `#I338000` - Resolved the exception raised, when pressing the enter key after changing the font-size in RTL mode in `Firefox` browser.

- `#I338062` - The issue with "Link is not generated properly, when `pasteCleanUpmodule` is imported" has been resolved.

- `#I338062` - The issue with "Unable to paste url more than two times, in the Rich Text Editor" has been resolved.

## 19.2.55 (2021-08-11)

### RichTextEditor

#### Bug Fixes

- `#I335578` - The issue with "alignment mismatching when pasting content from MS Word in the Rich Text Editor" has been fixed.

- `#I335315` - The issue with "Image size restriction not works in Drag and Drop action" has been resolved.

#### New Features

- `#I309446`, `#I336258` - Provided support to paste rare list contents from MS Word in the Rich Text Editor.

- `#I304121` - Improvements with the `deleteKey` action in the Rich Text Editor.
- Provided `showDialog`, `closeDialog` methods to opens/closes the Link, Image, Table dialogs in the Rich Text Editor.

## 19.2.51 (2021-08-03)

### RichTextEditor

#### Bug Fixes

- `#I324790, #I337356` - The issue with "`div` element is created instead of `paragraph` element when enter key is pressed twice to exit the list" has been fixed.

- `#I336931` - The issue with "Character count is increased, when formats are being applied in empty content" has been fixed.

- `#I335821` - The issue with "Upload image restriction not working with the paste action" has been resolved.

## 19.2.49 (2021-07-27)

### RichTextEditor

#### Bug Fixes

- `#I335580` - The issue with the Rich Text Editor toolbar status not updated, once the contents have been removed has been rectified.

## 19.2.48 (2021-07-20)

### RichTextEditor

#### Bug Fixes

- `#I332112`, `#I332022` - The issue with "Images change aspect ratio, when resized to smallest possible and back larger again" has been resolved.

- `#FB26798` - The issue with "Rich Text Editor `change` event is not triggered in the code view" has been resolved.

- `#I334073`- The issue with "`Uploader` element is not present in DOM, when drag and drop images in the Rich Text Editor" has been resolved.

- `#I335073` - The issue with "Default font family applied, is not working in inline mode" has been resolved.

## 19.2.47 (2021-07-13)

### RichTextEditor

#### Bug Fixes

- `#I332610` - The issue with "Adding a column to a table after resizing a column resets the resized column width" has been resolved.

- `#I326508` - The issue with "Content is pasted outside the edit area of the Rich Text Editor when `enableXhtml` is set true" has been resolved.

- `#I332614` - The issue with "Columns and row resize not working when there is unequal number columns in all rows" has been resolved.

## 19.2.44 (2021-06-30)

### RichTextEditor

#### New Features

- `#I304121` - Improvements with the `backSpaceKey` action in the Rich Text Editor.

- `#I292778`, `#I308312`, `#I309446`, `#I313298` - Provided the List style type and List style image support for the Numbered and Bulleted lists.

#### Bug Fixes

- `#I327676` - The issue with "Custom toolbar icons not disabled/enabled, when multiple custom toolbar is configured" has been resolved.

- `#I330909` - The issue with "Inserting table after pressing `shit+enter` deletes all the content below in the Rich Text Editor" has been resolved.

- `#F165931` - The issue with "Ordered list number color not changing, when font color is applied to the list in the Rich Text Editor" has been resolved.

- `#I327566` - The issue with "Image resizing is not working properly when `resizeByPercent` is set true" has been resolved.

## 19.1.54 (2021-03-30)

### RichTextEditor

#### New Features

- `#257889`, `#264792`, `#280064`, `#305551`, `#316177`,  - Provided support for the table cell merge and split in Rich Text Editor table properties.

#### Bug Fixes

- `#318815`- The issue with "Resize grip of the image freezes, after resizing for the first time" has been resolved.

- `#317508`- The issue with "Resize icon of an image is not positioned properly, when height is set to the Rich Text Editor" has been resolved.

- `F163544`- The issue with "Pressing the 'cmd+z' in mac after deleting all contents, deletes the first paragraph of the Rich Text Editor" has been resolved.

- `F163545`- The issue with "'cmd+z' is not working after pasting the content in Mac machine" has been resolved.

- `#313508` - The issue with "event 'afterImageDelete' triggers two times when removing the image using the backspace key" has been resolved.

- `#313508` - The issue with "Console error is thrown, when updating the selected image with another image" has been resolved.

## 18.4.47 (2021-03-09)

### RichTextEditor

#### Bug Fixes

- `#317795`- The issue with "Pasting the block node contents in the Rich Text Editor" has been resolved.

## 18.4.46 (2021-03-02)

### RichTextEditor

#### Bug Fixes

- `#309809` - The issue with "Unable to resize the image in the Rich Text Editor when width is set" is resolved.

- `#314678` - Resolved the script error raised, when pasting the content after pressing the shift-enter key.

- `F161914` - The issue with "Bold format removed for the content previous to the selection in the Rich Text Editor" is resolved.

## 18.4.44 (2021-02-23)

### RichTextEditor

#### Bug Fixes

- `#314104` - The issue with the "Rich Text Editor's table width is not set properly if values are configured higher" is resolved.

- `F161887` - The issue with "Removing the italic format removes the underline format in the Rich Text Editor" is resolved.

## 18.4.42 (2021-02-09)

### RichTextEditor

#### Bug Fixes

- `F160581` - The issue with "The RichTextEditor table toolbar popup is hidden inside the higher Z-Index elements" has been resolved.

## 18.4.39 (2021-01-28)

### RichTextEditor

#### Bug Fixes

- `#296208` - Resolved the issue with the Placeholder blinks when pressing the enter key in the editor.

- `#310044` - The issue with the resize grip alignment when the toolbar is disabled state has been resolved.

## 18.4.34 (2021-01-12)

### RichTextEditor

#### Bug Fixes

`#305379` - The issue with "Images getting removed when pasting images along with contents from the MS Word in the Rich Text Editor" has been resolved.

`#301635` - The issue with "Pasting bulleted or numbered list from the MS Word doesn't maintain the font size and font styles in the Rich Text Editor" has been resolved.

## 18.4.33 (2021-01-05)

### RichTextEditor

#### New Features

- `F160594` - Provided new event `beforeImageDrop` that triggers before drop a image in Rich Text Editor component.

#### Bug Fixes

`#306799` - The issue with "deleting any rows in the table removes the first row of the table in the Rich Text Editor" has been resolved.

## 18.4.30 (2020-12-17)

### RichTextEditor

#### New Features

- **File Manager**: `F144048`, `#234755`, `#261368`, `#261882`, `#150871`, `#270549` - This feature allows the editor to browse and insert the images from FileManager using various remote service.

- `F149800` - Provided new property `removeUrl` in `insertImageSettings` API to trigger the image remove operation in server, when image removed from editor.

- `#301980` - Provided the support to return the `Xhtml` value in the `value` property when the `enableXtml` property is enabled in the Rich Text Editor.

- `#264791`, `#295032`, `#299905`, `#F159588` - Provided the support to retain all the styles from MS Excel while pasting the content in the Rich Text Editor.

#### Bug Fixes

`#296208` - The issue with "the placeholder blinks when pressing enter key in the Rich Text Editor" has been resolved.

## 18.3.35 (2020-10-01)

### RichTextEditor

#### Bug Fixes

`#292431` - The issue with "Rich Text Editor input elements are not destroyed properly when rendered based on the conditions" has been resolved.

## 18.2.56 (2020-09-01)

### RichTextEditor

#### Bug Fixes

- `#290237`, `#290247` - The issue with "copy and pasting content in the Markdown Editor is not working" has been resolved.

`#289786` - The issue with "The full screen toolbar item is not working when `readonly` mode is enabled in the Rich Text Editor" has been resolved.

`#F156796` - The performance issue when several Rich Text Editors are rendered in a single page has been resolved.

## 18.2.55 (2020-08-25)

### RichTextEditor

#### Bug Fixes

`#287641` - The issue with "pasting the list content from MS Word in the Rich Text Editor removes the copied content" has been resolved.

## 18.2.54 (2020-08-18)

### RichTextEditor

#### Bug Fixes

`#287193` - The issue with "Script error occurs with toolbar options when placing the cursor before & after the RichTextEditor table" has been resolved.

## 18.2.48 (2020-08-04)

### RichTextEditor

#### Bug Fixes

- `#266152` - The issue with "List selection with delete key action does not remove lists properly" has been resolved.

## 18.2.46 (2020-07-21)

### RichTextEditor

#### New Features

- `#272591` - Provided new event `beforeImageUpload` that triggers before the image upload process from Rich Text Editor component.

#### Bug Fixes

- `#282973` - The issue with "Selecting the transparent color from the FontColor in Rich Text Editor" has been resolved.

## 18.2.45 (2020-07-14)

### RichTextEditor

#### Bug Fixes

- `#282644` -  The issue with "Deleting the image using context menu doesn’t remove the resize and borders of the image" in the Rich Text Editor has been resolved.

- `#273140` -  The issue with "the image element which is not passed into the `actionComplete` event's argument in the Rich Text Editor" has been resolved.

## 18.2.44 (2020-07-07)

### RichTextEditor

#### New Features

- `#271295` - Provided public methods `showInlineToolbar` and `hideInlineToolbar` to show and hide the inline toolbars in the Rich Text Editor.

#### Bug Fixes

- The issue with "Rich Text Editor data binding not working in Source Code view" has been resolved.

## 18.1.57 (2020-06-16)

### RichTextEditor

#### Bug Fixes

- `#275859` -  The issue with "throwing script error while pasting the content with table" in the Rich Text Editor has been resolved.

- `#279019` -  The issue with "pasting the content inside the nested table that breaks the HTML content in the Rich Text Editor" has been resolved.

- `#276473` -  The issue `afterImageDelete` event is not triggered when the image is removed along with text content in the Rich Text Editor" has been resolved.

## 18.1.54 (2020-05-26)

### RichTextEditor

#### Bug Fixes

- `#275859` -  The issue with unable to edit the Rich Text Editor content after pasting the content with table has been resolved.

## 18.1.53 (2020-05-19)

### RichTextEditor

#### Bug Fixes

- `#F150037` -  The issue with "throwing script error while dynamically enable/disable the toolbar" has been resolved.

## 18.1.52 (2020-05-13)

### RichTextEditor

#### Bug Fixes

- `#F152908` - The issue sub list remains after deleting the parent list element in the Rich Text Editor has been resolved.

## 18.1.48 (2020-05-05)

### RichTextEditor

#### Bug Fixes

- `#272406` - The issue background color format not applied properly on changing the font size in the Rich Text Editor has been resolved.

## 18.1.45 (2020-04-21)

### RichTextEditor

#### Bug Fixes

- `#271937` - The issue table border not applied when pasting the content from the Excel in the Rich Text Editor has been resolved.

- `#271289` - The issue with using keyboard short cut `ctrl+k` to insert link not working in the Rich Text Editor has been resolved.

## 18.1.44 (2020-04-14)

### RichTextEditor

#### New Features

- `#F152228`, `#266987` - Provided an event `afterImageDelete` to be triggered after the image is removed from the Rich Text Editor content.

#### Bug Fixes

- `#F152859` - The issue `executeCommand` using `insertHTML` not inserting the Iframe element in the Rich Text Editor has been resolved.

- `#267874`, `#269214`, `#271199` - Resolved the compilation error with typescript version 3.8.3

- `#F152908` - The issue with empty sub-list not removed from Rich Text Editor has been resolved.

## 18.1.42 (2020-04-01)

### RichTextEditor

#### New Features

- `#266522` - Provided scrollable option support to the toolbar by setting toolbar type as `Scrollable` in Rich Text Editor.

## 17.4.51 (2020-02-25)

### RichTextEditor

#### Bug Fixes

- `F151491` - Resolved the issue with RichTextEditor height that is not set properly when the toolbar is disabled.

- `F151491` - Resolved the script errors thrown when opening an insert image dialog several times.

## 17.4.49 (2020-02-11)

### RichTextEditor

#### Bug Fixes

- `#261548`, `#262909` - The issue with a new line added after pasting the content and focusing out in the Rich Text Editor has been resolved.

- `#F150940` - The issue with cursor not maintained when using the `executeCommand` method with `insertHTML` in the Rich Text Editor has been resolved.

- `#F150991` - Fixed issue with script error when RichTextEditor is dynamically rendered using setState.

- `#F150991` - Resolved the issue with the fontName requestType is getting as fontSize after the `change` event has been triggered.

- `#F150742` - Resolved the issue with `dialogOpen` event does not return the content element in insert image dialog.

- `#262805` - Fixed issue `change` event triggers first time when `readonly` property is enabled.

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
