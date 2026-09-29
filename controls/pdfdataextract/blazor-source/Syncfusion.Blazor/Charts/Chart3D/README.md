# Syncfusion&reg; Blazor 3D Chart Component

The Syncfusion&reg; [Blazor 3D Chart Component](https://www.syncfusion.com/blazor-components/blazor-3d-charts?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget) enables interactive 3D data visualization in Blazor applications. Visualize complex relationships and trends with depth, enhancing data comprehension through immersive three-dimensional charting.

![3D Chart](https://ft.syncfusion.com/featuretour/essential-js2/images/3d-chart/javascript-3dchart-overview.png)

## Key Features

* **Multiple 3D Chart Types** - Supports six 3D chart types including Column, Bar, Stacked Column, Stacked Bar, 100% Stacked Column, and 100% Stacked Bar.
* **Flexible Data Binding** - Bind data from local collections or remote services (JSON, Web API, OData). Data labels and tooltips can also be bound directly to your data.
* **Rich Interactivity** - Interact with 3D charts using rotation, tilt, selection, highlighting, tooltips, and smooth animation effects.
* **Customizable Axes & Legends** - Supports category, numeric, date‑time, and logarithmic axes, multiple axes configurations, and highly configurable legends with paging and flexible positioning.
* **Data Labels & Templates** - Display data labels for clarity and enhance them with HTML‑based templates for rich visuals.
* **Responsive Design** - Automatically adapts to desktops, tablets, and mobile devices on any resolution and modern OS.
* **Built‑in Themes & Full Customization** - Comes with Material 3, Fluent, Tailwind, Bootstrap, Fabric, and more themes. Customize palettes, backgrounds, and layouts to match your brand.
* **Globalization & Localization** - Supports cultural formatting, RTL rendering, and localized number/date/currency formats.
* **Export & Print Options** - Export charts as PNG, JPEG, SVG, or PDF for sharing and reporting.
* **Accessibility Support** - WCAG‑aligned with keyboard navigation, screen reader support, and WAI‑ARIA compliance.
* **Blazor Server & WebAssembly Compatible** - Works seamlessly across both Blazor Server and Blazor WASM applications.

## System Requirements

* .NET 8.0 or later (Blazor Web App, Blazor Server, Blazor WebAssembly and Blazor Hybrid)
* See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.Chart3D
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.Chart3D
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

2. Add the Blazor 3D Chart component in a Razor page:

```razor
@using Syncfusion.Blazor.Chart3D

<SfChart3D Title="Sales Analysis">
    <Chart3DPrimaryXAxis ValueType="Syncfusion.Blazor.Chart3D.ValueType.Category"></Chart3DPrimaryXAxis>
    <Chart3DSeriesCollection>
        <Chart3DSeries DataSource="@Sales" XName="Month" YName="SalesValue" Type="Chart3DSeriesType.Column">
                <Chart3DDataLabel Visible="true"></Chart3DDataLabel>
        </Chart3DSeries>
    </Chart3DSeriesCollection>
</SfChart3D>

@code {
    public class SalesInfo
    {
        public string Month { get; set; }
        public double SalesValue { get; set; }
    }

    public List<SalesInfo> Sales = new List<SalesInfo>
    {
        new SalesInfo { Month = "Jan", SalesValue = 35 },
        new SalesInfo { Month = "Feb", SalesValue = 28 },
        new SalesInfo { Month = "Mar", SalesValue = 34 },
        new SalesInfo { Month = "Apr", SalesValue = 32 },
        new SalesInfo { Month = "May", SalesValue = 40 },
        new SalesInfo { Month = "Jun", SalesValue = 32 },
        new SalesInfo { Month = "Jul", SalesValue = 35 }
    };
}
```

## Documentation

* [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/3d-chart/getting-started-with-web-app?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget)
* [Getting Started with Blazor WebAssembly App](https://blazor.syncfusion.com/documentation/3d-chart/getting-started-wasm?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget)
* [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-3d-charts?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Chart3D.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget)
* [Live Demos](https://blazor.syncfusion.com/demos/chart-3d/column?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget)

## Support

* [Support portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget)
* [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget)
* [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion&reg; EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget).

* [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget)
* [Start a 30-day free trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget)

## About Syncfusion&reg;

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web**: [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget)

**Mobile**: [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget)

**Desktop**: [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-3d-charts-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET