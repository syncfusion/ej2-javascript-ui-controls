# Angular Spreadsheet Component

The [Angular Spreadsheet](https://www.syncfusion.com/angular-ui-components/angular-spreadsheet?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm) is an user interactive component to organize and analyze data in tabular format with configuration options for customization. It will load data by importing an Excel/CSV file or from local and remote data sources such as JSON, RESTful services, OData services, and more. The populated data can be exported as Excel with xlsx, xls, CSV and PDF formats.

<p align="center">
    <a href="https://ej2.syncfusion.com/angular/documentation/spreadsheet/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#/material/spreadsheet/default">Online demos</a> . 
    <a href="https://www.syncfusion.com/angular-components/angular-spreadsheet?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm">Learn more</a>
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/angular/angular-spreadsheet.png" alt="Angular Spreadsheet Component" />
</p>

<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com">
    <img src="https://ej2.syncfusion.com/home/images/trusted_companies.png" alt="Bootstrap logo">
  </a>
</p>

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

### Add Syncfusion<sup>®</sup> Spreadsheet package

All Syncfusion<sup>®</sup> Angular packages are available in [npmjs.com](https://www.npmjs.com/~syncfusionorg). To install the Angular Spreadsheet package, use the following command.

```bash
ng add @syncfusion/ej2-angular-spreadsheet
```

The above command does the below configuration to your Angular app.
 
 * Adds `@syncfusion/ej2-angular-spreadsheet` package and its peer dependencies to your `package.json` file.
 * Imports the `SpreadsheetModule` in your application module `app.module.ts`.
 * Registers the Syncfusion<sup>®</sup> UI default theme (material) in the `angular.json` file.

This makes it easy to add the Syncfusion<sup>®</sup> Angular Spreadsheet module to your project and start using it in your application.

### Add Spreadsheet component

In **src/app/app.component.ts**, use `<ejs-spreadsheet>` selector in the `template` attribute of the `@Component` directive to render the Syncfusion<sup>®</sup> Angular Spreadsheet component.

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `<ejs-spreadsheet>
                    <e-sheets>
                        <e-sheet>
                            <e-ranges>
                                <e-range [dataSource]='data'></e-range>
                            </e-ranges>
                        </e-sheet>
                    </e-sheets>
                </ejs-spreadsheet>`
})
export class AppComponent implements OnInit {

    public data: object[] = [];

    ngOnInit(): void {
        this.data = [
            { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, ShipCity: 'Reims' },
            { OrderID: 10249, CustomerID: 'TOMSP', EmployeeID: 6, ShipCity: 'Münster' },
            { OrderID: 10250, CustomerID: 'HANAR', EmployeeID: 4, ShipCity: 'Lyon' }
        ];
    }
}
```

## Supported frameworks

Spreadsheet component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Expense Tracker - [Source](https://github.com/syncfusion/ej2-showcase-angular-expensetracker?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm), [Live Demo](https://ej2.syncfusion.com/showcase/angular/expensetracker/#/dashboard?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm)
* Loan Calculator - [Source](https://github.com/syncfusion/ej2-sample-ng-loancalculator?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm), [Live Demo](https://ej2.syncfusion.com/showcase/angular/loancalculator/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm)
* Fitness Tracker - [Source](https://github.com/SyncfusionExamples/showcase-angular-health-tracker-dashboard-demo), [Live Demo](https://ej2.syncfusion.com/showcase/angular/fitness-tracker-app/)

## Key features

* [Data sources](https://ej2.syncfusion.com/angular/documentation/spreadsheet/data-binding/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#local-data): Bind the Spreadsheet component with an array of objects or data from a web service using [DataManager](https://ej2.syncfusion.com/angular/documentation/data/data-binding/).
* [Virtualization](https://ej2.syncfusion.com/angular/documentation/spreadsheet/scrolling/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#virtual-scrolling): Provides the option to load large amount of data without performance degradation.
* [Selection](https://ej2.syncfusion.com/angular/documentation/spreadsheet/selection/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm): Provides the option to select a cell or range of cells.
* [Editing](https://ej2.syncfusion.com/angular/documentation/spreadsheet/editing/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm): Provides the option to dynamically edit a cell.
* [Formulas](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#/material/spreadsheet/formula): Provides built-in calculation library with pre-defined formulas and named range support.
* [Clipboard](https://ej2.syncfusion.com/angular/documentation/spreadsheet/clipboard/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm): Provides the option to perform clipboard operations.
* [Cell formatting](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#/material/spreadsheet/cell-formatting): Provides the option to customize the appearance of cells.
* [Number formatting](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#/material/spreadsheet/number-formatting): Provides the option to format the cell value.
* [Open](https://ej2.syncfusion.com/angular/documentation/spreadsheet/open-save/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#open): Provides the option to open Excel and CSV files in Spreadsheet.
* [Save](https://ej2.syncfusion.com/angular/documentation/spreadsheet/open-save/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#save): Provides the option to save Spreadsheet data as Excel, CSV, and PDF documents.
* [Sorting](https://ej2.syncfusion.com/angular/documentation/spreadsheet/sort/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#sort-by-cell-value): Helps you to arrange the data to particular order in a selected range of cells.
* [Filtering](https://ej2.syncfusion.com/angular/documentation/spreadsheet/filter/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#apply-filter-on-ui): Helps you to view specific rows in the Spreadsheet by hiding the other rows.
* [Undo Redo](https://ej2.syncfusion.com/angular/documentation/spreadsheet/undo-redo/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm): Provides the option to perform undo redo operations in Spreadsheet.
* [Collaborative editing](https://ej2.syncfusion.com/angular/documentation/spreadsheet/use-cases/collaborative-editing/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm): Provides the option for real time changes across multiple users in the Spreadsheet.
* [Hyperlink](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#/material/spreadsheet/hyperlink): Provides the option to navigate to web link or cell reference within the sheet or to other sheet in Spreadsheet.
* [Resize](https://ej2.syncfusion.com/angular/documentation/spreadsheet/mobile-responsiveness/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm): Allows you to change the row height and column width. Auto fit the rows and columns based on its content.
* [Wrap text](https://ej2.syncfusion.com/angular/documentation/spreadsheet/cell-range/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#wrap-text): Provides the option to display the large content as multiple lines in a single cell.
* [Data validation](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#/material/spreadsheet/data-validation): Provides the option to validate edited values based on data validation rules defined for a cell or range of cells.
* [Find and replace](https://ej2.syncfusion.com/angular/documentation/spreadsheet/searching/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#find): Provides the option to find the data and replace it across all sheets in Spreadsheet.
* [Protect sheet](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#/material/spreadsheet/protect-sheet): Provides the option to restrict user actions like cell editing, row and column insertion, deletion, and resizing.
* [Borders](https://ej2.syncfusion.com/angular/documentation/spreadsheet/formatting/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#borders): Provides the option to customize cell gridlines such as color and its style for enhanced UI.
* [Show/hide](https://ej2.syncfusion.com/angular/documentation/spreadsheet/worksheet/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#sheet-visibility): Provides the option to show/hide rows, columns and sheets.
* [Insert/delete](https://ej2.syncfusion.com/angular/documentation/spreadsheet/rows-and-columns/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#insert): Provides the option to insert/delete rows, columns and sheets.
* [Merge cells](https://ej2.syncfusion.com/angular/documentation/spreadsheet/cell-range/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#merge-cells): Provides the option to combine two or more cells located in the same row or column into a single cell.
* [Conditional formatting](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#/material/spreadsheet/conditional-formatting): Provides the option to format a cell or range of cells based on conditions applied.
* [Autofill](https://ej2.syncfusion.com/angular/documentation/spreadsheet/cell-range/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#auto-fill): Provides the option to fill or copy a series or pattern of values and formats into adjacent cells in any direction.
* [Clear](https://ej2.syncfusion.com/angular/documentation/spreadsheet/cell-range/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#clear): Provides the option to clear the content, formats, and hyperlinks applied to a cell or range of cells in a Spreadsheet.
* [Aggregates](https://ej2.syncfusion.com/angular/documentation/spreadsheet/formulas/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm): Provides the option to check the sum, average, count, and more for the selected cells or range in the sheet.
* [Picture](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#/material/spreadsheet/image): Allows you to view, insert, and modify a picture in a Spreadsheet with customizing options.
* [Chart](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#/material/spreadsheet/chart): Transforms your Spreadsheet data to an intuitive overview for better understanding and to make smart business decisions.
* [Freeze panes](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#/material/spreadsheet/freeze-pane): Allows you to keep the specified rows and columns always visible at the top and left side of the sheet while scrolling through the sheet.
* [Password protection](https://ej2.syncfusion.com/angular/documentation/spreadsheet/protect-sheet/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#protect-workbook): Allows you to protect the workbook with a password.
* [Multi-line editing](https://ej2.syncfusion.com/angular/documentation/spreadsheet/editing/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm): Allows you to insert a line break between paragraphs of the text within a cell in a Spreadsheet.
* [Calculate range selection](https://ej2.syncfusion.com/angular/documentation/spreadsheet/selection/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm): Helps you to select a range or multiple ranges when editing a formula in a cell.
* [Right-to-left (RTL)](https://ej2.syncfusion.com/angular/documentation/right-to-left/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm): Aligns content in the Spreadsheet component from right to left.
* [Templates](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#/material/spreadsheet/cell-template): Templates can be used to create custom user experiences in the Spreadsheet.
* [Globalization](https://ej2.syncfusion.com/angular/documentation/spreadsheet/global-local/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm#localization): Personalize the Spreadsheet component with different languages, as well as culture-specific number, date, and time formatting.
* [Accessibility](https://ej2.syncfusion.com/angular/documentation/spreadsheet/accessibility/?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm): Provides with built-in accessibility support which helps to access all the Spreadsheet component features through the keyboard, screen readers, or other assistive technology devices.

## Resources

* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/angular?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/angular)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=angular&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/angular-js2?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-angular-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/angular?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/components/spreadsheet/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this component, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Angular UI components](https://www.syncfusion.com/angular-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=angular-spreadsheet-npm) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio<sup>®</sup> license and copyright applies to this distribution.