# Vue Linear Gauge Component

The [Vue Linear Gauge](https://www.syncfusion.com/vue-components/vue-linear-gauge?utm_source=npm&utm_medium=listing&utm_campaign=vue-lineargauge-npm) component is used to visualize numerical values of an axis in linear manner. All the linear gauge elements are rendered using Scalable Vector Graphics (SVG).

<p align="center">
    <a href="https://ej2.syncfusion.com/vue/documentation/linear-gauge/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=vue-lineargauge-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_medium=listing&utm_campaign=vue-lineargauge-npm#/bootstrap5/linear-gauge/default.html">Online demos</a> . 
    <a href="https://www.syncfusion.com/vue-components/vue-linear-gauge?utm_source=npm&utm_medium=listing&utm_campaign=vue-lineargauge-npm">Learn more</a>
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/vue/vue-linear-gauge.png" alt="Vue Linear Gauge Component">
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
> **Platform reference:** [https://ai.syncfusion.com/vue/llms.txt](https://ai.syncfusion.com/vue/llms.txt)

## Setup

### Create a Vue Application

You can use [Vue CLI](https://github.com/vuejs/vue-cli) to setup your Vue 2 applications. To install Vue CLI, use the following command.

```bash
npm install -g @vue/cli
vue create quickstart
cd quickstart
npm run serve
```

Initiating a new project prompts us to choose the type of project to be used for the current application. Select the option `Default ([Vue 2] babel, eslint)` from the menu.

### Add Syncfusion Linear Gauge package

All Syncfusion Vue packages are published in [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install Vue Linear Gauge package, use the following command.

```bash
npm install @syncfusion/ej2-vue-lineargauge --save
```

### Register Linear Gauge Component

You can register the Linear Gauge component in your application by using the **Vue.use()**. Refer to the code example given below.

```typescript
import { LinearGaugePlugin } from '@syncfusion/ej2-vue-lineargauge';

Vue.use(LinearGaugePlugin);
```

> Registering **LinearGaugePlugin** in Vue, will register the Linear Gauge component along with its required child directives globally.

### Add Linear Gauge Component

Add the Vue Linear Gauge by using **ejs-lineargauge** selector in **template** section of the **App.vue** file.

```html
<template>
    <ejs-lineargauge ></ejs-lineargauge>
</template>
<script>
import Vue from 'vue';
import { LinearGaugePlugin } from '@syncfusion/ej2-vue-lineargauge';

Vue.use(LinearGaugePlugin);
export default { }
</script>
```

> Refer the [Getting Started with Vue3](https://ej2.syncfusion.com/vue/documentation/linear-gauge/getting-started-vue-3/) topic for using Syncfusion Vue components in Vue 3 applications.

## Supported frameworks

Linear Gauge component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg"  height="50" />](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg" height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* CPU Utilization - [Live Demo](https://ej2.syncfusion.com/vue/demos/#/material/linear-gauge/annotation.html)
* Exercise Tracking - [Live Demo](https://ej2.syncfusion.com/vue/demos/#/material/linear-gauge/data.html)

## Key features

* [Axes](https://ej2.syncfusion.com/vue/documentation/linear-gauge/axis/?utm_source=npm&utm_campaign=vue-lineargauge-npm): Axes is a collection of axis that can be used to indicate the numeric values in linear scale.
* [Orientation](https://ej2.syncfusion.com/vue/documentation/linear-gauge/axis/?utm_source=npm&utm_campaign=vue-lineargauge-npm#orientation): Renders in both vertical and horizontal directions.
* [Container](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-lineargauge-npm#/material/linear-gauge/container.html): Container holds multiple axes together. It supports three types of containers: normal, rounded rectangle, and thermometer.
* [Ranges](https://ej2.syncfusion.com/vue/documentation/linear-gauge/ranges/?utm_source=npm&utm_campaign=vue-lineargauge-npm): Supports ranges to categorize the axis values. Any number of ranges can be added to the linear gauge.
* [Pointers](https://ej2.syncfusion.com/vue/documentation/linear-gauge/pointers/?utm_source=npm&utm_campaign=vue-lineargauge-npm): Pointers are used to indicate values on the axis. Linear gauge supports two types of pointers: bar and marker.
* [Annotation](https://ej2.syncfusion.com/vue/documentation/linear-gauge/annotations/?utm_source=npm&utm_campaign=vue-lineargauge-npm): Uses any custom HTML element as annotations and place it anywhere on the gauge.
* [Tooltip](https://ej2.syncfusion.com/vue/documentation/linear-gauge/user-interaction/?utm_source=npm&utm_campaign=vue-lineargauge-npm#tooltip): Provides information about the pointer values on hover.
* [Pointer drag](https://ej2.syncfusion.com/vue/documentation/linear-gauge/user-interaction/?utm_source=npm&utm_campaign=vue-lineargauge-npm#pointer-drag): Provides support to place the pointer at the desired values by dragging it.
* [Print and Export](https://ej2.syncfusion.com/vue/documentation/linear-gauge/linear-gauge-print-and-export/?utm_source=npm&utm_campaign=vue-lineargauge-npm): Prints or exports the rendered linear gauge to a desired format. Exporting supports four formats: PDF, PNG, JPEG and SVG.
* [Globalization](https://ej2.syncfusion.com/vue/documentation/linear-gauge/internationalization/?utm_source=npm&utm_campaign=vue-lineargauge-npm): Personalize the linear gauge component with different languages, as well as culture-specific number, date and time formatting.
* [Accessibility](https://ej2.syncfusion.com/vue/documentation/linear-gauge/accessibility/?utm_source=npm&utm_campaign=vue-lineargauge-npm): Provides with built-in accessibility support which helps to access all the linear gauge component features through the keyboard, screen readers, or other assistive technology devices.

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/vue?utm_source=npm&utm_medium=listing&utm_campaign=vue-lineargauge-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-vue-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/vue?utm_source=npm&utm_medium=listing&utm_campaign=vue-lineargauge-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-vue-ui-components/blob/master/components/lineargauge/CHANGELOG.md?utm_source=npm&utm_campaign=vue-lineargauge-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 80+ [Vue UI components](https://www.syncfusion.com/vue-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-vue-ui-components/blob/master/license?utm_source=npm&utm_campaign=vue-lineargauge-npm) for more info.

&copy; Copyright 2022 Syncfusion, Inc. All Rights Reserved. The Syncfusion Essential Studio license and copyright applies to this distribution.