[![coverage](http://ej2.syncfusion.com/badges/ej2-gantt/coverage.svg)](http://ej2.syncfusion.com/badges/ej2-gantt)

# ej2-gantt

The Gantt component is designed to visualize and edit the project schedule, and track the project progress. It helps to organize and schedule the projects and also you can update the project schedule through interactions like editing, dragging and resizing.

![Gantt](https://ej2.syncfusion.com/products/images/gantt/readme.gif)

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's EULA (https://www.syncfusion.com/eula/es/). To acquire a license, you can purchase one at https://www.syncfusion.com/sales/products or start a free 30-day trial here (https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community license (https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

## Setup

To install Gantt and its dependent packages, use the following command.

```sh
npm install @syncfusion/ej2-gantt
```

## Resources

* [Getting Started](https://ej2.syncfusion.com/documentation/gantt/getting-started/)
* [View Online Demos](https://ej2.syncfusion.com/demos/?utm_source=npm&utm_campaign=gantt#/material/gantt/default.html)
* [Product Page](https://www.syncfusion.com/javascript-ui-controls/gantt)

## Supported Frameworks

Gantt component is also offered in following list of frameworks.

1. [Angular](https://github.com/syncfusion/ej2-angular-ui-components/tree/master/components/gantt)
2. [React](https://github.com/syncfusion/ej2-react-ui-components/tree/master/components/gantt)
3. [VueJS](https://github.com/syncfusion/ej2-vue-ui-components/tree/master/components/gantt)
4. [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls/gantt)
5. [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls/gantt)
6. [JavaScript (ES5)](https://www.syncfusion.com/javascript-ui-controls/gantt)
7. [Blazor](https://www.syncfusion.com/blazor-components/blazor-gantt-chart)

## Key Features

* [**Data sources**](https://ej2.syncfusion.com/javascript/documentation/gantt/data-binding/) - Bind hierarchical or self-referential data to Gantt chart with an array of JavaScript objects or DataManager.
* [**Timeline**](https://ej2.syncfusion.com/javascript/documentation/gantt/time-line/) – Display timescale from minutes to decades easily, and also display custom texts in the timeline units. Timeline can be displayed in either one-tier or two-tier layout.
* [**Customizable Taskbars**](https://ej2.syncfusion.com/javascript/documentation/gantt/appearance-customization/#taskbar-customization) – Display various tasks in a project using child taskbar, summary taskbar and milestone UI, that can also be customized with templates.
* [**Unscheduled tasks**](https://ej2.syncfusion.com/javascript/documentation/gantt/task-scheduling/#unscheduled-tasks) – Support for displaying tasks with undefined start date, end date or duration in a project.
* [**Baselines**](https://ej2.syncfusion.com/javascript/documentation/gantt/baseline/) – Display the deviations between planned dates and actual dates of a task in a project using baselines.
* [**CRUD actions**](https://ej2.syncfusion.com/javascript/documentation/gantt/managing-tasks/#maintaining-data-in-server) – Provides the options to dynamically insert, delete and update tasks using columns, dialog and taskbar editing options.
* [**Task dependency**](https://ej2.syncfusion.com/javascript/documentation/gantt/task-dependency/) – Define or update the dependencies between the tasks in a project with four types of task dependencies Finish – Start, Start – Finish, Finish – Finish, Start – Start.
* [**Markers and indicators**](https://ej2.syncfusion.com/javascript/documentation/gantt/data-markers/) - Support for displaying indicators and flags along with taskbars and task labels. Also map important events in a project using event marker.
* [**Task label customization**](https://ej2.syncfusion.com/javascript/documentation/gantt/appearance-customization/#task-labels) - provides option to set desired label inside task bar and right and left side of task bar.
* [**Resources**](https://ej2.syncfusion.com/javascript/documentation/gantt/resources/) - Allows you to assign and track performance of resource to particular task.
* [**Sorting**](https://ej2.syncfusion.com/javascript/documentation/gantt/sorting/) - Supports n levels of sorting.
* [**Filtering**](https://ej2.syncfusion.com/javascript/documentation/gantt/filtering/) - Offers filter UI such as filter bar, menu, excel and checkbox at each column to filter data.
* [**Editing**](https://ej2.syncfusion.com/javascript/documentation/gantt/managing-tasks/#editing-tasks) - provides the options for create, read, update, and delete operations.
* [**Columns**](https://ej2.syncfusion.com/javascript/documentation/gantt/columns/) - The column definitions are used as the dataSource schema in the gantt. This plays a vital role in rendering column values in the required format.
  * [**Reordering**](https://ej2.syncfusion.com/javascript/documentation/gantt/columns/#column-reordering) - Allows you to drag any column and drop it at any position in the gantt column header row, allowing columns to be repositioned.
  * [**Column Chooser**](https://ej2.syncfusion.com/javascript/documentation/gantt/columns/#column-menu) - The column chooser provides a list of column names paired with check boxes that allow the visibility to be toggled on the fly.
  * [**Resizing**](https://ej2.syncfusion.com/javascript/documentation/gantt/columns/#column-resizing) - Resizing allows changing column width on the fly by simply dragging the right corner of the column header.
* [**Selection**](https://ej2.syncfusion.com/javascript/documentation/gantt/selection/) - Rows or cells can be selected in the gantt. One or more rows or cells can also be selected by holding Ctrl or Command, or programmatically.
* [**Row Drag And Drop**](https://ej2.syncfusion.com/javascript/documentation/gantt/rows/#drag-and-drop) - Drag and drop allows user to dynamically rearrange the rows.
* [**Context Menu**](https://ej2.syncfusion.com/javascript/documentation/gantt/context-menu/) - The context menu improves user action with Gantt Chart using a pop-up menu. It appears when a cell or header is right-clicked.
* [**Resource View**](https://ej2.syncfusion.com/javascript/documentation/gantt/resource-view/) - Visualize the list of tasks assigned to each resource in a hierarchical manner.
    * [**OverAllocation**](https://ej2.syncfusion.com/javascript/documentation/gantt/resource-view/#resource-overallocation) - When a resource is assigned too much of work to complete within a day of resource’s available time then it is highlighted by a square bracket.
    * [**Multi Taskbar**](https://ej2.syncfusion.com/javascript/documentation/gantt/resource-view/#resource-multi-taskbar) - Allows user to visualize multiple tasks assigned to each resource in a row.
* [**Exporting**](https://ej2.syncfusion.com/javascript/documentation/gantt/excel-export/) - Allows you to export Gantt data to Excel, PDF and CSV formats.
* [**Zooming**](https://ej2.syncfusion.com/javascript/documentation/gantt/time-line/#zooming) - Zooming feature enables you to view the tasks in the project clearly from minute to year timespan.
* [**Split Tasks**](https://ej2.syncfusion.com/javascript/demos/#/material/gantt/split-tasks.html) - Allows an interruption in the task due to circumstances such as the occurrence of an unplanned event or reprioritization of already planned events. In such situtations, the pending work can be split into segments and the work can be resumed at a different date.
* [**Virtual Scrolling**](https://ej2.syncfusion.com/javascript/demos/#/material/gantt/virtual-scroll.html) - Allows user to load a large amount of data effectively.
* [**Templates**](https://ej2.syncfusion.com/javascript/demos/#/material/gantt/taskbar-template.html) - Templates can be used to create custom user experiences in the gantt.
* [**Enriched UI**](https://ej2.syncfusion.com/javascript/documentation/appearance/theme/) – Support for Material, bootstrap, fabric and high contrast themes along with other UI options like holidays support, vertical and horizontal grid lines support and so on.
* [**Localization**](https://ej2.syncfusion.com/javascript/documentation/gantt/global-local/) - Provides inherent support to localize the UI.

## Support

Product support is available for through following mediums.

* Creating incident in Syncfusion [Direct-trac](https://www.syncfusion.com/support/directtrac/incidents?utm_source=npm&utm_campaign=gantt) support system or [Community forum](https://www.syncfusion.com/forums/essential-js2?utm_source=npm&utm_campaign=gantt).
* New [GitHub issue](https://github.com/syncfusion/ej2-javascript-ui-controls/issues/new).
* Ask your query in Stack Overflow with tag `syncfusion`, `ej2`.

## License

Check the license detail [here](https://github.com/syncfusion/ej2-javascript-ui-controls/blob/master/license?utm_source=npm&utm_campaign=gantt).

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-javascript-ui-controls/blob/master/controls/gantt/CHANGELOG.md?utm_source=npm&utm_campaign=gantt)


&copy; Copyright 2019 Syncfusion, Inc. All Rights Reserved. The Syncfusion Essential Studio license and copyright applies to this distribution.