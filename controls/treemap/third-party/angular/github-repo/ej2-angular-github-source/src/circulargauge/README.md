# Angular Circular Gauge Component

The [Angular Circular Gauge](https://www.syncfusion.com/angular-components/angular-circular-gauge?utm_source=npm&utm_medium=listing&utm_campaign=angular-circulargauge-npm) component is ideal to visualize numeric values over a circular scale. All the circular gauge elements are rendered using Scalable Vector Graphics (SVG).

<p align="center">
    <a href="https://ej2.syncfusion.com/angular/documentation/circular-gauge/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=angular-circulargauge-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-circulargauge-npm#/fluent2/circular-gauge/default-functionalities">Online demos</a> . 
    <a href="https://www.syncfusion.com/angular-components/angular-circular-gauge?utm_source=npm&utm_medium=listing&utm_campaign=angular-circulargauge-npm">Learn more</a>
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/angular/angular-circular-gauge.png" alt="Angular Circular Gauge Component">
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

### Adding Syncfusion<sup>®</sup> Circular Gauge package

All Syncfusion<sup>®</sup> Angular packages are available in [npmjs.com](https://www.npmjs.com/~syncfusionorg). To install the Angular Circular Gauge package, use the following command.

```sh
npm install @syncfusion/ej2-angular-circulargauge
```

The above command does the below configuration to your Angular app.

 * Adds `@syncfusion/ej2-angular-circulargauge` package and its peer dependencies to your `package.json` file.
 * Imports the `CircularGaugeModule` in your application module `app.module.ts`.
 * Registers the Syncfusion<sup>®</sup> UI default theme (material) in the `angular.json` file.

This makes it easy to add the Syncfusion<sup>®</sup> Angular Circular Gauge module to your project and start using it in your application.

### Add Circular Gauge component

In **src/app/app.component.ts**, use `<ejs-circulargauge>` selector in the `template` attribute of the `@Component` directive to render the Syncfusion<sup>®</sup> Angular Circular Gauge component.

```typescript
import { Component } from '@angular/core';

@Component({
selector: 'app-container',
template:
`<ejs-circulargauge id="circular-container">
    <e-axes>
        <e-axis>
            <e-pointers>
                <e-pointer value=35></e-pointer>
            </e-pointers>
        </e-axis>
    </e-axes>
</ejs-circulargauge>`
})

export class AppComponent {

}
```

## Supported frameworks

Circular Gauge component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Live update - [Live Demo](https://ej2.syncfusion.com/angular/demos/#/fluent2/circular-gauge/data-sample)
* Direction compass - [Live Demo](https://ej2.syncfusion.com/angular/demos/#/fluent2/circular-gauge/direction-compass)
* Fitness Tracker - [Source](https://github.com/SyncfusionExamples/showcase-angular-health-tracker-dashboard-demo), [Live Demo](https://ej2.syncfusion.com/showcase/angular/fitness-tracker-app/)

## Key features

* [Arc Gauge/Radial Gauge](https://ej2.syncfusion.com/angular/documentation/circular-gauge/gauge-axes/?utm_source=npm&utm_medium=listing&utm_campaign=angular-circulargauge-npm#angles-and-direction): The arc gauge or radial gauge helps in the visualization of numerical values of scales in a semi-circular or quarter-circular manner. It is possible to achieve this by changing the start and end angle values.
* [Axes](https://ej2.syncfusion.com/angular/documentation/circular-gauge/gauge-axes/?utm_source=npm&utm_medium=listing&utm_campaign=angular-circulargauge-npm): Axes is a collection of circular axis that can be used to indicate numeric values.
* [Ranges](https://ej2.syncfusion.com/angular/documentation/circular-gauge/gauge-ranges/?utm_source=npm&utm_medium=listing&utm_campaign=angular-circulargauge-npm): Supports ranges to categorize the axis values. Any number of ranges can be added to the circular gauge.
* [Ticks and labels](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-circulargauge-npm#/fluent2/circular-gauge/ticks-and-labels): Provides options to customize the ticks and labels of the gauges.
* [Pointers](https://ej2.syncfusion.com/angular/documentation/circular-gauge/gauge-pointers/?utm_source=npm&utm_medium=listing&utm_campaign=angular-circulargauge-npm): Indicates the values on axis. Circular gauge supports three types of pointers: needle, range bar, and marker.
* [Annotation](https://ej2.syncfusion.com/angular/documentation/circular-gauge/gauge-annotations/?utm_source=npm&utm_medium=listing&utm_campaign=angular-circulargauge-npm): Uses any custom HTML element as annotation and place it anywhere on the gauge.
* [Legend](https://ej2.syncfusion.com/angular/documentation/circular-gauge/gauge-legend/?utm_source=npm&utm_medium=listing&utm_campaign=angular-circulargauge-npm): Summarizes the information from the ranges.
* [Tooltip](https://ej2.syncfusion.com/angular/documentation/circular-gauge/gauge-user-interaction/?utm_source=npm&utm_medium=listing&utm_campaign=angular-circulargauge-npm#tooltip-for-pointers): Provides information about the pointer and range values on hover.
* [Pointer drag](https://ej2.syncfusion.com/angular/documentation/circular-gauge/gauge-user-interaction/?utm_source=npm&utm_medium=listing&utm_campaign=angular-circulargauge-npm#pointer-drag): Provides support to place a pointer at the desired values by dragging it.
* [Range drag](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-circulargauge-npm#/fluent2/circular-gauge/pointer-ranges-drag): Provides support to extend the start or end of the range at the desired values by dragging it.
* [Print and Export](https://ej2.syncfusion.com/angular/documentation/circular-gauge/gauge-print-and-export/?utm_source=npm&utm_medium=listing&utm_campaign=angular-circulargauge-npm): Prints or exports the rendered circular gauge to a desired format. Exporting supports four formats: PDF, PNG, JPEG and SVG.
* [Templates](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-circulargauge-npm#/fluent2/circular-gauge/tooltip): Templates can be used to create custom user experience in the tooltip of the circular gauge.
* [Globalization](https://ej2.syncfusion.com/angular/documentation/circular-gauge/internationalization/?utm_source=npm&utm_medium=listing&utm_campaign=angular-circulargauge-npm): Personalize the circular gauge component with different languages, as well as culture-specific number, date and time formatting.
* [Accessibility](https://ej2.syncfusion.com/angular/documentation/circular-gauge/accessibility/?utm_source=npm&utm_medium=listing&utm_campaign=angular-circulargauge-npm): Provides with built-in accessibility support which helps to access all the circular gauge component features through the keyboard, screen readers, or other assistive technology devices. 

## Resources

* [Documentation](https://ej2.syncfusion.com/angular/documentation/introduction)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/angular?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/angular)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=angular&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/angular-js2?utm_source=npm&utm_medium=listing&utm_campaign=angular-circulargauge-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-angular-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/angular?utm_source=npm&utm_medium=listing&utm_campaign=angular-circulargauge-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/components/circulargauge/CHANGELOG.md?utm_source=npm&utm_campaign=angular-circulargauge-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Angular UI components](https://www.syncfusion.com/angular-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/components/circulargauge/license?utm_source=npm&utm_campaign=angular-circulargauge-npm) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup>, Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio license and copyright applies to this distribution.