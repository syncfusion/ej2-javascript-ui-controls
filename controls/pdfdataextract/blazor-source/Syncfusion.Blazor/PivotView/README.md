# Syncfusion® Blazor Pivot Table

Powerful data analysis and visualization component for Blazor applications. Organize, summarize, and analyze large datasets with interactive pivoting, drilling, filtering, sorting, and export capabilities.

![Blazor Pivot Table](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-pivot-table.png)

## Key Features

- **Data Summarization**: Organize and summarize business data in cross-table format
- **Drill Down/Up**: Interactive hierarchical navigation through data dimensions
- **Filtering & Sorting**: Excel-like filtering and sorting with multiple criteria
- **Built-in Aggregations**: Sum, average, count, min, max, and custom aggregations
- **Calculated Fields**: Create custom calculated fields based on existing data
- **Excel & PDF Export**: Export pivot tables to Excel and PDF formats
- **Virtualization**: Handle large datasets efficiently with row and column virtualization
- **Field List**: Interactive field list for dynamic dimension and measure configuration
- **Editing**: In-place editing with real-time data updates

## System Requirements

- .NET 8.0 or later (Blazor Server, Blazor Web App, Blazor WebAssembly, Blazor Hybrid)
- See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.PivotTable
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.PivotTable
```

## Add Stylesheet and Script References

For **Blazor Web App / Blazor Server**, add these to `Components/App.razor` or `App.razor`. For **Blazor WebAssembly**, add these to `wwwroot/index.html`:

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

2. Add the Pivot Table component to your Razor page:

```razor
@using Syncfusion.Blazor.PivotView

<SfPivotView TValue="ProductSalesData">
    <PivotViewDataSourceSettings DataSource="@Data">
        <PivotViewColumns>
            <PivotViewColumn Name="Year"></PivotViewColumn>
        </PivotViewColumns>
        <PivotViewRows>
            <PivotViewRow Name="Country"></PivotViewRow>
        </PivotViewRows>
        <PivotViewValues>
            <PivotViewValue Name="Sold" Type="SummaryTypes.Sum"></PivotViewValue>
        </PivotViewValues>
    </PivotViewDataSourceSettings>
</SfPivotView>

@code {
    private List<ProductSalesData> Data { get; set; }

    protected override void OnInitialized()
    {
        Data = new List<ProductSalesData>
        {
            new ProductSalesData { Country = "Canada", Year = "2024", Sold = 400 },
            new ProductSalesData { Country = "France", Year = "2024", Sold = 375 },
            new ProductSalesData { Country = "China", Year = "2024", Sold = 588 },
            new ProductSalesData { Country = "Canada", Year = "2025", Sold = 461 },
            new ProductSalesData { Country = "France", Year = "2025", Sold = 226 }
        };
    }

    public class ProductSalesData
    {
        public string Country { get; set; }
        public string Year { get; set; }
        public double Sold { get; set; }
    }
}
```

## Documentation

- [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/pivot-table/getting-started-webapp?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget)
- [Getting Started with WebAssembly](https://blazor.syncfusion.com/documentation/pivot-table/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget)
- [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.PivotView.SfPivotView-1.html)
- [Live Demos](https://blazor.syncfusion.com/demos/pivot-table/overview?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget)
- [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-pivot-table?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget)

## Support

- [Submit a support ticket](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget)
- [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget)
- [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion® EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget).

- [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget)
- [Start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget)

## About Syncfusion®

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-pivottable-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET