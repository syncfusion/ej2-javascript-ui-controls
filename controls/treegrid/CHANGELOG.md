# Changelog

## [Unreleased]

## 17.4.46 (2020-01-30)

### TreeGrid

#### Bug Fixes

- `#245194`- Cleared the template elements on performing TreeGrid actions.
- `#260348`- Editing works fine when we dynamically change allowEditing property.

## 17.4.43 (2020-01-14)

### TreeGrid

#### Bug Fixes

- `#258560`- Fixed issue in alignment of newly added child record when auto increment column is used for primary key column.

## 17.4.40 (2019-12-24)

### TreeGrid

#### Bug Fixes

- `#257683`- Delete action works properly for the newly added record in TreeGrid using RemoteSaveAdaptor.
- `#254018`- Alignment issue when enabling Row Drag and Drop has been fixed.
- `#249633`- Dragged row removed properly from dragged position in Row Drag and Drop when we bind sorted data to Tree Grid data source.
- `#147099`- Stacked Header works properly when we add dynamically.

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
