# Vue TreeGrid Component

The [Vue TreeGrid](https://www.syncfusion.com/vue-components/vue-tree-grid?utm_source=npm&utm_medium=listing&utm_campaign=vue-treegrid-npm) component is a feature-rich component used to visualize self-referential and hierarchical data effectively in a tabular format. It pulls data from a data source, such as array of JSON objects, `OData web services`, or [`DataManager`](http://ej2.syncfusion.com/documentation/data). It also includes interactions like expanding and collapsing the parent records.

<p align="center">
  <a href="https://ej2.syncfusion.com/vue/documentation/treegrid/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=vue-treegrid-npm">Getting Started</a> .
  <a href="https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_medium=listing&utm_campaign=vue-treegrid-npm#/bootstrap5/tree-grid/overview.html">Online demos</a> .
  <a href="https://www.syncfusion.com/vue-components/vue-tree-grid?utm_source=npm&utm_medium=listing&utm_campaign=vue-treegrid-npm">Learn more</a>
</p>

<p align="center">
<img alt="Vue TreeGrid Control" src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/vue/vue-treegrid.png"> </p>

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
> **Platform reference:** [https://ai.syncfusion.com/vue/llms.txt](https://ai.syncfusion.com/vue/llms.txt)

## Setup

### Create an Vue Application

You can use [`Vue CLI`](https://github.com/vuejs/vue-cli) to setup your Vue 2 applications.To install Vue CLI use the following commands.

```bash
npm install -g @vue/cli
vue create quickstart
cd quickstart
npm run serve
```
Initiating a new project prompts us to choose the type of project to be used for the current application. Select the option `Default ([Vue 2] babel, eslint)` from the menu.

### Adding Syncfusion<sup>®</sup> Tree Grid package

All Syncfusion<sup>®</sup> Vue packages are published in [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install Vue tree grid package, use the following command.

```bash
npm install @syncfusion/ej2-vue-treegrid --save
```

### Registering Tree Grid Component

You can register the Tree Grid component in your application by using the **Vue.use()**. Refer to the code example given below.

```typescript
import { TreeGridPlugin } from '@syncfusion/ej2-vue-treegrid';

Vue.use(TreeGridPlugin);
```

> Registering **TreeGridPlugin** in vue, will register the tree grid component along with its required child directives globally.

### Adding CSS references for Tree Grid

Add CSS references needed for Tree Grid in **style** section of the **App.vue** file from **../node_modules/@syncfusion** package folder.

```html
<style>
@import '../node_modules/@syncfusion/ej2-base/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-calendars/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-navigations/styles/material.css';
@import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
@import '../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css';
@import '../node_modules/@syncfusion/ej2-notifications/styles/material.css';
@import "../node_modules/@syncfusion/ej2-grids/styles/material.css";
@import "../node_modules/@syncfusion/ej2-vue-treegrid/styles/material.css";
</style>
```

## Add Tree Grid Component

Add the Vue Tree Grid by using **ejs-treegrid** selector in **template** section of the **App.vue** file.

```html
<template>
    <div id="app">
        <ejs-treegrid :dataSource='data' :treeColumnIndex='1' childMapping='subtasks'>
          <e-columns>
          <e-column field='taskID' headerText='Task ID' textAlign='Right' width=70></e-column>
          <e-column field='taskName' headerText='Task Name' width=200></e-column>
          <e-column field='startDate' headerText='Start Date' textAlign='Right' format='yMd' width=90></e-column>
          <e-column field='duration' headerText='Duration' textAlign='Right' width=80></e-column>
          </e-columns>
        </ejs-treegrid>
    </div>
</template>
<script>
import Vue from "vue";
import { TreeGridPlugin } from "@syncfusion/ej2-vue-treegrid";

Vue.use(TreeGridPlugin);

export default {
  data() {
    return {
      data: [
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
          }]
    };
  },
}
</script>
<style>
@import '../node_modules/@syncfusion/ej2-base/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-calendars/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-navigations/styles/material.css';
@import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
@import '../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css';
@import '../node_modules/@syncfusion/ej2-notifications/styles/material.css';
@import "../node_modules/@syncfusion/ej2-grids/styles/material.css";
@import "../node_modules/@syncfusion/ej2-vue-treegrid/styles/material.css";
</style>
```
> Refer the [Getting Started with Vue3](https://ej2.syncfusion.com/vue/documentation/treegrid/getting-started-vue-3/) for using Syncfusion<sup>®</sup> Vue components in Vue 3 applications.

## Supported Frameworks

TreeGrid component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg"  height="50" />](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Key features

* [Data sources](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-treegrid-npm#/bootstrap5/tree-grid/localdata.html): Bind the TreeGrid control with an array of JSON objects or DataManager. Large data can be bound to tree grid wth high performance using load-on-demand concept.
* [Sorting](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-treegrid-npm#/bootstrap5/tree-grid/sorting-api.html): Supports n levels of sorting and allows the use of a comparer function for customized sorting.
* [Filtering](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-treegrid-npm#/bootstrap5/tree-grid/filtermenu.html): Offers filter UIs such as filter bar and menu at each column to filter data. Also allows for filtering based on related parent or child records.
* [Paging](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-treegrid-npm#/bootstrap5/tree-grid/paging-api.html): Provides the option to easily switch between pages using the pager bar. The number of rows in a page can also be customized. The pager also helps provide support for load-on-demand data binding.
* [Editing](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-treegrid-npm#/bootstrap5/tree-grid/inline-editing.html): Provides the options for create, read, update, and delete operations. In addition to built-in editor controls to edit a particular column value, using template support users can use custom editor components that suit their application needs.
* [Virtual scrolling](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-treegrid-npm#/bootstrap5/tree-grid/virtual-scrolling.html): This feature improves the performance of the tree grid control when binding large amounts of data by only rendering the currently visible parts of the user interface and rendering other elements as needed while scrolling. Both column and row virtualization are supported. 
* [Columns](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-treegrid-npm#/bootstrap5/tree-grid/columnformatting.html): Column definitions are used as the dataSource schema in the TreeGrid. This plays a vital role in rendering column values in the required format. Column functionalities such as resizing, reordering, column template, show or hide columns, stacked header, etc., are supported.
* [Column re-ordering](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-treegrid-npm#/bootstrap5/tree-grid/reorder.html): Drag any column and drop it at any position in the TreeGrid’s column header row, to reposition the column.
* [Column resizing](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-treegrid-npm#/bootstrap5/tree-grid/resizing.html): Resizing allows changing column width on the fly by simply dragging the right corner of the column header.
* [Row re-ordering](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-treegrid-npm#/bootstrap5/tree-grid/drag-drop.html): Allows rows to be rearranged through drag and drop actions, changing their position and hierarchy level. A child row can be moved as a sibling within the same parent row or as a child to a different parent row.
* [Cell styling](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-treegrid-npm#/bootstrap5/tree-grid/conditionalformatting.html): Customize treegrid cells by using CSS or programmatically.
* [Selection](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-treegrid-npm#/bootstrap5/tree-grid/selection-api.html): Rows or cells can be selected in the TreeGrid. One or more rows or cells can also be selected by holding Shift, Ctrl or Command, or programmatically.
* [Templates](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-treegrid-npm#/bootstrap5/tree-grid/columntemplate.html): Templates can be used to create custom user experiences in the TreeGrid.
* [Aggregation](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-treegrid-npm#/bootstrap5/tree-grid/aggregate.html): Provides the option to easily visualize aggregates for column values. Also allows for the display of aggregates for each group of child rows within different parent rows.
* [Context menu](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-treegrid-npm#/bootstrap5/tree-grid/contextmenu.html): The context menu provides a list of actions to be performed in the TreeGrid. It appears when a cell, header, or the pager is right-clicked. Also allows for the addition of custom items with unique functionality to the context menu.
* [Export](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-treegrid-npm#/bootstrap5/tree-grid/export.html): Provides the option to export the tree grid data to Excel, PDF, and CSV formats.
* [RTL support](https://ej2.syncfusion.com/vue/documentation/treegrid/global-local#right-to-left-rtl): Provides the right-to-left mode which aligns content in the TreeGrid component from right to left. This improves user experience and accessibility for those who work with RTL languages like Hebrew and Arabic.
* [Localization](https://ej2.syncfusion.com/vue/documentation/treegrid/global-local#localization): Provides inherent support to localize the UI.

## Resources

* [Documentation](https://ej2.syncfusion.com/vue/documentation/treegrid/overview)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/vue?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/vue)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=vue&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/vue?utm_source=npm&utm_medium=listing&utm_campaign=vue-treegrid-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-vue-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/vue?utm_source=npm&utm_medium=listing&utm_campaign=vue-treegrid-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-vue-ui-components/blob/master/components/treegrid/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=vue-treegrid-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Vue UI components](https://www.syncfusion.com/vue-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-vue-ui-components/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=vue-grid-npm) for more info.

&copy; Copyright 2025 Syncfusion, Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio license and copyright applies to this distribution.