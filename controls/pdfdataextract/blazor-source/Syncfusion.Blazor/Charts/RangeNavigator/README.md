# Syncfusion&reg; Blazor Range Navigator Component

The Syncfusion&reg; [Blazor Range Navigator Component](https://www.syncfusion.com/blazor-components/blazor-range-selector?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget) enables interactive date/numeric range selection and visualization for filtering data in dashboards and charts. Ideal for financial applications, time-series analysis, and any scenario requiring temporal or value-based range filtering.

## Key Features

* **Interactive Range Selection** - Select custom date‑time or numeric ranges using intuitive draggable handles, enabling smooth filtering and zooming of large datasets.
**Seamless Chart Integration** - Connects effortlessly with Syncfusion Blazor Charts, allowing the selected range to dynamically filter and update chart data.
* **Multiple Axis Types** - Supports date‑time, numeric, and logarithmic axes to accommodate a wide variety of data visualization scenarios.
* **Built‑In Period Selector** - Choose from predefined intervals such as 1M, 3M, YTD, 1Y, and more for quick navigation and fast data exploration.
* **Snapping, Ticks & Labels** - Offers snapping behavior, customizable ticks, and axis labels for precise and user‑friendly range adjustments.
* **Customizable Appearance** - Style selected and unselected regions, adjust axis lines, modify label formats, and tailor the visual design to match your application theme.
* **Tooltip Support** - Displays contextual tooltips showing exact range values for clearer insights and improved usability.
* **Globalization & Localization** - Automatically adapts date and numeric formats based on culture settings and supports right‑to‑left (RTL) rendering.
* **High Performance** - Optimized to efficiently handle large datasets while maintaining smooth interactions and fast rendering.
* **Responsive Design** - Automatically adjusts layout and behavior to fit various screen sizes, offering a consistent experience across desktop and mobile.
* **Accessibility Support** - Includes keyboard navigation and screen‑reader support to meet accessibility standards.
* **Blazor Server & WebAssembly Support** - Works seamlessly across both Blazor Server and Blazor WebAssembly applications.

## System Requirements

* .NET 8.0 or later (Blazor Web App, Blazor Server, Blazor WebAssembly and Blazor Hybrid)
* See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget)

![Blazor Range Navigator](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-range-selector.png)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.RangeNavigator
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.RangeNavigator
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

2. Add the Blazor Range Navigator component in a Razor page:

```razor
@using Syncfusion.Blazor.Charts

<SfRangeNavigator ValueType="RangeValueType.DateTime" IntervalType="RangeIntervalType.Years" LabelFormat="yyyy">
    <RangeNavigatorSeriesCollection>
        <RangeNavigatorSeries DataSource="@StockDetails" XName="Date" Type="RangeNavigatorType.Area" YName="Close"></RangeNavigatorSeries>
    </RangeNavigatorSeriesCollection>
</SfRangeNavigator>

@code {
    public class StockPrice
    {
        public DateTime Date { get; set; }
        public double Close { get; set; }
    }

    public List<StockPrice> StockDetails = new List<StockPrice>
    {
        new StockPrice { Date = new DateTime(2005, 01, 01), Close = 21 },
        new StockPrice { Date = new DateTime(2006, 01, 01), Close = 24 },
        new StockPrice { Date = new DateTime(2007, 01, 01), Close = 36 },
        new StockPrice { Date = new DateTime(2008, 01, 01), Close = 38 },
        new StockPrice { Date = new DateTime(2009, 01, 01), Close = 54 },
        new StockPrice { Date = new DateTime(2010, 01, 01), Close = 57 },
        new StockPrice { Date = new DateTime(2011, 01, 01), Close = 62 }
    };
}
```

## Documentation

* [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/range-selector/getting-started-webapp?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget)
* [Getting Started with Blazor WebAssembly App](https://blazor.syncfusion.com/documentation/range-selector/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget)
* [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-range-selector?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Charts.SfRangeNavigator.html)
* [Live Demos](https://blazor.syncfusion.com/demos/range-selector/range-navigator?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget)

## Support

* [Support portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget)
* [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget)
* [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion&reg; EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget).

* [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget)
* [Start a 30-day free trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget)

## About Syncfusion&reg;

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web**: [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget)

**Mobile**: [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget)

**Desktop**: [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET