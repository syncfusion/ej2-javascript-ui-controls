# Changelog

## [Unreleased]

## 17.3.21 (2019-10-30)

### TreeGrid

#### Bug Fixes

- `#249633` - Row Drag and Drop works fine with RemoteSaveAdaptor in SelfReference Data.

## 17.3.19 (2019-10-22)

### TreeGrid

#### Bug Fixes

- `#251499` - Border applied properly for checkbox column when `treeColumnIndex` property is enabled with different themes.

## 17.3.17 (2019-10-15)

### TreeGrid

#### Bug Fixes

- `#248114` - Data loads properly when we set `height` to 100% in `EnableVirtualization`.

## 17.3.16 (2019-10-09)

### TreeGrid

#### Bug Fixes

- `#249633` - Row Drag and Drop works fine with RemoteSaveAdaptor.
- `#F147968` - Datasource update works fine after cancelling edit action on cell editing.

## 17.3.14 (2019-10-03)

### TreeGrid

#### New Features

- `#237050`, `#237420`, `#237783` - Custom Data binding support has been provided that allows users to handle data externally and bind result to treegrid.
- `#F145931` - Frozen Rows and Columns support has been provided that freezes the specific rows or columns and make them always visible in the top and/or left side of the Tree Grid while scrolling.

#### Bug Fixes

- `#237050` - CheckBox Selection works fine while refreshing dataSource.
- `#F147099` - Row drag and drop working fine with self reference data.
- `#247045` - Row drag and drop support has been provided for Remote Data.
- `#246926` - Searching works fine when the `hierarchyMode` is `child` and when records are in collapsed state.

## 17.3.9-beta (2019-09-20)

### TreeGrid

#### New Features

- `#237050`, `#237420`, `#237783` - Custom Data binding support has been provided that allows users to handle data externally and bind result to treegrid.
- `#F145931` - Frozen Rows and Columns support has been provided that freezes the specific rows or columns and make them always visible in the top and/or left side of the Tree Grid while scrolling.

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
