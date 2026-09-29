# Syncfusion® Blazor DataGrid

High-performance DataGrid for Blazor applications. Display, edit, and manage tabular data from IEnumerable, OData, or remote sources with built-in paging, sorting, filtering, grouping, and virtualization.

![Blazor DataGrid](https://raw.githubusercontent.com/SyncfusionExamples/nuget-img/master/blazor/blazor-datagrid.png)

## Key Features

- Fast rendering with virtualization and row/column virtualization
- Sorting, filtering, grouping, and searching capabilities
- Inline, batch, and dialog editing modes
- Template columns, column resizing, reordering, and freezing
- Excel and PDF export (requires additional Syncfusion export packages)
- Keyboard navigation, accessibility, and RTL support
- Responsive design with mobile touch optimization

## System Requirements

- .NET 8.0 or later (Blazor Server, Blazor Web App, Blazor WebAssembly, Blazor Hybrid)
- See full requirements: [System Requirements](https://blazor.syncfusion.com/documentation/system-requirements?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget)

## Installation

### .NET CLI

```bash
dotnet add package Syncfusion.Blazor.Grids
```

### NuGet Package Manager

```powershell
Install-Package Syncfusion.Blazor.Grids
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

2. Add the DataGrid component to your Razor page:

```razor
@using Syncfusion.Blazor.Grids

<SfGrid DataSource="@Orders" AllowPaging="true" AllowSorting="true" AllowFiltering="true">
    <GridColumns>
        <GridColumn Field="OrderID" HeaderText="Order ID" Width="120" TextAlign="TextAlign.Right"></GridColumn>
        <GridColumn Field="CustomerName" HeaderText="Customer Name" Width="150"></GridColumn>
        <GridColumn Field="OrderDate" HeaderText="Order Date" Width="130" Format="d" TextAlign="TextAlign.Right"></GridColumn>
        <GridColumn Field="Freight" HeaderText="Freight" Width="120" Format="C2" TextAlign="TextAlign.Right"></GridColumn>
    </GridColumns>
</SfGrid>

@code {
    private List<Order> Orders = new List<Order>
    {
        new Order { OrderID = 10248, CustomerName = "VINET", OrderDate = new DateTime(2023, 7, 4), Freight = 32.38 },
        new Order { OrderID = 10249, CustomerName = "TOMSP", OrderDate = new DateTime(2023, 7, 5), Freight = 11.61 },
        new Order { OrderID = 10250, CustomerName = "HANAR", OrderDate = new DateTime(2023, 7, 8), Freight = 65.83 }
    };

    public class Order
    {
        public int OrderID { get; set; }
        public string CustomerName { get; set; }
        public DateTime OrderDate { get; set; }
        public double Freight { get; set; }
    }
}
```

## Documentation

- [Getting Started with Blazor Web App](https://blazor.syncfusion.com/documentation/datagrid/getting-started-with-web-app?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget)
- [Getting Started with WebAssembly](https://blazor.syncfusion.com/documentation/datagrid/getting-started?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget)
- [API Reference](https://help.syncfusion.com/cr/blazor/Syncfusion.Blazor.Grids.SfGrid-1.html)
- [Live Demos](https://blazor.syncfusion.com/demos/datagrid/overview?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget)
- [Feature Overview](https://www.syncfusion.com/blazor-components/blazor-datagrid?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget)

## Support

- [Submit a support ticket](https://www.syncfusion.com/support/directtrac/incidents/newincident?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget)
- [Community forums](https://www.syncfusion.com/forums/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget)
- [Feature requests](https://www.syncfusion.com/feedback/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget)

## License

This is a commercial product and requires a paid license for possession or use. Review the [Syncfusion® EULA](https://www.syncfusion.com/eula/es/?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget).

- [Purchase a license](https://www.syncfusion.com/sales/products?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget)
- [Start a free 30-day trial](https://www.syncfusion.com/account/manage-trials/start-trials?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget)

## About Syncfusion®

Syncfusion® provides 1600+ UI components and frameworks for web, mobile, and desktop development across multiple platforms:

**Web:** [Blazor](https://www.syncfusion.com/blazor-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget) | [ASP.NET Core](https://www.syncfusion.com/aspnet-core-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget) | [ASP.NET MVC](https://www.syncfusion.com/aspnet-mvc-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget) | [JavaScript](https://www.syncfusion.com/javascript-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget) | [Angular](https://www.syncfusion.com/angular-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget) | [React](https://www.syncfusion.com/react-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget) | [Vue](https://www.syncfusion.com/vue-ui-components?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget)

**Mobile:** [Flutter](https://www.syncfusion.com/flutter-widgets?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget) | [MAUI](https://www.syncfusion.com/maui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget) | [UWP](https://www.syncfusion.com/uwp-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget)

**Desktop:** [WinForms](https://www.syncfusion.com/winforms-ui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget) | [WPF](https://www.syncfusion.com/wpf-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget) | [WinUI](https://www.syncfusion.com/winui-controls?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget)

Learn more at [www.syncfusion.com](https://www.syncfusion.com?utm_source=nuget&utm_medium=listing&utm_campaign=blazor-datagrid-nuget).

[sales@syncfusion.com](mailto:sales@syncfusion.com?Subject=Syncfusion%20Blazor%20-%20NuGet) | Toll Free: 1-888-9-DOTNET

