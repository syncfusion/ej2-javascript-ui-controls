# Angular Kanban Component

The [Angular Kanban](https://www.syncfusion.com/gantt-sdk/angular-kanban-board?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm) Board component is a popular tool for visualizing and managing work in a variety of contexts, including software development, project management, and personal productivity. The control supports necessary features to design task scheduling applications. The key features are swimlanes, customizable cards, binding from local and remote data sources, columns mapping, stacked headers, WIP validation, templating, responsiveness, filtering, and editing.

<p align="center">
    <a href="https://help.syncfusion.com/gantt-sdk/angular/kanban/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm#/bootstrap5/kanban/overview">Online demos</a> . 
    <a href="https://www.syncfusion.com/gantt-sdk/angular-kanban-board?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm">Learn more</a>
</p>
<p align="center">
   <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/angular/angular-kanban.png" alt="Angular Kanban Component"/>
</p>

<p align="center">
Trusted by the world's leading companies<br>
  <a href="https://www.syncfusion.com">
    <img src="https://ej2.syncfusion.com/home/images/trusted_companies.png" alt="Bootstrap logo">
  </a>
</p>

> **Using this package with an AI coding agent**
>
> Before generating Syncfusion code, ask your AI coding agent to run the Syncfusion setup using the following prompt:
>
> ```text
> Set up this project for Syncfusion before generating code. Fetch and follow the official instructions at https://ai.syncfusion.com/agent-setup/prompt.md, then report the detected platform, installed skill pack, MCP status, and any required licensing action.
> ```
> The setup detects your project’s platform and loads the appropriate Syncfusion skill pack. No Syncfusion account or MCP key is required to install or read Syncfusion agent skills.
>
> **Platform reference:** [https://ai.syncfusion.com/angular/llms.txt](https://ai.syncfusion.com/angular/llms.txt)

## Setup

### Create a Angular Application

You can use [Angular CLI](https://github.com/angular/angular-cli) to setup your Angular applications. To install the Angular CLI, use the following command.

```bash
npm install -g @angular/cli
```

Create a new Angular application using the following Angular CLI command.

```bash
ng new my-app
cd my-app
```

### Adding Syncfusion<sup>®</sup> Kanban package

To install Kanban and its dependent packages, use the following command.

```sh
ng add @syncfusion/ej2-angular-kanban
```

The above command does the below configuration to your Angular app.

 * Adds `@syncfusion/ej2-angular-kanban` package and its peer dependencies to your `package.json` file.
 * Imports the `KanbanModule` in your application module `app.module.ts`.
 * Registers the Syncfusion<sup>®</sup> UI default theme (material) in the `angular.json` file.

This makes it easy to add the Syncfusion<sup>®</sup> Angular Kanban module to your project and start using it in your application.

### Add Kanban component

In **src/app/app.component.ts**, use `<ejs-kanban>` selector in `template` attribute of  `@Component` directive to render the Syncfusion<sup>®</sup> Angular Kanban component.

```typescript
import { Component } from '@angular/core';
import { CardSettingsModel, KanbanModule } from '@syncfusion/ej2-angular-kanban';

@Component({
    selector: 'app-root',
    imports: [ KanbanModule ],
    standalone: true,
    template: `<ejs-kanban [dataSource]='data' [cardSettings]='cardSettings' keyField="Status">
                    <e-columns>
                        <e-column headerText='To do' keyField='Open'></e-column>
                        <e-column headerText='In Progress' keyField='InProgress'></e-column>
                        <e-column headerText='Testing' keyField='Testing'></e-column>
                        <e-column headerText='Done' keyField='Close'></e-column>
                    </e-columns>
                </ejs-kanban>`
})

export class AppComponent {
    public data: Object[] =  [
        { Id: 1, Status: 'Open', Summary: 'Analyze the new requirements gathered from the customer.', Type: 'Story', Priority: 'Low', Tags: 'Analyze,Customer', Estimate: 3.5, Assignee: 'Nancy Davloio', RankId: 1 },
        { Id: 2, Status: 'InProgress', Summary: 'Fix the issues reported in the IE browser.', Type: 'Bug', Priority: 'Release Breaker', Tags: 'IE', Estimate: 2.5, Assignee: 'Janet Leverling', RankId: 2  },
        { Id: 3, Status: 'Testing', Summary: 'Fix the issues reported by the customer.', Type: 'Bug', Priority: 'Low', Tags: 'Customer', Estimate: '3.5', Assignee: 'Steven walker', RankId: 1 },
        { Id: 4, Status: 'Close', Summary: 'Arrange a web meeting with the customer to get the login page requirements.', Type: 'Others', Priority: 'Low', Tags: 'Meeting', Estimate: 2, Assignee: 'Michael Suyama', RankId: 1 },
        { Id: 5, Status: 'Validate', Summary: 'Validate new requirements', Type: 'Improvement', Priority: 'Low', Tags: 'Validation', Estimate: 1.5, Assignee: 'Robert King', RankId: 1 }
    ];
    public cardSettings: CardSettingsModel = {
        contentField: 'Summary',
        headerField: 'Id'
    };
}
```

## Supported frameworks

The Kanban component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/gantt-sdk/javascript-kanban-board?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/gantt-sdk/javascript-kanban-board?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/gantt-sdk/react-kanban-board?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/gantt-sdk/react-kanban-board?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/gantt-sdk/vue-kanban-board?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/gantt-sdk/vue-kanban-board?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/gantt-sdk/aspnet-core-kanban-board?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/gantt-sdk/aspnet-core-kanban-board?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/gantt-sdk/aspnet-mvc-kanban-board?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/gantt-sdk/aspnet-mvc-kanban-board?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Expense Tracker - [Source](https://github.com/syncfusion/ej2-showcase-angular-expensetracker?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm), [Live Demo](https://ej2.syncfusion.com/showcase/angular/expensetracker/#/dashboard?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm)
* Loan Calculator - [Source](https://github.com/syncfusion/ej2-sample-ng-loancalculator?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm), [Live Demo](https://ej2.syncfusion.com/showcase/angular/loancalculator/?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm)
* Fitness Tracker - [Source](https://github.com/SyncfusionExamples/showcase-angular-health-tracker-dashboard-demo), [Live Demo](https://ej2.syncfusion.com/showcase/angular/fitness-tracker-app/)

## Key features

* [Data binding](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm#/material/kanban/remote-data) - Seamless data binding refers to the process of linking the data displayed on a Kanban board with a variety of data sources, such as  array of JSON objects or DataManager.
* [Swimlane](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm#/material/kanban/swimlane) - Swimlanes are typically represented as rows within the board, with each row containing its own set of columns and cards. The rows can be expanded and collapsed as needed to show or hide the contained cards, which can be useful for reducing clutter and focusing on specific areas of work.
* [Toggle columns](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm#/material/kanban/toggle-columns) - To expand and collapse the columns as needed in order to focus on specific areas of work or reduce clutter on the board.
* [WIP validation](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm#/material/kanban/wip-validation) - Work-in-progress (WIP) validation is a common practice in Kanban boards, and it involves setting limits on the number of tasks or cards that can be in progress at any given time. This helps to prevent overloading team members and ensures that work is being completed in a timely and efficient manner.
* [Dialog editing](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm#/material/kanban/dialog-editing) - Dialog editing support refers to the ability to perform create, read, update, and delete (CRUD) actions on the cards using dialog box. This can be useful for allowing users to quickly and easily add new tasks or make changes to existing ones without having to navigate away from the Kanban board.
* [Drag and drop](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm#/material/kanban/overview) - Cards can be easily dragged and dropped from one column to another, as well as from one swimlane to another, in order to indicate progress and changes in status. This can be a convenient and intuitive way for users to manage their work and collaborate with team members.
* [Stacked headers](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm#/material/kanban/stacked-header) - To add additional column headers in a stacked manner, which can be useful for displaying additional information or for organizing the columns in a more visually appealing way.
* [Card tooltip](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm#/material/kanban/tooltip-template) - To display the information for a card using a tooltip template, which can be a convenient way for users to view and interact with the data without having to open a separate dialog or window.
* [Templates](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm#/material/kanban/card-template) - Templates to customize the appearance and behavior of the key elements, such as cards, column headers, swimlanes, and tooltips. This can be useful for embedding any kind of HTML element or CSS style, and for creating a more personalized and interactive user experience.
* [Responsive rendering](https://help.syncfusion.com/gantt-sdk/angular/kanban/responsive-mode/?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm#responsive-mode) - A Kanban board can be designed to adapt to different form-factors, such as mobile and desktop, in order to provide an optimal user experience across different devices and screen sizes.
* [Localization support](https://help.syncfusion.com/gantt-sdk/angular/kanban/localization/?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm#globalization) - To localize the static text content to any desired language in order to make the control more accessible and user-friendly for international users.
* [RTL support](https://help.syncfusion.com/gantt-sdk/angular/kanban/localization#right-to-left-rtl/?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm#right-to-left-rtl) - To display the control contents from right to left (RTL) in order to support languages that are written in this direction, such as Arabic or Hebrew.

## Resources

* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/gantt-sdk?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/angular)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=angular&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/gantt-sdk?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-angular-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/gantt-sdk?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/components/kanban/CHANGELOG.md?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion<sup>®</sup> licensed software, including this component, is subject to the terms and conditions of Syncfusion<sup>®</sup> [EULA](https://www.syncfusion.com/license/studio/33.2.3/syncfusion_essential_studio_eula.pdf?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm). To acquire a license for 150+ [Angular UI components](https://www.syncfusion.com/angular-components?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm), you can [purchase](https://www.syncfusion.com/sales/pricing?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm) or [start a free 30-day trial](https://www.syncfusion.com/downloads/angular?tag=es-seo-ft-angular-banner-trial).

> A free community [license](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=angular-kanban-npm) for more info.

&copy; Copyright 2026 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio<sup>®</sup> license and copyright applies to this distribution.