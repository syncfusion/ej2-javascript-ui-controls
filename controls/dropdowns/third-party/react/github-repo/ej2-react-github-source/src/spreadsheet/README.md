# React Spreadsheet Component

> **Using this package with an AI coding agent**
>
> Before generating Syncfusion® code, ask your AI coding agent to run the Syncfusion® setup using the following prompt:
>
> ```text
> Set up this project for Syncfusion® before generating code. Fetch
> and follow the official instructions at https://ai.syncfusion.com/,
> then report the detected platform, installed skill pack, MCP 
> status, and any required licensing action.
> ```
> The setup detects your project's platform and loads the appropriate Syncfusion® skill pack. No Syncfusion® account or MCP key is required to install or read Syncfusion® agent skills.
>
> **Platform reference:** [https://ai.syncfusion.com/react/llms.txt](https://ai.syncfusion.com/react/llms.txt)

The [React Spreadsheet](https://www.syncfusion.com/react-ui-components/react-spreadsheet?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm) is an user interactive component to organize and analyze data in tabular format with configuration options for customization. It will load data by importing an Excel/CSV file or from local and remote data sources such as JSON, RESTful services, OData services, and more. The populated data can be exported as Excel with xlsx, xls, CSV and PDF formats.

<p align="center">
    <a href="https://ej2.syncfusion.com/react/documentation/spreadsheet/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#/bootstrap5/spreadsheet/default">Online demos</a> . 
    <a href="https://www.syncfusion.com/react-components/react-spreadsheet?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm">Learn more</a>
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/react/react-spreadsheet.png" alt="React Spreadsheet Component" />
</p>

<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com">
    <img src="https://ej2.syncfusion.com/home/images/trusted_companies.png" alt="Bootstrap logo">
  </a>
</p>

## Setup

### Create a React Application

You can use [create-react-app](https://github.com/facebookincubator/create-react-app) to setup applications. To create React app, use the following command.

```bash
npx create-react-app my-app --template typescript
cd my-app
npm start
```

### Add Syncfusion<sup>®</sup> Spreadsheet package

All Syncfusion<sup>®</sup> React packages are published in the [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install the React Spreadsheet package, use the following command.

```bash
npm install @syncfusion/ej2-react-spreadsheet --save
```

### Add CSS references for Spreadsheet

Add CSS references needed for a Spreadsheet in **src/App.css** from the **../node_modules/@syncfusion** package folder.

```css
@import '../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';
@import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';
@import '../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css';
@import '../node_modules/@syncfusion/ej2-lists/styles/material.css';
@import '../node_modules/@syncfusion/ej2-navigations/styles/material.css';
@import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
@import '../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';
@import '../node_modules/@syncfusion/ej2-grids/styles/material.css';
@import '../node_modules/@syncfusion/ej2-react-spreadsheet/styles/material.css';
```

### Add Spreadsheet Component

In the **src/App.tsx** file, use the following code snippet to render the Syncfusion<sup>®</sup> React Spreadsheet component and import **App.css** to apply styles to the Spreadsheet.

```typescript
import { SheetsDirective, SheetDirective, RangesDirective, RangeDirective, SpreadsheetComponent } from '@syncfusion/ej2-react-spreadsheet';
import * as React from 'react';
import './App.css';

export default function App() {
    let data: object[] = [
        { OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, ShipCity: 'Reims' },
        { OrderID: 10249, CustomerID: 'TOMSP', EmployeeID: 6, ShipCity: 'Münster' },
        { OrderID: 10250, CustomerID: 'HANAR', EmployeeID: 4, ShipCity: 'Lyon' }
    ];
    return <SpreadsheetComponent>
               <SheetsDirective>
                   <SheetDirective>
                       <RangesDirective>
                            <RangeDirective dataSource={data}></RangeDirective>
                        </RangesDirective>
                    </SheetDirective>
                </SheetsDirective>
           </SpreadsheetComponent>
}
```

## Supported frameworks

Spreadsheet component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg"  height="50" />](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Loan Calculator - [Source](https://github.com/syncfusion/ej2-showcase-react-loan-calculator), [Live Demo](https://ej2.syncfusion.com/showcase/react/loancalculator/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#/default)
* Fitness Tracker - [Source](https://github.com/SyncfusionExamples/showcase-react-health-tracker-dashboard-demo), [Live Demo](https://ej2.syncfusion.com/showcase/react/fitness-tracker-app/)

## Key features

* [Data sources](https://ej2.syncfusion.com/react/documentation/spreadsheet/data-binding/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#local-data): Bind the Spreadsheet component with an array of objects or data from a web service using [DataManager](https://ej2.syncfusion.com/react/documentation/data/data-binding/).
* [Virtualization](https://ej2.syncfusion.com/react/documentation/spreadsheet/scrolling/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#virtual-scrolling): Provides the option to load large amount of data without performance degradation.
* [Selection](https://ej2.syncfusion.com/react/documentation/spreadsheet/selection/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm): Provides the option to select a cell or range of cells.
* [Editing](https://ej2.syncfusion.com/react/documentation/spreadsheet/editing/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm): Provides the option to dynamically edit a cell.
* [Formulas](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#/material/spreadsheet/formula): Provides built-in calculation library with pre-defined formulas and named range support.
* [Clipboard](https://ej2.syncfusion.com/react/documentation/spreadsheet/clipboard/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm): Provides the option to perform clipboard operations.
* [Cell formatting](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#/material/spreadsheet/cell-formatting): Provides the option to customize the appearance of cells.
* [Number formatting](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#/material/spreadsheet/number-formatting): Provides the option to format the cell value.
* [Open](https://ej2.syncfusion.com/react/documentation/spreadsheet/open-save/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#open): Provides the option to open Excel and CSV files in Spreadsheet.
* [Save](https://ej2.syncfusion.com/react/documentation/spreadsheet/open-save/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#save): Provides the option to save Spreadsheet data as Excel, CSV, and PDF documents.
* [Sorting](https://ej2.syncfusion.com/react/documentation/spreadsheet/sort/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#sort-by-cell-value): Helps you to arrange the data to particular order in a selected range of cells.
* [Filtering](https://ej2.syncfusion.com/react/documentation/spreadsheet/filter/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#apply-filter-on-ui): Helps you to view specific rows in the Spreadsheet by hiding the other rows.
* [Undo Redo](https://ej2.syncfusion.com/react/documentation/spreadsheet/undo-redo/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm): Provides the option to perform undo redo operations in Spreadsheet.
* [Collaborative editing](https://ej2.syncfusion.com/react/documentation/spreadsheet/use-cases/collaborative-editing/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm): Provides the option for real time changes across multiple users in the Spreadsheet.
* [Hyperlink](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#/material/spreadsheet/hyperlink): Provides the option to navigate to web link or cell reference within the sheet or to other sheet in Spreadsheet.
* [Resize](https://ej2.syncfusion.com/react/documentation/spreadsheet/mobile-responsiveness/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm): Allows you to change the row height and column width. Auto fit the rows and columns based on its content.
* [Wrap text](https://ej2.syncfusion.com/react/documentation/spreadsheet/cell-range/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#wrap-text): Provides the option to display the large content as multiple lines in a single cell.
* [Data validation](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#/material/spreadsheet/data-validation): Provides the option to validate edited values based on data validation rules defined for a cell or range of cells.
* [Find and replace](https://ej2.syncfusion.com/react/documentation/spreadsheet/searching/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#find): Provides the option to find the data and replace it across all sheets in Spreadsheet.
* [Protect sheet](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#/material/spreadsheet/protect-sheet): Provides the option to restrict user actions like cell editing, row and column insertion, deletion, and resizing.
* [Borders](https://ej2.syncfusion.com/react/documentation/spreadsheet/formatting/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#borders): Provides the option to customize cell gridlines such as color and its style for enhanced UI.
* [Show/hide](https://ej2.syncfusion.com/react/documentation/spreadsheet/worksheet/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#sheet-visibility): Provides the option to show/hide rows, columns and sheets.
* [Insert/delete](https://ej2.syncfusion.com/react/documentation/spreadsheet/rows-and-columns/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#insert): Provides the option to insert/delete rows, columns and sheets.
* [Merge cells](https://ej2.syncfusion.com/react/documentation/spreadsheet/cell-range/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#merge-cells): Provides the option to combine two or more cells located in the same row or column into a single cell.
* [Conditional formatting](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#/material/spreadsheet/conditional-formatting): Provides the option to format a cell or range of cells based on conditions applied.
* [Autofill](https://ej2.syncfusion.com/react/documentation/spreadsheet/cell-range/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#auto-fill): Provides the option to fill or copy a series or pattern of values and formats into adjacent cells in any direction.
* [Clear](https://ej2.syncfusion.com/react/documentation/spreadsheet/cell-range/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#clear): Provides the option to clear the content, formats, and hyperlinks applied to a cell or range of cells in a Spreadsheet.
* [Aggregates](https://ej2.syncfusion.com/react/documentation/spreadsheet/formulas/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm): Provides the option to check the sum, average, count, and more for the selected cells or range in the sheet.
* [Picture](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#/material/spreadsheet/image): Allows you to view, insert, and modify a picture in a Spreadsheet with customizing options.
* [Chart](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#/material/spreadsheet/chart): Transforms your Spreadsheet data to an intuitive overview for better understanding and to make smart business decisions.
* [Freeze panes](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#/material/spreadsheet/freeze-pane): Allows you to keep the specified rows and columns always visible at the top and left side of the sheet while scrolling through the sheet.
* [Password protection](https://ej2.syncfusion.com/react/documentation/spreadsheet/protect-sheet/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#protect-workbook): Allows you to protect the workbook with a password.
* [Multi-line editing](https://ej2.syncfusion.com/react/documentation/spreadsheet/editing/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm): Allows you to insert a line break between paragraphs of the text within a cell in a Spreadsheet.
* [Calculate range selection](https://ej2.syncfusion.com/react/documentation/spreadsheet/selection/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm): Helps you to select a range or multiple ranges when editing a formula in a cell.
* [Right-to-left (RTL)](https://ej2.syncfusion.com/react/documentation/right-to-left/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm): Aligns content in the Spreadsheet component from right to left.
* [Templates](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#/material/spreadsheet/cell-template): Templates can be used to create custom user experiences in the Spreadsheet.
* [Globalization](https://ej2.syncfusion.com/react/documentation/spreadsheet/global-local/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm#localization): Personalize the Spreadsheet component with different languages, as well as culture-specific number, date, and time formatting.
* [Accessibility](https://ej2.syncfusion.com/react/documentation/spreadsheet/accessibility/?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm): Provides with built-in accessibility support which helps to access all the Spreadsheet component features through the keyboard, screen readers, or other assistive technology devices.

## Resources

* [AI Coding Assistant](https://ej2.syncfusion.com/react/documentation/ai-coding-assistants/overview)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/react?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/react)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=react&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/react-js2?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-react-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/react?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-react-ui-components/blob/master/components/spreadsheet/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this component, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [React UI components](https://www.syncfusion.com/react-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-react-ui-components/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=react-spreadsheet-npm) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio<sup>®</sup> license and copyright applies to this distribution.