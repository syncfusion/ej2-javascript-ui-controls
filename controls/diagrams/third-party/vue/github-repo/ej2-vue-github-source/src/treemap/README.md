# Vue TreeMap Component

The [Vue TreeMap](https://www.syncfusion.com/vue-components/vue-treemap?utm_source=npm&utm_medium=listing&utm_campaign=vue-treemap-npm) component provides a simple and effective way to visualize flat or hierarchical data as clustered rectangles with a specific, weighted attribute determining the size of each rectangle.

<p align="center">
    <a href="https://ej2.syncfusion.com/vue/documentation/treemap/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=vue-treemap-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_medium=listing&utm_campaign=vue-treemap-npm#/bootstrap5/treemap/default.html">Online demos</a> . 
    <a href="https://www.syncfusion.com/vue-components/vue-treemap?utm_source=npm&utm_medium=listing&utm_campaign=vue-treemap-npm">Learn more</a>
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/vue/vue-treemap.png" alt="Vue TreeMap Component">
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

You can use [`Vue CLI`](https://github.com/vuejs/vue-cli) to setup your Vue 2 applications. To install Vue CLI, use the following commands.

```bash
npm install -g @vue/cli
vue create quickstart
cd quickstart
npm run serve
```

Initiating a new project prompts us to choose the type of project to be used for the current application. Select the option `Default ([Vue 2] babel, eslint)` from the menu.

### Add Syncfusion<sup>®</sup> TreeMap package

All Syncfusion<sup>®</sup> Vue packages are published in [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install Vue TreeMap package, use the following command.

```bash
npm install @syncfusion/ej2-vue-treemap --save
```

### Register TreeMap Component

You can register the TreeMap component in your application by using the **Vue.use()**. Refer to the code example given below.

```typescript
import { TreeMapPlugin } from '@syncfusion/ej2-vue-treemap';

Vue.use(TreeMapPlugin);
```

> Registering **TreeMapPlugin** in Vue, will register the TreeMap component along with its required child directives globally.

### Add TreeMap Component

Add the Vue TreeMap by using **ejs-treemap** selector in **template** section of the **App.vue** file.

```html
<template>
    <div id="app">
        <ejs-treemap :dataSource='data' weightValuePath='Count'
     :leafItemSettings='leafItemSettings'></ejs-treemap>
    </div>
</template>
<script>
    import Vue from 'vue';
    import { TreeMapPlugin } from '@syncfusion/ej2-vue-treemap';

    Vue.use(TreeMapPlugin);
    export default Vue.extend ({
	    data: function() {
		    return {
			    dataSource: [
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
				],
				leafItemSettings: { labelPath: 'State' }
			}
		}
	});
</script>
```

> Refer the [Getting Started with Vue3](https://ej2.syncfusion.com/vue/documentation/treemap/getting-started-vue-3/) topic for using Syncfusion<sup>®</sup> Vue components in Vue 3 applications.

## Supported frameworks

TreeMap component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg"  height="50" />](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg" height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Olympic medal categories - [Live Demo](https://ej2.syncfusion.com/vue/demos/#/material/treemap/customization.html)
* Countries population - [Live Demo](https://ej2.syncfusion.com/vue/demos/#/material/treemap/drilldown.html)

## Key features

* [Data sources](https://ej2.syncfusion.com/vue/documentation/treemap/data-binding/?utm_source=npm&utm_campaign=vue-treemap-npm): Binds the treemap component with an array of JSON objects or DataManager. Both hierarchical and flat collection data sources are supported.
* [Levels](https://ej2.syncfusion.com/vue/documentation/treemap/levels/?utm_source=npm&utm_campaign=vue-treemap-npm): Renders with any number of levels and items.
* [Layout](https://ej2.syncfusion.com/vue/documentation/treemap/layout/?utm_source=npm&utm_campaign=vue-treemap-npm): Supports four types of layouts: square, horizontal, vertical, and auto.
* [Drill-down](https://ej2.syncfusion.com/vue/documentation/treemap/drilldown/?utm_source=npm&utm_campaign=vue-treemap-npm): Provides drill-down option to have a closer look at the lower level of a hierarchy.
* [Data label](https://ej2.syncfusion.com/vue/documentation/treemap/data-label/?utm_source=npm&utm_campaign=vue-treemap-npm): Provides additional information about the nodes.
* [Header template](https://ej2.syncfusion.com/vue/documentation/treemap/levels/?utm_source=npm&utm_campaign=vue-treemap-npm#header-template-and-position): Uses any custom HTML element to customize the header of each item.
* [Label template](https://ej2.syncfusion.com/vue/documentation/treemap/data-label/?utm_source=npm&utm_campaign=vue-treemap-npm#template): Uses any custom HTML element to customize the data label for each node.
* [Color mapping](https://ej2.syncfusion.com/vue/documentation/treemap/color-mapping/?utm_source=npm&utm_campaign=vue-treemap-npm): Applies colors to the nodes based on various conditions. Treemap supports three types of color mapping: range, equal, and desaturation.
* [Legend](https://ej2.syncfusion.com/vue/documentation/treemap/legend/?utm_source=npm&utm_campaign=vue-treemap-npm): Provide useful information for conveying what the treemap showcases. 
* [Selection and highlight](https://ej2.syncfusion.com/vue/documentation/treemap/selection-and-highlight/?utm_source=npm&utm_campaign=vue-treemap-npm): Support selecting or highlighting the nodes to bring center of attraction.
* [Tooltip](https://ej2.syncfusion.com/vue/documentation/treemap/tooltip/?utm_source=npm&utm_campaign=vue-treemap-npm): Provides additional information about the node on hover.
* [Print and Export](https://ej2.syncfusion.com/vue/documentation/treemap/print-and-export/?utm_source=npm&utm_campaign=vue-treemap-npm): Prints or exports the rendered treemap to a desired format. Exporting supports four formats: PDF, PNG, JPEG and SVG.
* [Globalization](https://ej2.syncfusion.com/vue/documentation/treemap/internationalization/?utm_source=npm&utm_medium=listing&utm_campaign=vue-treemap-npm): Personalize the   component with different languages, as well as culture-specific number, date and time formatting.
* [Accessibility](https://ej2.syncfusion.com/vue/documentation/treemap/accessibility/?utm_source=npm&utm_medium=listing&utm_campaign=vue-treemap-npm): Provides with built-in accessibility support which helps to access all the treemap component features through the keyboard, screen readers, or other assistive technology devices.

## Resources

* [Documentation](https://ej2.syncfusion.com/react/documentation/treemap/getting-started)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/vue?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/vue)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=angular&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/vue?utm_source=npm&utm_medium=listing&utm_campaign=vue-treemap-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-vue-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/vue?utm_source=npm&utm_medium=listing&utm_campaign=vue-treemap-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-vue-ui-components/blob/master/components/treemap/CHANGELOG.md?utm_source=npm&utm_campaign=vue-treemap-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Vue UI components](https://www.syncfusion.com/vue-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-vue-ui-components/blob/master/components/treemap/license?utm_source=npm&utm_campaign=vue-treemap-npm) for more info.

&copy; Copyright 2025 Syncfusion<sup>®</sup>, Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio license and copyright applies to this distribution.