# React Diagram Component

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

The [React Diagram](https://www.syncfusion.com/react-components/react-diagram?utm_source=npm&utm_medium=listing&utm_campaign=react-diagram-npm) component is used for visualizing, creating, and editing interactive diagrams. It supports creating flowcharts, organizational charts, mind maps, floor plans, UML diagrams, and BPMN charts either through code or a visual interface.

<p align="center">
    <a href="https://ej2.syncfusion.com/react/documentation/diagram/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=react-diagram-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/react/demos/?utm_source=npm&utm_medium=listing&utm_campaign=react-diagram-npm#/bootstrap5/diagram/default-functionality">Online demos</a> . 
    <a href="https://www.syncfusion.com/react-components/react-diagram?utm_source=npm&utm_medium=listing&utm_campaign=react-diagram-npm">Learn more</a>
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/react/react-diagram.png" alt="React Diagram Control"/>
</p>

<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/syncfusion/syncfusion-trusted-companies.webp" alt="Bootstrap logo">
  </a>
</p>

## Setup

### Create a React Application

You can use [`create-react-app`](https://github.com/facebookincubator/create-react-app) to setup applications. To create React app use the following command.

```bash
npx create-react-app my-app --template typescript
cd my-app
npm start
```

### Adding Syncfusion Diagram package

All Syncfusion react packages are published in the [npmjs.com](https://www.npmjs.com/~syncfusionorg) registry. To install the react diagram package, use the following command.

```bash
npm install @syncfusion/ej2-react-diagrams --save
```

### Adding CSS references for Diagram

Add CSS references needed for a Diagram in **src/App.css** from the **../node_modules/@syncfusion** package folder.

```css
@import "../node_modules/@syncfusion/ej2-diagrams/styles/material.css";
@import "../node_modules/@syncfusion/ej2-react-diagrams/styles/material.css";
@import "../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../node_modules/@syncfusion/ej2-popups/styles/material.css";
@import "../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
@import "../node_modules/@syncfusion/ej2-navigations/styles/material.css";
```

### Add Diagram Component

In the **src/App.tsx** file, use the following code snippet to render the Syncfusion React Diagram control and import **App.css** to apply styles to the diagram:

```typescript
import { ConnectorModel, DiagramComponent, NodeModel } from "@syncfusion/ej2-react-diagrams";
import * as React from 'react';
import './App.css';

//Initializes the nodes for the diagram
let nodes: NodeModel[] = [
  {
    id: "begin",
    height: 60,
    offsetX: 300,
    offsetY: 80,
    shape: { type: "Flow", shape: "Terminator" },
    annotations: [
      {
        content: "Begin"
      }
    ]
  },
  {
    id: "process",
    height: 60,
    offsetX: 300,
    offsetY: 160,
    shape: { type: "Flow", shape: "Decision" },
    annotations: [
      {
        content: "Process"
      }
    ]
  },
  {
    id: "end",
    height: 60,
    offsetX: 300,
    offsetY: 240,
    shape: { type: "Flow", shape: "Process" },
    annotations: [
      {
        content: "End"
      }
    ]
  },
];
//Initializes the connector for the diagram
let connectors: ConnectorModel[] = [
  { id: "connector1", sourceID: "begin", targetID: "process" },
  { id: "connector2", sourceID: "process", targetID: "end" },
];

function App() {
    return <DiagramComponent id="container" width={"100%"} height={"350px"} nodes={nodes} connectors={connectors}></DiagramComponent>
};
export default App;
```

## Supported frameworks

Diagram component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg"  height="50" />](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-components/?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Use case demos

* [React Diagram Builder demo](https://ej2.syncfusion.com/showcase/react/diagrambuilder/)
* [React Organizational Chart demo](https://ej2.syncfusion.com/react/demos/#/bootstrap5/diagram/organization-model)
* [React Mind Map demo](https://ej2.syncfusion.com/react/demos/#/bootstrap5/diagram/mind-map)
* [React BPMN Editor demo](https://ej2.syncfusion.com/react/demos/#/bootstrap5/diagram/bpmn-editor)
* [React Logic Circuit Diagram demo](https://ej2.syncfusion.com/react/demos/#/bootstrap5/diagram/logic-circuit)
* [React UML Activity Diagram demo](https://ej2.syncfusion.com/react/demos/#/bootstrap5/diagram/activity)
* [React Network Diagram demo](https://ej2.syncfusion.com/react/demos/#/bootstrap5/diagram/network-diagram)
* [React UML Class Diagram demo](https://ej2.syncfusion.com/react/demos/#/bootstrap5/diagram/activity-class)
* [React Venn Diagram demo](https://ej2.syncfusion.com/react/demos/#/bootstrap5/diagram/venn-diagram)
* [React Fishbone Diagram demo](https://ej2.syncfusion.com/react/demos/#/bootstrap5/diagram/fishbone-diagram)

## Key features

* [Nodes](https://ej2.syncfusion.com/react/demos/#/material/diagram/getting-started-node)  - Nodes are used to host graphical objects (path or controls) that can be arranged and manipulated on a diagram page. Many predefined standard shapes are included. Custom shapes can also be created and added easily.
* [Connectors](https://ej2.syncfusion.com/react/demos/#/material/diagram/connector) - The relationship between two nodes is represented using a connector.
* [Labels](https://ej2.syncfusion.com/react/demos/#/material/diagram/getting-started-annotation) - Labels are used to annotate nodes and connectors.
* [Ports](https://ej2.syncfusion.com/react/demos/#/material/diagram/port) - Ports act as the connection points of the node and allows to create connections with only those specific points.
* [Interactive features](https://ej2.syncfusion.com/react/demos/#/material/diagram/drawing-tool) - Interactive features are used to improve the run time editing experience of a diagram.
* [Data binding](https://ej2.syncfusion.com/react/demos/#/material/diagram/local-data) - Generates diagram with nodes and connectors based on the information provided from an external data source.
* [Commands](https://ej2.syncfusion.com/react/demos/#/material/diagram/key-board-functions) - Supports a set of predefined commands that helps edit the diagram using keyboard. It is also possible to configure new commands and key combinations.
* [Automatic layout](https://ej2.syncfusion.com/react/demos/#/material/diagram/hierarchical-model) - Automatic layouts are used to arrange nodes automatically based on a predefined layout logic. There is built-in support for organizational chart layout, hierarchical tree layout, symmetric layout, radial tree layout, and mind map layout.
* [Overview panel](https://ej2.syncfusion.com/react/demos/#/material/diagram/overview) -  The overview panel is used to improve navigation experience when exploring large diagrams.
* [SymbolPalettes](https://ej2.syncfusion.com/react/demos/#/material/diagram/symbol-palette) - The symbol palette is a gallery of reusable symbols and nodes that can be dragged and dropped on the surface of a diagram.
* [Rulers](https://ej2.syncfusion.com/react/demos/#/material/diagram/drawing-tool) - The ruler provides horizontal and vertical guides for measuring diagram objects in diagram component.
* [Serialization](https://ej2.syncfusion.com/react/demos/#/material/diagram/serialization) - When saved in JSON format a diagram’s state persists, and then it can be loaded back using serialization.
* [Exporting and Printing](https://ej2.syncfusion.com/react/demos/#/material/diagram/print-export) - Diagrams can be exported as .png, .jpeg, .bmp, and .svg image files, and can also be printed as documents.
* [Gridlines](https://ej2.syncfusion.com/react/demos/#/material/diagram/default-functionalities) - Gridlines are the pattern of lines drawn behind diagram elements. It provides a visual guidance while dragging or arranging the objects on a diagram surface.
* [Page layout](https://ej2.syncfusion.com/react/demos/#/material/diagram/print-export)- The drawing surface can be configured to page-like appearance using page size, orientation, and margins.
* [Context menu](https://ej2.syncfusion.com/react/demos/#/material/diagram/key-board-functions) - Frequently used commands can easily be mapped to the context menu.

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/react-js2?utm_source=npm&utm_medium=listing&utm_campaign=react-diagram-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-react-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/react?utm_source=npm&utm_medium=listing&utm_campaign=react-diagram-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-react-ui-components/blob/master/components/diagrams/CHANGELOG.md). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 80+ [React UI components](https://www.syncfusion.com/react-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2/blob/master/license?utm_source=npm&utm_campaign=diagram) for more info.

&copy; Copyright 2022 Syncfusion, Inc. All Rights Reserved. The Syncfusion Essential Studio license and copyright applies to this distribution.
