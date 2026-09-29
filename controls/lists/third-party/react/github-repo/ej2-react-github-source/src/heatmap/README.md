# React HeatMap Component

The [React HeatMap](https://www.syncfusion.com/react-components/react-heatmap-chart?utm_source=npm&utm_medium=listing&utm_campaign=react-heatmap-npm) component is a graphical representation of two-dimensional data where the values are represented with gradient or solid color variations. The data points are rendered as HeatMap cells using Scalable Vector Graphics (SVG) or canvas UI rendering.

<p align="center">
    <a href="https://ej2.syncfusion.com/react/documentation/heatmap-chart/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=react-heatmap-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-heatmap-npm#/material/heatmap-chart/default">Online demos</a> . 
    <a href="https://www.syncfusion.com/react-components/react-heatmap-chart?utm_source=npm&utm_medium=listing&utm_campaign=react-heatmap-npm">Learn more</a>
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/react/react-heatmap-chart.png" alt="React HeatMap Component">
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

You can use [`create-react-app`](https://github.com/facebookincubator/create-react-app) to setup applications. To create React app, use the following command.

```bash
npx create-react-app my-app --template typescript
cd my-app
npm start
```

### Add Syncfusion<sup>®</sup> HeatMap package

All Syncfusion<sup>®</sup> React packages are published in the [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install the React HeatMap package, use the following command.

```sh
npm install @syncfusion/ej2-react-heatmap --save
```

### Add HeatMap Component

In the **src/App.tsx** file, use the following code snippet to render the Syncfusion<sup>®</sup> React HeatMap component.

```typescript
import { React } from 'react';
import { HeatMapComponent } from '@syncfusion/ej2-react-heatmap';
function App() {
    let heatmapData: any[] = [
        [73, 39, 26, 39, 94, 0],
        [93, 58, 53, 38, 26, 68],
        [99, 28, 22, 4, 66, 90],
        [14, 26, 97, 69, 69, 3],
        [7, 46, 47, 47, 88, 6],
        [41, 55, 73, 23, 3, 79],
        [56, 69, 21, 86, 3, 33],
        [45, 7, 53, 81, 95, 79],
        [60, 77, 74, 68, 88, 51],
        [25, 25, 10, 12, 78, 14],
        [25, 56, 55, 58, 12, 82],
        [74, 33, 88, 23, 86, 59]];
   return (<HeatMapComponent dataSource={heatmapData}></HeatMapComponent>);
}
export default App;
```

## Supported frameworks

HeatMap component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg"  height="50" />](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Annual Flight Traffic Report - [Live Demo](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_campaign=react-heatmap-npm/#/material/heatmap-chart/large-data)
* Loan Calculator - [Source](https://github.com/syncfusion/ej2-showcase-react-loan-calculator), [Live Demo](https://ej2.syncfusion.com/showcase/react/loancalculator/?utm_source=npm&utm_medium=listing&utm_campaign=react-heatmap-npm#/default)
* Fitness Tracker - [Source](https://github.com/SyncfusionExamples/showcase-react-health-tracker-dashboard-demo), [Live Demo](https://ej2.syncfusion.com/showcase/react/fitness-tracker-app/)

## Key features

* [Data binding](https://ej2.syncfusion.com/react/documentation/heatmap-chart/working-with-data/?utm_source=npm&utm_campaign=react-heatmap-npm): Binding data in JSON and two-dimensional array formats is supported.
* [Axis types](https://ej2.syncfusion.com/react/documentation/heatmap-chart/axis/?utm_source=npm&utm_campaign=react-heatmap-npm#types): Supports three different types of axes to populate the data, namely Numerical, Categorical and DateTime.
* [Axis](https://ej2.syncfusion.com/react/documentation/heatmap-chart/axis/?utm_source=npm&utm_campaign=react-heatmap-npm#inversed-axis): Supports inverted axis, opposed position and axis intervals.
* [Rendering modes](https://ej2.syncfusion.com/react/documentation/heatmap-chart/rendering-mode/?utm_source=npm&utm_campaign=react-heatmap-npm): Supports automatic switching between SVG and Canvas rendering modes based on the data source length.
* [Palette](https://ej2.syncfusion.com/react/documentation/heatmap-chart/palette/?utm_source=npm&utm_campaign=react-heatmap-npm): Different colors are provided for different value ranges to be used in the cells.
* [Legend](https://ej2.syncfusion.com/react/documentation/heatmap-chart/legend/?utm_source=npm&utm_campaign=react-heatmap-npm): Summarizes the information for the colors which represents each values in HeatMap.
* [Tooltip](https://ej2.syncfusion.com/react/documentation/heatmap-chart/tooltip/?utm_source=npm&utm_campaign=react-heatmap-npm): Provides information about the cell values on hover.
* [Selection](https://ej2.syncfusion.com/react/documentation/heatmap-chart/selection/?utm_source=npm&utm_campaign=react-heatmap-npm): Supports selecting the cells that will be the center of attraction.
* [Templates](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_campaign=react-heatmap-npm#/material/heatmap-chart/tooltip-template): Templates can be used to create custom user experience in the tooltip of the heatmap.

## Resources

* [Documentation](https://ej2.syncfusion.com/react/documentation/heatmap-chart/getting-started)
* [AI Coding Assistant](https://ej2.syncfusion.com/react/documentation/ai-coding-assistants/overview)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/react?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/react)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=react&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/react-js2?utm_source=npm&utm_medium=listing&utm_campaign=react-heatmap-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-react-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/react?utm_source=npm&utm_medium=listing&utm_campaign=react-heatmap-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-react-ui-components/blob/master/components/heatmap/CHANGELOG.md). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [React UI components](https://www.syncfusion.com/react-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2/blob/master/license?utm_source=npm&utm_campaign=react-heatmap-npm) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup>, Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio license and copyright applies to this distribution.