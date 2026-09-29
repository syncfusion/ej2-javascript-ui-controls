# Vue Maps Component

The [Vue Maps](https://www.syncfusion.com/vue-components/vue-maps-library?utm_source=npm&utm_medium=listing&utm_campaign=vue-maps-npm) component is used to visualize geographical data and represent statistical data of a specific geographical area on earth with user interactivity, and it provides a wide range of customization options.

<p align="center">
    <a href="https://ej2.syncfusion.com/vue/documentation/maps/getting-started/">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_medium=listing&utm_campaign=vue-maps-npm#/bootstrap5/maps/default.html">Online demos</a> . 
    <a href="https://www.syncfusion.com/vue-components/vue-maps-library?utm_source=npm&utm_medium=listing&utm_campaign=vue-maps-npm">Learn more</a>
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/vue/vue-map.png" alt="Vue Maps Component">
</a>

<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com">
    <img src="https://ej2.syncfusion.com/home/images/trusted_companies.png" alt="Bootstrap logo">
  </a>
</p>

> **Using this package with an AI coding agent**
>
> Before generating Syncfusion® code, ask your AI coding agent to run the Syncfusion® setup using the following prompt:
>
> ```text
> Set up this project for Syncfusion® before generating code. Fetch
> and follow the official instructions at https://ai.syncfusion.com/,
> then report the detected platform, installed skill pack, MCP 
> status, and any required licensing action.
> ```
> The setup detects your project’s platform and loads the appropriate Syncfusion® skill pack. No Syncfusion® account or MCP key is required to install or read Syncfusion® agent skills.
>
> **Platform reference:** [https://ai.syncfusion.com/vue/llms.txt](https://ai.syncfusion.com/vue/llms.txt)

## Setup

### Create a Vue Application

You can use [Vue CLI](https://github.com/vuejs/vue-cli) to setup your Vue 2 applications. To install Vue CLI, use the following commands.

```bash
npm install -g @vue/cli
vue create quickstart
cd quickstart
npm run serve
```

Initiating a new project prompts us to choose the type of project to be used for the current application. Select the option `Default ([Vue 2] babel, eslint)` from the menu.

### Add Syncfusion<sup>®</sup> Maps package

All Syncfusion<sup>®</sup> Vue packages are published in [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install Vue Maps package, use the following command.

```bash
npm install @syncfusion/ej2-vue-maps --save
```

### Register Maps Component

You can register the Maps component in your application by using the **Vue.use()**. Refer to the code example given below.

```typescript
import { MapsPlugin } from '@syncfusion/ej2-vue-maps';

Vue.use(MapsPlugin);
```

> Registering **MapsPlugin** in Vue, will register the Maps component along with its required child directives globally.

### Add Maps Component

Add the Vue Maps by using **ejs-maps** selector in **template** section of the **App.vue** file.

```html
<template>
    <div id="map">
        <ejs-maps>
            <e-layers>
                <e-layer :shapeData='shapeData'></e-layer>
            </e-layers>
        </ejs-maps>
    </div>
</template>
<script>
import Vue from 'vue';
import { MapsPlugin } from '@syncfusion/ej2-vue-maps';
import { world_map } from './world-map.js';
Vue.use(MapsPlugin);
export default {
  data() {
    return {
      shapeData: world_map
    }
  }
}
</script>
```

> Refer the [Getting Started with Vue3](https://ej2.syncfusion.com/vue/documentation/maps/getting-started-vue-3/) topic for using Syncfusion<sup>®</sup> Vue components in Vue 3 applications.

## Supported frameworks

Maps component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg"  height="50" />](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg" height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Heat map - [Live Demo](https://ej2.syncfusion.com/vue/demos/#/material/maps/heatmap.html)
* Flight routes - [Live Demo](https://ej2.syncfusion.com/vue/demos/#/material/maps/curved-lines.html)
* Bus seat booking - [Live Demo](https://ej2.syncfusion.com/vue/demos/#/material/maps/seat-selection.html)

## Key features

* [Data sources](https://ej2.syncfusion.com/vue/documentation/maps/populate-data/?utm_source=npm&utm_campaign=vue-maps-npm): Binds the maps control to an array of JSON objects containing GeoJSON data.
* [Map providers](https://ej2.syncfusion.com/vue/documentation/maps/providers/other-maps/?utm_source=npm&utm_campaign=vue-maps-npm): Online map providers such as OpenStreetMap, Bing Maps and others can also be rendered.
* [Layer](https://ej2.syncfusion.com/vue/documentation/maps/layers/?utm_source=npm&utm_campaign=vue-maps-npm): Layer represents the area which renders the map. Also, any number of layers can be added.
* [Projection](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-maps-npm#/material/maps/projection.html): Maps can be rendered in eight different types of projections.
* [Drill-down](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-maps-npm#/material/maps/drilldown.html): Provides drill-down option to have a closer look at the lower level of a hierarchy.
* [Marker](https://ej2.syncfusion.com/vue/documentation/maps/markers/?utm_source=npm&utm_campaign=vue-maps-npm): Provides support to mark a specific place of interest in the map.
* [Data label](https://ej2.syncfusion.com/vue/documentation/maps/data-labels/?utm_source=npm&utm_campaign=vue-maps-npm): Provides additional information about the shapes in the form of text over the shapes.
* [Bubble](https://ej2.syncfusion.com/vue/documentation/maps/bubble/?utm_source=npm&utm_campaign=vue-maps-npm): Represents visually the underlying data values of the shapes.
* [Navigation line](https://ej2.syncfusion.com/vue/documentation/maps/navigation-line/?utm_source=npm&utm_campaign=vue-maps-npm): Denotes the path between two locations.
* [Color mapping](https://ej2.syncfusion.com/vue/documentation/maps/color-mapping/?utm_source=npm&utm_campaign=vue-maps-npm): Applies colors to the shapes based on various conditions. Maps supports three types of color mapping: range color mapping, equal color mapping and desaturation color mapping.
* [Legend](https://ej2.syncfusion.com/vue/documentation/maps/legend/?utm_source=npm&utm_campaign=vue-maps-npm): Summarizes the information from the layers, markers and bubbles.
* [Annotation](https://ej2.syncfusion.com/vue/documentation/maps/annotations/?utm_source=npm&utm_campaign=vue-maps-npm): Uses any custom HTML element as annotation and place it anywhere on the maps.
* [Selection and highlight](https://ej2.syncfusion.com/vue/documentation/maps/user-interactions/?utm_source=npm&utm_campaign=vue-maps-npm#selection): Supports selecting or highlighting shapes to bring center of attraction.
* [Zooming and panning](https://ej2.syncfusion.com/vue/documentation/maps/user-interactions/?utm_source=npm&utm_campaign=vue-maps-npm#zooming): Allows to zoom in, zoom out, and pan the map to show in-depth information.
* [Tooltip](https://ej2.syncfusion.com/vue/documentation/maps/user-interactions/?utm_source=npm&utm_campaign=vue-maps-npm#tooltip): Provides additonal information about the shapes on hover.
* [Print and Export](https://ej2.syncfusion.com/vue/documentation/maps/print/?utm_source=npm&utm_campaign=vue-maps-npm): Prints or exports the rendered maps to a desired format. Exporting supports four formats: PDF, PNG, JPEG and SVG.
* [Templates](https://ej2.syncfusion.com/vue/demos/?utm_source=npm&utm_campaign=vue-maps-npm#/material/maps/marker-template.html): Templates can be used to create custom user experiences in the Maps.
* [Globalization](https://ej2.syncfusion.com/vue/documentation/maps/internationalization/?utm_source=npm&utm_campaign=vue-maps-npm): Personalize the Maps component with different languages, as well as culture-specific number, date and time formatting.
* [Accessibility](https://ej2.syncfusion.com/vue/documentation/maps/accessibility/?utm_source=npm&utm_campaign=vue-maps-npm): Provides with built-in accessibility support which helps to access all the Maps component features through the keyboard, screen readers, or other assistive technology devices.

## Resources

* [Documentation](https://ej2.syncfusion.com/vue/documentation/maps/getting-started)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/vue?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/vue)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=vue&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/vue?utm_source=npm&utm_medium=listing&utm_campaign=vue-maps-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-vue-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/vue?utm_source=npm&utm_medium=listing&utm_campaign=vue-maps-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-vue-ui-components/blob/master/components/maps/CHANGELOG.md?utm_source=npm&utm_campaign=vue-maps-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [Vue UI components](https://www.syncfusion.com/vue-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-vue-ui-components/blob/master/license?utm_source=npm&utm_campaign=vue-maps-npm) for more info.

&copy; Copyright 2025 Syncfusion, Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio license and copyright applies to this distribution.