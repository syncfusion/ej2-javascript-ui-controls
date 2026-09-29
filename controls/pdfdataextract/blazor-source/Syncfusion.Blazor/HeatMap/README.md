# Syncfusion&reg; Blazor HeatMap Component

A comprehensive [Blazor HeatMap Xomponent](https://www.syncfusion.com/blazor-components/blazor-heatmap-chart?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget) for visualizing two-dimensional data with color-coded cells. Display matrix-based data with gradient or solid color variations, interactive tooltips, legends, and custom styling using SVG or canvas rendering.

## Key Features

* **Matrix Data Visualization** - Render large two‑dimensional datasets using color‑coded cells for quick pattern and trend recognition.
* **Flexible Color Mapping** - Apply gradient or solid color palettes, customize color ranges, and define palette‑based thresholds for meaningful data representation.
* **Rich Cell Interaction** - Enable cell hover effects, selection behaviors, and custom event handling to create highly interactive data exploration experiences.
* **Legends & Tooltips** - Use built‑in legends for data range interpretation and tooltips for detailed value insights when hovering over HeatMap cells.
* **Multiple Rendering Modes** - Render using SVG or Canvas, ensuring optimal visual quality and performance depending on dataset size and device capabilities.
* **Advanced Axis Support** - Supports numeric, category, and date‑time axes with customization options like rotation, intervals, opposed position, and inversed axis layout.
* **Specialized HeatMap Types** - Includes Bubble HeatMap (size‑based markers), Calendar HeatMap (time‑series visualization), and sector‑based HeatMaps for richer data expression.
* **Data Binding Options** - Bind data from arrays, JSON, cell‑based data collections, or table formats using powerful adaptor support.
* **Full Customization** - Customize cell shape, labels, gridlines, palettes, axis styles, and overall layout to match your application’s design requirements.
* **Responsive & High‑Performance Rendering** - Designed for large datasets with optimized memory usage and smooth rendering across desktops, tablets, and mobile devices.
* **Accessibility & Localization** - Includes ARIA attributes, keyboard navigation, and right‑to‑left (RTL) support, along with cultural formatting for global applications.
* **Blazor Server & WebAssembly Support** - Fully compatible with Blazor Server and Blazor WebAssembly project types.

## System Requirements

- .NET 8.0 or later (Blazor Web App, Blazor Server, Blazor WebAssembly and Blazor Hybrid)
- See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget).

![Blazor HeatMap Chart](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-heatmap-chart.png)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.HeatMap
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.HeatMap
```

## Add stylesheet and script references

* For **Blazor Server App / Blazor Web App**, add these to `Components/App.razor` or `App.razor`.
* For **Blazor WebAssembly App**: add these to `wwwroot/index.html`.

```html
<link href="_content/Syncfusion.Blazor.Themes/bootstrap5.css" rel="stylesheet" />
<script src="_content/Syncfusion.Blazor.Core/scripts/syncfusion-blazor.min.js" type="text/javascript"></script>
```

## Quick Start

1. Register the Syncfusion® Blazor services in `Program.cs`:

```csharp
using Syncfusion.Blazor;

builder.Services.AddSyncfusionBlazor();
```

2. Add the HeatMap component in a Razor page:

```razor
<SfHeatMap DataSource="@HeatMapData">
    <HeatMapTitleSettings Text="Sales Revenue per Employee (in 1000 US$)"></HeatMapTitleSettings>
    <HeatMapCellSettings ShowLabel="true" TileType="CellType.Rect"></HeatMapCellSettings>
</SfHeatMap>

@code{
    int[,] GetDefaultData()
    {
        int[,] dataSource = new int[,]
        {
            {52, 65, 67, 45, 37, 52},
            {68, 52, 63, 51, 30, 51},
            {7, 16, 47, 47, 88, 6},
            {66, 64, 46, 40, 47, 41},
            {14, 46, 97, 69, 69, 3},
            {54, 46, 61, 46, 40, 39}
        };
        return dataSource;
    }
    public object HeatMapData { get; set; }
    protected override void OnInitialized()
    {
        HeatMapData = GetDefaultData();
    }
}
```

## Documentation

- [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/heatmap-chart/getting-started-with-web-app?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget)
- [Getting Started with Blazor WebAssembly App](https://blazor.syncfusion.com/documentation/heatmap-chart/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget)
- [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-heatmap-chart?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget)
- [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.HeatMap.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget)
- [Live Demos](https://blazor.syncfusion.com/demos/heatmap-chart/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget)

## Support

- [Support portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget)
- [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget)
- [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget)

## License

This is a commercial product and requires a valid license for production use. Syncfusion&reg; licensed software is subject to the terms and conditions of the [Syncfusion&reg; EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget).

- [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget)
- [Start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget)

## About Syncfusion&reg;

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-heatmap-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET