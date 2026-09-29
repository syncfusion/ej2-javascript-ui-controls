# React Maps Component

The [React Maps](https://www.syncfusion.com/react-components/react-maps-library?utm_source=npm&utm_medium=listing&utm_campaign=react-maps-npm) component is used to visualize geographical data and represent statistical data of a specific geographical area on earth with user interactivity, and it provides a wide range of customization options.

<p align="center">
    <a href="https://ej2.syncfusion.com/react/documentation/maps/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=react-maps-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-maps-npm#/bootstrap5/maps/default">Online demos</a> . 
    <a href="https://www.syncfusion.com/react-components/react-maps-library?utm_source=npm&utm_medium=listing&utm_campaign=react-maps-npm">Learn more</a>
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/react/react-map.png" alt="React Maps Component">
</p>

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
> **Platform reference:** [https://ai.syncfusion.com/react/llms.txt](https://ai.syncfusion.com/react/llms.txt)

## Setup

### Create a React Application

You can use [`create-react-app`](https://github.com/facebookincubator/create-react-app) to setup applications. To create React app, use the following command.

```bash
npx create-react-app my-app --template typescript
cd my-app
npm start
```

### Add Syncfusion<sup>®</sup> Maps package

All Syncfusion<sup>®</sup> React packages are published in the [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install the React Maps package, use the following command.

```sh
npm install @syncfusion/ej2-react-maps --save
```

### Add Maps Component

In the **src/App.tsx** file, use the following code snippet to render the Syncfusion<sup>®</sup> React Maps component.

```typescript
import React from 'react';
import { MapsComponent, LayersDirective, LayerDirective } from '@syncfusion/ej2-react-maps';
import { world_map } from 'world-map.ts';

function App() {
   return (
        <MapsComponent id="maps">
            <LayersDirective>
                <LayerDirective shapeData={world_map}></LayerDirective>
            </LayersDirective>
        </MapsComponent>
    );
}

export default App;
```

## Supported frameworks

Maps component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg"  height="50" />](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Heat map - [Live Demo](https://ej2.syncfusion.com/react/demos/#/material/maps/heatmap)
* Flight routes - [Live Demo](https://ej2.syncfusion.com/react/demos/#/material/maps/curved)
* Bus seat booking - [Live Demo](https://ej2.syncfusion.com/react/demos/#/material/maps/seat-booking)

## Key features

* [Data sources](https://ej2.syncfusion.com/react/documentation/maps/populate-data/?utm_source=npm&utm_campaign=react-maps-npm): Binds the maps control to an array of JSON objects containing GeoJSON data.
* [Map providers](https://ej2.syncfusion.com/react/documentation/maps/providers/other-maps/?utm_source=npm&utm_campaign=react-maps-npm): Online map providers such as OpenStreetMap, Bing Maps and others can also be rendered.
* [Layer](https://ej2.syncfusion.com/react/documentation/maps/layers/?utm_source=npm&utm_campaign=react-maps-npm): Layer represents the area which renders the map. Also, any number of layers can be added.
* [Projection](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_campaign=react-maps-npm#/material/maps/projection): Maps can be rendered in eight different types of projections.
* [Drill-down](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_campaign=react-maps-npm#/material/maps/drilldown): Provides drill-down option to have a closer look at the lower level of a hierarchy.
* [Marker](https://ej2.syncfusion.com/react/documentation/maps/markers/?utm_source=npm&utm_campaign=react-maps-npm): Provides support to mark a specific place of interest in the map.
* [Data label](https://ej2.syncfusion.com/react/documentation/maps/data-label/?utm_source=npm&utm_campaign=react-maps-npm): Provides additional information about the shapes in the form of text over the shapes.
* [Bubble](https://ej2.syncfusion.com/react/documentation/maps/bubble/?utm_source=npm&utm_campaign=react-maps-npm): Represents visually the underlying data values of the shapes.
* [Navigation line](https://ej2.syncfusion.com/react/documentation/maps/navigation-line/?utm_source=npm&utm_campaign=react-maps-npm): Denotes the path between two locations.
* [Color mapping](https://ej2.syncfusion.com/react/documentation/maps/color-mapping/?utm_source=npm&utm_campaign=react-maps-npm): Applies colors to the shapes based on various conditions. Maps supports three types of color mapping: range color mapping, equal color mapping and desaturation color mapping.
* [Legend](https://ej2.syncfusion.com/react/documentation/maps/legend/?utm_source=npm&utm_campaign=react-maps-npm): Summarizes the information from the layers, markers and bubbles.
* [Annotation](https://ej2.syncfusion.com/react/documentation/maps/annotations/?utm_source=npm&utm_campaign=react-maps-npm): Uses any custom HTML element as annotation and place it anywhere on the maps.
* [Selection and highlight](https://ej2.syncfusion.com/react/documentation/maps/user-interactions/?utm_source=npm&utm_campaign=react-maps-npm#selection): Supports selecting or highlighting shapes to bring center of attraction.
* [Zooming and panning](https://ej2.syncfusion.com/react/documentation/maps/user-interactions/?utm_source=npm&utm_campaign=react-maps-npm#zooming): Allows to zoom in, zoom out, and pan the map to show in-depth information.
* [Tooltip](https://ej2.syncfusion.com/react/documentation/maps/user-interactions/?utm_source=npm&utm_campaign=react-maps-npm#tooltip): Provides additonal information about the shapes on hover.
* [Print and Export](https://ej2.syncfusion.com/react/documentation/maps/print/?utm_source=npm&utm_campaign=react-maps-npm): Prints or exports the rendered maps to a desired format. Exporting supports four formats: PDF, PNG, JPEG and SVG.
* [Templates](https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_campaign=react-maps-npm#/material/maps/marker-template): Templates can be used to create custom user experiences in the Maps.
* [Globalization](https://ej2.syncfusion.com/react/documentation/maps/internationalization/?utm_source=npm&utm_campaign=react-maps-npm): Personalize the Maps component with different languages, as well as culture-specific number, date and time formatting.
* [Accessibility](https://ej2.syncfusion.com/react/documentation/maps/accessibility/?utm_source=npm&utm_campaign=react-maps-npm): Provides with built-in accessibility support which helps to access all the Maps component features through the keyboard, screen readers, or other assistive technology devices.

## Resources

* [Documentation](https://ej2.syncfusion.com/react/documentation/maps/getting-started)
* [AI Coding Assistant](https://ej2.syncfusion.com/react/documentation/ai-coding-assistants/overview)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/react?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/react)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=react&type=all)


## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/react-js2?utm_source=npm&utm_medium=listing&utm_campaign=react-maps-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-react-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/react?utm_source=npm&utm_medium=listing&utm_campaign=react-maps-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-react-ui-components/blob/master/components/maps/CHANGELOG.md?utm_source=npm&utm_campaign=maps). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [React UI components](https://www.syncfusion.com/react-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-react-ui-components/blob/master/components/maps/license?utm_source=npm&utm_campaign=maps) for more info.

&copy; Copyright 2025 Syncfusion, Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio license and copyright applies to this distribution.