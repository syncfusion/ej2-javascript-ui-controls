# Syncfusion&reg; Blazor Linear Gauge Component

The [Blazor Linear Gauge Component](https://www.syncfusion.com/blazor-components/blazor-linear-gauge?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget) visualizes numeric values on a linear scale. It supports multiple axes, customizable ranges, pointers, labels, and annotations for creating thermometers, pressure gauges, rulers, and other measurement displays.

## Key Features

* **Multiple Axes Support** - Add and customize multiple parallel axes within a single gauge to create advanced layouts such as thermometers, rulers, or dual‑scale indicators.
* **Customizable Ranges** - Define multiple ranges with custom colors, gradients, widths, and positions to highlight specific value intervals or thresholds.
* **Versatile Pointer Types** - Use bar pointers to represent progress or filled values, or marker pointers (circle, diamond, triangle, custom icons) to indicate exact data points. Pointer styling options include size, color, and animation effects.
* **Labels, Ticks & Annotations** - Customize labels with prefixes, suffixes, font settings, and formatting. Configure major/minor ticks and add annotations (text, shapes, images) anywhere on the gauge for richer context.
* **Horizontal & Vertical Orientations** - Render the gauge in vertical or horizontal layout, making it adaptable for dashboards, compact UI spaces, and responsive interfaces.
* **Container Customization** - Choose from container styles such as rectangle, rounded rectangle, or thermometer, enabling highly tailored gauge visualizations.
* **Interactive Features** - Enable pointer dragging for dynamic value updates and tooltips for enhanced data interaction in real‑time scenarios.
* **Themes & Styling** - Supports built‑in themes such as Material, Bootstrap, Fluent, Tailwind, and Fabric, with full customization to match your application’s design system.
* **Export & Printing Options** - Export the gauge as an image or PDF, or output base64 strings for embedding in documents, reports, or custom UI.
* **Globalization & Accessibility** - Built‑in globalization for number formatting and full keyboard/screen‑reader accessibility compliance (WAI‑ARIA).
* **Blazor Server & WebAssembly Support** - Fully compatible with both Blazor Server and Blazor WebAssembly hosting models.

## System Requirements

- .NET 8.0 or later (Blazor Web App, Blazor Server, Blazor WebAssembly and Blazor Hybrid)
- See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget).

![Blazor Linear Gauge](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-linear-gauge.png)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.LinearGauge
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.LinearGauge
```

## Add Stylesheet and Script References

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

2. Add the Linear Gauge component in a Razor page:

```razor
@using Syncfusion.Blazor.LinearGauge

<SfLinearGauge>
    <LinearGaugeAxes>
        <LinearGaugeAxis Minimum="0" Maximum="100">
            <LinearGaugePointers>
                <LinearGaugePointer Value="40"></LinearGaugePointer>
            </LinearGaugePointers>
        </LinearGaugeAxis>
    </LinearGaugeAxes>
</SfLinearGauge>
```

## Documentation

- [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/linear-gauge/getting-started-webapp?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget)
- [Getting Started with Blazor WebAssembly App](https://blazor.syncfusion.com/documentation/linear-gauge/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget)
- [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-linear-gauge?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget)
- [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.LinearGauge.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget)
- [Live Demos](https://blazor.syncfusion.com/demos/linear-gauge/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget)
- [Video Tutorials](https://www.syncfusion.com/tutorial-videos/blazor/linear-gauge?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget)

## Support

- [Support portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget)
- [community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget)
- [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Syncfusion&reg; licensed software is subject to the terms and conditions of the [Syncfusion&reg; EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget).

- [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget)
- [Start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget)

## About Syncfusion&reg;

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-lineargauge-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET