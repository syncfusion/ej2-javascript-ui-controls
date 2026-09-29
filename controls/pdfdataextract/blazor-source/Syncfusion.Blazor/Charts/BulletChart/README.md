# Syncfusion&reg; Blazor Bullet Chart Component

The [Blazor Bullet Chart Component](https://www.syncfusion.com/blazor-components/blazor-bullet-chart?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget) is a lightweight charting component that compares performance measures against targets and displays them across multiple ranges. Ideal for KPI dashboards and performance evaluation scenarios.

## Key Features

* **Comparative Performance Visualization** – Visually compare performance metrics against target values
* **Multiple Ranges** – Display performance across multiple qualitative ranges (e.g., poor, satisfactory, good) with customizable colors and opacity
* **Multiple Scales** – Support for multiple scales and axes for detailed analysis
* **Data Labels** – Show actual values on the chart with customizable styling (color, font, opacity)
* **Tooltip Support** – Interactive tooltips to display detailed information on hover
* **Axis Customization** – Customize axis labels, ticks, and scale properties for enhanced readability
* **Flexible Orientation** – Support for both horizontal and vertical orientations
* **Customizable Appearance** – Extensive styling options including themes, colors, and dimensions
* **Responsive Design** – Adaptive layout that works seamlessly across different screen sizes and devices
* **Accessibility Compliant** – WCAG 2.2, Section 508, ADA compliant with keyboard navigation and screen reader support
* **Print Support** – Built-in print functionality (Ctrl + P)
* **Export Functionality** – Export charts to images and PDF formats
* **Built-in Themes** – Customizable themes and styling options
* **RTL Support** – Right-to-left rendering for internationalization

## System Requirements

* .NET 8.0 or later (Blazor Web App, Blazor Server, Blazor WebAssembly and Blazor Hybrid)
* See full requirements: [system requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget)

![Blazor BulletChart](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-bullet-chart.png)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.Charts
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.Charts
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

2. Add the Blazor BulletChart component in a Razor page:

```razor
<SfBulletChart DataSource="@BulletChartData" ValueField="FieldValue" TargetField="TargetValue" Minimum="0" Maximum="300" Interval="50" Title="Revenue">
    <BulletChartTooltip TValue="ChartData" Enable="true"></BulletChartTooltip>
    <BulletChartRangeCollection>
        <BulletChartRange End=150> </BulletChartRange>
        <BulletChartRange End=250></BulletChartRange>
        <BulletChartRange End=300></BulletChartRange>
    </BulletChartRangeCollection>
</SfBulletChart>

@code{
    public class ChartData
    {
        public double FieldValue { get; set; }
        public double TargetValue { get; set; }
    }
    public List<ChartData> BulletChartData = new List<ChartData>
    {
        new ChartData { FieldValue = 270, TargetValue = 250 }
    };
}
```

## Documentation

* [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/bullet-chart/getting-started-with-web-app?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget)
* [Getting Started with Blazor WASM App](https://blazor.syncfusion.com/documentation/bullet-chart/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Charts.SfBulletChart.html?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget)
* [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-bullet-chart?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget)
* [Live Demos](https://blazor.syncfusion.com/demos/bullet-chart/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget)

## Support

* [Support portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget)
* [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget)
* [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion&reg; EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget).

* [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget)
* [start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget).

## About Syncfusion&reg;

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-bullet-chart-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET