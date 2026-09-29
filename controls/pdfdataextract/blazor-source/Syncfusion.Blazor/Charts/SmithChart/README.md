# Syncfusion&reg; Blazor Smith Chart Component

The Syncfusion&reg; [Blazor Smith Chart Component](https://www.syncfusion.com/blazor-components/blazor-smith-chart?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget) visualizes complex impedance and transmission line parameters used in RF engineering and high-frequency circuit analysis. Provides interactive impedance mapping, markers, legends, and customizable series for electrical network analysis.

## Key Features

* **Impedance & Admittance Visualization** - Plot and analyze high‑frequency circuit parameters such as impedance, admittance, and reflection coefficients with support for both impedance and admittance rendering types.
* **Customizable Axes & Gridlines** - Includes a horizontal resistance axis and radial reactance axis, both fully customizable. Add major and minor gridlines and style them to improve clarity and match your application’s theme.
* **Interactive Markers & Data Labels** - Highlight specific data points using markers with customizable shapes, sizes, borders, and opacity. Data labels can be added, styled, positioned, and automatically arranged to prevent overlap.
* **Legends & Tooltips** - Built‑in legends with fully configurable position, layout, border, and text options. Enable tooltips to show detailed point information with support for custom templates.
* **Series Customization** - Plot multiple series in a single chart and customize each with unique colors, widths, opacity settings, and animations for improved visual clarity.
* **Titles & Annotations** - Add chart titles and subtitles with alignment, styling, trimming, and max‑width support for a polished presentation.
* **Export & Print Support** - Export the Smith Chart to PNG, JPEG, SVG, or PDF formats, with orientation options to suit reporting and documentation needs.
* **Responsive Layout** - Fully responsive design that automatically adapts to different screen sizes across desktops, tablets, and mobile devices.
* **Accessibility & Globalization** - Keyboard‑friendly, screen‑reader compatible, WAI‑ARIA compliant, and supports right‑to‑left (RTL) languages for global audiences.

## System Requirements

* .NET 8.0 or later (Blazor Web App, Blazor Server, Blazor WebAssembly and Blazor Hybrid)
* See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget)

![Blazor Smith Chart](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-smith-chart.png)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.SmithChart
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.SmithChart
```

## Add Script References

* For **Blazor Server App / Blazor Web App**, add these to `Components/App.razor` or `App.razor`.
* For **Blazor WebAssembly App**: add these to `wwwroot/index.html`.

```html
<script src="_content/Syncfusion.Blazor.Core/scripts/syncfusion-blazor.min.js" type="text/javascript"></script>
```

## Quick Start

1. Register the Syncfusion® Blazor services in `Program.cs`:

```csharp
using Syncfusion.Blazor;

builder.Services.AddSyncfusionBlazor();
```

2. Add the Blazor Smith Chart component in a Razor page:

```razor
<SfSmithChart>
    <SmithChartSeriesCollection>
        <SmithChartSeries Name="Transmission1"
                          Reactance="Reactance"
                          Resistance="Resistance"
                          DataSource="@FirstTransmissionSeries">
        </SmithChartSeries>
        <SmithChartSeries Name="Transmission2"
                          Points="@SecondTransmissionSeries">
        </SmithChartSeries>
    </SmithChartSeriesCollection>
</SfSmithChart>

@code {
    public class SmithDataSource
    {
        public double Resistance { get; set; }
        public double Reactance { get; set; }
    };
    public List<SmithDataSource> FirstTransmissionSeries = new List<SmithDataSource> {
        new SmithDataSource { Resistance= 10, Reactance= 25 },
        new SmithDataSource { Resistance= 8, Reactance= 6 },
        new SmithDataSource { Resistance= 6, Reactance= 4.5 },
        new SmithDataSource { Resistance= 4.5, Reactance= 2 },
        new SmithDataSource { Resistance= 3.5, Reactance= 1.6 },
        new SmithDataSource { Resistance= 2.5, Reactance= 1.3 },
        new SmithDataSource { Resistance= 2, Reactance= 1.2 },
        new SmithDataSource { Resistance= 1.5, Reactance= 1 },
        new SmithDataSource { Resistance= 1, Reactance= 0.8 },
        new SmithDataSource { Resistance= 0.5, Reactance= 0.4 },
        new SmithDataSource { Resistance= 0.3, Reactance= 0.2 },
        new SmithDataSource { Resistance= 0.001, Reactance= 0.15 }
    };
    public List<SmithChartPoint> SecondTransmissionSeries = new List<SmithChartPoint> {
        new SmithChartPoint { Resistance= 20, Reactance= -50 },
        new SmithChartPoint { Resistance= 10, Reactance= -10 },
        new SmithChartPoint { Resistance= 9, Reactance= -4.5 },
        new SmithChartPoint { Resistance= 8, Reactance= -3.5 },
        new SmithChartPoint { Resistance= 7, Reactance= -2.5 },
        new SmithChartPoint { Resistance= 6, Reactance= -1.5 },
        new SmithChartPoint { Resistance= 5, Reactance= -1 },
        new SmithChartPoint { Resistance= 4.5, Reactance= -0.5 },
        new SmithChartPoint { Resistance= 2, Reactance= 0.5 },
        new SmithChartPoint { Resistance= 1.5, Reactance= 0.4 },
        new SmithChartPoint { Resistance= 1, Reactance= 0.4 },
        new SmithChartPoint { Resistance= 0.5, Reactance= 0.2 },
        new SmithChartPoint { Resistance= 0.3, Reactance= 0.1 },
        new SmithChartPoint { Resistance= 0.001, Reactance= 0.05 }
    };
}
```

## Documentation

* [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/smith-chart/getting-started-webapp?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget)
* [Getting Started with Blazor WebAssembly App](https://blazor.syncfusion.com/documentation/smith-chart/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget)
* [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-smith-chart?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Charts.SfSmithChart.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget)
* [Live Demos](https://blazor.syncfusion.com/demos/smith-chart/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget)
* [Video Tutorials](https://www.syncfusion.com/tutorial-videos/blazor/smith-chart?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget)

## Support

* [Support portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget)
* [Community Fforums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget)
* [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion&reg; EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget).

* [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget)**
* [Start a 30-day free trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget)**

## About Syncfusion&reg;

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web**: [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget)

**Mobile**: [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget)

**Desktop**: [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-smith-chart-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET