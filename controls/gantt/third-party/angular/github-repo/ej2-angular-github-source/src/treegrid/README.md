# Angular TreeGrid Component

The [Angular TreeGrid](https://www.syncfusion.com/angular-components/angular-tree-grid?utm_source=npm&utm_medium=listing&utm_campaign=angular-treegrid-npm) component is a feature-rich component used to visualize self-referential and hierarchical data effectively in a tabular format. It pulls data from a data source, such as array of JSON objects, `OData web services`, or [DataManager](https://ej2.syncfusion.com/angular/documentation/data/data-binding/). It also includes interactions like expanding and collapsing the parent records.

<p align="center">
  <a href="https://ej2.syncfusion.com/angular/documentation/treegrid/getting-started/">Getting Started</a> . 
  <a href="https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-treegrid-npm#/material/treegrid/default">Online demos</a> . 
  <a href="https://www.syncfusion.com/angular-components/angular-tree-grid?utm_source=npm&utm_medium=listing&utm_campaign=angular-treegrid-npm">Learn more</a>
</p>

<p align="center">
<img alt="Angular TreeGrid Control" src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/angular/angular-treegrid.png"> </p>

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

Create a new Angular application using below Angular CLI command.

```bash
ng new my-app
cd my-app
```

### Adding Syncfusion<sup>®</sup> Tree Grid package

All Syncfusion<sup>®</sup> angular packages are published in [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install angular tree grid package, use the following command.

```bash
ng add @syncfusion/ej2-angular-treegrid
```

The above command does the below configuration to your Angular app.
 
 * Adds `@syncfusion/ej2-angular-treegrid` package and its peer dependencies to your `package.json` file.
 * Imports the `TreeGridModule` in your application module `app.module.ts`.
 * Registers the Syncfusion<sup>®</sup> UI default theme (material) in the `angular.json` file.

This makes it easy to add the Syncfusion<sup>®</sup> Angular TreeGrid module to your project and start using it in your application.

### Add Tree Grid Component

In **src/app/app.component.ts**, use `<ejs-treegrid>` selector in `template` attribute of  `@Component` directive to render the Syncfusion<sup>®</sup> Angular TreeGrid component.

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `<ejs-treegrid [dataSource]='data' [treeColumnIndex]='1' childMapping='subtasks'>
              <e-columns>
                  <e-column field='taskID' headerText='Task ID' textAlign='Right' width=70></e-column>
                  <e-column field='taskName' headerText='Task Name' width=200></e-column>
                  <e-column field='startDate' headerText='Start Date' textAlign='Right' format='yMd' width=90></e-column>
                  <e-column field='duration' headerText='Duration' textAlign='Right' width=80></e-column>
              </e-columns>
              </ejs-treegrid>`
})
export class AppComponent implements OnInit {

    public data: object[] = [];

    ngOnInit(): void {
        this.data =  [
          {
              taskID: 1,
              taskName: 'Planning',
              startDate: new Date('02/03/2017'),
              duration: 5,
              subtasks: [
                  { taskID: 2, taskName: 'Plan timeline', startDate: new Date('02/03/2017'), duration: 5 },
                  { taskID: 3, taskName: 'Plan budget', startDate: new Date('02/03/2017'), duration: 5 },
                  { taskID: 4, taskName: 'Allocate resources', startDate: new Date('02/03/2017'), duration: 5 },
                  { taskID: 5, taskName: 'Planning complete', startDate: new Date('02/07/2017'), duration: 0 }
              ]
          }];
    }
}
```
## Supported frameworks

TreeGrid component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Expense Tracker - [Source](https://github.com/syncfusion/ej2-showcase-angular-expensetracker?utm_source=npm&utm_medium=listing&utm_campaign=angular-treegrid-npm), [Live Demo](https://ej2.syncfusion.com/showcase/angular/expensetracker/#/dashboard?utm_source=npm&utm_medium=listing&utm_campaign=angular-treegrid-npm)
* Loan Calculator - [Source](https://github.com/syncfusion/ej2-sample-ng-loancalculator?utm_source=npm&utm_medium=listing&utm_campaign=angular-treegrid-npm), [Live Demo](https://ej2.syncfusion.com/showcase/angular/loancalculator/?utm_source=npm&utm_medium=listing&utm_campaign=angular-treegrid-npm)
* Fitness Tracker - [Source](https://github.com/SyncfusionExamples/showcase-angular-health-tracker-dashboard-demo), [Live Demo](https://ej2.syncfusion.com/showcase/angular/fitness-tracker-app/)

## Key features

* [Data sources](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=angular-treegrid-npm#/bootstrap5/treegrid/localdata): Bind the TreeGrid control with an array of JSON objects or DataManager. Large data can be bound to tree grid wth high performance using load-on-demand concept.
* [Sorting](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=angular-treegrid-npm#/bootstrap5/treegrid/sortingapi): Supports n levels of sorting and allows the use of a comparer function for customized sorting.
* [Filtering](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=angular-treegrid-npm#/bootstrap5/treegrid/filtermenu): Offers filter UIs such as filter bar and menu at each column to filter data. Also allows for filtering based on related parent or child records.
* [Paging](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=angular-treegrid-npm#/bootstrap5/treegrid/default-paging): Provides the option to easily switch between pages using the pager bar. The number of rows in a page can also be customized. The pager also helps provide support for load-on-demand data binding.
* [Editing](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=angular-treegrid-npm#/bootstrap5/treegrid/inlineediting): Provides the options for create, read, update, and delete operations. In addition to built-in editor controls to edit a particular column value, using template support users can use custom editor components that suit their application needs.
* [Virtual scrolling](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=angular-treegrid-npm#/bootstrap5/treegrid/virtual-scrolling): This feature improves the performance of the tree grid control when binding large amounts of data by only rendering the currently visible parts of the user interface and rendering other elements as needed while scrolling. Both column and row virtualization are supported. 
* [Columns](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=angular-treegrid-npm#/bootstrap5/treegrid/columnformatting): Column definitions are used as the dataSource schema in the TreeGrid. This plays a vital role in rendering column values in the required format. Column functionalities such as resizing, reordering, column template, show or hide columns, stacked header, etc., are supported.
* [Column re-ordering](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=angular-treegrid-npm#/bootstrap5/treegrid/reorder): Drag any column and drop it at any position in the TreeGrid’s column header row, to reposition the column.
* [Column resizing](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=angular-treegrid-npm#/bootstrap5/treegrid/resizing): Resizing allows changing column width on the fly by simply dragging the right corner of the column header.
* [Row re-ordering](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=angular-treegrid-npm#/bootstrap5/treegrid/drag-drop): Allows rows to be rearranged through drag and drop actions, changing their position and hierarchy level. A child row can be moved as a sibling within the same parent row or as a child to a different parent row.
* [Cell styling](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=angular-treegrid-npm#/bootstrap5/treegrid/conditionalformatting): Customize treegrid cells by using CSS or programmatically.
* [Selection](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=angular-treegrid-npm#/bootstrap5/treegrid/selection-api): Rows or cells can be selected in the TreeGrid. One or more rows or cells can also be selected by holding Shift, Ctrl or Command, or programmatically.
* [Templates](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=angular-treegrid-npm#/bootstrap5/treegrid/columntemplate): Templates can be used to create custom user experiences in the TreeGrid.
* [Aggregation](https://ej2.syncfusion.com/angular/documentation/treegrid/aggregates/aggregates/): Provides the option to easily visualize aggregates for column values. Also allows for the display of aggregates for each group of child rows within different parent rows.
* [Context menu](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=angular-treegrid-npm#/bootstrap5/treegrid/contextmenu-default): The context menu provides a list of actions to be performed in the TreeGrid. It appears when a cell, header, or the pager is right-clicked. Also allows for the addition of custom items with unique functionality to the context menu.
* [Export](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=angular-treegrid-npm#/bootstrap5/treegrid/exporting-default): Provides the option to export the tree grid data to Excel, PDF, and CSV formats.
* [RTL support](https://ej2.syncfusion.com/angular/documentation/treegrid/global-local#right-to-left-rtl): Provides the right-to-left mode which aligns content in the TreeGrid component from right to left. This improves user experience and accessibility for those who work with RTL languages like Hebrew and Arabic.
* [Localization](https://ej2.syncfusion.com/angular/documentation/treegrid/global-local#localization): Provides inherent support to localize the UI.

## Resources

* [Documentation](https://ej2.syncfusion.com/angular/documentation/treegrid/overview)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/angular?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/angular)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=angular&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/angular-js2?utm_source=npm&utm_medium=listing&utm_campaign=angular-treegrid-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-angular-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/angular?utm_source=npm&utm_medium=listing&utm_campaign=angular-treegrid-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/components/treegrid/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=angular-treegrid-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Angular UI components](https://www.syncfusion.com/angular-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=angular-treegrid-npm) for more info.

&copy; Copyright 2025 Syncfusion, Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio license and copyright applies to this distribution.