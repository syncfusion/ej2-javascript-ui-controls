# Changelog

## [Unreleased]

### Pivot Table

#### Bug Fixes

- `#F168308` - The pivot table can now be rendered properly with custom number formats.
- `#339705` - When the virtualization feature is used, the pivot table can now be rendered properly without an unnecessary horizontal scrollbar when the content does not require it.
- `#341987` - The pivot table can now be rendered properly while perform filtering with OLAP data source.
- `#342221` - The pivot table can now be rendered properly while applying date grouing through UI.
- The column headers are now displayed properly while perform resizing.
- `#342221` - The pivot table can now be rendered properly while perform member filtering with an empty header.

#### New Features

- `#300095` - Provided support to display measures at any desired positions in the column or row axis for relational data sources.

## 19.2.56 (2021-08-17)

### Pivot Table

#### New Features

- `#284641`,`#326945`,`#327746`,`#329355` - Through grid settings event, the pivot table's columns can now fit the widest cell’s content without wrapping.

## 19.2.55 (2021-08-11)

### Pivot Table

#### Bug Fixes

- `#I337487` - Now the field's caption can be changed dynamically using the value field settings dialog.
- `#F167449` - Now the fields panel has been refreshed properly with toolbar UI.

## 19.2.51 (2021-08-03)

### Pivot Table

#### Bug Fixes

- `#F166428` - Issue while resizing column with virtualization in the pivot table has been resolved.
- `#336591`,`#337082` - When using the virtualization feature, the pivot table columns are now properly displayed when scrolling horizontally.
- `#337082` - The pivot table is now properly displayed when scrolling horizontally while filtering is applied when using the virtualization feature.

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

- The drill through dialog now be showed the correct raw items when we filtering applied in fields in filter axis.
- The drill through dialog can now be openend when we bind measures in row axis.

## 18.2.54 (2020-08-18)

### Pivot Table

#### Bug Fixes

- Now drill-through dialog can be opened when the measures are placed in row axis.

#### New Features

- `#260352`,`#276917`,`#280407`,`#281842` - Provided an option to do the aggregation in server side and the rendering part alone will be done in client side. It is to improve the performance while binding huge size of data from remote server.
- `#279727` - Provided support to sort the alphanumeric field members.
- `#F155279` - Provided an option to restrict the drill-through dialog to display.
- `#281462`,`#282526`,`#287070` - Provided an option to edit the aggregated cells directly (inline editing) without opening editing dialog.
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