# Changelog

## [Unreleased]

## 21.2.9 (2023-06-06)

### Tree Grid

#### Bug Fixes

- `#I464729`, `#I465729` - Resolved issue where virtualization with scrolling caused records to repeat.
- `#I464999` - Fixed issue where white space was displayed while scrolling through nested records in virtualization.
- `#I457827`, `#I182340`, `#I465331`, `#I465871` - Fixed issue where 'No Records to display' message wasn't being displayed when using frozen columns with `enableCollapseAll` Property.
- `#I464520` - Fixed an issue where clearing the search bar in EJ2 would result in a message saying "No records to display."
- `#I459187` - Fixed an issue where records were getting missed in the viewport when adding a new record in a specific position.

## 21.2.8 (2023-05-30)

### Tree Grid

#### Bug Fixes

- `#I461200` - Resolved After expanding parent record in virtualization enabled remote data, the child records were not updated properly.
- `#I459187` -Fixed an issue where the Records are missing on adding a record as child and below.
- `#I462460` , `#I461924` - Resolved Script Error throws while using Virtualization with Collapse All action.

## 21.2.6 (2023-05-23)

### Tree Grid

#### Bug Fixes

- `#I459413` - Fixed an issue where the expanded status in remote data was not updating correctly for nested child records.

## 21.2.5 (2023-05-16)

### Tree Grid

#### Bug Fixes

- `#I826966` - Fixed a bug where records were getting missed when adding a record at the bottom of the virtualization enabled sample.
- `#I454734` - Resolved filtering is not working properly when using remote data with hierarchy mode as "Both".

## 21.2.4 (2023-05-09)

### Tree Grid

#### Bug Fixes

- `#I181658` - Fixed the issue where a script error was thrown when moving a dropdown option with key input (Arrow Keys) in edit template.

## 21.2.3 (2023-05-03)

### Tree Grid

#### Bug Fixes

- `#I440455`, `#F180980` - Resolved the issue where the data source was not being rendered in the row template sample.

## 21.1.41 (2023-04-18)

### Tree Grid

#### Bug Fixes

- `#I448090` - The excel filtering dialog box has been fixed to display the data source after filtering a column.
- `#I414166` - Virtualization has been resolved when enabling it in the load event.

## 21.1.38 (2023-04-04)

### Tree Grid

#### Bug Fixes

- `#I407372`, `#I449067`, `#I424805` - Fixed console error when dragging and dropping a record and then pressing the tab key.
- `#I441661` - Fixed incorrect checkbox selection update after selecting a record and collapsing in checkboxOnly mode.
- `#I449191` - Fixed incorrect cell index selection in the getSelectedRowCellIndexes method when collapsing a record.
- `#I442710` - Resolved issue of row dropping at the bottom segment (with the last record) not working properly.
- `#I444506` - Resolved issue of last row border not being added when reordering a row to the last index.

## 21.1.35 (2023-03-23)

### Tree Grid

#### Breaking Changes

- Unnecessary role attributes for Tree Grid row cell and header elements have been removed to enhance accessibility standards.
- The `td` element for `e-detailcell` in [detail element](https://ej2.syncfusion.com/documentation/treegrid/row/detail-template/) has been only changed from a `td` element to the `th` element to enhance accessibility standards.

## 20.2.36 (2022-06-30)

### Tree Grid

#### Bug fixes

- `#I379907` - Resolved editing for the dropdown edit type column with state persistence enabled.

#### Features

- `#I334966`, `#I373929`, `#I332693`, `#I342835`, `#F172606`, `#F171250`, `#F171248` - Provided row drag and drop support with virtualization feature enabled.
- `#I367483` - Provided support for row indent and outdent functionality. Please find the demo link [here](https://ej2.syncfusion.com/demos/#/bootstrap5/tree-grid/inline-editing).

## 19.2.44 (2021-06-30)

### Tree Grid

#### Bug Fixes

- `#332604` - Resolved white space issue while using less number of records with Virtualization.

## 18.4.30 (2020-12-17)

### Tree Grid

#### New Features

- `#294082` - Provided Immutable Support to refresh specific rows while perform Tree Grid actions.
- `#283491` - Provided error handling support to easily rectify errors in sample side.
- `#298682`, `#299561` - Added getVisibleRecords API to get the visible records based on collapsed rows state.

#### Bug Fixes

- `#F157882`- After editing the row using `updateRow` method, `getCurrentViewRecords` method updated properly.
- `#F157882`- When editing with a double click, it works fine when we only have one record.
- `#289600` - Records get expanded properly after collapsing all records using `collapseAtLevel` method in observable binding.
- `#F157099` - Virtualization with Aggregates works fine with large number of records.
- `#296233` - Row Drag and Drop within treegrid works fine.
- `#297986` - Row Drag and drop within treegrid works fine with checkbox enabled.
- `#F158886` - Cell editing with frozen columns works fine.
- `#299761` - Treegrid column width renders fine in Internet Explorer when Virtualization is enabled.
- `#301861` - Tree Grid dataSource updated properly while using setCellValue method.
- `#F159697` -  Order of child records are displayed correctly after editing in remote data binding.
- `292453` - Treegrid refresh method works fine after updating the data.

## 18.3.35 (2020-10-01)

### TreeGrid

#### Bug Fixes

- `#F157258` - `updateRow` method works fine for updating collapsed data.
- `#292933` - checkbox rendered properly while using  the template column.
- `#289685` - Aggregate Column Formatting is working fine
- `#288542` - The Expand / Collapse icon has been rendered properly while enabling expand state mapping and adding a new record.
- `#287235` - While enabling expand state mapping the Expand / Collapse icon works fine at nested child levels.
- `#285434`- Column SortComparer function works fine with null values for RemoteSaveAdaptor datasource.
- `#284987`- Records rendered properly while using remote save adaptor in created event.
- `#285434`- Column SortComparer function works fine with null values in datasource.
- `#F155077`- Records rendered properly while using remote data with jQuery unobtrusive library.

## 18.2.44 (2020-07-07)

### TreeGrid

#### Bug Fixes

- `#279109` - Checkbox checked properly for child records in remote data.
- `#277364`, `#279732` - Checkbox with `allowRowDragAndDrop` property rendered properly after editing and cancelling in cell edit mode.
- `#277364` - Checkbox with `autoCheckHierarchy` property rendered properly after editing and cancelling in cell edit mode.
- `#278266` - Edit type `dropdownedit` is working properly in cell edit mode when enter key is pressed.
- `#272026` - `updateRow` method works fine for updating treegrid data source.
- `#273309` - Editing the zeroth level added record works fine in Batch mode.
- `#277361` - Auto generated columns work fine when two treegrids are rendered on the same page.

#### New Features

- `#258863`, `#271677` - Expand & Collapse child rows support has been provided in Excel Export.
- Columnchooser support has been provided that allows user to show or hide columns dynamically.
- Provided support for Editing with Virtualization feature.

#### Breaking Changes

- Now `data`, `row` these Tree Grid selection event arguments are get array values only when we perform multi selection. Please find modified event arguments and it types from the below table,

`Properties` |`Type`
-----|-----
`data` | `Object or Object[]`
`rowIndex` | `number`
`rowIndexes` | `number[]`
`row` | `Element or Element[]`

## 17.4.39 (2019-12-17)

### TreeGrid

#### New Features

- AutoFill support has been provided that allows users to copy the data of selected cells and paste it to another cells by dragging.

#### Breaking Changes

- Default value of column's `disableHtmlEncode` is set to true, so the HTML tags can be displayed in the Grid header and content by default. To display it as html content `disableHtmlEncode` need to be set as false.

## 17.2.48-beta (2019-08-28)

### TreeGrid

#### New Features

- Checkbox selection support has been provided that allows users to select rows using checkbox.
- Checkbox Column support has been provided that allows users to check rows using checkbox in treegrid column.

#### Bug Fixes

- Change detection for properties `dataSource` and `query` were handled for remote data.
- Edited records can be searched/filtered.
- Inner level records will be collapsed/expanded after filtering/searching actions.

## 17.1.1-beta (2019-01-29)

### TreeGrid

#### Bug Fixes

- `Query` maintenance support provided for `refresh` method after expanding any child rows.
- Property change support for `height` property has been provided.
- Expand icon is prevented from displaying for the root/zeroth level record which has `hasChildMapping` field as false.
- Child records of third level or its successor displays properly based on their hierarchy relation in self reference data binding.

#### New Features

- `Excel-Like Filtering` support is provided that allows users to create complex filter criteria for a column by allowing users to select possible filter values from a checkbox list. The advanced filter can be used to build complex filter criteria.

## 16.4.45 (2019-01-02)

### TreeGrid

#### Bug Fixes

- Added events for the column menu feature and added `columnMenuItems` API to modify the column menu items in column menu.
- Added `sortComparer` API to perform custom sorting in TreeGrid.

## 16.4.44 (2018-12-24)

### TreeGrid

#### Bug Fixes

- Expanding and Collapsing records is working fine when `pageSizeMode` is set as `All`.
- `expandAtLevel`, `collapseAtLevel`, `expandAll` and `collapseAll` methods are working fine when `pageSizeMode` is set as `All`.
