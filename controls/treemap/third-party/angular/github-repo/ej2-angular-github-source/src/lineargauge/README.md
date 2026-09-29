# Angular Linear Gauge Component

The [Angular Linear Gauge](https://www.syncfusion.com/angular-components/angular-linear-gauge?utm_source=npm&utm_medium=listing&utm_campaign=angular-lineargauge-npm) component is used to visualize numerical values of an axis in linear manner. All the linear gauge elements are rendered using Scalable Vector Graphics (SVG).

<p align="center">
    <a href="https://ej2.syncfusion.com/angular/documentation/linear-gauge/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=angular-lineargauge-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-lineargauge-npm#/material/linear-gauge/default-functionalities">Online demos</a> . 
    <a href="https://www.syncfusion.com/angular-components/angular-linear-gauge?utm_source=npm&utm_medium=listing&utm_campaign=angular-lineargauge-npm">Learn more</a>
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/angular/angular-linear-gauge.png" alt="Angular Linear Gauge Component">
</p>

<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/syncfusion/syncfusion-trusted-companies.webp" alt="Bootstrap logo">
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
### Add Syncfusion Linear Gauge package

All Syncfusion Angular packages are available in [npmjs.com](https://www.npmjs.com/~syncfusionorg). To install the Angular Linear Gauge package, use the following command.

```sh
npm install @syncfusion/ej2-angular-lineargauge
```

The above command does the below configuration to your Angular app.

 * Adds `@syncfusion/ej2-angular-lineargauge` package and its peer dependencies to your `package.json` file.
 * Imports the `LinearGaugeModule` in your application module `app.module.ts`.
 * Registers the Syncfusion UI default theme (material) in the `angular.json` file.

This makes it easy to add the Syncfusion Angular Linear Gauge module to your project and start using it in your application.

### Add Linear Gauge component

In **src/app/app.component.ts**, use `<ejs-lineargauge>` selector in the `template` attribute of the `@Component` directive to render the Syncfusion Angular Linear Gauge component.

```typescript
import { Component } from '@angular/core';

@Component({
selector: 'app-container',
template: `<ejs-lineargauge id="gauge-container"></ejs-lineargauge>`
})

export class AppComponent {

}
```

## Supported frameworks

Linear Gauge component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Fitness Tracker - [Source](https://github.com/SyncfusionExamples/showcase-angular-health-tracker-dashboard-demo), [Live Demo](https://ej2.syncfusion.com/showcase/angular/fitness-tracker-app/)
* Progress Tracker - [Live Demo](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=angular-lineargauge-npm#/material/linear-gauge/step-progress-bar)

## Key features

* [Axes](https://ej2.syncfusion.com/angular/documentation/linear-gauge/axis/?utm_source=npm&utm_campaign=angular-lineargauge-npm): Axes is a collection of axis that can be used to indicate the numeric values in linear scale.
* [Orientation](https://ej2.syncfusion.com/angular/documentation/linear-gauge/axis/?utm_source=npm&utm_campaign=angular-lineargauge-npm#orientation): Renders in both vertical and horizontal directions.
* [Container](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=angular-lineargauge-npm#/material/linear-gauge/container): Container holds multiple axes together. It supports three types of containers: normal, rounded rectangle, and thermometer.
* [Ranges](https://ej2.syncfusion.com/angular/documentation/linear-gauge/ranges/?utm_source=npm&utm_campaign=angular-lineargauge-npm): Supports ranges to categorize the axis values. Any number of ranges can be added to the linear gauge.
* [Pointers](https://ej2.syncfusion.com/angular/documentation/linear-gauge/pointers/?utm_source=npm&utm_campaign=angular-lineargauge-npm): Pointers are used to indicate values on the axis. Linear gauge supports two types of pointers: bar and marker.
* [Annotation](https://ej2.syncfusion.com/angular/documentation/linear-gauge/annotations/?utm_source=npm&utm_campaign=angular-lineargauge-npm): Uses any custom HTML element as annotations and place it anywhere on the gauge.
* [Tooltip](https://ej2.syncfusion.com/angular/documentation/linear-gauge/user-interaction/?utm_source=npm&utm_campaign=angular-lineargauge-npm#tooltip): Provides information about the pointer values on hover.
* [Pointer drag](https://ej2.syncfusion.com/angular/documentation/linear-gauge/user-interaction/?utm_source=npm&utm_campaign=angular-lineargauge-npm#pointer-drag): Provides support to place the pointer at the desired values by dragging it.
* [Print and Export](https://ej2.syncfusion.com/angular/documentation/linear-gauge/print-and-export/?utm_source=npm&utm_campaign=angular-lineargauge-npm): Prints or exports the rendered linear gauge to a desired format. Exporting supports four formats: PDF, PNG, JPEG and SVG.
* [Globalization](https://ej2.syncfusion.com/angular/documentation/linear-gauge/internationalization/?utm_source=npm&utm_campaign=angular-lineargauge-npm): Personalize the linear gauge component with different languages, as well as culture-specific number, date and time formatting.
* [Accessibility](https://ej2.syncfusion.com/angular/documentation/linear-gauge/accessibility/?utm_source=npm&utm_campaign=angular-lineargauge-npm): Provides with built-in accessibility support which helps to access all the linear gauge component features through the keyboard, screen readers, or other assistive technology devices.

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/angular-js2?utm_source=npm&utm_medium=listing&utm_campaign=angular-lineargauge-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-angular-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/angular?utm_source=npm&utm_medium=listing&utm_campaign=angular-lineargauge-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/components/lineargauge/CHANGELOG.md?utm_source=npm&utm_campaign=angular-lineargauge-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 80+ [Angular UI components](https://www.syncfusion.com/angular-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.
See [LICENSE FILE](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/license?utm_source=npm&utm_campaign=angular-lineargauge-npm) for more info.

&copy; Copyright 2022 Syncfusion, Inc. All Rights Reserved. The Syncfusion Essential Studio license and copyright applies to this distribution.