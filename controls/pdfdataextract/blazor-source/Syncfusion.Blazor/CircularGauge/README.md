# Syncfusion® Blazor Circular Gauge

The Syncfusion® [Blazor Circular Gauge Component](https://www.syncfusion.com/blazor-components/blazor-circular-gauge?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget) visualizes numeric values on circular scales with fully customizable axes, pointers, and ranges. Perfect for speedometers, meter gauges, analog clocks, and any gauge-based visualization.

## Key Features

* **Multiple Axes & Ranges** – Support for multiple axes and configurable ranges
* **Customizable Pointers** – Different pointer styles and animations
* **Rounded Corners & Labels** – Styled ticks, labels, and corners
* **Template Support** – Rich template and child content support
* **Theme Support** – Bootstrap, Material, Fabric, and custom themes
* **Responsive Design** – Adapts seamlessly to all screen sizes
* **Real-Time Updates** – Support for dynamic value changes

## Supported platforms & System requirements

- .NET 8.0 or later (Blazor Server, Blazor Web App, Blazor WebAssembly, Blazor Hybrid)
- See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget)

![Blazor Circular Gauge](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-circular-gauge.png)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.CircularGauge
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.CircularGauge
```

## Add stylesheet and script references

* For Blazor Server App / Blazor Web App, add these to `Components/App.razor` or `App.razor`.
* For Blazor WebAssembly App, add these to `wwwroot/index.html`.

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

2. Add the Circular Gauge component in a Razor page:

```razor
<SfCircularGauge>
    <CircularGaugeAxes>
        <CircularGaugeAxis>
            <CircularGaugePointers>
                <CircularGaugePointer></CircularGaugePointer>
            </CircularGaugePointers>
        </CircularGaugeAxis>
    </CircularGaugeAxes>
</SfCircularGauge>
```

## Documentation

- [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/circular-gauge/getting-started-with-web-app?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget)
- [Getting Started with WebAssembly](https://blazor.syncfusion.com/documentation/circular-gauge/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget)
- [Feature Overview](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget)
- [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.CircularGauge.SfCircularGauge.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget)
- [Live Demos](https://blazor.syncfusion.com/demos/circular-gauge/default-functionalities?theme=fluent2?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget)

## Support

- [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget)
- [Support ticket](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget)
- [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget)

## License

This is a commercial product and requires a paid license for possession or use. See the [Syncfusion® EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget).

- [Purchase a license](https://www.syncfusion.com/sales/pricing?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget)
- [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget)

## About Syncfusion®

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-circulargauge-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET