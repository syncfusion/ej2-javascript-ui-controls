# Vue HeatMap Component

The [Vue Heat Map](https://www.syncfusion.com/vue-components/vue-heatmap-chart?utm_source=npm&utm_medium=listing&utm_campaign=vue-heatmap-npm) component is a graphical representation of two-dimensional data where the values are represented with gradient or solid color variations. The data points are rendered as HeatMap cells using Scalable Vector Graphics (SVG) or canvas UI rendering.

<p align="center">
    <a href="https://ej2.syncfusion.com/vue/documentation/heatmap-chart/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=vue-heatmap-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_medium=listing&utm_campaign=vue-heatmap-npm#/material/heatmap/default.html">Online demos</a> . 
    <a href="https://www.syncfusion.com/vue-components/vue-heatmap-chart?utm_source=npm&utm_medium=listing&utm_campaign=vue-heatmap-npm">Learn more</a>
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/vue/vue-heatmap-chart.png" alt="Vue Heat Map Component">
</a>

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

### Create a Vue Application

You can use [`Vue CLI`](https://github.com/vuejs/vue-cli) to setup your Vue 2 applications. To install Vue CLI, use the following command.

```bash
npm install -g @vue/cli
vue create quickstart
cd quickstart
npm run serve
```

Initiating a new project prompts us to choose the type of project to be used for the current application. Select the option `Default ([Vue 2] babel, eslint)` from the menu.

### Add Syncfusion<sup>®</sup> HeatMap package

All Syncfusion<sup>®</sup> Vue packages are published in [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install Vue Heat Map package, use the following command.

```bash
npm install @syncfusion/ej2-vue-heatmap --save
```

### Register HeatMap Component

You can register the HeatMap component in your application by using the **Vue.use()**. Refer to the code example given below.

```typescript
import { HeatMapPlugin } from '@syncfusion/ej2-vue-heatmap';

Vue.use(HeatMapPlugin);
```

> Registering **HeatMapPlugin** in Vue, will register the HeatMap component along with its required child directives globally.

### Add HeatMap Component

Add the Vue HeatMap by using **ejs-heatmap** selector in **template** section of the **App.vue** file.

```html
<template>
    <div id="app">
        <ejs-heatmap :dataSource='dataSource'></ejs-heatmap>
    </div>
</template>
<script>
import Vue from 'vue';
import { HeatMapPlugin } from '@syncfusion/ej2-vue-heatmap';

Vue.use(HeatMapPlugin);
export default Vue.extend ({
  data: function() {
    return {
	    dataSource: [
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
            [74, 33, 88, 23, 86, 59]
	    ]
	}
  }
});
</script>
```

> Refer the [Getting Started with Vue3](https://ej2.syncfusion.com/vue/documentation/heatmap-chart/getting-started-vue-3/) topic for using Syncfusion<sup>®</sup> Vue components in Vue 3 applications.

## Supported frameworks

HeatMap component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg"  height="50" />](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg" height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Annual Flight Traffic Report - [Live Demo](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-heatmap-npm/#/material/heatmap/large-data.html)
* Crude Oil Production of the Non-OPEC Countries - [Live Demo](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-heatmap-npm/#/material/heatmap/tooltip-template.html)

## Key features

* [Data binding](https://ej2.syncfusion.com/vue/documentation/heatmap-chart/working-with-data/?utm_source=npm&utm_campaign=vue-heatmap-npm): Binding data in JSON and two-dimensional array formats is supported.
* [Axis types](https://ej2.syncfusion.com/vue/documentation/heatmap-chart/axis/?utm_source=npm&utm_campaign=vue-heatmap-npm#types): Supports three different types of axes to populate the data, namely Numerical, Categorical and DateTime.
* [Axis](https://ej2.syncfusion.com/vue/documentation/heatmap-chart/axis/?utm_source=npm&utm_campaign=vue-heatmap-npm#inversed-axis): Supports inverted axis, opposed position and axis intervals.
* [Rendering modes](https://ej2.syncfusion.com/vue/documentation/heatmap-chart/rendering-mode/?utm_source=npm&utm_campaign=vue-heatmap-npm): Supports automatic switching between SVG and Canvas rendering modes based on the data source length.
* [Palette](https://ej2.syncfusion.com/vue/documentation/heatmap-chart/palette/?utm_source=npm&utm_campaign=vue-heatmap-npm): Different colors are provided for different value ranges to be used in the cells.
* [Legend](https://ej2.syncfusion.com/vue/documentation/heatmap-chart/legend/?utm_source=npm&utm_campaign=vue-heatmap-npm): Summarizes the information for the colors which represents each values in HeatMap.
* [Tooltip](https://ej2.syncfusion.com/vue/documentation/heatmap-chart/tooltip/?utm_source=npm&utm_campaign=vue-heatmap-npm): Provides information about the cell values on hover.
* [Selection](https://ej2.syncfusion.com/vue/documentation/heatmap-chart/selection/?utm_source=npm&utm_campaign=vue-heatmap-npm): Supports selecting the cells that will be the center of attraction.
* [Templates](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-heatmap-npm#/material/heatmap/tooltip-template.html): Templates can be used to create custom user experience in the tooltip of the heatmap.

## Resources

* [Documentation](https://ej2.syncfusion.com/vue/documentation/heatmap-chart/getting-started)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/vue?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/vue)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=vue&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/vue?utm_source=npm&utm_medium=listing&utm_campaign=vue-heatmap-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-vue-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/vue?utm_source=npm&utm_medium=listing&utm_campaign=vue-heatmap-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-vue-ui-components/blob/master/components/heatmap/CHANGELOG.md). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Vue UI components](https://www.syncfusion.com/vue-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2/blob/master/license?utm_source=npm&utm_campaign=vue-heatmap-npm) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup>, Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio license and copyright applies to this distribution.