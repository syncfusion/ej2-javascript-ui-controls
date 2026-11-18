[![coverage](http://ej2.syncfusion.com/badges/ej2-office-chart/coverage.svg)](http://ej2.syncfusion.com/badges/ej2-office-chart)

# JavaScript Office Chart Library

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
> The setup detects your project's platform and loads the appropriate Syncfusion skill pack. No Syncfusion account or MCP key is required to install or read Syncfusion agent skills.
>
> **Platform reference:** [https://ai.syncfusion.com/javascript/llms.txt](https://ai.syncfusion.com/javascript/llms.txt)

The **JavaScript Office Chart** library is an Office-compatible chart rendering and management engine that parses, renders, and manages Excel-like / Office-like charts in any JavaScript or TypeScript application. It provides chart management, ribbon integration, data parsing, theme coordination, and overlay interaction for Office-style workflows, and can be seamlessly hosted in controls like the [JavaScript Spreadsheet](https://www.syncfusion.com/javascript-ui-controls/js-spreadsheet?utm_source=npm&utm_medium=listing&utm_campaign=javascript-office-chart-npm) or used standalone.

## Setup

To install the Office Chart library, use the following command.

```sh
npm install @syncfusion/ej2-office-chart
```

`@syncfusion/ej2-base`, `@syncfusion/ej2-charts`, and `@syncfusion/ej2-ribbon` are runtime dependencies and are resolved automatically.

## Supported frameworks

The Office Chart library works wherever JavaScript or TypeScript runs. It is consumed across the following framework wrappers.

| [<img src="https://ej2.syncfusion.com/github/images/angular-new.svg" height="50" />](https://www.syncfusion.com/angular-ui-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Angular](https://www.syncfusion.com/angular-ui-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/react.svg"  height="50" />](https://www.syncfusion.com/react-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React](https://www.syncfusion.com/react-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/vue.svg" height="50" />](https://www.syncfusion.com/vue-components?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Vue](https://www.syncfusion.com/vue-components?utm_medium=listing&utm_source=github)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netcore.svg" height="50" />](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; | [<img src="https://ej2.syncfusion.com/github/images/netmvc.svg" height="50" />](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)<br/>&nbsp;&nbsp;[ASP.NET&nbsp;MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_medium=listing&utm_source=github)&nbsp;&nbsp; |
| :-----: | :-----: | :-----: | :-----: | :-----: |

## Key features

* **Office Chart Types**: Supports standard Office chart types including Column, Bar, Line, Area, Pie, Doughnut, Scatter, Bubble, Radar, and Combo charts.
* **Unified Chart Manager**: Centralized management through `ChartManager` for registering, rendering, tracking, and updating multiple charts across active sheets or documents.
* **Chart Ribbon Integration**: Built-in `ChartRibbon` component providing Office-like Chart Design and Format ribbon tabs with dropdown palettes, chart type galleries, and element customizations.
* **Dynamic Chart Elements**: Add or modify chart elements such as Chart Titles, Data Labels, Legends, Axes, Gridlines, and Trendlines on the fly.
* **Row/Column Switching**: Instantly switch data series from rows to columns and vice versa.
* **Host & Overlay Adapters**: Built-in `OverlayService` for standalone drag/resize/interaction or seamless bridging with host controls like Spreadsheet via `registerChart` and `setActiveChart`.

## Getting started

The following snippets cover initializing `ChartManager`, rendering a chart, and wiring the ribbon.

### Standalone initialization

```ts
import { ChartManager } from '@syncfusion/ej2-office-chart';


const container = document.getElementById('chart-container');
const manager = new ChartManager({ container: container });

// 1. Create from Office OpenXML chart JSON (Word / PowerPoint / XLSX I/O)
const openXmlChart = manager.createChart(openXmlJsonData, container);

// 2. Or create from Spreadsheet ChartModel with series and dataSource
const spreadsheetChart = manager.createChart({
    id: 'chart_1',
    type: 'Column',
    theme: 'Office',
    series: [{ name: 'Sales', xName: 'quarter', yName: 'revenue' }],
    dataSource: [
        { quarter: 'Q1', revenue: 25000 },
        { quarter: 'Q2', revenue: 32000 },
        { quarter: 'Q3', revenue: 28000 },
        { quarter: 'Q4', revenue: 41000 }
    ]
}, container, { isSpreadsheet: true });

// Clean up when finished
manager.destroy();
```

### ChartRibbon Integration

```ts
import { ChartRibbon, ChartManager, IChartRibbonActions } from '@syncfusion/ej2-office-chart';

const manager = new ChartManager({ container: document.getElementById('chart-container') });


// Define ribbon actions to route to ChartManager
const ribbonActions: IChartRibbonActions = {
    onSwitchRowColumn: () => {
        manager.onRibbonAction('switchRowColumn');
    },
    onThemeSelect: (theme) => {
        manager.onRibbonAction('theme', theme);
    },
    onChartTypeSelect: (type, isChart, eleId) => {
        manager.onRibbonAction('chartType', type);
    },
    onAddChartElement: (elementId, value) => {
        manager.onRibbonAction(elementId, value);
    }
};

// Instantiate ChartRibbon
const ribbon = new ChartRibbon(
    manager,          // ChartManager instance
    spreadsheetHost,  // Host component instance (optional)
    false,            // isRibbon: false for Tab/Toolbar (Spreadsheet), true for EJ2 Ribbon
    undefined,        // createElementFn (optional)
    false,            // enableRtl
    ribbonActions     // Action callbacks
);

// Directly update chart properties programmatically via ChartManager
manager.updateChartOptions({ action: 'theme', theme: 'Fabric' });
manager.updateChartOptions({ action: 'dataLabels', dataLabelPosition: 'InsideEnd' });
```
### Overlay Integration & Adapters

The Office Chart package provides dual overlay support: standalone applications can use the built-in `OverlayService` with `IOverlayHost`, while host components (like Spreadsheet) can preserve their own native overlay and wire into `ChartManager` through adapter methods. Both approaches are fully supported side-by-side.

#### Standalone Host (`OverlayService` & `IOverlayHost`)

For standalone web applications or document containers (Document Editor, Presentation), use `OverlayService` with an `IOverlayHost` adapter:

```ts
import { OverlayService, DefaultOverlayHost, ChartManager } from '@syncfusion/ej2-office-chart';

const container = document.getElementById('editor-container');
const host = new DefaultOverlayHost(container);
const manager = new ChartManager();

// Create OverlayService with host and wire adapters
const overlayService = new OverlayService(host);
overlayService.setAdapters(manager, ribbon);
manager.setOverlayService(overlayService);

// Insert an interactive overlay element
overlayService.insertOverlayElement('chart_1_overlay', '100px', '50px', '400px', '300px');
```

#### Component Host (`ChartManager` Overlay Adapters)

```ts
import { ChartManager } from '@syncfusion/ej2-office-chart';

const manager = new ChartManager();

// Overlay adapter methods routing host overlay events to ChartManager
const overlayAdapter = {
    onSelect: (overlayId: string) => {
        manager.onOverlayAction('select', overlayId);
    },
    onDeselect: () => {
        manager.onOverlayAction('deselect');
    },
    onResizeProgress: (overlayId: string, width: number, height: number) => {
        manager.onOverlayAction('resizeProgress', overlayId, { width, height });
    },
    onResizeComplete: (overlayId: string, width: number, height: number) => {
        manager.onOverlayAction('resize', overlayId, { width, height });
    },
    onMoveComplete: (overlayId: string, top: number, left: number) => {
        manager.onOverlayAction('move', overlayId, { top, left });
    }
};


// 1. Register externally rendered chart in the host overlay element
manager.registerChart(chartModel.id, chartModel, chartInstance, overlayElement);

// 2. Wire overlay event listeners using adapter methods
overlayElement.addEventListener('click', () => {
    overlayAdapter.onSelect(chartModel.id);
});

// 3. Unregister on chart deletion
manager.unregisterChart(chartModel.id);
```

## Resources

* [What's New](https://www.syncfusion.com/products/whatsnew/essential-js2?utm_medium=listing&utm_source=github)
* [Road Map](https://www.syncfusion.com/products/roadmap/essential-js2?utm_medium=listing&utm_source=github)
* [Documentation](https://ej2.syncfusion.com/documentation/)
* [E-Books](https://www.syncfusion.com/ebooks?tag=javascript&utm_medium=listing&utm_source=github)
* [Source code (GitHub)](https://github.com/syncfusion/ej2-javascript-ui-controls?utm_source=npm&utm_medium=listing&utm_campaign=javascript-office-chart-npm)

## Support

Product support is available through the following mediums.

* [Support ticket](https://support.syncfusion.com/support/tickets/create) - Guaranteed Response in 24 hours | Unlimited tickets | Holiday support
* [Community forum](https://www.syncfusion.com/forums/essential-js2?utm_source=npm&utm_medium=listing&utm_campaign=javascript-office-chart-npm)
* [GitHub issues](https://github.com/syncfusion/ej2-javascript-ui-controls/issues/new)
* [Request feature or report bug](https://www.syncfusion.com/feedback/javascript?utm_source=npm&utm_medium=listing&utm_campaign=javascript-office-chart-npm)
* Live chat

## Changelog

Check the changelog [here](https://help.syncfusion.com/document-processing/release-notes). Get minor improvements and bug fixes every week to stay up to date with frequent updates.

## License and copyright

> This is a commercial product and requires a paid license for possession or use. Syncfusion® licensed software, including this library, is subject to the terms and conditions of Syncfusion® [EULA](https://www.syncfusion.com/eula/es/). To acquire a license for 140+ [JavaScript UI controls](https://www.syncfusion.com/javascript-ui-controls), you can [purchase](https://www.syncfusion.com/sales/products) or [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials).

> A [free community license](https://www.syncfusion.com/products/communitylicense) is also available for companies and individuals whose organizations have less than $1 million USD in annual gross revenue and five or fewer developers.

See [LICENSE FILE](https://github.com/syncfusion/ej2-javascript-ui-controls/blob/master/license?utm_source=npm&utm_medium=listing&utm_campaign=javascript-office-chart-npm) for more info.

© Copyright 2026 Syncfusion<sup>®</sup> Inc. All Rights Reserved. The Syncfusion<sup>®</sup> Essential Studio<sup>®</sup> license and copyright applies to this distribution.