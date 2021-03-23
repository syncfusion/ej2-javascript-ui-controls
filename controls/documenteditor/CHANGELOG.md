# Changelog

## [Unreleased]

## 18.4.49 (2021-03-23)

### Document Editor

#### Bug Fixes

- `#317061` - The merged cell table border rendering issue is resolved.
- `#318283` - Resolved script error while editing the last section header.
- `#310874` - The table with the merged cell is exporting properly.
- `#162017` - Restart page numbering is now preserved properly on exporting.
- `#316810` - Spell check script error is now resolved for layout type change.
- `#163236` - Strike through and underline content are now copy-pasted properly.

## 18.4.48 (2021-03-16)

### Document Editor

#### Bug Fixes

- `#163116`, `#317496`, `#315005` - Implemented the line spacing Hanging similar to MS word.
- `#317691` - Resolve the Number formatting after applying bullet formats.
- `#317524` - Replace all with empty string is now working.
- `#317605` - Shape with line format value null was now preserved properly.
- `#317150` - Can press 'p' key in Firefox after control + a and then backspace.
- Resolve hanging issue while opening document.
- `#315656` - Resolve script error when importing document.

## 18.4.47 (2021-03-09)

### Document Editor

#### Breaking Changes

- The `DictionaryData(int langID,string dictPath,string affPath,string customPath)` is marked as obsolete. Please use the alternate new constructor `DictionaryData(int langID, string dictPath, string affPath)` in `Syncfusion.EJ2.SpellChecker` spell checker.
- The `SpellChecker(List<SpellCheckDictionary> dictItem)` is marked as obsolete. Please use the alternate new constructor `SpellChecker(List<DictionaryData> dictItem, string customDicPath)` in `Syncfusion.EJ2.SpellChecker` spell checker.

#### Bug Fixes

- `#315096` - Selection behaviour is updated properly, while pasting a URL and clicking enter after the URL.
- `#315413`, `#317463` - Table cell is now rendered properly.
- `#314467` - Find and replace is now working properly.
- `#315441` - While inserting same bookmark multiple times and deleting, bookmarks were preserved properly now.
- `#316532` - ParagraphFormat is now preserved while pasting with text only option.
- `#314193` - Document with charts were now preserved properly on exporting.
- `#161908`, `#318321` - Added API to show/hide restrict editing pane.
- `#315435` - Table cell width now preserved properly on editing.
- `#162638` - Table background color was now updated properly on updating borders and shading.

## 18.4.46 (2021-03-02)

### Document Editor

#### Bug Fixes

- `#311796`, `#316639`, `#308845`, `#316676`, `#162561` - All the pages in the document were now loaded properly.
- `#309052`, `#315953` - Footnote now layouts properly.
- `#307997` - Resolved issue on updating the bullet list.
- `#314313`, `#316278` - When copy pasting the merge field, merge field was now preserved properly.
- `#315435` - Table cells layouts properly now.
- `#315413`, `#317463` - Table cells renders to preferred width now.

## 18.4.44 (2021-02-23)

### Document Editor

#### Bug Fixes

- `#313564`, `#314479` - Bookmark co ordinates were now updated properly.
- `#162017` - Restart page number behaviour was implemented also for page break now.
- `#310874` - Table with merged cells were exported properly now.
- `#162017` - Page number was now updated properly based on page index.
- `#313821` - Table column were now layout properly.
- `#311371` - While deleting the bookmark extra spaces between the text were now removed properly.
- `#312082` - Resolved script error on updating TOC.
- `#312306` - Hyperlink label was not added while editing the link address now.

## 18.4.43 (2021-02-16)

### Document Editor

#### Bug Fixes

- `#160804`, `#160805` - Line space was now considered properly on exporting.
- `#161513` - Properties pane was now disabled while enabling restrict editing.
- `#311371` - While deleting a text extra spaces between the text were now removed properly.
- `#311884` - Document with table was imported properly now.
- `#310754` - Hebrew text was now layout properly with spaces and numbers renders properly.
- Resolved performance lagging issue while editing.

## 18.4.42 (2021-02-09)

### Document Editor

#### Bug Fixes

- `#311518` - Vertical scrollbar was now updated properly on container resize.
- `#161047` - Document with tab stop was now exported properly.
- `#310258` - All the contents were preserved on pasting now.
- `#307321`, `#309396` - Line shape was now rendered properly.
- `#307321`, `#313943` - Tab stops were now rendered properly.
- `#311296` - Odd headers were added to all odd pages now.
- `#307321`, `#313948` - Straight connectors were now rendered properly.
- `#309565` - When enable track changes is false changes tab is hide in review pane now.

## 18.4.41 (2021-02-02)

### Document Editor

#### Bug Fixes

- `#264813` - List tab element now layouts properly.
- `#309425` - Paragraph formats were considered while creating a new table.
- `#309976` - List was not updated properly from level 1 to level 2.
- `#306480` - Review pane was now updated properly on resizing.
- `#309052` - Document with footnote now rendered properly without overlap.
- `#309565` - When enable comment is false comment tab is hide in review pane now.
- `#307321` - Table with no cell border now rendered properly.
- `#307860` - While pasting no extra paragraph was added now.
- `#311336` - Text was now updated properly on undo without overlap.

## 18.4.35 (2021-01-19)

### Document Editor

#### Bug Fixes

- `#160177` - The document with tables were now rendered properly without page unresponsive error.
- `#305777` - Selection was now updated properly on zooming for web layout.
- `#297705` - Handled behaviour similar to MS Word if page and section break in same paragraph.
- `#305110` - The document with large tables were now rendered properly without page unresponsive error.
- `#307321` - Table borders now renders properly if the border color is none.
- `#303643` - Edit hyperlink now works properly on image with hyperlink.

## 18.4.34 (2021-01-12)

### Document Editor

#### Bug Fixes

- `#306130` - The document content now renders properly while pasting the contents after inserting header with maximum header distance.
- `#307321` - Top borders of table with merged cell were rendered properly now.
- `#307746`, `#307748` - Auto fit tables were rendered properly now.
- `#309747` - Resolved spelling issue on default font family collection.
- `#295084`, `#291801` - Charts were now rendered properly on pasting.
- `#307318`, `#307327` - Creation of new comment was now restricted until existing comment was posted or discarded.
- `#307321` - Tab stop was rendered properly now.
- `#299850` - Auto fit table with preferred width and cell width was now rendered properly.
- `#308899` - Track changes revision was now preserved properly for justified paragraph.

## 18.4.33 (2021-01-05)

### Document Editor

#### Bug Fixes

- `#297703`, `#160488` - Cursor was now updated properly for RTL languages.
- `#307715` - Table with merged cells were now exported properly.

## 18.4.32 (2020-12-29)

### Document Editor

#### Bug Fixes

- `#306939` - Table with merged cells were now exported properly.
- `#302508` - List format was now preserved properly after pasting some content in list line.
- `#299511` - On discarding the comment, comment tag was removed properly on file level now.

## 18.4.31 (2020-12-22)

### Document Editor

#### Bug Fixes

- `#305640` - Track changes is now preserved properly on exported document.
- `#305804` - Document scrolling is now working properly when document contains clipped image.
- `#305804` - In IE, Ctrl+ P is now working properly without text insertion in cursor position.
- `#299850` - Paragraph format was now applied properly inside the table.
- `#304588` - Application level formats were now preserved properly.
- `#305834`, `#302444` - Comment tab is also visible now while clicking on the track changes.
- `#301314` - Resolved the script error thrown on entering a new line and backspace sequentially.

## 18.4.30 (2020-12-17)

### Document Editor

#### New Features

- `227250`, `143540`, `234463`, `252453`, `267474`, `67852`, `268213`, `273871`, `285146`, `288507`, `290372`, `295055`, `295548` - Added support for Footnote and Endnote.

## 18.3.53 (2020-12-08)

### Document Editor

#### Bug Fixes

- `305508` - Resolved page unresponsive error while selecting field.
- `302470` - Chart series color now applied properly.
- `292515` - Resolved paste option issue on IE.

## 18.3.52 (2020-12-01)

### Document Editor

#### Bug Fixes

- `302151` - Vertical alignment for cell now working properly in header and footer.
- `304069` - Table cell spacing now exported properly.
- `304048`, `294075` - Auto fit table is now layout properly if table has preferred width.

## 18.3.51 (2020-11-24)

### Document Editor

#### Bug Fixes

- `#291766`, `#293053` - Resolved the page unresponsive error while selecting the image.
- `#301016` - Multiple server calls on optimized spell checking was now optimized to single call per page.
- `#300330` - Document with comment can be opened without any script errors now.
- `#292912`, `#293388` - Document with empty comment is now exported properly.
- `#299940` - Table with center alignment is now rendered properly and footer contents are rendered properly now on zooming.
- `#290277` - Navigating to bookmark now works properly without script error.
- `#301035`, `#300947` - Changes were tracked properly now on pasting.

## 18.3.50 (2020-11-17)

### Document Editor

#### Bug Fixes

- Strike through button now toggles properly.
- `#297703` - Resolved issue on exporting a RTL document.

## 18.3.48 (2020-11-11)

### Document Editor

#### Bug Fixes

- `#294075` - Resolved table bottom border rendering issue when table contains merged cell.
- `#292515` - Resolved context menu position issue in IE11.

## 18.3.47 (2020-11-05)

### Document Editor

#### New Features

- `#281067`, `#279595` - Added partial lock and edit support.

#### Bug Fixes

- `#296222` - Resolved table rendering issue when table contains merged cell.
- `#297479` - Field result text with multiple lines are now inserted properly when track changes enabled.
- `#296863` - Resolved script error when field code contains table.
- `#281339` - Resolved paragraph renders outside the page in RTL format document issue.
- Resolved script error Navigating to the specified bookmark.
- `#296222` - Resolved exporting issue when exporting document with shape.
- `#294306` - Resolved page number update issue when page contains page field.
- `#295176` - Ctrl + V now works properly in Edge.
- `#296782`, `#296781` - Resolved issue on cursor visibility when cursor is in editable region.
- `#293369` - Document with merged cell is now exported properly.
- `#294261` - Accepting or rejecting changes were now preserved in restrict editing.
- `#292726` - Row header was now repeated properly for each page.
- `#281339` - Numbered list in the RTL was now rendered properly.
- `#295753` - Sections with restart page number now updated properly.
- `#293980` - Skipped form field insertion in header and footer similar to MS Word.
- `#294075`,`#293472` - Resolved table border rendering issue.
- `#291766` - Resolved file picker not opening issue in IE.
- `#296842` - Resolved issue on selecting a merge field.
- `#292515` - Polish characters are now working properly in IE.
- `#291766` - Resolved script error on loading a document with text wrapped image.
- `#292515` - Resolved toolbar rendering issue in IE.
- `#289186`,`#293172` - Text box with none style is now exported properly.
- `#291766` - Resolved issue on table rendering black.
- `#293342`,`#295176` - Ctrl + V now works properly in IE.

## 18.3.44 (2020-10-27)

### Document Editor

#### Bug Fixes

- `#296222` - Resolved table rendering issue when table contains merged cell.
- `#297479` - Field result text with multiple lines are now inserted properly when track changes enabled.
- `#296863` - Resolved script error when field code contains table.
- `#281339` - Resolved paragraph renders outside the page in RTL format document issue.
- Resolved script error Navigating to the specified bookmark.
- `#296222` - Resolved exporting issue when exporting document with shape.

## 18.3.42 (2020-10-20)

### Document Editor

#### New Features

- `#281067`, `#279595` - Added partial lock and edit support.

#### Bug Fixes

- `#294306` - Resolved page number update issue when page contains page field.
- `#295176` - Ctrl + V now works properly in Edge.
- `#296782`, `#296781` - Resolved issue on cursor visibility when cursor is in editable region.
- `#293369` - Document with merged cell is now exported properly.
- `#294261` - Accepting or rejecting changes were now preserved in restrict editing.
- `#292726` - Row header was now repeated properly for each page.
- `#281339` - Numbered list in the RTL was now rendered properly.
- `#295753` - Sections with restart page number now updated properly.
- `#293980` - Skipped form field insertion in header and footer similar to MS Word.

## 18.3.40 (2020-10-13)

### Document Editor

#### Bug Fixes

- `294075`,`293472` - Resolved table border rendering issue.
- `#291766` - Resolved file picker not opening issue in IE.
- `#296842` - Resolved issue on selecting a merge field.
- `#292515` - Polish characters are now working properly in IE.
- `#291766` - Resolved script error on loading a document with text wrapped image.
- `#292515` - Resolved toolbar rendering issue in IE.
- `289186`,`293172` - Text box with none style is now exported properly.
- `#291766` - Resolved issue on table rendering black.
- `293342`,`295176` - Ctrl + V now works properly in IE.

## 18.3.35 (2020-10-01)

### Document Editor

#### Bug Fixes

- `#283180` - Resolved font family no records found issue.
- `#282303` - Paste dropdown now hides when creating or opening new document.
- `#280951` - Table content renders properly now for table with merged cells.
- `#280973` - Resolved script while getting bookmarks from selection.
- `#284486` - Comment Tab in pane is removed when enable comment is false.
- `#283344` - Resolved the initial delay in pasting images.
- `#282707`,`#284035` - Resolved bullet list exporting issue in MAC devices.
- `#284412` - Comment mark is now deleted properly when comment is deleted.
- `#281339` - Resolved RTL issue when editing a list content.
- `#276616` - Paragraph maintained when inserting text in whole paragraph similar to MS Word.
- `#284775` - Resolved table resize enabled issue in protected mode.
- `#282504` - Resolved footer content overlapping issue when inserting image and table in footer.
- `#286986` - Table properties are now written properly on html exporting.
- `#286520` - Inserted text selection now applied properly after applying style.
- `#287740` - Paper size dropdown in page setup dialog now updated for document with A4 format.
- `#282515` - Resolved error on exporting a document which contains restart numbering.
- `#287633` - Table containing alignment is now exporting properly with alignment.
- `#286469` - Resolved table formatting issue when table splits to multiple pages.
- `#285747` - Resolved script error on server side export.
- `#284704` - Resolved script error on changing the footer distance.
- `#283529` - Resolved table layout issue when table is center aligned.
- `#286474` - Resolved table re layout issue when table have left indent value.
- `#289186` - Resolved issue on exporting a text box with line format none.
- `#288198` - Font family customization is also available on modify style dialog now.
- `#289187` - Resolved table border rendering issue when table have merged cells.
- `#287255` - Resolved page unresponsive error occurs on mail merge.
- `#286474`, `#288778` - Resolved script error thrown on choosing fill color.
- `#155699` - Image resize history is now called before the content change event.
- `#156086` - Resolved table layout issue on opening a saved document with merged cells.
- `#148494` - Resolved script error on destroying the container.
- `#289186` - Resolved layout issue on exporting a text box.
- `#289172` - Resolved script error when two or more server request is passed at same time.
- `#287775` - Resolved script error on saving a document with form field.
- `#289902` - Custom page height and width is now updating properly in page setup dialog.
- `#289902` - Resolved review pane enabled issue when track changes is disabled.
- `#157264` - Resolved script error when finding a text with curly braces.
- `#290625` - Tick icon in line spacing is aligned properly now.
- `#291882` - Now,Text contents were not transformed to upper case while copying.
- `#287582` - Apply shading property for form field is now maintained also on exported document.
- `#280951` - Table contents were not rendered on footer region now.
- `#287195` - Resolved script error throw while deleting large text inside a table.
- `#155699` - Resolved selection change event gets triggered before created event of document editor issue.
- `#290271` - Resolved some elements are not created with unique id in document editor component issue.
- `#288253` - Exported document with comments from editor contain initials property in file level now.
- `#287740` - Landscape Orientation not updated properly in page setup dialog now.
- `#291080`, `#157393` - Restrict editing property works when setting on component creation now.

#### New Features

- Added API to delete bookmark.
- `#267515`- Added API to get searched item hierarchical index.
- `#284937`- Added API show restrict editing pane.
- `#280089`, `#283427`, `#250760` - Added event to notify service failure.
- `#275184` - Added support for retrieving next and previous element context type from current selection range.
- `#243495` - Added support for automatic text color.
- `#279355` - Added support to enable properties pane in read only mode.
- `#260677`, `#277329` - Added support for cropping images in document editor.
- `#250760` -  Added before file open event to restrict document loading based on file size.
- `#256210`, `#259583`, `#280989`, `#282228` - Added support for all Caps property for character.
- `#156915` - Added public API to check whether the selection is in edit region.
- `#287831` - Added public API to show spell check dialog.
- `#284434` - Spell checker performance was optimized.
- `#290372` - Added support to apply restart page number for different sections.
- `#290423` - Added resize API in document editor container.
- `#243495`, `#247427`, `#248347`, `#252755`, `#254094`, `#254684`, `#256926`, `#248347`, `#260233`, `#262638`, `#273681`, `#155458`, `#278038` - Added support to preserve content control feature.

## 18.2.58 (2020-09-15)

### Document Editor

#### New Features

- `#290372` - Added support to apply restart page number for different sections.
- `#290423` - Added resize API in document editor container.
- `#243495`, `#247427`, `#248347`, `#252755`, `#254094`, `#254684`, `#256926`, `#248347`, `#260233`, `#262638`, `#273681`, `#155458`, `#278038` - Added support to preserve content control feature.

#### Bug Fixes

- `#155699` - Resolved selection change event gets triggered before created event of document editor issue.
- `#290271` - Resolved some elements are not created with unique id in document editor component issue.
- `#288253` - Exported document with comments from editor contain initials property in file level now.
- `#287740` - Landscape Orientation not updated properly in page setup dialog now.
- `#291080`, `#157393` - Restrict editing property works when setting on component creation now.

## 18.2.57 (2020-09-08)

### Document Editor

#### New Features

- `#156915` - Added public API to check whether the selection is in edit region.
- `#287831` - Added public API to show spell check dialog.
- `#284434` - Spell checker performance was optimized.

#### Bug Fixes

- `#148494` - Resolved script error on destroying the container.
- `#289186` - Resolved layout issue on exporting a text box.
- `#289172` - Resolved script error when two or more server request is passed at same time.
- `#287775` - Resolved script error on saving a document with form field.
- `#289902` - Custom page height and width is now updating properly in page setup dialog.
- `#289902` - Resolved review pane enabled issue when track changes is disabled.
- `#157264` - Resolved script error when finding a text with curly braces.
- `#290625` - Tick icon in line spacing is aligned properly now.
- `#291882` - Now,Text contents were not transformed to upper case while copying.
- `#287582` - Apply shading property for form field is now maintained also on exported document.
- `#280951` - Table contents were not rendered on footer region now.
- `#287195` - Resolved script error throw while deleting large text inside a table.

## 18.2.55 (2020-08-25)

### Document Editor

#### Bug Fixes

- `#286474` - Resolved table re layout issue when table have left indent value.
- `#289186` - Resolved issue on exporting a text box with line format none.
- `#288198` - Font family customization is also available on modify style dialog now.
- `#289187` - Resolved table border rendering issue when table have merged cells.
- `#287255` - Resolved page unresponsive error occurs on mail merge.
- `#286474`, `#288778` - Resolved script error thrown on choosing fill color.
- `#155699` - Image resize history is now called before the content change event.
- `#156086` - Resolved table layout issue on opening a saved document with merged cells.

## 18.2.54 (2020-08-18)

### Document Editor

#### New Features

- `#275184` - Added support for retrieving next and previous element context type from current selection range.
- `#243495` - Added support for automatic text color.
- `#279355` - Added support to enable properties pane in read only mode.
- `#260677`, `#277329` - Added support for cropping images in document editor.
- `#250760` -  Added before file open event to restrict document loading based on file size.
- `#256210`, `#259583`, `#280989`, `#282228` - Added support for all Caps property for character.
- Added API to delete bookmark.
- `#267515`- Added API to get searched item hierarchical index.
- `#284937`- Added API show restrict editing pane.
- `#280089`, `#283427`, `#250760` - Added event to notify service failure.

#### Bug Fixes

- `#286986` - Table properties are now written properly on html exporting.
- `#286520` - Inserted text selection now applied properly after applying style.
- `#287740` - Paper size dropdown in page setup dialog now updated for document with A4 format.
- `#282515` - Resolved error on exporting a document which contains restart numbering.
- `#287633` - Table containing alignment is now exporting properly with alignment.
- `#286469` - Resolved table formatting issue when table splits to multiple pages.
- `#285747` - Resolved script error on server side export.
- `#284704` - Resolved script error on changing the footer distance.
- `#283529` - Resolved table layout issue when table is center aligned.
- `#283180` - Resolved font family no records found issue.
- `#282303` - Paste dropdown now hides when creating or opening new document.
- `#280951` - Table content renders properly now for table with merged cells.
- `#280973` - Resolved script while getting bookmarks from selection.
- `#284486` - Comment Tab in pane is removed when enable comment is false.
- `#283344` - Resolved the initial delay in pasting images.
- `#282707`,`#284035` - Resolved bullet list exporting issue in MAC devices.
- `#284412` - Comment mark is now deleted properly when comment is deleted.
- `#281339` - Resolved RTL issue when editing a list content.
- `#276616` - Paragraph maintained when inserting text in whole paragraph similar to MS Word.
- `#284775` - Resolved table resize enabled issue in protected mode.
- `#282504` - Resolved footer content overlapping issue when inserting image and table in footer.

## 18.2.47 (2020-07-28)

### Document Editor

#### New Features

- `#280089`, `#283427`, `#250760` - Added event to notify service failure.

#### Bug Fixes

- `#284775` - Resolved table resize enabled issue in protected mode.
- `#282504` - Resolved footer content overlapping issue when inserting image and table in footer.

## 18.2.46 (2020-07-21)

### Document Editor

#### New Features

- `#284937`- Added API show restrict editing pane.

#### Bug Fixes

- `#284486` - Comment Tab in pane is removed when enable comment is false.
- `#283344` - Resolved the initial delay in pasting images.
- `#282707`,`#284035` - Resolved bullet list exporting issue in MAC devices.
- `#284412` - Comment mark is now deleted properly when comment is deleted.
- `#281339` - Resolved RTL issue when editing a list content.
- `#276616` - Paragraph maintained when inserting text in whole paragraph similar to MS Word.

## 18.2.45 (2020-07-14)

### Document Editor

#### New Features

- Added API to delete bookmark.
- `#267515`- Added API to get searched item hierarchical index.

#### Bug Fixes

- `#283180` - Resolved font family no records found issue.
- `#282303` - Paste dropdown now hides when creating or opening new document.
- `#280951` - Table content renders properly now for table with merged cells.
- `#280973` - Resolved script while getting bookmarks from selection.

## 18.2.44 (2020-07-07)

### Document Editor

#### Breaking Changes

- The property `dropDownItems` in DropDownFormFieldInfo is changed to `dropdownItems`.

#### New Features

- `#268210` - Added support to customize user color in comment.
- `#268211` - Added support for restricting the user from delete comment.
- `#125563`,`#167098`,`#200655`,`#210401`,`#227193`,`#225881`,`#227250`,`#238531`,`#238529`,`#249506`,`#251329`,`#251816`,`#252988`,`#254094`, `#125563`,`#255850`, `#258472`, `#264794`, `#264634`, `#266286`, `#278191` - Added support for track changes.
- `#272634` - Added API to get hidden bookmark.
- `#267067`,`#267934` - Added API to customize font family dropdown.
- Added `height` and `width` API to define height and width of document editor.
- Added support for Legacy Form Fields.
- Added support for updating bookmark cross reference fields.

#### Bug Fixes

- `#279874` - Resolved paragraph spacing issue in the exported docx when opening it in libre office.
- `#278039` - Character formatting now preserved properly for dropdown field.
- `#278038` - Handle restrict editing inside dropdown field.
- `#278695` - Paste text only in editable region now working properly.
- `#267924` - Circular reference exception resolved when export the document contains chart.
- `#152124` - Resolved script error when modify style for locale changed text.
- `#266059` - Skipped adding bookmark when pasting content with bookmark.
- `#267949` - Table is now revert properly when insert table below another table.
- `#268472` - Selection format is now retrieved properly when paragraph contains more than two paragraph.
- `#269467` - List character format is now update properly when paragraph contains style.
- `#264813` - Tab width in list paragraph is now layout properly.
- `#264779` - Text clipping issue is resolved when text inside table.
- `#269397` - Context menu position is now update properly.
- `#269546` - Resolved key navigation issue when paragraph contains page break.
- `#269778` - $ symbol is now search properly when text contains $ symbol.
- `#269893` - Focus is in document editor after dialog gets closed.
- `#268907` - Selection character format is retrieved properly when selection is in list text.
- `#270424` - Footer content is now update properly when document contains more than one section.
- `#269743` , `#266534` - Focus is now update properly in Firefox when navigate to bookmark or search result.
- `#271039` - When paste content in RTL paragraph, formatting is now update properly.
- `#271928` - Resolved script when trying to create a new document and document have broken comments.
- `#271886` - Right tab width issue when paragraph contains right indent.
- `#271986` - Resolved error when updating Table of Contents with comments.
- `#271967` , `#271968` , `#271971` - Paste text only in empty paragraph is now working properly.
- `#271985` - Resolved script error when remove page break after bookmark.
- `#272009` , `#273868` - Modify style using numbering and paragraph dialog is now working properly.
- `#271977` - Pasting text in heading style is now maintain heading style in paragraph.
- `#271863` - Paragraph element splitting issue is now resolved when alignment is left and line combined with field.
- `#272290` - Resolved selection issue when paragraph contains line break character.
- `#272600` - Copy text with specific symbol (< , >) is now working properly.
- `#266059` - When pasting content with bookmark, bookmark is now preserved.
- `#269743` - Resolved focus issue in Firefox when navigate to bookmark or search result.
- `#269546` - Selection issue is now resolved when paragraph contains page break.
- `#274395` - Resolved script error when clicking on canvas in mobile view mode.
- `#273345` - Resolved table export issue when table contains vertical merge cell.
- `#271450` - Restricted user editing, when spinner is visible.
- `#271375` - Resolved table layout issue when table contain vertical merged cells.
- `#252868` - Resolved script error when minimize row height.
- `#275993` ,`#277160` - Button actions in comments and restrict editing pane will not trigger the form submit events now.
- `#276810` - Table alignment property is now export properly.
- `#277452` - Contents in table is now print properly.
- `#273870` - Bookmarks API will not retrieve bookmark when selection is at end of bookmark.
- `#273913` - Enable/Disable item by index in toolbar is now working properly.
- `#276399` - After copy and paste table, table is now exported properly.
- Comments pane locale string is now returns proper time.
- `#275137` - Apply vertical alignment for cell is now working properly when it inside table.
- `#275184` - Select bookmark API is now select bookmark element properly.
- `#275452` - Select current word using keys is now working properly when line contains comments.
- `#274525` - List font is now update properly on enter in list paragraph.
- `#273905` - Insert row below is now proper when cells have different borders.
- `#272762` - Modify list level using tab key is now proper.
- `#277823` - Resolved script error when deleting edit range element inside table.
- `#247077` - Selection is now updated properly while clicking before merge field.
- `#277357` - Table borders are now rendered properly.
- `#275686` - `contentChange` event will not trigger while switching the layout type.
- `#276616` - Paragraph format now preservers properly while inserting text.
- `#276039` - Adding new comment and replying to old comment is now disable in read only mode.
- `#277959` - Document with shape now imported properly.
- `#153583` - Selection is now updated properly for image inside the bookmark.
- `#278685` - Resolved script error on backspace inside the edit range.
- `#247077` - Selection is now updated properly while clicking before merge field.
- `#277357` - Table borders are now rendered properly.
- `#275686` - `contentChange` event will not trigger while switching the layout type.
- `#276616` - Paragraph format now preservers properly while inserting text.
- `#276039` - Adding new comment and replying to old comment is now disable in read only mode.
- `#277959` - Document with shape now imported properly.
- `#153583` - Selection is now updated properly for image inside the bookmark.

## 18.1.56 (2020-06-09)

### Document Editor

#### Bug Fixes

- `#278685` - Resolved script error on backspace inside the edit range.
- `#247077` - Selection is now updated properly while clicking before merge field.
- `#277357` - Table borders are now rendered properly.
- `#275686` - `contentChange` event will not trigger while switching the layout type.
- `#276616` - Paragraph format now preservers properly while inserting text.
- `#276039` - Adding new comment and replying to old comment is now disable in read only mode.
- `#277959` - Document with shape now imported properly.
- `#153583` - Selection is now updated properly for image inside the bookmark.

## 18.1.55 (2020-06-02)

### Document Editor

#### Bug Fixes

- `#247077` - Selection is now updated properly while clicking before merge field.
- `#277357` - Table borders are now rendered properly.
- `#275686` - `contentChange` event will not trigger while switching the layout type.
- `#276616` - Paragraph format now preservers properly while inserting text.
- `#276039` - Adding new comment and replying to old comment is now disable in read only mode.
- `#277959` - Document with shape now imported properly.
- `#153583` - Selection is now updated properly for image inside the bookmark.

## 18.1.54 (2020-05-26)

### Document Editor

#### Bug Fixes

- Comments pane locale string is now returns proper time.
- `#275137` - Apply vertical alignment for cell is now working properly when it inside table.
- `#275184` - Select bookmark API is now select bookmark element properly.
- `#275452` - Select current word using keys is now working properly when line contains comments.
- `#274525` - List font is now update properly on enter in list paragraph.
- `#273905` - Insert row below is now proper when cells have different borders.
- `#272762` - Modify list level using tab key is now proper.
- `#277823` - Resolved script error when deleting edit range element inside table.

## 18.1.53 (2020-05-19)

### Document Editor

#### New Features

- `#272634` - Added API to get hidden bookmark.

#### Bug Fixes

- `#275993` ,`#277160` - Button actions in comments and restrict editing pane will not trigger the form submit events now.
- `#276810` - Table alignment property is now export properly.
- `#277452` - Contents in table is now print properly.
- `#273870` - Bookmarks API will not retrieve bookmark when selection is at end of bookmark.
- `#273913` - Enable/Disable item by index in toolbar is now working properly.
- `#276399` - After copy and paste table, table is now exported properly.

## 18.1.52 (2020-05-13)

### Document Editor

#### New Features

- `#267067`,`#267934` - Added API to customize font family dropdown.

#### Bug Fixes

- `#271375` - Resolved table layout issue when table contain vertical merged cells.
- `#252868` - Resolved script error when minimize row height.

## 18.1.48 (2020-05-05)

### Document Editor

#### Bug Fixes

- `#272290` - Resolved selection issue when paragraph contains line break character.
- `#272600` - Copy text with specific symbol (< , >) is now working properly.
- `#266059` - When pasting content with bookmark, bookmark is now preserved.
- `#269743` - Resolved focus issue in Firefox when navigate to bookmark or search result.
- `#269546` - Selection issue is now resolved when paragraph contains page break.
- `#274395` - Resolved script error when clicking on canvas in mobile view mode.
- `#273345` - Resolved table export issue when table contains vertical merge cell.
- `#271450` - Restricted user editing, when spinner is visible.

## 18.1.46 (2020-04-28)

### Document Editor

#### New Features

- Added `height` and `width` API to define height and width of document editor.

#### Bug Fixes

- `#271928` - Resolved script when trying to create a new document and document have broken comments.
- `#271886` - Right tab width issue when paragraph contains right indent.
- `#271986` - Resolved error when updating Table of Contents with comments.
- `#271967` , `#271968` , `#271971` - Paste text only in empty paragraph is now working properly.
- `#271985` - Resolved script error when remove page break after bookmark.
- `#272009` , `#273868` - Modify style using numbering and paragraph dialog is now working properly.
- `#271977` - Pasting text in heading style is now maintain heading style in paragraph.
- `#271863` - Paragraph element splitting issue is now resolved when alignment is left and line combined with field.

## 18.1.45 (2020-04-21)

### Document Editor

#### Bug Fixes

- `#268907` - Selection character format is retrieved properly when selection is in list text.
- `#270424` - Footer content is now update properly when document contains more than one section.
- `#269743` , `#266534` - Focus is now update properly in Firefox when navigate to bookmark or search result.
- `#271039` - When paste content in RTL paragraph, formatting is now update properly.

## 18.1.44 (2020-04-14)

### Document Editor

#### New Features

- Added support for Legacy Form Fields.
- Added support for updating bookmark cross reference fields.

#### Bug Fixes

- `#269397` - Context menu position is now update properly.
- `#269546` - Resolved key navigation issue when paragraph contains page break.
- `#269778` - $ symbol is now search properly when text contains $ symbol.
- `#269893` - Focus is in document editor after dialog gets closed.

## 18.1.43 (2020-04-07)

### Document Editor

#### Bug Fixes

- `#267924` - Circular reference exception resolved when export the document contains chart.
- `#152124` - Resolved script error when modify style for locale changed text.
- `#266059` - Skipped adding bookmark when pasting content with bookmark.
- `#267949` - Table is now revert properly when insert table below another table.
- `#268472` - Selection format is now retrieved properly when paragraph contains more than two paragraph.
- `#269467` - List character format is now update properly when paragraph contains style.
- `#264813` - Tab width in list paragraph is now layout properly.
- `#264779` - Text clipping issue is resolved when text inside table.

## 18.1.42 (2020-04-01)

### Document Editor

#### Breaking Changes

- Default value of `enableLocalPaste` is set to false. So, by default, the content will be pasted from the system clipboard.
- Some locale properties are renamed as below

|Previous|Now|
|----|----|
|Linked(Paragraph and Character)|Linked Style|
|Don't add space between the paragraphs of the same styles|Contextual Spacing|
|The password don't match|Password Mismatch|
|Exceptions (optional)|Exceptions Optional|
|Select parts of the document and choose users who are allowed to freely edit them.|Select Part Of Document And User|
|Yes, Start Enforcing Protection|Enforcing Protection|
|This document is protected from unintentional editing. You may edit in this region.|Protected Document|
|You may format text only with certain styles.|You may format text only with certain styles|
|Type your comment hear|Type your comment here|
|Added comments not posted. If you continue, that comment will be discarded.|Discard Comment|
|Header & Footer|Header And Footer|
|Different header and footer for odd and even pages.|Different header and footer for odd and even pages|
|Different Odd & Even Pages|Different Odd And Even Pages|
|Different header and footer for first page.|Different header and footer for first page|
|Distance from top of the page to top of the header|Distance from top of the page to top of the header|
|Distance from bottom of the page to bottom of the footer.|Distance from bottom of the page to bottom of the footer|
|Insert / Delete|Insert Or Delete|
|Number of heading or outline levels to be shown in table of contents.|Number of heading or outline levels to be shown in table of contents|
|Show page numbers in table of contents.|Show page numbers in table of contents|
|Right align page numbers in table of contents.|Right align page numbers in table of contents|
|Use hyperlinks instead of page numbers.|Use hyperlinks instead of page numbers|
|Bold (Ctrl+B)|Bold Tooltip|
|Italic (Ctrl+I)|Italic Tooltip|
|Underline (Ctrl+U)|Underline Tooltip|
|Superscript (Ctrl+Shift++)|Superscript Tooltip|
|Subscript (Ctrl+=)|Subscript Tooltip|
|Align left (Ctrl+L)|Align left Tooltip|
|Center (Ctrl+E)|Center Tooltip|
|Align right (Ctrl+R)|Align right Tooltip|
|Justify (Ctrl+J)|Justify Tooltip|
|Create a new document.|Create a new document|
|Open a document.|Open a document|
|Undo the last operation (Ctrl+Z).|Undo Tooltip|
|Redo the last operation (Ctrl+Y).|Redo Tooltip|
|Insert inline picture from a file.|Insert inline picture from a file|
|Create a link in your document for quick access to web pages and files (Ctrl+K).|Create Hyperlink|
|Insert a bookmark in a specific place in this document.|Insert a bookmark in a specific place in this document|
|Provide an overview of your document by adding a table of contents.|Provide an overview of your document by adding a table of contents|
|Add or edit the header.|Add or edit the header|
|Add or edit the footer.|Add or edit the footer|
|Open the page setup dialog.|Open the page setup dialog|
|Add page numbers.|Add page numbers|
|Find text in the document (Ctrl+F).|Find Text|
|The current page number in the document. Click or tap to navigate specific page.|Current Page Number|

#### New Features

- `249782`, `254484`, `149278`,`258415`,`260463` - Added support for toolbar customization.
- `253670` - Enhancements for copy and paste operation.
- `#262665`, `#151012` - Added API to customize search highlight colour.
- `#249197` - Added API to enable/disable spell check action.
- `#237725`, `#253671` - Added support for web layout.
- `#260639` - Added `enableComment` property to enable and disable comment.
- `#259970` - Handled paste list behaviour using start at value of list.
- `#256487` - Enhancements for mouse and keyboard selection.

#### Bug Fixes

- `#263861` - Table cells are now resized properly.
- `#260600` , `#266651` - RTL characters are now remove properly on backspace and delete.
- `#260600` - When direction is RTL, elements now rearranged properly after change character formatting.
- `#250770` , `#263443` - RTL text layout properly with special characters.
- `#264351` - Justify paragraph is layout properly when paragraph contains field.
- `#264631` - Stop protection is now working if password is empty.
- `#263171` - Cell options dialog content is now aligned properly.
- `#150960` - Hidden separator in context menu when hyperlink is disabled.
- `#150995` - Resolved error when importing the document with editable region restrictions.
- `#260600`, `#150466` , `#266311` - Properties pane is now enabled properly based on the context type in header footer region.
- `#260133` - Resolved navigation issue on Ctrl + click in MAC machine.
- `150960` - Enable/disable comment now working properly.
- `#263608` , `#150960` - Resolved script error when disable toolbar.
- `#261241` - Resolved script error when remove hyperlink in splitted widget.
- `#259011` - Paragraph before spacing layout issue is now resolved.
- `#260206` - Resolved numbering list issue when list contains start at value.
- `#260206` - Restart numbering is now working properly for different number format.
- `#260637` - Resolved script error when removing comment in header.
- `#249197` - Resolved exception when export Sfdt to other type in server side.
- `#252868` - Resolved script error when resize row to next page.
- `#259972` - Formatting is now applied properly for keep text only option in paste.
- `#258191` - Table cell width are now updated properly.
- `#260133`, `#261809` - Page scrolling issue is resolved when right click in MAC machine.
- `#258087`, `#255070` - Grid columns are now preserved properly on export.
- `#255070` - Page headers is now export properly when section break in table.
- `#259583` - List level number for style paragraph is now export properly.
- `#259153` - Table cell width and height is now copy properly.
- `#258121` - Resolved warnings in bootstrap4 styles when run the application in Firefox.
- `#249197` - Highlight colours are now exported properly.
- `#260048`, `#256276` - Image files are now pasted properly.
- `#256903` - Resolved bookmarks API issue when bookmark is in table.
- `#256758` - Resolved selection issue after correcting the spelling mistake.
- `#258938` - Resolved typo error in place holder of comments text area.
- `#257481` - Font family in font dialog is now update properly based on current selection.
- `#257171` - Bookmarks is now update properly after paste with formatting.
- `#257161` - List number is now update properly when hidden field contains list paragraph.
- `#246365` - Borders are now render properly when copy and paste from excel.
- `#257455` - Font colour is now update properly in modify style dialog.
- `#250770` - Line is now arranged properly when insert field.
- `#255913`, `#257879` - Bookmark is now insert properly in splitted paragraph.
- `#255736` , `#256106` , `#257011` - Context menu is now open in Firefox, Edge and Safari.
- `#254998` - Character format is now apply properly for selected bookmark.
- `#254997`, `#256764`, `#257106` , `#256764` - Paragraph format is now export properly if document contains selection.
- `#255272` - Resolved script error when navigate to bookmark in header.
- `#255188` - Bookmark is now preserved properly in header and footer.
- `#255601` - Bookmark is now select properly after insert text.
- `#256385` - Copy is now working properly in Firefox.
- `#256321` - Auto fit table is now lay-out properly if maximum word width exceeds container width.
- `#256509` - Resolved script error throws on backspace when selection is in bookmark end.
- `#256053` - TOC outline level is now serialized properly on Word export.
- `#256449` - Bullet list is now render properly in IOS chrome and safari.
- `#256099` - List is now apply properly in multilevel list.
- `#256384` - Tab width is now update properly when paragraph contains hanging indent.
- `#264048` , `#267560` - Header style formatting is now preserved properly in local copy and paste.
- `#266571` - Table with auto fit is now layout properly.
- `#266534` - Resolved text navigation issue when spell check is enabled.
- `#151718` - Dynamic toolbar injection is now working properly.
- `#266060` - Fixed paste match destination formatting issue.
- `#267089` , `#255993` - Fixed exception when pasting html content.
- `#267793`, `#152022` - Resolved page scrolling issue when copy is triggered.
- `#267769` - Table width is not update properly when insert table inside table cell.

## 18.1.36-beta (2020-03-19)

### Document Editor

#### Breaking Changes

- Default value of `enableLocalPaste` is set to false. So, by default, the content will be pasted from the system clipboard.
- Some locale properties are renamed as below

|Previous|Now|
|----|----|
|Linked(Paragraph and Character)|Linked Style|
|Don't add space between the paragraphs of the same styles|Contextual Spacing|
|The password don't match|Password Mismatch|
|Exceptions (optional)|Exceptions Optional|
|Select parts of the document and choose users who are allowed to freely edit them.|Select Part Of Document And User|
|Yes, Start Enforcing Protection|Enforcing Protection|
|This document is protected from unintentional editing. You may edit in this region.|Protected Document|
|You may format text only with certain styles.|You may format text only with certain styles|
|Type your comment hear|Type your comment here|
|Added comments not posted. If you continue, that comment will be discarded.|Discard Comment|
|Header & Footer|Header And Footer|
|Different header and footer for odd and even pages.|Different header and footer for odd and even pages|
|Different Odd & Even Pages|Different Odd And Even Pages|
|Different header and footer for first page.|Different header and footer for first page|
|Distance from top of the page to top of the header|Distance from top of the page to top of the header|
|Distance from bottom of the page to bottom of the footer.|Distance from bottom of the page to bottom of the footer|
|Insert / Delete|Insert Or Delete|
|Number of heading or outline levels to be shown in table of contents.|Number of heading or outline levels to be shown in table of contents|
|Show page numbers in table of contents.|Show page numbers in table of contents|
|Right align page numbers in table of contents.|Right align page numbers in table of contents|
|Use hyperlinks instead of page numbers.|Use hyperlinks instead of page numbers|
|Bold (Ctrl+B)|Bold Tooltip|
|Italic (Ctrl+I)|Italic Tooltip|
|Underline (Ctrl+U)|Underline Tooltip|
|Superscript (Ctrl+Shift++)|Superscript Tooltip|
|Subscript (Ctrl+=)|Subscript Tooltip|
|Align left (Ctrl+L)|Align left Tooltip|
|Center (Ctrl+E)|Center Tooltip|
|Align right (Ctrl+R)|Align right Tooltip|
|Justify (Ctrl+J)|Justify Tooltip|
|Create a new document.|Create a new document|
|Open a document.|Open a document|
|Undo the last operation (Ctrl+Z).|Undo Tooltip|
|Redo the last operation (Ctrl+Y).|Redo Tooltip|
|Insert inline picture from a file.|Insert inline picture from a file|
|Create a link in your document for quick access to web pages and files (Ctrl+K).|Create Hyperlink|
|Insert a bookmark in a specific place in this document.|Insert a bookmark in a specific place in this document|
|Provide an overview of your document by adding a table of contents.|Provide an overview of your document by adding a table of contents|
|Add or edit the header.|Add or edit the header|
|Add or edit the footer.|Add or edit the footer|
|Open the page setup dialog.|Open the page setup dialog|
|Add page numbers.|Add page numbers|
|Find text in the document (Ctrl+F).|Find Text|
|The current page number in the document. Click or tap to navigate specific page.|Current Page Number|

#### New Features

- `249782`, `254484`, `149278`,`258415`,`260463` - Added support for toolbar customization.
- `253670` - Enhancements for copy and paste operation.
- `#262665`, `#151012` - Added API to customize search highlight colour.
- `#249197` - Added API to enable/disable spell check action.
- `#237725`, `#253671` - Added support for web layout.
- `#260639` - Added `enableComment` property to enable and disable comment.
- `#259970` - Handled paste list behaviour using start at value of list.
- `#256487` - Enhancements for mouse and keyboard selection.

#### Bug Fixes

- `#263861` - Table cells are now resized properly.
- `#260600` , `#266651` - RTL characters are now remove properly on backspace and delete.
- `#260600` - When direction is RTL, elements now rearranged properly after change character formatting.
- `#250770` , `#263443` - RTL text layout properly with special characters.
- `#264351` - Justify paragraph is layout properly when paragraph contains field.
- `#264631` - Stop protection is now working if password is empty.
- `#263171` - Cell options dialog content is now aligned properly.
- `#150960` - Hidden separator in context menu when hyperlink is disabled.
- `#150995` - Resolved error when importing the document with editable region restrictions.
- `#260600`, `#150466` , `#266311` - Properties pane is now enabled properly based on the context type in header footer region.
- `#260133` - Resolved navigation issue on Ctrl + click in MAC machine.
- `150960` - Enable/disable comment now working properly.
- `#263608` , `#150960` - Resolved script error when disable toolbar.
- `#261241` - Resolved script error when remove hyperlink in splitted widget.
- `#259011` - Paragraph before spacing layout issue is now resolved.
- `#260206` - Resolved numbering list issue when list contains start at value.
- `#260206` - Restart numbering is now working properly for different number format.
- `#260637` - Resolved script error when removing comment in header.
- `#249197` - Resolved exception when export Sfdt to other type in server side.
- `#252868` - Resolved script error when resize row to next page.
- `#259972` - Formatting is now applied properly for keep text only option in paste.
- `#258191` - Table cell width are now updated properly.
- `#260133`, `#261809` - Page scrolling issue is resolved when right click in MAC machine.
- `#258087`, `#255070` - Grid columns are now preserved properly on export.
- `#255070` - Page headers is now export properly when section break in table.
- `#259583` - List level number for style paragraph is now export properly.
- `#259153` - Table cell width and height is now copy properly.
- `#258121` - Resolved warnings in bootstrap4 styles when run the application in Firefox.
- `#249197` - Highlight colours are now exported properly.
- `#260048`, `#256276` - Image files are now pasted properly.
- `#256903` - Resolved bookmarks API issue when bookmark is in table.
- `#256758` - Resolved selection issue after correcting the spelling mistake.
- `#258938` - Resolved typo error in place holder of comments text area.
- `#257481` - Font family in font dialog is now update properly based on current selection.
- `#257171` - Bookmarks is now update properly after paste with formatting.
- `#257161` - List number is now update properly when hidden field contains list paragraph.
- `#246365` - Borders are now render properly when copy and paste from excel.
- `#257455` - Font colour is now update properly in modify style dialog.
- `#250770` - Line is now arranged properly when insert field.
- `#255913`, `#257879` - Bookmark is now insert properly in splitted paragraph.
- `#255736` , `#256106` , `#257011` - Context menu is now open in Firefox, Edge and Safari.
- `#254998` - Character format is now apply properly for selected bookmark.
- `#254997`, `#256764`, `#257106` , `#256764` - Paragraph format is now export properly if document contains selection.
- `#255272` - Resolved script error when navigate to bookmark in header.
- `#255188` - Bookmark is now preserved properly in header and footer.
- `#255601` - Bookmark is now select properly after insert text.
- `#256385` - Copy is now working properly in Firefox.
- `#256321` - Auto fit table is now lay-out properly if maximum word width exceeds container width.
- `#256509` - Resolved script error throws on backspace when selection is in bookmark end.
- `#256053` - TOC outline level is now serialized properly on Word export.
- `#256449` - Bullet list is now render properly in IOS chrome and safari.
- `#256099` - List is now apply properly in multilevel list.
- `#256384` - Tab width is now update properly when paragraph contains hanging indent.

## 17.4.55 (2020-03-10)

### Document Editor

#### New Features

- `249782`, `254484`, `149278`,`258415`,`260463` - Added support for toolbar customization.

#### Bug Fixes

- `#263861` - Table cells are now resized properly.
- `#260600` , `#266651` - RTL characters are now remove properly on backspace and delete.
- `#260600` - When direction is RTL, elements now rearranged properly after change character formatting.
- `#250770` , `#263443` - RTL text layout properly with special characters.
- `#264351` - Justify paragraph is layout properly when paragraph contains field.
- `#264631` - Stop protection is now working if password is empty.

## 17.4.51 (2020-02-25)

### Document Editor

#### Bug Fixes

- `#263171` - Cell options dialog content is now aligned properly.
- `#150960` - Hidden separator in context menu when hyperlink is disabled.
- `#150995` - Resolved error when importing the document with editable region restrictions.
- `#260600`, `#150466` , `#266311` - Properties pane is now enabled properly based on the context type in header footer region.
- `#260133` - Resolved navigation issue on Ctrl + click in MAC machine.

## 17.4.50 (2020-02-18)

### Document Editor

#### New Features

- `253670` - Enhancements for copy and paste operation.

#### Bug Fixes

- `150960` - Enable/disable comment now working properly.

## 17.4.49 (2020-02-11)

### Document Editor

#### New Features

- `#262665`, `#151012` - Added API to customize search highlight colour.
- `#249197` - Added API to enable/disable spell check action.
- `#237725`, `#253671` - Added support for web layout.

#### Bug Fixes

- `#263608` , `#150960` - Resolved script error when disable toolbar.
- `#261241` - Resolved script error when remove hyperlink in splitted widget.
- `#259011` - Paragraph before spacing layout issue is now resolved.

## 17.4.47 (2020-02-05)

### Document Editor

#### New Features

- `#260639` - Added `enableComment` property to enable and disable comment.
- `#259970` - Handled paste list behaviour using start at value of list.

#### Bug Fixes

- `#260206` - Resolved numbering list issue when list contains start at value.
- `#260206` - Restart numbering is now working properly for different number format.
- `#260637` - Resolved script error when removing comment in header.
- `#249197` - Resolved exception when export Sfdt to other type in server side.

## 17.4.46 (2020-01-30)

### Document Editor

#### Breaking Changes

- Default value of `enableLocalPaste` is set to false. So, by default, the content will be pasted from the system clipboard.

#### Bug Fixes

- `#252868` - Resolved script error when resize row to next page.
- `#259972` - Formatting is now applied properly for keep text only option in paste.
- `#258191` - Table cell width are now updated properly.
- `#260133`, `#261809` - Page scrolling issue is resolved when right click in MAC machine.

## 17.4.43 (2020-01-14)

### Document Editor

#### Bug Fixes

- `#258087`, `#255070` - Grid columns are now preserved properly on export.
- `#255070` - Page headers is now export properly when section break in table.
- `#259583` - List level number for style paragraph is now export properly.
- `#259153` - Table cell width and height is now copy properly.
- `#258121` - Resolved warnings in bootstrap4 styles when run the application in Firefox.
- `#249197` - Highlight colours are now exported properly.
- `#260048`, `#256276` - Image files are now pasted properly.

## 17.4.41 (2020-01-07)

### Document Editor

#### New Features

- `#256487` - Enhancements for mouse and keyboard selection.

#### Bug Fixes

- `#256903` - Resolved bookmarks API issue when bookmark is in table.
- `#256758` - Resolved selection issue after correcting the spelling mistake.
- `#258938` - Resolved typo error in place holder of comments text area.
- `#257481` - Font family in font dialog is now update properly based on current selection.
- `#257171` - Bookmarks is now update properly after paste with formatting.
- `#257161` - List number is now update properly when hidden field contains list paragraph.
- `#246365` - Borders are now render properly when copy and paste from excel.
- `#257455` - Font colour is now update properly in modify style dialog.
- `#250770` - Line is now arranged properly when insert field.

## 17.4.40 (2019-12-24)

### Document Editor

#### Breaking Changes

- Some locale properties are renamed as below

|Previous|Now|
|----|----|
|Linked(Paragraph and Character)|Linked Style|
|Don't add space between the paragraphs of the same styles|Contextual Spacing|
|The password don't match|Password Mismatch|
|Exceptions (optional)|Exceptions Optional|
|Select parts of the document and choose users who are allowed to freely edit them.|Select Part Of Document And User|
|Yes, Start Enforcing Protection|Enforcing Protection|
|This document is protected from unintentional editing. You may edit in this region.|Protected Document|
|You may format text only with certain styles.|You may format text only with certain styles|
|Type your comment hear|Type your comment here|
|Added comments not posted. If you continue, that comment will be discarded.|Discard Comment|
|Header & Footer|Header And Footer|
|Different header and footer for odd and even pages.|Different header and footer for odd and even pages|
|Different Odd & Even Pages|Different Odd And Even Pages|
|Different header and footer for first page.|Different header and footer for first page|
|Distance from top of the page to top of the header|Distance from top of the page to top of the header|
|Distance from bottom of the page to bottom of the footer.|Distance from bottom of the page to bottom of the footer|
|Insert / Delete|Insert Or Delete|
|Number of heading or outline levels to be shown in table of contents.|Number of heading or outline levels to be shown in table of contents|
|Show page numbers in table of contents.|Show page numbers in table of contents|
|Right align page numbers in table of contents.|Right align page numbers in table of contents|
|Use hyperlinks instead of page numbers.|Use hyperlinks instead of page numbers|
|Bold (Ctrl+B)|Bold Tooltip|
|Italic (Ctrl+I)|Italic Tooltip|
|Underline (Ctrl+U)|Underline Tooltip|
|Superscript (Ctrl+Shift++)|Superscript Tooltip|
|Subscript (Ctrl+=)|Subscript Tooltip|
|Align left (Ctrl+L)|Align left Tooltip|
|Center (Ctrl+E)|Center Tooltip|
|Align right (Ctrl+R)|Align right Tooltip|
|Justify (Ctrl+J)|Justify Tooltip|
|Create a new document.|Create a new document|
|Open a document.|Open a document|
|Undo the last operation (Ctrl+Z).|Undo Tooltip|
|Redo the last operation (Ctrl+Y).|Redo Tooltip|
|Insert inline picture from a file.|Insert inline picture from a file|
|Create a link in your document for quick access to web pages and files (Ctrl+K).|Create Hyperlink|
|Insert a bookmark in a specific place in this document.|Insert a bookmark in a specific place in this document|
|Provide an overview of your document by adding a table of contents.|Provide an overview of your document by adding a table of contents|
|Add or edit the header.|Add or edit the header|
|Add or edit the footer.|Add or edit the footer|
|Open the page setup dialog.|Open the page setup dialog|
|Add page numbers.|Add page numbers|
|Find text in the document (Ctrl+F).|Find Text|
|The current page number in the document. Click or tap to navigate specific page.|Current Page Number|

#### Bug Fixes

- `#255913`, `#257879` - Bookmark is now insert properly in splitted paragraph.
- `#255736` , `#256106` , `#257011` - Context menu is now open in Firefox, Edge and Safari.
- `#254998` - Character format is now apply properly for selected bookmark.
- `#254997`, `#256764`, `#257106` , `#256764` - Paragraph format is now export properly if document contains selection.
- `#255272` - Resolved script error when navigate to bookmark in header.
- `#255188` - Bookmark is now preserved properly in header and footer.
- `#255601` - Bookmark is now select properly after insert text.
- `#256385` - Copy is now working properly in Firefox.
- `#256321` - Auto fit table is now lay-out properly if maximum word width exceeds container width.
- `#256509` - Resolved script error throws on backspace when selection is in bookmark end.
- `#256053` - TOC outline level is now serialized properly on Word export.
- `#256449` - Bullet list is now render properly in IOS chrome and safari.
- `#256099` - List is now apply properly in multilevel list.
- `#256384` - Tab width is now update properly when paragraph contains hanging indent.

## 17.4.39 (2019-12-17)

### Document Editor

#### New Features

- `#249197`, `#249364`, `#148274`, `#253325` Added support for converting SFDT to Word document in server side.
- `#125563`, `#158324`, `#210401`, `#231575`, `#239871`, `#238529`, `#240405`, `#252988`, `#255850` - Added support for insert and edit comments.
- `#245203` - Added support for section pages field.
- `#255626`,`#254750` - RTL and locale is now updated properly on property change.
- `#251866` - Enhancement for Auto list feature.

## 17.3.29 (2019-11-26)

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
