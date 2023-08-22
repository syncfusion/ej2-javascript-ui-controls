# Changelog

## [Unreleased]

## 22.2.10 (2023-08-22)

### Pivot Table

#### Bug fixes

- The issue with server side rendering in next.js has been resolved.

## 22.2.9 (2023-08-15)

### Pivot Table

#### Bug fixes

- `I489341` - The toolbar menu items will now be properly displayed in the pivot table with the material dark theme.

## 22.2.8 (2023-08-08)

### Pivot Table

#### Bug fixes

- `I485463` - The pivot table can now be properly rendered when sorting is applied with virtualization.
- `I486436` - The pivot chart can now be properly rendered with remote data binding.
- `F183726` - The "multiLevelLabelRender" event will now work properly in the Angular pivot table.

## 22.2.7 (2023-08-02)

### Pivot Table

#### Bug fixes

- `I459099` - The pivot table can now be rendered properly with the reordering feature.

## 22.2.5 (2023-07-27)

### Pivot Table

#### Bug fixes

- `I471218` - The value sort icon in the pivot table is now properly positioned with larger column text.
- `F183271` - When defer layout update is enabled, the pivot table now renders properly with the pivot chart.
- `I463929` - When enabling virtualization dynamically at runtime, the pivot table will now render properly.

#### Features

- `I398184` - Provided support to customize the column width when exporting the pivot table to a PDF document.

## 22.1.39 (2023-07-18)

### Pivot Table

#### Bug fixes

- `#F183090` - Columns can now be hidden specifically with an OLAP data source.

## 22.1.36 (2023-06-28)

### Pivot Table

#### Bug fixes

- `#I473176` - The issue with the spinner not being properly hidden on the pivot table when the drillthrough popup was closed with server-side engine has now been resolved.
- `#I461804` - When we bind fields from the same hierarchy, drill down/up will now work properly in the pivot table with an OLAP data.

## 22.1.34 (2023-06-21)

### Pivot Table

#### Bug fixes

- `#I467010` - When using the server-side engine support, the pivot table now works properly when grouping is applied dynamically.

#### New features

- `I456010` - In addition to server-side engine support, the pivot table data can be easily exported to Excel or CSV files via server-side export.

### Pivot Table

#### New Features

- `#F165214` - Provided paging support in server side engine that allows to break and display large amounts of data page by page.
- Provided the role option that allows access to restricted cube information such as measures, dimensions, hierarchy, and more when a SSAS OLAP cube is bound to the pivot table.

#### Breaking Changes

- The property type `PivotValues` has been changed from `IPivotValues` to `IAxisSet[][]`.

| Property Name | Description | Previous Type | Current Type |
|---|---|---|---|
| `pivotValues` | It holds the collection of cell information that has been populated from the engine on the basis of the given pivot report to render the component as table and chart. | `IPivotValues` | `IAxisSet[][]` |

## 20.4.38 (2022-12-21)

### Pivot Table

#### Bug Fixes

- `#I423050` - Filter state will now be properly maintained in the member editor.
- `#I420253` - When virtual scrolling is enabled, the pivot table will now scroll properly.
- Number formatting is now applied properly to row and column headers in the pivot table.

#### New Features

- `#I347303`, `#I400764`, `#F172939` - Provided support for displaying row and column sub-totals at the top or bottom of the header group in the pivot table.
- `#I310709`, `#I346859` - Provided support to display pivot chart's series for multiple measures on a single y-axis.
- `#I398184` - The pivot table now supports customising the size of PDF document while exporting.
- `#I305545` - The pivot table now allows you to export both the table and the chart to a single PDF document.

#### Breaking Changes

- The `chartSettings.showMemberSeries` property is deprecated and will no longer to be used. Use `chartSettings.showPointColorByMembers` to achieve the same.

Previous | Now |
 ---  | ---  |
`showMemberSeries` | `showPointColorByMembers`

- The `chartExport` method parameters for the pivot table have now been changed.

**Previous**

Parameter | Type | Description |
 ---  | ---  | --- |
type | `ExportType` | Defines the export type.
fileName | string | Defines file name of export document.
orientation | `PdfPageOrientation` | Defines the page orientation on pdf export(0 for Portrait mode, 1 for Landscape mode).
width | number | Defines width of the export document.
height | number | Defines width of the export document.

**Now**

Parameter | Type | Description |
 ---  | ---  | --- |
type | `ExportType` | Defines the export type.
`pdfExportProperties` | `PdfExportProperties` | Allows to define the chart's export properties such as file name, orientation, width and height.
`isMultipleExport` | boolean | Allows to export multiple tables and charts into a single PDF document.
`pdfDoc` | Object | Allows the export of an external PDF document along with current PDF document.
`isBlob` | boolean | Allows the PDF document to be saved as blob data.

## 20.3.59 (2022-11-29)

### Pivot Table

#### Bug Fixes

- `#I405590` - The pivot table will now properly refresh while performing value sorting with the grouping bar and autofit enabled.

- `#I420612` - The pivot table will now be rendered properly while switching between reports in the toolbar.

- `#F420612` - The pivot table's alphanumeric sorting will now works properly.

## 20.3.57 (2022-11-15)

### Pivot Table

#### Bug Fixes

- `#I405590` - The pivot table will now properly refreshed while performing value sorting with autofit enabled.

#### New Features

- `#I395302` - When using a server-side engine, the aggregated values of the pivot table will now be customized via the controller.

## 20.3.50 (2022-10-18)

### Pivot Table

#### Bug Fixes

- The `drillthrough` feature now works properly with alphanumeric data.

## 20.3.49 (2022-10-11)

### Pivot Table

#### Bug Fixes

- `#I408669` - Number formatting is now applied properly to row and column headers in the pivot table.
- `#I405681` - Pivot table cell values are now properly exported as PDF document based on the text align property.

## 20.3.47 (2022-09-29)

### Pivot Table

#### Bug Fixes

- `#I395797` - Text wrap is now properly applied in the pivot table.
- `#I400397` - When using server-side engine, row headers are now displayed correctly based on their level in the pivot table.
- `#I395797` - The grand totals position in the pivot table now works properly when using server-side engine.
- `#I405131` - The tooltip content is now properly displayed in the pivot table.
- `#I397110` - The pivot table will now properly export to Excel format even if it contains hidden columns.
- `#I405326` - The value sort icon is now properly displayed in the pivot table.

#### New Features

- `#I311235` - The pivot table now exports to PDF/CSV as a blob object with virtual scrolling enabled.
- `#I311235` - With a relational datasource, field list treeview can now be displayed in a hierarchical manner.
- `#I281131`, `#I351494`, `#F174212` - Provided paging support that allows to break and display large amounts of data page by page, improving the overall rendering performance of the pivot table.
- `#I369101` - When multiple axes are enabled, the pivot chart series can now be displayed based on members in all chart areas.

## 20.2.43 (2022-08-08)

### Pivot Table

#### Bug Fixes

- `#I390649` - When virtual scrolling is enabled, the pivot table now properly refreshed while performing value sorting.

#### New Features

- `#I364830` - Improved server-side engine performance. As a result, pivot table can now render up to 3 million records without any issues.
- `#I382580` - The calculated field UI now has a "Format" dropdown option for relational data source.

## 20.2.39 (2022-07-19)

### Pivot Table

#### Bug Fixes

- `#I389665` - The pivot table can now be rendered properly while applying date grouping.
- `#I389889` - The class names in the pivot table are properly updated for the sub-total columns.

## 20.2.38 (2022-07-12)

### Pivot Table

#### Bug Fixes

- The selection is now properly working when using the selection mode of the pivot table.
- The engine population events are now properly triggered during virtual scrolling.

## 20.2.36 (2022-06-30)

### Pivot Table

#### Bug Fixes

- `#I387410` - The pivot table with OLAP cube can now render properly with calculated fields when virtual scrolling is enabled.

#### New Features

- Provided support to search for a specific field in the field list UI.

## 20.1.61 (2022-06-21)

### Pivot Table

#### Bug Fixes

- `#I382188` - When there is only one record, inline editing for value fields with advanced aggregate types now works properly.

## 20.1.58 (2022-05-31)

### Pivot Table

#### Bug Fixes

- `#I380533` - When using value fields with advanced aggregate options, the pivot table can now be properly exported to Excel and CSV formats.

## 20.1.57 (2022-05-24)

### Pivot Table

#### Bug Fixes

- `#I378816` - When the defer layout update option is enabled, dataBound event is now restricted while clicking cancel option in the popup field list UI.
- `#F174968` - When virtual scrolling is enabled, the pivot table can now be rendered properly while perform member filtering.
- The pivot table's column selection is now working properly.

## 20.1.56 (2022-05-17)

### Pivot Table

#### Bug Fixes

- The pivot table can now be sorted properly with date type headers.

#### New Features

- The pivot table now has support for adding custom classes via 'cssClass' property.

## 20.1.55 (2022-05-12)

### Pivot Table

#### Bug Fixes

- `#I363090` - The previous cell selection can now be maintained while restricting the current selection in the pivot table's column axis using the cell selection event.
- `#I373754` - The pivot table can now be exported properly to Excel and CSV formats while using the virtual scrolling feature, with sub-totals hidden.
- `#I374945` - The pivot chart will now refresh properly with the specified height when switching from adaptive to desktop mode.

#### New Features

- `#F174296` - Members of a specific field are now sorted based on user-defined order in the Pivot Table's row and column axes.

## 20.1.48 (2022-04-12)

### Pivot Table

#### Bug fixes

- In the OLAP field list UI, calculated fields are now properly displayed.
- The pivot table now exports properly to excel format with string type values when virtual scrolling is enabled.

#### Features

- `#FB33029` - The calculated field can now be created without formatting by using the "None" option in the OLAP calculated field UI.

## 20.1.47 (2022-04-04)

### Pivot Table

#### Bug Fixes

- `#I366940` - When the defer layout update option is enabled, the field list UI will now properly refresh while drag and drop measures.
- `#I367463` - When virtual scrolling is enabled, the pivot table now properly refresh based on the specified height.
- In Angular, grouping will now work properly with the static field list.
- `#I370021` - While resizing, the pivot chart is now properly refreshed.

#### New Features

- Provided support to expand all members (aka, headers) in a specific field in the Pivot Table's row and column axes.
- Provided built-in option in toolbar UI, grand totals will now display either at the first or last position in the Pivot Table's row and column axes.

## 19.4.55 (2022-03-08)

### Pivot Table

#### Bug Fixes

- When virtual scrolling is enabled, the pivot table now properly refresh based on the specified height.

## 19.4.54 (2022-03-01)

### Pivot Table

#### Bug Fixes

- When the defer layout update option is enabled, the field list UI will now properly refresh while performing checkbox selection.

## 19.4.53 (2022-02-22)

### Pivot Table

#### Bug Fixes

- When changing the report dynamically using the toolbar UI options, the Pivot Chart is now properly displayed.
- `#I366940` - When defer layout update is enabled, measures are properly added to the field list UI.

## 19.4.52 (2022-02-15)

### Pivot Table

#### Bug Fixes

- Events to customize cell values using PivotEngine export are now working properly in Angular.

## 19.4.50 (2022-02-08)

### Pivot Table

#### Bug Fixes

- `#I359726`, `#I354750` - When using the virtual scrolling feature, the pivot table can now be exported properly to Excel and CSV formats.
- Even the value fields starts with the same unique name, the Pivot Table values are now properly displayed.
- `#I363972` - With the toolbar UI, the Pivot Chart is now refreshed properly while performing checkbox selection in the chart menu.

## 19.4.47 (2022-01-25)

### Pivot Table

#### Bug Fixes

- `#I362895` - The field list UI will now be refreshed properly when dragging a field using the `fieldDrop` event with defer layout update.

## 19.4.43 (2022-01-18)

### Pivot Table

#### Bug Fixes

- `#I346790` - The Pivot Table is now properly refreshed with virtual scrolling when using touch.

#### New Features

- `#I354750` - Provided events support to customize cell values in PivotEngine export.

## 19.4.42 (2022-01-11)

### Pivot Table

#### Bug Fixes

- `#I359726` - When exporting the Pivot Table to PDF format, styles can now be properly applied to the header and footer.
- `#I359726` - When exporting the Pivot Table to Excel format, the headers are now properly shown.

## 19.4.41 (2022-01-04)

### Pivot Table

#### Bug Fixes

- `#I340908` - In Firefox browser, the Pivot Table is now refreshed properly with virtual scrolling.

## 19.4.40 (2021-12-28)

### Pivot Table

#### Bug Fixes

- The Pivot Chart is now properly shown with the default value of the "zoomFactor" property.

## 19.4.38 (2021-12-17)

### Pivot Table

#### Bug Fixes

- `#I349396` - When the virtual scrolling feature is enabled, as well as when members are filtered, the Pivot Table can now be rendered properly.
- `#I340539` - In Angular, the bundle size for Pivot Table has been reduced.
- `#I347116` - With the toolbar UI, the Pivot Chart is now refreshed properly.
- `#I347116` - With the Pivot Chart's default settings, its labels are displayed properly.
- `#I348183` - While performing value sorting with a single measure, the Pivot Table will now be rendered properly.
- `#I348952` - In the pivot table, the tooltip for string fields is now properly displayed.
- `#F170928` - When using the virtual scrolling feature, the calculated field buttons with edit option inside grouping bar and field list layout are now properly displayed.
- `#F170654` - The caption in the grouping field buttons within the grouping bar and field list layout is now displayed properly.

#### New Features

- `#I295658`, `#I320675`, `#I329355`, `#F158271`, `#F158475` - Provided support to display summarized totals (grand totals) either at the first or last position in the Pivot Table's row and column axes.
- `#I327744` - Provided support to align text for specific column headers.
- `#F159996` - Provided action begin and complete events to identify UI actions in the Pivot Table such as drill down/up, value sorting, grouping bar and field list UI actions, and CRUD operations. If the UI actions do not achieve the desired result, the action failure event is triggered.

## 19.3.46 (2021-10-19)

### Pivot Table

#### Bug Fixes

- `#I345673` - Even the value fields starts with the same caption, the Pivot Table values are now properly displayed.

### Pivot Table

#### Bug Fixes

- `#I345297` - While clicking the value sorting icon, the cell click event is now properly triggered.
- `#I342886` - The "Calculated Field" feature in the pivot table now works properly in Angular production mode.

## 19.3.44 (2021-10-05)

### Pivot Table

#### Bug Fixes

- `#F168308` - The pivot table can now be rendered properly with custom number formats.
- `#I339705` - When the virtual scrolling feature is used, the pivot table can now be rendered properly without an unnecessary horizontal scrollbar when the content does not require it.
- `#I341987` - The pivot table can now be rendered properly while perform filtering with OLAP data source.
- `#I342221` - The pivot table can now be rendered properly while applying date grouping through UI.
- The column headers are now displayed properly while perform resizing.
- `#I342221` - The pivot table can now be rendered properly while perform member filtering with an empty header.

#### New Features

- `#I300095` - Provided support to display measures at any desired positions in the column or row axis for relational data sources.

## 19.2.56 (2021-08-17)

### Pivot Table

#### New Features

- `#284641`,`#326945`,`#327746`,`#329355` - Through grid settings event, the pivot table's columns can now fit the widest cell’s content without wrapping.

## 19.2.55 (2021-08-11)

### Pivot Table

#### Bug Fixes

- `#I337487` - Now the field's caption can be changed dynamically using the value field settings pop-up.
- `#F167449` - Now the fields panel has been refreshed properly with toolbar UI.

## 19.2.51 (2021-08-03)

### Pivot Table

#### Bug Fixes

- `#F166428` - Issue while resizing column with virtual scrolling in the pivot table has been resolved.
- `#336591`,`#337082` - When using the virtual scrolling feature, the pivot table columns are now properly displayed when scrolling horizontally.
- `#337082` - The pivot table is now properly displayed when scrolling horizontally while filtering is applied when using the virtual scrolling feature.

## 19.2.49 (2021-07-27)

### Pivot Table

#### Bug Fixes

- `#F167209` - The script error caused by box selection when the mouse is released over a pivot table cell has been resolved.
- `#331835` - The issue with calculated fields values in drill through retrieving inconsistent raw data has been resolved.
- The pivot chart can now be rendered properly with Blank headers in row fields.
- The pivot table can now be exported properly with zero values to excel file.

## 19.2.48 (2021-07-20)

### Pivot Table

#### Bug Fixes

- `#327131` - Now the number format issue for empty cells in excel exporting has been fixed.

## 19.2.46 (2021-07-06)

### Pivot Table

#### Bug Fixes

- Border alignment issue in "Grouping Bar" UI has been fixed.

## 18.4.30 (2020-12-17)

### Pivot Table

#### Bug Fixes

- `#300162` - The pivot chart now works properly with height as a percentage.

## 18.2.56 (2020-09-01)

### Pivot Table

#### Bug Fixes

- `#289077` - Horizontal scrolling issue raised in the latest version of Firefox has been fixed.

## 18.2.55 (2020-08-25)

### Pivot Table

#### Bug Fixes

- The drill through pop-up now be showed the correct raw items when we filtering applied in fields in filter axis.
- The drill through pop-up can now be open when we bind measures in row axis.

## 18.2.54 (2020-08-18)

### Pivot Table

#### Bug Fixes

- Now drill-through pop-up can be open when the measures are placed in row axis.

#### New Features

- `#260352`,`#276917`,`#280407`,`#281842` - Provided an option to do the aggregation in server side and the rendering part alone will be done in client side. It is to improve the performance while binding huge size of data from remote server.
- `#279727` - Provided support to sort the alphanumeric field members.
- `#F155279` - Provided an option to restrict the drill-through pop-up to display.
- `#281462`,`#282526`,`#287070` - Provided an option to edit the aggregated cells directly (inline editing) without opening editing pop-up.
- `#283107` - Provided template support in toolbar panel to create custom toolbar option.
- `#284800` - Introduced an event to get the edited raw data information after the editing operation.

## 18.2.44 (2020-07-07)

### Pivot Table

#### New Features

- `#233316`,`#234648`,`#247163` - The pivot chart in the Pivot Table now has these chart types: pie, doughnut, pyramid, and funnel.
- In addition to JSON, the pivot table now supports CSV data sources, as well.

## 18.1.44 (2020-04-14)

### Pivot Table

#### Bug Fixes

- `#266106` - Improved the data refresh on virtual scrolling.

## 18.1.36-beta (2020-03-19)

### Pivot Table

#### Breaking Changes

The appearance of the pivot table component has been improved.

#### New Features

- `#259812` - Provision has been provided to display only the required aggregation types in their context menu.
- `#262927` - Now, the drill through and editing feature can be worked in pivot chart by clicking its series.
- `#263612` - Authentication option provided to access the OLAP Cube while connecting it in a pivot table.
- `#151883` - Additional parameters are included in the cell template feature to distinguish each cells.
- Now, you can customize the each field buttons (show and hide the icons, restrict drag and drop operations) available in grouping bar and field list separately.
- Provision provided to customize the tooltip for both pivot table and pivot chart views.
- Formatting option included in the calculated field pop-up to format the calculated fields dynamically.
- Provision provided to display only the required chart types in its context menu available in toolbar panel.
- An option included in the chart types context menu to change the multiple axes option dynamically.
- An option included in the member editor to sort its members in a desired order.
- Provision provided to export the complete page when virtual scroll option is enabled.

## 17.4.39 (2019-12-17)

### Pivot Table

#### Bug Fixes

- `#254586` - The conditional formatting will no longer be applied in empty cells.
- The summarization text `of` in value buttons inside grouping bar and field list layout can be localized now.

#### New Features

- `#252636` - Provision provided to disable the scrollbars in pivot chart.
- `#250072` - Provision provided to group and separate the grouped headers through UI.

## 17.3.26 (2019-11-05)

### Pivot Table

#### Bug Fixes

- `#251642` – Now, the defer layout update option can be enabled or disabled dynamically through field list UI.
- `#251558` – Now, the pivot chart draws with the percent of height value.

#### New Features

- `#248131` – Provided the conditional expression support to create calculated field.
- `#251642` – The performance of virtual scrolling while adding or removing fields and moving fields to any axis is improved.

## 17.3.9-beta (2019-09-20)

### Pivot Table

#### Bug Fixes

- #244842 – Field list icon will be now placed inside the pivot table when field list option isn't included in toolbar.
- The last column of the pivot table can be displayed in Excel exported page properly.

#### New Features

- #245423 – Provision provided to persist and reload the pivot report.
- Provided SSAS OLAP data source support.

## 17.2.28-beta (2019-06-27)

### Pivot Table

#### Breaking Changes

- The `dataSource` and `dataSource.data` properties has now been renamed to `dataSourceSettings` and `dataSourceSettings.dataSource` respectively.

#### New Features

- #229377 – The pivot chart which is bound with pivot table allows the user to drill down and drill up now individually.
- #144382 – Unnecessary scroll bars have been removed from pivot table component.

#### Bug Fixes

- #144352 – The fields can be added dynamically for Pivot Chart control.

## 17.1.47 (2019-05-14)

### Pivot Table

#### Bug Fixes

- #232925 - Grouping bar feature is now working fine with the combination of toolbar and pivot chart.

#### New Features

- #230489 – You can drill the pivot table headers based on the position.

## 17.1.38 (2019-03-29)

### Pivot Table

#### Bug Fixes

- Drill-down works properly for date formatted headers.

#### New Features

- Users can access grid functionalities in the drill-through pop-up.
- Option to always show the value header even with single value binding.
- Row header repeats on each page of the PDF document when exporting.
- Users can display the value zero as zero and empty cells with a custom value.
- Charts can be rendered against pivot table data independently, and users can modify their report dynamically using the field list.
- Toolbar support is provided to the pivot table, allowing users easy access to frequently used features.
- A grouping option is available for date and numbers fields.
- Users can customize or add custom templates to the Pivot Table cells.
- Cell selection allows users to select cells and access the selected cell information through the cell selection event.

## 17.1.32-beta (2019-03-13)

### Pivot Table

#### Bug Fixes

- Drill-down works properly for date formatted headers.

#### New Features

- Users can access grid functionalities in the drill-through pop-up.
- Option to always show the value header even with single value binding.
- Row header repeats on each page of the PDF document when exporting.
- Users can display the value zero as zero and empty cells with a custom value.
- Charts can be rendered against pivot table data independently, and users can modify their report dynamically using the field list.
- Toolbar support is provided to the pivot table, allowing users easy access to frequently used features.
- A grouping option is available for date and numbers fields.
- Users can customize or add custom templates to the Pivot Table cells.
- Cell selection allows users to select cells and access the selected cell information through the cell selection event.

## 17.1.1-beta (2019-01-29)

### Pivot Grid

#### New Features

- F141747- Always shows value caption in headers even having single measure.
- Cell selection now allows to select cells as row and column wise.
- Shows the filter state in the fields of filter axis.

## 16.4.42 (2018-12-14)

### Pivot Grid

#### Bug Fixes

- 219623 - Text in the field list tab gets completely displayed in mobile layout.
- 219625 - Scrolling works properly in touch mode when virtual scroll option is enabled.
- 219625 - In mobile device, virtual scrolling sample is loaded properly from the sample browser.
- 219625 - In mobile device, last column cells are displayed properly.

#### New Features

- Raw items in the control can be edited and updated at runtime.
- Provided support to list the raw items for a particular value cell.
- In the filter pop-up, provided support to set the limit the display field values and search option for refining the values from large data.
- Provided hyperlink support to perform any custom operation programmatically.
- Defer update option has been provided to refresh the control on-demand and not during every UI interaction for better performance.
- Provided support to show or hide subtotals and grand totals for rows and columns.
- More aggregation types like – Distinct Count, Product, Running Totals, Percentage of Column Total, Percentage of Parent Column Total, Population Var are added.

## 16.4.40-beta (2018-12-10)

### Pivot Grid

#### Bug Fixes

- 219623 - Text in the field list tab gets completely displayed in mobile layout.
- 219625 - Scrolling works properly in touch mode when virtual scroll option is enabled.
- 219625 - In mobile device, virtual scrolling sample is loaded properly from the sample browser.
- 219625 - In mobile device, last column cells are displayed properly.

#### New Features

- Raw items in the control can be edited and updated at runtime.
- Provided support to list the raw items for a particular value cell.
- In the filter pop-up, provided support to set the limit the display field values and search option for refining the values from large data.
- Provided hyperlink support to perform any custom operation programmatically.
- Defer update option has been provided to refresh the control on-demand and not during every UI interaction for better performance.
- Provided support to show or hide subtotals and grand totals for rows and columns.
- More aggregation types like – Distinct Count, Product, Running Totals, Percentage of Column Total, Percentage of Parent Column Total, Population Var are added.

## 16.3.21 (2018-09-22)

### Pivot Grid

#### New Features

- 208354, 211758 — Value fields can be placed in row axis now.
- **Virtual scrolling** options have been provided to load large amounts of data with high performance.
- **Conditional formatting** support allows users to define conditions and format grid cells’ font, colour etc.
- **Label and value-based filtering** options are provided that work similar to Microsoft Excel.

## 16.3.17 (2018-09-12)

### Pivot Grid

#### New Features

- 208354, 211758 — Value fields can be placed in row axis now.
- **Virtual scrolling** options have been provided to load large amounts of data with high performance.
- **Conditional formatting** support allows users to define conditions and format grid cells’ font, colour etc.
- **Label and value-based filtering** options are provided that work similar to Microsoft Excel.

## 16.2.41 (2018-06-25)

### Pivot Grid

The pivot grid is a multi-dimensional data visualization component built on top of the relational data sources. The pivot report can be managed dynamically at runtime along with other capabilities like aggregation, filtering and sorting (field and value based).

- **Data Sources** - Binds the component with an array of JavaScript objects.
- **Filtering** - Allows user to view only specific/desired records in the component.
- **Sorting** - Both member and value sorting are supported. It’s allows user to order fields and values (column) either in ascending or descending order respectively.
- **Field List & Grouping Bar** - Supports UI interaction at runtime to dynamically change the report along with sorting, filtering and remove options.
- **Aggregation** - Provides built in aggregation types like sum, average, min, max and count.
- **Calculated Field** - Users can add new value field(s) to the report dynamically using this option.
- **Adaptive Rendering** - Adapts with optimal user interfaces for mobile and desktop form-factors, thus helping the user’s application to scale elegantly across all the form-factors without any additional effort.
- **Exporting** - Provides the option to exporting records to Excel, CSV and PDF formats.
