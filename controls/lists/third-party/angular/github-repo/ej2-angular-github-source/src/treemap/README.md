# Angular TreeMap Component

The [Angular TreeMap](https://www.syncfusion.com/angular-components/angular-treemap?utm_source=npm&utm_medium=listing&utm_campaign=angular-treemap-npm) component provides a simple and effective way to visualize flat or hierarchical data as clustered rectangles with a specific, weighted attribute determining the size of each rectangle.

<p align="center">
    <a href="https://ej2.syncfusion.com/angular/documentation/treemap/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=angular-treemap-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-treemap-npm#/bootstrap5/treemap/default">Online demos</a> . 
    <a href="https://www.syncfusion.com/angular-components/angular-treemap?utm_source=npm&utm_medium=listing&utm_campaign=angular-treemap-npm">Learn more</a>
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/angular/angular-treemap.png" alt="Angular TreeMap Component">
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

### Add Syncfusion<sup>®</sup> TreeMap package

All Syncfusion<sup>®</sup> Angular packages are available in [npmjs.com](https://www.npmjs.com/~syncfusionorg). To install the Angular TreeMap package, use the following command.

```sh
npm install @syncfusion/ej2-angular-treemap
```

The above command does the below configuration to your Angular app.

 * Adds `@syncfusion/ej2-angular-treemap` package and its peer dependencies to your `package.json` file.
 * Imports the `TreeMapModule` in your application module `app.module.ts`.
 * Registers the Syncfusion<sup>®</sup> UI default theme (material) in the `angular.json` file.

This makes it easy to add the Syncfusion<sup>®</sup> Angular TreeMap module to your project and start using it in your application.

### Add TreeMap component

In **src/app/app.component.ts**, use `<ejs-treemap>` selector in the `template` attribute of the `@Component` directive to render the Syncfusion<sup>®</sup> Angular TreeMap component.

```typescript
import { Component } from '@angular/core';
@Component({
selector: 'app-container',
template:
`<ejs-treemap id='container' style='display: block;' height='350px' [dataSource]='data' weightValuePath='Count'
[leafItemSettings]='leafItemSettings'>
</ejs-treemap>`
})
export class AppComponent {
  public data: object[] = [
    { State: 'Brazil', Count: 25 },
    { State: 'Colombia', Count: 12 },
    { State: 'Argentina', Count: 9 },
    { State: 'Ecuador', Count: 7 },
    { State: 'Chile', Count: 6 },
    { State: 'Peru', Count: 3 },
    { State: 'Venezuela', Count: 3 },
    { State: 'Bolivia', Count: 2 },
    { State: 'Paraguay', Count: 2 },
    { State: 'Uruguay', Count: 2 },
    { State: 'Falkland Islands',Count: 1 },
    { State: 'French Guiana', Count:1 },
    { State: 'Guyana', Count: 1 },
    { State: 'Suriname', Count: 1 },
  ];
  public leafItemSettings: object = {
    labelPath: 'State'
  };
}
```

## Supported frameworks

TreeMap component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Olympic medal categories details - [Live Demo](https://ej2.syncfusion.com/angular/demos/#/material/treemap/custom)
* Countries population details - [Live Demo](https://ej2.syncfusion.com/angular/demos/#/material/treemap/drilldown)
* Fitness Tracker - [Source](https://github.com/SyncfusionExamples/showcase-angular-health-tracker-dashboard-demo), [Live Demo](https://ej2.syncfusion.com/showcase/angular/fitness-tracker-app/)

## Key features

* [Data sources](https://ej2.syncfusion.com/angular/documentation/treemap/data-binding/?utm_source=npm&utm_campaign=angular-treemap-npm): Binds the treemap component with an array of JSON objects or DataManager. Both hierarchical and flat collection data sources are supported.
* [Levels](https://ej2.syncfusion.com/angular/documentation/treemap/levels/?utm_source=npm&utm_campaign=angular-treemap-npm): Renders with any number of levels and items.
* [Layout](https://ej2.syncfusion.com/angular/documentation/treemap/layout/?utm_source=npm&utm_campaign=angular-treemap-npm): Supports four types of layouts: square, horizontal, vertical, and auto.
* [Drill-down](https://ej2.syncfusion.com/angular/documentation/treemap/drilldown/?utm_source=npm&utm_campaign=angular-treemap-npm): Provides drill-down option to have a closer look at the lower level of a hierarchy.
* [Data label](https://ej2.syncfusion.com/angular/documentation/treemap/data-label/?utm_source=npm&utm_campaign=angular-treemap-npm): Provides additional information about the nodes.
* [Header template](https://ej2.syncfusion.com/angular/documentation/treemap/levels/?utm_source=npm&utm_campaign=angular-treemap-npm#header-template-and-position): Uses any custom HTML element to customize the header of each item.
* [Label template](https://ej2.syncfusion.com/angular/documentation/treemap/data-label/?utm_source=npm&utm_campaign=angular-treemap-npm#template): Uses any custom HTML element to customize the data label for each node.
* [Color mapping](https://ej2.syncfusion.com/angular/documentation/treemap/color-mapping/?utm_source=npm&utm_campaign=angular-treemap-npm): Applies colors to the nodes based on various conditions. Treemap supports three types of color mapping: range, equal, and desaturation.
* [Legend](https://ej2.syncfusion.com/angular/documentation/treemap/legend/?utm_source=npm&utm_campaign=angular-treemap-npm): Provide useful information for conveying what the treemap showcases. 
* [Selection and highlight](https://ej2.syncfusion.com/angular/documentation/treemap/selection-and-highlight/?utm_source=npm&utm_campaign=angular-treemap-npm): Support selecting or highlighting the nodes to bring center of attraction.
* [Tooltip](https://ej2.syncfusion.com/angular/documentation/treemap/tooltip/?utm_source=npm&utm_campaign=angular-treemap-npm): Provides additional information about the node on hover.
* [Print and Export](https://ej2.syncfusion.com/angular/documentation/treemap/print-and-export/?utm_source=npm&utm_campaign=angular-treemap-npm): Prints or exports the rendered treemap to a desired format. Exporting supports four formats: PDF, PNG, JPEG and SVG.
* [Globalization](https://ej2.syncfusion.com/angular/documentation/treemap/internationalization/?utm_source=npm&utm_medium=listing&utm_campaign=angular-treemap-npm): Personalize the treemap component with different languages, as well as culture-specific number, date and time formatting.
* [Accessibility](https://ej2.syncfusion.com/angular/documentation/treemap/accessibility/?utm_source=npm&utm_medium=listing&utm_campaign=angular-treemap-npm): Provides with built-in accessibility support which helps to access all the treemap component features through the keyboard, screen readers, or other assistive technology devices.

## Resources

* [Documentation](https://ej2.syncfusion.com/angular/documentation/treemap/getting-started)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/angular?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/angular)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=angular&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/angular-js2?utm_source=npm&utm_medium=listing&utm_campaign=angular-treemap-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-angular-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/angular?utm_source=npm&utm_medium=listing&utm_campaign=angular-treemap-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/components/treemap/CHANGELOG.md?utm_source=npm&utm_campaign=angular-treemap-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Angular UI components](https://www.syncfusion.com/angular-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/license?utm_source=npm&utm_campaign=angular-treemap-npm) for more info.

&copy; Copyright 2025 Syncfusion, Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio license and copyright applies to this distribution.