# Changelog

## [Unreleased]

## 16.4.54 (2019-02-19)

### Grid

#### Bug Fixes

- Custom command content is not working in edited state when it is used in Multiple Columns issue is fixed.
- Selection is not maintained when using `rowselected` and `rowdeselected` event is resolved.
- Reactive aggregate is updating aggregate with current view data on cell editing is fixed.
- Grid gets refreshed twice when we change the values through `setProperties` method is fixed.

## 16.4.53 (2019-02-13)

### Grid

#### Bug Fixes

- Persisted row selection is not cleared in other pages while calling `clearSelection` method is resolved.
- Grid cells with value '0' are exported as an empty cells in excel exporting is fixed.
- Multiple requests are sent to server for each checkbox selection is fixed.
- Additional parameter is not passed to the server when getting checkbox selection state is resolved.
- Script error thrown while dragging the row to outside of the Grid content issue is fixed.
- Auto generated columns not working when we change the Grid dataSource dynamically and also it throws Script error is fixed.
- Programmatic deletion is not working in batch edit mode is fixed.
- Grid shows invalid result while clearing string column values in Batch mode is fixed.
- Mouse event is passed as a parameter for `rowDrag` event.
- Editing misbehaves with `allowResizing` and `frozenColumns` enabled is fixed.
- Need to maintain edit state when exception thrown with custom binding is fixed.
- Grid `getRowInfo` method throws script Error on Expand and Collapse is fixed.

## 16.4.52 (2019-02-05)

### Grid

#### Bug Fixes

- `selectCell` event throws script error when two grid refresh requests are made simultaneously is fixed.
- Promise is not resolved while perform CRUD operation with Observables is fixed.
- Validation message misplaced in dialog editing when we render the new row at bottom issue is fixed.
- Argument is not returned well in `rowDragStart` Event is resolved.
- Column chooser dialog not getting hidden while click outside of the Grid is fixed.
- Selecting cell using arrow keys with frozen column and cell selection is `misfocused` issue is fixed.
- Provide property change handling for `selectedRowIndex` is resolved.
- Edit dialog does not destroyed after perform add operation with custom binding is resolved.
- Server requests sent twice when column is not defined in the grid is resolved.
- custom attribute is missing in stacked header issue is fixed.
- Column `allowEditing` false is working for `datepicker` edit when it is specified as primary key column is resolved.
- `allowEditing` property is not working in identity column is resolved.
- Provided support to `addparams` for filtering.
- Misalignment occurs when `footer aggreagate` in grid and also while editing is resolved.
- Script error thrown when reorder header template column in grid using angular is fixed.
- `RemoteSaveAdaptor` returns empty row while perform adding in Grid is resolved.
- Filtering the localized date column throws script error is fixed.
- Provided support for dynamic property change handling for `selectedRowIndex`.
- Filtering after grouping any column focuses out of the `filterbar` is resolved.
- `Deselecting` event is not triggered after double clicking a particular row and select different row is resolved.
- Column data `stringify` is not working properly when persistence enabled is resolved.

#### New Features

- Property change handling for `SelectedRowIndex` is provided.
- Support to add `params` for `filtering` is added.

## 16.4.48 (2019-01-22)

### Grid

#### Bug Fixes

- Argument is not returned well in `rowDragStart` Event is resolved.
- Column chooser dialog not getting hidden while click outside of the Grid is fixed.
- Selecting cell using arrow keys with frozen column and cell selection is `misfocused` issue is fixed.

## 16.4.47 (2019-01-16)

### Grid

#### Bug Fixes

- Provide property change handling for `selectedRowIndex` is resolved.

## 16.4.46 (2019-01-08)

### Grid

#### Bug Fixes

- Edit dialog does not destroyed after perform add operation with custom binding is resolved.

## 16.4.45 (2019-01-02)

### Grid

#### Bug Fixes

- Server requests sent twice when column is not defined in the grid is resolved.
- custom attribute is missing in stacked header issue is fixed.
- Column `allowEditing` false is working for `datepicker` edit when it is specified as primary key column is resolved.
- `allowEditing` property is not working in identity column is resolved.
- Provided support to `addparams` for filtering.

## 16.4.44 (2018-12-24)

### Grid

#### Bug Fixes

- Misalignment occurs when `footer aggreagate` in grid and also while editing is resolved.
- Script error thrown when reorder header template column in grid using angular is fixed.
- `RemoteSaveAdaptor` returns empty row while perform adding in Grid is resolved.
- Filtering the localized date column throws script error is fixed.
- Provided support for dynamic property change handling for `selectedRowIndex`.
- Filtering after grouping any column focuses out of the `filterbar` is resolved.
- `Deselecting` event is not triggered after double clicking a particular row and select different row is resolved.
- Column data `stringify` is not working properly when persistence enabled is resolved.

## 16.4.42 (2018-12-14)

### Grid

#### Bug Fixes

- Updating `Vue` component data throws script error with `stacked header` is resolved.
- `rowHeight` is not working when group grid columns is resolved.
- Pager dropdown does not render in `Production` is fixed.
- Provided support to exclude the `grid` properties from persist in the grid initialize.
- `Validation rules` not working in Grid stacked columns is fixed.
- `Advanced popup` is misaligned in `excel-filter` when scroll down on the page.
- `RowSelected` event is triggered when sub context menu get open is fixed.
- `Query` property not working for dynamic property change is fixed.
- `Touch-scrolling` frozen content moves page scrollbar is resolved.
- Script error throws in `row-template` when scroll up/down is fixed.
- Unable to filter the date column with `excel-filter` using `DataOperations` class is fixed.
- `IE` cannot handle the viewport height when `scroll(virtual scrolling)` is resolved.
- Grouped column is not included in dialog editing when `showGroupedColumn` is false is fixed.
- `Initial Grouping` not maintained when setting the `locale` property dynamically is fixed.
- Script error when `editTemplate` is used in batch mode is fixed.

#### New Features

- `row Drag and Drop` support within a single grid is provided.
- Support for `true type` font in PDF library is added.
- `Hierarchy Grid` printing support is added.
- Support For `Excel,CSV and Pdf export` with Hierarchy Grid is provided.
- Support for `row-spanning` in Grid is added.
- Adding a new row at the bottom of the grid support is added.
- support for `paste option` to Grid from `Excelsheet/Grid` is provided.
- `Excel-Like Auto Filling` support is added.

## 16.4.40-beta (2018-12-10)

### Grid

#### Bug Fixes

- Getter function from super class are not available inside the `template-context` is fixed.
- Filter icon goes a little above the `headerText` with `wrapMode` as `Header` is resolved.
- `rowDeselecting` event not triggered after double clicking a particular row and select different row is resolved.
- `Column-Menu` items are not disabled when disabled the grid properties at column level is fixed.
- Provided theme support for grid header in `excel-export`.
- Provided whole dataset for the `custom-aggregate` function when use `disablePageWiseAggregate` with no grouping.
- Provided theme support for grid content in `pdf-export`.
- Script error when `editTemplate` is used in `batch mode` is fixed.

#### Breaking Changes

Interface changed for `PdfExportProperties`
| Property | Old | New |
| -------- | --- | --- |
| **theme.header** | borders.color | border.color |
| | borders.lineStyle | border.dashStyle |
| **theme.record** | borders.color | border.color |
| | borders.lineStyle| border.dashStyle |
| **theme.caption** | borders.color | border.color |
| | borders.lineStyle | border.dashStyle |

## 16.3.33 (2018-11-20)

### Grid

#### Bug Fixes

- Using html in `footerTemplate` of aggregation is hidden in `excel-export` and `pdf-export` is fixed.
- `columnMenu` is not properly render when disable the grid properties at column level is resolved.
- With Virtual scrolling, args.data returns as undefined in `rowSelected` event is fixed.
- `Virtualization` translate value calculated incorrectly when set `height` 100% is fixed.

## 16.3.32 (2018-11-13)

### Grid

#### Bug Fixes

- Refreshing a template in column Grid after edit and update displays no records in IE is fixed.
- Unable to use `captionTemplate` in angular grid is resolved.

## 16.3.31 (2018-11-07)

### Grid

#### Bug Fixes

- `aggregateModule` is made public from grid class.
- `Tooltip` throw script error when hover grid cell faster with `EllipsisWithTooltip` is fixed.
- `excelexport` failed when complex property has null as value is resolved.
- Script error throws while deleting the records after adding new records in `batch-editing` mode is resolved.

#### New Features

- Provided dialog settings to customize dialog-editing.

#### Breaking Changes

- For dialog editing, the dialog overlay will be displayed to entire document, Previously the overlay will be displayed only on the grid element.

## 16.3.30 (2018-11-01)

### Grid

#### Bug Fixes

- `extend` like method to keep getters in the data is added.
- `Tab-key` press and update the data in `command-column` causes multiple posts at server side is resolved.
- Added `target` to the arguments of the `rowDeselecting` event of Grid.
- Cell edit template read function does not called when column type as `boolean` is resolved.
- Script error thrown in production mode when using `hideColumns` method to hide a column.

## 16.3.27 (2018-10-23)

### Grid

#### Bug Fixes

- Grid `Filter` column field is undefined while using stacked headers is fixed.
- Angular Grid is failed in production mode when `sideEffects` is set as false is fixed.
- `Checkbox` select all is not selecting all records when batch added record is fixed.
- `rowHeight` is not set properly when grouping column enabled is resolved.
- When performing excel filter search with enter key the operators are always `contains` is resolved.
- script error throws in `rowSelected` and `cellSelected` event after moving from one page to another page is fixed.

## 16.3.25 (2018-10-15)

### Grid

#### Bug Fixes

- Angular Grid printing is not working properly when using ng-template is fixed.
- dialog template is not working properly when grid contains column template is fixed.
- `ODataV4` - Need to skip expand and select queries when apply `groupby` is used is added.
- parse error when valid `json` values are passed into `DataUtil.parse.parseJSON`.
- field value is undefined while adding the record in batch editing when we enable checkbox selection is resolved.
- Need to provide whole dataset for the custom aggregate function when use `disablePageWiseAggregates` with no grouping is added.
- `rowSelected` event arguments are not proper when selecting new records in batch mode is fixed.
- Custom aggregate function parameters are incorrect when perform grouping with `disablePageWiseAggregates` is resolved.
- `setCellValue` is not working for template column is fixed.
- Provided separate title support for command column button.

## 16.3.24 (2018-10-09)

### Grid

#### Bug Fixes

- Excel Exporting with aggregates throws error is fixed.
- Field value is undefined while adding record in batch editing when enabling checkbox selection is fixed.
- Column chooser is overridden by search textbox due to padding top property issue is fixed.
- Rendering dropdown component in grid editing returns only the first record in the dropdown list is fixed.
- Parent grid column chooser is not opening after expanding child grid in hierarchical is resolved.
- Grid Excel export not supporting the custom date format instead of skeleton format is resolved.
- Provided support for range selection delete with Batch mode.
- Separators are not hidden in context menu is resolved.
- Using angular services to replace display values in checkbox filter is resolved.

## 16.3.23 (2018-10-03)

### Grid

#### Bug Fixes

- Prevented the grid refresh action when change the `showDropArea` visibility.
- Changed the default values while add the empty data.
- Context menu separators are not hidden properly when open in header.
- Script error is thrown while auto fit the hierarchy grid with empty data is fixed.
- Batch changes not passed when the column is edited with spaces.
- Misalignment occurred while doing show or hide grid column with enable frozen columns is fixed.
- Support for column chooser can search with user given operators.

## 16.3.22 (2018-09-25)

### Grid

#### Bug Fixes

- Provided `batchsave` as request type for `actionComplete` event of bulk save.
- Provided optional parameter support for `autoFitColumns` API.
- Cancel icon is not clearing the searched text when externally opening column chooser fixed.
- Now row height is set in batch edit mode to avoid shrinking when not data is added.
- Foreign key column checkbox filter shows blank values resolved.
- Date value is sent to server side as empty sting instead of null value while adding the record fixed.
- Script error thrown when perform editing with command column and detail template.
- Need to retrieve the batch changes from the grid when the column is edited with spaces.
- Changing page size dropdown value destroys another grid page size dropdown resolved.
- Deleted record row objects maintains resolved.
- Resolved issue with dynamic data source change when foreign key is used.
- Added cancel event argument for search `actionBegin` event.
- `ODataV4` - Excel filter now uses `groupby` to get distinct data.
- Autofit columns for empty detail Grid issue is fixed.

## 16.3.21 (2018-09-22)

### Grid

#### Bug Fixes

- Initial multi-sorting icon is added incorrectly fixed.
- Validation for complex property is not added properly resolved.

#### New Features

- Dialog edit template support added.
- Reactive aggregate update support added.
- Date time type column filter support added.
- Windows explorer like check-box selection added.
- Expand and collapse enabled in excel exported document for grouped grid.
- Support to prevent the overriding of autofit columns by Resizing added.
- Show All option added for page size drop-down.

## 16.3.17 (2018-09-12)

### Grid

#### Bug Fixes

- Initial multi-sorting icon is added incorrectly fixed.
- Validation for complex property is not added properly resolved.

#### New Features

- Dialog edit template support added.
- Reactive aggregate update support added.
- Date time type column filter support added.
- Windows explorer like check-box selection added.
- Expand and collapse enabled in excel exported document for grouped grid.
- Support to prevent the overriding of autofit columns by Resizing added.
- Show All option added for page size drop-down.

## 16.2.50 (2018-09-04)

### Grid

#### Bug Fixes

- Script error thrown with dynamic column and datasource inside the service subscription.
- Cell selection misbehaves when having both checkbox and template columns in Grid issue is fixed.
- Initial sorting and grid sorting is fixed when `isFrozen` property set for column.
- Maximum call stack occurred when traverse through grouped hierarchy grid issue resolved.

#### Breaking Changes

- For remote data, while using the checkbox/excel filter, the search operator is changed to `equal` for `number` and `date` type columns.
  Previously `startswith` operator was used.

## 16.2.49 (2018-08-21)

### Grid

#### Bug Fixes

- Cursor element height set as 0 when using hidden property issue resolved.
- Updating `foreignKey` with URL Adaptor not working issue resolved.
- `actionComplete` event is raised for batch save operation.

## 16.2.48 (2018-08-14)

### Grid

#### Bug Fixes

- `ODataV4` - `$search` is not used when using foreign key column resolved.
- Primary key column is now included in select query when using `columnQueryMode` as `ExcludeHidden`.
- Edit form is now rendered with tab key while grid is rendered inside dialog.
- Selection is now maintained while expand or collapse child grid.
- Footer aggregate is not aligned properly when apply column fit resolved.

## 16.2.47 (2018-08-07)

### Grid

#### Bug Fixes

- Batch editing tab key press prevention when grid placed inside dialog fixed.
- Unable to use `headerText` in group caption template is resolved.
- Query table name is not used by grid `CRUD` operations fixed.
- Arguments return properly in `beforeExcelExport` and `beforePdfExport` event.
- Cancel support for `rowDrop` event is provided.

## 16.2.46 (2018-07-30)

### Grid

#### Bug Fixes

- Selected rows event arguments are wrong with grouping and `enableVirtualization` is resolved.
- Multiple rows selecting while scrolling with grouping and `enableVirtualization` is resolved.
- Provided locale string for pager All option.

## 16.2.45 (2018-07-17)

### Grid

#### Bug Fixes

- Edit parameter is not properly applied for foreign key column is resolved.
- Batch edit for Template column is fixed.
- ng-compiler for filter `itemTemplate` property is fixed.
- Operators are not maintained while filtering multiple columns with filter bar issue resolved.
- Display of raw HTML when dragging column header to group area is resolved.
- Grid displays fine when enable/disable `enableVirtualization` dynamically.

## 16.2.44 (2018-07-10)

### Grid

#### Bug Fixes

- Dynamic aggregate columns enabled is not working issue resolved.
- Custom aggregate is not applied in MVC

## 16.2.43 (2018-07-03)

### Grid

#### Bug Fixes

- Passed row data to checkbox filter item template.
- The locale is not properly applied for aggregates is resolved.
- Export cell object is missing on exporting query cell info event argument is resolved.
- `setCellValue` not updated the value when we use frozen columns is resolved.
- Support to provide show all record option in pager dropdown.
- Format is not applying for group caption while using `Urladaptor`.

## 16.2.42 (2018-06-27)

### Grid

#### Bug Fixes

- Batch confirmation dialog is not shown when we use Excel/Checkbox filter in Grid is resolved.
- Excel text filter icon does not update with localization is resolved.
- Provide `cellSaved` event support for getting the edited data while using batch Editing.
- column size in IE when grouping is not changing like in chrome is resolved.
- Bottom rows do not get selected with Virtualization and Grouping is resolved.
- Script error thrown while refreshing grid in edit state is resolved.
- Complex data with custom excel filter throws script error is resolved.
- Invalid filtered data in `datetime` column issue resolved.
- Empty Grid showed while editing request failed issue resolved.
- Prevented the script errors while destroying grid.
- Script error while rendering the grid inside a dialog issue resolved.
- Complex data with first row null value issue resolved.
- Success and fail handler triggering issue resolved.
- Additional parameter not available in menu filter issue resolved.

## 16.2.41 (2018-06-25)

### Grid

#### Bug Fixes

- Group footer template shows incorrect value while using `disablePageWiseAggregate` issue fixed.
- Unable to sort when set dynamic sort settings in descending order resolved.
- Footer aggregate row is not aligned properly when using child grid resolved.
- In batch editing, script error occurs when focusing on grid after clicking add and cancel button fixed.
- Filter icon misalignment with text wrap enabled resolved.
- Selection retained after unchecking the check all checkbox with remote data source fixed.
- `actionComplete` event is not triggered for batch cancel resolved.
- Frozen content got hidden while adding new row with auto height is resolved.
- Unable to use auto complete inside filter bar template resolved.
- Aggregates row get misaligned while horizontal scrolling if vertical scrollbar presents resolved.
- Excel filter dialog is not updated when properties updated through `setProperties` issue resolved.
- Indent column disappeared when resizing the hierarchy column in Grid issue fixed.

## 16.1.44 (2018-05-18)

### Grid

#### Bug Fixes

- edited data is not remove when we click the cancel button with frozen column feature enable.

## 16.1.43 (2018-05-18)

### Grid

#### Bug Fixes

- Complex data editing is not shown valid selector when we use frozen feature.

## 16.1.42 (2018-05-15)

### Grid

#### Bug Fixes

- Excel Filter dialog not updated while initial rendering and through `setproperties`.
- Localization not applied in Exporting Grid.
- Complex data binding not working properly with editing add action.

## 16.1.41 (2018-05-09)

### Grid

#### Bug Fixes

- `dataStateChange` event is now trigged when `pageSize` is changed.
- Provided support for optimizing frozen content height with auto wrap.

## 16.1.40 (2018-05-08)

### Grid

#### Bug Fixes

- `dataStateChange` event is now trigged when `pageSize` is changed.
- Group and caption aggregate is now working with `async` pipe.
- Now grid refreshed when group and caption aggregates is emptied.
- In Remote data, the `getSelectedRecords` method returns proper count with `persistSelection` enabled.
- Script error thrown when set `dataSource` and `columns` is provided at the same time fixed.

## 16.1.39 (2018-05-05)

### Grid

#### Bug Fixes

- Memory leak issue resolved.

## 16.1.38 (2018-05-03)

### Grid

#### Bug Fixes

- Duplicate values updating in batch changes for complex property is resolved.
- Creating multiple elements while hovering for tooltip issue is resolved.
- Lint issue occurs in custom toolbar with latest typescript version is resolved.
- Undoing delete operation only restores frozen content in batch edit fixed.

## 16.1.37 (2018-04-24)

### Grid

#### Bug Fixes

- Script error thrown while deleting all records with aggregates and `Urladaptor` is resolved.
- `FilterBar` message is not updated while setting filter settings in `setProperties` method is resolved.
- Excel Filter dialog not updated while programmatically filter the column is resolved.
- With virtual scrolling grid refreshes constantly issue is resolved.

## 16.1.35 (2018-04-17)

### Grid

#### Bug Fixes

- Maximum call stack issue while filtering date column with `disablePageWiseAggregates` is resolved.
- Provided locale support for custom filter labels and column chooser.
- Between operator provides incorrect result in Excel filter issue fixed.
- Content rendering delayed while using virtual scrolling with grouping when scrolling horizontally is resolved.

#### Breaking Changes

- The Locale properties such as `OK`, `Filter`, `Clear` are removed instead use `OKButton`, `FilterButton`, `ClearButton`.

## 16.1.34 (2018-04-10)

### Grid

#### Bug Fixes

- Pager Dropdown values is not updated while dynamically changing the Page size issue is resolved.
- Provide locale column format support for excel-export.
- Setting filter Properties through `setProperties` method is resolved.
- Changing frozen columns from null throws script error is resolved.
- Excel exporting group caption shows field name instead of header text issue is resolved.
- String values not accepted for methods from window in custom filter menu template is resolved.

## 16.1.33 (2018-04-04)

### Grid

#### Bug Fixes

- Updating column object for dynamically bounded columns.

## 16.1.32 (2018-03-29)

### Grid

#### Bug Fixes

- Grid refreshes before insert operation completed resolved.
- Grid refresh prevented when column showing or hiding dynamically through `hideAtMedia`.
- Initial multi sorted column icons is ordered correctly.
- Removed filter bar border when using compatibility theme.
- Provide complex data editing support.
- Grouping with search always shown the spinner when data source has no value is resolved.
- Filtering the column while field has underscore value is resolved.
- Aggregate returns the null value when grouped has no aggregate field is resolved.
- Header text shown along with header template is resolved.

## 16.1.30 (2018-03-20)

### Grid

#### Bug Fixes

- Column properties is not persisted after reordering columns resolved.
- `args.cancel`  has included in `rowSelecting` event while select the rows through method and user interaction.

## 16.1.29 (2018-03-13)

### Grid

#### Bug Fixes

- `args.cancel`  has included in `rowSelecting` event.
- Dynamically changing filter settings does not update `Filterbar` value and filter status message is resolved.
- Batch edit should close on clicking outside grid and on pressing enter or tab key is resolved.
- `updateRow` method is provided for Normal editing and Dialog editing.
- Duplicate columns added in group drop area issue resolved.

## 16.1.28 (2018-03-09)

### Grid

#### Bug Fixes

- Minimum height for edit dialog is provided.
- Identity column is not disabled when adding resolved.
- Script error thrown when destroy the Grid with custom toolbar template issue resolved.
- Batch editing save action shows empty grid issue resolved.
- `currentViewData` is not changed in remote data editing issue resolved.

## 16.1.24 (2018-02-22)

### Grid

#### New Features

- New Excel like column filtering option is added.
- Added Look-up table or foreign key data binding to grid column.
- Row height adjustment feature added.

#### Bug Fixes

- Angular and React `enablePersistence` issue resolved.

#### Breaking Changes

- All grid enum property values are changed from camel casing to pascal casing. Please refer the below link for complete API changes from `v15.4.23` to `v16.1.24`.
[Migration](http://ej2.syncfusion.com/documentation/grid/migration.html).

## 15.4.30-preview (2018-02-14)

### Grid

#### Bug Fixes

- Exporting is working fine with template column.
- Aggregate with frozen columns scroller is working fine

## 15.4.29-preview (2018-02-07)

### Grid

#### Bug Fixes

- Renamed event `dataSourceChange` to `dataSourceChanged`.

## 15.4.28-preview (2018-01-30)

### Grid

#### Bug Fixes

- Child Grid editing dialog closes when clicking on edit element.
- Printing window is blocking by browser and column hiding.
- `getSelectedRecords` method returns selected records properly with checkbox persist selection fixed.
- Aggregate with frozen columns scroller is working fine.

## 15.4.27-preview (2018-01-30)

### Grid

#### Bug Fixes

- Disable edit, delete button when Grid is empty.
- `ShowConfirmDialog` is not showing in Command Column.
- Grid Validation message is not shown in EJ2 compatibility theme.
- Checkbox selection fixes with virtual scrolling.
- Provide support to add row with rowindex in AddRecord method.

## 15.4.26-preview (2018-01-23)

### Grid

#### Bug Fixes

- Validation error message partially hidden when grid has single record in add and update action.
- Two way binding for headers on grid not working.
- Child grid collapses after save operation fixed.
- Checkbox column binding with data source is not working fixed.
- Misalignment occurs in frozen columns without height property fixed.

## 15.4.25-preview (2018-01-09)

### Grid

#### New Features

- `isBlob` argument added in export methods to get blob data export complete events.

#### Bug Fixes

- Check Select all not working when refreshing the Grid header in run time.
- Column chooser throws script error in IE 11 while destroying the component.
- Column checkbox filtering shows no records while grid have menu filtering.

## 15.4.24-preview (2018-01-10)

### Grid

#### Bug Fixes

- Filter menu clear action throws script error with column menu.
- Add row misaligns with header when grid has hidden columns.
- Support for `rowSelected` event for template column.
- Date filtering request pass as string when reloading.
- Script error on add record by hidden column.
- Row deselect event not fires in check box selection.
- Sorting and grouping failed on complex data.
- Last and next page options are enabled when data source is empty.
- Default cursor not displayed after invoke grid refresh method.

## 15.4.23-preview (2017-12-27)

### Common

#### New Features

- Added typing file for ES5 global scripts (`dist/global/index.d.ts`).

#### Breaking Changes

- Modified the module bundle file name for ES6 bundling.

### Grid

#### Bug Fixes

- Header content is not scrolling while adding a record in empty Grid.
- `displayAsCheckbox` not working for numeric values.
- Filtered value not persisting in filter menu with date picker.
- Reordering with filter menu throws script error.
- Exporting Grouped Grid with Header not working.

## 15.4.22-preview (2017-12-14)

### Grid

#### New Features

- `recordDoubleClick` event added.

#### Bug Fixes

- Script error when pdf exporting with null values.

#### Breaking Changes

- Now `ColumnChooser` module must be injected to use column chooser feature.

#### Bug Fixes

- Grid height 100% is not working fixed.

## 15.4.21-preview (2017-12-08)

### Grid

#### Bug Fixes

- Script error when exporting with Custom aggregate fixed.
- State persistence in angular is not working fixed.
- Exporting with stacked header is not working fixed.
- Alignment issue with checkbox column fixed.
- Cancelling edit with edit Template fixed.
- Stacked header alignment issue fixed.
- Disabling Edit confirm dialog is not working issue fixed.
- Script error throws when save the record after edit in IE11 fixed.
- Editing not working after batch save in action begin event fixed.
- Deleting unsaved record throws Script error fixed.

## 15.4.20-preview (2017-12-01)

### Grid

#### Bug Fixes

- Column format is not applied when type is specified fixed
- Value search in checkbox filter is not worked for complex binding fixed
- Editing is not worked with stacked header fixed
- Numeric Edit column didn't get modified value when Enter key press fixed
- Null shows as date value in date type column fixed
- Edit Confirm Dialog is not working properly in batch edit mode fixed

## 15.4.19-preview (2017-11-23)

### Grid

#### Bug Fixes

- Script error resolved when exporting Grid data.
- Provided filter `menu` support for `template` columns.
- Localization is not found for `numeric` and `date` filter menu issue fixed.

## 15.4.18-preview (2017-11-16)

### Grid

#### Bug Fixes

- `enum` support for toolbar items provided.
- Edit state not changed when changing `dataSource` issue fixed.
- Duplicate service injection in React fixed.

## 15.4.17-preview (2017-11-13)

### Grid

Grid component is used to display and manipulate tabular data with configuration options to control the way the data is presented and manipulated.

- **Data sources** - Bind the Grid component with an array of JavaScript objects or DataManager.
- **Sorting and grouping** - Supports n levels of sorting and grouping.
- **Selection** - Provides the option to select the grid rows single or multiple.
- **Filtering** - Offers filter bar or menu , or checkbox at each column to filter data.
- **Editing** -  Provides the options to dynamically insert, delete and update records.
- **Virtualization** - Provides the options to load large amount of data without performance degradation.
- **Aggregates** - Provides built in types are sum , average, min, max, count.
- **Paging** - Provides the option to easily switch between pages using the pager bar.
- **Reordering** - Allows you to drag any column and drop it at any position in the Grid’s column header row, allowing columns to be repositioned.
- **Resize** - Allow you to resize the grid column width dynamically.
- **Frozen Rows And Columns** - Provides the options to freeze certain rows or columns to scroll remaining movable content.
- **Clipboard** - Provides an option to copy selected rows or cells data into clipboard.
- **Column Spanning** - Provides an option to allows to span the multiple adjacent cells.
- **Stacked Header** - It can be stacked or grouped in order to show multiple level of column headers.
- **Hierarchy Grid** - It is used to display table data in hierarchical structure which can show or hide by clicking on expand or collapse button.
- **Print and Exporting** - Provides the option to print and exporting grid records.
- **RTL** - Provides a full-fledged right-to-left mode which aligns content in the Grid component from right to left.
- **Localization** - Provides inherent support to localize the UI.
