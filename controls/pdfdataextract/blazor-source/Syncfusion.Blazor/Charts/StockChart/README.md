# Syncfusion&reg; Blazor Stock Chart Component

The [Blazor Stock Chart Component](https://www.syncfusion.com/blazor-components/blazor-stock-chart?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget) is a comprehensive financial charting solution for Blazor applications. It enables interactive visualization of stock prices and time-series data using candlestick, OHLC, and other chart types, with built-in support for zooming, panning, technical indicators, and real-time data binding.

## Key Features

* **Multiple Financial Chart Types** - Visualize market data using candlestick, OHLC (Open‑High‑Low‑Close), HiLo, line, and bar‑style charts, with support for multiple series.
* **Range Selector & Period Selector** - Interactively select and zoom into specific time periods using built‑in range and period selection tools for time‑based data navigation.
* **Technical Indicators & Trendlines** - Analyze market movement with built‑in indicators such as EMA, SMA, MACD, RSI, Stochastic, Momentum, ATR, and Bollinger Bands, plus multiple trendline options for forecasting.
* **Rich Interactive Features** - Enhance data exploration with smooth zooming, panning, crosshair, trackball, tooltips, and the ability to toggle series visibility.
* **Data Binding & Real‑Time Updates** - Connect to local or remote data sources including Web APIs, OData, and Entity Framework, enabling real‑time updates and efficient data handling.
* **Stock Events Visualization** - Mark important market events (e.g., highs, lows, opens, closes, quarter/annual transitions) directly on the chart for better historical interpretation.
* **Highly Customizable UI** - Customize axes, themes (Fluent, Tailwind, Bootstrap, Material, Fabric, etc.), gridlines, legends, series styles, and more to match your app’s design.
* **Exporting & Sharing Options** - Export stock charts into image formats or document formats such as Excel, CSV, PDF, and more for reporting and analysis.
* **Responsive Design** - Optimized for desktops, tablets, and mobile devices, automatically adapting to various resolutions and container sizes.
* **Globalization, Localization & Accessibility** - Supports cultural formats (currency, dates, numbers), RTL languages, full keyboard navigation, screen readers, and WAI‑ARIA compliance.

## System Requirements

* .NET 8.0 or later (Blazor Web App, Blazor Server, Blazor WebAssembly and Blazor Hybrid)
* See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget)

![Blazor Stock Chart](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-stock-chart.png)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.StockChart
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.StockChart
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

2. Add the Blazor Stock Chart component in a Razor page:

```razor
<SfStockChart Title="AAPL Historical">
    <StockChartSeriesCollection>
        <StockChartSeries DataSource="@StockDetails" Type="Syncfusion.Blazor.Charts.ChartSeriesType.Candle" XName="Date" YName="Close" High="High" Low="Low" Open="Open" Close="Close" Volume="Volume"></StockChartSeries>
    </StockChartSeriesCollection>
</SfStockChart>

@code {
    public class ChartData
    {
        public DateTime Date { get; set; }
        public Double Open { get; set; }
        public Double Low { get; set; }
        public Double Close { get; set; }
        public Double High { get; set; }
        public Double Volume { get; set; }
    }

    public List<ChartData> StockDetails = new List<ChartData>
    {
        new ChartData { Date = new DateTime(2012, 04, 02), Open= 85.9757, High = 90.6657,Low = 85.7685, Close = 90.5257,Volume = 660187068},
        new ChartData { Date = new DateTime(2012, 04, 09), Open= 89.4471, High = 92,Low = 86.2157, Close = 86.4614,Volume = 912634864},
        new ChartData { Date = new DateTime(2012, 04, 16), Open= 87.1514, High = 88.6071,Low = 81.4885, Close = 81.8543,Volume = 1221746066},
        new ChartData { Date = new DateTime(2012, 04, 23), Open= 81.5157, High = 88.2857,Low = 79.2857, Close = 86.1428,Volume = 965935749},
        new ChartData { Date = new DateTime(2012, 04, 30), Open= 85.4, High =  85.4857,Low = 80.7385, Close = 80.75,Volume = 615249365},
        new ChartData { Date = new DateTime(2012, 05, 07), Open= 80.2143, High = 82.2685,Low = 79.8185, Close = 80.9585,Volume = 541742692},
        new ChartData { Date = new DateTime(2012, 05, 14), Open= 80.3671, High = 81.0728,Low = 74.5971, Close = 75.7685,Volume = 708126233},
        new ChartData { Date = new DateTime(2012, 05, 21), Open= 76.3571, High = 82.3571,Low = 76.2928, Close = 80.3271,Volume = 682076215},
        new ChartData { Date = new DateTime(2012, 05, 28), Open= 81.5571, High = 83.0714,Low = 80.0743, Close = 80.1414,Volume = 480059584}
   };
}
```

## Documentation

* [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/stock-chart/getting-started-webapp?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget)
* [Getting Started with Blazor WebAssembly App](https://blazor.syncfusion.com/documentation/stock-chart/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget)
* [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-stock-chart?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-range-selector-nuget)
* [Live Demos](https://blazor.syncfusion.com/demos/stock-chart/stock-chart?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget)
* [Video Tutorials](https://www.syncfusion.com/tutorial-videos/blazor/stock-chart?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget)
* [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Charts.SfStockChart.html)

## Support

* [Support portal](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget)
* [community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget)
* [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion&reg; EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget).

* [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget)
* [Start a 30-day free trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget).

## About Syncfusion&reg;

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

- **Web**: [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget)

**Mobile**: [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget)

**Desktop**: [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-stock-chart-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET