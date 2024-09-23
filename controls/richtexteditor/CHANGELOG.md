# Changelog

## [Unreleased]

## 27.1.50 (2024-09-24)

### RichTextEditor

#### Bug Fixes

- `#I620537` - Now, In localization, different text are used in alternative text quick toolbar item and alternative text dialog header.

- `#I623355` - Now, the ordered and unordered lists are now rendered properly in the table when copied and pasted from an MS Word document to the Rich Text Editor.

- `#I630039` - Now, when formatting is applied to the content, it functions correctly in the Firefox browser.

- `#I627005` - Now, when the Rich Text Editor is placed inside a list, the list functionality works properly.

- `#F191200` - Now, when a `blockquote` is applied and the `clearFormat` action is selected, the process correctly removes the `blockquote` and applies the appropriate `p` tags.

## 27.1.48 (2024-09-18)

### RichTextEditor

#### Features

- **Inline Code**: this feature allow users to highlight small code snippets, commands, or keywords within text, making them stand out for clarity in Rich Text Editor. Explore the demos [here](https://ej2.syncfusion.com/demos/#/bootstrap5/rich-text-editor/tools.html).

- **Import Export**: this feature allow users to export the Rich Text Editor's content into PDF or Word documents, as well as import Word content directly into the Rich Text Editor. Explore the demos [here](https://ej2.syncfusion.com/demos/#/bootstrap5/rich-text-editor/tools.html).

- **Slash Menu**: Provided support for / character to open popup and then apply formats such as Headings, Lists and Open insert dialogs of Image, Links, Table and options to add custom commands. Explore the demos [here](https://ej2.syncfusion.com/demos/#/bootstrap5/rich-text-editor/tools.html).

#### Breaking Changes

- Images saved on the server will no longer be automatically deleted when using keyboard or quick toolbar actions in the editor. This change is necessary because if the images are removed from the server, it would prevent the ability to perform undo/redo actions on them.
    - **Solution** : To handle image deletions properly, use the `afterImageDelete` event to capture the src of the deleted image. Then, send a request to your server to remove the image from storage, ensuring it is only deleted when explicitly intended.

#### Bug Fixes

- `#I627631` - Now, pressing the clear format when table is selected work properly in the Rich Text Editor.

- `#I624158` - Now, typing `1.` after pressing `shift+enter` does not create a list item in the Rich Text Editor.

- `#I621065` - Now, applying the multiple formats along with font-size format works properly by maintaining the font-size as priority.

- `#I618955` - Now, Pasting images from the OTD word document file functions correctly in the Rich Text Editor.

- `#I618955` - Now, Pasting content with images from Mac Outlook or Word into the Rich Text Editor now works properly in the Safari browser on Mac.

- `#I624026` - Now, the `actionBegin` event will now be triggered when the numpad enter key is pressed.

- `#I610932` - Now, Updating the image URL in the `actionBegin` event arguments will now correctly insert the new URL.

## 26.2.11 (2024-08-27)

### RichTextEditor

#### Bug Fixes

- `#I618955` - Now, Pasting images from the OTD word document file functions correctly in the Rich Text Editor.

- `#I623355` - Now, `decimal-leading-zero` list type is preserved correctly when pasting list content from MS Word in the Rich Text Editor

- `#I621080` - Now, space key working properly when space key is pressed in the Rich Text Editor.

- `#I609672` - Now, resolved the issue where pasted images were uploaded twice, currentTarget was null, and the success message popup appeared twice in the Rich Text Editor.

- `#I621556` - Now, the cursor will be visible when pressing the enter key and reaches the bottom of the Rich Text Editor when the container element's height and scroll style are manually set.

## 26.2.9 (2024-08-13)

### RichTextEditor

#### Bug Fixes

- `#I612704` - Now, the continuous console error that was being thrown when the editor is destroyed is fixed.

- `#I615533` - Now, The mention popup renders correctly when bold text is inserted in the Rich Text Editor.

- `#I617144` - Now, Pressing the backspace or delete key functions correctly in the Chinese language Rich Text Editor.

## 26.2.8 (2024-08-06)

### RichTextEditor

#### Bug Fixes

- `#I614247` - Now, the change event will triggered properly when toggling the readonly mode.

- `#I613965` - Now, backspace works properly inside the input field in the Rich Text Editor.

- `#I612147` - Now, deleting the list content by selecting deletes only the selected list elements instead of the whole list in Rich Text Editor.

- `#I605021` - Now, Copy and pasting justified content from desktop Word desktop works properly in Rich Text Editor

- `#I572346` - Now, the mention tags should not be added within the span while pasting in the Rich Text Editor.

## 26.2.7 (2024-07-30)

### RichTextEditor

#### Bug Fixes

- `#I600937` - Now, the entered value works properly when typed in Korean in the Rich Text Editor.

## 26.2.4 (2024-07-24)

### RichTextEditor

#### Bug Fixes

- `#I609672` - Now, the `imageRemoving` event is triggered properly when we delete the pasted image when uploading from the upload popup in the Rich Text Editor.

- `#I605021` - Now, pasting the content from the MS Word web application with alignment styles as justified works properly in Rich Text Editor.

- `#I572346` - Now, the mention tags should not be added within the span while pasting in the Rich Text Editor.

- `#I609672` - Now, the previously uploaded image is removed from the server when a new image is uploaded in the insert image dialog in the Rich Text Editor.
  
- `#I609672` - Now, pasting an image into the Rich Text Editor in the Firefox browser from the local machine, the image will be uploaded properly.

- `#I610812` - Now, the floating toolbar will work properly when the Rich Text Editor is rendered inside the dialog.

## 26.1.42 (2024-07-16)

### RichTextEditor

#### Bug Fixes

- `#I609924` - Now, the console error while closing the Grid Edit dialog with Rich Text Editor has now been resolved..

- `#I607525` - Now, the placeholder properly shows up after cleaning all the content in the Rich Text Editor.

## 26.1.41 (2024-07-09)

### RichTextEditor

#### Bug Fixes

- `#I585350` - Now, the list format is reverted properly when using the `executeCommand` method to apply and revert the list in the Rich Text Editor.

- `#I571199` - Now, improved the memory performance of the Rich Text Editor. The Rich Text Editor instance will now be properly cleared when using the destroy method.

## 26.1.40 (2024-07-02)

### RichTextEditor

#### Bug Fixes

- `#I595611` - Now, localization texts work properly for the source code and preview tooltips in the Rich Text Editor.

- `#I595571` - Now, inserting the table into the RichTextEditor works properly while using the quick toolbar settings in the editor.

- `#I534515` - Now, the cursor position is maintained properly when inserting image caption text in the Rich Text Editor.

- `#I598541` - Now, the quick toolbar in the Rich Text Editor works properly and does not get hidden behind the dialog.

- `#F188888` - Now, when setting the `layoutOption` to 'Break' in the `insertVideoSettings`, the break is applied to the embedded video element in the Rich Text Editor.

- `#I598973` - Now, when you paste a link and then click the `Shift+Enter`, it should not cause the page to collapse and the cursor to remain maintained properly.

- `#I596139` - Now, the `afterPasteCleanup` event returns the proper values in the `Value`argument when pasting the image into the Rich Text Editor.

- `#I597774` - Now, enabling and disabling the toolbar on the `focus` and `blur` events, respectively, doesn't bind the drop event multiple times, and it works properly.

## 26.1.38 (2024-06-19)

### RichTextEditor

#### Bug Fixes

- `#I593447` - Now, when the Rich Text Editor value is set to null, injecting the count module works properly.

- `#I596042` - Now, pasting the content as plain text in the Rich Text Editor works properly without adding styles.

- `#I595789` - Now, applying the quotation in the Rich Text Editor `markdown` mode works properly.

- `#F188533` - Now, new lines between the text are deleted properly in the Rich Text Editor.

- Now, fixed the issue with font color and the background color popup not opening in rare cases.

- Now, the issue with the Editor instance not being properly destroyed inside the Scheduler Edit Template has been fixed.

## 26.1.35 (2024-06-11)

### RichTextEditor

#### Features

- **Table row and column selection**: Improved the selection of table rows and columns using the mouse or keyboard with Shift + arrow keys, setting the background color of the selected cells. Additionally, enabled table selection when pressing the backspace key after the table and the delete key before the table. Please find the demo link [here](https://ej2.syncfusion.com/demos/#/fluent2/rich-text-editor/tools.html).

- **Default Item in Font Family and Font Size**: Introducing `default` options for font family and font size. When no font family or font size is set for the selected text, it will be manually set to the default values. Please find the demo link [here](https://ej2.syncfusion.com/demos/#/fluent2/rich-text-editor/tools.html).

- `#I525279` - Added support for text formatting in selected table cells, allowing users to apply headings, paragraphs, lists, and inline formats such as bold, italic, and strikethrough to multiple cells at once. Enhanced backspace functionality for clearing selected table cell content. Please find the demo link [here](https://ej2.syncfusion.com/demos/#/fluent2/rich-text-editor/tools.html).

#### Bug Fixes

- `#I583830` - Now, the `tab` key is working properly after inserting the mention list in the Rich Text Editor.

- `#I572346` - Now, paste the mention tag into the Rich Text Editor, which works properly.

- `#F58025` - Now, when the `cssClass` property is configured with more than one class, inserting a link into the Rich Text Editor works properly.

- `#F58018` - Now, the Strikethrough toolbar item recognises the `s` tag in the RichTextEditor and highlight the toolbar item.

#### Breaking Changes

- The formats dropdown in the Rich Text Editor toolbar no longer includes the quotation option. Instead, a new blockquote icon has been introduced in the toolbar's default mode to facilitate applying blockquote. Additionally, the quotation can be added to the formats dropdown using the `formats` property.

- Restructured the DOM element to enable flexible height for the editor area and toolbar by setting `display: flex;` on the first child of the Editor root element.

**Old Element structure**

``` html
    <div id="editor" class="e-control e-richtexteditor">
        <textarea name="editor" id="editor-value"></textarea>
        <div class="e-toolbar-wrapper">
            <div class="e-rte-toolbar e-toolbar"></div>
        </div>
        <div class="e-rte-content">
            <span class="e-rte-placeholder"></span>
            <div class="e-content"></div>
            <textarea class="e-rte-srctextarea"></textarea>
        </div>
        <span class="e-rte-character-count"></span>
    </div>
```

**New Element structure**

``` html
    <div id="editor"  class="e-control e-richtexteditor">
        <div class="e-rte-container">           <!-- display: flex;-->
            <textarea name="editor" id="editor-value"></textarea>
            <div class="e-toolbar-wrapper">
                <div class="e-rte-toolbar e-toolbar"></div>
            </div>
            <div class="e-rte-content">         <!-- flex-grow: 1;-->
                <span class="e-rte-placeholder"></span>
                <div class="e-content"></div>
            </div>
            <div class="e-source-content">
                <textarea class="e-rte-srctextarea"></textarea>
            </div>
            <span class="e-rte-character-count"></span>
        </div>
    </div>
```

## 25.2.7 (2024-06-04)

### RichTextEditor

#### Bug Fixes

- `#I590215` - Now, clicking the cancel and close icon of the insert image dialog while uploading the image will cancel the image uploading API request.

- `#I592457` - Now, when pasting an image in an empty paragraph with a `br` tag inside, the `br` tag is removed after the image is pasted in the Rich Text Editor..

## 25.2.6 (2024-05-28)

### RichTextEditor

#### Bug Fixes

- `#I588147` - Now, The text `&times` should not get converted into `x` when paste from the clipboard into the RichTextEditor.

- `#I582501` - Now, the font size is pasted properly when we copy and paste from MS Word into RichTextEditor.

- `#I586268` - Now, auto-numbering works properly with `enterKey` as `BR` in RichTextEditor.

- `#I564770` - Now, the list type is applied properly to both the parent and the nest list while applying indents in the Rich Text Editor.

- `#I586268` - Now, pressing the Enter key on the side of the image will work properly when `BR` is configured.

## 25.2.5 (2024-05-21)

### RichTextEditor

#### Bug Fixes

- `#I582303` - Now, the Tab key press on selected paragraph works properly in RichTextEditor.

- `#F56019` - Now, pressing the enter key when the cursor is at the end of the empty list creates a new tag based on the `enterKey` property.

- `#F186874` - Now, the background and font color popup's collision will function correctly upon initial click.

## 25.2.4 (2024-05-14)

### RichTextEditor

#### Bug Fixes

- `#I579605` - Now, the editor scrolls to the cursor position after pasting content into the editor.

- `#I581468` - Now, improved the alignment of the pasted images and table content from the new outlook.

- `I566845` - Now, when pasting images from `FSNotes`, the image is uploaded properly to the server in the Rich Text Editor.

- `I564770` - Now, the list type is applied properly to both the parent and the nest list while applying indents in the Rich Text Editor.

- `#I583830` - Now, the `tab` key is working properly after inserting the mention list in the Rich Text Editor.

- `#I562280` - Now, alignment and indentation work properly when the `enterKey` property is configured as `BR`.

- `#I584679` - Now, when the Refresh method is working properly, RichTextEditor is properly refreshed in the initial rendering.

## 25.1.42 (2024-04-30)

### RichTextEditor

#### Bug Fixes

- `#I579856` - Now, Bold action works properly in RichTextEditor when `enterKey` is set to 'BR'.

- `#I52134` - Now, the cursor position remains in the correct place when you use `InsertHtml` executeCommand to insert text into Rich Text Editor after the table.

- `#I572493` - Now, added the new `requestType` property to the `imageUploadSuccess` event argument in Rich Text Editor.

- `#I582707` - Now, RichTextEditor works properly when the font size icon is clicked in the toolbar.

### RichTextEditor

#### Bug Fixes

- `#I581044` - Now, with the content pasted with a table as the last element, a newline will be inserted, and the focus will be maintained on a new line.

- `#I573688` - Now, Bullet list into the Rich Text Editor when using `enterkey` as `BR` work's properly.

- `#I579856` - Now, Bullet list not removed properly when using `enterKey` as `BR` in RichTextEditor work's properly.

- `#I582707` - Now, a script error throws when clicking the font size toolbar in RichTextEditor works properly.

## 25.1.41 (2024-04-23)

### RichTextEditor

#### Bug Fixes

- `#I577917` - Now, The tooltips are destroyed when the dialog with the editor is closed by a keyboard action.

- `#I577198` - Now, inserting the table into the RichTextEditor works properly by using the toolbar insert table.

## 25.1.40 (2024-04-16)

### RichTextEditor

#### Bug Fixes

- `#I569839` - Now, the `title` attribute is added properly for the audio and video elements, inserted using the `executeCommand` public method in the Rich Text Editor.

- `#I572603` - Now, pressing the enter key after inserting the table work's properly.

- `#I567787` - Now, copy and paste text into the Rich Text Editor when using `enterkey` as `BR` work's properly.

## 25.1.39 (2024-04-09)

### RichTextEditor

#### Bug Fixes

- `#I572044` - Now the cursor is set after the image when you paste the image only when `PasteCleanup` module is used into the Rich Text Editor.

- `#I569849` - Now, the abort icon and uploading percentage are aligned properly in the image dialog of the Rich Text Editor.

- `#I570370` - Now, the backspace key is working properly when copying and pasting an image with content.

- `#I553157` - Now, the bullet format list gets removed properly when we replace the content in RichTextEditor.

- `#I572138` - Now, pressing the enter key by placing the cursor at the end of the table creates a new line, and the cursor is focused on the new line.

## 25.1.38 (2024-04-02)

### RichTextEditor

#### Bug Fixes

- `#I564756` - Now, the list is applied properly to the selected content when continuously clicking the number or bullet list button in the Rich Text Editor.

- `#F187199` - When using the keyboard action `ctrl + A` in RichTextEditor, the inline quick toolbar works properly.

- `#I553375` - Now, list style is maintained properly when removing a single list in RichTextEditor.

- `#I568091` - Now, using Inline Editor doesn't scroll to the top when clicking FontColor or other toolbar items in Rich Text Editor.

- `#I572787` - Now, the pasted text replaces the previous texts properly in the RichTextEditor.

- `#I570076` - Now, the `InsertHtml executeCommand` works properly when inserting HTML by selection.

## 25.1.37 (2024-03-26)

### RichTextEditor

#### Bug Fixes

- `#I559868` - Now, paste using the clean or plain text option within the RichTextEditor, the XML tags aren't added.

- `#I558265` - Now, when changing the formats using the toolbar in RichTextEditor, the cursor position is placed properly.

- `#I564770` - Now, using indents on a numbered or bulleted list in RichTextEditor, it works properly.

- `#I568007`, `#I568175` - Now, the Table Quick toolbar items are aligned properly in the Tailwind theme.

## 25.1.35 (2024-03-15)

### RichTextEditor

#### Bug Fixes

- The smoothness and performance of table cell resizing have improved.

- Improved the image resize function to keep the aspect ratio when resizing.

- When Quick Toolbar is active, press <kbd>Alt + F10</kbd> to focus on Quick Toolbar items.

- `#I51118` - Now, the pasted content with the picture element will have proper source values.

- `#I555698` - Now, the customized text is shown properly in the `numberFormatList` icon's tooltip in the Rich Text Editor.

- `#I561056` - Now, the font color is applied properly to the hyperlink text when clicking the `fontcolor` icon in Rich Text Editor.

## 24.2.9 (2024-03-05)

### RichTextEditor

#### Bug Fixes

- `#I550863` - Now the script error doesn't show when all content is selected and pasted into the Rich Text Editor.

- `#I555677` - Now the list format is working properly when press the backspace key in a list in RichTextEditor.

- `#I558397` - Now the Emoji Picker popup is shown properly within the inline Rich Text Editor.

- `#I558168` - Now, the font color  toolbar works properly when using the inline toolbar of the Rich Text Editor.

- `#I558398` - Now, after pasting an image, the inline editor toolbar items should show properly in RichTextEditor.

## 24.2.8 (2024-02-27)

### RichTextEditor

#### Bug Fixes

- `#F186601` - Now, the `e-control` class name is removed properly from the body element in the Rich Text Editor.

- `#I553157` - Now the numbered and bulleted list is removed properly when deleting the entire list using the backspace key in RichTextEditor.

- `#I553375` - Now, the bullet or number list works properly when we try to remove a single line from the list in the RichTextEditor.

## 24.2.7 (2024-02-20)

### RichTextEditor

#### Bug Fixes

- `#I552276` - Now, pasting the image after the link in the Rich Text Editor pastes the image outside the link.

- `#I552815` - Now, override a text in the Rich Text Editor anywhere it works properly.

- `#I553375` - Now, clicking the number or bullet list button in the Rich Text Editor allows the applied list to be reverted.

- `#I553814` - Now, pressing the Enter key after pasting an image in the Rich Text Editor works properly.

- `#I540536` - Now, The issue with the addition of previous format when typing after the backspace/delete action has been resolved.

- `#I544943` - Now, pasting images along with content in different languages from MS Word in the Rich Text Editor works properly.

- `#I552726` - Now, pressing the backspace key inside the list after pressing the `shift+enter` key with background color styles works properly.

## 24.2.4 (2024-02-06)

### RichTextEditor

#### Bug Fixes

- `#F183065` - Now, applying the mention by using the '&' keyword in the text editor is now properly working.

- Now, the audio will be inserted properly in the Rich Text Editor `iframe` mode.

## 24.2.3 (2024-01-31)

### RichTextEditor

#### Bug Fixes

- `#I530749` - Now, the `change` event is triggered properly when inserting the mention list items in the Rich Text Editor.

- `#I534487` - Now, applying the bold format to the Rich Text Editor when focusing on another Rich Text Editor in the page works properly.

- `#I539510` - Now, when an empty string `value` is loaded, the cursor will not focus automatically in the Rich Text Editor.

## 24.2.3 (2024-01-31)

### RichTextEditor

#### Bug Fixes

- `#I534094` - Now, when using the `click` event with a custom toolbar template, the Rich Text Editor works properly.

- `#I541522` - Now, when the window is resized to the minimum width, the Rich Text Editor's content font size is updated properly.

## 24.1.47 (2024-01-23)

### RichTextEditor

#### Bug Fixes

- `#I542710` - Now, pressing the `tab` key in the list applies the nested list properly when the mention component is used in the Rich Text Editor.

## 24.1.46 (2024-01-17)

### RichTextEditor

#### Bug Fixes

- `#I537067` - Now, the content at the top is displayed properly when maximizing the Rich Text Editor with `enableFloating` set to `false`.

- `#I534484` - Now, applying the bold repeatedly to the content in the Rich Text Editor works properly, and the content doesn't get deleted.

- `#I531848` - Now, pressing the space or enter key after inserting the mention list in the Rich Text Editor doesn't scroll the page.

## 24.1.45 (2024-01-09)

### RichTextEditor

#### Bug Fixes

- `#I534488` - Now, applying different style formats without focusing inside the Rich Text Editor works properly.

- `#I534481` - Now, when applying the font family `Arial` to the text content in the Rich Text Editor, the toolbar status is updated properly.

## 24.1.43 (2023-12-27)

### RichTextEditor

#### Bug Fixes

- `#I518537` - Now, the paste format prompt dialog appears properly when pasting the content into the Rich Text Editor.

## 24.1.41 (2023-12-18)

### RichTextEditor

#### Bug Fixes

- `#I522154` - Now, `maxLength` property is calculated properly when pasting the content into the Rich Text Editor.

- `#F185398` - Now, `Opus` and `M4a` audio formats are supported in the Rich Text Editor.

- `#I526413` - Now, the `imageRemoving` event exposes the correct arguments in the Rich Text Editor.

- `#I527590` - Now, pasting content from the input field pastes at the cursor point instead of a new line.

- `#I511988` - Now, the `NumberFormatList` and `BulletFormatList` icons look properly and are different from each other in all the themes.

- `#I528544` - Now, the image will be deleted properly, along with the caption, when the delete key is pressed.

- `#I519493` - Now, font styles are applied properly to the numbered and bullet format list items in RichTextEditor.

- `#I518537` - Now, font family styles are properly applied to the list content when copied and pasted from MS Word.

#### Breaking Changes

- Now, the shortcut key to open the Insert video dialog has been changed to <kbd>CTRL+ALT+V </kbd> from <kbd>CTRL+SHIFT+V</kbd> to ensure that the Paste as plain text browser shortcut works properly.

## 23.2.7 (2023-12-05)

### RichTextEditor

#### Bug Fixes

- `#I525285`- Now, when copying content from a Word document and pasting it into the Rich Text Editor, it would not remove the non-breaking space.

- `#I515735`- Now, the alternative dialog opens based on the image position, preventing unwanted scrolling.

- `#I517343`- Now, the table style status is updated properly in the table quick toolbar dropdown items in the Rich Text Editor.

- `#I524361`- Now, pressing the enter key when `enterKey` is configured as `BR` and the cursor is at the start of the line works properly.

- `#I518641` - Now, the RichTextEditor is working properly when click the full screen toolbar icon.

## 23.2.6 (2023-11-28)

### RichTextEditor

#### Bug Fixes

- `#I515378` - Now, the toolbar status will be properly updated when the toolbar is enabled dynamically in the Rich Text Editor.

- `#I512106` - Now, the quick toolbar will be destroyed without any script errors during page navigation.

- `#I521260` - When clicking the escape key, the table creation popup closes properly in the RichTextEditor component.

## 23.2.5 (2023-11-23)

### RichTextEditor

#### Bug Fixes

- `#I518641` - Now, clicking the full-screen toolbar item works properly without any script errors in the RichTextEditor.

- `#I517381` - Now, the maximum row limit of the table is increased to `1000` from `50` in the Rich Text Editor.

## 23.2.4 (2023-11-20)

### RichTextEditor

#### Bug Fixes

- `#I515728` - Now, applying the underline format to the anchor element works properly in the Rich Text Editor.

- `#I503021` - Now, when using a custom dropdown button as a toolbar item to insert content using `insertHTML` in the Rich Text Editor, the cursor position is placed properly.

## 23.1.44 (2023-11-07)

### RichTextEditor

#### Bug Fixes

- `#I509612` - Now, the `FontName` toolbar item's status will be updated as empty when the selected text contains multiple font family styles.

- `#I514862` - Now, alternate text for images is properly displayed in the input element.

- `#I514862` - Now, the XSS attack is prevented in the width and height inputs of the image resize dialog in the Rich Text Editor.

- `#I517445` - Now, the text alignment and other styles are maintained when pressing the enter key in the Rich Text Editor.

- `#I514865` - Now, the display text with white space works properly when inserting a link in the Rich Text Editor.

## 23.1.43 (2023-10-31)

### RichTextEditor

#### Bug Fixes

- `#I456729` - Now, pasting the cropped images from MS Word into the Rich Text Editor works properly.

- `#I500444` - Now, when pasting the list content from MS Word, the margin bottom style will be set properly.

- Now, the toolbar's preview button function works properly when the Rich Text Editor `itemConfigs` property is set with `toolbarSettings`.

- `#I509912` - Now, the `toolbarClick` event is triggered when the emoji picker toolbar item is clicked before the opening of the emoji picker popup.

- `#I513543` - Now, pasting the content from the online MS Excel works properly without pasting any additional style content.

## 23.1.41 (2023-10-17)

### RichTextEditor

#### Bug Fixes

- `#I501441` - Now, entering more than one character works without any console error.

- `#I502504` - Now, cancelling undo and redo actions using the `actionBegin` event's cancel argument works properly.

- `#I499852` - Now, pressing the enter key when the cursor is placed next to the image after pasting the image works properly.

- `#I501846` - Now the Format Painter will copy and paste the list with paragraph elements.

- `#I499862` - Now, pasting contents into the RichTextEditor works properly.

- `#I498006` - Now, the `NumberFormatList` and `BulletFormatList` icon functions on the Safari browser are working properly.

- `#I503797` - Now, the `CMD+B` shortcut works properly in the Safari browser.

## 23.1.40 (2023-10-10)

### RichTextEditor

#### Bug Fixes

- `#I502310` - Now, the `value` argument in the `valueChange` event does not include the table resize helper element.

## 23.1.39 (2023-10-04)

### RichTextEditor

#### Bug Fixes

- `#I499363` - Now, the issue with the heading colour set to blue after copying and pasting content from MS Word has been resolved.

- `#I500996` - Now, the issue with the table resize icon is missing when the mouse is dragged out of the editor and clicked outside the table has been resolved.

- `#I493182` - Now, the issue with the `enablePersistence` API not working properly in the Rich Text Editor on page navigation has been resolved.

- `#F184513` - Now, integrating with Mention, the `actionBegin` and `actionComplete` events work properly.

- `#I488206` - Now, pasting contents into the Rich Text Editor when `enterKey` is configured as `DIV` works properly.

- `#I499035` - Now, the Rich Text Editor renders properly without any `sass` compilation errors.

- `#I499071` - Now, the image focus and resize class names are removed properly when the editor is focused out.

- `#I497587` - Now, the RichTextEditor height property works properly in percentage value.

- `#I503797` - Now, the shortcut key 'Command + B' is working fine on a Mac machine.

- `#I840680` - Now, the complex table resizing will work properly for the middle columns in the Rich Text Editor.

- `#I846935` - Now, the last and first column of the table resizing will work properly in the Rich Text Editor.

## 23.1.36 (2023-09-15)

### RichTextEditor

#### Features

- **Cropped image paste from MS Word**: This feature allows users to paste the cropped images from MS Word into the Rich Text Editor.

- **Quick Format Toolbar**: `#I445348`- Introducing the Quick Format Toolbar for text support, enhancing your editing experience with convenient formatting options when selecting text in the editor.

#### Bug Fixes

- `#I481117` - Now, pasting multiple images from the MS Word into the Rich Text Editor works properly.

- `#I494646` - Now, the full screen icon's tooltip removed properly when switching to full screen in the Rich Text Editor.

- `#I493182` - Now, the `enablePersistence` API works properly in the Rich Text Editor on page navigation.

- `#I491731` - Now, the indentation works properly when pasting the content from notepad.

- `#I495375` - Now, the `enableHtmlSanitizer` API works properly in the Rich Text Editor.

- `#F183553` - Now, pressing the enter key after opening any dialog in the Rich Text Editor doesn't submit the form.

- `#I488318` - Now, the cursor position is set properly when pressing the space key in the Rich Text Editor.

- `#I468317` - Now, the enter key action works properly while setting `enableXhtml` to true when there is null value in the Rich Text Editor.

- `#I492704` - Now, pressing the enter key when the cursor is placed after the video works properly.

- `#I481117` - Now, pasting multiple base64 images into the Rich Text Editor triggers the upload process properly.

- `#I485336` - Now, the pasting multiple images into the Rich Text Editor triggers the upload process properly.

- `#I496219` - Now, the tooltip is not open while opening the dialog.

- `#I488318` - Now, the cursor position is set properly when pressing the space key in the Rich Text Editor.

## 22.2.12 (2023-09-05)

### RichTextEditor

#### Bug Fixes

- `#F183553` - Now, pressing the enter key after opening any dialog in the Rich Text Editor doesn't submit the form.

## 22.2.10 (2023-08-22)

### RichTextEditor

#### Bug Fixes

- `#I488885` - Now, pressing `CTRL + Enter` does not trigger the enter action in the Rich Text Editor.

## 22.2.9 (2023-08-15)

### RichTextEditor

#### Bug Fixes

- `#I481854` - Now, pasting the content into the Rich Text Editor, which is rendered inside the Dialog without manually focusing the editor, works properly.

- `#I484797` - Now, pressing the backspace key when the cursor is placed after a line with a `br` tag works properly.

## 22.2.5 (2023-07-27)

### RichTextEditor

#### Bug Fixes

- `#I465794` - Now, pasting the content from MS Word works properly without any console errors in the Rich Text Editor.

- `#I477643` - Now, resizing the last column in the table works properly after copying and pasting the content from MS Word in the Rich Text Editor.

- `#F183438` - Now, the value of the Rich Text Editor is updated properly when the `readOnly` property is initially set to true and then changed dynamically.

## 22.1.39 (2023-07-18)

### RichTextEditor

#### Bug Fixes

- `#I482404`, `#I467318` - Now, pasting the content along with images from MS Word works properly in the Rich Text Editor.

## 22.1.38 (2023-07-11)

### RichTextEditor

#### Bug Fixes

- `#I472020` - Now, pasting content from MS Word with an image inside the table into the Rich Text Editor works properly.

## 22.1.36 (2023-06-28)

### RichTextEditor

#### Bug Fixes

- `#F181123` - Now, resizing the table and resizing the columns in the table work properly in the Rich Text Editor.

- `#I473523` - Fixed the issue where column resizing was not working properly in the Rich Text Editor component.

## 22.1.34 (2023-06-21)

### RichTextEditor

#### New Features

- **Format Painter**: This feature allows users to quickly copy and apply formatting from one section of the selected text to another using keyboard shortcuts or a toolbar button.

- **Emoji Picker**: This feature allows users to insert an emoji into their content by easily browsing or searching using the search option and selecting from a wide range of emojis. The emoji picker can also be accessed by pressing the colon `:` key in the editor.

#### Bug Fixes

- `#I471317` - Now, applying list format with an empty starting line works properly in the Rich Text Editor.

- `#I456729` - Now, copying and pasting the list contents from MS Word works properly in the Rich Text Editor.

- `#I469435` - Now, pressing backspace key works properly when `Mention` is used inside the Rich Text Editor.

## 21.2.10 (2023-06-13)

### RichTextEditor

#### Bug Fixes

- `#I465794` - Now, the bulleted list format is aligned properly when pasted from MS Word into the Rich Text Editor.

- `#I468056` - Now, the table quick toolbar popup position can be changed properly in the Rich Text Editor.

- `#I467318` - Now, pasting the content alone with the image from MS Word works properly in the Rich Text Editor.

## 21.2.9 (2023-06-06)

### RichTextEditor

#### Bug Fixes

- `#I458845` - Now, entering any value at the end of the content in the Rich Text Editor works properly.

## 21.2.8 (2023-05-30)

### RichTextEditor

#### Bug Fixes

- `#I464428` - Now, the underline and strikethrough toolbar status are updated properly after pasting the content.

## 21.2.6 (2023-05-23)

### RichTextEditor

#### Bug Fixes

- `#I456729` - Now, the table row delete works properly even after cell merging is done in the table in the Rich Text Editor.

- `#I456729` - Now, the multilevel lists are aligned properly when pasting the list content from MS Word into the Rich Text Editor.

- `#I459516` - Now, when using the backspace key in Rich Text Editor, the random spaces will not be removed.

- `#I449973` - Now, when inserting the Mention list into the Rich Text Editor using the `Tab` key, the mention character will no longer appear.

## 21.2.5 (2023-05-16)

### RichTextEditor

#### Bug Fixes

- `#I456729` - Now, pasting the content alone with images from MS Word works properly in the Rich Text Editor.

- `#I420916` - Now, RichTextEditor is in RTL mode, the direction of the toolbar items has changed properly.

## 21.2.4 (2023-05-09)

### RichTextEditor

#### Bug Fixes

- `#I439501` - Now, when pasting the list content from MS Word, the roman number list formats are aligned properly.

- `#I456849` - Now, when the image is loaded from the Rich Text Editor value the resizing works properly.

## 21.1.41 (2023-04-18)

### RichTextEditor

#### Bug Fixes

- `#I450341` - Now, when `enableXhtml` is enabled in Rich Text Editor the `contentEditable` attribute is not removed from the `Mention` element.

## 21.1.39 (2023-04-11)

### RichTextEditor

#### Bug Fixes

- `#I449820` - Fixed the issue where the Placeholder was not working in Iframe mode in Rich Text Editor.

- `#I450797` - Resolved issue where typed content and placeholder in the Rich Text Editor would merge when the `TAB` key was used to focus on the component.

- `#I453953` - Resolved the issue where script error is thrown when clicking clear format toolbar while no content in Rich Text Editor.

## 21.1.35 (2023-03-23)

### RichTextEditor

#### Bug Fixes

- `#I442919` - Now, when focusing out of the Rich Text Editor, the embed YouTube video will not be removed.

#### New Features

- **Tooltip Integration**: The Rich Text Editor tooltip has been redesigned to more clearly display the keyboard shortcut information, making it easier for users to understand the functions of each toolbar item.

## 20.4.53 (2023-03-07)

### RichTextEditor

#### Bug Fixes

- `#F180013` - Resolved issue where pasting from Word with `enterKey` configuration set to `BR` did not work properly in the RichTextEditor.

- `#I440490` - Now, the inline toolbar will be shown while selecting text in the Rich Text Editor using the keyboard.

- `#I440456` - Now, expanding the toolbar will work properly when the width of the Rich Text Editor is half the screen size.

- `#I436678` - Now, the image is not duplicated when it is pasted into the Rich Text Editor and performing `shift+enter` key action.

- `#I439501` - Now, when pasting the list content from MS Word, the subset formats and alignment are maintained properly.

- `#I439501` - Now, pasting the content from MS Word with the `enterKey` configured as `BR` works properly.

## 20.4.52 (2023-02-28)

### RichTextEditor

#### Bug Fixes

- `#I434928` - Now, the last column is not resized to the end of the table when the middle column is resized.

- `#I436678` - Now, the image is not duplicated when you press the `shift+enter` key in the Rich Text Editor.

- `#I438653` - Now, the font size will be updated properly in the toolbar status when it is set dynamically.

- `#I437138` - Now, the pasted content from word which contains images is inserted into Rich Text Editor.

- `#I439308` - Now, dynamically rendering the Rich Text Editor inside the Sidebar works properly when scrolling.

- `#I440456` - Now, the list is deleted properly when pressing the backspace key, and pressing the enter key works properly after deleting the list.

## 20.4.51 (2023-02-21)

### RichTextEditor

#### Bug Fixes

- `#I431289` - Fixed issue where pasting text from MS Word into the Rich Text Editor and pressing enter caused bullet point text to be removed.

## 20.4.50 (2023-02-14)

### RichTextEditor

#### Bug Fixes

- `#I436733` - Resolved issue with missing closing tag when getting the value of the RichTextEditor text area while `enableXhtml` is true.

- `#I433202` - The issue of the Rich Text Editor not adjusting to the `pasteCleanUp` popup's height when using `saveInterval` has been resolved.

- `#I434928` - Fixed the script error raised and the issue with table columns couldn't be resized after cellMerge has been resolved.

## 20.4.49 (2023-02-07)

### RichTextEditor

#### Bug Fixes

- `#I419211` - Fixed issue where list content copied and pasted from MS Word was not properly aligned.

## 20.4.48 (2023-02-01)

### RichTextEditor

#### Bug Fixes

- `#I425631` - The issue of pasted text exceeding the boundaries of the `contenteditable`, when using the Enter Key as a 'BR' or 'DIV' has been resolved.

- `#I430486` - Now, font size applied properly for the numbered lists in Rich Text Editor.

### RichTextEditor

#### Bug Fixes

- `#FB39526` - Now, the page doesn't scroll down on the initial render when custom `background/foreground` toolbars are configured.

- `#I430029` - Fixed the issue with an unwanted 'A' Letter appearing at the bottom of the font color picker popup.

## 20.4.44 (2023-01-18)

### RichTextEditor

#### Bug Fixes

- `#F179573` - Now, when typing in the Rich Text Editor the issue of letters appearing slowly has been resolved.

- `#I417838` - Now, the `Underline` and `Strikethrough` toolbar styles applied properly when we modify the `font-size` in the editor.

- `#I428203` - Now, the `Numbered list` will work correctly after applying indent to the pasted list with the paste clean-up settings enabled.

## 20.4.43 (2023-01-10)

### RichTextEditor

#### Bug Fixes

- `#I423129` - Now, resolve the script error thrown after full screen and close the bootstrap modal dialog

- `#I423129` - Now, the buttons for bold, italic, underline, and strikethrough are highlighted properly.

- `#I426859` - Now, when the Rich Text Editor is included inside a Dashboard panel, no exception is raised.

- `#I425631` - Now, with the `enterKey` configuration set to `BR` the script error is no longer raised while modifying values in the editor.

- `#I420264` - Now, the Code Format feature will now work correctly when you copy and paste the code into the Editor with the paste clean up settings enabled.

- `#I424567` - Now, the quick table toolbar is not misplaced outside the Rich Text Editor when enabling IFrame.

## 20.4.40 (2022-12-28)

### RichTextEditor

#### Bug Fixes

- `#I425639`, `#I425631` - Now, when editing the values in the Rich Text Editor, the script error is not thrown.

- `#I423129` - The toolbar bottom border now displays correctly while maximizing and minimizing the Rich Text Editor.

- `#F179458` - Now, localization text of source Code and preview in tooltip are shown properly when hover the icons.

- `#F179343` - Now, maximize and minimize toolbar icon of localization text is shown properly when hover the icons.

## 20.3.47 (2022-09-29)

### RichTextEditor

#### New Features

- **Insert Audio & Video**: This feature allows the editor to insert `audio` and `video` files from the local path or web URL or embed URL from sources such as YouTube or Vimeo and customize it by using the quick toolbar.

#### Bug Fixes

- `#F177143` - When using the keyboard buttons in RTE to navigate to the next cell, the Table selection is now removed.

## 20.2.50 (2022-09-20)

### RichTextEditor

#### Bug Fixes

- `#I398633` - Now, when hovering over the elements inside the table body, the script error is not thrown.

## 20.2.49 (2022-09-13)

### RichTextEditor

#### Bug Fixes

- `#I396942` - Now, the Rich Text Editor unique Id is generated automatically when we do not set the Id property

- `#F177047` - Now, the tooltip is shown for the number and bullet format list in the Rich Text Editor toolbar items.

## 20.2.46 (2022-08-30)

### RichTextEditor

#### Bug Fixes

- `#I386619` - Now, when you switch to full screen, there is no longer a blank white space under the toolbar in the RTE.

## 20.2.44 (2022-08-16)

### RichTextEditor

#### Bug Fixes

- `#I390850` - Now, the first list item will be removed properly when placing the cursor at the start of the first list item and pressing the backspace key.

- `#I386938` - Now, resizing the image works properly even after resizing the Rich Text Editor using the browser window.

- `#I90850` - Now the issue with ‘When selecting a list in the Rich Text Editor and pressing the shift key, the strike through and underlining styles are deleted’ has been resolved.

- `#I396553` - Now, pressing the enter key after pressing backspace when the cursor is at the start of the first list item works properly in the `Firefox` browser.

- `#I396244` - Now, inserting emoticons using the `executeCommand` public method after entering the `&` symbol in the editor inserts the emoticons at the correct cursor position.

## 20.2.43 (2022-08-08)

### RichTextEditor

#### Bug Fixes

- `#FB36307` - Now, pressing the tab key to focus out of the Rich Text Editor when Iframe mode is enabled and `saveInterval` is set as 0, the change event will be triggered properly.

## 20.2.40 (2022-07-26)

### RichTextEditor

#### Bug Fixes

- `#I380086` - Now, resizing the table's first and last columns when the Rich Text Editor is rendered inside the Grid component works properly.

- `#I391326` - Now, the Font-family value property is case-Insensitive in the Rich Text Editor.

- `#I388270` - Now, Script error is not thrown when we click background color toolbar of the RTE, which is rendered inside a table.

## 20.2.39 (2022-07-19)

### RichTextEditor

#### Bug Fixes

- `#I388456` - Now, when an empty span tag is loaded in the Rich Text Editor, the text displays properly.

- `#I386938` - Now, the Image resize in the Rich Text Editor works properly.

- `#I386940` - Now, clicking `ctrl+B` continuously in list element works properly.

## 20.2.38 (2022-07-12)

### RichTextEditor

#### Bug Fixes

- `#I385741` - Now, pressing the `ctrl+c` or `shift` key on the link inside the list doesn't remove the link.

- `#I386619` - Now, the content area is visible properly when maximizing and minimizing the Rich Text Editor.

- `#I385281` - Now, the height of the link, image, and table dialog when the RichTextEditor is in full-screen mode works properly.

## 20.2.36 (2022-06-30)

### RichTextEditor

#### New Features

- `#I380086` - Provided support to resize the first and last columns of a table without resizing the other columns.

- `#I362331`, `F173395`, `I318486` - Provided support to insert text programmatically in the Markdown editor at the current cursor position using the `executeCommand` public method.

## 20.1.61 (2022-06-21)

### RichTextEditor

#### Bug Fixes

- `#I384191` - Now, pasting text content alone with images from MS Word works properly in the Rich Text Editor.

## 20.1.60 (2022-06-14)

### RichTextEditor

#### Bug Fixes

- `#I380279` - Now, the Image Resize icon is shown properly when Iframe is enabled.

- `#I381276` - Now, image alignment is maintained with Iframe mode when focusing on the component.

## 20.1.59 (2022-06-07)

### RichTextEditor

#### Bug Fixes

- `#I378184` - Now, the script error is not thrown when resizing the Rich Text Editor component with inline mode.

- `#I381208` - Now, applying bold multiple times using `ctrl+b` on the nested list works properly.

## 20.1.58 (2022-05-31)

### RichTextEditor

#### Bug Fixes

- `#I378721` - Now, pressing the enter key on the selection of multiple paragraph contents works properly in the `Firefox` browser.

- `#I378378` - Now, copying and pasting the contents with a length that exceeds the `maxLength` API is properly prevented.

- `#I378378` - Now, adding a link, image, and table is properly prevented when the content length exceeds the `maxLength` API limit.

- `#I376816` - Now, applying the list by selecting all content that is pasted in the Rich Text Editor on the `Firefox` browser works and doesn't raise any console errors.

- `#I378378` - Now, copying and pasting the contents with a length less than or equal to the `maxLength` API is pasted properly in the Rich Text Editor.

- `#I380152` - Now, typing content in the Rich Text Editor when loading empty `P` tags in the `Iframe` mode works properly.

- `#I380165` - Now, the focus will be maintained properly after pressing the enter key in the Rich Text Editor when loading empty `P` tags.

## 20.1.57 (2022-05-24)

### RichTextEditor

#### Bug Fixes

- `#I376816` - Now, pressing the backspace or delete key after selecting all list contents in the Rich Text Editor removes the list properly.

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
