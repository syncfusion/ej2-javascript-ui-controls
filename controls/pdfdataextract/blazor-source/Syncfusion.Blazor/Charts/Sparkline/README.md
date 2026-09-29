# Syncfusion&reg; Blazor Sparkline Charts

The Syncfusion [Blazor Sparkline Component](https://www.syncfusion.com/blazor-components/blazor-sparkline?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget) displays lightweight, single-series data visualizations in a compact cell or inline format. Perfect for dashboards and data summaries, sparklines show trends at a glance without axis labels or legends.

## Key Features

* **Multiple Sparkline Types** - Supports five sparkline types—line, area, column, win‑loss, and pie—to visualize trends in minimal space.
* **Compact Inline Visualization** - Designed to display data trends inside small cells, tables, dashboards, and tight UI layouts without requiring a full chart.
* **Extensive Customization** - Customize markers (first, last, high, low, negative), data labels, range bands, axis styles, colors, backgrounds, and borders for fine‑tuned visual output.
* **Interactive Tooltips & Track Lines** - Provide detailed insights with hover/tap tooltips and optional track lines for precise data identification.
* **Axis Configuration Options** - Configure numeric, category, or date axes with adjustable min/max values, custom styling, and positioning.
* **Responsive Design** - Automatically adapts to container size and works smoothly across desktops, tablets, and mobile devices.
* **Globalization & Localization** - Automatically formats numbers, dates, and times based on culture settings, with full right‑to‑left (RTL) language support.
* **Accessibility Support** - Compliant with accessibility standards, including keyboard navigation and screen reader support using WAI‑ARIA.
* **Dashboard‑Ready** - Ideal for KPIs, summaries, and trend snapshots where space is limited but insights matter.
* **Blazor Server & WebAssembly Compatible** - Fully supported in both hosting models and easy to integrate into any Blazor application.

## System Requirements

* .NET 8.0 or later (Blazor Web App, Blazor Server, Blazor WebAssembly and Blazor Hybrid)
* See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget)

![Blazor Sparkline Chart](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-sparkline-chart.png)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.Sparkline
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.Sparkline
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

2. Add the Blazor Sparkline component in a Razor page:

```razor
@using Syncfusion.Blazor.Charts

<SfSparkline DataSource="ClimateData"
             TValue="WeatherReport"
             XName="Month"
             YName="Celsius"
             ValueType="SparklineValueType.Category"
             Type="SparklineType.Area"
             Height="80px"
             Width="150px">
    <SparklineDataLabelSettings Visible="new List<VisibleType> { VisibleType.Start, VisibleType.End }"></SparklineDataLabelSettings>
    <SparklinePadding Left="10" Right="10"></SparklinePadding>
    <SparklineTooltipSettings TValue="WeatherReport" Visible="true"></SparklineTooltipSettings>
</SfSparkline>

@code {
    public class WeatherReport
    {
        public string Month { get; set; }
        public double Celsius { get; set; }
    };
    public List<WeatherReport> ClimateData = new List<WeatherReport> {
        new  WeatherReport { Month= "Jan", Celsius= 34 },
        new  WeatherReport { Month= "Feb", Celsius= 36 },
        new  WeatherReport { Month= "Mar", Celsius= 32 },
        new  WeatherReport { Month= "Apr", Celsius= 35 },
        new  WeatherReport { Month= "May", Celsius= 40 },
        new  WeatherReport { Month= "Jun", Celsius= 38 },
        new  WeatherReport { Month= "Jul", Celsius= 33 },
        new  WeatherReport { Month= "Aug", Celsius= 37 },
        new  WeatherReport { Month= "Sep", Celsius= 34 },
        new  WeatherReport { Month= "Oct", Celsius= 31 },
        new  WeatherReport { Month= "Nov", Celsius= 30 },
        new  WeatherReport { Month= "Dec", Celsius= 29}
    };
}
```

## Documentation

* [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/sparkline/getting-started-webapp?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget)
* [Getting Started with Blazor WebAssembly App](https://blazor.syncfusion.com/documentation/sparkline/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget)
* [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-sparkline?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Charts.SfSparkline.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget)
* [Live Demos](https://blazor.syncfusion.com/demos/sparkline/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget)
* [Video Tutorials](https://www.syncfusion.com/tutorial-videos/blazor/sparkline-chart?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget)

## Support

* [Support portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget)
* [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget)
* [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget)


## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion&reg; EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget).

* [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget)
* [Start a 30-day free trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget)

## About Syncfusion&reg;

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

- **Web**: [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget)

**Mobile**: [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget)

**Desktop**: [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-sparkline-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET