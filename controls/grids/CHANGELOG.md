# Changelog

## [Unreleased]

## 20.3.57 (2022-11-15)

### Grid

#### Bug Fixes

- `#I413480` - Enter and shift enter key functionalities are working fine with template columns.
- `#F178089` - Script error with virtual scroll and frozen columns has been resolved.
- `#I414874` - Column chooser checkbox state is now reading properly by JAWS screen reader.
- `#I379911` - Now, the selected page will be read as current page by JAWS screen reader.
- `#I408692` - Tooltip Issue while using fancy characters in grid has been fixed.
- `#F38295` - Incorrect Ellipsis with narrow checkbox column in grid has been fixed.
- `#I413202` - Issue with rendering dropdown component in grid cell with batch editing has been fixed.

## 20.3.56 (2022-11-08)

### Grid

#### Bug Fixes

- `#I388098` - Editing issue in grouping with `virtualization` has been fixed.
- `#I406671` - Edit element not maintained when executing `setRowData` method is fixed.
- `#I413403` - Script error with toolbar template has been resolved.
- `#I408977` - Infinite Scrolling with row grouping and checkbox selection is now working fine.
- `#F177783` - Sort icon Alignment issue with header text right align when using autofit has been fixed.

## 20.3.52 (2022-10-26)

### Grid

#### Bug Fixes

- `#I400775` - `DataStateChange` event argument type is not matched with the original argument list has been fixed.
- `#I411026` - Expanding child grid throws script while adding data dynamically to the child has been resolved.
- `#I412478` - `SetCellValue` is working fine with `virtualization`.
- `#I411780` - German translation for the word search has been changed.
- `#I367158` - While rendering the grid in the template column the script error thrown with resizing the frozen column has been fixed.

## 20.3.50 (2022-10-18)

### Grid

#### Bug Fixes

- `#F176739` - CSS problem occurs when drag and drop between child grid and other grid issue has been fixed.
- `#I389344` - PDF Exporting issue with Hierarchy grid and  grouping in parent grid has been fixed.
- `#F177682` - Validation message is not showing properly in movable columns with empty records has been fixed.

## 20.3.49 (2022-10-11)

### Grid

#### Bug Fixes

- `#F177034` - Grid editing after removing frozen column throws script error has been fixed.
- `#I409787` - Checkbox selection is not working properly on down arrow key navigation has been fixed.
- `#F177722` - Save action of command column is not working when Grid having both left and right frozen has been fixed.
- `#FB37591` - Frozen rows are not emptied even if filtering returns no record when `virtualization` enabled has been fixed.
- `#F177810` - Provided localization support for sort buttons in Adaptive Grid.
- `#I405703` - `CellSelected` event not triggered with custom span element in row cells has been fixed.
- `#I394025` - Memory leak issue with Command column has been fixed.
- `#FB32003`, `#FB38052` - Ellipsis is not showing in the Firefox browser has been fixed.
- `#I407497` - Focus issue while render multiple inputs in the column template issue has been fixed.

## 20.3.48 (2022-10-05)

### Grid

#### Bug Fixes

- `#I397183` - checkbox issue when enabling the persistence has been fixed.
- `#I399882` - `rowIndexes` in `RowSelectEventArgs` becomes undefined when single row is selected has been fixed.
- `#I402071` - Column chooser with frozen columns and wrap mode as header throws script error has been fixed.
- `#I404733` - `SetRowData` method is not working properly used inside the `childGrid` is fixed.

## 20.3.47 (2022-09-29)

### Grid

#### New Features

- `F26767` - Provided the Shimmer effect for grid while loading, refreshing and data processing.
- Provided the lazy load group support for infinite scrolling enabled grid.
- `I388050`, `I388052`, `I375590`, `I370773`, `I375590` - Grid features and icons have been enhanced to meet web accessibility standards and enabled localization support for aria-labels.

#### Breaking Changes

- `#I374913` - Prevented the group collapse action in infinite scrolling with cache mode by hiding the icons.

#### Bug Fixes

- `#I397430` - Script error while hiding the Sticky Header Grid using `ngIf` property has been fixed.
- `#I407127` - Custom command buttons not working with infinite scrolling is fixed.
- `#I401295` - Group by fails for 1 record on collapse issue has been fixed.
- `#I401412` - Script error after destroying the Grid with sticky header has been fixed.
- `#F176953` - Filtering issue with Frozen column and Row drag and drop feature has been resolved.

## 20.2.38 (2022-07-12)

### Grid

#### Bug Fixes

- `#I376131` - when cell containing the checkbox is double clicked the next cell content gets highlighted issue has been fixed.
- `#I385933` - Custom format on number column is not working properly in Grid pdf export issue has been fixed.
- `#FB35672` - Empty grid in batch edit mode throws script error has been fixed.
- `#I382789` - Tab key Navigation not working When `allowEditing` set to false with `RowDragandDrop` is fixed.
- `#FB34522` - Column reorder not working properly in column freeze enabled is fixed.

## 20.2.36 (2022-06-30)

### Grid

#### New Features

- `#I359178` - Provided support to show clear icon in the Grid search text box. It helps to clear the text in search text box and also clear the searching in Grid control too. Please find the demo link [here](https://ej2.syncfusion.com/demos/#/bootstrap5/grid/searching)
- `#I328056`, `#I369597` - Provided support to prevent the selection of specific rows based on the condition.
- Enhanced the keyboard support for Data grid control. Please find the demo link [here](https://ej2.syncfusion.com/demos/#/bootstrap5/grid/keyboard-navigation.html)
- `#I194399` - Provided support to rotate grid header while exporting.

#### Bug Fixes

- `#I235957`, `#I347931`, `#F170423`, `#I356695` - Persist Selection misbehaves while sorting with virtualisation issue has been fixed .

## 20.1.47 (2022-04-04)

### Grid

#### Bug Fixes

- `#I368223` - Filtering on the date column with a null value in the array issue has been fixed.
- `#F171832` - Pdf grid header text colour is not updated properly in `pdfHeaderQueryCellInfo` event issue has been fixed.

#### New Features

- `#I347226`, `#I345255` - Provided Aria accessibility with keyboard support for pager component.

## 19.4.55 (2022-03-08)

### Grid

#### Bug Fixes

- `#I367001` - Inline editing is not working properly when `RowDragandDrop` with frozen columns is fixed.
- `#I368530` - Aggregates not shown when using `expandAll` and `collapseAll` in grouping issue has been fixed.
- `#I368787` - `Autofill` removing decimal values in number type columns issue has been fixed.

## 19.4.54 (2022-03-01)

### Grid

#### Bug Fixes

- `#F172908` - Script error is thrown when column has `sortComparer` set is fixed.
- `#I367180` - `RowDragandDrop` not working when page size set to `All` has been fixed.
- `#I365069` - column menu `popup` not closed after filtering using enter key is fixed.

## 19.4.53 (2022-02-22)

### Grid

#### Bug Fixes

- `#I364948` - column menu position issue when open last column is fixed.
- `#I363675` - Need to set id and aria label for Grid checkboxes accessibility.
- `#I366853` - Column menu icon is not showing in bigger tailwind theme.
- `#I357480` - Need to include `strikeThrough` style for excel export issue has been fixed.

## 19.4.52 (2022-02-15)

### Grid

#### Bug Fixes

- `#I359192` - Ellipsis is not showing for the cells in the Firefox browser has been fixed.
- `#I363178` - Filter dialog position mismatches when disable `ColumnMenu` for particular column is fixed.
- `#I357482` - Not able to set the pager dropdown value as All on initialization issue has been fixed.
- `#F172084` - `rowSelected` event arguments row data is incorrect while select rows with `Ctrl`, issue has been fixed.
- `#F171933` - Row hover is not shown after the row drag and drop action is fixed.
- `#F171832` - Wrong grid cell value in `pdfHeaderQueryCellInfo` event issue has been fixed.
- `#F171308` - Lint error while passing null value in `filterByColumn` method is fixed.
- `#I365287` - Script error thrown when refresh the grid with column template and details rows is fixed.
- `#F172138` - Script error while enabling sticky header with `react-i18next` has been fixed.

## 19.4.47 (2022-01-25)

### Grid

#### Bug Fixes

- `#SF-361888` - Gird rows are hide when called `groupCollapseAll` without grouping is fixed.
- `#SF-362860` - Last column header cell border issue has been fixed.
- `#SF-357202` - Wrong operator while filtering with Excel filter search box is fixed.
- `#SF-362140` - Script error while selecting the row with `virtualization` issue has been fixed.
- `#FB-31236` -  Multi-column sorting missing sort number indicators issue has been fixed.
- `#FB-31556` - Row Height misalignment when show/hide the template column with frozen Grid is fixed.
- `#F171116` - Border is not apply properly in the Excel exporting has been fixed.

## 19.4.43 (2022-01-18)

### Grid

#### Bug Fixes

- `#SF-359831` - Script error thrown in frozen grid while hiding the column through column chooser with aggregates issue has been fixed.
- `#SF-359248` - Script error thrown if frozen grid have empty records with `PersistSelection` feature issue has been fixed.
- `#F171949` - Script error while filtering with `UrlAdaptor` is resolved.

## 19.4.42 (2022-01-11)

### Grid

#### Bug Fixes

- `#SF-361124` - Script error when filtering with excel filter in other components issue has been fixed.
- `#SF-354931` - While locking the column with enable frozen right feature, the frozen column is not moving issue has been fixed.
- `#SF-356095` - Scroll position issue while `updateRow` method with infinite scroll has been fixed.
- `#SF-358560` - Scroll is prevented with `LazyLoadGrouping` cache mode issue has been fixed.
- `#SF-358281` - `ActionBegin` event paging arguments cancel is not properly getting cancelled is fixed.
- `#F171308` - Filter query is not generate properly when filter the null value in `OdataAdaptor` and `OdataV4Adaptor` is resolved.

## 19.4.41 (2022-01-04)

### Grid

#### Bug Fixes

- `#SF-313743` - Created event is not triggered when changing the locale is fixed.
- `#SF-354968` - Column dataSource is changed after dropdown editing a `foreignkey` column is fixed.
- `#F170844` - Borderline is not applied properly in stacked column has been fixed.

## 19.4.40 (2021-12-28)

### Grid

#### Bug Fixes

- `#I345910` - Sticky header not working when group drop area  is hidden has been fixed.
- `#I357254` - Outline is displayed in excel export has been fixed.
- `#FB30729` - Filter dialog position issue when enable virtual scrolling is fixed.
- `#I356122` - `actionComplete` event is trigger after row reorder is performed has been fixed.
- `#I359292` - Script error thrown while clear filtering with disabled column menu is fixed.

## 19.4.38 (2021-12-17)

### Grid

#### Bug Fixes

- `#F170844` - Borderline issue in stacked column has been fixed.
- `#I355438` - Event argument type issue in `actionComplete` event while filtering is fixed.
- `#F170531` - wrong row information while clicking the custom sub context menu items id fixed.

## 19.3.57 (2021-12-07)

### Grid

#### Bug Fixes

- `#I356474` - `captionTemplate` property type issue has been fixed.
- `#F170289` - Header misalignment when printing the Grid with grouped column, issue has been fixed.
- `#I348807` - Row selected automatically when `persistSelection` enabled is fixed.
- `#F170712`, `#I357715` - Script error throws when edit `childGrid` rows with command column buttons is fixed.
- `#F170524` - Export aggregations misalignment while using Grid with grouped column, issue has been fixed.

## 19.3.56 (2021-12-02)

### Grid

#### Bug Fixes

- `#I338678` - frozen horizontal scroll issue in `Ipad` device has been fixed.
- `#I348728` - Throws script error while cancel the Excel filter is fixed.

## 19.3.55 (2021-11-23)

### Grid

#### Bug Fixes

- `#F170201` - Passed `groupcaption` details in the `exportGroupCaption` event arguments.
- `#I347287` - Maximum call stack issue occurs when checkbox columns set visible property as false for first column has been fixed.
- `#I347439` - The last row bottom border issue in Frozen right part has been fixed.
- `#I348589` - Changing grid height programmatically throws script error while scrolling issue has been fixed.

## 19.3.54 (2021-11-17)

### Grid

#### Bug Fixes

- `#I346575` - Command button click event argument type not returned properly is fixed.
- `#I347290` - Persist selection is not working properly when enable selection dynamically is fixed.
- `#I344276` - `HTMLtag` is not disable properly in tooltip has been fixed.
- `#I346882` - Throws script error while enabling with `filterbarTemplate` with `ShowFilterBarOperator` is fixed.
- `#F170007` - Autofit issue while render empty records has been fixed.
- `#I345285` - Footer aggregate is not aligned properly has been fixed.

#### New Features

- `#I338539` - Provided the tag helper support for single level stacked header in Angular Grid.

## 19.3.48 (2021-11-02)

### Grid

#### Bug Fixes

- `#I345881` - Script error while reordering with the column `virtualization` is resolved.
- `#I345229` - `expandAll` and `CollapseAll` in grouping issue has been fixed.
- `#I343503` - row Selected data is incorrect while apply Sorting and Grouping is fixed.

## 19.3.47 (2021-10-26)

### Grid

#### Bug Fixes

- `#I345516` - Grid sort icon overlapping with column header text in `boostrap5` theme issue has been fixed.
- `#I341348` - Provided the support for clearing all the Grid actions.
- `#I344299` - Grid data is not loaded when using custom binding with `Infinitescrolling` is fixed.
- `#F167378` - Throws scripts error while apply sorting in load event with `Infinitescrolling` is resolved.
- `#I345190` - Date column filtering operator issue has been fixed.

## 19.3.46 (2021-10-19)

### Grid

#### Bug Fixes

- `#I343873` - Infinite Scroll spinner issue while loading next block is fixed.
- `#I344229` - Script error while searching in the infinite scrolling enabled is resolved.
- `#I344295` - Infinite scroll grid is duplicating the last row issue has been fixed.
- `#FB21743` - Grouping collapse is not working properly with Infinite scroll if it don't have aggregates issue has been fixed.

## 19.3.45 (2021-10-12)

### Grid

#### Bug Fixes

- `#I339088` - Export the Grouped first column becomes empty is resolved.
- `#FB27888` - Cell Edit Template is not working when using dropdown component with filtering is fixed.
- `#I338678` - Frozen horizontal scroll is not working in `Ipad` device has been fixed.
- `#I342380` - Command button click event argument missing issue has been fixed.

## 19.3.44 (2021-10-05)

### Grid

#### Bug Fixes

- `#I341591` - Grid column `virtualization` does not support dynamic column changes issue has been fixed.
- `#I330797` - Provided support to set height and width for image when pdf export.
- `#I341546`, `#I341928` - custom date format filter issue in Excel search box has been fixed.
- `#I341353` - `No Records To Display` message is split while grouping has been fixed.
- `#I341339` - Editing issue in `foreignKeyColumn` with `virtualization` has been fixed.
- `#I342311` - Hierarchy Grid sends request for `childGrid` data when `hierarchyExportMode` as none is resolved.
- `#I341591` - Aggregate rendering condition order impact the grid performance issue has been fixed.

## 19.3.43 (2021-09-30)

### Grid

#### New Features

- `#I284744`, `#I289234` - Provided keyboard navigation support for infinite scroll.
- `#I314791`, `#I311562` - Provided group caption collapse support for infinite scroll.

#### Breaking Changes

- The `groupSettings.disablePageWiseAggregates` option will be enabled automatically when using aggregates and grouping in an infinite scroll.

## 19.2.62 (2021-09-14)

### Grid

#### Bug Fixes

- `#F168526` - `enablePersistence` was not maintained when filtering applied on `foreignKey` column.
- `#I335206` - Throws script error while adding the stacked columns dynamically is fixed.
- `#I341127` - Excel filter sub menus does not open in mobile device is Fixed.
- `#I340337` - Immutable mode doesn’t work for deep compare data issue has been fixed.
- `#I336801` - Infinite scrolling with editing with checkbox selection issue has been fixed.

## 19.2.60 (2021-09-07)

### Grid

#### Bug Fixes

- `#I339334` - `exportDetailDataBound` event not triggered when export the `HierarchyGrid` has been fixed.
- `#I339880` - Script error throws when enable `textwrap` with auto generated columns, issue has been fixed.
- `#FB27674` - Multi column dynamic sorting issue has been resolved.
- `#I340037` - Grid focus out issue has been resolved.
- `#I340122` - Script error while using custom component on boolean menu filter has been resolved.
- `#I339774` - Script error throws while hiding columns in enabled `lazyload` grid, has been fixed.

## 19.2.59 (2021-08-31)

### Grid

#### Bug Fixes

- `#F167458` - `enablePersistence` was not maintained when routing to another page is resolved.
- `#I339406` - Filtering array of values on date column by `filterByColum`, issue has been fixed.
- `#F168110` - Filter operation is not cleared while clicking the clear button with immediate mode, issue has been fixed.

## 19.2.57 (2021-08-24)

### Grid

#### Bug Fixes

- `#I338200` - Searching operation is not working properly in `foreignKeyColumn` issue has been fixed.

## 19.2.56 (2021-08-17)

### Grid

#### Bug Fixes

- `#I338201` - tab key issue in details rows has been resolved.
- `#I338152` - Focusing issue after collapsing all grouped records has been fixed.
- `#I336671` - first column cell is not focused properly with keyboard navigation has been fixed.

## 19.2.55 (2021-08-11)

### Grid

#### Bug Fixes

- `#I331628` - Clear button issue in filter bar input has been fixed.
- `#I328013` - Copy and paste in `mac os` issue has been resolved.
- `#I336801` - Adding new record is not working in infinite scroll with frozen grid, has been fixed.
- `#F158244` - filter menu destroyed issue in filter template has been fixed.

#### New Features

- `#I334322` - Provided exporting headers with image support.
- `#I284744, #I289234` - Provided keyboard navigation support in infinite scroll.
- `#I325175, #I327940` - Provided Sticky header support.

## 19.2.51 (2021-08-03)

### Grid

#### Bug Fixes

- `#F167053` - Border misalignment when  adding a row in bottom has been fixed.
- `#I336216` - Cell Selection with box mode is not working properly after filtering, has been fixed.
- `#I336097, #I335284` - Virtualization Grid in flex container produce blank space issue has been fixed.

## 19.2.49 (2021-07-27)

### Grid

#### Bug Fixes

- `#FB26500` - copy are hidden in context menu while cell selection mode is resolved.
- `#I334589` - throws script error drag and drop on an expanded row with `DetailsTemplate` is fixed.
- `#I307521` - Provided a feature to change the cursor indication while dragging.

## 19.2.48 (2021-07-20)

### Grid

#### Bug Fixes

- `#I335031` - Filter icon not updated while `programmatically` filter the column using `ColumnMenu` is resolved.
- `#I334653` - Editing issue in grouped Grid with `virtualization` has been fixed.
- `#F166736` - Duplicate Sort numbers element rendered while prevent sort action is resolved.
- `#I334387` - Filter bar focusing is not working properly, while using the `multiselect` component in the filter template has been fixed.
- `#FB26392` - Script error is thrown while double-clicking the validation error message is fixed.
- `#FB26502` - Cell drag issue when field based command column, has been fixed.

## 19.2.47 (2021-07-13)

### Grid

#### Bug Fixes

- `#F166398` - Empty column misalignment while using percentage width column with grouping is fixed.
- `#I331505` - Multi Selection issue when enable `rowDragAndDrop` is fixed.
- `#I333234` - Throws scripts error while `hide/show` the columns with `virtualization` is enabled, issue has been fixed.
- `#I325339` - Need to modify the `aria-sort` attribute value to lower case.
- `#I332233` - searching blank value is not working in filter text box is fixed.
- `#I329930` - Virtual scrolling issue has been fixed while using it with grouping feature.
- `#I334284, #F166423` - Infinite scroll records removed after refreshing issue has been fixed.
- `#I310815, I331546, I326532` - Grid instance retaining memory leak issue has been fixed.

#### Breaking Changes

- Modified the `aria-sort` attribute value from `Ascending, Descending` to `ascending, descending`.

## 19.2.46 (2021-07-06)

### Grid

#### Bug Fixes

- `#I332536` - Persist selection is not working properly when using `up/down` arrows is fixed.
- `#I331703` - Excel export filter icon misalignment while using the excel export header properties, issue has been fixed.
- `#I331500` - throws script error while clearing initial filter dynamically is fixed.
- `#I328056, #I331256` - `RowDeselected` event is not triggered after paging while using `clearSelction`, has been fixed.
- `#I331465` - Focus issue while render dropdown component in the header template, issue has been fixed.
- `#I332058` - Validation rules not working in grouped columns is fixed.
- `#I332503` - throws script error when Adding new record in a empty Grid with `infiniteScrolling` feature is fixed.
- `#I332932` - Edit focus is not working properly when checkbox column editing is disabled is fixed.
- `#I328508` - When selecting last row in view-port, Grid scrolls up automatically issue has been fixed.

## 19.2.44 (2021-06-30)

### Grid

#### Bug Fixes

- `#FB25509` - Column grouping is not working properly while `allowReordering` is set true, has been fixed.

#### New Features

- Provided support for row reorder with virtual scrolling.

## 19.1.69 (2021-06-15)

### Grid

#### Bug Fixes

- `#I329342` - Adding new record through `addRecord` method with infinite scroll, issue has been fixed.
- `#F162910` - Header checkbox selection issue when enable infinite Scroll and custom binding has been fixed.
- `#I330477` - Pdf Export misalignment while using the stacked header with grouping, issue has been fixed.
- `#I323971` - Pdf Export misalignment while using the stacked header with hidden column, issue has been fixed.
- `#I329350` - Immutable mode doesn’t work for date values issue has been fixed.
- `#I329350` - Update the reordered data in immutable mode re-renders multiple rows issue has been fixed.
- `#I327293` - CPU takes more usage when export the hierarchy grid issue has been fixed.
- `#FB25510` -  Throws script error While grouping the complex columns is fixed.

## 19.1.67 (2021-06-08)

### Grid

#### Bug Fixes

- `#I329898, #I329726, #I330440, #I330494, #I330714, #I330816, #I331022` - Frozen headers not refreshed while refresh the grid in latest chrome is resolved.
- `#I327857` - Script error throws while save grid with edited state in two child grid is fixed.
- `#I329250` - Adaptive view filter function issue has been fixed.

## 19.1.66 (2021-06-01)

### Grid

#### Bug Fixes

- `#I329121` - Horizontal scrolling in `columnVirtualization` makes glitch issue has been fixed.
- `#I326727` - Column resize issue with frozen right/left and aggregate has been resolved.
- `#I327237` - Empty row appears while hiding/showing columns in `virtualized` grouping grid, has been fixed.
- `#I299221` - Frozen part refresh issue with template column has been resolved.
- `#I311142` -  Provided internal event to handle queries on custom `ExcelFilter` dataSource.

## 19.1.65 (2021-05-25)

### Grid

#### Bug Fixes

- `#I326169` - Column chooser `popup` closing issue has been fixed.
- `#I327972` - Script error issue has been fixed while using anchor tag in header template.
- `#I312347` - The selected row is not properly displayed in viewport when `virtualization` is enabled issue has been fixed.
- `#I328013` - Autofill editing functionality issue has been fixed.
- `#I327316` - Default value as null is not working in numeric column is fixed.
- `#I327294` - Batch edit disregards null value in numeric column is fixed.

## 19.1.64 (2021-05-19)

### Grid

#### Bug Fixes

- `#I323987` - Wrong batch changes while editing date column has been fixed.
- `#I325763` - `minwidth` issue with detail template has been fixed.
- `#I325707` - When enable detail template and `rowDragAndDrop`, aggregate cells alignment issue has been fixed.
- `#I323588` - Provided `beforeOpenAdaptiveDialog` event to listen the adaptive sort and filter dialog open action.
- `#I323268` - Provided public methods `showAdaptiveFilterDialog` and `showAdaptiveSortDialog` to open the virtual row mode filter and sort dialog in adaptive horizontal mode.
- `#F165067, #I323250` - `setCellValue` method issue with Frozen Grid has been fixed.
- `#I318420` - filter dialog position when `columnMenu` is displayed issue has been fixed.
- `#I321693` - `RowDeselected` event data property issue when unchecking the header checkbox, has been resolved.
- `#I326604` - Aggregate value calculated incorrectly when batch adding is Fixed.
- `#I325669` - Excel export misalignment while using the grouped custom datasource, issue has been fixed.

#### New Features

- `#I315345` - Provided server side CSV exporting support.
- `#I317320` - Provided inline editing support in column `virtualization`.

## 19.1.59 (2021-05-04)

### Grid

#### Bug Fixes

- `#I324695` - Misalignment occurred while doing show or hide in stacked header with frozen is fixed.
- `#I321693` - `RowDeselected` event data as empty when unchecking the select All checkbox, issue has been resolved.
- `#I295052` - Switch component editing issue in dialog template has been fixed.
- `#I322601` - Header checkbox state is not proper on dynamic data update, issue has been fixed.
- `#I317611` - Warning error thrown when using local data issue has been fixed.
- `#I324294` - Grid checkbox selection performance issue has been fixed in material theme.
- `#F164532` - Column remote data issue with dropdown edit has been fixed.

## 19.1.58 (2021-04-27)

### Grid

#### Bug Fixes

- `#I323447` - Grid print dialog hovering issue has been fixed.
- `#I323007` - `getRowIndexByPrimaryKey` thrown script error while rendering the child grid issue has been fixed.
- `#I322540` - Selected row index property issue with checkbox deselection has been fixed.
- `#I322859, #I323462` - Ignore accent property issue with excel filter has been fixed.
- `#I318995` - Child Grid expand not working properly has been fixed.
- `#I321908` - Throws script error while dragging page number index in Grid is fixed.
- `#I323304` - Displayed the `headerText` instead of `Filter` in adaptive UI filter dialog.
- `#I323304` - Column's visible, `allowFiltering`, and `allowSorting` properties not working in adaptive UI issue has been fixed.
- `#I322769` - Adaptive UI default toolbar items issue has been fixed.

## 19.1.57 (2021-04-20)

### Grid

#### Bug Fixes

- `#I323673` - Paging issue while deleting records in last page has been fixed.
- `#I321175` - Previous filter value is reappearing on the excel filter input issue has been fixed.
- `#I323060` - Excel custom filter issue has been fixed.
- `#I322391` - Provided the support for `rtl` in menu filter in dropdown component.
- `#I321693` - `RowDeselected` event data property issue has been resolved.

## 19.1.56 (2021-04-13)

### Grid

#### Bug Fixes

- `#I319687` - Child grid row drag and drop issue has been fixed.
- `#I321090` - Throws script error while using `hideSearchbox` in filter is fixed.
- `#I163579` - Focus issue while render multiple inputs in column template, issue has been fixed.
- `#I320238` - Change content casing of `No matches found` has been resolved.
- `#I317408` - Warning error thrown when binding a data dynamically by using `asyncpipe` binding issue has been fixed.
- `#I321142` - Exporting is not working properly in `foreignKeyColumn` issue has been fixed.
- `#I317066, #I317853` - When we right-click the bottom row in the current view area, the grid automatically scrolls issue has been fixed.

## 19.1.55 (2021-04-06)

### Grid

#### Bug Fixes

- `#I319396,#I317406` - Incorrect click handler reference while destroying Grid has been resolved.
- `#F163694` - Delete action issue with non-current view records has been fixed.
- `#I291960` - Resize handler height issue while window resizing has been resolved.
- `#I319831` - Column resizing line not shown issue has been fixed in `virtualization` feature.
- `#I314289` - Frozen horizontal scrollbar issue has been fixed in mac browsers.
- `#I318411` - column menu opens in wrong direction issue has been resolved.
- `#I319726` - Pdf export issue while using `valueAccessor` in boolean column has been fixed.
- `#I318892` - `checkboxOnly` selection issue while enable `rowDragandDrop` has been resolved.
- `#I320238` - Header checkbox selection issue when remove pager has been fixed.
- `#I318745` - infinite Scroll invoked while moving the horizontal scrollbar issue has been fixed.
- `#I320328` - throws script error while updating the data in Dialog editing is fixed.
- `#I300506` - Provided support to set locale texts for Boolean values in checkbox filter.

## 19.1.54 (2021-03-30)

### Grid

#### New Features

- `#266164`, `#298390`, `#298305`, `#317536`, `#197245` - Provided mobile view support for responsive Grid.
- `#243700`, `#255673`, `#145292`, `#312122`, `#316185`, `#162746`, `#162824` - Provided exporting image and hyper link to Excel and PDF file formats.
- `#297861` - Provided option for rendering checkbox items in menu filter dialog.
- `#308524` - Provided autofilter support in Grid to Excel export.
- `#297263` - Provided complex column filtering and sorting support with IQueryable.
- `#307522` - Provided the target indicator support for drag and drop with different Grid.

## 18.4.49 (2021-03-23)

### Grid

#### Bug Fixes

- `#317578` - Throws script error while updating the template column in Batch edit mode issue has been fixed.
- `#316684, #319594` - Script error when drag rows from grid to other components issue has been fixed.
- `#317534` - Custom filtering not working when using filter template, has been fixed.

## 18.4.48 (2021-03-16)

### Grid

#### Bug Fixes

- `#315782` - Virtualization with grouping issue has been fixed.
- `#19156` - Scroll is prevented with infinite scroll's cache mode issue has been fixed.

## 18.4.47 (2021-03-09)

### Grid

#### Bug Fixes

- `#315085` - Script error with custom format in server side exporting has been fixed.
- `#22476` - `getRowIndexByPrimarykey` method returns incorrect index with complex data has been fixed.
- `#292594` - Preventing the row deselection issue has been resolved.
- `#316299` - Previous data is not properly return while save action, issue has been fixed.
- `#315859` - Script error while using using the textbox component in the filter template has been fixed.
- `#311142` - Provided the support for custom datasource in excel filter.
- `#314870` - Checkbox Filter true/false locale text issue has been resolved.
- `#315677` - Horizontal scroll bar is hide while filtering the column with frozen columns issue has been fixed.

## 18.4.46 (2021-03-02)

### Grid

#### Bug Fixes

- `#313780` - Infinite Scroll invoked while moving the horizontal scrollbar issue has been fixed.
- `#314929` - Maximum call stack exceeds issue when pressing tab key has been resolved.

## 18.4.44 (2021-02-23)

### Grid

#### Bug Fixes

- `#314800` - filter dialog position when `rtl` is enabled issue has been fixed.
- `#314860` - Grouped icon drag and drop issue has been fixed.

## 18.4.43 (2021-02-16)

### Grid

#### Bug Fixes

- `#310507` - Frozen layout issue while changing `pagesizes` issue has been resolved.
- `#306030` - Filtering numeric columns through enter key issue has been resolved.
- `#311829` - Records are repeated while doing virtual scrolling when selection or focus applied issue has been fixed.
- `#312581` - Header `aria-colindex` attribute issue has been fixed.
- `#313556` - `ExcelFilter` dialog position issue has been fixed.
- `#308792` - Filter icon update when enable `foreignKey` column, issue has been resolved.

## 18.4.42 (2021-02-09)

### Grid

#### Bug Fixes

- `#310158` - Selected records reorder issue has been fixed.
- `#311583` - `rowSelected` event issue has been resolved.

## 18.4.41 (2021-02-02)

### Grid

#### Bug Fixes

- `#309585` - copy with header in clipboard issue has been resolved.
- `#299892` - script error when calling refresh method issue has been resolved.
- `#310296` - Parent level group footer not visible in excel export issue has been fixed.
- `#309731` - Persist Checkbox selection issue while show/hide column, has been fixed.
- `#310699` - column width is set as 'auto' works properly while exporting in excel.
- `#310989` - filtered value retained properly in the `filterbar` when `persistence` enabled.

## 18.4.39 (2021-01-28)

### Grid

#### Bug Fixes

- `#310077` - Persist Checkbox selection with frozen columns issue has been fixed.
- `#309205` - Script error While sorting in excel filter when more than one grid is rendered issue has been resolved.

#### New Features

- `#247931, #251431` - Provided the server side Excel and PDF export support.

## 18.4.35 (2021-01-19)

### Grid

#### Bug Fixes

- `#310607` - Script error while excel filtering with Blank value has been fixed.
- `#308259` - Row deselect event not triggered when clicking on the row has been fixed.
- `#160944` - Autofit issue while double clicking has been fixed.

## 18.4.34 (2021-01-12)

### Grid

#### Bug Fixes

- `#309059` - The horizontal scroll bar is not displayed while using Frozen column issue has been fixed.
- `#308465` - Filtering Foreign key column issue has been fixed.
- `#309205` - Script error while using Excel Filter issue has been resolved.
- `#160945` - Rendering wrong page records issue after deleting with Group has been fixed.

## 18.4.33 (2021-01-05)

### Grid

#### Bug Fixes

- `#306851` - Virtualization with `selectRow` method issue has been fixed.
- `#297879` - Alignment issue has been fixed when we have the hidden frozen column with empty data set.
- `#160660` - Grid query included in foreign key column issue has been resolved.
- `#306162` - Pager dropdown overlap issue has been resolved.
- `#307973` - The `isInteracted` property issue in row deselect events has been fixed.
- `#160548` - Frozen grid duplicate template rendering issue has been fixed.
- `#296093` - Grouping with `virtualization` hide column issue has been fixed.

## 18.4.32 (2020-12-29)

### Grid

#### Bug Fixes

- `#160497` - `PageSizes` dropdown showing empty string issue has been resolved.
- `#308117` - Changing `PageSettings` dynamically issue has been fixed.
- `#305463, #307312` - Filter icon updated issue has been resolved.
- `#307775, #307812, #306656` - Script error throws when update the react state value issue has been fixed.
- `#308510` - where property type changed to `Predicate` in `dataStateChangeEventArgs`.

## 18.4.31 (2020-12-22)

### Grid

#### Bug Fixes

- `#303869` - Event argument type issue has been fixed.
- `#160246` - Sorting column not removed while changing `groupSettings` issue has been resolved.
- `#301282` - Export `aggregations` misalignment while using the custom datasource, issue has been fixed.
- `#305619` - Export `aggregations` misalignment while using the stacked header, issue has been fixed.
- `#306030` - Filtering numeric column by pressing `Enter Key` is not working, has been fixed.
- `#306032` - custom validation message misalignment issue has been fixed.
- `#306282` - sort icon alignment issue in `bootstap4` has been fixed.

## 18.4.30 (2020-12-17)

### Grid

#### Bug Fixes

- `#301599` - Editing issue in frozen Grid with `virtualization` has been fixed.

#### New Features

- `#284110` - Provided support for sorting in excel filter dialog.
- `#295348`, `#159594` - Provided support for Grid column selection.
- `#202824` , `#199899`, `#138469`, `#263330`, `#151661`, `#271993`, `#158735` - Provided support for freeze column to the right of Grid.
- `#10632` - Provided support for specifying 'items' type in grid pager.
- `#294082` - Provided support for row reorder refresh support in Grid component.

#### Breaking Changes

- In Frozen Grid, we have moved the vertical scroller from movable content div to its parent element and also rendered a separate div in grid content element to perform the horizontal scroll action. This changes improves scrolling smoothness and avoid delayed scrolling between the frozen and movable content.

## 18.3.53 (2020-12-08)

### Grid

#### Bug Fixes

- `#304497` - Initial filtering sends two request issue has been resolved.
- `#18774` - Footer aggregate with frozen columns in `rtl` mode alignment issue has been resolved.
- `#160297` - opening excel filter through column menu issue has been resolved.

## 18.3.52 (2020-12-01)

### Grid

#### Bug Fixes

- `#304090` - Checkbox selection issue with filtering actions has been fixed.
- `#159766` - Dialog footer content issue has been fixed.
- `#303904` - Grid columns is Auto Scroll issue while clicking the first column has been fixed.
- `#299643` - Provided the support for `rtl` in excel export.
- `#302342` - Whiling dragging header, cursor not following issue has been resolved.
- `#159701` - Currency format not applied while exporting pdf issue has been resolved.
- `#159725` - Sorting icon displayed over the header in fabric theme issue has been fixed.
- `#296476` - AutoFit columns issue with hierarchy Grid has been resolved.
- `#304389` - `foreignKey` columns grouping issue has been fixed.

#### New Features

- `#284110` - Provided support for sorting in excel filter dialog.

## 18.3.51 (2020-11-24)

### Grid

#### Bug Fixes

- `#302178` - Grid does not destroyed issue has been resolved.
- `#301357`,`#302019` - frozen Grid layout issue when change the empty datasource has been fixed.

## 18.3.50 (2020-11-17)

### Grid

#### Bug Fixes

- `#158208` - Grid `pageSize` 'All' translated issue has been fixed.

## 18.3.48 (2020-11-11)

### Grid

#### Bug Fixes

- `#13681` - Removed select row checkbox in dialog editing `popup` as a improvement feature.
- `#158850` - Missing of Column name in `actionBegin` arguments while `ungrouping` has been added.
- `#298860` - Inline editing with persist selection issue has been resolved.
- `#300648` - Script error while clicking on empty records issue has been fixed.
- `#300137` - Tooltip is not closed issue has been fixed.
- `#158868, #159209`- Fixed the asynchronous refreshing while Grid initialization.
- `#298630` - `checkboxOnly` selection not working when editing, has been fixed.
- `#299325` - `Checkbox` selection not working while dynamically changing the DataSource, has been resolved.
- `#298387` - `Cellsave` issue when using home and end keys has been fixed.

## 18.3.47 (2020-11-05)

### Grid

#### Bug Fixes

- `#292035` - Resolved Touch functionality is not working with draggable.
- `#298662` - Grid drag and drop issue has been fixed in IE11 browser.
- `#10632` - provided the custom text support in pager instance.
- `#159184` - Script error throws while exporting grid component with aggregates issue has been fixed.

## 18.3.44 (2020-10-27)

### Grid

#### Bug Fixes

- `#297750` - Stacked columns with frozen columns issue has been fixed.
- `#296093` - Prevented row drag and drop icon when `virtualization` is enabled.
- `#293443` - Incorrect rows count while focusing table with JAWS has been fixed.
- `#298824` - Pdf export with boolean column issue has been fixed.

## 18.3.42 (2020-10-20)

### Grid

#### Bug Fixes

- `#293485` - `ActionBegin` event paging arguments `cancel` property retained issue has been fixed.

## 18.3.40 (2020-10-13)

### Grid

#### Bug Fixes

- `#293407` - `RowDeselecting` event triggered when clicking on expansion area issue has been resolved.
- `#292818` - `Aggregate` column alignment issue has been fixed.
- `#157969` - Default filtering operator when enabling `showFilterBarOperator` issue has been resolved.
- `#157753` - Update and insert `actionFailure` events arguments structure issue has been fixed.
- `#291959` - Radio button editing issue in dialog template has been fixed.
- `#291000` - `CurrentLocale` pager DropDown API changing issue has been fixed.
- `#288619` - Persist selection issue with initial selection has been fixed.
- `#293646` - Dynamic query updating issue has been fixed.
- `#295025` - sort order with foreign key column issue has been fixed.
- `#293387` - Infinite scrolling with grouping issue has been fixed.
- `#295712` - Scrollbar move issue when hide columns with RTL mode, has been fixed.
- `#292471` - Template properties not showing in `pagerTemplate` issue has been fixed.

## 18.3.35 (2020-10-01)

### Grid

#### New Features

- `#279959, #278895` - Provided lazy load grouping support.
- `#252918` - Provided immutable mode and methods support.

## 18.2.59 (2020-09-21)

### Grid

#### Bug Fixes

- `#283675` - Excel custom filtered value issue has been resolved.
- `#291032` - String column Change event issue has been fixed.
- `#291960` - resize handler height issue with auto wrap has been fixed.
- `#293441` - Improved the Checkbox filter module with keyboard navigation.
- `#287676` - Mouse position issue when row dragged, has been fixed.

## 18.2.58 (2020-09-15)

### Grid

#### Bug Fixes

- `#291552` - `Resizing` lines in stacked header issue has been resolved.
- `#290601` - `Recordclick` event arguments has been fixed.
- `#291949, #287468` - Provided the internal event to use custom datasource in `checkbox` filter.
- `#280083` - Added the correct translated string in the locale `json` file.
- `#291160` - Edit form closes when exception thrown from server issue has been fixed.
- `#157390` - Provided the column and `rowIndex` details inside the `editTemplate`.
- `#292599` - Script error while using grouped `foreignkeyColumn` with aggregate column has been fixed.

## 18.2.57 (2020-09-08)

### Grid

#### Bug Fixes

- `#288147` - Script error while using `addRecord` in `IE11`, has been fixed.
- `#288292` - copy and paste in `mac os` issue has been resolved.
- `#290651` - column chooser `pop-up` is hidden partially has been fixed.
- `#290215` - Checkbox selection issue when delete records, has been fixed.

## 18.2.56 (2020-09-01)

### Grid

#### Bug Fixes

- `#289461` - Added the internal event to access menu filter `popup` before close.
- `#289421` - `AutoFill` functionality issue when `frozen` columns, has been fixed.
- `#289539` - Script error while using `commandcolumns` with `virtualization` has been fixed.
- `#290636` - Decimal value paste issue has been fixed.

## 18.2.55 (2020-08-25)

### Grid

#### Bug Fixes

- `#288845` - `Multi-column` sort pop-up in mobile device issue has been resolved.
- `#289048` - Checkbox selection issue when adding row has been fixed.
- `#288647, #289359` - Menu and excel filter dialog open issue has been fixed.

## 18.2.54 (2020-08-18)

### Grid

#### Bug Fixes

- `#285919` - script error while using `checkbox` column with dialog editing has been fixed.
- `#282743` - Provided custom separator support in `csv` export.
- `#287707` - Menu Filtering in string column issue has been resolved.
- `#286727` - Cell text selection issue while editing has been fixed.
- `#287222` - Date column filtering issue with blank value has been fixed.
- `#278507, #288354` - Setting column `minWidth` support while window resizing has been provided.
- `#281825` - Grid resizing behaviour with percentage width column and grouping has been.
- `#287897` - Row drag issue when field based checkbox column, has been fixed.

## 18.2.48 (2020-08-04)

### Grid

#### Bug Fixes

- `#155948` - Grid pager text issue has been fixed.
- `#285963, #282379` - Provided catch exception for pdf exporting using custom datasource.
- `#286379` - `rowSelected` event arguments in row data, issue has been fixed.
- `#286293` - Excel export `aggregations` misalignment while using the command column, issue has been fixed.
- `#156328` - `Filterbar` operator alignment issue has been fixed.
- `#273866` - Column resize icon issue has been fixed.

## 18.2.47 (2020-07-28)

### Grid

#### Bug Fixes

- `#279922` - `Frozen` columns Border issue has been fixed.
- `#284955` - cell focusing in `Batch` mode issue has been fixed.
- `#285597, #155910` - Aggregate cell alignment issue has been fixed.
- `#286012` - Page number style in `Pdf` footer issue has been fixed.
- `#15777` - Multiple selection in row drag and drop issue has been resolved.
- `#281447` - Provided `dataStateChange` event support for menu and excel filter autocomplete control.
- `#285669, #284890` - Column reordering issue with custom binding has been fixed.

#### New Features

- `#284752` - Provided `pdfAggregateQueryCellInfo` and `excelAggregateQueryCellInfo` event to customize the aggregate cell before exporting .

## 18.2.46 (2020-07-21)

### Grid

#### Bug Fixes

- `#282385` - Footer and Header content alignment issue with Pdf export has been fixed.
- `#281232` - Scroll bar not working properly has been fixed.
- `#281745` - `rowIndexes` property return the improper value in `rowDeselectEventArgs` has been fixed.
- `#280856` - Opening context menu resets horizontal scroller has been fixed.
- `#282656` - Restoring Excel filter Operator selection with Grid persistence issue has been fixed.
- `#284270` - Foreign Key column search issue has been fixed.

## 18.2.45 (2020-07-14)

### Grid

#### Bug Fixes

- `#278574` - `Virtualization` scroll jumps when rendering grid inside the dialog component issue has been fixed.
- `#283109` - Column Templates are removed in the Infinite scrolling issue has been fixed.
- `#281788` - Infinite scroll editing issue has been fixed.
- `#282440` - White space occurs while scrolling left and right in Frozen columns with `virtualization` issue has been fixed.
- `#283323, #283973` - Triggering multiple `actionBegin` and `actionComplete` event while show/hide column issue has been fixed.
- `#283675` - Script error while using excel filter has been fixed.
- `#276276` - `dateTime` filtering issue with `URLAdaptor` has been fixed.
- `#279521` - Scrollbar now refreshes correctly after filtering with frozen columns and `virtualization` present.
- `#279969` - `ActionBegin` event arguments `cancel` property retained issue has been fixed.
- `#281958` - `BoxWithBorder` selection issue has been fixed.
- `#282215` - When `resetOnRowClick` is enabled, records in the previous page are not deselected issue has been fixed.
- `#280984` - When enable `frozen` columns and resize, `aggregate` cells alignment issue has been fixed.
- `#282759, #280077` - Scrollbar when clicking `childgrid` page container, issue has been fixed.
- `#282379` - Provided `catch` exception for pdf exporting.
- `#280511` - Cell focus not retained when escape key pressed while editing has been fixed.

## 18.2.44 (2020-07-07)

### Grid

#### New Features

- `#221401, #247125, #152063` - Provided support to select the operator for `filterbar` in UI.
- `#147816` - Provided support for `Frozen` rows and columns with `AutoFill`.
- Provided the `Frozen` support in Grid continuous scroll feature.
- Provide the Editing support in Grid continuous scroll feature.

## 18.1.59 (2020-06-23)

### Grid

#### Bug Fixes

- `#279922, #280077` -  Scrollbar when clicking `childgrid` summary row, issue has been fixed.

## 18.1.57 (2020-06-16)

### Grid

#### Bug Fixes

- `#279487` - Selecting and Deselecting now works properly after searching in external column chooser.
- `#278413` - Unwanted Vertical scrollbar after column resizing issue has been resolved.
- `#279922` - The last row detail template border issue has been fixed.
- `#154568` - Filter pop-up issue with mobile device has been fixed.
- `#263232` - Throws scripts error while `hide/show` the columns issue has been fixed.
- `#277663` - Footer aggregate works properly with custom data while exporting in excel.

## 18.1.56 (2020-06-09)

### Grid

#### Bug Fixes

- `#278390` - Internal event for access the excel export rows has been added.
- `#277728` - Search box focus issue in IE has been fixed.
- `#12629` - Prevented the `dataStateChange` event after re-ordering a column.
- `#154111` - Issue in updating `aggregate` format with culture change has been fixed.
- `#14010` - Grid row selection event arguments type issue has been fixed.
- `#278858` - `rowDeselected` event with `persistence` and `ResetOnRowClick` issue has been fixed.
- `#154619` - Number formatting with empty string issue has been fixed.
- `#279065` - `Groupcaption` aggregate in `pdf` export issue has been fixed.

#### Breaking Changes

- Now `data`, `row`, `foreignKeyData` these Grid selection event arguments are get array values only when we perform multi selection. Please find modified event arguments and it types from the below table,

`Properties` |`Type`
-----|-----
`data` | `Object or Object[]`
`rowIndex` | `number`
`rowIndexes` | `number[]`
`row` | `Element or Element[]`
`foreignKeyData` | `Object or Object[]`

## 18.1.55 (2020-06-02)

### Grid

#### Bug Fixes

- `#269310` - Throws scripts error while using the `persist` selection issue has been fixed.
- `#277025` - Maintain the edit form while cancelling the edit action inside the `actionBegin` event has been fixed.
- `#278295` - Cell did not save the empty value for complex field has been fixed.
- `#278209` - Additional Lines with `AutoFill` selection issue has been fixed.
- `#275723` - Data skipping issue has been fixed in `virtualScroll` feature.

## 18.1.54 (2020-05-26)

### Grid

#### Bug Fixes

- `#277115` - Issue with custom datasource while exporting has been fixed.
- `#275804` - `aria-label` of the column for summary rows in both footer aggregates and group footer aggregates has been fixed.
- `#154185` - Script error, cannot read property `getBoundingClientRect` has been fixed.
- `#154127` - Missing of first row `foreignKey` data in the `rowSelected` event argument has been fixed.
- `#276812` - Grid stacked header with frozen misalignment issue has been fixed.

## 18.1.53 (2020-05-19)

### Grid

#### Bug Fixes

- `#275858` - Border misalignment issue with `frozen` columns in batch editing has been fixed.
- `#275150` - Grid with `frozen` columns and row height is not set properly issue has been fixed.
- `#275631` - Grid with `frozen` columns and cell editing is not working properly issue has been fixed.
- `#152895, #271656, #273560` - Grouped Headers are not rendered properly in pdf document issue has been resolved.
- `#270479` - Script error while using `isFrozen` property in batch editing has been fixed.
- `#275867` - Misalignment while editing the cell with frozen columns has been fixed.

## 18.1.52 (2020-05-13)

### Grid

#### Bug Fixes

- `#273572` - script error after pressing enter key in batch edit mode issue has been resolved.
- `#153383` - grid lines mismatched while scrolling with frozen column in `firefox` issue has been resolved.
- `#273838` - Unnecessary to include an Empty row when inserting a `frozenColumn` Grid row issue has been resolved.
- `#274520` - `cellSeletected` and `cellDeSelected` events triggers many time while selecting cells via mouse issue has been resolved.
- `#275010` - Need internal events for column chooser buttons issue has been fixed.
- `#274227` - cancel icon not rendered in the filter bar with movable header has been fixed.

#### New Features

- `#261103, #267581` - Provided the column `Reordering` support for Grid with `virtualization` and frozen columns feature.

## 18.1.48 (2020-05-05)

### Grid

#### Bug Fixes

- `#269945, #271023` - `editTemplate` element events are not triggered for movable content.
- `#273042` - grouping after restoring the persist data issue has been resolved.
- `#273483, #275002, #275153` -  `actionfailure` event error message issue has been fixed.
- `#273238` - Missing of `headerText` property in the template data has been fixed.
- `#266631` - Hidden column headers in Grid did not reflect in pdf export while using `includeHiddenColumn` issue has been fixed.
- `#271911` - column template in angular after print issue has been resolved.
- `#273134` - Header template in angular after print issue has been fixed.
- `#269502` - Mismatch of reordering column issue has been fixed.
- `#273854, #274776` - Foreign Key search query for `UrlAdaptor` has been fixed.

## 18.1.46 (2020-04-28)

### Grid

#### Bug Fixes

- `#272718` - `cellsaved` event while pressing escape key issue has been resolved.
- `#153144` - `RowDeselected` event `isInteracted` and `rowIndex` property issue has been resolved.
- `#274186` - Script error with incorrect sorting column has been fixed.
- `#272426` - Hierarchy exporting with remote/local data issue has been resolved.
- `#153397` - Persist selection issue with grouping has been fixed.
- `#272957` - Script error while hovering on new row form element with frozen columns has been resolved.
- `#272107` - `setCellValue` method issue with row Drag and Drop has been fixed.

## 18.1.45 (2020-04-21)

### Grid

#### Bug Fixes

- `#269217` - numeric edit precision issue has been resolved.
- `#272015, #152919` - React `editTemplate` auto save issue has been resolved.
- `#271853` - Missing additional parameters in the `foreignKey` column filtering and editing server request issue has been fixed.
- `#152879` - Filter bar focusing is not working properly, while using `checkboxmode` as `ResetOnRowClick` issue has been fixed.
- `#151211` - Provided `exportGroupCaption` event support for Excel exporting.
- `#270519` - Script error while setting `undefined` value for column type/format property with Angular Grid has been fixed.
- `#258482` - Improper target element in `rowSelecting` event issue has been fixed.
- `#271748` - Autofit min and max width issue has been resolved.
- `#223835, #272592` - script error while navigating from movable to frozen header issue has been resolved.
- `#272340`- Mismatch of `requestType` while clear filtering in excel and Checkbox filter issue has been fixed.

## 18.1.44 (2020-04-14)

### Grid

#### Bug Fixes

- `#271625, #272096` -  Frozen Grid cell selection issue has been fixed.
- `#271625` - Grid resize cursor issue with stacked header has been fixed.
- `#271240` - Batch editing `cellSaved` event after escape key issue has been fixed.
- `#260390` - Header misalignment in auto wrap enabled Grid with frozen columns has been fixed.

#### New Features

- `#256907` - Provided support to filter array values.

## 18.1.43 (2020-04-07)

### Grid

#### Bug Fixes

- `#268095` - Undefined value is saved as [Object Object] in batch editing has been fixed.
- `#266864` - Error in Angular Production build with toolbar search is enabled in Grid has been fixed.
- `#268842` - Empty summary value issue when collapse the record has been fixed.
- `#270597, #271625` - Validation message position issue has been fixed.
- `#268807` - ResetOnRowClick now works properly with persist selection.
- `#270585` - recordClick event issue after grouping has been resolved.
- `#258489, #268908` - Saving the cell through tab key issue in batch edit has been fixed.
- `#270170` - Script error with Esc key while in cell edit state and filter enabled has been fixed.
- `#151902`- Script error When auto fit the Grid having Aggregate, Resize and Freeze enabled has been fixed.
- `#269226,#152345`- Focusing is not working properly when filtering the column by tab key with immediate mode issue has been fixed.
- `#152164` - CheckBox column value overriding the boolean type column while editing issue has been resolved.

## 18.1.42 (2020-04-01)

### Grid

#### Bug Fixes

- `#151795` - Provided the row information when clicking the row drag and drop icon.
- `#266184`, `#269384`, `#270479` - Last row cell is not saved properly in batch edit mode issue has been fixed.
- `#267889` - Saving Null value as NaN in numeric edit columns issue has been fixed.
- `#268588` - Script error while destroying the grouping enabled hierarchy Grid has been fixed.
- `#269161` - Column chooser issue in IE11 has been resolved.

## 18.1.36-beta (2020-03-19)

### Grid

#### Bug Fixes

- `#261856` - Initial sorting with initial grouping issue has been fixed.
- `#264895` - Provided support to add aggregates for auto generated columns dynamically.
- `#263303` - Grid UI has been refreshed while changing `allowRowDragAndDrop` property.
- `#264370` - Empty tooltip for checkbox column with `ellipsisWithTooltip` property issue has been resolved.
- `#252918` - Provided a feature to change the UI and datasource value without enabling edit property.
- `#261903`, `#263836` - Incorrect `datetime` predicate issue has been resolved.

## 17.4.55 (2020-03-10)

### Grid

#### Bug Fixes

- `#261856` - Initial sorting with initial grouping issue has been fixed.
- `#264895` - Provided support to add aggregates for auto generated columns dynamically.
- `#263303` - Grid UI has been refreshed while changing `allowRowDragAndDrop` property.
- `#264370` - Empty tooltip for checkbox column with `ellipsisWithTooltip` property issue has been resolved.
- `#252918` - Provided a feature to change the UI and datasource value without enabling edit property.
- `#261903`, `#263836` - Incorrect `datetime` predicate issue has been resolved.
- `#151850` - Case sensitivity issue with Excel filter has been resolved.
- `#267120` - Unwanted new record while pressing tab key with batch mode has been resolved.
- `#267938` - Improper column rendering issue with column chooser has been resolved.
- `#264582` - Grid filter dialog styles issue in compatibility theme has been resolved.
- `#267397` - Misalignment issue has been resolved while hiding columns with Grid edit state.
- `#264165, #266190` - validation message issue has been fixed when we set `newRowPosition` as bottom in batch mode.

## 17.4.51 (2020-02-25)

### Grid

#### Bug Fixes

- `#150980` - script error while using item template issue has been fixed .
- `#263885` - script error in IE11 while enabling persistence has been resolved.

## 17.4.50 (2020-02-18)

### Grid

#### Bug Fixes

- `#262976` - Numeric text box min max validation issue has been resolved.
- `#149695` - Checkbox search value is added to the filter search begin event.
- `#261796` - Script error while navigating batch added record with tab has been fixed.
- `#263530` - `beforeOpenColumnChooser` event has been triggered while calling `openColumnChooser`.
- `#262469` - Issue in hiding custom column menu has been fixed.
- `#151010` - Scroll position issue while filtering has been fixed.

## 17.4.49 (2020-02-11)

### Grid

#### Bug Fixes

- `#262309` - Incorrect selected records after batch delete issue has been fixed.
- `#261796` - Script error while adding row at bottom after batch delete has been resolved.
- `#261544` - Incorrect column resizing with row drag and drop issue has been resolved.
- `#150858` - Media Query issue has been resolved.
- `#263233` - Data type in row drop event argument issue has been resolved.
- `#262898` - Filtering text box in movable columns focus issue has been fixed.�

## 17.4.47 (2020-02-05)

### Grid

#### Bug Fixes

- `#261008` - Aggregate issue while batch adding in empty Grid has been resolved.
- `#150685` - Persist selection behaviour issue has been fixed
- `#260966` - Excel Filter locale text issue has been resolved.
- `#261623` - Script error while removing foreign key column filter issue has been resolved.
- `#260182` - Multiple request while setting query issue has been resolved.

## 17.4.46 (2020-01-30)

### Grid

#### Bug Fixes

- `#260390` - Misalignment while editing with frozen column issue has been fixed.
- `#260090` - `isInteracted` property is added to the row selecting events.
- `#150452` - Misalignment while hiding columns with row drag and drop has been fixed.

## 17.4.44 (2021-01-21)

### Grid

#### Bug Fixes

- `#259865` - Grid focus persistence while checkbox filtering has been fixed.
- `#258341` - `action` parameter has been added for filter events.
- `#150314` - Footer template issue with Pdf export has been fixed.
- `#260453` - `rowDragStartHelper's`action can be cancelled using the `args.cancel` parameter.
- `#255626` - Grid data not properly loaded on dynamically changing culture issue has been fixed.
- `#251481` - Provided the pdf export support for Grid stacked header feature.

## 17.4.43 (2020-01-14)

### Grid

#### Bug Fixes

- `#259844` - Excel filter with null operator issue has been fixed.
- `#248887, #245140, #249856` - Selection issue while Virtualization enabled has been fixed.

## 17.4.41 (2020-01-07)

### Grid

#### Bug Fixes

- `#257854` - Multiple requests while pager dropdown change has been fixed.
- `#258463` - CheckBox filter search list query issue has been fixed.
- `#258467` - Command button duplicate id issue has been fixed.
- `#258196` - command column with frozen content issue has been fixed.
- `#258555` - Unnecessary row selected event while paging issue has been fixed.
- `#258341` - Incorrect arguments of clear filtering events has been fixed.

## 17.4.40 (2019-12-24)

### Grid

#### Bug Fixes

- `#257521` - Styling issue on Aggregate columns has been fixed.
- `#257192` - Provided cancel support for Sorting action.
- `#253400` - Enabled hovering for whole row in frozen columns.
- `#F136797, #259020` - Script error throws in `IE11` while using `autoGenerated` columns has been resolved.
- `#250970` - Check box as field with header checkbox selection is not working properly has been fixed.
- `#256174` - Select all does not work properly when Grid have empty records with virtual rows in Batch edit has been fixed.
- `#F146375` - Aggregate is not shown in Exported file for Child Grid issue has been fixed.

## 17.4.39 (2019-12-17)

### Grid

#### Bug Fixes

- `#256411` - While programmatically filter the Grid, `filterBar` does not get updated issue has been fixed.
- Filter item template arguments from single object to nested object structure has been reverted.
- `#253073`, `#255255` - Aria labels added for grid dialog with feature name for accessibility improvement.
- `#253073`, `#255255` - When pressing tab key focus moving to next row support added.

#### New Features

- Provided `virtualization` support in Frozen Grid.

## 17.3.28 (2019-11-19)

### Grid

#### Bug Fixes

- `#242503` - Aggregation not working with the Frozen and Batch Editing issue has been fixed.
- `#254164` - Support for `FilterItemTemplate` function like as `ValueAccessor` is given.
- `#253705` - `Ctrl+A` in Grid does not select the last record in Batch mode issue has been fixed.
- `#253106` - Error thrown on using `setCellValue` method when row drag and drop is enabled issue has been fixed.
- `#253398` - Frozen header height discrepancy when setting `rowHeight` and `allowTextWrap`  property issue has been fixed.
- `#252923` - Grid footer element is invisible while dynamically bind the Grid dataSource issue has been fixed.
- `#253614` - Changed the scope of the `filterOperator` variable as public.

## 17.3.27 (2019-11-12)

### Grid

#### Bug Fixes

- `#249911` - Border style is not set on last row when performing edit operations issue has been fixed.
- `#253795` - Script error thrown when having header template in stacked header cell issue has been fixed.
- `#252476` - Script errors throws while navigating empty grid with tab issue has been fixed.
- `#251960` - Performance issue occurs when selecting large amount of records in Checkbox in Grid.
- `#251934` - Custom Date format issue has been fixed.
- `#252405` - Provided operator support for Custom Excel filter.
- `#252987`,`#252201` - Refreshing the grid with edited child grid throws script error has been fixed.
- `#148096` - Error thrown when `hidemedia` is enabled issue has been fixed.

## 17.3.26 (2019-11-05)

### Grid

#### Bug Fixes

- `#250198` - Unable to cancel row and cell selecting when multi selection is enabled issue has been fixed.
- `#250198` - `CellSelected` event returning same data for both current and previous cell has been fixed.
- `#251226`,`#252997` - Complex field primary key column is not working while the column type is string issue has been fixed.
- `#252052` - Filtering throws console error when complex data with null values are bound to Grid has been fixed.
- `#251292` - Duplicate records is sent in Remote Save Adaptor batch deleting issue has been fixed.
- `#252476` - Script error throws while navigating empty grid with tab issue has been fixed.

#### Breaking Changes

- Now `disableHtmlEncode` default value  is set to true, so the HTML tags can be displayed in the Grid header and content by default, so to display it as html content `disableHtmlEncode` need to be set as false.

## 17.3.21 (2019-10-30)

### Grid

#### Bug Fixes

- `#251660` - Grouping with Virtualization throws script error has been fixed.

## 17.3.19 (2019-10-22)

### Grid

#### Bug Fixes

- `#247618` - `DataGrid` shows hand icon instead of standard mouse on non sortable and non clickable column headers.
- `#249163` - Grid header lines are not properly rendered while resizing the window with text wrap feature.

## 17.3.17 (2019-10-15)

### Grid

#### Bug Fixes

- `#244767` - Validation error message not shown for Batch and Dialog editing has been fixed.
- `#249835` - Need to show confirmation dialog while in batch mode with drag and drop has been fixed.
- `#250135` - Column resizing feature is not working properly when row drag and drop is enabled.
- `#147538` - `recordDoubleClick` event does not remove when destroy grid element is fixed.
- `#244693` - Script error throws while using aggregates with set Row method is fixed.
- `#249990` - Script error throws while using detail template with auto generated columns is fixed.
- `#145834` - Need to access complex columns while using auto generated columns is fixed.
- `#249176` - Exclamation sign was not supported by Filter column is fixed.

## 17.3.16 (2019-10-09)

### Grid

#### Bug Fixes

- `#249323` - Case-sensitive is not working when filter the records by `filterByColum` issue has been fixed.
- `#244767` - `childElement` count undefined issue has been fixed.
- `#244767` - Added the `columnuid` and `customAttributes` in summary column.
- `#244767` - Misalignment issue has been fixed while using frozen with aggregate.
- `#244767` - Validation error message position issue has been fixed.

## 17.3.14 (2019-10-03)

### Grid

#### Bug Fixes

- `#247870`,`#248097` - Print issue while having grouped columns has been fixed.
- `#244767` - Script error thrown when having custom aggregates and dynamically show/hide columns has been fixed.
- `#247790`,`#147427` - True type font issue when having header in Pdf Export has been fixed.
- `#147146` - Check box filter is not showing results while typing in the search box for boolean type column.
- `#242503` - Summary not updated for newly added records in the Grid with batch edit mode with freeze columns issue has been fixed.
- `#147270` - Maximum call stack issue occurs when Grid has no records and set visible property as false for first column has been fixed.
- `#147513` - AutoComplete does not show records properly in filter menu while using complex data binding has been fixed.

## 17.3.9-beta (2019-09-20)

### Grid

#### Bug Fixes

- `#146977` - Script error thrown when enable frozen column with auto generated columns in Grid.
- `#246309` - `AllowResize` must be disabled when we are in edit state.
- `#246947`,`#246460`- Script error is thrown while routing with persistence.
- `#245859` - Can't access selected records properly in `rowSelected` event while selecting the header checkbox.
- `#244916` - Virtual scroll displays empty block while directly scroll to the bottom.

## 17.2.49 (2019-09-04)

### Grid

#### Bug Fixes

- `#244574` - Grid scroller jumps on browser delay while using `virtualization` has been fixed.
- `#245739` - Filter dialog does not close properly when render grid inside the dialog has been fixed.
- `#244047` - Focus module destroyed completely from the content ready.
- `#223749`, `#241000` Provided the support to use `selectRow` method in `virtualized` Grid.
- `#241241` - Filtering not working with `ColumnVirtualization`.
- `#244927` - `CurrrentPage` was not refreshed after changing the dropdown with its highest value.
- Select multi rows with checkbox wrong while set frozen column in grid component has been fixed.

## 17.2.48-beta (2019-08-28)

### Grid

#### Bug Fixes

- `#244231` - On key pressing of column chooser Search bar, empty Grid renders if all columns are unchecked, issue has been fixed.
- `#146166` - CheckBox column disappears after hiding other columns through `columnChooser` issue has been fixed.
- `#146777` - While locking the column dynamically, the Locked column is not moving to the first column position issue has been fixed.
- `#245747` - Validation message position is wrong for rows added in the bottom issue has been fixed.
- `#242519`,`#244186` - Misalignment issue in Frozen Column while editing Grid with edit template.
- `#243593` - Script error thrown when perform row drag and drop with expand child.
- `#242503` - On Saving the cell Footer Content `scrollLeft` is set to zero issue has been fixed.
- `#146553` - Command column was not working when dynamically added in `columnModel` is resolved.

## 17.2.47 (2019-08-27)

### Grid

#### Bug Fixes

- `#244231` - On key pressing of column chooser Search bar, empty Grid renders if all columns are unchecked, issue has been fixed.
- `#146166` - CheckBox column disappears after hiding other columns through `columnChooser` issue has been fixed.
- `#146777` - While locking the column dynamically, the Locked column is not moving to the first column position issue has been fixed.
- `#245747` - Validation message position is wrong for rows added in the bottom issue has been fixed.
- `#242519`,`#244186` - Misalignment issue in Frozen Column while editing Grid with edit template.
- `#243593` - Script error thrown when perform row drag and drop with expand child.
- `#242503` - On Saving the cell Footer Content `scrollLeft` is set to zero issue has been fixed.
- `#146553` - Command column was not working when dynamically added in `columnModel` is resolved.

## 17.2.41 (2019-08-14)

### Grid

#### Bug Fixes

- `#244183` - Provided the `cacheAdaptor` support in Grid.
- `#240141` - Resize not working properly when enabling row drag and drop feature has been fixed.
- `#243754` - Removed the `filterItemTemplate` from Grid persist data.
- `#244375` - Checkbox state was not refreshed while calling `openColumnChooser` has been fixed.
- `#234468` - Script error while refreshing the Grid with `foreignKeyColumn` in persistence enabled has been fixed.

## 17.2.40 (2019-08-06)

### Grid

#### Bug Fixes

- `#242503` - Add form gets misplaced in an empty grid with `frozenColumns`.
- `#242201` - Script error thrown while navigating to other page and come back to grid with filter settings.
- `#237984` - Need to show warning message if provided dataSource in incorrect format.
- `#242484` - Default value is not set for the stacked columns.
- `#146156` - Drag area created while selecting the input area (row drag and drop and multiple selection enabled).
- `#242673` - Change return type for `getCurrentEditCellData`.

## 17.2.39 (2019-07-30)

### Grid

#### Bug Fixes

- `#240377` - Changing page size dynamically in batch edit mode will now prompt confirmation dialog before discarding the changes.
- `#240117` - Support to access column object in grid column template has been provided. Use `column` inside the template to access the respective column properties.
- `#242654` - Dynamically changing `ShowInColumnChooser` property now updated in the `columnMenu` too.

#### New Features

- Default filter operator support has been provided. Use `column.filter.operator` with any of the filter operators to set default operator for filtering.

## 17.2.36 (2019-07-24)

### Grid

#### Bug Fixes

- `#241299` - Misalignment is resolved when hiding a column in a `allowDragAndDrop` enabled Grid.
- `#237505` - Grouping expand and collapse rows are now working properly when `virtualization` enabled with `aggregates`.
- `#241020` - Grid initial filtering is now working fine while filtering the `foreignKey` enabled column.
- `#241150`,`#242157` - Script error while clicking inside the Grid edit form with hidden column has been fixed.
- `#238244` - Script error has been fixed in `IE` browser while continuously create and destroy the grid.
- `#240283` - Support to dynamically set true/false to the `allowDragAndDrop` has been provided.
- `#222746` - Last block of records are now working properly in grouping with `virtualization` feature.

#### New Features

- `#235428` - Support has been provided to enable or disable match case in `filterSettings`. Use `filterSettings.enableCaseSensitivity` to enable or disable match case.
- Provided `autoFit` property in column level to do initial auto-fitting operation.
- Provided `keyPressed` event support.

## 17.2.35 (2019-07-17)

### Grid

#### Bug Fixes

- `#238402` - Sort comparer is now working properly for `RemoteSaveAdaptor`;
- `#235736`, `#237229` - Provided responsive height support for `columnChooser` of `columnMenu`.
- `#234395` - Provided currency code while exporting to excel end `csv` documents.
- `#232623` - Comparer object is now properly working in custom `sortComparer` function while performing in descending order.
- `#240045` - `recordDoubleClick` event is now prevented while clicking on `groupcaption` row.
- `#239272` - `autoFitColumns` for column resizing is now calculated based on aggregates cell content too.
- `#241310` - Text wrap is now applying for movable headers too while refreshing the grid.
- `#234709` - Sorting order is now maintained in the column after undo operation of the grouped column.
- `#236350` - Script error has been resolved while destroying the grid with pager template.

## 17.2.34 (2019-07-11)

### Grid

#### Bug Fixes

- `#237403` -  Footer template shows proper result when using both group footer and footer template in exported excel document.
- `#232272` - `RemoteSaveAdaptor` batch changes are now refreshed properly in grid when `ContractResolver` set to `DefaultContractResolver`.
- `#236337, #234622` - Child grid data is now successfully loads with query property in the `url` adaptor.
- `#236011` - Selection `api` example is now working properly in the sample browser.
- `#233069` - Intelligence is now showing properly for `editSettings.template` property of the grid.
- `#239971` - Script error has been fixed in command column while adding a new row.
- `#233758` - Underscore in the field name is considered as Complex data while saving the changes in Dialog template editing has been fixed.

#### Breaking Changes

- Now in dialog and inline template editing, the element name for complex fields should be given with triple underscore instead of single underscore.  This change has been made as underscore is valid identifier in DB field names.

## 17.2.28-beta (2019-06-27)

### Grid

#### Bug Fixes

- #238512 - Script error during show or hide column operations in `hierarchyGrid` has been resolved.
- #145013 - Support has been provided for custom command button click event.
- #239027 - `Multiselection` is now handled for `Mac` `OS`.
- #236920 - `field` property is applied to `headerText` in `MVC` platform When header text is set as blank has been resolved.
- #234538 - Performing filter operation in the `dropdownlist` is updating Grid column's `dataSource` has been resolved.
- #238762 - `beforePaste` event support has been provided.
- #239158 - Selection border is not removed while clearing the selection using `clearSelection` method has been fixed.
- #238396 - Custom filter is now working properly with `0` value.
- #237140 - `ForeignKey` column filtering is now working in remote date with same `foreignKeyfield` and `foreignkeyvalue`.
- #232623 - Support has been provided to send row object as one of the parameter for `sortComparer` function.
- #145110 - Column chooser is now working properly when column is not shown in the column chooser list.
- #234709 - Sorting is maintained in the column after `ungrouping` the column has been resolved.
- #236657 - `getSelectedRowCellIndexes` method has been fixed to return appropriate values.
- #236295 - An `object` type is set as `defaultValue` property for `aspType`.
- #237984 - Warning log support has been provided for indicating incorrect `dataSource` in `asyncpipe`.
- #144746 - Server post request has been prevented in `pdfExport` while exporting the `currentViewData`.
- #223604 - Script error while scrolling when `activeElement` is in null state has been fixed.
- #235834 - `isVisibile` property is now set while generating focus matrix.

#### Breaking Changes

- Show or hide operation in grid is no more asynchronous. Previously show/hide grid columns has refreshed the grid content and `dataBound` event will be triggered. This behaviour has been now made synchronous to improve toggle visibility performance.
- `minWidth` property value is now applied to the columns when column width is not provided. This ensures that the cell content can occupy as much as available space and should not shrink below the given `minWidth` value.

## 17.1.51 (2019-06-11)

### Grid

#### Bug Fixes

- #235294 - Pager of the grid is refreshed properly during grid persistence.
- #232623 - Complex field structure for primary key columns when using deep watch has been resolved.
- #233441 - Misalignment has been fixed when applying `auto-fit` for stacked header columns.
- #234514 - Context menu is properly rendering when using both default and custom items in header.
- #235841 - `Colspan` is set properly while having empty records in hierarchy grid.
- #236745 - `aria-label` attribute is updated when changing value in batch mode.
- #144884 - Selected `rowIndexes` during `selectAll` checkbox operation has been resolved.
- #143410 - Exporting pdf document with UTC date value in string format has been fixed.
- #235826 - Filter icon overlaps the `headerText` when using menu filter dynamically has been fixed.
- #235017 - Problem with visible property, when `HideAtMedia` is enabled for the column has been resolved.
- #235264 - Script error when click on the column menu filter option in phone mode has been fixed.
- #236759 - `ContextMenu` maintains the previous selected row has been resolved.
- #237815 - Grid updated value is persisted when data has not been returned from server.
- #237239 - Template column is rendered properly with persistence during page refresh.

## 17.1.50 (2019-06-04)

### Grid

#### Bug Fixes

- #236235 - To get the visible element in custom function while using custom validation has been resolved.
- #235593 - To send the `tr` element in `rowDataBound` event instead of document fragment has been fixed.
- #144448 - Maximum call stack issue while invoking `clearFiltering` method in `dataBound` event has been fixed.
- #144431 - Grid export when null is provided for any complex field has been resolved.
- #235415 - `actionFailure` event during successful server side `CRUD` actions has been resolved.
- #234931 - Performance of checking checkbox columns during show/hide operation has been optimized.
- #235081 - Column value as null in `contextMenuClick` event `args` while the target is column cell has been fixed.
- #232225 - Server side Sorting in complex type(with nullable value) data column has been fixed.
- #143671 - Grid filter with null date values has been resolved.
- #225078 - Excel filter check list search criteria has been considered for grid filtering.

## 17.1.48 (2019-05-21)

### Grid

#### Bug Fixes

- #228547 - White space during normal editing is fixed while enabling the row drag and drop functionality.
- #232660 - Script error while exporting the grouped Grid with `enableGroupByFormat` has been resolved.

#### New Features

- #144253 - Provided tag helper support for data manager control.
- #225561 - Provided support to filter records when `ForeignKey` columns and Grid columns have same field names.

## 17.1.47 (2019-05-14)

### Grid

#### Bug Fixes

- #226746 - Provide support to set format for aggregate values while exporting is resolved.
- #234554 - Provide template support for stacked header is resolved.
- #234230 - Batch edit misbehaves when `allowDragAndDrop` enabled is resolved.
- #229226 - `Hyperlink` is not working when setting `clipMode` property in `iOS` is resolved.

## 17.1.44 (2019-05-07)

### Grid

#### Bug Fixes

- #234045 - Custom date format does not applied properly when excel exporting is fixed.
- #231005 - Added Select All option for column chooser.
- #232848 - `enablePersistence` with virtual scrolling displays blank page after refresh is resolved.

## 17.1.43 (2019-04-30)

### Grid

#### Bug Fixes

- #233158- Duplicate virtual element rendered while refreshing the grid is resolved.
- #230859- `actionComplete` event argument `requestType` shown as `paging` while delete operation is resolved.
- #233673- Script error occurs while using column `virtualization` with `enablePersistance` property is resolved.
- #233281- Misalignment between frozen and movable content when using EJ compatibility CSS is resolved.
- #233413- Alignment issue in grid stacked header when we enable frozen feature is resolved.
- #143681- `clearFiltering` method will send multiple posts in excel filter is resolved.
- #234189- Script error while using hidden columns method is resolved.

## 17.1.42 (2019-04-23)

### Grid

#### Bug Fixes

- #233507- Need to modify `api` description for `startedit` method is resolved.
- #229454- A large text content gets collapsed while using `rowHeight` in grid is resolved.
- #232985- Need to send edit operation `args` in `beforeDataBound` event is resolved.
- #231808- Problem in hiding scrollbar place holder when having frozen is resolved.
- #232924- Horizontal scrollbar gets hidden in `IE` and `EDGE` browsers is resolved.

## 17.1.41 (2019-04-16)

### Grid

#### Bug Fixes

- `args.cancel` support for grid `rowDeselecting` event with checkbox selection is provided.
- `rowDeselected` event is misbehaved when performing the grid action with `persistSelection` property is resolved.
- Unable to provide custom format for aggregate columns using tag helpers is resolved.
- When the field for column is ""(not defined) then the column displays as "[object][object]" is resolved.
- Searching is not working when dynamically changing the toolbar tooltip text is resolved.
- Checkbox options in filter dialog misaligns in touch mode is resolved.

## 17.1.40 (2019-04-09)

### Grid

#### Bug Fixes

- Column template is removed after calling `getPersistData` method is resolved.
- Script error is resolved when using `setRowData` method in `cellSave` event.
- Grid content background in `material-dark` theme is resolved.
- Group caption is displaying `[object][object]` instead of 0 with `foreignkey` column is resolved.
- Missing of records after sorting in virtual scrolling grid is resolved.
- Script error when opening column menu in column virtualised grid is resolved.
- Grid menu filter does not filter the null date values properly is resolved.
- Validation message is hidden when editing the last row of the current page is resolved.
- Validation message is misplaced while using horizontal scrollbar in grid is resolved.
- `actionComplete` event is not invoked after delete all records is resolved.
- `GetRowIndexes` method returns incorrect index when invoked after filtering records in virtualisation grid.
- A support to get row index from row data is provided.
- Unable to delete record using command delete button when `showConfirmDialog` set to `false` is resolved.

## 17.1.38 (2019-03-29)

### Grid

#### Bug Fixes

- Excluded template from `pageSettings` while get persist data in Grid.
- Edit cells are focused when enabling `multiselect` dropdown with checkbox mode.
- Grid `validationRules` works fine while using min and max value for `NumericTextBox`.
- Script error is resolved when opening `contextmenu` in stacked header.
- In `FilterBar` mode, the specified format is applied to date column value while performing initial filtering.
- Grid exports current view columns alone when column `virtualization` is enabled.
- Filtering is working properly after Search toolbar action.
- Additional parameters should be send in `params` property is achieved.
- `StringLength` attribute converts the HTML value as `lowercase` instead of `camelCase` issue is resolved.
- Grid Locale is not applied for edit Form components is resolved.
- Complex data fields are updated in `OdataV4` adaptor.
- Provided support for defining custom `url` in Normal editing for `Odata` adaptor.
- Script error is resolved while opening the menu filter in empty grid.
- Underscore with field is consider as complex data while save the changes in dialog template editing is resolved.
- Script error is resolved in excel Filter for date columns when data source for date column is in string.
- Programmatic update and delete operations are working properly with batch mode.
- Checkbox is aligned properly when a row with check box column with `textAlign` property is edited.
- Row misalignment occurs when having checkbox column as frozen is resolved.
- Searching misbehaves in a `URLAdaptor` bind in Grid while having Checkbox column is resolved.
- Column menu icon is misaligned when changing default `rowHeight` of the grid is resolved.
- UI issue with Excel Filter Dialog in Bootstrap theme is resolved.
- Search query in `WebAPI` request is not proper when have a CheckBox column in Grid is resolved.
- Row height is applied in Grid with null values in first column.
- Provided Internal events support for cancelling the batch editing and after the form render.
- Row deselection is not working properly while using `persistSelection` property is resolved.
- Using checkbox property in `IEditCell` type throws compilation error is resolved.
- Grid Excel filter sub menu misalignment in IE11 browser is resolved.
- Pager is not refreshed with `currentPage` value in `pageSettings` while initial rendering is resolved.
- Grid shows incorrect result while getting selected records with `selectAll` in `rowSelected` event is resolved.
- `Childgrid` with empty record is not showing No records to display while excel exporting is resolved.

#### New Features

- Provided `virtualization` support while expand or collapse the grouped records when `virtualization` is enabled.
- Provided support to edit next row cell while pressing the tab key in Batch edit mode.
- Provided support to add new row in bottom while pressing the tab key in last cell of last row in current page.
- Provided support to trigger `actionComplete` event after calling `expandAll` and `collapseAll` methods.
- Provided support to implement 'Angular deep watch pipe'.
- Add and Delete operation changes are updated in the grid UI when `virtualization` is used.
- Provided internal event to change the edit form elements for tree grid team.
- Provided Error handler support in Grid Component.

## 17.1.1-beta (2019-01-29)

### Grid

#### New Features

- Provided support for toggle selection on row and cells.
- Provided reorder position support for the target field index.
- Provided support to restrict the searching in column level
- Provided set model support for `selectedRowIndex` property.
- Provided add `params` support to customize the controls which are used in Menu filter.

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
