# Changelog

## [Unreleased]

## 18.2.46 (2020-07-21)

### Spreadsheet

#### Bug Fixes

`#I282937`- Edit element is not showing the boolean value 'false' issue is fixed.

## 18.2.45 (2020-07-14)

### Spreadsheet

#### Bug Fixes

`#I276272`- Spinner not showed until remote data being loaded issue is fixed.

#### New Features

`#I282699`- Provided option to prevent protected sheet dialog box in spreadsheet.

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
