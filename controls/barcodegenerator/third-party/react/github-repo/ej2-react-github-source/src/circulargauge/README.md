# React CircularGauge Component

The [React Circular Gauge](https://www.syncfusion.com/react-components/react-circular-gauge?utm_source=npm&utm_medium=listing&utm_campaign=react-circulargauge-npm) component is ideal to visualize numeric values over a circular scale. All the circular gauge elements are rendered using Scalable Vector Graphics (SVG).

<p align="center">
    <a href="https://ej2.syncfusion.com/react/documentation/circular-gauge/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=react-circulargauge-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-circulargauge-npm#/bootstrap5/circular-gauge/default-functionalities">Online demos</a> . 
    <a href="https://www.syncfusion.com/react-components/react-circular-gauge?utm_source=npm&utm_medium=listing&utm_campaign=react-circulargauge-npm">Learn more</a>
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/react/react-circular-gauge.png" alt="React Circular Gauge Component">
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
> **Platform reference:** [https://ai.syncfusion.com/react/llms.txt](https://ai.syncfusion.com/react/llms.txt)

## Setup

### Create a React Application

You can use [`create-react-app`](https://github.com/facebookincubator/create-react-app) to setup applications. To create React app use the following command.

```bash
npx create-react-app my-app --template typescript
cd my-app
npm start
```

### Add Syncfusion<sup>®</sup> Circular Gauge package

All Syncfusion<sup>®</sup> React packages are published in the [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install the React Circular Gauge package, use the following command.

```sh
npm install @syncfusion/ej2-react-circulargauge --save
```

### Add Circular Gauge Component

In the **src/App.tsx** file, use the following code snippet to render the Syncfusion<sup>®</sup> React Circular Gauge component.

```typescript
import React from 'react';
import { CircularGaugeComponent } from '@syncfusion/ej2-react-circulargauge';

function App() {
   return (<CircularGaugeComponent></CircularGaugeComponent>);
}
export default App;
```

## Supported frameworks

Circular Gauge component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg"  height="50" />](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Live update - [Live Demo](https://ej2.syncfusion.com/react/demos/#/bootstrap5/circular-gauge/data-sample)
* Direction compass - [Live Demo](https://ej2.syncfusion.com/react/demos/#/bootstrap5/circular-gauge/direction-compass)
* Fitness Tracker - [Source](https://github.com/SyncfusionExamples/showcase-react-health-tracker-dashboard-demo), [Live Demo](https://ej2.syncfusion.com/showcase/react/fitness-tracker-app/)

## Key features

* [Arc Gauge/Radial Gauge](https://ej2.syncfusion.com/react/documentation/circular-gauge/gauge-axes/?utm_source=npm&utm_medium=listing&utm_campaign=react-circulargauge-npm#angles-and-direction): The arc gauge or radial gauge helps in the visualization of numerical values of scales in a semi-circular or quarter-circular manner. It is possible to achieve this by changing the start and end angle values.
* [Axes](https://ej2.syncfusion.com/react/documentation/circular-gauge/gauge-axes/?utm_source=npm&utm_medium=listing&utm_campaign=react-circulargauge-npm): Axes is a collection of circular axis that can be used to indicate numeric values.
* [Ranges](https://ej2.syncfusion.com/react/documentation/circular-gauge/gauge-ranges/?utm_source=npm&utm_medium=listing&utm_campaign=react-circulargauge-npm): Supports ranges to categorize the axis values. Any number of ranges can be added to the circular gauge.
* [Ticks and labels](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-circulargauge-npm#/bootstrap5/circular-gauge/ticks-and-labels): Provides options to customize the ticks and labels of the gauges.
* [Pointers](https://ej2.syncfusion.com/react/documentation/circular-gauge/gauge-pointers/?utm_source=npm&utm_medium=listing&utm_campaign=react-circulargauge-npm): Indicates the values on axis. Circular gauge supports three types of pointers: needle, range bar, and marker.
* [Annotation](https://ej2.syncfusion.com/react/documentation/circular-gauge/gauge-annotations/?utm_source=npm&utm_medium=listing&utm_campaign=react-circulargauge-npm): Uses any custom HTML element as annotation and place it anywhere on the gauge.
* [Legend](https://ej2.syncfusion.com/react/documentation/circular-gauge/gauge-legend/?utm_source=npm&utm_medium=listing&utm_campaign=react-circulargauge-npm): Summarizes the information from the ranges.
* [Tooltip](https://ej2.syncfusion.com/react/documentation/circular-gauge/gauge-user-interaction/?utm_source=npm&utm_medium=listing&utm_campaign=react-circulargauge-npm#tooltip-for-pointers): Provides information about the pointer and range values on hover.
* [Pointer drag](https://ej2.syncfusion.com/react/documentation/circular-gauge/gauge-user-interaction/?utm_source=npm&utm_medium=listing&utm_campaign=react-circulargauge-npm#pointer-drag): Provides support to place a pointer at the desired values by dragging it.
* [Range drag](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-circulargauge-npm#/bootstrap5/circular-gauge/pointer-ranges-drag): Provides support to extend the start or end of the range at the desired values by dragging it.
* [Print and Export](https://ej2.syncfusion.com/react/documentation/circular-gauge/gauge-print-and-export/?utm_source=npm&utm_medium=listing&utm_campaign=react-circulargauge-npm): Prints or exports the rendered circular gauge to a desired format. Exporting supports four formats: PDF, PNG, JPEG and SVG.
* [Templates](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-circulargauge-npm#/bootstrap5/circular-gauge/tooltip): Templates can be used to create custom user experience in the tooltip of the circular gauge.
* [Globalization](https://ej2.syncfusion.com/react/documentation/circular-gauge/internationalization/?utm_source=npm&utm_medium=listing&utm_campaign=react-circulargauge-npm): Personalize the circular gauge component with different languages, as well as culture-specific number, date and time formatting.
* [Accessibility](https://ej2.syncfusion.com/react/documentation/circular-gauge/accessibility/?utm_source=npm&utm_medium=listing&utm_campaign=react-circulargauge-npm): Provides with built-in accessibility support which helps to access all the circular gauge component features through the keyboard, screen readers, or other assistive technology devices. 

## Resources

* [Documentation](https://ej2.syncfusion.com/react/documentation/introduction)
* [AI Coding Assistant](https://ej2.syncfusion.com/react/documentation/ai-coding-assistants/overview)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/react?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/react)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=react&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/react-js2?utm_source=npm&utm_medium=listing&utm_campaign=react-circulargauge-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-react-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/react?utm_source=npm&utm_medium=listing&utm_campaign=react-circulargauge-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-react-ui-components/blob/master/components/circulargauge/CHANGELOG.md?utm_source=npm&utm_campaign=react-circulargauge-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [React UI components](https://www.syncfusion.com/react-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-react-ui-components/blob/master/components/circulargauge/license?utm_source=npm&utm_campaign=react-circulargauge-npm) for more info.

&copy; Copyright 2025 Syncfusion, Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential<sup>®</sup> Studio license and copyright applies to this distribution.