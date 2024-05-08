# Changelog

## [Unreleased]

## 25.2.3 (2024-05-08)

### Spreadsheet

#### Bug Fixes

- `#I577454` - Issue with "cell values were not updating correctly in merged cells when scrolling through the spreadsheet content" has been resolved.

## 25.1.41 (2024-04-23)

### Spreadsheet

#### Bug fixes

- `#I573941` - Issue with "chart is not properly shown when the chart range is pointed to another sheet range while importing a file" has been resolved.

## 25.1.35 (2024-03-15)

### Spreadsheet

#### Bug fixes

- `#I549016` - Issue with "script error occurs when inserting multiple images into a single active cell and performing delete an action" has been resolved.

#### Features

- `#I369726` - Now, provided support for accepting the culture-based argument separator in the formula.

- `#I369726` - Now, provided support to pass numeric values with culture-based decimal separators as arguments to the formulas.

## 24.1.41 (2023-12-18)

### Spreadsheet

#### Features

- `#I477190` - Now, provided support for displaying a confirmation dialog before opening an Excel file that contains an external workbook references.

- The following new formulas added to the Spreadsheet.
    - LOOKUP, VLOOKUP, HLOOKUP.
    - SQRT, RSQ, ROUNDDOWN, EOMONTH, NOT.

## 23.1.36 (2023-09-15)

### Spreadsheet

#### Features

- `#339651` - Now, provided support for displaying the error alert dialog when an invalid formula is typed, or the wrong number of arguments is supplied to the formula.
- `#369492` - Now, you can experience cut and paste actions in the Spreadsheet faster compared to earlier versions.
- `#476502` - Now, you can experience smooth scrolling with multiple conditional formatting set in the Spreadsheet, which is faster compared to earlier versions.

## 22.1.34 (2023-06-21)

### Spreadsheet

#### Features

- `#F181385` - Now, you can insert the `line chart` with or without `marker` on the sheet.

## 21.2.8 (2023-05-30)

### Spreadsheet

#### Bug Fixes

- `#I462789` - Issue with "formula calculation is not updated properly when cells contain the decimal values" has been resolved.

## 21.2.3 (2023-05-03)

### Spreadsheet

#### Bug Fixes

- `#F181548` - Issue with "border and cell values are not properly updated when hiding and unhiding the merge applied columns" has been resolved.

## 21.1.41 (2023-04-18)

### Spreadsheet

#### Bug Fixes

- `#I452434` - Issue with "hyphen symbol converts into `NaN` when typing hyphen alone and saving the cell" has been resolved.

## 21.1.38 (2023-04-04)

### Spreadsheet

#### Bug Fixes

- `#I447298` - Issue with "IF formula does not return the expected result while providing the argument with value as true or false" has been resolved.

## 20.3.60 (2022-12-06)

### Spreadsheet

#### Bug Fixes

- `#I412801` - Issue with "cell text is not displayed while using the custom cell styling in the imported excel file" has been resolved.

## 20.3.56 (2022-11-08)

### Spreadsheet

#### Features

- `#F176472` - Provided `setRowsHeight` and `setColumnsWidth` methods to set the height and width to multiple rows and columns respectively.

## 20.3.47 (2022-09-29)

### Spreadsheet

#### Bug Fixes

- `I387270` - Issue with "importing the excel file that contain special character in sheet name" has been resolved.

## 20.2.46 (2022-08-30)

### Spreadsheet

#### Bug Fixes

- `#I387270` - Issue with "post back occurs while clicking the button in the control" has been resolved.

## 20.2.45 (2022-08-23)

### Spreadsheet

#### Bug Fixes

- `#I395418` - Issue with "unable to perform copy and paste actions on the textbox inside the cell template" has been resolved.

## 20.2.44 (2022-08-16)

### Spreadsheet

#### Bug Fixes

- `#I383440` - Issue with "exception throws while applying formula reference on the wrap content cell" has been resolved.
- `#I390638` - Issue with "exception throws while performing multi-selection along with scrolling action on the freeze pane" has been resolved.
- `#I394857` - Issue with "typed content is not visible while performing the edit on partially viewed cell" has been resolved.
- `#I395466` - Issue with "allow to rename and moving the sheets on protect workbook" has been resolved.
- `#I395410`, `#I395411`, `#I395414`, `#I395416`, `#I395419`, `#I394857`, `#I395421` - Issue with "context menu and autofill option shows while disabling the cell selection" has been resolved.
- `#I394806` - Provided new argument in the `addCustomFunction` method to add the description for the custom formula.
- `#I392186` - Provided option to set maximum file size and maximum data count for validating the files before opening into the component.

## 20.2.43 (2022-08-08)

### Spreadsheet

#### Bug Fixes

- `#I392958` - Issue with "exception throws while pressing the `ctrl` key in the search input on the filter popup" has been resolved.
- `#I393391` - Issue with "cell values convert into Date type while scrolling the sheet along with cell value contain `-` in the data" has been resolved.

## 20.2.40 (2022-07-26)

### Spreadsheet

#### Bug Fixes

- `#I392225` - Issue with "exception throws while applying large formula in the sheet" has been resolved.
- `#I391983` - Issue with "custom sorting for multiple columns is not applied properly" has been resolved.
- `#I345383` - Issue with "unwanted commas added in the exported sheet" has been resolved.
- `#I391962` - Issue with "sort order is not getting properly while sorting the column" has been resolved.
- `#I391982` - Issue with "sorting the time column without considering AM / PM" has been resolved.
- `#I390848` - Issue with "sorting method is not working properly when active cell is not the sorting column" has been resolved.

## 20.2.39 (2022-07-19)

### Spreadsheet

#### Bug Fixes

- `#I390848` - Issue with "sort method is not working as expected for the date type" has been resolved.
- `#I390792` - Issue with "chart object is not updated properly in the cell model after deleting an already created chart element" has been resolved.
- `#I390792` - Issue with "script error occurs while switching chart theme and changing chart type" has been resolved.
- `#I391056` - Issue with "selection is not updated properly after filtering and scrolling which causes copying invalid data" has been resolved.
- `#I390628` - Issue with "find toolbar dialog is misaligned while resizing the browser" has been resolved.
- `#I390628` - Filtered hidden rows are considered during find action issue has been resolved.
- `#I390638` - Issue with "exception throws while unhiding the hidden rows, after selecting a column and perform a Cut action" has been resolved.
- `#I390638` - Issue with "exception throws while scrolling with multi selection in the freeze pane" has been resolved.

## 20.2.38 (2022-07-12)

### Spreadsheet

#### Bug Fixes

- `#I384048` - The issue of copied values being removed after saving when unique is applied is resolved.
- `#I379174` - After importing the protected excel file, the problem of not considering the password when selecting the unprotect sheet option in the sheet tab context menu has been resolved.
- `#I386574` - The exception thrown with font size pixel values while exporting is resolved.
- `#I384953` - Unique formula cell value gets `#spill` error on refresh issue resolved.
- `#F175967` -  The `addToolbarItems` method is not working for locale other than 'en-US' issue has been resolved.

## 20.2.36 (2022-06-30)

### Spreadsheet

#### New Features

- Provided keyboard shortcut for ribbon and added additional shortcut for the spreadsheet.
- Provided improvement in Accessibility for the spreadsheet.
- `#I361779`, `#F174565`, `#I379630` - Performance improvement for conditional formatting with large data.
- `#I360114`, `#I361182`, `#I362993` - Performance improvement for sorting and its undo redo for large data.
- `#I377000` - Provided `unMerge` method to split the merged cell into multiple cells.

#### Bug Fixes

- `#I383625` - Auto detecting as currency format for cell which contains text with currency number issue has been resolved.
- `#I386346` - The select event is not triggered after clicking the formula applied cells issue is resolved.
- `#I383355` - Undo on deleting unique formula cell with text format throws spill error issue has been resolved.
- `#I383420` - The issue of formula bar data not changing after clicking the retry button in the validation dialogue has been resolved.

## 20.1.47 (2022-04-04)

### Spreadsheet

#### Bug Fixes

- `#I370011` - Creating new workbook not removing the filter issue resolved.
- `#I366824` - Formula dependent cells are not updated on clear action issue resolved.
- `#I357792` - Collaborative editing feature issues has been fixed.
- `#I370463` - Getting maximum call stack exceed error during scrolling with large dataset issue resolved.
- `#I366370` - Script error occurs on sheets property change issue resolved.
- `#FB33176` - Chart not rendered if specified data range is not from active sheet issue resolved.
- `#I349643` - Script error occurs on chart creation while importing excel file with custom date format issue resolved.
- `#I371783` - Performance delay occurs while clearing the filter through context menu issue resolved.
- `#I354089` - Hide / show rows not working with freeze pane if headers are hidden issue resolved.
- `#I369939` - Closing circular reference dialog is not working issue has been fixed.

## 19.4.56 (2022-03-15)

### Spreadsheet

#### Bug Fixes

- `SF-369240` - Previous formula displayed while switching the editing from formula cell to blank cell issue resolved.
- `SF-367017` - `Ctrl selection` not working with freeze pane issue resolved.
- `SF-367519` - Border not applied while copy / paste from MS word issue resolved.
- `SF-367525` - Strike through not applied on external copy / paste issue resolved.

## 19.4.55 (2022-03-08)

### Spreadsheet

#### Bug Fixes

- `SF-366825` - Text align icon not updated properly while applying text format for number cell value issue resolved.
- `SF-369477` - Rows not rendered properly while filtering and cell selection not proper with filtered rows in freeze pane issues resolved.

## 19.4.54 (2022-03-01)

### Spreadsheet

#### Bug Fixes

- `SF-367012` - Sort action not working on first row issue resolved.
- `SF-367021` - Filter by selected cell value action on date field is not working issue resolved.
- `SF-367013` - Sort not working after filtered the data in freeze pane issue resolved.
- `SF-368464` - Performance issue while filtering the scrolled data with freeze pane issue resolved.
- `SF-363047` - Insert row is not working while adding rows at the end in finite mode issue resolved.
- `SF-364569` - External paste not working if copy indicator available in spreadsheet issue resolved.

## 19.4.53 (2022-02-22)

### Spreadsheet

#### Bug Fixes

- `SF-367008` - Data range is not updated properly while doing auto fill action issue resolved.
- `SF-367016` - Script error occurs while performing auto fit action on hidden first column after freeze pane issue resolved.
- `SF-364894` - Filtering is not proper in finite mode with less row count issue resolved.
- `SF-367010` - Rows are corrupted on clear filtering action, when the rows are scroll down to bottom issue resolved.
- `SF-367011` - Script error occurs while scrolling up after clearing the large filtered data issue resolved.
- `SF-367014` - Content area scrolled improperly while entering large data in a cell issue resolved.
- `SF-366314` - Horizontal scrolling is not proper after filtering with freeze pane issue resolved.
- `SF-367009` - Scrolling is not proper after filtering the data with freeze row issue resolved.
- `SF-362961` - Formula cell reference not updated properly for other sheets while inserting rows issue resolved.
- `SF-362920` - Cell value is updated while selecting the find next button issue resolved.
- `SF-362962` - Undo and redo actions show invalid expressions in some cases issue resolved.
- `SF-359655` - Improvement for find and replace functionality with locked cells provided.
- `SF-362996` - Invalid error when formula range is updated issue resolved.

## 19.4.52 (2022-02-15)

### Spreadsheet

#### Bug Fixes

- `SF-360092` - Cell navigation occurs while performing key navigation in cell template drop-down popup issue resolved.
- `SF-361817` - Row alignment and cell selection is not proper with large font size during scrolling issue resolved.

## 19.4.50 (2022-02-08)

### Spreadsheet

#### New Features

- `F169781`, `SF-351357` - Provided filtering, sorting, show/hide rows and columns functionalities for freeze pane enabled spreadsheet.
- `SF-359671`, `SF-356044`, `SF-361047` - `actionBegin` event triggered for undo / redo actions. Added `isUndo` and `isRedo` property in undo and redo action respectively to differentiate it from the regular action.

#### Bug Fixes

- `SF-354603` - Thousand separator is not working properly for custom number format issue has been fixed.
- `SF-349643` - Excel with external file link takes more time to load issue fixed.
- `SF-362947` - Cascading cell values does not get updated properly for imported file issue has been fixed.
- `SF-362574` - After filtering the cell validation `isHighlighted` property is enabled and updated wrongly on other cells while scrolling issue resolved.
- `SF-362013` - Dependent cells are not getting updated in unique formula issue has been fixed.
- `SF-353164` - Value property is not available while cell containing formula in saved JSON issue has been fixed.
- `SF-360130` - Conditional formatting is not working properly when insert/delete rows and columns issue has been fixed.
- `SF-362001` - Copy and paste is not work properly with conditional formatting when save and load the spreadsheet as JSON issue has been fixed.
- `SF-362018` - Script error on clearing column data validation issue is resolved.
- `SF-362567` - Data is not updated in the list validation when row is inserted issue has been fixed.

## 19.4.48 (2022-01-31)

### Spreadsheet

#### New Features

- `SF-358321` - Triggered `beforeCellUpdate` event before updating the properties of the cell model while doing actions like editing, copy / paste and data validation, etc. Using this event, you can prevent the particular action.

#### Bug Fixes

- `SF-361363` - Autofill does not hide when selection is in hidden range after undo & redo on filtered rows issue has been fixed.
- `SF-355507` - Copy indicator height when copy and pasting a wrap cell issue has been fixed.
- `SF-361367` - Script error while pasting large range data on data validation applied cell in editing mode issue has been fixed.
- `SF-361580` - Provided cancel argument in action begin event for cell delete and autofill.
- `SF-360962` - Toolbar item not disable with protect sheet issue and edit alert dialog customization support provided.

## 19.4.47 (2022-01-25)

### Spreadsheet

#### Bug Fixes

- `SF-357914` - Multi range custom sort alert dialog not showing issue resolved.
- `SF-360957` - Spinner loads endlessly while importing an excel file issue resolved.

## 19.4.43 (2022-01-18)

### Spreadsheet

#### Bug Fixes

- `SF-354173`, `SF-360223`, `SF-360057` - Selection misalignment and script error on undo operation after resize the row.
- `SF-360109` - While copy paste the merge cell with all borders, the left border is missing in pasted cell.
- `SF-360465, SF-360473` - Undo action for deleted column which is before the viewport area causes script error and selection misalignment issue resolved.
- `SF-356947` - Row height not proper while applying larger font size when row set as custom height issue resolved.

## 19.4.42 (2022-01-11)

### Spreadsheet

#### Bug Fixes

- `SF-360112` - Script error occurs on continuous undo and redo operation for filtering action issue resolved.
- `SF-360962` - Disable toolbar item for protect sheet and edit Alert dialog content customize support provided.
- `SF-361036`, `SF-361123` - Copy paste is not working properly on filtered rows issue has been fixed.
- `SF-360222` - Sorting is not working properly after undo issue has been fixed.
- `SF-352381` - Data not rendered properly on horizontal scrolling in finite mode issue resolved.
- `F171297` - Importing excel file contains conditional formatting with formula throws script error issue has been fixed.
- `SF-359221` - Insert row not working properly while virtual scrolling is disabled issue is fixed.

## 19.4.41 (2022-01-04)

### Spreadsheet

#### Bug Fixes

- `SF-360492` - Row height issue after performing undo operation has been resolved.
- `SF-353871` - Cell alignment issue while copy paste merge cell issue is fixed.
- `I349145`, `I347733` - Script error throws while set the height to hidden rows is resolved.
- `SF-360109` - Bottom border missing while paste merge applied cell issue fixed.
- `SF-354314` - External pasting formula cell which lies below the viewport not working issue has been fixed.
- `SF-354314` - Performance issue on copying large cells which contains custom number format has been fixed.
- `SF-359382` - Color applied for empty cell if less than condition value is in negative in conditional formatting issue has been fixed.
- `SF-359673` - Find and replace is not working after scrolling to bottom in finite mode issue has been fixed.
- `SF-357076`, `SF-360051` - If the column, row and select-all selection range contains a filtered range then, the sorting is applied to its filtered range.
- `SF-358133` - cell save event arguments are not proper for cut / paste action issue resolved.
- `SF-360303` - Selection issue while pasting the multiline character contained text in cell editing mode is resolved.

## 19.4.40 (2021-12-28)

### Spreadsheet

#### New Features

- `I345022` - Alphanumeric support provided for autofill operation.

#### Bug Fixes

- `SF-358411` - Cancelling the replace and replace all actions not working issue resolved. `actionBegin` and `actionComplete` event for `replace` action, the argument property name is changed as below.

    Previous name | Current name
    -----|-----
    `compareVal` | `compareValue`

- `SF-357609` - Filters added on empty cells which are outside the used range issue resolved.
- `SF-359059` - Console error on performing filter by cell value operation in cut cell issue resolved.
- `I347810` - Performance issue while paste 100000 cells in Spreadsheet is resolved.
- `I348364` - Script error while use freeze pane with \n in cell value issue is resolved.
- `F171230` - Cannot prevent pasting format using actionBegin while using Ctrl+V shortcut is resolved.
- `I346033` - Today formula is not working on import issue has been fixed.
- `I346033` - Custom currency format is not applied for zero value issue has been fixed.
- `I346033` - Text formula is not working with `ddd` format issue has been fixed.
- `I346033` - Adding some value to multiplied range which contains empty cell issue has been fixed.
- `I321503` - Cell selection issue after scrolling on imported sheet has been fixed.
- `SF-358418` - Image resize option problem has been fixed.

## 19.4.38 (2021-12-17)

### Spreadsheet

#### Bug Fixes

- `SF-356190` - Not able to change the cell value using beforeCellSave event issue resolved.
- `I346629` - Cell alignment issue while copy paste merged cell from Excel to Spreadsheet issue resolved.
- `F169598` - Sorting issue with number formatted data is resolved.
- `I351813` - Border missing for last merged cell while doing autofill issue has been resolved.
- `I347937` - Selection issue while load data with row height less than 4 pixel is resolved.
- `I356364` - Script error while selecting autofill option after clicking the autofill icon issue resolved.
- `I348734` - Copy/paste with conditional formatting not working issue resolved.
- `I347888` - Insert/delete rows and columns are not working with collaborative editing issue resolved.
- `I348334` - Cell misalignment while applying wrap on the pasted data issue resolved.
- `I348741` - Conditional format highlighting and cell background color overlaps on wrapped cell issue resolved
- `I343781` - Merge breaks on column copy/paste action issue resolved.
- `I347103` - Copy and paste working incorrectly while copy data in backward direction issue resolved.

## 19.3.48 (2021-11-02)

### Spreadsheet

#### Bug Fixes

- `I345577` - Selection misalignment occurs with the resized row issue resolved.
- `I346629` - Selection misalignment while perform autofit to rows issue resolved.
- `I346978`, `I346947` - Data loss after clear filtering issue resolved.
- `I346943` - Copy / paste not working after clear filtering using ribbon issue resolved.
- `I346921` - Cell selections are not proper after scrolling the filtered data issue resolved.
- `I346267` - Last occurrence value not replaced while doing Replace all with workbook mode issue resolved.

## 19.3.47 (2021-10-26)

### Spreadsheet

#### Bug Fixes

- `I344194` - Filter menu opening delay with large data issue resolved.
- `I344794` - Cell selection misalignment occurs when copy paste and resize the pasted cell issue resolved.
- `F29392` - cell selection misalignment on loading Chinese words issue resolved.
- `I345133` - Cell selection misalignment on wrap applied Japanese characters issue resolved.
- `I345064` - Filtering issue on save and load JSON issue resolved.
- `I345959` - Custom sort with zero not working issue resolved.

## 19.3.46 (2021-10-19)

### Spreadsheet

#### New Features

- `I343108` - Provided support to update the border for inserted rows and columns, if the adjacent rows and columns contains same border value.

#### Bug Fixes

- `I344194` - Row height not updated properly after filtering for the rows with wrapped cells issue resolved.
- `I341556` - Scrolling hangs after performing the sorting issue resolved.
- `I340403` - Spreadsheet export with row height greater than 409.5 issue resolved.
- `I344984` - Data validation color format not copied on Autofill issue resolved.
- `I343836` - Empty cell sorting issue resolved.
- `I337429` - Added the events for Clear Validation and Clear Highlight actions in spreadsheet.
- `I344507` - Undo Redo actions are not working for hidden rows issue resolved.
- `I344596` - Unable to apply bottom border to a merged cell issue resolved.

## 19.3.45 (2021-10-12)

### Spreadsheet

#### Bug Fixes

- `II342554` - Copy / paste the image from excel to spreadsheet not working issue resolved.
- `I342003` - Undo / redo action with merged cells and border not work properly issue resolved.
- `I342900` - Resolved the clear filter with hidden column issue.
- `I343756` - Script error occurs while clearing filter on manually unhidden rows issue resolved.
- `I344193` - `CellEditing` event argument does not contains edited value issue resolved.
- `I344288` - `beforeOpen` event not triggered in Spreadsheet issue resolved.
- `I343789` - Console error with clearFilter in Spreadsheet issue resolved.

## 19.3.44 (2021-10-05)

### Spreadsheet

#### New Features

- `I323841`, `I305593` - Data validation with formula input support.

#### Bug Fixes

- `I342782` - `beforeConditionalFormat` event triggered for `delete` and `Clear Contents` actions.
- `I342786` - Selection and row height misalignment on wrapped cells while resizing the column issue resolved.
- `I343328` - Script error occurs on copy / paste action while the spreadsheet is scrolled horizontally issue resolved.
- `I342553` - `Max` function returns error while referring the empty cells issue resolved.
- `I341489` - Content on cells getting duplicated after removing unique function issue resolved.
- `I343150` - Selection performance issue with large data issue resolved.

## 19.3.43 (2021-09-30)

### Spreadsheet

#### Bug Fixes

- `I348582` - Shift selection on whole row makes viewport to scroll right issue has been resolved.

## 19.3.56 (2021-12-02)

### Spreadsheet

#### Bug Fixes

- `I347456` - Console error with 110% browser zoom in issue resolved.
- `I347865` - AutoFill is not working for formula applied cell issue is resolved.
- `I347272` - Performance issue while clear conditional formatting from entire sheet is resolved.
- `I347003` - Loading data with filter the actionComplete event triggered twice issue is resolved.
- `I347340` - Filter popup opening prevented while sheet is protected.
- `I344793` - Getting #Spill while apply Unique formula for text format issue is resolved.

## 19.3.55 (2021-11-23)

### Spreadsheet

#### Bug Fixes

- `I345828` - Toggle Button state not refreshed in ribbon while using clear format option issue resolved.

## 19.3.48 (2021-11-02)

### Spreadsheet

#### Bug Fixes

- `I345577` - Selection misalignment occurs with the resized row issue resolved.
- `I346629` - Selection misalignment while perform autofit to rows issue resolved.
- `I346978`, `I346947` - Data loss after clear filtering issue resolved.
- `I346943` - Copy / paste not working after clear filtering using ribbon issue resolved.
- `I346921` - Cell selections are not proper after scrolling the filtered data issue resolved.
- `I346267` - Last occurrence value not replaced while doing Replace all with workbook mode issue resolved.

## 19.3.47 (2021-10-26)

### Spreadsheet

#### Bug Fixes

- `I344194` - Filter menu opening delay with large data issue resolved.
- `I344794` - Cell selection misalignment occurs when copy paste and resize the pasted cell issue resolved.
- `F29392` - cell selection misalignment on loading Chinese words issue resolved.
- `I345133` - Cell selection misalignment on wrap applied Japanese characters issue resolved.
- `I345064` - Filtering issue on save and load JSON issue resolved.
- `I345959` - Custom sort with zero not working issue resolved.
- `I345577` - Selection misalignment occurs with the resized row issue resolved.

## 19.3.46 (2021-10-19)

### Spreadsheet

#### New Features

- `I343108` - Provided support to update the border for inserted rows and columns, if the adjacent rows and columns contains same border value.

#### Bug Fixes

- `I344194` - Row height not updated properly after filtering for the rows with wrapped cells issue resolved.
- `I341556` - Scrolling hangs after performing the sorting issue resolved.
- `I340403` - Spreadsheet export with row height greater than 409.5 issue resolved.
- `I344984` - Data validation color format not copied on Autofill issue resolved.
- `I343836` - Empty cell sorting issue resolved.
- `I337429` - Added the events for Clear Validation and Clear Highlight actions in spreadsheet.
- `I344507` - Undo Redo actions are not working for hidden rows issue resolved.
- `I344596` - Unable to apply bottom border to a merged cell issue resolved.

## 19.3.45 (2021-10-12)

### Spreadsheet

#### Bug Fixes

- `II342554` - Copy / paste the image from excel to spreadsheet not working issue resolved.
- `I342003` - Undo / redo action with merged cells and border not work properly issue resolved.
- `I342900` - Resolved the clear filter with hidden column issue.
- `I343756` - Script error occurs while clearing filter on manually unhidden rows issue resolved.
- `I344193` - `CellEditing` event argument does not contains edited value issue resolved.
- `I344288` - `beforeOpen` event not triggered in Spreadsheet issue resolved.
- `I343789` - Console error with clearFilter in Spreadsheet issue resolved.

## 19.3.44 (2021-10-05)

### Spreadsheet

#### New Features

- `I323841`, `I305593` - Data validation with formula input support.

#### Bug Fixes

- `I342782` - `beforeConditionalFormat` event triggered for `delete` and `Clear Contents` actions.
- `I342786` - Selection and row height misalignment on wrapped cells while resizing the column issue resolved.
- `I343328` - Script error occurs on copy / paste action while the spreadsheet is scrolled horizontally issue resolved.
- `I342553` - `Max` function returns error while referring the empty cells issue resolved.
- `I341489` - Content on cells getting duplicated after removing unique function issue resolved.
- `I343150` - Selection performance issue with large data issue resolved.

## 19.3.43 (2021-09-30)

### Spreadsheet

#### New Features

- **Auto fill:** This feature allows users to easily fill or copy a series or pattern of values and formats into adjacent cells in any direction.
- **Password protection:** This feature allows users to protect a worksheet by encrypting it with a password.
- **Formula values in data validation input:** This feature allows users to provide formula values in data validation input while applying data validation in a spreadsheet.
- **Custom number formatting:** This feature allows users to customize the display format of numbers, dates, times, percentages, and currency values.
- `I336060` - If edited cell value is an URL then, it set as a hyperlink.

#### Bug Fixes

- `F164899` - Triggered `actionComplete` event during definedRange actions.
- `I340202` - Filter value by selected cell operation not filtering the data properly issue resolved.
- `I339325` - Selection not working properly after updating the `allowEditing` property issue resolved.
- `I341205` - While changing the border color and style of the merged cell is not applied properly issue resolved.
- `I341516` - Sheet name doesn't support carrot bracket issue resolved.
- `I339059` - Horizontal scrolling not working properly while scroll using arrow key issue resolved.
- `I329238`, `F167723`, `I340073`, `I341556` - Filtering large data performance issue resolved.
- `I336310` - Height not updated properly for the rows with wrapped cells using `setRowHeight` method issue resolved.
- `I342382` - Event `select` is not triggered when selecting cells using the keyboard select issue has been fixed.
- `I342399` - Paste is not working with the find dialog issue resolved.

## 19.2.62 (2021-09-14)

### Spreadsheet

#### Bug Fixes

- `I341489` - Content on cells getting duplicated after removing unique function issue resolved.
- `I321503` - Formula value not updated while changing its dependent cell, Add / delete rows and columns not updated the formula reference, Renamed sheet not updated in formula reference and Alignment issues while switching between sheets issues resolved.
- `I339957` - Copy method not working while pasting the copied data using `ctrl+v` action issue resolved.
- `I339531` - Insert column and cut / paste column actions not updated the range data issue resolved.
- `I338070` - Merged cells copy and paste the whole row issue has been fixed.

## 19.2.60 (2021-09-07)

### Spreadsheet

#### New Features

- `I329743` - Provided the support to use a defined name as the source for the list type data validation.
- `I334078` - Provided the support to get information about the width of the column and the height of the row.

#### Bug Fixes

- `I340130` - Spreadsheet usedRange not refreshed while changing the datasource issue resolved.

## 19.2.59 (2021-08-31)

### Spreadsheet

#### Bug Fixes

- `I338835` - The Hyperlink throws script errors when updating a cell with a hyper link issue resolved.
- `I337839` - Rounding of decimal values not same as Excel issue resolved.
- `I338305` - Formula getting updated in wrong cells while scrolling issue resolved.
- `I338305` - Contents are not visible at the bottom while scrolling issue resolved.
- `I337755` - Copy & paste from one spreadsheet to another not working properly issue resolved.
- `F168160` - Spreadsheet format button performs form submit issue resolved.

## 19.2.57 (2021-08-24)

### Spreadsheet

#### Bug Fixes

- `I337420` - Top border not updated for merged cells while loading the saved JSON data issue resolved.
- `I337854` - Sorting action not working properly for newly inserted column issue resolved.
- `I337515` - Same style updated all the rows, while copy / paste multiple lines of text issue resolved.
- `I337957` - Formula expression which contains consecutive `product` and `subtract` operators throws `#VALUE!` error issue resolved.
- `F167279` - Merged cells with border not updated properly on copy / paste action issue resolved.

## 19.2.56 (2021-08-17)

### Spreadsheet

#### New Features

- `I336317` - Updated the formula reference, while performing insert and delete operation.

#### Bug Fixes

- `I336287` - Filter getting removed on clicking the `undo` button issue resolved.
- `I336900` - `Undo` operation with border and formatting not working properly issue resolved.
- `I334797` - Time formatted value is updated without the starting date during editing.
- `I337512` - After setting default cell style, script error occurs on external copy / paste action issue resolved.
- `I337779` - Deleting empty rows not working issue resolved.
- `I335158` - Filter popup is not visible, when scrolling the sheet issue resolved.
- `I337789` - `Dropdown` values for list data validation are not updated, while referring the other sheet reference issue resolved.
- `I337291` - Formula not calculated properly after loading the saved `JSON` data issue resolved.
- `I336375` - Row height updated wrongly during scroll action issue resolved.

## 19.2.55 (2021-08-11)

### Spreadsheet

#### New Features

- `I327430` - Updated the defined names range, while performing insert and delete operation.
- `I331963` - Number formatting applied while performing copy / paste operation between our different spreadsheets.

#### Bug Fixes

- `I336304` - Conditional formatting select button enabled while pressing `SPACE` key without any data issue resolved.
- `I337258` - Script error throws while importing excel file which contains conditional formatting issue resolved.
- `I338761` - UNIQUE function on multiple columns doesn't work properly issue resolved

## 19.2.51 (2021-08-03)

### Spreadsheet

#### Bug Fixes

- `I334797` - Passed the cell value by applying its corresponding format on `dataSourceChanged` changed event.
- `I336261` - Cell alignment while changing `dataSource` property with wrapped data issue resolved.
- `I336144` - Destroyed the find dialog while destroying the spreadsheet component.
- `I336101` - External copied data which contains string value with date is pasted as `ShortDate` format in chrome browser issue resolved.
- `I335814` - Removed the `Hide` item from context menu while right click on hidden selected rows and columns.
- `I331393` - T formula support provided.
- `I336400`, `I334912` - `Undo` and `selection` operation not working properly in the sheet which contains merge cell and freeze pane issue resolved.

#### New Features

- `I334191`, `I334175` - Added a `getRowData` method to get the row data from `dataSource` with updated cell value.

## 19.2.49 (2021-07-27)

### Spreadsheet

#### Bug Fixes

- `I334202` - Merge cell is removed when pasting whole row issue has been fixed.
- `I335255` - Double space is added for some text while pasting from excel issue has been fixed.
- `I334254` - Script error while applying wrap to formatted cell which contains number issue resolved.
- `I335137` - Formula not calculated properly while loading the saved JSON issue resolved.
- `I334796` - Removed the `filterCollection` property during clear filter action.
- `I332867` - Triggered `actionComplete` event during filtering actions.
- `I333138` - After loading the JSON, formula not calculated for dynamically rendered rows issue resolved.
- `I334348` - Script error while hiding and unhiding the rows more the number of rows in viewport issue resolved.
- `I333612` - Filter dialog not visible for the bottom cells issue resolved.
- `I327884` - UNIQUE formula support provided.
- `I335296` - Underline and strike through not working on row resize issue resolved.

## 19.2.48 (2021-07-20)

### Spreadsheet

#### Bug Fixes

- `I332804` - Cut / paste action in newly inserted column issues resolved.
- `I333215` - Triggered `datasourceChanged` event once the `dataSource` property is changed.

## 19.2.47 (2021-07-13)

### Spreadsheet

#### Bug Fixes

- `I332945` - Image not positioned properly inside the freeze pane issue resolved.
- `I331840` - Border not applied properly on wrapped and merged cells issue resolved.
- `I332879` - Duplicate values in formula bar for list data validation issue resolved.

## 19.2.46 (2021-07-06)

### Spreadsheet

#### Bug Fixes

- `I331420` - List `popup` width is not proper while resizing the column issue has been fixed.
- `I332235` - Editing cell address in `name box` does not navigate to that cell issue has been fixed.
- `I331920` - Formula having only strings not parsed properly issue has been fixed.
- `I328009` - Provided option to get filter collection details in `actionComplete` event.
- `I332890` - Clearing filter range does not removes filter issue has been fixed.
- `I329431` - Copy / paste into locked and unlocked cells not working properly while preventing alert dialog issue resolved.
- `I321503` - Cross tab formulas with imported excel file having duplicate reference issue resolved.

## 19.2.44 (2021-06-30)

### Spreadsheet

#### New Features

- `I315412` - Provided support to move and duplicate the sheets.

#### Bug Fixes

- `F166035` - List `dropdown popup` is not positioned properly in android issue has been fixed.
- `I313764` - Issue of copy whole sheet from excel and paste it in spreadsheet with whole sheet selected has been fixed.
- `FB23950, FB22584` - Issue of pasting text from MS Word has been fixed.
- `I309407` - Sorting does not update formula reference issue has been fixed.
- `FB23949` - Row lines are misaligned when `segeo` font style pasted from excel issue has been fixed.
- `I326128` - Find support not working properly for bigger columns and rows issue resolved.
- `I328868` - Copy / paste the formula applied cells issue resolved.
- `I329167` - Copy / paste a formula from one cell to multiple cells issue resolved.
- `I331717` - Sheet contents are not visible, while setting larger font size in finite mode issue resolved.
- `I330546` - Row header with frozen column not updated properly while setting larger font size in finite mode issue resolved.

## 19.1.69 (2021-06-15)

### Spreadsheet

#### Bug Fixes

- `#24686` - Undo for styles on externally pasted table is not working properly issue has been fixed.
- `#F164024` - External pasting for date with applied locale culture is not working issue has been fixed.
- `I328800` - `topLeftCell` property not updated properly in the non virtual mode issue resolved.
- `I329562` - Formula dependent cells not updated, while clearing the value using `DELETE` key issue resolved.
- `I328866` - Ignore blank option not working when the data validation type is `List` issue resolved.

## 19.1.67 (2021-06-08)

### Spreadsheet

#### Bug Fixes

- `#I328361` - Resizing row is not proper when the row contains `\n` in the data source issue has been fixed.
- `I328869, I329122` - Nested `IF` formula and `SUMIF` formula negative value issues resolved.
- `I328812` - Finite scrolling in virtual mode issue resolved.
- `I328809` - Sheet content scrolls up on editing issue resolved.

#### New Features

- `#I307401` - Filter UI updating for insert and delete column actions.
- `I328800` - Provided option for updating the `paneTopLeftCell` property dynamically.

## 19.1.66 (2021-06-01)

### Spreadsheet

#### Bug Fixes

- `#I326912` - Image positioned with negative values after drag and drop issue has been fixed.
- `#24970` - Zero value is not copied from spreadsheet and pasted into MS Excel issue has been fixed.
- `#I327232` - Copy and paste issue of conditional formatting for highlight cell rules case has been fixed.
- `#24626` - Pasting merge cell when copied from MS Excel issue has been fixed.
- `#I328300` - Data gets duplicated while apply sorting with hidden columns issue has been fixed.
- `#24231` - Filter is not getting removed from cells after save and load issue has been fixed.
- `I324752` - Horizontal scrolling through touchpad not working issue resolved in `chrome`, `firefox` and `edge` browsers.
- `#24582` - Conditional formatting is not getting refreshed in a cell with formula after editing argument values issue has been fixed.
- `I328018` - Editing is not working in formula bar for unlocked cells issue resolved.
- `I328870` - Hide sheet option in context menu not working issue resolved.
- `I328151` - Clear content option not working properly in `hyperlink` applied cells issue resolved.
- `I327665` - Provided the CTRL + A and double/triple tap selection support inside the cell.
- `I329132`, `I329160` - Deleting a row changes the formula values to `#REF!` issue resolved.
- `I328248` - Charts are not refreshed during filtering issue resolved.
- `I327667` - `Match` formula does not throw error while no match is found in a given range issue resolved.
- `I306565` - Cross tab formula cell range selection and sheet name reference in formula issues resolved.

#### New Features

- `#22392` - Added `beforeConditionalFormat` event which will be triggered before applying or removing the format from a cell based on its condition.

## 19.1.64 (2021-05-19)

### Spreadsheet

#### Bug Fixes

- `I304896`, `I305853` - `SUMIF` and `AVERGEIFS` formula issue resolved.
- `I325908` - Empty space occurs with merge / freeze pane and `IF` formula calculation return as wrong number issues resolved.
- `!289803`, `I306565`, `I305935`, `I308657`, `I321503`, `I296802`, `I316078`, `I325908`, `I327092` - We have provided the cross tab reference in formula expression support.
- `#25146` -  Copy paste related issue with the locked / unlocked cells has been fixed.

## 19.1.63 (2021-05-13)

### Spreadsheet

#### Bug Fixes

- `I319406` - Date is not updated properly in `Ukraine` time zone issue resolved.
- `I324752` - Horizontal scroll bar not visible in `MAC` machine issue resolved.

## 19.1.59 (2021-05-04)

### Spreadsheet

#### Bug Fixes

- `#24579` - `Gridlines` got disappear while performing horizontal scrolling with `showHeaders` property as `false` issue resolved.
- `#23650` - Formula reference not properly updated on copy / paste action issue resolved.
- `#I314883` - Formula dependent cells not updated after rendering destroyed spreadsheet issue has been fixed.
- `#F164825` - Cell navigation throws script error when `allowScrolling` set to `false` issue has been fixed.
- `#23944` - Formula suggestion drop down is not displayed in the cells located in the bottom of the sheet issue has been fixed.
- `I312024` - `Sheets` property binding not working issue resolved.
- `#24848` - Nested formula issue resolved.

## 19.1.58 (2021-04-27)

### Spreadsheet

#### Bug Fixes

- `#22087` - Filter icon is removed after refresh issue has been fixed.
- `#24222` - Conditional formatting font color is changed to default color in list data validation issue has been fixed.
- `#23945` - Conditional Formatting is not working properly when range is selected from down to up & right to left issue has been fixed.
- `F163837`, `F164024` - Number format drop down shows wrong formatted value while setting locale text for the number format items issue resolved.
- `#23856` - Height of the merged cell increases on `Alt + Enter` action issue resolved.
- `#23644` - Dependent cells not updated after using `openFromJson` and `refresh` method issue resolved.

## 19.1.57 (2021-04-20)

### Spreadsheet

#### Bug Fixes

- Custom height not working properly while importing with wrap text, it updates normal height.
- `#24298` - Conditional formatting applied to selected cells even if there is no value given in the dialog issue resolved.
- Issue with copy data from power point table and paste it in spreadsheet has been fixed.
`#I314444` - Fixed cell selection issue in different screen resolution.
`#24295` - Aggregate count is not displayed properly when selected range contains zero value issue has been fixed.
`#23869` - Paste values only is not working for formula cells issue has been fixed.
`#23867` - Cancel button is not working in hyperlink dialog when sheet is protected issue has been fixed.
`#23861` - Unwrapping externally pasted wrap text does not reduce the row height issue has been fixed.
`#23112` - Match function is not working when cell reference is given as parameter issue has been fixed.
`#21561` - Unable to type percentage value without autoformat issue has been fixed.

## 19.1.56 (2021-04-13)

### Spreadsheet

#### Bug Fixes

`#I323532` - Pressing any key on chart throws script error issue has been fixed.

## 19.1.55 (2021-04-06)

### Spreadsheet

#### Bug Fixes

- Sort formula not working properly issue resolved.
- Clipboard style issue resolved.
- `I316103` - Resolved the selection misalignment issue in non virtual mode.
`#I316931` - Selection alignment for wrap cell having border on 150 resolution issue has been fixed.
`#I321143` - Warning message is not showing while deleting locked cells issue has been fixed.
`#I319204` - Skipped `query` property while saving as JSON.

## 19.1.54 (2021-03-30)

### Spreadsheet

#### New Features

- **Freeze pane:** Allows users to keep the specified rows and columns always visible at the top and left side of the sheet while scrolling through the sheet.
- **PDF Export:** Allows users to save the spreadsheet data as a PDF document.
- **Password protection:** Allows users to protect the workbook with a password.

#### Bug Fixes

- Copy / paste the merge cells not working properly issue resolved.
`#I316931` - Selection misalignment issue when applying border on wrap text has been resolved.

## 18.4.44 (2021-02-23)

### Spreadsheet

#### Bug Fixes

- The `getData` method is not working when range is passed without sheet name issue fixed.

## 18.4.43 (2021-02-16)

### Spreadsheet

#### Bug Fixes

`#F161227` - Prevented deleting range which contains lock cells.
`#F162534` - Issue on editing a cell that depend on other cell after addition of date using Plus (+) operator issue fixed.
`#313009` - Delete rows and columns using `delete` method issues resolved.
`#313000` - The `insertSheet` method will now prevent the sheet with duplicate name from inserting.
`#I312853` - Provided the actionBegin and actionComplete event for sheet rename action in spreadsheet

## 18.4.42 (2021-02-09)

### Spreadsheet

#### Bug Fixes

- External paste for cell style is not working properly when spreadsheet has common style issue has been fixed.
- Ribbon items are not updated during external paste issue has been fixed.
- External paste is not working for `strikethrough` style issue has been fixed.
- Wrap with Resize, text align issue fixed.
- Formula range with more than AA issue fixed.

## 18.4.41 (2021-02-02)

### Spreadsheet

#### Bug Fixes

`#I311925` - Event `cellSave` is not triggered when list value changes issue has been fixed.

## 18.4.39 (2021-01-28)

### Spreadsheet

#### Bug Fixes

`#F161227` - Lock cell delete issue prevented.
`#I311230` - Sorting for number is not working after editing issue has been fixed.
`#I311230` - Pasting within the copied range is not working properly issue has been fixed.

## 18.4.35 (2021-01-19)

### Spreadsheet

#### Bug Fixes

`#I308657` - Hyperlink issue with the colon specified address is fixed.

## 18.4.34 (2021-01-12)

### Spreadsheet

#### Bug Fixes

`#I309395` - Merge method for different sheet is not working issue fixed.
`#I309076` - Formula parsing issue fixed.

## 18.4.33 (2021-01-05)

### Spreadsheet

#### Bug Fixes

`#I308693` - Editing merge cell shows text two times issue has been fixed.
`#I308693` - Undo & redo is not working for background color issue has been fixed.
`#I293654` - Nested formula issue fixed.

## 18.4.32 (2020-12-29)

### Spreadsheet

#### Bug Fixes

`#I308504` - Added missed text in the localization file.
`#I305131` - Unlocking cells is not working for the defined columns in the view in ASP.NET Core issue has been fixed.

## 18.4.31 (2020-12-22)

### Spreadsheet

#### Bug Fixes

`#I296802` - Provided proper error support and if formula issue fixed.

## 18.4.30 (2020-12-17)

### Spreadsheet

#### New Features

- **Chart:** Transforms your Spreadsheet data to an intuitive overview for better understanding and to make smart business decisions.
`#I298335` - Provided support to paste content inside a cell while editing.
`#I301769` - Provided support for short date formats `dd/MM/yyyy` and `yyyy-MM-dd`.

#### Bug Fixes

`#I301769` - Entered date value changes for Eastern European Standard Time issue has been fixed.
`#I301769` - Sorting whole column show empty rows first issue has been fixed.

## 18.3.52 (2020-12-01)

### Spreadsheet

#### Bug Fixes

- Paste is not working when clicking on paste button in the ribbon tab.
`#I296802` - Fixed column paste and formula issue.

## 18.3.51 (2020-11-24)

### Spreadsheet

#### New Features

`#I300338` - Provided support to link the whole column or row data to the list validation.
`#I300657` - Provided support for custom alert message to the validation dialog.

#### Bug Fixes

`#I301708` - Border is removed when pasting values adjacent to border contained cells issue has been fixed.

## 18.3.50 (2020-11-17)

### Spreadsheet

#### Bug Fixes

`#I301868` - Script error throws after editing long number in custom format applied cell issue has been fixed.
`#I301863` - Issue of editing date in `Text` format applied cell is formatted to date value has been fixed.
`#I300737` - Issue of select all after scrolling not selecting some top rows has been fixed.
`#I300737` - External paste is not working when spreadsheet has copied data issue has been fixed.

## 18.3.48 (2020-11-11)

### Spreadsheet

#### Bug Fixes

- Cell text navigation through mouse click is not working during cell edit issue has been fixed.
`#I301019` - Default value not set for data validation model issue has been fixed.
`#I301121` - Script error throws while editing the border style applied cell issue fixed.

## 18.3.47 (2020-11-05)

### Spreadsheet

#### Bug Fixes

`#I295003` - Column header misalignment during scrolling when the spreadsheet contains merge cell issue has been fixed.
`#I299237` - Keyboard shortcut for clipboard is not working on macOS issue has been fixed.
`#I292451` - Cell misalignment during scrolling when it contains merged range issue has been fixed.

## 18.3.44 (2020-10-27)

### Spreadsheet

#### Bug Fixes

`#I298442` - File type added for `file` property in `OpenOptions`.

#### New Features

- **Dynamic data binding:** Provides the option to change datasource dynamically by changing `dataSource` property of the range.

## 18.3.42 (2020-10-20)

### Spreadsheet

#### Bug Fixes

`#I297215`- The method `lockCell` is not working in JS platform issue has been fixed.
`#I296710`- Formula reference selection issue has been fixed.

## 18.3.40 (2020-10-13)

### Spreadsheet

#### Bug Fixes

`#I295594`- Data validation export issue with the empty values has been fixed.
`#I287796`- Image not displaying issue has been fixed.
`#I296132`- Console issue while providing the incorrect data source format has been fixed.
`#I296145`- Number value not updated properly with the property binding in angular spreadsheet fixed.
`#I290629`- Script error throws while editing the formula bar after scrolling fixed.
`#I288573` - Fixed issue of cell is duplicated randomly on merge cell during scrolling.
`#I295398`- Added isLocked cell property in import export support.
`#I301019` - Default value not set for data validation model issue has been fixed.
`#I301121` - Script error throws while editing the border style applied cell issue fixed.

## 18.3.35 (2020-10-01)

### Spreadsheet

#### Bug Fixes

`#I276272`- Spinner not showed until remote data being loaded issue is fixed.
`#I285113`, `#I285621`, `#I286053`, `#I286103`, `#I288652`- Spreadsheet is not working in ES2015 issue is fixed.
`#I287385` - Added missed text in the localization file.

#### New Features

`#I282699`- Provided option to prevent protected sheet dialog box in spreadsheet.
- **Picture:** Allows you to view, insert, and modify a picture in a spreadsheet with customizing options.
- **Multi-line editing:** Allows you to insert a line break between paragraphs of the text within a cell in a Spreadsheet.
- **Range selection helper:** Helps you to select a range or multiple ranges when editing a formula in a cell.

## 18.2.44 (2020-07-07)

### Spreadsheet

#### New Features

- **Conditional formatting:** Provides option to format a cell or range of cells based on the conditions applied.
- **Clear:** Provides option to clear the content, formats, and hyperlinks applied to a cell or range of cells in a spreadsheet.
- **Aggregates:** Provides option to check the sum, average, and count for the selected cells or range in the sheet tab.

## 18.1.56 (2020-06-09)

### Spreadsheet

#### Bug Fixes

`#I279666`- Provided the actionBegin and actionComplete event for page switching action.
`#I276608`- Provided the validation to prevent the long text exception for list data validation.

### Spreadsheet

#### Breaking Changes

- API name changes.

Old Property | New Property
-----|-----
`rangeSettings` | `ranges`

## 18.1.42 (2020-04-01)

### Spreadsheet

#### Bug Fixes

`#I256901` - Used range not setting properly while using cell data binding issue is fixed.
`#I264109` - Error alert doesn't shows when named range given with space issue is fixed.
`#I266607` - Header created multiple time while adding the sheet model dynamically is fixed.

#### New Features

- **Merge cells:** Provides option to can combine two or more cells located in the same row or column into a single cell.

#### Breaking Changes

- API name changes.

Old Property | New Property
-----|-----
`activeSheetTab` | `activeSheetIndex`

## 18.1.36-beta (2020-03-19)

### Spreadsheet

#### New Features

- **Wrap text:** Provides the option to display the large content as multiple lines in a single cell.
- **Data validation:** Provides the option to validate edited values based on data validation rules defined for a cell or range of cells.
- **Find and Replace:** Provides the option to find the data and replace it across all the sheets in Spreadsheet.
- **Protect sheet:** Provides the option to restrict the user actions like cell editing, row and column insertion, deletion, and resizing.
- **Borders:** Provides the option to customize cell gridlines such as color and its style for enhanced UI.
- **Show/Hide:** Provides the option to show/hide the rows, columns and sheets.
- **Insert/delete:** Provides the option to insert/delete the rows, columns and sheets.

## 17.4.51 (2020-02-25)

### Spreadsheet

#### New Features

`#I258049`- Provided LN formula support in Spreadsheet.

## 17.4.50 (2020-02-18)

### Spreadsheet

#### Bug Fixes

- File menu item select event not triggered issue fixed.

## 17.4.49 (2020-02-11)

### Spreadsheet

#### Bug Fixes

- Integrated the separate styles for filtering.

## 17.4.47 (2020-02-05)

### Spreadsheet

#### Bug Fixes

`#I256901` - Hyperlink is not working with URL scheme 'https' issue has been fixed.
`#I256901` - Export not working when adding hyperlink through method issue has been fixed.

## 17.4.46 (2020-01-30)

### Spreadsheet

#### New Features

- `#I256901` - Provided the supports to show/hide ribbon tabs, add new ribbon tabs and enable/disable file menu items.
- `#I257035` - Provided option to add custom items in Spreadsheet ribbon toolbar
- `#I261768` - Provided custom function support.
- `#I259360` - Provided sheet visibility support to hide/show the sheets in Spreadsheet.
- Provided `AutoFit` method for auto resize the rows/columns in Spreadsheet.
- `#I251695`, `#I256191`, `#I261629` - Provided Save as JSON and Load from JSON support.
- `#I251210`, `#I256211` - Provided cell template support which is used for adding custom components in to Spreadsheet.
- `#I258878`, `#I260952`, `#I258876`, `#I258049` - Provided `SLOPE` and `INTERCEPT` Formula support.

#### Bug Fixes

- `#I256901` - Script error while loading the Spreadsheet control with empty data source issue fixed.
- `#I256901` - Support Handled for providing the hyperlink through data source.
- `#I260738` - Fixed the style compatibility issue.

## 17.4.41 (2020-01-07)

### Spreadsheet

#### Bug Fixes

`#F149335` - Excel export issue has been fixed.

## 17.4.39 (2019-12-17)

### Spreadsheet

#### New Features

- **Filtering:** Helps you to view specific rows in the spreadsheet by hiding the other rows.
- **Undo Redo:** Provides the option to perform undo redo operations in spreadsheet.
- **Collaborative Editing:** Provides the option for real time changes across multiple users in the Spreadsheet.
- **Hyperlink:** Provides the option to navigate the web links or cell reference within the sheet or to other sheets in spreadsheet.

## 17.3.16 (2019-10-09)

### Spreadsheet

#### New Features

- Provided `updateCell` method to update a cell properties

## 17.3.14 (2019-10-03)

### Spreadsheet

#### New Features

- **Sorting:** Helps you to arrange the data to particular order in a selected range of cells.
- **Resize:** Allows you to change the row height and column width. Auto fit the rows and columns based on its content.

## 17.3.9-beta (2019-09-20)

### Spreadsheet

The Spreadsheet is an user interactive component to organize and analyze data in tabular format with configuration options for customization.

- **Data sources:** Binds the spreadsheet component with an array of JavaScript objects or DataManager.
- **Virtualization:** Provides option to load large amount of data without performance degradation.
- **Selection:** Provides option to select a cell or range of cells.
- **Editing:** Provides options to dynamically edit a cell.
- **Formulas:** Provides built-in calculation library with predefined formulas and named range support.
- **Clipboard:** Provides option to perform the clipboard operations.
- **Cell formatting:** Provides option to customize the appearance of cells.
- **Number formatting:** Provides option to format the cell value.
- **Open:** Provides option to open an Excel file in spreadsheet.
- **Save:** Provides option to save spreadsheet data as excel file.
- **RTL:** Provides right-to-left mode which aligns content in the spreadsheet component from right to left.
- **Localization:** Provides inherent support to localize the UI.
- **Accessibility:** Provides with built-in accessibility support which helps to access all the spreadsheet component features using the keyboard, screen readers, or other assistive technology devices.
