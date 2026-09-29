# Syncfusion® Blazor Chart Wizard

The Syncfusion® Blazor Chart Wizard is an interactive chart creation and customization component for Blazor applications. It helps users map data fields, configure series, control chart appearance, and preview updates in real time.

![Blazor Chart Wizard](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-chartwizard.gif)

## Key Features

- **Interactive chart building**: Configure chart type, category fields, and series fields with immediate visual feedback.
- **Data binding support**: Bind to `IEnumerable<T>` collections, including `List<T>` and `ObservableCollection<T>`.
- **Single and multi-series charts**: Render one or more series from the same data source.
- **Flexible field mapping**: Map one or more category fields and numeric series fields from your data model.
- **Multiple chart types**: Support for common chart types such as column, bar, line, area, pie, and more.
- **Real-time preview**: Reflect chart changes as users update settings in the wizard.
- **Property panel support**: Provide an interactive editor experience for chart configuration.
- **Export-ready workflow**: Prepare chart output for export scenarios supported by the component.
- **Responsive and Blazor-friendly**: Built for Web App, Server, and WebAssembly applications.

## System Requirements

- .NET 8.0 or later
- Blazor Web App, Blazor Server, or Blazor WebAssembly
- See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.ChartWizard
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.ChartWizard
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

2. Add the Chart Wizard to your Razor page and bind data fields:

```razor
@using Syncfusion.Blazor.ChartWizard

<SfChartWizard Width="800" Height="450" Theme="Syncfusion.Blazor.Theme.Bootstrap5" PropertyPanelExpanded="true">
	<ChartSettings DataSource="@SalesData"
				   CategoryFields="@categories"
				   SeriesFields="@chartSeries"
				   SeriesType="ChartWizardSeriesType.Column">
	</ChartSettings>
</SfChartWizard>

@code {

    private List<string> categories = new() { "Month" };
    private List<string> chartSeries = new() { "Sales" };

	public class SalesInfo
	{
		public string Month { get; set; }
		public double Sales { get; set; }
	}

	private List<SalesInfo> SalesData = new()
	{
		new SalesInfo { Month = "Jan", Sales = 35 },
		new SalesInfo { Month = "Feb", Sales = 28 },
		new SalesInfo { Month = "Mar", Sales = 34 },
		new SalesInfo { Month = "Apr", Sales = 32 },
		new SalesInfo { Month = "May", Sales = 40 }
	};
}
```

### Working with data

The Chart Wizard uses `ChartSettings` to configure data binding:

- `DataSource` supplies the collection of data objects.
- `CategoryFields` identifies the field or fields used for category values.
- `SeriesFields` identifies the numeric fields used to create chart series.
- `SeriesType` selects the chart type for rendering.

For multi-series charts, provide multiple values in `SeriesFields`. For example, a single category with multiple series can be bound using fields such as `Gold`, `Silver`, and `Bronze`.

`ObservableCollection<T>` is also supported for dynamic data scenarios where the chart should update as items are added, removed, or modified.

## Documentation

- [Getting Started with Blazor Chart Wizard in Web App](https://blazor.syncfusion.com/documentation/chart-wizard/getting-started-with-web-app?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget)
- [Getting Started with Blazor Server](https://blazor.syncfusion.com/documentation/chart-wizard/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-charts-nuget)
- [Getting Started with Blazor Chart Wizard in WASM App](https://blazor.syncfusion.com/documentation/chart-wizard/getting-started-with-wasm?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget)
- [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.ChartWizard.html)
- [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-chart-wizard?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget)
- [Live Demos](https://blazor.syncfusion.com/demos/chart-wizard/default-functionalities?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget)

## Support

- [Submit a support ticket](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget)
- [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget)
- [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion® EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget).

- [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget)
- [Start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget)

## About Syncfusion®

Syncfusion® provides 1800+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget) | [Xamarin](https://www.syncfusion.com/xamarin-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-chart-wizard-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET