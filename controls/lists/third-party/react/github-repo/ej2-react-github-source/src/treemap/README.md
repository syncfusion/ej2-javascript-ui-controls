# React TreeMap Component

The [React TreeMap](https://www.syncfusion.com/react-components/react-treemap?utm_source=npm&utm_medium=listing&utm_campaign=react-treemap-npm) component provides a simple and effective way to visualize flat or hierarchical data as clustered rectangles with a specific, weighted attribute determining the size of each rectangle.

<p align="center">
    <a href="https://ej2.syncfusion.com/react/documentation/treemap/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=react-treemap-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-treemap-npm#/bootstrap5/treemap/default">Online demos</a> . 
    <a href="https://www.syncfusion.com/react-components/react-treemap?utm_source=npm&utm_medium=listing&utm_campaign=react-treemap-npm">Learn more</a>
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/react/react-treemap.png" alt="React TreeMap Component">
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

### Add Syncfusion<sup>®</sup> TreeMap package

All Syncfusion<sup>®</sup> React packages are published in the [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install the React TreeMap package, use the following command.

```sh
npm install @syncfusion/ej2-react-treemap --save
```

### Add TreeMap Component

In the **src/App.tsx** file, use the following code snippet to render the Syncfusion<sup>®</sup> React TreeMap component.

```typescript
import { React } from 'react';
import { TreeMapComponent } from '@syncfusion/ej2-react-treemap';
function App() {
    let data: any = [
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
   return (<TreeMapComponent height='350px' dataSource={data} weightValuePath='Count'
     leafItemSettings={{ labelPath: 'State' }}></TreeMapComponent>);
}
export default App;
```

## Supported frameworks

TreeMap component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg"  height="50" />](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Showcase samples

* Olympic medal categories details - [Live Demo](https://ej2.syncfusion.com/react/demos/#/material/treemap/customization)
* Countries population details - [Live Demo](https://ej2.syncfusion.com/react/demos/#/material/treemap/drilldown)
* Fitness Tracker - [Source](https://github.com/SyncfusionExamples/showcase-react-health-tracker-dashboard-demo), [Live Demo](https://ej2.syncfusion.com/showcase/react/fitness-tracker-app/)

## Key features

* [Data sources](https://ej2.syncfusion.com/react/documentation/treemap/data-binding/?utm_source=npm&utm_campaign=react-treemap-npm): Binds the treemap component with an array of JSON objects or DataManager. Both hierarchical and flat collection data sources are supported.
* [Levels](https://ej2.syncfusion.com/react/documentation/treemap/levels/?utm_source=npm&utm_campaign=react-treemap-npm): Renders with any number of levels and items.
* [Layout](https://ej2.syncfusion.com/react/documentation/treemap/layout/?utm_source=npm&utm_campaign=react-treemap-npm): Supports four types of layouts: square, horizontal, vertical, and auto.
* [Drill-down](https://ej2.syncfusion.com/react/documentation/treemap/drilldown/?utm_source=npm&utm_campaign=react-treemap-npm): Provides drill-down option to have a closer look at the lower level of a hierarchy.
* [Data label](https://ej2.syncfusion.com/react/documentation/treemap/data-label/?utm_source=npm&utm_campaign=react-treemap-npm): Provides additional information about the nodes.
* [Header template](https://ej2.syncfusion.com/react/documentation/treemap/levels/?utm_source=npm&utm_campaign=react-treemap-npm#header-template-and-position): Uses any custom HTML element to customize the header of each item.
* [Label template](https://ej2.syncfusion.com/react/documentation/treemap/data-label/?utm_source=npm&utm_campaign=react-treemap-npm#template): Uses any custom HTML element to customize the data label for each node.
* [Color mapping](https://ej2.syncfusion.com/react/documentation/treemap/color-mapping/?utm_source=npm&utm_campaign=react-treemap-npm): Applies colors to the nodes based on various conditions. Treemap supports three types of color mapping: range, equal, and desaturation.
* [Legend](https://ej2.syncfusion.com/react/documentation/treemap/legend/?utm_source=npm&utm_campaign=react-treemap-npm): Provide useful information for conveying what the treemap showcases. 
* [Selection and highlight](https://ej2.syncfusion.com/react/documentation/treemap/selection-and-highlight/?utm_source=npm&utm_campaign=react-treemap-npm): Support selecting or highlighting the nodes to bring center of attraction.
* [Tooltip](https://ej2.syncfusion.com/react/documentation/treemap/tooltip/?utm_source=npm&utm_campaign=react-treemap-npm): Provides additional information about the node on hover.
* [Print and Export](https://ej2.syncfusion.com/react/documentation/treemap/print-and-export/?utm_source=npm&utm_campaign=react-treemap-npm): Prints or exports the rendered treemap to a desired format. Exporting supports four formats: PDF, PNG, JPEG and SVG.
* [Globalization](https://ej2.syncfusion.com/react/documentation/treemap/internationalization/?utm_source=npm&utm_medium=listing&utm_campaign=react-treemap-npm): Personalize the treemap component with different languages, as well as culture-specific number, date and time formatting.
* [Accessibility](https://ej2.syncfusion.com/react/documentation/treemap/accessibility/?utm_source=npm&utm_medium=listing&utm_campaign=react-treemap-npm): Provides with built-in accessibility support which helps to access all the treemap component features through the keyboard, screen readers, or other assistive technology devices.

## Resources

* [Documentation](https://ej2.syncfusion.com/react/documentation/treemap/getting-started)
* [AI Coding Assistant](https://ej2.syncfusion.com/react/documentation/ai-coding-assistants/overview)
* [Theme Studio](https://ej2.syncfusion.com/themestudio/)
* [What's New](https://www.syncfusion.com/products/whatsnew/react?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/react)
* [E-Books](https://www.syncfusion.com/succinctly-free-ebooks?searchkey=angular&type=all)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/react-js2?utm_source=npm&utm_medium=listing&utm_campaign=react-treemap-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-react-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/react?utm_source=npm&utm_medium=listing&utm_campaign=react-treemap-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-react-ui-components/blob/master/components/treemap/CHANGELOG.md?utm_source=npm&utm_campaign=react-treemap-npm). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [React UI components](https://www.syncfusion.com/react-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-react-ui-components/blob/master/license?utm_source=npm&utm_campaign=react-treemap-npm) for more info.

&copy; Copyright 2025 Syncfusion, Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio license and copyright applies to this distribution.