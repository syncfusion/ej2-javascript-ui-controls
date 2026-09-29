# Syncfusion® Blazor Charts

High-performance charting component with 30+ chart types for data visualization in Blazor applications. Render large datasets quickly with extensive interactivity and customization options.

![Blazor Charts](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-charts.png)

## Key Features

- **50+ Chart Types**: Line, Area, Column, Bar, Spline, Scatter, Bubble, Pie, Donut, Pyramid, Funnel, Polar, Radar, and more
- **Cartesian**: Line, Spline, Area, Step, Column, Bar, Stacked/100%, Range, Scatter, Bubble
- **Polar/Radar Charts**: Line, Area, Column, Range
- **Accumulation Charts**: Pie, Donut, Pyramid, Funnel
- **Stacked & Range Charts**: Stacked variants (100%), Range Area, Range Column
- **Financial Charts**: Candlestick, OHLC, HiLo for stock market data
- **Special Charts**: Box and Whisker, Histogram, Waterfall, Pareto, and Stacked variants.
- **Interactive Features**: Crosshair, trackball, zooming, panning, tooltip, selection
- **High Performance**: Lazy loading and efficient rendering of large datasets
- **Customization**: Template support, legend customization, axis formatting
- **Responsive & Mobile-friendly**: Touch gestures and adaptive layouts
- **Multiple Themes**: Built-in and custom styling options

## System Requirements

- .NET 8.0 or later (Blazor Server, Blazor Web App, Blazor WebAssembly, Blazor Hybrid)
- See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.Charts
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.Charts
```

## Add Stylesheet and Script References

For **Blazor Web App / Blazor Server**, add these to `Components/App.razor` or `App.razor`.
For **Blazor WebAssembly**, add these to `wwwroot/index.html`.

```html
<link href="_content/Syncfusion.Blazor.Themes/bootstrap5.css" rel="stylesheet" />
<script src="_content/Syncfusion.Blazor.Core/scripts/syncfusion-blazor.min.js" type="text/javascript"></script>
```

## Quick Start

1. Register the Syncfusion® Blazor service in `Program.cs`:

```csharp
using Syncfusion.Blazor;

builder.Services.AddSyncfusionBlazor();
```

2. Add a chart to your Razor page:

```razor
@using Syncfusion.Blazor.Charts

<SfChart Title="Monthly Sales">
    <ChartPrimaryXAxis ValueType="Syncfusion.Blazor.Charts.ValueType.Category">
        <ChartAxisMajorGridLines Width="0"></ChartAxisMajorGridLines>
    </ChartPrimaryXAxis>
    <ChartSeriesCollection>
        <ChartSeries DataSource="@SalesData" XName="Month" YName="Sales" Type="ChartSeriesType.Column">
        </ChartSeries>
    </ChartSeriesCollection>
</SfChart>

@code {
    public class SalesData
    {
        public string Month { get; set; }
        public double Sales { get; set; }
    }

    private List<SalesData> SalesData = new List<SalesData>
    {
        new SalesData { Month = "Jan", Sales = 35 },
        new SalesData { Month = "Feb", Sales = 28 },
        new SalesData { Month = "Mar", Sales = 34 },
        new SalesData { Month = "Apr", Sales = 32 },
        new SalesData { Month = "May", Sales = 40 }
    };
}
```

## Documentation

- [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/chart/getting-started-with-web-app?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget)
- [Getting Started with Blazor Server](https://blazor.syncfusion.com/documentation/chart/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget)
- [Getting Started with WebAssembly](https://blazor.syncfusion.com/documentation/chart/getting-started-wasm?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget)
- [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Charts.SfChart.html)
- [Live Demos](https://blazor.syncfusion.com/demos/chart/line?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget)
- [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-charts?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget)

## Support

- [Submit a support ticket](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget)
- [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget)
- [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion® EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget).

- [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget)
- [Start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget)

## About Syncfusion®

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET