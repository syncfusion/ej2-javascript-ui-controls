# Angular Diagram Component

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

The [Angular Diagram](https://www.syncfusion.com/angular-components/angular-diagram?utm_source=npm&utm_medium=listing&utm_campaign=angular-diagram-npm) component is used for visualizing, creating, and editing interactive diagrams. It supports creating flowcharts, organizational charts, mind maps, floor plans, UML diagrams, and BPMN charts either through code or a visual interface.

<p align="center">
    <a href="https://ej2.syncfusion.com/angular/documentation/diagram/getting-started/?utm_source=npm&utm_medium=listing&utm_campaign=angular-diagram-npm">Getting started</a> . 
    <a href="https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_medium=listing&utm_campaign=angular-diagram-npm#/bootstrap5/diagram/default-functionalities">Online demos</a> . 
    <a href="https://www.syncfusion.com/angular-components/angular-diagram?utm_source=npm&utm_medium=listing&utm_campaign=angular-diagram-npm">Learn more</a>
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/angular/angular-diagram.png" alt="Angular Diagram Control"/>
</p>

<p align="center">
Trusted by the world's leading companies
  <a href="https://www.syncfusion.com">
    <img src="https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/syncfusion/syncfusion-trusted-companies.webp" alt="Bootstrap logo">
  </a>
</p>

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

### Adding Syncfusion Diagram package

All Syncfusion Angular packages are available in [npmjs.com](https://www.npmjs.com/~syncfusionorg). To install the Angular diagram package, use the following command.

```bash
ng add @syncfusion/ej2-angular-diagrams
```

The above command does the below configuration to your Angular app.
 
 * Adds `@syncfusion/ej2-angular-diagrams` package and its peer dependencies to your `package.json` file.
 * Imports the `DiagramModule` in your application module `app.module.ts`.
 * Registers the Syncfusion UI default theme (material) in the `angular.json` file.

This makes it easy to add the Syncfusion Angular Diagram module to your project and start using it in your application.

### Add Diagram component

In **src/app/app.component.ts**, use `<ejs-diagram>` selector in the `template` attribute of the `@Component` directive to render the Syncfusion Angular Diagram component.

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `<ejs-diagram #diagram id="diagram" width="100%" height="700px">
          <e-nodes>
            <e-node id="begin" [height]="40" [offsetX]="300" [offsetY]="80" [shape]="terminator">
              <e-node-annotations>
                <e-node-annotation content="Begin"> </e-node-annotation>
              </e-node-annotations>
            </e-node>
            <e-node id="process" [height]="80" [offsetX]="300" [offsetY]="160" [shape]="decision">
              <e-node-annotations>
                <e-node-annotation content="Process"> </e-node-annotation>
              </e-node-annotations>
            </e-node>
            <e-node id="end" [height]="40" [offsetX]="300" [offsetY]="240" [shape]="process">
              <e-node-annotations>
                <e-node-annotation content="End"> </e-node-annotation>
              </e-node-annotations>
            </e-node>
          </e-nodes>
          <e-connectors>
            <e-connector id="connector1" sourceID="begin" targetID="process">
            </e-connector>
            <e-connector id="connector2" sourceID="process" targetID="end">
            </e-connector>
          </e-connectors>
        </ejs-diagram>`
})
export class AppComponent implements OnInit { 
    public terminator: FlowShapeModel = { type: 'Flow', shape: 'Terminator' };
    public decision: FlowShapeModel = { type: 'Flow', shape: 'Decision' };
}
```

## Supported frameworks

Diagram component is also offered in the following list of frameworks.

| [<img src="https://ej2.syncfusion.com/github/images/js.svg" height="50" />](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | 
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Use case demos

* [Angular Diagram Builder demo](https://ej2.syncfusion.com/showcase/angular/diagrambuilder/)
* [Angular Organizational Chart demo](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/diagram/organization-chart)
* [Angular Mind Map demo](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/diagram/mind-map)
* [Angular BPMN Editor demo](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/diagram/bpmn-editor)
* [Angular Logic Circuit Diagram demo](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/diagram/logic-circuit)
* [Angular UML Activity Diagram demo](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/diagram/uml-activity)
* [Angular Network Diagram demo](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/diagram/network-diagram)
* [Angular UML Class Diagram demo](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/diagram/uml-Class-diagram)
* [Angular Venn Diagram demo](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/diagram/venn-diagram)
* [Angular Fishbone Diagram demo](https://ej2.syncfusion.com/angular/demos/#/bootstrap5/diagram/fishbone-diagram)

## Key features

* [Nodes](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=diagram#/material/diagram/nodes)  - Nodes are used to host graphical objects (path or controls) that can be arranged and manipulated on a diagram page. Many predefined standard shapes are included. Custom shapes can also be created and added easily.
* [Connectors](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=diagram#/material/diagram/connectors) - The relationship between two nodes is represented using a connector.
* [Labels](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=diagram#/material/diagram/annotations)- Labels are used to annotate nodes and connectors.
* [Ports](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=diagram#/material/diagram/ports) - Ports act as the connection points of the node and allows to create connections with only those specific points.
* [Interactive features](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=diagram#/material/diagram/drawing-tool) - Interactive features are used to improve the run time editing experience of a diagram.
* [Data binding](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=diagram#/material/diagram/local-data) - Generates diagram with nodes and connectors based on the information provided from an external data source.
* [Commands](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=diagram#/material/diagram/key-board-functions) - Supports a set of predefined commands that helps edit the diagram using keyboard. It is also possible to configure new commands and key combinations.
* [Automatic layout](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=diagram#/material/diagram/hierarchical-tree) - Automatic layouts are used to arrange nodes automatically based on a predefined layout logic. There is built-in support for organizational chart layout, hierarchical tree layout, symmetric layout, radial tree layout, and mind map layout.
* [Overview panel](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=diagram#/material/diagram/overview) -  The overview panel is used to improve navigation experience when exploring large diagrams.
* [SymbolPalettes](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=diagram#/material/diagram/symbol-palette) - The symbol palette is a gallery of reusable symbols and nodes that can be dragged and dropped on the surface of a diagram.
* [Rulers](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=diagram#/material/diagram/drawing-tool) - The ruler provides horizontal and vertical guides for measuring diagram objects in diagram component.
* [Serialization](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=diagram#/material/diagram/serialization) - When saved in JSON format a diagram’s state persists, and then it can be loaded back using serialization.
* [Exporting and Printing](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=diagram#/material/diagram/print-export) - Diagrams can be exported as .png, .jpeg, .bmp, and .svg image files, and can also be printed as documents.
* [Gridlines](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=diagram#/material/diagram/default-functionalities) - Gridlines are the pattern of lines drawn behind diagram elements. It provides a visual guidance while dragging or arranging the objects on a diagram surface.
* [Page layout](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=diagram#/material/diagram/print-export)- The drawing surface can be configured to page-like appearance using page size, orientation, and margins.
* [Context menu](https://ej2.syncfusion.com/angular/demos/?utm_source=npm&utm_campaign=diagram#/material/diagram/key-board-functions) - Frequently used commands can easily be mapped to the context menu.

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/angular-js2?utm_source=npm&utm_medium=listing&utm_campaign=angular-diagram-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-angular-ui-components/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/angular?utm_source=npm&utm_medium=listing&utm_campaign=angular-diagram-npm)
* Live chat

## Changelog

Check the changelog [here](https://github.com/syncfusion/ej2-angular-ui-components/blob/master/components/diagrams/CHANGELOG.md). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion’s licensed software, including this component, is subject to the terms and conditions of Syncfusion's [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 80+ [Angular UI components](https://www.syncfusion.com/angular-components), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A free community [license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2/blob/master/license?utm_source=npm&utm_campaign=diagram) for more info.

&copy; Copyright 2022 Syncfusion, Inc. All Rights Reserved. The Syncfusion Essential Studio license and copyright applies to this distribution.
