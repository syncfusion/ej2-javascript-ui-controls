# Angular Pivot Table Component

The [Angular Pivot Table](https://www.syncfusion.com/angular-components/angular-pivot-table?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm) is a multi-dimensional data visualization component built on top of relational and OLAP data sources. The pivot report can be managed dynamically at runtime, along with other features such as graphical visualization (Pivot Chart), drill down/up, aggregation, filtering, sorting, grouping, conditional formatting, drill through, editing, hyperlink, and more. The large amounts of data are effectively handled by virtualization or paging support.

<p align="center">
    <a href="https://ej2.syncfusion.com/angular/documentation/pivotview/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm#/bootstrap5/pivot-table/default">Online demos</a> . 
    <a href="https://www.syncfusion.com/angular-components/angular-pivot-table?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm">Learn more</a>
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/angular/angular-pivot-table.png" alt="Angular Pivot Table Component" />
</p>

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

### Add Syncfusion<sup>®</sup> Pivot Table package

All Syncfusion<sup>®</sup> Angular packages are available in [npmjs.com](https://www.npmjs.com/~syncfusionorg). To install the Angular Pivot Table package, use the following command.

```bash
ng add @syncfusion/ej2-angular-pivotview
```

The above command does the below configuration to your Angular app.
 
 * Adds `@syncfusion/ej2-angular-pivotview` package and its peer dependencies to your `package.json` file.
 * Imports the `PivotViewModule` in your application module `app.module.ts`.
 * Registers the Syncfusion<sup>®</sup> UI default theme (material) in the `angular.json` file.

This makes it easy to add the Syncfusion<sup>®</sup> Angular Pivot Table module to your project and start using it in your application.

### Add Pivot Table component

In **src/app/app.component.ts**, use `<ejs-pivotview>` selector in the `template` attribute of the `@Component` directive to render the Syncfusion<sup>®</sup> Angular Pivot Table component.

```typescript
import { Component, OnInit } from '@angular/core';
import { IDataOptions, IDataSet } from '@syncfusion/ej2-angular-pivotview';

@Component({
    selector: 'app-root',
    template: `<ejs-pivotview id='PivotView' height='350' [dataSourceSettings]=dataSourceSettings></ejs-pivotview>`
})
export class AppComponent implements OnInit {

    public pivotData: IDataSet[];
    public dataSourceSettings: IDataOptions;

    ngOnInit(): void {
        this.pivotData = [
            { 'Sold': 31, 'Amount': 52824, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2015', 'Quarter': 'Q1' },
            { 'Sold': 51, 'Amount': 86904, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2015', 'Quarter': 'Q2' },
            { 'Sold': 90, 'Amount': 153360, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2015', 'Quarter': 'Q3' },
            { 'Sold': 25, 'Amount': 42600, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2015', 'Quarter': 'Q4' },
            { 'Sold': 27, 'Amount': 46008, 'Country': 'France', 'Products': 'Mountain Bikes', 'Year': 'FY 2016', 'Quarter': 'Q1' }
        ];

        this.dataSourceSettings = {
            dataSource: this.pivotData,
            expandAll: false,
            columns: [{ name: 'Year', caption: 'Production Year' }, { name: 'Quarter' }],
            values: [{ name: 'Sold', caption: 'Units Sold' }, { name: 'Amount', caption: 'Sold Amount' }],
            rows: [{ name: 'Country' }, { name: 'Products' }]
        };
    }
}
```

## Supported frameworks

Pivot Table component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Expense Tracker - [Source](https://github.com/syncfusion/ej2-showcase-angular-expensetracker?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm), [Live Demo](https://ej2.syncfusion.com/showcase/angular/expensetracker/#/dashboard?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm)
* Loan Calculator - [Source](https://github.com/syncfusion/ej2-sample-ng-loancalculator?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm), [Live Demo](https://ej2.syncfusion.com/showcase/angular/loancalculator/?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm)
* Fitness Tracker - [Source](https://github.com/SyncfusionExamples/showcase-angular-health-tracker-dashboard-demo), [Live Demo](https://ej2.syncfusion.com/showcase/angular/fitness-tracker-app/)

## Key features

* [Data sources](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm#/material/pivot-table/local): Binds the Pivot Table component with an array of JSON objects, CSV files, and web services. It also supports multi-dimensional data sources, such as OLAP.
* [Pivot chart](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm#/material/pivot-table/pivot-chart): Allows user to visualize the pivot data graphically with 20+ chart types.
* [Drill down](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm#/material/pivot-table/Drill-Down): Provides option to view the bound data in both detailed and abstract view.
* [Filtering](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm#/material/pivot-table/filtering): Allows user to view only specific/desired records in the component.
* [Sorting](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm#/material/pivot-table/sorting): Both member and value sorting are supported. It’s allows user to order fields and values (column) either in ascending or descending order respectively.
* [Field list and grouping bar](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm#/material/pivot-table/grouping-bar): Supports UI interaction at runtime to dynamically change the report along with sorting, filtering and remove options.
* [Aggregation](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm#/material/pivot-table/aggregation): Provides built-in aggregation types such as sum, count, product, average, min, max, and more.
* [Calculated field](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm#/material/pivot-table/calculated-field): Users can add new value field(s) to the report dynamically using this option.
* [Grouping](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm#/material/pivot-table/grouping): Allows you to automatically group date, time, number, and string data based on group interval.
* [Virtual scrolling and paging](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm#/material/pivot-table/paging): Provides the option to display large amounts of data page by page, using either virtual scrolling or pager UI.
* [Drill through and editing](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm#/material/pivot-table/editing): Provides the ability to perform CRUD operations such as creating, reading, updating, and deleting raw data at runtime via an interactive UI.
* [Toolbar](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm#/material/pivot-table/toolbar): Provides the option to access frequently used features like switching between pivot table and pivot chart, changing chart types, conditional formatting, exporting, and so on.
* [Templates](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm#/material/pivot-table/cell-template): Templates can be used to create custom user experiences in the pivot table.
* [Export](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm#/material/pivot-table/exporting): Data can be exported to Excel, CSV, and PDF formats.
* [Right-to-left (RTL)](https://ej2.syncfusion.com/angular/documentation/pivotview/globalization-and-localization/?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm#right-to-left-rtl): Aligns content in the Pivot Table component from right to left.
* [Globalization](https://ej2.syncfusion.com/angular/documentation/pivotview/globalization-and-localization/?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm#globalization): Personalize the Pivot Table component with different languages, as well as culture-specific date and number formatting.

## Resources

* [Documentation](https://ej2.syncfusion.com/angular/documentation/pivotview/getting-started)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/angular?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/angular)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=angular&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/angular-js2?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-angular-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/angular?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/components/pivotview/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this component, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Angular UI components](https://www.syncfusion.com/angular-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=angular-pivot-table-npm) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential<sup>®</sup> Studio license and copyright applies to this distribution.