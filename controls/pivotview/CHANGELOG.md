# Changelog

## [Unreleased]

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