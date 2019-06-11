# Changelog

## [Unreleased]

## 17.1.51 (2019-06-11)

### TreeGrid

#### Bug Fixes

- #238350 - Editing works fine in remote data.

## 17.1.49 (2019-05-29)

### TreeGrid

#### Bug Fixes

- #236554 - Expand/Collapse icon for 2nd level parent while using remote data works fine

- #236554 - enableCollapseAll works fine with paging

## 17.1.48 (2019-05-21)

### TreeGrid

#### Bug Fixes

- Styling alternate rows of TreeGrid works fine in collapsed state

## 17.1.47 (2019-05-14)

### TreeGrid

#### New Features

- 'Row Template' support is provided that allows to use custom layout for the TreeGrid rows.

## 17.1.44 (2019-05-07)

### TreeGrid

#### Bug Fixes

- Adding a new record or Deleting an existing record is working fine with the sorted data.

## 17.1.41 (2019-04-16)

### TreeGrid

#### Bug Fixes

-#143815 - `GridLine` property is working fine in MVC

## 17.1.40 (2019-04-09)

### TreeGrid

#### Bug Fixes

- `addRecord` method is working fine and also allows to add record at desired row position.

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
