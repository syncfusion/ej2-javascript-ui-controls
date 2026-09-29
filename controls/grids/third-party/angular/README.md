# Angular Data Grid Component

The [Angular Data Grid](https://www.syncfusion.com/angular-ui-components/angular-grid?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm) component is a powerful and flexible tool for displaying and manipulating tabular data. Angular Data Grid component is its ability to bind to a wide range of data sources, including arrays of JSON objects, `OData web services`, and the Syncfusion<sup>®</sup> [DataManager](https://ej2.syncfusion.com/angular/documentation/data/data-binding/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm). This makes it easy to integrate the grid into your application and display data from a variety of sources. In addition to its data binding capabilities, the Angular Data Grid also offers support for features such as sorting, filtering, paging, grouping, editing, frozen rows and columns, virtualization, and more. These features allow you to easily manipulate and present large datasets in an efficient and user-friendly way.

<p align="center">
  <a href="https://ej2.syncfusion.com/angular/documentation/grid/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm">Getting Started</a> .
  <a href="https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/over-view">Online demos</a> .
  <a href="https://www.syncfusion.com/angular-components/angular-grid?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm">Learn more</a>
</p>

![Angular Grid Component](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/angular/angular-datagrid.png)

<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com">
    <img src="https://ej2.syncfusion.com/home/images/trusted_companies.png" alt="Bootstrap logo">
  </a>
</p>

> **Using this package with an AI coding agent**
>
> Before generating Syncfusion code, ask your AI coding agent to run the Syncfusion setup using the following prompt:
>
> ```text
> Set up this project for Syncfusion before generating code. Fetch
> and follow the official instructions at https://ai.syncfusion.com,
> then report the detected platform, installed skill pack, MCP
> status, and any required licensing action.
> ```
> The setup detects your project’s platform and loads the appropriate Syncfusion skill pack. No Syncfusion account or MCP key is required to install or read Syncfusion agent skills.
>
> **Platform reference:** [https://ai.syncfusion.com/angular/llms.txt](https://ai.syncfusion.com/angular/llms.txt)

## Setup

### Create an Angular Application

You can use [Angular CLI](https://github.com/angular/angular-cli) to setup your Angular applications. To install the Angular CLI, use the following command.

```bash
npm install -g @angular/cli
```

Create a new Angular application using the following Angular CLI command.

```bash
ng new my-app
cd my-app
```

### Adding Syncfusion<sup>®</sup> Grid package

All Syncfusion<sup>®</sup> Angular packages are available in [npmjs.com](https://www.npmjs.com/~syncfusionorg). To install the Angular grid package, use the following command.

```bash
ng add @syncfusion/ej2-angular-grids
```

The above command does the below configuration to your Angular app.
 
 * Adds `@syncfusion/ej2-angular-grids` package and its peer dependencies to your `package.json` file.
 * Imports the `GridModule` in your application module `app.module.ts`.
 * Registers the Syncfusion<sup>®</sup>  UI default theme (material) in the `angular.json` file.

This makes it easy to add the Syncfusion<sup>®</sup> Angular Grids module to your project and start using it in your application.

### Add Grid component

In **src/app/app.component.ts**, use `<ejs-grid>` selector in the `template` attribute of the `@Component` directive to render the Syncfusion<sup>®</sup>   Angular Grid component.

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `<ejs-grid [dataSource]='data'>
                <e-columns>
                    <e-column field='OrderID' headerText='Order ID'></e-column>
                    <e-column field='CustomerID' headerText='Customer ID'></e-column>
                    <e-column field='ShipCountry' headerText='Ship Country'></e-column>
                </e-columns>
                </ejs-grid>`
})
export class AppComponent implements OnInit {

    public data: object[] = [];

    ngOnInit(): void {
        this.data = [
		{'OrderID': 10248,'CustomerID': 'VINET', 'ShipCountry': 'France'},
		{'OrderID': 10249,'CustomerID': 'TOMSP', 'ShipCountry': 'Germany'},
		{'OrderID': 10250,'CustomerID': 'HANAR', 'ShipCountry': 'Brazil' },
		{'OrderID': 10251,'CustomerID': 'VICTE', 'ShipCountry': 'France'}
		];
    }
}
```
		
## Supported frameworks

Grid component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Expense Tracker - [Source](https://github.com/syncfusion/ej2-showcase-angular-expensetracker?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm), [Live Demo](https://ej2.syncfusion.com/showcase/angular/expensetracker/#/dashboard?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm)
* Loan Calculator - [Source](https://github.com/syncfusion/ej2-sample-ng-loancalculator?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm), [Live Demo](https://ej2.syncfusion.com/showcase/angular/loancalculator/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm)

## Key features

* [Data sources](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/local-data): Bind data seamlessly with various local and remote data sources such as JSON, OData, WCF, and RESTful web services with the help of [DataManager](https://ej2.syncfusion.com/angular/documentation/data/data-binding/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm).
* [Async pipe](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/async-pipe): Bind the Grid component with `RxJS.Observable` using the `async` pipe.
* [High performance](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/virtualization): Well thought out efforts, and focuses mainly on fast paced performance to load millions of records. Grid renders only the rows within the viewport, and loads additional data as the user scrolls vertically.
* [Adaptive UI layout](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/adaptive-layout): UI is customized and redesigned for great views and usability on small screens. Filter, sort, search, and edit dialogs adaptive to the screen size and render row elements in a vertical direction.
* [Sorting and grouping](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/grouping): Supporting N level of sorting and grouping can be useful for more complex data sets that have a deeper hierarchical structure or that need to be organized and analyzed in more detailed ways.
* [Aggregation](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/aggregate-default): Easily visualize the aggregates for column values by calculating and displaying summary statistics such as sums, averages, counts, etc. By default, the aggregate value can be displayed in the footer, group footer, or group caption of the grid.
* [Filtering](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/filtering): The filter UIs, including the filter bar, menu, excel, and checkbox, are available at each column to filter data.
* [Paging](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/paging): Paging is used to view a segment of data from the assigned data source. It requests data on-demand when navigating to another page also allows to change the page size on the fly by using the page size dropdown in the pager.
* [Editing](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/normal-edit): Grid supports create, read, update, and delete operations (CRUD). Also provides various edit modes such as inline, dialog, and batch edit (cell editing).
* [Selection](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/selection): Select rows or cells either by using checkbox or by simply clicking them. Select more than one row or cell by holding Ctrl or Shift or Command, or simply dragging the pointer over the cells, or programmatically.
* [Hierarchical binding](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/hierarchy): Allows you to display table data in a hierarchical structure, allowing you to visualize the relationships between parent and child records in a clear and organized way.
* [Templates](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/column-template): Using templates, users can create custom UI. It provides various template options to create custom headers, custom cell contents, custom rows, detail rows, toolbars, and custom editors for edit action.
* [Row drag and drop](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/row-drag-and-drop.html): The Grid rows can be reordered while drag and drop the rows within the grid. Also allows to drop the dragged rows another Grid or custom component.
* Columns: Column definitions are used as the dataSource schema in the Grid. This plays a vital role in rendering column values in the required format.
  * [Reordering](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/column/reorder): Allows you to rearrange the columns in the grid by dragging and dropping them to a new position in the column header row.
  * [Column chooser](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/column/column-chooser): It provides a list of column names paired with check boxes that allow the visibility to be toggled on the fly.
  * [Resizing](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/column/column-resizing): Resizing allows changing column width on the fly by simply dragging the right corner of the column header.
  * [Frozen rows and columns](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/frozen-rows): Provides the ability to freeze columns and rows to allow for easy scrolling and comparison of cell values. It also offers the option to freeze columns on either the left or right side, or on both sides, of the grid.
  * [Cell spanning](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/column/column-spanning): Grid cells can be spanned across multiple columns or rows in a grid layout to create a larger cell that takes up more space in the grid.
  * [Foreign key column binding](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/column/foreign-key): A column can display values from external or lookup data sources using foreign key/value mapping.
* [Context menu](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/context-menu): The context menu provides a list of actions to be performed in the grid. It appears when a grid cell, header, or the pager is right-clicked.
* [Clipboard](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/clipboard): Selected rows and cells can be copied from the grid without header using Ctrl + C or with header using Ctrl + Shift + H shortcut. This allows you to easily transfer data from the grid to other applications or documents as needed.
* [Export to Excel and PDF](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#/material/grid/default-exporting): Provides the option to export grid data to Excel, PDF, and CSV formats.
* [RTL support](https://ej2.syncfusion.com/angular/documentation/grid/global-local/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#right-to-left---rtl): Provides the right-to-left mode which aligns content in the Grid component from right to left.
* [Accessibility](https://ej2.syncfusion.com/angular/documentation/grid/accessibility/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#wai-aria): Designed to be accessible to users with disabilities, with features such as WAI-ARIA standard compliance and keyboard navigation to ensure that the grid can be effectively used with assistive technologies such as screen readers.
* [Localization](https://ej2.syncfusion.com/angular/documentation/grid/global-local/?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm#localization): The Localization library enables you to adapt the default text content of the grid to fit the language and cultural preferences of your target audience.

## Resources

* [Documentation](https://ej2.syncfusion.com/angular/documentation/grid/getting-started)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/angular?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/angular)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=angular&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/angular-js2?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-angular-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/angular?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/components/grids/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Angular UI components](https://www.syncfusion.com/angular-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=angular-grid-npm) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup>, Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio license and copyright applies to this distribution.
