# React TreeGrid Component

The [React TreeGrid](https://www.syncfusion.com/react-components/react-tree-grid?utm_source=npm&utm_medium=listing&utm_campaign=react-treegrid-npm) component is a feature-rich component used to visualize self-referential andhierarchical data effectively in a tabular format. It pulls data from a data source, such as array of JSON objects, `OData web services`, or [DataManager](https://ej2.syncfusion.com/react/documentation/data/data-binding/). It also incudes interactions like expanding and collapsing the parent records.

<p align="center">
  <a href="https://ej2.syncfusion.com/react/documentation/treegrid/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=react-treegrid-npm">Getting Started</a> . 
  <a href="https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-treegrid-npm#/bootstrap5/treegrid/treegrid-overview">Online demos</a> . 
  <a href="https://www.syncfusion.com/react-components/react-tree-grid?utm_source=npm&utm_medium=listing&utm_campaign=react-treegrid-npm">Learn more</a>
</p>

<p align="center">
<img alt="React TreeGrid Control" src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/react/react-treegrid.png"> </p>

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
> **Platform reference:** [https://ai.syncfusion.com/react/llms.txt](https://ai.syncfusion.com/react/llms.txt)

## Setup

### Create a React Application

You can use [`create-react-app`](https://github.com/facebookincubator/create-react-app) to setup the applications. To create React app use the following command.

```bash
npx create-react-app my-app --template typescript
cd my-app
npm start
```

### Adding Syncfusion<sup>®</sup> Tree Grid package

All Syncfusion<sup>®</sup> react packages are published in the [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install the react tree grid package, use the following command.

```bash
npm install @syncfusion/ej2-react-treegrid --save
```

### Adding CSS references for Tree Grid

Add CSS references needed for a Tree Grid in **src/App.css** from the **../node_modules/@syncfusion** package folder.

```css
@import '../node_modules/@syncfusion/ej2-base/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-calendars/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-navigations/styles/material.css';
@import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
@import '../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css';
@import "../node_modules/@syncfusion/ej2-grids/styles/material.css";
@import "../node_modules/@syncfusion/ej2-react-treegrid/styles/material.css";
```

### Add Tree Grid Component

In the **src/App.tsx** file, use the following code snippet to render the Syncfusion<sup>®</sup> React Tree Grid component and import **App.css** to apply styles to the tree grid:

```typescript
import { ColumnDirective, ColumnsDirective, TreeGridComponent } from '@syncfusion/ej2-react-treegrid';
import * as React from 'react';
import './App.css';

function App() {
    let data = [
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
        
    return <TreeGridComponent dataSource={data} treeColumnIndex={1} childMapping= 'subtasks'>
                <ColumnsDirective>
                    <ColumnDirective field='taskID' headerText='Task ID' width='90' textAlign='Right'/>
                    <ColumnDirective field='taskName' headerText='Task Name' width='180'/>
                    <ColumnDirective field='startDate' headerText='Start Date' width='90' format='yMd' textAlign='Right' type='date'/>
                    <ColumnDirective field='duration' headerText='Duration' width='80' textAlign='Right'/>
                </ColumnsDirective>
            </TreeGridComponent>
};
export default App;

```

## Supported frameworks

TreeGrid component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg"  height="50" />](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Loan Calculator - [Source](https://github.com/syncfusion/ej2-showcase-react-loan-calculator), [Live Demo](https://ej2.syncfusion.com/showcase/react/loancalculator/?utm_source=npm&utm_medium=listing&utm_campaign=react-treegrid-npm#/default)
* Fitness Tracker - [Source](https://github.com/SyncfusionExamples/showcase-react-health-tracker-dashboard-demo), [Live Demo](https://ej2.syncfusion.com/showcase/react/fitness-tracker-app/)

## Key features

* [Data sources](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_campaign=react-treegrid-npm#/bootstrap5/treegrid/localdata): Bind the TreeGrid control with an array of JSON objects or DataManager. Large data can be bound to tree grid wth high performance using load-on-demand concept.
* [Sorting](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_campaign=react-treegrid-npm#/bootstrap5/treegrid/sorting): Supports n levels of sorting and allows the use of a comparer function for customized sorting.
* [Filtering](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_campaign=react-treegrid-npm#/bootstrap5/treegrid/filter-menu): Offers filter UIs such as filter bar and menu at each column to filter data. Also allows for filtering based on related parent or child records.
* [Paging](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_campaign=react-treegrid-npm#/bootstrap5/treegrid/pagingapi): Provides the option to easily switch between pages using the pager bar. The number of rows in a page can also be customized. The pager also helps provide support for load-on-demand data binding.
* [Editing](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_campaign=react-treegrid-npm#/bootstrap5/treegrid/inline-editing): Provides the options for create, read, update, and delete operations. In addition to built-in editor controls to edit a particular column value, using template support users can use custom editor components that suit their application needs.
* [Virtual scrolling](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_campaign=react-treegrid-npm#/bootstrap5/treegrid/virtualscrolling): This feature improves the performance of the tree grid control when binding large amounts of data by only rendering the currently visible parts of the user interface and rendering other elements as needed while scrolling. Both column and row virtualization are supported. 
* [Columns](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_campaign=react-treegrid-npm#/bootstrap5/treegrid/columnformatting): Column definitions are used as the dataSource schema in the TreeGrid. This plays a vital role in rendering column values in the required format. Column functionalities such as resizing, reordering, column template, show or hide columns, stacked header, etc., are supported.
* [Column re-ordering](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_campaign=react-treegrid-npm#/bootstrap5/treegrid/reorder): Drag any column and drop it at any position in the TreeGrid’s column header row, to reposition the column.
* [Column resizing](https://ej2.syncfusion.com/react/documentation/treegrid/columns/column-resizing/): Resizing allows changing column width on the fly by simply dragging the right corner of the column header.
* [Row re-ordering](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_campaign=react-treegrid-npm#/bootstrap5/treegrid/drag-drop): Allows rows to be rearranged through drag and drop actions, changing their position and hierarchy level. A child row can be moved as a sibling within the same parent row or as a child to a different parent row.
* [Cell styling](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_campaign=react-treegrid-npm#/bootstrap5/treegrid/conditionalformatting): Customize treegrid cells by using CSS or programmatically.
* [Selection](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_campaign=react-treegrid-npm#/bootstrap5/treegrid/selectionapi): Rows or cells can be selected in the TreeGrid. One or more rows or cells can also be selected by holding Shift, Ctrl or Command, or programmatically.
* [Templates](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_campaign=react-treegrid-npm#/bootstrap5/treegrid/columntemplate): Templates can be used to create custom user experiences in the TreeGrid.
* [Aggregation](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_campaign=react-treegrid-npm#/bootstrap5/treegrid/aggregate-default): Provides the option to easily visualize aggregates for column values. Also allows for the display of aggregates for each group of child rows within different parent rows.
* [Context menu](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_campaign=react-treegrid-npm#/bootstrap5/treegrid/contextmenu): The context menu provides a list of actions to be performed in the TreeGrid. It appears when a cell, header, or the pager is right-clicked. Also allows for the addition of custom items with unique functionality to the context menu.
* [Export](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_campaign=react-treegrid-npm#/bootstrap5/treegrid/export): Provides the option to export the tree grid data to Excel, PDF, and CSV formats.
* [RTL support](https://ej2.syncfusion.com/react/documentation/treegrid/global-local#right-to-left-rtl): Provides the right-to-left mode which aligns content in the TreeGrid component from right to left. This improves user experience and accessibility for those who work with RTL languages like Hebrew and Arabic.
* [Localization](https://ej2.syncfusion.com/react/documentation/treegrid/global-local#localization): Provides inherent support to localize the UI.

## Resources

* [Documentation](https://ej2.syncfusion.com/react/documentation/treegrid/overview)
* [AI Coding Assistant](https://ej2.syncfusion.com/react/documentation/ai-coding-assistants/overview)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/react?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/react)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=react&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/react-js2?utm_source=npm&utm_medium=listing&utm_campaign=react-treegrid-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-react-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/react?utm_source=npm&utm_medium=listing&utm_campaign=react-treegrid-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-react-ui-components/blob/master/components/treegrid/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=react-treegrid-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [React UI components](https://www.syncfusion.com/react-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-react-ui-components/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=react-treegrid-npm) for more info.

&copy; Copyright 2025 Syncfusion, Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio license and copyright applies to this distribution.