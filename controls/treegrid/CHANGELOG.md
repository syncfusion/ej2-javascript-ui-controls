# Changelog

## [Unreleased]

### TreeGrid

#### Bug Fixes

- `#292933` - checkbox rendered properly while using  the template column.
- `#290187` - Row drag and drop between treegrid works fine while using self reference data binding.

## 18.2.57 (2020-09-08)

### TreeGrid

#### Bug Fixes

- `#291330` - Expand or Collapse of the inner level parent records in custom binding works fine.
- `#289600` - Updating the datasource dynamically with Virtualization after scrolling works fine.

## 18.2.56 (2020-09-01)

### TreeGrid

#### Bug Fixes

- `#289685` - Aggregate Column Formatting is working fine
- `#288542` - The Expand / Collapse icon has been rendered properly while enabling expand state mapping and adding a new record.
- `#289459`, `#290332` - Alignment of rows in frozen column works perfectly.

## 18.2.55 (2020-08-25)

### TreeGrid

#### Bug Fixes

- `#287235` - While enabling expand state mapping the Expand / Collapse icon works fine at nested child levels.

## 18.2.54 (2020-08-18)

### TreeGrid

#### Bug Fixes

- `#285434`- Column SortComparer function works fine with null values for RemoteSaveAdaptor datasource.
- `I286227` - Checkbox with `allowRowDragAndDrop` property rendered properly after editing and cancelling in cell edit mode.

## 18.2.47 (2020-07-28)

### TreeGrid

#### Bug Fixes

- `#284987`- Records rendered properly while using remote save adaptor in created event.
- `#285434`- Column SortComparer function works fine with null values in datasource.

## 18.2.45 (2020-07-14)

### TreeGrid

#### Bug Fixes

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
